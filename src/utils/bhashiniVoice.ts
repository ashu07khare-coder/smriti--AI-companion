import { LanguageCode } from '../types';

class VoiceEngine {
  private synth: SpeechSynthesis | null = null;
  private audioCtx: AudioContext | null = null;
  private voices: SpeechSynthesisVoice[] = [];

  // Playback state & chunking for long narrations
  private isStopped = true;
  private isPausedState = false;
  private currentChunks: string[] = [];
  private currentChunkIndex = 0;
  private currentLanguage: LanguageCode = 'en';
  private currentFullText = '';
  private onEndCallback: (() => void) | null = null;
  private onProgressCallback: ((percent: number) => void) | null = null;
  private keepAliveTimer: NodeJS.Timeout | null = null;

  // Ambient sound nodes
  private ambientGain: GainNode | null = null;
  private ambientSource: AudioBufferSourceNode | null = null;
  private ambientLfo: OscillatorNode | null = null;

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

  loadVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    const list = this.synth.getVoices();
    if (list && list.length > 0) {
      this.voices = list;
    }
    return this.voices;
  }

  private getAudioContext(): AudioContext | null {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  // Play a gentle, soothing chime using Web Audio API
  playGentleTone(type: 'chime' | 'success' | 'soft' = 'chime') {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      const now = ctx.currentTime;
      if (type === 'chime') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.15); // E5
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.7);
      } else if (type === 'success') {
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
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.4);
      }
    } catch {
      // Audio context might be restricted before interaction
    }
  }

  // Procedural soothing ambient river breeze generator using Web Audio
  startAmbientSound() {
    try {
      this.stopAmbientSound();
      const ctx = this.getAudioContext();
      if (!ctx) return;
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      // Generate 5 seconds of soft river stream noise
      const bufferSize = ctx.sampleRate * 4;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99765 * b0 + white * 0.05;
        b1 = 0.96300 * b1 + white * 0.11;
        b2 = 0.57000 * b2 + white * 0.55;
        data[i] = (b0 + b1 + b2) * 0.08;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;
      noiseSource.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 480;
      filter.Q.value = 1.2;

      // Gentle LFO for river current fluctuation
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.type = 'sine';
      lfo.frequency.value = 0.2; // 5-second gentle wave
      lfoGain.gain.value = 140;
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.05, ctx.currentTime);

      noiseSource.connect(filter);
      filter.connect(masterGain);
      masterGain.connect(ctx.destination);

      noiseSource.start();
      lfo.start();

      this.ambientSource = noiseSource;
      this.ambientGain = masterGain;
      this.ambientLfo = lfo;
    } catch (e) {
      console.warn('Ambient sound could not start:', e);
    }
  }

  stopAmbientSound() {
    try {
      if (this.ambientSource) {
        this.ambientSource.stop();
        this.ambientSource.disconnect();
        this.ambientSource = null;
      }
      if (this.ambientLfo) {
        this.ambientLfo.stop();
        this.ambientLfo.disconnect();
        this.ambientLfo = null;
      }
      if (this.ambientGain) {
        this.ambientGain.disconnect();
        this.ambientGain = null;
      }
    } catch {
      // Ignore
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
   * Returns a browser-supported Speech Recognition language tag.
   * Chromium webkitSpeechRecognition crashes if given unsupported tags like 'as-IN' or 'kha-IN'.
   */
  getSpeechRecognitionLanguage(lang: LanguageCode = 'en'): string {
    if (lang === 'hi') return 'hi-IN';
    if (lang === 'ne') return 'ne-NP';
    if (lang === 'as') return 'bn-IN'; // Closest phonetic Indic script in Google Speech API
    return 'en-IN'; // Universal Indian English recognition
  }

  /**
   * Split long text into natural sentence/clause chunks under ~160 characters.
   * This is required because Web Speech API in Chromium/Safari fails or hangs
   * on large multi-paragraph strings.
   */
  splitIntoChunks(text: string): string[] {
    if (!text) return [];
    const clean = text.replace(/\r\n/g, '\n').trim();
    if (!clean) return [];

    // Split on sentence boundaries
    const rawSegments = clean.split(/(?<=[.!?\n])\s+/);
    const chunks: string[] = [];

    for (const seg of rawSegments) {
      const trimmed = seg.trim();
      if (!trimmed) continue;

      if (trimmed.length <= 160) {
        chunks.push(trimmed);
      } else {
        // Split long sentence by clauses or commas
        const subSegments = trimmed.split(/(?<=[,;—–])\s+/);
        let current = '';
        for (const sub of subSegments) {
          if (!current) {
            current = sub;
          } else if ((current + ' ' + sub).length <= 160) {
            current += ' ' + sub;
          } else {
            chunks.push(current);
            current = sub;
          }
        }
        if (current) {
          if (current.length > 160) {
            const words = current.split(' ');
            let wordChunk = '';
            for (const w of words) {
              if ((wordChunk + ' ' + w).length <= 150) {
                wordChunk = wordChunk ? wordChunk + ' ' + w : w;
              } else {
                if (wordChunk) chunks.push(wordChunk);
                wordChunk = w;
              }
            }
            if (wordChunk) chunks.push(wordChunk);
          } else {
            chunks.push(current);
          }
        }
      }
    }

    return chunks.length > 0 ? chunks : [clean];
  }

  /**
   * Finds the best matching voice for a given chunk of text.
   * Ensures that English text gets a working English/Indian English voice,
   * while Indic script gets a matching Indic voice if available.
   */
  getVoiceForText(text: string, lang: LanguageCode = 'as'): { voice: SpeechSynthesisVoice | null; langTag: string } {
    const allVoices = this.voices.length > 0 ? this.voices : this.loadVoices();
    const hasIndicScript = /[\u0900-\u097F\u0980-\u09FF\u0ABC-\u0AFF\u0B00-\u0B7F\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF\u0D00-\u0D7F]/.test(text);

    if (hasIndicScript && allVoices.length > 0) {
      const langTag = this.getLanguageTag(lang);
      const prefix = langTag.split('-')[0].toLowerCase();
      const match = allVoices.find(v => {
        const vl = v.lang.toLowerCase();
        const vn = v.name.toLowerCase();
        if (vl.startsWith(prefix) || vn.includes(prefix)) return true;
        if (lang === 'as' && (vl.includes('bn') || vn.includes('বাংলা') || vn.includes('bengali'))) return true;
        if (vl.includes('hi') || vn.includes('hindi') || vn.includes('हिन्दी')) return true;
        return false;
      });
      if (match) return { voice: match, langTag: match.lang };
    }

    // Default / English narration
    const femaleAssistantVoice = this.getGoogleAssistantFemaleVoice(lang);
    if (femaleAssistantVoice) {
      return { voice: femaleAssistantVoice, langTag: femaleAssistantVoice.lang || 'en-IN' };
    }

    // High quality fallback
    const fallbackEn =
      allVoices.find(v => v.lang.toLowerCase().startsWith('en-in')) ||
      allVoices.find(v => v.lang.toLowerCase().startsWith('en')) ||
      allVoices[0] ||
      null;

    return {
      voice: fallbackEn,
      langTag: fallbackEn?.lang || 'en-IN',
    };
  }

  getGoogleAssistantFemaleVoice(lang: LanguageCode = 'as'): SpeechSynthesisVoice | null {
    const allVoices = this.voices.length > 0 ? this.voices : this.loadVoices();
    if (!allVoices || allVoices.length === 0) return null;

    const langTag = this.getLanguageTag(lang);
    const langPrefix = langTag.split('-')[0].toLowerCase();

    // 1. Google Assistant Female voice matching Indic language
    const googleLangFemale = allVoices.find(v => {
      const name = v.name.toLowerCase();
      const vLang = v.lang.toLowerCase();
      const isGoogle = name.includes('google');
      const isFemale = name.includes('female') || !name.includes('male');
      const matchesLang = vLang.startsWith(langTag.toLowerCase()) || vLang.startsWith(langPrefix);
      return isGoogle && isFemale && matchesLang;
    });
    if (googleLangFemale) return googleLangFemale;

    // 2. Google Indian English Female voice (e.g. Google English (India))
    const googleIndianFemale = allVoices.find(v => {
      const name = v.name.toLowerCase();
      const vLang = v.lang.toLowerCase();
      return name.includes('google') && (vLang.includes('en-in') || name.includes('india'));
    });
    if (googleIndianFemale) return googleIndianFemale;

    // 3. Iconic Google Assistant Female voices (Google UK English Female / Google US English)
    const googleUkFemale = allVoices.find(v => v.name.toLowerCase().includes('google uk english female'));
    if (googleUkFemale) return googleUkFemale;

    const googleUsFemale = allVoices.find(v => {
      const name = v.name.toLowerCase();
      return name === 'google us english' || (name.includes('google') && name.includes('female'));
    });
    if (googleUsFemale) return googleUsFemale;

    // 4. Any Google voice
    const anyGoogle = allVoices.find(v => v.name.toLowerCase().includes('google'));
    if (anyGoogle) return anyGoogle;

    // 5. Natural female assistant voices across OS platforms (Edge, macOS, iOS, Windows)
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
        n.includes('female') ||
        n.includes('veena')
      );
    });
    if (naturalFemale) return naturalFemale;

    // 6. Indian English or General English fallback
    const langMatch = allVoices.find(v => v.lang.toLowerCase().includes('en-in') || v.lang.toLowerCase().startsWith('en'));
    if (langMatch) return langMatch;

    return allVoices[0] || null;
  }

  private currentSpeechRate = 1.08;

  // Speak text with streaming chunk queue and progress reporting
  speak(
    text: string,
    lang: LanguageCode = 'as',
    onEnd?: () => void,
    onProgress?: (percent: number) => void,
    startPercent = 0,
    rate = 1.08
  ) {
    if (!this.synth) {
      if (onEnd) onEnd();
      return;
    }

    this.stop();

    this.isStopped = false;
    this.isPausedState = false;
    this.currentLanguage = lang;
    this.currentFullText = text;
    this.currentSpeechRate = rate;
    this.onEndCallback = onEnd || null;
    this.onProgressCallback = onProgress || null;
    this.currentChunks = this.splitIntoChunks(text);

    if (this.currentChunks.length === 0) {
      if (onEnd) onEnd();
      return;
    }

    if (startPercent > 0 && startPercent < 100) {
      this.currentChunkIndex = Math.floor((startPercent / 100) * this.currentChunks.length);
    } else {
      this.currentChunkIndex = 0;
    }

    this.startKeepAlive();
    this.playNextChunk();
  }

  private playNextChunk() {
    if (this.isStopped || !this.synth) return;

    if (this.currentChunkIndex >= this.currentChunks.length) {
      this.clearKeepAlive();
      this.isStopped = true;
      if (this.onProgressCallback) this.onProgressCallback(100);
      if (this.onEndCallback) this.onEndCallback();
      return;
    }

    const chunkText = this.currentChunks[this.currentChunkIndex];
    const { voice, langTag } = this.getVoiceForText(chunkText, this.currentLanguage);

    const utterance = new SpeechSynthesisUtterance(chunkText);
    utterance.rate = this.currentSpeechRate || 1.08;
    utterance.pitch = 1.04;
    utterance.volume = 1.0;

    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang || langTag;
    } else {
      utterance.lang = langTag;
    }

    utterance.onend = () => {
      if (this.isStopped) return;
      this.currentChunkIndex++;
      const progress = Math.min(
        100,
        Math.round((this.currentChunkIndex / this.currentChunks.length) * 100)
      );
      if (this.onProgressCallback) this.onProgressCallback(progress);
      this.playNextChunk();
    };

    utterance.onerror = (e) => {
      if (this.isStopped) return;
      // Advance to next chunk even on error so story doesn't stall
      console.warn('TTS chunk note:', e.error);
      this.currentChunkIndex++;
      this.playNextChunk();
    };

    try {
      if (this.synth.paused) {
        this.synth.resume();
      }
      this.synth.speak(utterance);
    } catch (e) {
      console.warn('SpeechSynthesis error:', e);
      this.currentChunkIndex++;
      this.playNextChunk();
    }
  }

  // Prevents Chromium from freezing speech synthesis after ~15 seconds
  private startKeepAlive() {
    this.clearKeepAlive();
    this.keepAliveTimer = setInterval(() => {
      if (this.synth && this.synth.speaking && !this.synth.paused) {
        this.synth.pause();
        this.synth.resume();
      }
    }, 9000);
  }

  private clearKeepAlive() {
    if (this.keepAliveTimer) {
      clearInterval(this.keepAliveTimer);
      this.keepAliveTimer = null;
    }
  }

  pause() {
    if (this.synth && this.synth.speaking) {
      this.isPausedState = true;
      this.synth.pause();
    }
  }

  resume() {
    if (this.synth && this.isPausedState) {
      this.isPausedState = false;
      this.synth.resume();
    } else if (this.isStopped && this.currentFullText) {
      this.speak(
        this.currentFullText,
        this.currentLanguage,
        this.onEndCallback || undefined,
        this.onProgressCallback || undefined,
        (this.currentChunkIndex / Math.max(1, this.currentChunks.length)) * 100
      );
    }
  }

  seek(
    targetPercent: number,
    lang: LanguageCode = this.currentLanguage,
    onEnd?: () => void,
    onProgress?: (percent: number) => void
  ) {
    const clamped = Math.max(0, Math.min(100, targetPercent));
    if (this.currentFullText) {
      this.speak(
        this.currentFullText,
        lang,
        onEnd || this.onEndCallback || undefined,
        onProgress || this.onProgressCallback || undefined,
        clamped
      );
    }
  }

  stop() {
    this.isStopped = true;
    this.isPausedState = false;
    this.clearKeepAlive();
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch {}
    }
  }

  isSpeaking(): boolean {
    return !this.isStopped && !!this.synth?.speaking;
  }

  isPaused(): boolean {
    return this.isPausedState;
  }

  getActiveVoiceName(lang: LanguageCode = 'as'): string {
    const { voice } = this.getVoiceForText('', lang);
    return voice?.name || 'Google Assistant (Female)';
  }
}

export const bhashiniVoice = new VoiceEngine();
