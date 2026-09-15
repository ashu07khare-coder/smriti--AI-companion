import { LanguageCode } from '../types';

class VoiceEngine {
  private synth: SpeechSynthesis | null = null;
  private audioCtx: AudioContext | null = null;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => {
          this.loadVoices();
        };
      }
    }
  }

  private loadVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    this.voices = this.synth.getVoices();
    return this.voices;
  }

  private getAudioContext(): AudioContext {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    return this.audioCtx!;
  }

  // Play a gentle, soothing chime using Web Audio API
  playGentleTone(type: 'chime' | 'success' | 'soft' = 'chime') {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      if (type === 'chime') {
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.15); // E5
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.7);
      } else if (type === 'success') {
        // Calm warm chord
        [523.25, 659.25, 783.99].forEach((freq, i) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = 'sine';
          o.frequency.setValueAtTime(freq, now + i * 0.1);
          g.gain.setValueAtTime(0.08, now + i * 0.1);
          g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.8);
          o.connect(g);
          g.connect(ctx.destination);
          o.start(now + i * 0.1);
          o.stop(now + i * 0.1 + 0.8);
        });
      } else {
        osc.frequency.setValueAtTime(440, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.4);
      }
    } catch {
      // Audio context might be restricted
    }
  }

  getLanguageTag(lang: LanguageCode = 'as'): string {
    const langMap: Record<LanguageCode, string> = {
      as: 'as-IN',
      brx: 'brx-IN',
      mni: 'mni-IN',
      lus: 'lus-IN',
      kha: 'kha-IN',
      grt: 'grt-IN',
      trp: 'trp-IN',
      nag: 'en-IN',
      ne: 'ne-NP',
      hi: 'hi-IN',
      en: 'en-IN',
    };
    return langMap[lang] || 'en-IN';
  }

  /**
   * Finds the highest quality Female Google Assistant voice available in the environment,
   * prioritizing Google's neural female voices, Google UK/US Female, and Indic regional Google voices.
   */
  getGoogleAssistantFemaleVoice(lang: LanguageCode = 'as'): SpeechSynthesisVoice | null {
    const allVoices = this.voices.length > 0 ? this.voices : this.loadVoices();
    if (!allVoices || allVoices.length === 0) return null;

    const langTag = this.getLanguageTag(lang);
    const langPrefix = langTag.split('-')[0].toLowerCase();

    // 1. Google Assistant Female voice specifically matching requested Indic language (e.g. Google हिन्दी, Google বাংলা)
    const googleLangFemale = allVoices.find(v => {
      const name = v.name.toLowerCase();
      const vLang = v.lang.toLowerCase();
      const isGoogle = name.includes('google');
      const isFemale = name.includes('female') || !name.includes('male');
      const matchesLang = vLang.startsWith(langTag.toLowerCase()) || vLang.startsWith(langPrefix);
      return isGoogle && isFemale && matchesLang;
    });
    if (googleLangFemale) return googleLangFemale;

    // 2. Iconic Google Assistant Female voices (Google UK English Female / Google US English)
    const googleUkFemale = allVoices.find(v => v.name.toLowerCase().includes('google uk english female'));
    if (googleUkFemale) return googleUkFemale;

    const googleUsFemale = allVoices.find(v => {
      const name = v.name.toLowerCase();
      return name === 'google us english' || (name.includes('google') && name.includes('female'));
    });
    if (googleUsFemale) return googleUsFemale;

    // 3. Google Eastern Indic voice (Google বাংলা / Bengali shares Assamese script & phonetics)
    if (lang === 'as' || lang === 'brx' || lang === 'mni') {
      const googleEastern = allVoices.find(v => {
        const name = v.name.toLowerCase();
        return name.includes('google') && (v.lang.includes('bn') || name.includes('বাংলা') || name.includes('bengali'));
      });
      if (googleEastern) return googleEastern;
    }

    // 4. Google Indian voice (Google हिन्दी)
    const googleIndian = allVoices.find(v => {
      const name = v.name.toLowerCase();
      return name.includes('google') && (v.lang.includes('in') || v.lang.includes('hi') || name.includes('hindi'));
    });
    if (googleIndian) return googleIndian;

    // 5. Any Google voice provided by Chromium / Android
    const anyGoogle = allVoices.find(v => v.name.toLowerCase().includes('google'));
    if (anyGoogle) return anyGoogle;

    // 6. High quality natural female assistant voices across OS platforms (Edge, Windows, macOS, iOS)
    const naturalFemale = allVoices.find(v => {
      const n = v.name.toLowerCase();
      return (
        n.includes('neerja') ||
        n.includes('swara') ||
        n.includes('heera') ||
        n.includes('jenny') ||
        n.includes('samantha') ||
        n.includes('karen') ||
        n.includes('zira') ||
        n.includes('female')
      );
    });
    if (naturalFemale) return naturalFemale;

    // 7. General language or Indian English fallback
    const langMatch = allVoices.find(v => v.lang.toLowerCase().startsWith(langPrefix) || v.lang.includes('IN'));
    if (langMatch) return langMatch;

    return allVoices[0] || null;
  }

  // Speak text in female Google Assistant voice
  speak(text: string, lang: LanguageCode = 'as', onEnd?: () => void) {
    if (!this.synth) {
      if (onEnd) onEnd();
      return;
    }

    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Google Assistant acoustic calibration:
    // Rate 0.93: conversational, clear, friendly tempo
    // Pitch 1.08: pleasant, warm, crisp female Google Assistant pitch
    utterance.rate = 0.93;
    utterance.pitch = 1.08;
    utterance.volume = 1.0;

    const selectedVoice = this.getGoogleAssistantFemaleVoice(lang);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    } else {
      utterance.lang = this.getLanguageTag(lang);
    }

    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      if (onEnd) onEnd();
    };

    this.synth.speak(utterance);
  }

  getActiveVoiceName(lang: LanguageCode = 'as'): string {
    const voice = this.getGoogleAssistantFemaleVoice(lang);
    return voice?.name || 'Google Assistant (Female)';
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  isSpeaking(): boolean {
    return !!this.synth?.speaking;
  }
}

export const bhashiniVoice = new VoiceEngine();
