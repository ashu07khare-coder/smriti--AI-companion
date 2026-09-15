import { db } from './store';
import { DbDailyScore, DbCognitiveTrend, DbCaregiverAlert } from './types';

/**
 * Computes the nightly scores, rolling 7-day trends, personal baselines,
 * and generates de-duplicated clinical alerts for all active patients.
 */
export function executeNightlyScoring(targetDate: string = new Date().toISOString().split('T')[0]): {
  processedPatients: number;
  scoresCreated: DbDailyScore[];
  trendsCreated: DbCognitiveTrend[];
  alertsGenerated: DbCaregiverAlert[];
} {
  const scoresCreated: DbDailyScore[] = [];
  const trendsCreated: DbCognitiveTrend[] = [];
  const alertsGenerated: DbCaregiverAlert[] = [];

  const patients = db.users.filter(u => u.role === 'elder');

  for (const patient of patients) {
    const patientId = patient.id;

    // 1. Find daily activity log for targetDate
    let log = db.dailyActivityLogs.find(l => l.patientId === patientId && l.logDate === targetDate);

    // If log doesn't exist yet, derive it from today's reminders & sessions
    if (!log) {
      const todayReminders = db.reminders.filter(
        r => r.patientId === patientId && r.scheduledDate === targetDate
      );
      const onTime = todayReminders.filter(r => r.completed && r.completionStatus === 'on_time').length;
      const completed = todayReminders.filter(r => r.completed).length;
      const late = todayReminders.filter(r => r.completed && r.completionStatus === 'late').length;
      const missed = todayReminders.filter(r => !r.completed && r.completionStatus === 'missed').length;

      const todaySessions = db.sessions.filter(
        s => s.patientId === patientId && s.startedAt.startsWith(targetDate)
      );

      log = {
        id: `log-${targetDate}-${patientId}`,
        patientId,
        logDate: targetDate,
        remindersScheduled: todayReminders.length,
        remindersCompleted: completed,
        remindersOnTime: onTime,
        remindersLate: late,
        remindersMissed: missed,
        exerciseSessionIds: todaySessions.map(s => s.id),
        appOpened: todayReminders.some(r => r.completed) || todaySessions.length > 0,
        activeMinutes: Math.round(todaySessions.reduce((sum, s) => sum + s.durationSeconds, 0) / 60) + (completed * 2),
        sessionCount: todaySessions.length,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1,
      };
      db.dailyActivityLogs.push(log);
    }

    // 2. Compute Sub-scores (each normalized 0-100)
    let adherenceScore: number | null = null;
    let cognitiveScore: number | null = null;
    let engagementScore: number | null = null;

    // AdherenceScore: reminders on-time ÷ reminders scheduled
    // (Exclude days with 0 scheduled reminders completely from calculation)
    if (log.remindersScheduled > 0) {
      adherenceScore = Math.round((log.remindersOnTime / log.remindersScheduled) * 100);
    }

    // CognitiveScore: normalized session score average across completed games
    // (Exclude days with 0 sessions completely from calculation)
    if (log.exerciseSessionIds && log.exerciseSessionIds.length > 0) {
      const daySessions = db.sessions.filter(s => log?.exerciseSessionIds.includes(s.id));
      if (daySessions.length > 0) {
        const total = daySessions.reduce((acc, s) => acc + s.sessionScore, 0);
        cognitiveScore = Math.round(total / daySessions.length);
      }
    }

    // EngagementScore: derived from appOpened, activeMinutes, and target habit
    if (log.appOpened) {
      let eng = 40; // 40 base points for opening the app
      eng += Math.min(60, Math.round((log.activeMinutes / 20) * 60)); // Up to 60 points for 20 minutes of engagement
      engagementScore = Math.min(100, eng);
    } else {
      engagementScore = 0;
    }

    // 3. Dynamic Reweighted Composite: 0.45 Cognitive + 0.30 Adherence + 0.25 Engagement
    const defaultWeights = { cognitive: 0.45, adherence: 0.30, engagement: 0.25 };
    let activeWeightsSum = 0;
    let weightedPointsSum = 0;

    if (cognitiveScore !== null) {
      activeWeightsSum += defaultWeights.cognitive;
      weightedPointsSum += cognitiveScore * defaultWeights.cognitive;
    }
    if (adherenceScore !== null) {
      activeWeightsSum += defaultWeights.adherence;
      weightedPointsSum += adherenceScore * defaultWeights.adherence;
    }
    if (engagementScore !== null) {
      activeWeightsSum += defaultWeights.engagement;
      weightedPointsSum += engagementScore * defaultWeights.engagement;
    }

    const compositeScore = activeWeightsSum > 0
      ? Math.round((weightedPointsSum / activeWeightsSum) * 10) / 10
      : 50.0;

    // Upsert daily score
    const existingScoreIdx = db.dailyScores.findIndex(
      s => s.patientId === patientId && s.scoreDate === targetDate
    );
    const scoreRecord: DbDailyScore = {
      id: existingScoreIdx >= 0 ? db.dailyScores[existingScoreIdx].id : `score-${targetDate}-${patientId}`,
      patientId,
      scoreDate: targetDate,
      adherenceScore,
      cognitiveScore,
      engagementScore,
      compositeScore,
      weightsUsed: defaultWeights,
      createdAt: new Date().toISOString(),
    };

    if (existingScoreIdx >= 0) {
      db.dailyScores[existingScoreIdx] = scoreRecord;
    } else {
      db.dailyScores.push(scoreRecord);
    }
    scoresCreated.push(scoreRecord);

    // 4. Trend & Baseline Calculation
    // Fetch patient scores up to targetDate sorted descending
    const patientScores = db.dailyScores
      .filter(s => s.patientId === patientId && s.scoreDate <= targetDate)
      .sort((a, b) => b.scoreDate.localeCompare(a.scoreDate));

    if (patientScores.length > 0) {
      // 7-day rolling window
      const last7 = patientScores.slice(0, 7);
      const rolling7dComposite = Math.round((last7.reduce((sum, s) => sum + s.compositeScore, 0) / last7.length) * 10) / 10;
      
      const last7Adh = last7.filter(s => s.adherenceScore !== null);
      const rolling7dAdherence = last7Adh.length > 0
        ? Math.round(last7Adh.reduce((sum, s) => sum + (s.adherenceScore || 0), 0) / last7Adh.length)
        : null;

      const last7Cog = last7.filter(s => s.cognitiveScore !== null);
      const rolling7dCognitive = last7Cog.length > 0
        ? Math.round(last7Cog.reduce((sum, s) => sum + (s.cognitiveScore || 0), 0) / last7Cog.length)
        : null;

      const last7Eng = last7.filter(s => s.engagementScore !== null);
      const rolling7dEngagement = last7Eng.length > 0
        ? Math.round(last7Eng.reduce((sum, s) => sum + (s.engagementScore || 0), 0) / last7Eng.length)
        : null;

      // Baseline: established from the first ~14 days of patient data
      const baselinePool = patientScores.slice(0, 14);
      const baselineComposite = Math.round(
        (baselinePool.reduce((sum, s) => sum + s.compositeScore, 0) / baselinePool.length) * 10
      ) / 10;

      // Sustained decline rule: Flag "declining" ONLY when a sub-score or composite is 10%+ below baseline for 5+ consecutive days
      let consecutiveDeclineDays = 0;
      for (const s of last7) {
        if (s.compositeScore <= baselineComposite * 0.90) {
          consecutiveDeclineDays++;
        } else {
          break;
        }
      }

      const compositeTrend = consecutiveDeclineDays >= 5 ? 'declining' : 'stable';

      const trendRecord: DbCognitiveTrend = {
        id: `trend-${targetDate}-${patientId}`,
        patientId,
        trendDate: targetDate,
        rolling7dComposite,
        rolling7dAdherence,
        rolling7dCognitive,
        rolling7dEngagement,
        baselineComposite,
        baselineDaysCounted: baselinePool.length,
        compositeTrend,
        adherenceTrend: (rolling7dAdherence !== null && rolling7dAdherence < 70) ? 'declining' : 'stable',
        cognitiveTrend: (rolling7dCognitive !== null && rolling7dCognitive < 65) ? 'declining' : 'stable',
        engagementTrend: (rolling7dEngagement !== null && rolling7dEngagement < 60) ? 'declining' : 'stable',
        createdAt: new Date().toISOString(),
      };

      const existingTrendIdx = db.cognitiveTrends.findIndex(
        t => t.patientId === patientId && t.trendDate === targetDate
      );
      if (existingTrendIdx >= 0) {
        db.cognitiveTrends[existingTrendIdx] = trendRecord;
      } else {
        db.cognitiveTrends.push(trendRecord);
      }
      trendsCreated.push(trendRecord);

      // De-duplicated Alert: Sustained Decline
      if (consecutiveDeclineDays >= 5) {
        const episodeKey = `sustained_decline_${patientId}_${targetDate.slice(0, 7)}`;
        const existingAlert = db.alerts.find(a => a.patientId === patientId && a.episodeKey === episodeKey);
        if (!existingAlert) {
          const alert: DbCaregiverAlert = {
            id: `alert-decline-${Date.now()}`,
            patientId,
            episodeKey,
            title: 'Sustained Cognitive Decline Flagged',
            message: `Cognitive composite has remained >10% below baseline (${baselineComposite}) for 5+ consecutive days.`,
            severity: 'critical',
            triggerMetric: 'cognitive_decline',
            status: 'active',
            createdAt: new Date().toISOString(),
          };
          db.alerts.unshift(alert);
          alertsGenerated.push(alert);
          db.logChange(patientId, 'caregiver_alerts', alert.id, 'INSERT', alert);
        }
      }
    }

    // 5. Independent Inactivity Check: 3+ consecutive days with appOpened = false
    const recentLogs = db.dailyActivityLogs
      .filter(l => l.patientId === patientId && l.logDate <= targetDate)
      .sort((a, b) => b.logDate.localeCompare(a.logDate))
      .slice(0, 3);

    if (recentLogs.length === 3 && recentLogs.every(l => !l.appOpened)) {
      const inactivityKey = `inactivity_3d_${patientId}_${targetDate}`;
      const existingInactivityAlert = db.alerts.find(a => a.patientId === patientId && a.episodeKey === inactivityKey);
      if (!existingInactivityAlert) {
        const alert: DbCaregiverAlert = {
          id: `alert-inactive-${Date.now()}`,
          patientId,
          episodeKey: inactivityKey,
          title: '3 Days With No App Activity',
          message: `${patient.name} has not opened Smriti or interacted with daily tasks for 3 consecutive days.`,
          severity: 'warning',
          triggerMetric: 'no_activity_3d',
          status: 'active',
          createdAt: new Date().toISOString(),
        };
        db.alerts.unshift(alert);
        alertsGenerated.push(alert);
        db.logChange(patientId, 'caregiver_alerts', alert.id, 'INSERT', alert);
      }
    }
  }

  return {
    processedPatients: patients.length,
    scoresCreated,
    trendsCreated,
    alertsGenerated,
  };
}
