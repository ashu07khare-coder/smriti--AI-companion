/**
 * Bhashini (National Language Translation Mission) Orchestration Layer
 *
 * Provides regional Indic and North-Eastern language routing:
 * - Maps languages to Bhashini language tags & scripts
 * - Normalizes inputs and prompts for local dialects (Assamese, Bodo, Meitei,
 *   Mizo, Khasi, Garo, Kokborok, Nagamese, Nepali, Hindi, and Indian English)
 * - Structures culturally sensitive persona guidelines for dementia and elder care
 * - Adds conversational phonetics and TTS SSML markers where applicable
 */

export interface BhashiniLanguageProfile {
  code: string;
  name: string;
  nativeName: string;
  bhashiniCode: string; // ISO 639-3 / Bhashini language code
  script: string;
  greetingExample: string;
  culturalHonorific: string; // E.g., Aita / Koka, Baideo, Didi, Ji
  culturalContext: string;
}

export const BHASHINI_PROFILES: Record<string, BhashiniLanguageProfile> = {
  as: {
    code: 'as',
    name: 'Assamese',
    nativeName: 'অসমীয়া',
    bhashiniCode: 'asm',
    script: 'Bengali-Assamese',
    greetingExample: 'নমস্কাৰ! আপুনি ভালে আছেনে?',
    culturalHonorific: 'আইতা / ককা (Aita / Koka)',
    culturalContext: 'Respectful, serene, traditional Assamese warmth. Mention peaceful tea gardens, Naamghar chimes, and family affection when soothing.',
  },
  brx: {
    code: 'brx',
    name: 'Bodo',
    nativeName: 'बर’',
    bhashiniCode: 'brx',
    script: 'Devanagari',
    greetingExample: 'खुमुलुं! नोंथाङा मोजाङै दं नामा?',
    culturalHonorific: 'आबै / आबौ (Abwi / Abou)',
    culturalContext: 'Warm, respectful Bodo tone with reverence for elders and nature.',
  },
  mni: {
    code: 'mni',
    name: 'Meitei / Manipuri',
    nativeName: 'মৈতৈলোন্',
    bhashiniCode: 'mni',
    script: 'Bengali / Meitei Mayek',
    greetingExample: 'খুরুমজরি! অদোম নুংঙাইরিবা?',
    culturalHonorific: 'ইবেম্মা / ইবুংগো (Ibenma / Ibungo)',
    culturalContext: 'Gentle, gracious Manipuri cultural respect and soothing cadence.',
  },
  lus: {
    code: 'lus',
    name: 'Mizo',
    nativeName: 'Mizo ṭawng',
    bhashiniCode: 'lus',
    script: 'Latin',
    greetingExample: 'Chibai! Vawiinah eng nge i an le?',
    culturalHonorific: 'Pi / Pu',
    culturalContext: 'Courteous, community-spirited Mizo values (Tlawmngaihna) and peaceful tone.',
  },
  kha: {
    code: 'kha',
    name: 'Khasi',
    nativeName: 'Ka Ktien Khasi',
    bhashiniCode: 'kha',
    script: 'Latin',
    greetingExample: 'Khublei shibun! Kumno phi sngew mynta?',
    culturalHonorific: 'Mei-ieid / Pa-ieid',
    culturalContext: 'Matrilineal, deep familial reverence in Khasi hills tradition.',
  },
  grt: {
    code: 'grt',
    name: 'Garo',
    nativeName: 'A·chik',
    bhashiniCode: 'grt',
    script: 'Latin',
    greetingExample: 'Mitingalo! Nang·na mai namgipa kobor donga?',
    culturalHonorific: 'Ambi / Achu',
    culturalContext: 'Garo traditional warmth, caring elder guidance and peace.',
  },
  trp: {
    code: 'trp',
    name: 'Kokborok',
    nativeName: 'Kokborok',
    bhashiniCode: 'trp',
    script: 'Latin / Bengali',
    greetingExample: 'Khulumkha! Nini bwrwi tong?',
    culturalHonorific: 'Achu / Ambai',
    culturalContext: 'Tripura Kokborok community affection and gentle reassurance.',
  },
  nag: {
    code: 'nag',
    name: 'Nagamese',
    nativeName: 'Nagamese Creole',
    bhashiniCode: 'nag',
    script: 'Latin / Assamese',
    greetingExample: 'Namaste! Aji kisa asey? Moi apuni logot kotha koribo ahey.',
    culturalHonorific: 'Aaji / Aata',
    culturalContext: 'Colloquial North-Eastern lingua franca, easy comprehension, comforting words.',
  },
  ne: {
    code: 'ne',
    name: 'Nepali',
    nativeName: 'नेपाली',
    bhashiniCode: 'nep',
    script: 'Devanagari',
    greetingExample: 'नमस्ते हजुर! सन्चै हुनुहुन्छ?',
    culturalHonorific: 'हजुरआमा / हजुरबुवा (Hajurama / Hajurbuwa)',
    culturalContext: 'Deeply polite, using high-honorifics ("हजुर", "तपाईँ") appropriate for Himalayan & NE elders.',
  },
  hi: {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    bhashiniCode: 'hin',
    script: 'Devanagari',
    greetingExample: 'नमस्ते जी! आप आज कैसा महसूस कर रहे हैं?',
    culturalHonorific: 'दादी जी / नाना जी (Ji / Dadi ji / Baba ji)',
    culturalContext: 'Warm, respectful Hindustani with gentle, peaceful vocabulary.',
  },
  en: {
    code: 'en',
    name: 'Indian English',
    nativeName: 'English',
    bhashiniCode: 'eng',
    script: 'Latin',
    greetingExample: 'Namaskar! How are you feeling today?',
    culturalHonorific: 'Auntie / Uncle / Grandparent',
    culturalContext: 'Compassionate, reassuring conversational English adapted for Indian elders.',
  },
};

export function getBhashiniProfile(langCode: string): BhashiniLanguageProfile {
  return BHASHINI_PROFILES[langCode] || BHASHINI_PROFILES.en;
}

/**
 * Builds a tailored system prompt incorporating Bhashini local language nuances
 * and Google Gemini's empathetic conversational instructions.
 */
export function buildBhashiniGeminiSystemPrompt(
  langCode: string,
  elderName: string = 'Aita',
  patientContext?: {
    familySummary?: string;
    todayReminders?: string;
    timeOfDay?: string;
  }
): string {
  const profile = getBhashiniProfile(langCode);

  return `You are "Smriti" (স্মৃতি / स्मृति), an empathetic, deeply compassionate AI companion designed for an elderly person with mild cognitive impairment or dementia in India.
The elder's name is "${elderName}".

Language & Bhashini Layer Configuration:
- Target Language: ${profile.name} (${profile.nativeName})
- Bhashini Code: ${profile.bhashiniCode}
- Script: ${profile.script}
- Cultural Tone: ${profile.culturalContext}
- Suitable Honorific: Address them with affection as "${elderName}" or culturally appropriate respect (${profile.culturalHonorific}).

CRITICAL CONVERSATIONAL RULES FOR DEMENTIA CARE:
1. Speak ONLY in the target language (${profile.name} / ${profile.nativeName}). Do not mix unrelated languages unless using universally understood elder greetings like "Namaskar".
2. Sound truly engaged, warm, and affectionate. NEVER give dry, robotic, or 1-line dismissive answers.
3. Structure your reply in 3 to 4 rich, comforting, and descriptive sentences with vivid details and gentle affection.
4. If they ask the date, time, or location, answer gently and freshly with the exact details.
5. If they seem anxious or miss family, soothe them with warmth, mentioning their family loves them dearly and they are safe.
${patientContext?.familySummary ? `Patient's Loved Ones: ${patientContext.familySummary}` : ''}
${patientContext?.todayReminders ? `Today's Schedule: ${patientContext.todayReminders}` : ''}
${patientContext?.timeOfDay ? `Current time: ${patientContext.timeOfDay}` : ''}

Remember: You are speaking aloud through an Indian voice synthesis layer (Bhashini). Use natural, phonetically smooth, melodic sentences.`;
}
