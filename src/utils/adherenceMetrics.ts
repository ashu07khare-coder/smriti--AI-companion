import { Reminder, DailyAdherenceLog, ReminderAdherenceMetrics } from '../types';

/**
 * Parses a reminder time string like "9:30 AM", "11:30 AM", "09:30", "17:00",
 * or an ISO scheduled_time into a concrete Date object for a given base date.
 */
export function parseReminderTimeToDate(timeStr: string, baseDate: Date = new Date()): Date {
  const result = new Date(baseDate.getTime());
  
  if (!timeStr) {
    result.setHours(9, 0, 0, 0);
    return result;
  }

  // Check if it's already an ISO string
  if (timeStr.includes('T') || timeStr.includes('-')) {
    const parsed = new Date(timeStr);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  // Parse "9:30 AM", "11:30 AM", "5:00 PM", "8:45 PM", "14:30"
  const cleanStr = timeStr.trim().toUpperCase();
  const isPM = cleanStr.includes('PM');
  const isAM = cleanStr.includes('AM');
  const numPart = cleanStr.replace(/[^0-9:]/g, '');
  const [hoursStr, minutesStr] = numPart.split(':');

  let hours = parseInt(hoursStr || '9', 10);
  const minutes = parseInt(minutesStr || '0', 10);

  if (isPM && hours < 12) {
    hours += 12;
  } else if (isAM && hours === 12) {
    hours = 0;
  }

  result.setHours(hours, minutes, 0, 0);
  return result;
}

/**
 * Evaluates the timeliness status of a reminder against a grace window (default ±30 mins).
 */
export function evaluateReminderTimeliness(
  reminder: Reminder,
  now: Date = new Date(),
  graceWindowMinutes: number = 30
): {
  status: 'on_time' | 'late' | 'missed' | 'pending';
  delayMinutes: number;
  scheduledDate: Date;
  completedDate: Date | null;
} {
  const scheduledDate = parseReminderTimeToDate(reminder.time || '09:00 AM', now);
  const completedDate = reminder.completedAt ? new Date(reminder.completedAt) : null;

  if (reminder.completed) {
    if (!completedDate) {
      // Completed, but no timestamp recorded (e.g. legacy toggle)
      return {
        status: 'on_time',
        delayMinutes: 0,
        scheduledDate,
        completedDate: null,
      };
    }

    // Difference in minutes between actual completion and scheduled time
    const diffMinutes = Math.round((completedDate.getTime() - scheduledDate.getTime()) / (60 * 1000));

    // Grace window: ±graceWindowMinutes
    if (diffMinutes <= graceWindowMinutes) {
      // Completed up to +graceWindowMinutes (or earlier) counts as on-time
      return {
        status: 'on_time',
        delayMinutes: diffMinutes,
        scheduledDate,
        completedDate,
      };
    } else {
      // Completed after +graceWindowMinutes is late
      return {
        status: 'late',
        delayMinutes: diffMinutes,
        scheduledDate,
        completedDate,
      };
    }
  }

  // Not completed
  const minutesSinceScheduled = Math.round((now.getTime() - scheduledDate.getTime()) / (60 * 1000));
  
  // If scheduled time + grace window has passed by more than 2 hours or current hour is past end of day (21:00)
  const isPastEndOfDay = now.getHours() >= 21 && minutesSinceScheduled > graceWindowMinutes;
  const isSignificantlyOverdue = minutesSinceScheduled > (graceWindowMinutes + 120);

  if (isPastEndOfDay || isSignificantlyOverdue) {
    return {
      status: 'missed',
      delayMinutes: minutesSinceScheduled,
      scheduledDate,
      completedDate: null,
    };
  }

  return {
    status: 'pending',
    delayMinutes: minutesSinceScheduled,
    scheduledDate,
    completedDate: null,
  };
}

/**
 * Calculates the Four Metric Buckets:
 * 1. Completion Rate (reminders marked done ÷ reminders scheduled that day)
 * 2. Timeliness (% completed within grace window e.g. ±30 min vs late)
 * 3. Missed Count (reminders with no response by end of day)
 * 4. Adherence Streak (consecutive days at or near 100% adherence)
 */
export function calculateReminderAdherenceMetrics(
  reminders: Reminder[],
  history: DailyAdherenceLog[] = [],
  graceWindowMinutes: number = 30,
  referenceDate: Date = new Date()
): ReminderAdherenceMetrics {
  const totalScheduled = reminders.length;
  let completedCount = 0;
  let onTimeCount = 0;
  let lateCount = 0;
  let missedCount = 0;
  let pendingCount = 0;

  for (const rem of reminders) {
    const { status } = evaluateReminderTimeliness(rem, referenceDate, graceWindowMinutes);
    if (rem.completed) {
      completedCount++;
      if (status === 'late') {
        lateCount++;
      } else {
        onTimeCount++;
      }
    } else {
      if (status === 'missed') {
        missedCount++;
      } else {
        pendingCount++;
      }
    }
  }

  // 1. Completion rate: reminders marked done ÷ reminders scheduled that day
  const completionRate = totalScheduled > 0
    ? Math.round((completedCount / totalScheduled) * 100)
    : 100;

  // 2. Timeliness: % completed within grace window (±30 min) vs late
  const timelinessRate = completedCount > 0
    ? Math.round((onTimeCount / completedCount) * 100)
    : 100;

  // Today's log representation
  const todayStr = referenceDate.toISOString().split('T')[0];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const displayDate = `${monthNames[referenceDate.getMonth()]} ${referenceDate.getDate()}`;
  const dayOfWeek = dayNames[referenceDate.getDay()];

  const isNearFullAdherence = completionRate >= 80;

  const todayLog: DailyAdherenceLog = {
    date: todayStr,
    displayDate: 'Today',
    dayOfWeek,
    totalScheduled,
    completedCount,
    onTimeCount,
    lateCount,
    missedCount,
    completionRate,
    timelinessRate,
    isNearFullAdherence,
  };

  // 4. Adherence Streak: consecutive days at or near 100% (>= 80%)
  // Calculate backwards from historical records
  let streak = 0;

  // If today has reached near-full adherence (>= 80%), today counts towards the active streak
  if (isNearFullAdherence) {
    streak = 1;
  }

  // Iterate backwards through previous days' history (sorted most recent first)
  const sortedHistory = [...history].sort((a, b) => b.date.localeCompare(a.date));
  for (const day of sortedHistory) {
    // Skip today if it's already in history
    if (day.date === todayStr) continue;

    if (day.isNearFullAdherence || day.completionRate >= 80) {
      streak++;
    } else {
      // Streak breaks at first non-adherent day
      break;
    }
  }

  return {
    completionRate,
    timelinessRate,
    missedCount,
    adherenceStreak: streak,
    completedCount,
    totalScheduled,
    onTimeCount,
    lateCount,
    pendingCount,
    graceWindowMinutes,
    todayLog,
    history,
  };
}
