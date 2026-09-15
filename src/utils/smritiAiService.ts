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
    // Read optional server/client key if available
    try {
      this.apiKey = (import.meta as unknown as { env?: { VITE_GEMINI_API_KEY?: string } }).env?.VITE_GEMINI_API_KEY || null;
    } catch {
      this.apiKey = null;
    }
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
    const q = userMessage.toLowerCase().trim();
    const name = context.currentUser?.preferredName || context.currentUser?.elderName || 'Aita';
    const lang = context.currentLanguage;

    // No artificial network latency delay - respond immediately
    const today = new Date();
    const timeStr = today.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    const dayName = today.toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US', { weekday: 'long' });
    const fullDate = today.toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    // 1. Try calling server-side Gemini + Bhashini endpoint
    try {
      const serverRes = await fetch('/api/v1/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          languageCode: lang,
          patientId: context.currentUser?.id || 'patient-aita-001',
          elderName: name,
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
        if (data && data.reply && data.source === 'gemini_with_bhashini_layer') {
          return {
            reply: data.reply,
            source: 'gemini_with_bhashini_layer',
            model: data.model,
            bhashiniLanguage: data.bhashini?.nativeName || data.bhashini?.languageName,
          };
        }
      }
    } catch (err) {
      console.warn('Server Gemini route note:', err);
    }

    // 2. Direct Gemini Generation with Bhashini persona & grounding
    const directGemini = await this.callGeminiDirect(userMessage, context, history);
    if (directGemini) {
      return {
        reply: directGemini.reply,
        source: 'gemini_with_bhashini_layer',
        model: directGemini.model,
      };
    }

    // 3. Local contextual grounding fallback
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
    const apiKey =
      (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_GEMINI_API_KEY ||
      (import.meta as unknown as { env?: Record<string, string> }).env?.GEMINI_API_KEY ||
      '';

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
3. Structure your response in 3 to 4 rich, thoughtful, and descriptive sentences:
   - Start with a warm, personal greeting or affectionate excitement about their question.
   - Share rich, helpful details, gentle explanations, or heartwarming memories.
   - Conclude with a caring check-in or gentle open question.
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

    // Priority ordered by ultra-low latency & quality (gemini-3.5-flash-lite delivers ~700ms responses)
    const models = ['gemini-3.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-3.6-flash'];
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
                temperature: 0.82,
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

    // Contextual Elder-Care Rule Engine (Grounding & Reassurance)
    const today = new Date();
    const timeStr = today.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    const dayName = today.toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US', { weekday: 'long' });
    const fullDate = today.toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    // 1. Exact Time Inquiries ("what time is it", "what's the time", "tell me the time", "kitne baje hain", "time kya hua", "কিমান বাজিছে")
    const isTimeQuery =
      q.includes('time') ||
      q.includes('clock') ||
      q.includes('hour') ||
      q.includes('समय') ||
      q.includes('बजे') ||
      q.includes('टाइम') ||
      q.includes('কিমান বাজি') ||
      q.includes('সময়');

    const isDateQuery =
      q.includes('day') ||
      q.includes('date') ||
      q.includes('today') ||
      q.includes('दिन') ||
      q.includes('तारीख') ||
      q.includes('आज क्या') ||
      q.includes('কি বাৰ') ||
      q.includes('কি তাৰিখ') ||
      q.includes('আজি');

    if (isTimeQuery && !isDateQuery) {
      if (lang === 'hi') {
        return `अभी समय ${timeStr} हो रहा है, ${name} जी। सब कुछ बहुत शांत और अच्छा चल रहा है। आप आराम से बैठिए।`;
      }
      if (lang === 'as') {
        return `এতিয়া সময় হৈছে ${timeStr}। আপোনাৰ ঘৰখন অতি শান্ত আৰু নিৰাপদ, ${name}।`;
      }
      return `It is currently ${timeStr}, ${name}. Everything is peaceful, and you are right on schedule.`;
    }

    if (isTimeQuery && isDateQuery) {
      if (lang === 'hi') {
        return `अभी ${timeStr} बज रहे हैं। आज ${dayName} है, ${fullDate}। सब कुछ बहुत सुरक्षित और व्यवस्थित है, ${name} जी।`;
      }
      if (lang === 'as') {
        return `এতিয়া সময় ${timeStr}। আজি ${dayName}, ${fullDate}। আপোনাৰ সকলো কাম সুচাৰুৰূপে চলি আছে, ${name}।`;
      }
      return `It is ${timeStr} on ${dayName}, ${fullDate}. Everything is peaceful and well taken care of, ${name}.`;
    }

    if (isDateQuery) {
      if (lang === 'hi') {
        return `आज ${dayName} है, ${fullDate}। सब कुछ बहुत शांत और अच्छा चल रहा है, ${name} जी। आप बिल्कुल सुरक्षित अपने घर में हैं।`;
      }
      if (lang === 'as') {
        return `আজি ${dayName}, ${fullDate}। আপোনাৰ ঘৰখন অতি শান্ত আৰু নিৰাপদ, ${name}। আপুনি বৰ আনন্দৰে আছোঁ।`;
      }
      return `Today is ${dayName}, ${fullDate}. It is a bright and peaceful day, ${name}. You are safe at home and everything is well taken care of.`;
    }

    // 2. Identity / Name / Who are you
    if (q.includes('who are you') || q.includes('your name') || q.includes('who is this') || q.includes('तुम कौन') || q.includes('तुम्हारा नाम') || q.includes('আপুনি কোন') || q.includes('তোমাৰ নাম')) {
      if (lang === 'hi') {
        return `मैं स्मृति हूँ, आपकी अपनी प्यारी साथी। मैं हमेशा आपके साथ हूँ आपकी मदद और बातचीत के लिए, ${name} जी।`;
      }
      if (lang === 'as') {
        return `মই স্মৃতি, আপোনাৰ মৰমৰ সংগী। মই আপোনাৰ কাষতেই আছোঁ, আপোনাক সহায় আৰু সংগ দিবলৈ।`;
      }
      return `I am Smriti, your loving companion. I am always right here with you to talk, share stories, and keep you company, ${name}.`;
    }

    // 3. Medicine inquiries
    if (q.includes('medicine') || q.includes('pill') || q.includes('dose') || q.includes('दवाई') || q.includes('गोली') || q.includes('ঔষধ')) {
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
      const names = context.familyMembers.map(m => m.name).slice(0, 3).join(', ');
      if (lang === 'hi') {
        return `आपके परिवार में ${names} आपसे बहुत प्यार करते हैं। वे हमेशा आपका ध्यान रखते हैं और जल्द ही आपसे बात करेंगे।`;
      }
      if (lang === 'as') {
        return `আপোনাৰ পৰিয়ালৰ ${names}সকলোৱে আপোনাক অতি মৰম কৰে। তেওঁলোকে সঘনাই আপোনাৰ খবৰ লৈ থাকে।`;
      }
      return `Your family loves you dearly, ${name}. ${names} are in your Care Circle and always watching over you with love.`;
    }

    // 5. Story / calming request
    if (q.includes('story') || q.includes('कहानी') || q.includes('সাধু') || q.includes('peace') || q.includes('song') || q.includes('गाना') || q.includes('गीत')) {
      if (lang === 'hi') {
        return `एक बार सुबह की ताज़ी धूप में सुंदर हरसिंगार के फूल खिले थे। चिड़ियाँ मीठे सुर में गा रही थीं, और हवा में एक सुखद शांति थी। आप भी एक गहरी सांस लीजिए और इस सुकून को महसूस कीजिए।`;
      }
      if (lang === 'as') {
        return `ৰাতিপুৱাৰ কোমল বতাহজাকত শেৱালি ফুলবোৰ ফুলি সৰি পৰিছিল। বৰ ধুনীয়া পখীৰ গীত আৰু শান্ত পৰিৱেশ। আপুনি এক শান্ত মনৰে জিৰণি লওক।`;
      }
      return `Once in the morning garden, golden marigolds blossomed under the warm sun. The gentle breeze whispered softly through the green leaves, bringing calm to every heart. Take a slow, peaceful breath, ${name}.`;
    }

    // 6. Safety / Location reassurance
    if (q.includes('where am i') || q.includes('safe') || q.includes('lost') || q.includes('घर') || q.includes('कहाँ हूँ') || q.includes('ক’ত আছোঁ') || q.includes('নিৰাপদ')) {
      if (lang === 'hi') {
        return `आप बिल्कुल सुरक्षित अपने प्यारे घर में हैं, ${name} जी। चारों तरफ शांति है और आपका परिवार आपका ध्यान रख रहा है।`;
      }
      if (lang === 'as') {
        return `আপুনি আপোনাৰ নিজৰ ঘৰত সম্পূর্ণ নিৰাপদে আছে, ${name}। চিন্তাৰ কোনো কাৰণ নাই।`;
      }
      return `You are safe in your lovely home, ${name}. Everything is calm, comfortable, and your loved ones are watching over you.`;
    }

    // 7. General reassurance
    if (lang === 'hi') {
      return `मैं आपकी बात बहुत अच्छे से समझ रही हूँ, ${name} जी। मैं हर पल आपके साथ हूँ। आप बहुत अच्छे हैं और सब कुछ ठीक है।`;
    }
    if (lang === 'as') {
      return `মই আপোনাৰ কথা বুজি পাইছোঁ, ${name}। মই সদায় আপোনাৰ কাষতেই আছোঁ। আপুনি সম্পূর্ণ নিৰাপদ আৰু মৰমৰ মাজত আছে।`;
    }
    return `I hear you warmly, ${name}. I am right here by your side. Everything is peaceful, you are doing wonderfully today, and I am always happy to talk with you.`;
  }
}

export const smritiAi = new SmritiAiService();
