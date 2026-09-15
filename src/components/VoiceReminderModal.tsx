import React, { useState, useEffect, useRef } from 'react';
import { Reminder, LanguageCode } from '../types';
import { AppStorage } from '../utils/storage';
import { AudioRecorderHelper } from '../utils/voiceReminderScheduler';
import { getVoiceReminderModalStrings } from '../utils/reminderModalLocalization';
import {
  Mic,
  Square,
  X,
  Play,
  Pause,
  Clock,
  RotateCcw,
  Check,
  AlertCircle,
  Calendar,
  Volume2
} from 'lucide-react';

interface VoiceReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: LanguageCode;
  onReminderSaved: (reminder: Reminder) => void;
}

export const VoiceReminderModal: React.FC<VoiceReminderModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  onReminderSaved,
}) => {
  const strings = getVoiceReminderModalStrings(currentLanguage);

  // Stages: 'record' (ready or recording) -> 'time_picker' (immediately right after stopping)
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [audioResult, setAudioResult] = useState<{ audioDataUrl: string; durationSeconds: number } | null>(null);
  const [step, setStep] = useState<'record' | 'time_picker'>('record');

  // Preview playback state
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  // Time picker state
  const [selectedHour, setSelectedHour] = useState('');
  const [selectedMinute, setSelectedMinute] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState<'AM' | 'PM'>('AM');
  const [selectedDay, setSelectedDay] = useState<'today' | 'tomorrow'>('today');
  const [validationError, setValidationError] = useState<string | null>(null);

  const recorderRef = useRef<AudioRecorderHelper | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Reset states when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('record');
      setIsRecording(false);
      setRecordingSeconds(0);
      setVolumeLevel(0);
      setAudioResult(null);
      setValidationError(null);
      stopPreviewAudio();

      // Pre-populate time picker with 10 minutes from now
      initDefaultFutureTime();
    } else {
      stopRecordingImmediate();
      stopPreviewAudio();
    }
  }, [isOpen]);

  const initDefaultFutureTime = () => {
    const target = new Date(Date.now() + 10 * 60 * 1000); // 10 mins ahead
    let hours = target.getHours();
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const minutes = target.getMinutes().toString().padStart(2, '0');

    setSelectedHour(hours.toString());
    setSelectedMinute(minutes);
    setSelectedPeriod(period);
    setSelectedDay('today');
  };

  const stopPreviewAudio = () => {
    if (previewAudioRef.current) {
      try {
        previewAudioRef.current.pause();
        previewAudioRef.current.currentTime = 0;
      } catch (_) {}
      previewAudioRef.current = null;
    }
    setIsPlayingPreview(false);
  };

  const handleStartRecord = async () => {
    stopPreviewAudio();
    const recorder = new AudioRecorderHelper();
    recorderRef.current = recorder;
    setIsRecording(true);
    setRecordingSeconds(0);

    timerIntervalRef.current = setInterval(() => {
      setRecordingSeconds(prev => prev + 1);
    }, 1000);

    await recorder.startRecording(level => {
      setVolumeLevel(level);
    });
  };

  const handleStopRecord = async () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setIsRecording(false);

    if (recorderRef.current) {
      const result = await recorderRef.current.stopRecording();
      setAudioResult(result);
      recorderRef.current = null;

      // Immediately after stopping, a time picker appears: "What time should this play?"
      initDefaultFutureTime();
      setStep('time_picker');
    }
  };

  const stopRecordingImmediate = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (recorderRef.current) {
      recorderRef.current.stopRecording().catch(() => {});
      recorderRef.current = null;
    }
    setIsRecording(false);
  };

  const togglePlayPreview = () => {
    if (!audioResult?.audioDataUrl) return;

    if (isPlayingPreview) {
      stopPreviewAudio();
    } else {
      stopPreviewAudio();
      const audio = new Audio(audioResult.audioDataUrl);
      previewAudioRef.current = audio;
      setIsPlayingPreview(true);
      audio.onended = () => {
        setIsPlayingPreview(false);
      };
      audio.onerror = () => {
        setIsPlayingPreview(false);
      };
      audio.play().catch(() => {
        setIsPlayingPreview(false);
      });
    }
  };

  // Quick preset buttons
  const applyQuickOffset = (minutes: number) => {
    const target = new Date(Date.now() + minutes * 60 * 1000);
    let hours = target.getHours();
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const mins = target.getMinutes().toString().padStart(2, '0');

    setSelectedHour(hours.toString());
    setSelectedMinute(mins);
    setSelectedPeriod(period);
    setSelectedDay('today');
    setValidationError(null);
  };

  // Calculate chosen scheduled Date object and validate
  const computeScheduledDate = (): { date: Date | null; error?: string } => {
    const hourNum = parseInt(selectedHour, 10);
    const minuteNum = parseInt(selectedMinute, 10);

    if (isNaN(hourNum) || isNaN(minuteNum) || hourNum < 1 || hourNum > 12 || minuteNum < 0 || minuteNum > 59) {
      return { date: null, error: 'Please enter a valid time (e.g. 9:30 AM)' };
    }

    let militaryHours = hourNum;
    if (selectedPeriod === 'PM' && hourNum < 12) {
      militaryHours += 12;
    } else if (selectedPeriod === 'AM' && hourNum === 12) {
      militaryHours = 0;
    }

    const sched = new Date();
    if (selectedDay === 'tomorrow') {
      sched.setDate(sched.getDate() + 1);
    }
    sched.setHours(militaryHours, minuteNum, 0, 0);

    // Validate that scheduled time is strictly in the future
    if (sched.getTime() <= Date.now()) {
      return {
        date: null,
        error: strings.pastTimeError,
      };
    }

    return { date: sched };
  };

  const handleConfirmReminder = () => {
    const { date, error } = computeScheduledDate();
    if (error || !date) {
      setValidationError(error || 'Invalid time');
      return;
    }

    setValidationError(null);
    stopPreviewAudio();

    const formattedTime = `${selectedHour}:${selectedMinute.padStart(2, '0')} ${selectedPeriod}`;
    const dayLabel = selectedDay === 'tomorrow' ? `${strings.tomorrow} ` : '';

    const newReminder: Reminder = {
      id: `rem-voice-${Date.now()}`,
      // Label text must read "Voice Reminder"
      title: 'Voice Reminder',
      category: 'voice',
      subtitle: `${strings.modalTitle} · ${dayLabel}${formattedTime}`,
      time: `${dayLabel}${formattedTime}`,
      completed: false,
      recurrence: 'Once',
      createdBy: 'patient',
      audio_file_path: audioResult?.audioDataUrl || '',
      duration: audioResult?.durationSeconds || recordingSeconds,
      scheduled_time: date.toISOString(),
      status: 'pending',
      isVoiceReminder: true,
    };

    AppStorage.saveReminder(newReminder);
    onReminderSaved(newReminder);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="voice-reminder-modal-title"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-3 sm:p-4"
    >
      <div className="bg-[#FFFDF6] rounded-[32px] w-full max-w-sm shadow-2xl border border-[#173C36]/10 p-6 space-y-5 animate-in slide-in-from-bottom sm:zoom-in-95">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E07936]" />
            <span id="voice-reminder-modal-title" className="text-xs font-bold uppercase tracking-wider text-[#173C36]">
              {strings.modalTitle}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#FFFBEF] border border-[#173C36]/10 flex items-center justify-center text-[#173C36] hover:bg-[#173C36]/5 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* STEP 1: RECORD AUDIO */}
        {step === 'record' && (
          <div className="text-center space-y-5 py-2">
            <div>
              <h3 className="text-xl font-display font-bold text-[#173C36]">
                {isRecording ? strings.recordingActiveTitle : strings.recordTitle}
              </h3>
              <p className="text-xs text-[#173C36]/70 mt-1 max-w-xs mx-auto leading-relaxed">
                {isRecording ? strings.recordingActiveSub : strings.recordSub}
              </p>
            </div>

            {/* Live Timer & Waveform */}
            <div className="py-2">
              <div className="text-2xl font-mono font-bold text-[#173C36]">
                00:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds}
              </div>

              {isRecording && (
                <div className="flex items-center justify-center gap-1 h-8 mt-2">
                  {[25, 60, 95, 50, 80, 40, 70, 90, 45, 65].map((base, idx) => (
                    <span
                      key={idx}
                      className="w-1 bg-[#E07936] rounded-full transition-all duration-150"
                      style={{
                        height: `${Math.max(15, Math.min(100, base * (volumeLevel ? volumeLevel / 40 : 0.8)))}%`,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Large, high-contrast, easy to tap Record / Stop Button */}
            <div className="flex flex-col items-center justify-center gap-2">
              {!isRecording ? (
                <button
                  id="voice-reminder-record-btn"
                  onClick={handleStartRecord}
                  className="w-24 h-24 rounded-full bg-[#E07936] hover:bg-[#C96425] active:scale-95 text-white flex flex-col items-center justify-center gap-1 shadow-xl hover:shadow-2xl transition-all border-4 border-[#FFFBEF]"
                  aria-label={strings.btnRecord}
                >
                  <Mic className="w-9 h-9 stroke-[2.5]" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">{strings.btnRecord}</span>
                </button>
              ) : (
                <button
                  id="voice-reminder-stop-record-btn"
                  onClick={handleStopRecord}
                  className="w-24 h-24 rounded-full bg-[#C0392B] hover:bg-[#A93226] active:scale-95 text-white flex flex-col items-center justify-center gap-1 shadow-xl animate-pulse transition-all border-4 border-[#FFFBEF]"
                  aria-label={strings.btnStop}
                >
                  <Square className="w-8 h-8 fill-white" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">{strings.btnStop}</span>
                </button>
              )}

              <p className="text-xs font-semibold text-[#173C36]/80 mt-2">
                {isRecording ? strings.listeningHint : strings.tapStartHint}
              </p>
            </div>
          </div>
        )}

        {/* STEP 2: TIME PICKER - Appears immediately after stopping */}
        {step === 'time_picker' && (
          <div className="space-y-4 py-1 animate-in fade-in">
            <div className="text-center">
              <h3 className="text-xl font-display font-bold text-[#173C36]">
                {strings.timePickerTitle}
              </h3>
              <p className="text-xs text-[#173C36]/70 mt-1">
                {strings.timePickerSub}
              </p>
            </div>

            {/* Audio Preview Card */}
            <div className="p-3 bg-[#FFFBEF] rounded-2xl border border-[#173C36]/10 flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5">
                <button
                  onClick={togglePlayPreview}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isPlayingPreview ? 'bg-[#E07936] text-white' : 'bg-[#173C36] text-white hover:scale-105'
                  }`}
                  aria-label={isPlayingPreview ? 'Pause' : 'Play'}
                >
                  {isPlayingPreview ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
                </button>
                <div>
                  <div className="text-xs font-bold text-[#173C36] flex items-center gap-1">
                    <Volume2 className="w-3.5 h-3.5 text-[#E07936]" />
                    <span>{strings.voiceNoteBadge}</span>
                  </div>
                  <div className="text-[11px] text-[#173C36]/60">
                    {audioResult?.durationSeconds || recordingSeconds} {strings.recordedSuffix}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  stopPreviewAudio();
                  setStep('record');
                }}
                className="px-2.5 py-1 text-[11px] font-bold text-[#173C36]/70 hover:text-[#173C36] rounded-lg hover:bg-black/5 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{strings.rerecord}</span>
              </button>
            </div>

            {/* Quick offset chips */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-[#173C36]/70 block">
                {strings.quickSchedule}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: `+10 ${strings.minShort}`, mins: 10 },
                  { label: `+30 ${strings.minShort}`, mins: 30 },
                  { label: `+1 ${strings.hourShort}`, mins: 60 },
                  { label: `+2 ${strings.hourShort}`, mins: 120 },
                ].map(chip => (
                  <button
                    key={chip.label}
                    onClick={() => applyQuickOffset(chip.mins)}
                    className="px-3 py-1.5 rounded-full bg-[#FDECDA] text-[#C4641B] hover:bg-[#F6A860] hover:text-white text-xs font-bold transition-colors"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Exact Time Selector */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-[#173C36]/70 block">
                {strings.selectExactTime}
              </span>

              {/* Day selection */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedDay('today');
                    setValidationError(null);
                  }}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    selectedDay === 'today'
                      ? 'bg-[#173C36] text-white border-[#173C36]'
                      : 'bg-white text-[#173C36]/70 border-[#173C36]/15 hover:bg-[#173C36]/5'
                  }`}
                >
                  {strings.today}
                </button>
                <button
                  onClick={() => {
                    setSelectedDay('tomorrow');
                    setValidationError(null);
                  }}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    selectedDay === 'tomorrow'
                      ? 'bg-[#173C36] text-white border-[#173C36]'
                      : 'bg-white text-[#173C36]/70 border-[#173C36]/15 hover:bg-[#173C36]/5'
                  }`}
                >
                  {strings.tomorrow}
                </button>
              </div>

              {/* Hour : Minute AM/PM Controls */}
              <div className="flex items-center justify-center gap-2 p-3 bg-white rounded-2xl border border-[#173C36]/10 shadow-xs">
                {/* Hours */}
                <select
                  value={selectedHour}
                  onChange={e => {
                    setSelectedHour(e.target.value);
                    setValidationError(null);
                  }}
                  className="bg-[#FFFDF6] border border-[#173C36]/20 rounded-xl px-2.5 py-1.5 text-base font-bold text-[#173C36] text-center focus:ring-2 focus:ring-[#E07936] outline-hidden"
                >
                  {Array.from({ length: 12 }, (_, i) => (i + 1).toString()).map(h => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>

                <span className="text-lg font-bold text-[#173C36]">:</span>

                {/* Minutes */}
                <select
                  value={selectedMinute}
                  onChange={e => {
                    setSelectedMinute(e.target.value);
                    setValidationError(null);
                  }}
                  className="bg-[#FFFDF6] border border-[#173C36]/20 rounded-xl px-2.5 py-1.5 text-base font-bold text-[#173C36] text-center focus:ring-2 focus:ring-[#E07936] outline-hidden"
                >
                  {['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'].map(m => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>

                {/* AM / PM Toggle */}
                <div className="flex rounded-xl bg-[#FFFBEF] p-0.5 border border-[#173C36]/15">
                  <button
                    onClick={() => {
                      setSelectedPeriod('AM');
                      setValidationError(null);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      selectedPeriod === 'AM' ? 'bg-[#173C36] text-white shadow-xs' : 'text-[#173C36]/70'
                    }`}
                  >
                    AM
                  </button>
                  <button
                    onClick={() => {
                      setSelectedPeriod('PM');
                      setValidationError(null);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      selectedPeriod === 'PM' ? 'bg-[#173C36] text-white shadow-xs' : 'text-[#173C36]/70'
                    }`}
                  >
                    PM
                  </button>
                </div>
              </div>
            </div>

            {/* Validation Error Banner (Edge case: user picks past time) */}
            {validationError && (
              <div className="p-3 bg-[#FDEDEC] border border-[#E74C3C]/30 rounded-2xl flex items-start gap-2 text-xs text-[#922B21] animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#E74C3C]" />
                <div className="space-y-1 flex-1">
                  <p className="font-semibold">{validationError}</p>
                  {selectedDay === 'today' && (
                    <button
                      onClick={() => {
                        setSelectedDay('tomorrow');
                        setValidationError(null);
                      }}
                      className="underline font-bold text-[#C0392B] hover:text-[#922B21]"
                    >
                      {strings.switchToTomorrow}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Confirm button */}
            <div className="pt-2">
              <button
                id="voice-reminder-confirm-time-btn"
                onClick={handleConfirmReminder}
                className="w-full py-3.5 rounded-full bg-[#173C36] hover:bg-[#1f4e46] active:scale-98 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>{strings.saveButton}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
