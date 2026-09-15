import { LanguageCode } from '../types';

/**
 * Bhashini (Digital India Bhashini Division / National Language Translation Mission) API Client
 *
 * Provides Indic and North-Eastern language speech-to-text (ASR), translation (NMT),
 * and text-to-speech (TTS) with native support for regional languages including Assamese (অসমীয়া).
 */

export interface BhashiniConfig {
  userId?: string;
  apiKey?: string;
  inferenceApiKey?: string;
  pipelineEndpoint?: string;
  pipelineConfigEndpoint?: string;
}

export interface BhashiniServiceCredentials {
  serviceId?: string;
  apiKey?: string;
}

export interface BhashiniPipelineResponse {
  pipelineResponse?: Array<{
    taskType: 'asr' | 'translation' | 'tts';
    output?: Array<{
      source?: string;
      target?: string;
    }>;
    audio?: Array<{
      audioContent?: string;
      audioUri?: string;
    }>;
  }>;
}

export interface SpeechTranslationResult {
  transcript: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
}

export interface ReadAloudOptions {
  gender?: 'female' | 'male';
  rate?: number;
  pitch?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: Error) => void;
}

// Bhashini / ULCA Language Code mapping
export const BHASHINI_LANG_MAP: Record<string, { bhashiniCode: string; bcp47: string; name: string; nativeName: string }> = {
  as: { bhashiniCode: 'as', bcp47: 'as-IN', name: 'Assamese', nativeName: 'অসমীয়া' },
  brx: { bhashiniCode: 'brx', bcp47: 'brx-IN', name: 'Bodo', nativeName: 'बर’' },
  mni: { bhashiniCode: 'mni', bcp47: 'mni-IN', name: 'Meitei (Manipuri)', nativeName: 'মৈতৈলোন্' },
  lus: { bhashiniCode: 'lus', bcp47: 'lus-IN', name: 'Mizo', nativeName: 'Mizo ṭawng' },
  kha: { bhashiniCode: 'kha', bcp47: 'kha-IN', name: 'Khasi', nativeName: 'Ka Ktien Khasi' },
  grt: { bhashiniCode: 'grt', bcp47: 'grt-IN', name: 'Garo', nativeName: 'A·chik' },
  trp: { bhashiniCode: 'trp', bcp47: 'trp-IN', name: 'Kokborok', nativeName: 'Kokborok' },
  nag: { bhashiniCode: 'nag', bcp47: 'en-IN', name: 'Nagamese', nativeName: 'Nagamese' },
  ne: { bhashiniCode: 'ne', bcp47: 'ne-NP', name: 'Nepali', nativeName: 'नेपाली' },
  hi: { bhashiniCode: 'hi', bcp47: 'hi-IN', name: 'Hindi', nativeName: 'हिन्दी' },
  bn: { bhashiniCode: 'bn', bcp47: 'bn-IN', name: 'Bengali', nativeName: 'বাংলা' },
  en: { bhashiniCode: 'en', bcp47: 'en-IN', name: 'Indian English', nativeName: 'English' },
};

/**
 * Converts a Blob to a base64 encoded string without the data URL prefix.
 */
export async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Track currently playing audio to allow immediate cancellation
 */
let currentPlayingAudio: HTMLAudioElement | null = null;

export class BhashiniClient {
  private config: BhashiniConfig;

  constructor(config?: BhashiniConfig) {
    this.config = {
      pipelineEndpoint: 'https://dhruva-api.bhashini.gov.in/services/inference/pipeline',
      pipelineConfigEndpoint: 'https://meity-auth.ulcacontrib.org/ulca/apis/v0/model/getModelsPipeline',
      ...config,
    };
  }

  /**
   * Update configuration at runtime (e.g. from user profile or settings)
   */
  setConfig(newConfig: Partial<BhashiniConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  getConfig(): BhashiniConfig {
    return { ...this.config };
  }

  isConfigured(): boolean {
    return !!(this.config.inferenceApiKey || this.config.apiKey);
  }

  /**
   * Maps an app LanguageCode to standard Bhashini 2-character / ULCA code
   */
  getBhashiniCode(lang: LanguageCode | string): string {
    const normalized = (lang || 'as').toLowerCase().trim();
    return BHASHINI_LANG_MAP[normalized]?.bhashiniCode || normalized;
  }

  /**
   * Maps an app LanguageCode to BCP-47 locale code for browser speech synthesis fallback
   */
  getBcp47Code(lang: LanguageCode | string): string {
    const normalized = (lang || 'as').toLowerCase().trim();
    return BHASHINI_LANG_MAP[normalized]?.bcp47 || 'en-IN';
  }

  /**
   * Transcribe user speech to text (ASR - Automatic Speech Recognition)
   *
   * @param audioInput - Blob of recorded speech (e.g. WAV/MP3) or base64 audio string
   * @param languageCode - Regional language code (e.g. 'as' for Assamese, 'hi', 'en')
   * @returns Transcribed text in native script
   */
  async transcribeSpeech(
    audioInput: Blob | string,
    languageCode: LanguageCode | string = 'as'
  ): Promise<string> {
    const base64Audio = typeof audioInput === 'string' ? audioInput : await blobToBase64(audioInput);
    const sourceLang = this.getBhashiniCode(languageCode);

    // 1. Try Bhashini inference API if credentials are provided
    if (this.config.inferenceApiKey || this.config.apiKey) {
      try {
        const payload = {
          pipelineTasks: [
            {
              taskType: 'asr',
              config: {
                language: {
                  sourceLanguage: sourceLang,
                },
                audioFormat: 'wav',
                samplingRate: 16000,
              },
            },
          ],
          inputData: {
            audio: [
              {
                audioContent: base64Audio,
              },
            ],
          },
        };

        const response = await fetch(this.config.pipelineEndpoint!, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: this.config.inferenceApiKey || this.config.apiKey || '',
            ...(this.config.userId ? { userID: this.config.userId } : {}),
            ...(this.config.apiKey ? { ulcaApiKey: this.config.apiKey } : {}),
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const data: BhashiniPipelineResponse = await response.json();
          const taskOutput = data.pipelineResponse?.find(t => t.taskType === 'asr');
          const recognizedText = taskOutput?.output?.[0]?.source;
          if (recognizedText) {
            return recognizedText.trim();
          }
        }
      } catch (err) {
        console.warn('[Bhashini] Direct ASR call failed, trying server proxy or Web Speech:', err);
      }
    }

    // 2. Try server-side proxy route if available
    try {
      const serverRes = await fetch('/api/v1/bhashini/asr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioContent: base64Audio,
          languageCode: sourceLang,
        }),
      });

      if (serverRes.ok) {
        const serverData = await serverRes.json();
        if (serverData.transcript) {
          return serverData.transcript;
        }
      }
    } catch {
      // Ignore and continue to fallback
    }

    throw new Error(`Unable to transcribe audio for language ${sourceLang}. Please check audio format or Bhashini credentials.`);
  }

  /**
   * Translate text between Indic regional languages and English/Hindi (NMT)
   *
   * @param text - Source text to translate
   * @param sourceLanguage - Source language code (e.g. 'as', 'hi', 'en')
   * @param targetLanguage - Target language code (e.g. 'en', 'as')
   * @returns Translated text
   */
  async translateText(
    text: string,
    sourceLanguage: LanguageCode | string,
    targetLanguage: LanguageCode | string
  ): Promise<string> {
    if (!text || !text.trim()) return '';

    const src = this.getBhashiniCode(sourceLanguage);
    const tgt = this.getBhashiniCode(targetLanguage);

    if (src === tgt) return text;

    // 1. Direct Bhashini Pipeline API
    if (this.config.inferenceApiKey || this.config.apiKey) {
      try {
        const payload = {
          pipelineTasks: [
            {
              taskType: 'translation',
              config: {
                language: {
                  sourceLanguage: src,
                  targetLanguage: tgt,
                },
              },
            },
          ],
          inputData: {
            input: [
              {
                source: text,
              },
            ],
          },
        };

        const response = await fetch(this.config.pipelineEndpoint!, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: this.config.inferenceApiKey || this.config.apiKey || '',
            ...(this.config.userId ? { userID: this.config.userId } : {}),
            ...(this.config.apiKey ? { ulcaApiKey: this.config.apiKey } : {}),
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const data: BhashiniPipelineResponse = await response.json();
          const taskOutput = data.pipelineResponse?.find(t => t.taskType === 'translation');
          const translated = taskOutput?.output?.[0]?.target;
          if (translated) {
            return translated.trim();
          }
        }
      } catch (err) {
        console.warn('[Bhashini] Direct NMT call failed, trying server translation proxy:', err);
      }
    }

    // 2. Server-side proxy translation (with Gemini / Indic LLM fallback)
    try {
      const serverRes = await fetch('/api/v1/bhashini/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          sourceLanguage: src,
          targetLanguage: tgt,
        }),
      });

      if (serverRes.ok) {
        const serverData = await serverRes.json();
        if (serverData.translatedText) {
          return serverData.translatedText;
        }
      }
    } catch (err) {
      console.warn('[Bhashini] Server proxy translation unavailable:', err);
    }

    return text;
  }

  /**
   * Convert text to speech (TTS) using Bhashini regional voices
   *
   * @param text - Text content to convert to speech
   * @param languageCode - Regional language (e.g. 'as', 'brx', 'hi')
   * @param options - Gender and speed preferences
   * @returns Base64 audio content or audio URI
   */
  async synthesizeSpeech(
    text: string,
    languageCode: LanguageCode | string = 'as',
    options: { gender?: 'female' | 'male'; rate?: number } = {}
  ): Promise<{ audioContent?: string; audioUri?: string }> {
    const srcLang = this.getBhashiniCode(languageCode);
    const gender = options.gender || 'female';

    // 1. Direct Bhashini Pipeline API
    if (this.config.inferenceApiKey || this.config.apiKey) {
      try {
        const payload = {
          pipelineTasks: [
            {
              taskType: 'tts',
              config: {
                language: {
                  sourceLanguage: srcLang,
                },
                gender,
              },
            },
          ],
          inputData: {
            input: [
              {
                source: text,
              },
            ],
          },
        };

        const response = await fetch(this.config.pipelineEndpoint!, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: this.config.inferenceApiKey || this.config.apiKey || '',
            ...(this.config.userId ? { userID: this.config.userId } : {}),
            ...(this.config.apiKey ? { ulcaApiKey: this.config.apiKey } : {}),
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const data: BhashiniPipelineResponse = await response.json();
          const taskOutput = data.pipelineResponse?.find(t => t.taskType === 'tts');
          const audio = taskOutput?.audio?.[0];
          if (audio?.audioContent || audio?.audioUri) {
            return {
              audioContent: audio.audioContent,
              audioUri: audio.audioUri,
            };
          }
        }
      } catch (err) {
        console.warn('[Bhashini] Direct TTS call failed:', err);
      }
    }

    // 2. Server-side proxy
    try {
      const serverRes = await fetch('/api/v1/bhashini/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          languageCode: srcLang,
          gender,
        }),
      });

      if (serverRes.ok) {
        const serverData = await serverRes.json();
        if (serverData.audioContent || serverData.audioUri) {
          return {
            audioContent: serverData.audioContent,
            audioUri: serverData.audioUri,
          };
        }
      }
    } catch {
      // Fall through
    }

    return {};
  }
}

// Global singleton client instance
export const bhashiniClient = new BhashiniClient();

/**
 * Translates recorded user speech from a regional language (e.g. Assamese)
 * into a target language (e.g. English, Hindi, or another regional language).
 *
 * @param audioInput - Blob recorded from the user's microphone or base64 audio string
 * @param sourceLanguage - Language of the user speaking (e.g. 'as', 'mni', 'hi')
 * @param targetLanguage - Desired translation output language (e.g. 'en', 'as')
 * @returns Object with the original transcript and the translated text
 */
export async function translateUserSpeech(
  audioInput: Blob | string,
  sourceLanguage: LanguageCode | string = 'as',
  targetLanguage: LanguageCode | string = 'en'
): Promise<SpeechTranslationResult> {
  const transcript = await bhashiniClient.transcribeSpeech(audioInput, sourceLanguage);
  const translatedText = await bhashiniClient.translateText(transcript, sourceLanguage, targetLanguage);

  return {
    transcript,
    translatedText,
    sourceLang: sourceLanguage,
    targetLang: targetLanguage,
  };
}

/**
 * Transcribes user speech in a regional language without translation.
 */
export async function transcribeUserSpeech(
  audioInput: Blob | string,
  languageCode: LanguageCode | string = 'as'
): Promise<string> {
  return bhashiniClient.transcribeSpeech(audioInput, languageCode);
}

/**
 * Translates arbitrary text between regional languages using Bhashini.
 */
export async function translateText(
  text: string,
  sourceLang: LanguageCode | string,
  targetLang: LanguageCode | string
): Promise<string> {
  return bhashiniClient.translateText(text, sourceLang, targetLang);
}

/**
 * Reads aloud app content in the selected regional language.
 *
 * It first attempts to synthesize authentic Indic regional speech via the Bhashini TTS API.
 * If audio content is returned, it plays it through an HTMLAudioElement.
 * If Bhashini credentials or connection are not available, it seamlessly falls back
 * to the browser's Web Speech API with regional BCP-47 tuning (e.g. as-IN, bn-IN, hi-IN)
 * and soothing rate/pitch controls tailored for elderly listeners.
 *
 * @param text - The message, reminder, or story to read aloud
 * @param languageCode - The language to speak (e.g. 'as' for Assamese, 'hi', 'en')
 * @param options - Customization callbacks, gender, and playback rate
 */
export async function readAloudContent(
  text: string,
  languageCode: LanguageCode | string = 'as',
  options: ReadAloudOptions = {}
): Promise<void> {
  if (!text || !text.trim()) return;

  // Stop any currently ongoing speech or audio
  stopReadingAloud();

  options.onStart?.();

  try {
    // 1. Attempt Bhashini TTS
    const ttsResult = await bhashiniClient.synthesizeSpeech(text, languageCode, {
      gender: options.gender || 'female',
      rate: options.rate || 0.9,
    });

    if (ttsResult.audioContent || ttsResult.audioUri) {
      const audioSource = ttsResult.audioUri || `data:audio/wav;base64,${ttsResult.audioContent}`;
      const audio = new Audio(audioSource);
      currentPlayingAudio = audio;

      return new Promise<void>((resolve, reject) => {
        audio.onended = () => {
          currentPlayingAudio = null;
          options.onEnd?.();
          resolve();
        };

        audio.onerror = () => {
          currentPlayingAudio = null;
          const err = new Error('Audio playback failed');
          options.onError?.(err);
          // Fall back to browser Web Speech API
          fallbackBrowserSpeech(text, languageCode, options, resolve, reject);
        };

        audio.play().catch(err => {
          console.warn('[Bhashini] Audio element play error, falling back to Web Speech:', err);
          fallbackBrowserSpeech(text, languageCode, options, resolve, reject);
        });
      });
    }
  } catch (err) {
    console.warn('[Bhashini] TTS service error, using Web Speech fallback:', err);
  }

  // 2. Web Speech API fallback with regional BCP-47 tag matching
  return new Promise<void>((resolve, reject) => {
    fallbackBrowserSpeech(text, languageCode, options, resolve, reject);
  });
}

/**
 * Fallback browser speech synthesizer using tuned BCP-47 tags
 */
function fallbackBrowserSpeech(
  text: string,
  languageCode: LanguageCode | string,
  options: ReadAloudOptions,
  resolve: () => void,
  reject: (err: any) => void
) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    options.onEnd?.();
    resolve();
    return;
  }

  const synth = window.speechSynthesis;
  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  // Female Google Assistant calibration:
  utterance.rate = options.rate ?? 0.93;
  utterance.pitch = options.pitch ?? 1.08;
  utterance.volume = 1.0;

  const bcp47 = bhashiniClient.getBcp47Code(languageCode);
  utterance.lang = bcp47;

  // Search available synthesizer voices, prioritizing female Google Assistant voice
  const voices = synth.getVoices();
  const matchedVoice =
    voices.find(v => {
      const n = v.name.toLowerCase();
      return n.includes('google') && (n.includes('female') || v.lang.toLowerCase().startsWith(bcp47.toLowerCase()));
    }) ||
    voices.find(v => v.name.toLowerCase().includes('google uk english female')) ||
    voices.find(v => v.name.toLowerCase() === 'google us english') ||
    voices.find(v => v.name.toLowerCase().includes('google')) ||
    voices.find(v => {
      const n = v.name.toLowerCase();
      return n.includes('neerja') || n.includes('swara') || n.includes('samantha') || n.includes('female');
    }) ||
    voices.find(v => v.lang.toLowerCase().startsWith(bcp47.toLowerCase()));

  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  utterance.onend = () => {
    options.onEnd?.();
    resolve();
  };

  utterance.onerror = (e) => {
    const error = new Error(`Speech synthesis error: ${e.error}`);
    options.onError?.(error);
    options.onEnd?.();
    resolve(); // resolve to prevent unhandled rejections
  };

  synth.speak(utterance);
}

/**
 * Cancels any ongoing read-aloud playback (both Bhashini audio elements and browser speech synthesis)
 */
export function stopReadingAloud(): void {
  if (currentPlayingAudio) {
    try {
      currentPlayingAudio.pause();
      currentPlayingAudio.currentTime = 0;
    } catch {
      // Ignore pause error
    }
    currentPlayingAudio = null;
  }

  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Helper to record audio from user microphone for a given duration or until manually stopped.
 */
export async function recordUserMicrophone(maxDurationMs = 7000): Promise<{ blob: Blob; stop: () => Blob }> {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error('Microphone access is not supported in this browser environment.');
  }

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mediaRecorder = new MediaRecorder(stream);
  const audioChunks: BlobPart[] = [];

  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      audioChunks.push(event.data);
    }
  };

  mediaRecorder.start();

  return new Promise((resolve) => {
    const stopRecording = () => {
      if (mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
      }
      stream.getTracks().forEach(track => track.stop());
      return new Blob(audioChunks, { type: 'audio/wav' });
    };

    setTimeout(() => {
      if (mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
      }
      stream.getTracks().forEach(track => track.stop());
      const finalBlob = new Blob(audioChunks, { type: 'audio/wav' });
      resolve({ blob: finalBlob, stop: stopRecording });
    }, maxDurationMs);
  });
}
