import { Reminder } from '../types';
import { AppStorage } from './storage';

export interface AudioRecordResult {
  audioDataUrl: string;
  durationSeconds: number;
}

class VoiceReminderScheduler {
  private intervalId: NodeJS.Timeout | null = null;
  private listeners: ((reminder: Reminder) => void)[] = [];
  private activeAudio: HTMLAudioElement | null = null;
  private activeReminder: Reminder | null = null;
  private repeatCount = 0;
  private maxRepeats = 3;
  private autoStopTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.startScheduler();
    this.requestNotificationPermission();
  }

  public requestNotificationPermission() {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission().catch(() => {});
      }
    }
  }

  public startScheduler() {
    if (this.intervalId) return;
    this.intervalId = setInterval(() => {
      this.checkScheduledReminders();
    }, 1000);
  }

  public stopScheduler() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public subscribe(callback: (reminder: Reminder) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  private checkScheduledReminders() {
    try {
      const reminders = AppStorage.getReminders();
      const now = Date.now();

      for (const rem of reminders) {
        // Only trigger pending voice reminders that have a scheduled_time
        if (
          rem.isVoiceReminder &&
          rem.audio_file_path &&
          (rem.status === 'pending' || rem.status === 'snoozed') &&
          !rem.completed &&
          rem.scheduled_time
        ) {
          const schedTime = new Date(rem.scheduled_time).getTime();
          if (schedTime <= now) {
            this.triggerAlarm(rem);
            break; // trigger one at a time
          }
        }
      }
    } catch (_) {}
  }

  public triggerAlarm(reminder: Reminder) {
    if (this.activeReminder && this.activeReminder.id === reminder.id) {
      return; // already active
    }

    this.activeReminder = reminder;
    this.repeatCount = 0;

    // 1. Post native browser notification
    try {
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        new Notification('Voice Reminder', {
          body: `It is time for your scheduled reminder: "${reminder.title || 'Voice Note'}"`,
          icon: '/favicon.ico',
          tag: reminder.id,
        });
      }
    } catch (_) {}

    // 2. Auto-play the ORIGINAL recorded audio immediately (no tap required)
    if (reminder.audio_file_path) {
      this.playRecordedAudio(reminder.audio_file_path, true);
    }

    // 3. Fallback auto-stop after 2 minutes if neither Stop nor Remind again is clicked
    if (this.autoStopTimer) clearTimeout(this.autoStopTimer);
    this.autoStopTimer = setTimeout(() => {
      this.handleAutoStopFallback();
    }, 120000); // 2 minutes

    // 4. Notify UI listeners so the in-app notification sheet pops up
    this.listeners.forEach(cb => cb(reminder));
  }

  public playRecordedAudio(audioUrl: string, loopOnEnd = false): HTMLAudioElement {
    this.stopAudioPlayback();
    const audio = new Audio(audioUrl);
    this.activeAudio = audio;
    audio.crossOrigin = 'anonymous';

    if (loopOnEnd) {
      audio.onended = () => {
        this.repeatCount++;
        if (this.repeatCount < this.maxRepeats && this.activeReminder) {
          // brief pause before repeating
          setTimeout(() => {
            if (this.activeReminder && this.activeAudio === audio) {
              audio.play().catch(() => {});
            }
          }, 1500);
        } else {
          // Reached repeat limit
          this.handleAutoStopFallback();
        }
      };
    }

    audio.play().catch(err => {
      console.warn('Audio auto-play prevented by browser policy, awaiting interaction:', err);
    });

    return audio;
  }

  public stopAudioPlayback() {
    if (this.activeAudio) {
      try {
        this.activeAudio.pause();
        this.activeAudio.currentTime = 0;
      } catch (_) {}
      this.activeAudio = null;
    }
  }

  public handleStop(reminderId: string): Reminder | null {
    this.stopAudioPlayback();
    if (this.autoStopTimer) {
      clearTimeout(this.autoStopTimer);
      this.autoStopTimer = null;
    }

    const reminders = AppStorage.getReminders();
    const found = reminders.find(r => r.id === reminderId);
    if (found) {
      found.status = 'delivered';
      found.completed = true;
      AppStorage.saveReminder(found);
    }

    this.activeReminder = null;
    return found || null;
  }

  public handleRemindAgain(reminderId: string, snoozeMinutes = 10): Reminder | null {
    this.stopAudioPlayback();
    if (this.autoStopTimer) {
      clearTimeout(this.autoStopTimer);
      this.autoStopTimer = null;
    }

    const snoozeTime = new Date(Date.now() + snoozeMinutes * 60 * 1000);
    const timeFormatted = snoozeTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

    const reminders = AppStorage.getReminders();
    const found = reminders.find(r => r.id === reminderId);
    if (found) {
      found.status = 'snoozed';
      found.completed = false;
      found.scheduled_time = snoozeTime.toISOString();
      found.time = timeFormatted;
      found.subtitle = `Voice Reminder · Snoozed to ${timeFormatted}`;
      AppStorage.saveReminder(found);
    }

    this.activeReminder = null;
    return found || null;
  }

  private handleAutoStopFallback() {
    this.stopAudioPlayback();
    if (this.activeReminder) {
      const reminders = AppStorage.getReminders();
      const found = reminders.find(r => r.id === this.activeReminder?.id);
      if (found) {
        found.status = 'delivered';
        AppStorage.saveReminder(found);
      }
      this.activeReminder = null;
    }
  }

  public getActiveReminder(): Reminder | null {
    return this.activeReminder;
  }
}

export const voiceReminderScheduler = new VoiceReminderScheduler();

// Audio Recorder Helper using Web MediaRecorder
export class AudioRecorderHelper {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private startTime = 0;
  private stream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;

  async startRecording(onVolumeLevel?: (level: number) => void): Promise<void> {
    this.audioChunks = [];
    this.startTime = Date.now();

    try {
      if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        // Setup audio analyser for waveform visualizer
        try {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContextClass) {
            this.audioContext = new AudioContextClass();
            const source = this.audioContext.createMediaStreamSource(this.stream);
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 64;
            source.connect(this.analyser);

            if (onVolumeLevel) {
              const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
              const checkVolume = () => {
                if (this.analyser && this.mediaRecorder && this.mediaRecorder.state === 'recording') {
                  this.analyser.getByteFrequencyData(dataArray);
                  let sum = 0;
                  for (let i = 0; i < dataArray.length; i++) {
                    sum += dataArray[i];
                  }
                  const avg = sum / dataArray.length;
                  const normalized = Math.min(100, Math.round((avg / 255) * 100));
                  onVolumeLevel(normalized);
                  requestAnimationFrame(checkVolume);
                }
              };
              requestAnimationFrame(checkVolume);
            }
          }
        } catch (_) {}

        // Pick supported mime type
        let mimeType = 'audio/webm';
        if (typeof MediaRecorder !== 'undefined') {
          if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
            mimeType = 'audio/webm;codecs=opus';
          } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
            mimeType = 'audio/mp4';
          } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
            mimeType = 'audio/ogg';
          }
        }

        this.mediaRecorder = new MediaRecorder(this.stream, { mimeType });
        this.mediaRecorder.ondataavailable = e => {
          if (e.data && e.data.size > 0) {
            this.audioChunks.push(e.data);
          }
        };
        this.mediaRecorder.start(100);
        return;
      }
    } catch (e) {
      console.warn('Microphone access unavailable or denied, switching to synthesized voice recorder fallback:', e);
    }

    // Fallback if mic unavailable
    this.mediaRecorder = null;
  }

  async stopRecording(): Promise<AudioRecordResult> {
    const elapsedSeconds = Math.max(1, Math.round((Date.now() - this.startTime) / 1000));

    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      return new Promise((resolve) => {
        if (!this.mediaRecorder) return;

        this.mediaRecorder.onstop = async () => {
          const blob = new Blob(this.audioChunks, { type: this.mediaRecorder?.mimeType || 'audio/webm' });
          this.cleanup();

          // Convert to Base64 data URL for offline storage
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({
              audioDataUrl: reader.result as string,
              durationSeconds: elapsedSeconds,
            });
          };
          reader.readAsDataURL(blob);
        };

        this.mediaRecorder.stop();
      });
    }

    this.cleanup();
    // Generate an offline synthetic gentle chime wave audio as a reliable fallback
    const fallbackAudio = this.createSyntheticAudioTone(elapsedSeconds);
    return {
      audioDataUrl: fallbackAudio,
      durationSeconds: elapsedSeconds,
    };
  }

  private cleanup() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.audioContext) {
      try {
        this.audioContext.close();
      } catch (_) {}
      this.audioContext = null;
    }
    this.analyser = null;
  }

  // Creates a clean, audible PCM WAV Data URL offline fallback
  private createSyntheticAudioTone(durationSec: number): string {
    try {
      const sampleRate = 22050;
      const numSamples = Math.min(durationSec, 5) * sampleRate;
      const buffer = new ArrayBuffer(44 + numSamples * 2);
      const view = new DataView(buffer);

      const writeString = (offset: number, str: string) => {
        for (let i = 0; i < str.length; i++) {
          view.setUint8(offset + i, str.charCodeAt(i));
        }
      };

      writeString(0, 'RIFF');
      view.setUint32(4, 36 + numSamples * 2, true);
      writeString(8, 'WAVE');
      writeString(12, 'fmt ');
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true); // PCM
      view.setUint16(22, 1, true); // Mono
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, sampleRate * 2, true);
      view.setUint16(32, 2, true);
      view.setUint16(34, 16, true);
      writeString(36, 'data');
      view.setUint32(40, numSamples * 2, true);

      // Generate a soothing two-tone chime
      for (let i = 0; i < numSamples; i++) {
        const t = i / sampleRate;
        const freq = t < 1.0 ? 523.25 : 659.25; // C5 to E5 harmonic chime
        const envelope = Math.exp(-t * 0.8);
        const sample = Math.sin(2 * Math.PI * freq * t) * envelope * 0.5;
        view.setInt16(44 + i * 2, sample * 0x7fff, true);
      }

      const blob = new Blob([buffer], { type: 'audio/wav' });
      return URL.createObjectURL(blob);
    } catch {
      return '';
    }
  }
}
