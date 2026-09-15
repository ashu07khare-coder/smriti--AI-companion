import { GoogleGenAI } from '@google/genai';

let geminiClient: GoogleGenAI | null = null;
let lastApiKey: string | null = null;

export function getGemini(explicitApiKey?: string): GoogleGenAI | null {
  const apiKey = explicitApiKey || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }

  if (geminiClient && lastApiKey === apiKey) {
    return geminiClient;
  }

  try {
    lastApiKey = apiKey;
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    return geminiClient;
  } catch (err) {
    console.error('[Gemini] Failed to initialize GoogleGenAI client:', err);
    return null;
  }
}

export function isGeminiConfigured(): boolean {
  return !!process.env.GEMINI_API_KEY;
}

