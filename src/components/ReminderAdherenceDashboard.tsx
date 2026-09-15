import React, { useState } from 'react';
import { Reminder, DailyAdherenceLog, ReminderAdherenceMetrics } from '../types';
import { calculateReminderAdherenceMetrics, evaluateReminderTimeliness } from '../utils/adherenceMetrics';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Flame,
  ChevronDown,
  ChevronUp,
  Info,
  SlidersHorizontal,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Check,
  RotateCcw
} from 'lucide-react';

interface ReminderAdherenceDashboardProps {
  reminders: Reminder[];
  history: DailyAdherenceLog[];
  onToggleReminder: (id: string, customCompletedAt?: string) => void;
  elderName?: string;
  isCaregiverView?: boolean;
}

export const ReminderAdherenceDashboard: React.FC<ReminderAdherenceDashboardProps> = ({
  reminders,
  history,
  onToggleReminder,
  elderName = 'Aita',
  isCaregiverView = true,
}) => {
  const [graceWindowMinutes, setGraceWindowMinutes] = useState<number>(30);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [selectedDayHistory, setSelectedDayHistory] = useState<DailyAdherenceLog | null>(null);

  // Compute the live 4 metric buckets using the active grace window
  const metrics: ReminderAdherenceMetrics = calculateReminderAdherenceMetrics(
    reminders,
    history,
    graceWindowMinutes
  );

  const {
    completionRate,
    timelinessRate,
    missedCount,
    adherenceStreak,
    completedCount,
    totalScheduled,
    onTimeCount,
    lateCount,
    pendingCount,
    todayLog,
  } = metrics;

  // Streak status message
  const getStreakMessage = (streak: number) => {
    if (streak >= 7) return 'Superb consistency (full week+ at or near 100%)';
    if (streak >= 3) return 'Strong adherence habit forming';
    if (streak === 1) return 'On track today (≥80% adherence)';
    return 'Rebuilding streak today';
  };

  return (
    <div className="rounded-[28px] bg-[#FFFDF6] border border-[#173C36]/10 p-5 sm:p-6 shadow-xs space-y-5 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] tracking-[0.16em] uppercase font-bold text-[#E07936] bg-[#FDECDA] px-2.5 py-0.5 rounded-full">
              Metric Bucket 1
            </span>
            <span className="text-xs text-[#173C36]/60 font-medium">Daily Plan & Reminders</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-[#173C36] mt-1.5 flex items-center gap-2">
            Reminder & Task Adherence
          </h2>
          <p className="text-xs text-[#173C36]/75 mt-0.5 font-medium">
            Real-time compliance, promptness, and streak monitoring for {elderName}
          </p>
        </div>

        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="w-8 h-8 rounded-full bg-[#FFFBEF] border border-[#173C36]/10 flex items-center justify-center text-[#173C36]/70 hover:text-[#173C36] hover:bg-[#FDF0BE]/50 transition-colors"
          title="Explanation of 4 adherence metrics"
          aria-label="Explanation of 4 adherence metrics"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>

      {/* Explanatory banner if opened */}
      {showExplanation && (
        <div className="p-4 rounded-2xl bg-[#FFFBEF] border border-[#173C36]/10 text-xs text-[#173C36]/85 space-y-2 animate-in fade-in">
          <div className="font-bold text-[#173C36] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#2F9E76]" />
            Adherence Calculation Specification
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] leading-relaxed pt-1">
            <div className="bg-white/80 p-2.5 rounded-xl border border-[#173C36]/5">
              <span className="font-bold text-[#173C36]">1. Completion Rate:</span> Reminders marked done ÷ Reminders scheduled that day. Target: ≥80–100%.
            </div>
            <div className="bg-white/80 p-2.5 rounded-xl border border-[#173C36]/5">
              <span className="font-bold text-[#173C36]">2. Timeliness:</span> % completed within a grace window (currently ±{graceWindowMinutes} min) vs. late.
            </div>
            <div className="bg-white/80 p-2.5 rounded-xl border border-[#173C36]/5">
              <span className="font-bold text-[#173C36]">3. Missed Count:</span> Reminders with no response by end of day / overdue cutoff.
            </div>
            <div className="bg-white/80 p-2.5 rounded-xl border border-[#173C36]/5">
              <span className="font-bold text-[#173C36]">4. Adherence Streak:</span> Consecutive days sustained at or near 100% adherence (≥80%).
            </div>
          </div>
        </div>
      )}

      {/* THE 4 METRIC BUCKETS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Metric 1: Completion Rate */}
        <div className="p-4 rounded-2xl bg-[#FFFBEF] border border-[#173C36]/10 flex flex-col justify-between space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#173C36]/65">
              Completion Rate
            </span>
            <CheckCircle2 className="w-4 h-4 text-[#2F9E76]" />
          </div>

          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-display font-bold text-[#173C36]">
                {completionRate}%
              </span>
            </div>
            <div className="w-full bg-[#173C36]/10 h-2 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-[#2F9E76] h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, completionRate)}%` }}
              />
            </div>
          </div>

          <div className="text-[11px] text-[#173C36]/75 font-medium flex items-center justify-between pt-0.5">
            <span>{completedCount} of {totalScheduled} done</span>
            <span className="font-bold text-[#2F9E76]">
              {completionRate >= 80 ? 'Target met' : `${totalScheduled - completedCount} left`}
            </span>
          </div>
        </div>

        {/* Metric 2: Timeliness */}
        <div className="p-4 rounded-2xl bg-[#FFFBEF] border border-[#173C36]/10 flex flex-col justify-between space-y-2 relative">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#173C36]/65">
              Timeliness
            </span>
            <Clock className="w-4 h-4 text-[#2A6DB5]" />
          </div>

          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-display font-bold text-[#173C36]">
                {completedCount > 0 ? `${timelinessRate}%` : '—'}
              </span>
              <span className="text-[10px] text-[#173C36]/60 font-semibold">
                (±{graceWindowMinutes}m grace)
              </span>
            </div>
            <div className="w-full bg-[#173C36]/10 h-2 rounded-full mt-2 overflow-hidden flex">
              <div
                className="bg-[#2A6DB5] h-full transition-all duration-500"
                style={{ width: `${completedCount > 0 ? (onTimeCount / completedCount) * 100 : 0}%` }}
              />
              <div
                className="bg-[#E07936] h-full transition-all duration-500"
                style={{ width: `${completedCount > 0 ? (lateCount / completedCount) * 100 : 0}%` }}
              />
            </div>
          </div>

          <div className="text-[11px] text-[#173C36]/75 font-medium flex items-center justify-between pt-0.5">
            <span className="text-[#2A6DB5] font-semibold">{onTimeCount} on-time</span>
            <span className={`${lateCount > 0 ? 'text-[#E07936] font-semibold' : 'text-[#173C36]/50'}`}>
              {lateCount} late
            </span>
          </div>
        </div>

        {/* Metric 3: Missed Count */}
        <div className={`p-4 rounded-2xl border flex flex-col justify-between space-y-2 ${
          missedCount > 0
            ? 'bg-[#FDECDA] border-[#F6A860]/40'
            : 'bg-[#FFFBEF] border-[#173C36]/10'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#173C36]/65">
              Missed Count
            </span>
            <AlertTriangle className={`w-4 h-4 ${missedCount > 0 ? 'text-[#C4641B]' : 'text-[#2F9E76]'}`} />
          </div>

          <div>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-3xl font-display font-bold ${missedCount > 0 ? 'text-[#C4641B]' : 'text-[#173C36]'}`}>
                {missedCount}
              </span>
              <span className="text-[10px] text-[#173C36]/60 font-semibold">
                no response
              </span>
            </div>
            <p className="text-[11px] text-[#173C36]/70 mt-1 font-medium leading-tight">
              {missedCount > 0
                ? 'Unanswered past end-of-day window'
                : 'Zero tasks missed today'}
            </p>
          </div>

          <div className="text-[11px] font-semibold pt-0.5">
            {missedCount > 0 ? (
              <span className="text-[#C4641B] flex items-center gap-1">
                Needs caregiver attention
              </span>
            ) : (
              <span className="text-[#2F9E76] flex items-center gap-1">
                ✓ All active tasks healthy
              </span>
            )}
          </div>
        </div>

        {/* Metric 4: Adherence Streak */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#FFFBEF] to-[#FDF0BE]/40 border border-[#F5C244]/40 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#173C36]/65">
              Adherence Streak
            </span>
            <Flame className="w-4 h-4 text-[#E07936] fill-current" />
          </div>

          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-display font-bold text-[#173C36]">
                {adherenceStreak}
              </span>
              <span className="text-xs font-bold text-[#E07936]">
                {adherenceStreak === 1 ? 'Day' : 'Days'}
              </span>
            </div>
            <p className="text-[11px] text-[#173C36]/70 mt-1 font-medium leading-tight">
              Consecutive days at or near 100%
            </p>
          </div>

          <div className="text-[10px] font-bold text-[#173C36]/80 bg-white/70 px-2 py-0.5 rounded-full w-fit">
            {getStreakMessage(adherenceStreak)}
          </div>
        </div>
      </div>

      {/* Grace Window Selector Control */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 rounded-2xl bg-[#FFFBEF] border border-[#173C36]/5 text-xs">
        <div className="flex items-center gap-2 text-[#173C36]/80 font-medium">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#E07936]" />
          <span>Grace Window for Timeliness:</span>
        </div>
        <div className="flex items-center gap-1 bg-white/80 p-1 rounded-xl border border-[#173C36]/10">
          {[15, 30, 45, 60].map(mins => (
            <button
              key={mins}
              onClick={() => setGraceWindowMinutes(mins)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                graceWindowMinutes === mins
                  ? 'bg-[#173C36] text-white shadow-xs'
                  : 'text-[#173C36]/70 hover:text-[#173C36]'
              }`}
            >
              ±{mins}m
            </button>
          ))}
        </div>
      </div>

      {/* Historical 7-Day Streak & Trend Track */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between text-xs font-bold text-[#173C36]/75">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#2F9E76]" />
            7-Day Adherence Streak Log (Consecutive ≥80%)
          </span>
          <span className="text-[11px] font-semibold text-[#173C36]/60">
            Tap a day to inspect
          </span>
        </div>

        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {history.slice(-6).concat(todayLog).map((log, idx) => {
            const isToday = idx === 6;
            const isAdherent = log.completionRate >= 80;

            return (
              <div
                key={log.date}
                onClick={() => setSelectedDayHistory(log)}
                className={`p-2.5 rounded-xl text-center cursor-pointer transition-all border ${
                  isToday
                    ? 'border-[#173C36] bg-white shadow-xs ring-1 ring-[#173C36]/10'
                    : isAdherent
                    ? 'bg-[#E1F5EE]/40 border-[#2F9E76]/20 hover:bg-[#E1F5EE]'
                    : 'bg-[#FDECDA]/40 border-[#F6A860]/20 hover:bg-[#FDECDA]'
                }`}
              >
                <div className="text-[10px] font-bold text-[#173C36]/60 uppercase">
                  {log.dayOfWeek || log.displayDate}
                </div>
                <div className={`text-base font-bold my-1 ${
                  isAdherent ? 'text-[#1F8A5F]' : 'text-[#C4641B]'
                }`}>
                  {log.completionRate}%
                </div>
                <div className="flex justify-center items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${
                    isAdherent ? 'bg-[#2F9E76]' : 'bg-[#E07936]'
                  }`} />
                  <span className="text-[9px] font-bold text-[#173C36]/60">
                    {log.completedCount}/{log.totalScheduled}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {selectedDayHistory && (
          <div className="p-3 bg-[#FFFBEF] border border-[#173C36]/10 rounded-2xl text-xs flex items-center justify-between animate-in fade-in">
            <div className="space-y-0.5">
              <span className="font-bold text-[#173C36]">{selectedDayHistory.displayDate} ({selectedDayHistory.date}):</span>{' '}
              <span>{selectedDayHistory.completedCount}/{selectedDayHistory.totalScheduled} completed ({selectedDayHistory.completionRate}%)</span> ·{' '}
              <span className="text-[#2A6DB5] font-semibold">{selectedDayHistory.onTimeCount} on-time</span> ·{' '}
              <span className="text-[#E07936] font-semibold">{selectedDayHistory.lateCount} late</span> ·{' '}
              <span className="text-[#C4641B] font-semibold">{selectedDayHistory.missedCount} missed</span>
            </div>
            <button
              onClick={() => setSelectedDayHistory(null)}
              className="text-xs font-bold text-[#173C36]/60 hover:text-[#173C36] px-2 py-1"
            >
              Close
            </button>
          </div>
        )}
      </div>

      {/* Accordion Toggle: Today's Tasks Breakdown with Timeliness Analysis */}
      <div className="border-t border-[#173C36]/10 pt-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between text-left group"
        >
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-[#173C36]">
              Today's Scheduled Tasks Breakdown & Timeliness Status
            </h3>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#173C36]/5 text-[#173C36]/75">
              {reminders.length} tasks
            </span>
          </div>
          <div className="p-1 rounded-full text-[#173C36]/60 group-hover:text-[#173C36]">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {isExpanded && (
          <div className="mt-3 space-y-2.5 animate-in fade-in">
            {reminders.map(rem => {
              const timeliness = evaluateReminderTimeliness(rem, new Date(), graceWindowMinutes);
              const isVoice = rem.isVoiceReminder || rem.category === 'voice' || !!rem.audio_file_path;

              // Format scheduled and completed strings
              const scheduledFormatted = rem.time || '9:00 AM';
              const completedTimeFormatted = rem.completedAt
                ? new Date(rem.completedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
                : null;

              return (
                <div
                  key={rem.id}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    rem.completed
                      ? 'bg-white border-[#173C36]/10'
                      : timeliness.status === 'missed'
                      ? 'bg-[#FDECDA]/50 border-[#F6A860]/30'
                      : 'bg-[#FFFBEF] border-[#173C36]/10'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      id={`adherence-toggle-${rem.id}`}
                      onClick={() => onToggleReminder(rem.id)}
                      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all ${
                        rem.completed
                          ? 'bg-[#2F9E76] text-white'
                          : 'bg-[#173C36]/5 border border-[#173C36]/15 text-[#173C36] hover:bg-[#2F9E76] hover:text-white'
                      }`}
                      title={rem.completed ? 'Mark incomplete' : 'Mark done now'}
                    >
                      {rem.completed ? <Check className="w-4 h-4 stroke-[2.5]" /> : <Clock className="w-4 h-4" />}
                    </button>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-[#173C36]">
                          {rem.title}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#173C36]/5 text-[#173C36]/70">
                          {rem.category}
                        </span>
                        {isVoice && (
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#FDECDA] text-[#C4641B]">
                            Voice
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-[#173C36]/70 flex items-center gap-2 mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#173C36]/50" />
                          Scheduled: <strong className="text-[#173C36]">{scheduledFormatted}</strong>
                        </span>
                        {completedTimeFormatted && (
                          <span>
                            · Done at: <strong className="text-[#2F9E76]">{completedTimeFormatted}</strong>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status Badges & Quick Action */}
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {rem.completed ? (
                      timeliness.status === 'on_time' ? (
                        <span className="px-2.5 py-1 rounded-full bg-[#E1F5EE] text-[#1F8A5F] text-xs font-bold flex items-center gap-1">
                          <Check className="w-3 h-3 stroke-[3]" />
                          On-Time (±{graceWindowMinutes}m)
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-[#FDECDA] text-[#C4641B] text-xs font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Late ({Math.abs(timeliness.delayMinutes)}m delay)
                        </span>
                      )
                    ) : timeliness.status === 'missed' ? (
                      <span className="px-2.5 py-1 rounded-full bg-[#FEE2E2] text-[#B91C1C] text-xs font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Missed (No response)
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-black/5 text-[#173C36]/75 text-xs font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Pending / Upcoming
                      </span>
                    )}

                    {/* Quick test buttons for caregiver testing */}
                    {isCaregiverView && (
                      <div className="flex items-center gap-1 border-l border-[#173C36]/10 pl-2">
                        {!rem.completed ? (
                          <>
                            <button
                              onClick={() => {
                                // Simulate completed on-time (e.g. +5 min from scheduled)
                                const sched = timeliness.scheduledDate;
                                const onTimeSim = new Date(sched.getTime() + 5 * 60 * 1000).toISOString();
                                onToggleReminder(rem.id, onTimeSim);
                              }}
                              className="px-2 py-1 rounded-lg bg-[#2F9E76]/10 hover:bg-[#2F9E76] text-[#1F8A5F] hover:text-white text-[10px] font-bold transition-colors"
                              title="Simulate completed on time (+5m)"
                            >
                              +OnTime
                            </button>
                            <button
                              onClick={() => {
                                // Simulate completed late (e.g. +60 min from scheduled)
                                const sched = timeliness.scheduledDate;
                                const lateSim = new Date(sched.getTime() + 60 * 60 * 1000).toISOString();
                                onToggleReminder(rem.id, lateSim);
                              }}
                              className="px-2 py-1 rounded-lg bg-[#E07936]/10 hover:bg-[#E07936] text-[#C4641B] hover:text-white text-[10px] font-bold transition-colors"
                              title="Simulate completed late (+60m)"
                            >
                              +Late
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => onToggleReminder(rem.id)}
                            className="p-1 rounded-lg text-[#173C36]/60 hover:text-[#173C36] hover:bg-black/5 text-[10px]"
                            title="Reset to incomplete"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
