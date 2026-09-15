import { GoogleGenAI } from '@google/genai';

const clientCache = new Map<string, GoogleGenAI>();

export function getAllGeminiKeys(): string[] {
  const keys: string[] = [];

  // Check specific keys in priority order
  const rawList = [
    process.env.GEMINI_API_KEY,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
    process.env.GEMINI_API_KEYS,
    process.env.VITE_GEMINI_API_KEY,
    process.env.VITE_GEMINI_API_KEY_2,
    process.env.VITE_GEMINI_API_KEY_3,
  ];

  // Also include any GEMINI_API_KEY_* defined in process.env
  for (const envKey of Object.keys(process.env)) {
    if (envKey.startsWith('GEMINI_API_KEY') || envKey.startsWith('VITE_GEMINI_API_KEY')) {
      const val = process.env[envKey];
      if (val && !rawList.includes(val)) {
        rawList.push(val);
      }
    }
  }

  for (const item of rawList) {
    if (!item) continue;
    const parts = item.split(',').map(s => s.trim()).filter(Boolean);
    for (const part of parts) {
      if (!keys.includes(part)) {
        keys.push(part);
      }
    }
  }

  return keys;
}

export function getGemini(explicitApiKey?: string): GoogleGenAI | null {
  const apiKey = explicitApiKey || getAllGeminiKeys()[0];
  if (!apiKey) {
    return null;
  }

  if (clientCache.has(apiKey)) {
    return clientCache.get(apiKey)!;
  }

  try {
    const client = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    clientCache.set(apiKey, client);
    return client;
  } catch (err) {
    console.error('[Gemini] Failed to initialize GoogleGenAI client:', err);
    return null;
  }
}

export function isGeminiConfigured(): boolean {
  return getAllGeminiKeys().length > 0;
}


