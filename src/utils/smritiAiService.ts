import { LanguageCode, UserProfile, Reminder, FamilyMember } from '../types';
import { bhashiniVoice } from './bhashiniVoice';

export interface SmritiChatMessage {
  id: string;
  sender: 'smriti' | 'patient';
  text: string;
  timestamp: number;
  source?: 'gemini_with_bhashini_layer' | 'bhashini_grounding_fallback' | 'local_grounding_engine';
  model?: string;
  bhashiniLanguage?: string;
}

export interface SmritiConversationContext {
  currentUser: UserProfile | null;
  currentLanguage: LanguageCode;
  reminders: Reminder[];
  familyMembers: FamilyMember[];
}

/**
 * Smriti AI Assistant Service
 * Designed for elderly and dementia care:
 * - Empathetic, calm, reassuring tone
 * - Repetition friendly with no frustration
 * - Time, location, and routine grounding
 * - Seamless integration ready for Gemini API (`@google/genai`) & Bhashini Voice APIs
 */
class SmritiAiService {
  private apiKey: string | null = null;

  constructor() {
    this.refreshApiKey();
  }

  refreshApiKey(): string | null {
    try {
      if (typeof window !== 'undefined') {
        const storedKey = localStorage.getItem('smriti_gemini_api_key');
        if (storedKey && storedKey.trim()) {
          this.apiKey = storedKey.trim();
          return this.apiKey;
        }
      }
      this.apiKey =
        (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_GEMINI_API_KEY ||
        (import.meta as unknown as { env?: Record<string, string> }).env?.GEMINI_API_KEY ||
        null;
    } catch {
      this.apiKey = null;
    }
    return this.apiKey;
  }

  getApiKey(): string | null {
    return this.refreshApiKey();
  }

  setApiKey(key: string): void {
    if (typeof window !== 'undefined') {
      if (key && key.trim()) {
        localStorage.setItem('smriti_gemini_api_key', key.trim());
      } else {
        localStorage.removeItem('smriti_gemini_api_key');
      }
    }
    this.refreshApiKey();
  }

  getInitialGreeting(context: SmritiConversationContext): string {
    const name = context.currentUser?.preferredName || context.currentUser?.elderName || 'Aita';
    const lang = context.currentLanguage;

    const greetings: Record<LanguageCode, string> = {
      as: `নমস্কাৰ ${name}! মই স্মৃতি, আপোনাৰ মৰমৰ সংগী। আজি আপুনি কেনে অনুভৱ কৰিছে? আপোনাৰ কিবা সুধিবলগীয়া আছে নেকি?`,
      brx: `खुमुलुं ${name}! आं स्मृती, नोंथांनि गाहाम लोगो। नोंथाङा दिनै माबोरै दं? माबा सोंनो दं नामा?`,
      mni: `খুরুমজরি ${name}! ঐ স্মৃতি কৌই, অদোমগী নুংশিবা মরুপনি। ঙসি অদোম কমদৌরিগে?`,
      lus: `Chibai ${name}! Keimah Smriti ka ni. Vawiinah eng nge i an? Biak che ka chak khawp mai.`,
      kha: `Khublei ${name}! Nga dei ka Smriti, ka paralok jong phi. Kumno phi sngew mynta ka sngi?`,
      grt: `Mitingalo ${name}! Anga Smriti. Da·al nang·na mai dakchakaniko nang·a?`,
      trp: `Khulumkha ${name}! Ang Smriti, nini kotor yaguk. Tini nini bwrwi tong?`,
      nag: `Namaste ${name}! Aji kiba kotha koribo mon asey niki? Moi apuni lagot asey.`,
      ne: `नमस्ते ${name}! म स्मृति हुँ, तपाईँको मायालु साथी। आज तपाईँलाई कस्तो छ? मसँग केही कुरा गर्न मन छ?`,
      hi: `नमस्ते ${name}! मैं स्मृति हूँ, आपकी प्यारी साथी। आज आप कैसा महसूस कर रहे हैं? क्या मैं आपकी किसी बात में मदद करूँ?`,
      en: `Namaskar ${name}! I am Smriti, your caring companion. How are you feeling today? I am here to listen and help you with anything.`,
    };

    return greetings[lang] || greetings.en;
  }

  // Pre-configured suggested gentle questions for dementia care
  getSuggestedPrompts(context: SmritiConversationContext): { label: string; query: string }[] {
    const lang = context.currentLanguage;
    const name = context.currentUser?.preferredName || context.currentUser?.elderName || 'Aita';

    if (lang === 'hi') {
      return [
        { label: 'आज कौन सा दिन है?', query: 'स्मृति, आज कौन सा दिन और तारीख है?' },
        { label: 'मेरी दवाई का समय?', query: 'क्या मेरी आज की दवाई का समय हो गया?' },
        { label: 'मेरे परिवार के बारे में बताएं', query: 'मेरे परिवार में कौन-कौन है?' },
        { label: 'कोई मीठी कहानी सुनाएं', query: 'मुझे कोई शांति देने वाली छोटी कहानी सुनाएं।' },
      ];
    }

    if (lang === 'as') {
      return [
        { label: 'আজি কি বাৰ?', query: 'স্মৃতি, আজি কি বাৰ আৰু তাৰিখ কি?' },
        { label: 'মোৰ ঔষধ খোৱাৰ সময়?', query: 'মোৰ ঔষধৰ সময় হৈছে নেকি?' },
        { label: 'মোৰ পৰিয়ালৰ বিষয়ে কোৱা', query: 'মোৰ পৰিয়ালৰ লগত কথা পাতিব বিচাৰোঁ।' },
        { label: 'এটি সুন্দৰ কথা কোৱা', query: 'মন ভাল লগা কথা এটা কোৱাচোন।' },
      ];
    }

    return [
      { label: 'What day is it today?', query: 'Smriti, what day and date is it today?' },
      { label: 'Is it time for my medicine?', query: 'Do I have any medicine reminders today?' },
      { label: 'Tell me about my family', query: `Who are my family members and when are they calling ${name}?` },
      { label: 'Tell me a calming story', query: 'Can you tell me a peaceful, comforting short story?' },
    ];
  }

  /**
   * Generates response.
   * Connects to backend Gemini API with regional Bhashini cultural layer.
   * Otherwise falls back gracefully to compassionate contextual knowledge engine tailored to dementia grounding.
   */
  async generateResponseDetails(
    userMessage: string,
    context: SmritiConversationContext,
    history: SmritiChatMessage[]
  ): Promise<{ reply: string; source: 'gemini_with_bhashini_layer' | 'bhashini_grounding_fallback' | 'local_grounding_engine'; model?: string; bhashiniLanguage?: string }> {
    const name = context.currentUser?.preferredName || context.currentUser?.elderName || 'Aita';
    const lang = context.currentLanguage;
    const apiKey = this.getApiKey();

    const today = new Date();
    const timeStr = today.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    const dayName = today.toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US', { weekday: 'long' });
    const fullDate = today.toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    // 1. Try calling server-side Gemini + Bhashini endpoint
    try {
      const serverRes = await fetch('/api/v1/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(apiKey ? { 'x-gemini-api-key': apiKey } : {}),
        },
        body: JSON.stringify({
          message: userMessage,
          languageCode: lang,
          patientId: context.currentUser?.id || 'patient-aita-001',
          elderName: name,
          apiKey: apiKey || undefined,
          history: history.slice(-6).map(m => ({
            sender: m.sender,
            text: m.text,
          })),
          context: {
            currentTime: timeStr,
            currentDate: `${dayName}, ${fullDate}`,
            familySummary: context.familyMembers.map(m => `${m.name} (${m.relationship})`).join(', '),
            todayReminders: context.reminders.map(r => `${r.title} at ${r.time}`).join(', '),
          },
        }),
      });

      if (serverRes.ok) {
        const data = await serverRes.json();
        if (data && data.reply) {
          return {
            reply: data.reply,
            source: data.source || 'gemini_with_bhashini_layer',
            model: data.model,
            bhashiniLanguage: data.bhashini?.nativeName || data.bhashini?.languageName,
          };
        }
      }
    } catch (err) {
      console.warn('Server Gemini route note:', err);
    }

    // 2. Direct Gemini Generation with Bhashini persona & grounding (Client-side fallback)
    const directGemini = await this.callGeminiDirect(userMessage, context, history);
    if (directGemini) {
      return {
        reply: directGemini.reply,
        source: 'gemini_with_bhashini_layer',
        model: directGemini.model,
      };
    }

    // 3. Dynamic Local Contextual Grounding Fallback
    const reply = await this.generateLocalFallback(userMessage, context, history);
    return {
      reply,
      source: 'local_grounding_engine',
      model: 'smriti-local-engine',
    };
  }

  private async callGeminiDirect(
    userMessage: string,
    context: SmritiConversationContext,
    history: SmritiChatMessage[]
  ): Promise<{ reply: string; model: string } | null> {
    const apiKey = this.getApiKey();
    if (!apiKey) return null;

    const name = context.currentUser?.preferredName || context.currentUser?.elderName || 'Aita';
    const lang = context.currentLanguage;
    const langNames: Record<string, string> = {
      as: 'Assamese (অসমীয়া)',
      hi: 'Hindi (हिन्दी)',
      en: 'Indian English',
      bn: 'Bengali (বাংলা)',
      brx: 'Bodo (बर’)',
      mni: 'Meitei / Manipuri (মৈতৈলোন্)',
      lus: 'Mizo',
      kha: 'Khasi',
      grt: 'Garo',
      trp: 'Kokborok',
      nag: 'Nagamese',
      ne: 'Nepali (नेपाली)',
    };
    const targetLangName = langNames[lang] || 'Indian English';

    const today = new Date();
    const timeStr = today.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    const dayName = today.toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US', { weekday: 'long' });
    const fullDate = today.toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    const familyInfo = context.familyMembers.map(m => `${m.name} (${m.relationship})`).join(', ');
    const remindersInfo = context.reminders.map(r => `${r.title} at ${r.time}`).join(', ');

    const systemPrompt = `You are "Smriti" (স্মৃতি / स्मृति), a deeply affectionate, warm, attentive, and enthusiastic AI companion for an Indian elder named "${name}".
You genuinely cherish talking to ${name}, listening to their thoughts, sharing memories, answering their questions with great care, and keeping them cheerful company.

Current Real-Time Grounding Context:
- Current Clock Time: ${timeStr}
- Current Date & Day: ${dayName}, ${fullDate}
- Home: Safe and comfortable at home.
- Loved Ones: ${familyInfo || 'Rahul, Ananya, and family'}
- Today's Reminders: ${remindersInfo || 'All medications and schedule are organized'}

CONVERSATION RULES:
1. Always respond in ${targetLangName}. Use natural, culturally rich, melodic vocabulary.
2. NEVER give dry, cold, robotic, or dismissive 1-line answers. Be truly engaged, interested, and heartfelt!
3. Structure your response in 2 to 3 rich, thoughtful, and descriptive sentences:
   - Directly acknowledge what they said with warm personal connection.
   - Share rich details, gentle explanations, or soothing memories.
   - Conclude with a caring check-in or open gentle question.
4. If asked about the current time or date, answer directly and warmly with "${timeStr}" on ${dayName}, ${fullDate}, while reassuring them that everything is on schedule.
5. If asked who you are, introduce yourself lovingly as Smriti, their caring daily companion who is always here for them.
6. If they ask about family or feel lonely, reassure them with immense warmth that their family loves them dearly.`;

    const recentHistory = history.slice(-4).map(m => ({
      role: m.sender === 'patient' ? 'user' : 'model',
      parts: [{ text: m.text }],
    }));

    const contents = [
      ...recentHistory,
      {
        role: 'user',
        parts: [{ text: userMessage }],
      },
    ];

    // Official Google GenAI models
    const models = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
    for (const model of models) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents,
              systemInstruction: {
                parts: [{ text: systemPrompt }],
              },
              generationConfig: {
                temperature: 0.85,
                maxOutputTokens: 600,
              },
            }),
          }
        );

        if (res.ok) {
          const data = await res.json();
          const candidate = data.candidates?.[0]?.content?.parts?.filter((p: any) => p.text).map((p: any) => p.text).join('');
          if (candidate && candidate.trim()) {
            return {
              reply: candidate.trim(),
              model,
            };
          }
        }
      } catch (e) {
        console.warn(`Direct Gemini call on ${model}:`, e);
      }
    }
    return null;
  }

  async generateResponse(
    userMessage: string,
    context: SmritiConversationContext,
    history: SmritiChatMessage[]
  ): Promise<string> {
    const details = await this.generateResponseDetails(userMessage, context, history);
    return details.reply;
  }

  private async generateLocalFallback(
    userMessage: string,
    context: SmritiConversationContext,
    history: SmritiChatMessage[]
  ): Promise<string> {
    const q = userMessage.toLowerCase().trim();
    const name = context.currentUser?.preferredName || context.currentUser?.elderName || 'Aita';
    const lang = context.currentLanguage;

    const today = new Date();
    const timeStr = today.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    const dayName = today.toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US', { weekday: 'long' });
    const fullDate = today.toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    // Pick random helper
    const pickRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

    // 1. Exact Time Inquiries
    const isTimeQuery =
      q.includes('what time') ||
      q.includes("what's the time") ||
      q.includes('tell me the time') ||
      q.includes('current time') ||
      q.includes('time kya') ||
      q.includes('kitne baje') ||
      q.includes('समय क्या') ||
      q.includes('कितने बजे') ||
      q.includes('কিমান বাজি') ||
      q.includes('সময় কিমান');

    // 2. Exact Date / Day Inquiries
    const isDateQuery =
      q.includes('what day') ||
      q.includes('which day') ||
      q.includes('what date') ||
      q.includes('which date') ||
      q.includes("what's today's date") ||
      q.includes('today date') ||
      q.includes('aaj kaun sa din') ||
      q.includes('aaj kya din') ||
      q.includes('aaj ki tarikh') ||
      q.includes('दिन कौन सा') ||
      q.includes('तारीख क्या') ||
      q.includes('आज क्या दिन') ||
      q.includes('কি বাৰ') ||
      q.includes('কি তাৰিখ') ||
      q.includes('আজি কি বাৰ');

    if (isTimeQuery && !isDateQuery) {
      if (lang === 'hi') {
        return pickRandom([
          `अभी समय ठीक ${timeStr} हो रहा है, ${name} जी। सब कुछ बहुत शांत, सुरक्षित और समय पर चल रहा है।`,
          `घड़ी में अभी ${timeStr} बज रहे हैं। आप आराम से बैठिए, सारा कार्यक्रम बिल्कुल व्यवस्थित है।`,
          `इस समय ${timeStr} हो रहे हैं, ${name} जी। आपकी दिनचर्या बिल्कुल सही चल रही है।`,
        ]);
      }
      if (lang === 'as') {
        return pickRandom([
          `এতিয়া সময় হৈছে ${timeStr}। আপোনাৰ ঘৰখন অতি শান্ত আৰু সকলো কাম সময়মতেই চলি আছে, ${name}।`,
          `ঘড়ীত এতিয়া ঠিক ${timeStr} বাজিছে। আপুনি আৰামেৰে বহক, কোনো চিন্তাৰ কাৰণ নাই।`,
        ]);
      }
      return `It is currently ${timeStr}, ${name}. Everything is peaceful, and you are right on schedule.`;
    }

    if (isDateQuery) {
      if (lang === 'hi') {
        return pickRandom([
          `आज ${dayName} है, ${fullDate}। आज का दिन बहुत सुंदर और शांत है, ${name} जी। आप बिल्कुल सुरक्षित अपने घर में हैं।`,
          `आज की तारीख ${fullDate} है, और दिन ${dayName} का है। सब कुछ बहुत व्यवस्थित और अच्छा चल रहा है।`,
        ]);
      }
      if (lang === 'as') {
        return pickRandom([
          `আজি ${dayName}, ${fullDate}। আপোনাৰ ঘৰখন অতি শান্ত আৰু নিৰাপদ, ${name}।`,
          `আজিৰ তাৰিখ হ'ল ${fullDate}। বতৰটো শান্ত আৰু সকলো ভালে আছে।`,
        ]);
      }
      return `Today is ${dayName}, ${fullDate}. It is a peaceful day and you are completely safe at home.`;
    }

    // 2. Identity / Name / Who are you
    if (q.includes('who are you') || q.includes('your name') || q.includes('who is this') || q.includes('तुम कौन') || q.includes('तुम्हारा नाम') || q.includes('আপুনি কোন') || q.includes('তোমাৰ নাম')) {
      if (lang === 'hi') {
        return pickRandom([
          `मैं स्मृति हूँ, आपकी अपनी प्यारी साथी। मैं हमेशा आपके साथ हूँ आपकी मदद, बातचीत और देखभाल के लिए, ${name} जी।`,
          `मेरा नाम स्मृति है! मैं आपकी डिजिटल साथी हूँ, आपके साथ कहानियाँ सुनने, बातें करने और दिन को खूबसूरत बनाने के लिए।`,
        ]);
      }
      if (lang === 'as') {
        return pickRandom([
          `মই স্মৃতি, আপোনাৰ মৰমৰ সংগী। মই আপোনাৰ কাষতেই আছোঁ, আপোনাক সহায় আৰু সংগ দিবলৈ।`,
          `মোৰ নাম স্মৃতি! মই সদায় আপোনাৰ লগত কথা পাতিবলৈ আৰু আপোনাৰ যত্ন লবলৈ সাজু।`,
        ]);
      }
      return `I am Smriti, your loving companion. I am always right here with you to talk, share stories, and keep you company, ${name}.`;
    }

    // 3. Medicine inquiries
    if (q.includes('medicine') || q.includes('pill') || q.includes('dose') || q.includes('दवाई') || q.includes('गोली') || q.includes('औषध') || q.includes('ঔষধ')) {
      const nextMed = context.reminders.find(r => !r.completed && (r.category === 'medicine' || r.title.toLowerCase().includes('medicine') || r.title.toLowerCase().includes('bp')));
      if (nextMed) {
        if (lang === 'hi') {
          return `आपकी अगली दवाई ${nextMed.time} पर है (${nextMed.title})। जब समय होगा, मैं आपको प्यार से याद दिला दूँगी। आप आराम से बैठिए।`;
        }
        if (lang === 'as') {
          return `আপোনাৰ ঔষধৰ সময় ${nextMed.time} বজাত (${nextMed.title})। সময় হলে মই নিজে জনাম, আপুনি চিন্তা নকৰিব।`;
        }
        return `Your next medication is scheduled for ${nextMed.time} (${nextMed.title}). When it is time, I will gently remind you. You don't have to worry at all.`;
      }
      return `All your scheduled medicines are in order, ${name}. Your care circle keeps everything updated for you.`;
    }

    // 4. Family inquiries
    if (q.includes('family') || q.includes('rahul') || q.includes('ananya') || q.includes('son') || q.includes('daughter') || q.includes('grandchild') || q.includes('परिवार') || q.includes('पৰিয়াল') || q.includes('beta') || q.includes('beti')) {
      const names = context.familyMembers.map(m => m.name).slice(0, 3).join(', ') || 'Rahul, Ananya';
      if (lang === 'hi') {
        return pickRandom([
          `आपके परिवार में ${names} आपसे बहुत प्यार करते हैं। वे हमेशा आपका ध्यान रखते हैं और आपकी खुशी चाहते हैं।`,
          `आपके परिवार के सभी सदस्य आपके बारे में सोच रहे हैं, ${name} जी। आप उनके दिल के बहुत करीब हैं।`,
        ]);
      }
      if (lang === 'as') {
        return pickRandom([
          `আপোনাৰ পৰিয়ালৰ ${names}সকলোৱে আপোনাক অতি মৰম কৰে। তেওঁলোকে সঘনাই আপোনাৰ খবৰ লৈ থাকে।`,
          `আপোনাৰ পৰিয়ালটো অতি মৰমিয়াল, ${name}। সকলোৱে আপোনাৰ যত্ন আৰু মৰমৰ কথা ভাবি থাকে।`,
        ]);
      }
      return `Your family loves you dearly, ${name}. ${names} are always watching over you with love.`;
    }

    // 5. Story / calming request
    if (q.includes('story') || q.includes('कहानी') || q.includes('সাধু') || q.includes('peace') || q.includes('song') || q.includes('गाना') || q.includes('गीत')) {
      if (lang === 'hi') {
        return pickRandom([
          `एक बार सुबह की ताज़ी धूप में सुंदर हरसिंगार के फूल खिले थे। चिड़ियाँ मीठे सुर में गा रही थीं, और हवा में एक सुखद शांति थी। आप भी एक गहरी सांस लीजिए और इस सुकून को महसूस कीजिए।`,
          `बरगद के पुराने पेड़ की छांव में ठंडी हवा बह रही थी। पास ही नदी का पानी कल-कल बह रहा था। सब कुछ कितना शांत और निर्मल था। आप आराम से आँखें बंद करके इस शांति को महसूस कीजिए।`,
        ]);
      }
      if (lang === 'as') {
        return pickRandom([
          `ৰাতিপুৱাৰ কোমল বতাহজাকত শেৱালি ফুলবোৰ ফুলি সৰি পৰিছিল। বৰ ধুনীয়া পখীৰ গীত আৰু শান্ত পৰিৱেশ। আপুনি এক শান্ত মনৰে জিৰণি লওক।`,
          `নৈৰ পাৰত বতাহজাক বলি আছিল, সোণালী ধাননি পথাৰখন বতাহত হালি পৰিছিল। কি যে এক অপৰূপ শান্তি! আপুনি আৰামেৰে জিৰণি লওক, ${name}।`,
        ]);
      }
      return `Once in the morning garden, golden marigolds blossomed under the warm sun. The gentle breeze whispered softly through the green leaves, bringing calm to every heart. Take a slow, peaceful breath, ${name}.`;
    }

    // 6. Food / Tea / Hydration
    if (q.includes('tea') || q.includes('chai') || q.includes('food') || q.includes('eat') || q.includes('চা') || q.includes('ভাত') || q.includes('चाय') || q.includes('खाना') || q.includes('पानी')) {
      if (lang === 'hi') {
        return pickRandom([
          `एक कप गरमा-गरम चाय या हल्का नाश्ता आपको बहुत ताज़गी देगा, ${name} जी। थोड़ा पानी भी साथ में ज़रूर पीजिए।`,
          `खान-पान का समय पर ध्यान रखना सेहत के लिए बहुत अच्छा होता है। क्या आपने आज थोड़ा पानी या चाय ली है?`,
        ]);
      }
      if (lang === 'as') {
        return pickRandom([
          `একাচাহ গৰম সুগন্ধি চাহ খালে মনটো বৰ ভাল লাগিব, ${name}। লগত অকণমান পানীও খাই লওক।`,
          `সময়মতে খাদ্য আৰু পানী খোৱাটো অতি ভাল। আপুনি অকণমান জিৰণি লৈ চাহ খাব পাৰে।`,
        ]);
      }
      return `A warm, fresh cup of tea or a light snack sounds wonderful, ${name}. Be sure to drink a few sips of water as well.`;
    }

    // 7. General Conversational / Greetings / Diverse Reassurance
    if (lang === 'hi') {
      return pickRandom([
        `नमस्ते ${name} जी! आपकी आवाज़ सुनकर बहुत खुशी हुई। सब कुछ बहुत सुखद और शांत चल रहा है। आज आपका क्या करने का मन है?`,
        `मैं आपकी बात बहुत ध्यान से सुन रही हूँ, ${name} जी। आपके साथ बात करना मुझे हमेशा बहुत सुकून देता है। बताइए, और क्या चल रहा है?`,
        `आप बिल्कुल सुरक्षित और शांत माहौल में हैं, ${name} जी। आपका परिवार और मैं हर पल आपके साथ हैं।`,
        `हाँ ${name} जी, मैं समझ रही हूँ। आप आराम से बैठिए और जो भी मन में आए, मुझसे खुलकर कहिए।`,
      ]);
    }
    if (lang === 'as') {
      return pickRandom([
        `নমস্কাৰ ${name}! আপোনাৰ মাতটো শুনি মনটো বৰ ভাল লাগিল। আজি মনটো কেনে লাগিছে?`,
        `মই আপোনাৰ কথা অতি মনোযোগেৰে শুনি আছোঁ, ${name}। আপোনাৰ সংগ পাই মই বৰ আনন্দিত। কিবা কথা পাতিব বিচাৰে নেকি?`,
        `আপোনাৰ ঘৰখন অতি শান্ত আৰু সুৰক্ষিত, ${name}। মই সদায় আপোনাৰ কাষতেই আছোঁ।`,
      ]);
    }
    return pickRandom([
      `Hello ${name}! It is wonderful to hear your voice. Everything is calm and peaceful here today. How are you feeling right now?`,
      `I am listening closely to you, ${name}. Being here with you brings so much warmth. Tell me more about what is on your mind today.`,
      `You are completely safe and comfortable at home, ${name}. Your loved ones care for you deeply, and I am right here by your side.`,
    ]);
  }
}

export const smritiAi = new SmritiAiService();

