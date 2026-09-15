import React, { useState, useEffect } from 'react';
import { Reminder } from '../types';
import { voiceReminderScheduler } from '../utils/voiceReminderScheduler';
import { Bell, Volume2, Square, Clock, RotateCcw, AlertTriangle } from 'lucide-react';

interface VoiceReminderActiveAlarmProps {
  activeReminder: Reminder | null;
  onDismiss: () => void;
  onSnooze: (reminder: Reminder) => void;
}

export const VoiceReminderActiveAlarm: React.FC<VoiceReminderActiveAlarmProps> = ({
  activeReminder,
  onDismiss,
  onSnooze,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(120);

  useEffect(() => {
    if (!activeReminder) return;

    setSecondsRemaining(120);
    const interval = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeReminder]);

  if (!activeReminder) return null;

  const handleStop = () => {
    voiceReminderScheduler.handleStop(activeReminder.id);
    onDismiss();
  };

  const handleRemindAgain = () => {
    const updated = voiceReminderScheduler.handleRemindAgain(activeReminder.id, 10);
    if (updated) {
      onSnooze(updated);
    } else {
      onDismiss();
    }
  };

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="voice-reminder-title"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div className="bg-[#FFFDF6] border-2 border-[#E07936] rounded-[32px] w-full max-w-md shadow-2xl p-6 sm:p-7 space-y-6 animate-in zoom-in-95">
        {/* Header Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-3.5 h-3.5 rounded-full bg-[#E07936] animate-ping" />
            {/* Exact label required by prompt */}
            <h2 id="voice-reminder-title" className="text-sm font-bold uppercase tracking-wider text-[#173C36]">
              Voice Reminder
            </h2>
          </div>

          <span className="px-3 py-1 rounded-full bg-[#FDECDA] text-[#C4641B] text-xs font-bold flex items-center gap-1.5">
            <Bell className="w-3.5 h-3.5 animate-bounce" />
            <span>Playing Now</span>
          </span>
        </div>

        {/* Animated Waveform & Title Card */}
        <div className="rounded-2xl bg-[#FFFBEF] border border-[#173C36]/10 p-5 text-center space-y-4 shadow-xs">
          <div className="flex items-center justify-center gap-1.5 h-10 py-1">
            {[40, 75, 100, 60, 90, 45, 80, 95, 50, 70, 85].map((height, i) => (
              <span
                key={i}
                className="w-1.5 bg-[#E07936] rounded-full animate-pulse transition-all duration-300"
                style={{
                  height: `${height}%`,
                  animationDelay: `${(i * 0.1).toFixed(1)}s`,
                }}
              />
            ))}
          </div>

          <div>
            <div className="text-xl font-display font-bold text-[#173C36] leading-tight">
              {activeReminder.title || 'Voice Reminder'}
            </div>
            <p className="text-xs text-[#173C36]/70 mt-1">
              Scheduled for {activeReminder.time} · Playing original voice audio
            </p>
          </div>
        </div>

        {/* Fallback timer note */}
        <div className="text-center text-[11px] text-[#173C36]/60 font-medium">
          Auto-stops in {secondsRemaining}s if untouched
        </div>

        {/* Two Mandatory Actions: Stop & Remind Again */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          {/* STOP Action */}
          <button
            id="voice-reminder-stop-btn"
            onClick={handleStop}
            className="py-4 px-4 rounded-2xl bg-[#C0392B] hover:bg-[#A93226] active:scale-95 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-transform"
          >
            <Square className="w-4 h-4 fill-white" />
            <span>Stop</span>
          </button>

          {/* REMIND AGAIN Action */}
          <button
            id="voice-reminder-snooze-btn"
            onClick={handleRemindAgain}
            className="py-4 px-4 rounded-2xl bg-[#F5C244] hover:bg-[#E5B53B] active:scale-95 text-[#173C36] font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-transform"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Remind again</span>
          </button>
        </div>
      </div>
    </div>
  );
};
