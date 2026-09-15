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

    // Simulate gentle network latency for natural conversation
    await new Promise(res => setTimeout(res, 400));

    // Try calling server-side Gemini + Bhashini endpoint
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
      console.warn('Server Gemini + Bhashini endpoint unavailable, falling back to local engine:', err);
    }

    const reply = await this.generateLocalFallback(userMessage, context, history);
    return {
      reply,
      source: 'local_grounding_engine',
      model: 'smriti-local-engine',
    };
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
    const dayName = today.toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US', { weekday: 'long' });
    const fullDate = today.toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    // Date & Time inquiries
    if (q.includes('day') || q.includes('date') || q.includes('time') || q.includes('दिन') || q.includes('तारीख') || q.includes('বাৰ')) {
      if (lang === 'hi') {
        return `आज ${dayName} है, ${fullDate}। सब कुछ बहुत शांत और अच्छा चल रहा है, ${name} जी। आप बिल्कुल सुरक्षित अपने घर में हैं।`;
      }
      if (lang === 'as') {
        return `আজি ${dayName}, ${fullDate}। আপোনাৰ ঘৰখন অতি শান্ত আৰু নিৰাপদ, ${name}। আপুনি বৰ আনন্দৰে আছোঁ।`;
      }
      return `Today is ${dayName}, ${fullDate}. It is a bright and peaceful day, ${name}. You are safe at home and everything is well taken care of.`;
    }

    // Medicine inquiries
    if (q.includes('medicine') || q.includes('pill') || q.includes('दवाई') || q.includes('ঔষধ')) {
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

    // Family inquiries
    if (q.includes('family') || q.includes('rahul') || q.includes('son') || q.includes('daughter') || q.includes('grandchild') || q.includes('परिवार') || q.includes('পৰিয়াল')) {
      const names = context.familyMembers.map(m => m.name).slice(0, 3).join(', ');
      if (lang === 'hi') {
        return `आपके परिवार में ${names} आपसे बहुत प्यार करते हैं। वे हमेशा आपका ध्यान रखते हैं और जल्द ही आपसे बात करेंगे।`;
      }
      if (lang === 'as') {
        return `আপোনাৰ পৰিয়ালৰ ${names}সকলোৱে আপোনাক অতি মৰম কৰে। তেওঁলোকে সঘনাই আপোনাৰ খবৰ লৈ থাকে।`;
      }
      return `Your family loves you dearly, ${name}. ${names} are in your Care Circle and always watching over you with love.`;
    }

    // Story / calming request
    if (q.includes('story') || q.includes('कहानी') || q.includes('সাধু') || q.includes('peace') || q.includes('song')) {
      if (lang === 'hi') {
        return `एक बार सुबह की ताज़ी धूप में सुंदर हरसिंगार के फूल खिले थे। चिड़ियाँ मीठे सुर में गा रही थीं, और हवा में एक सुखद शांति थी। आप भी एक गहरी सांस लीजिए और इस सुकून को महसूस कीजिए।`;
      }
      if (lang === 'as') {
        return `ৰাতিপুৱাৰ কোমল বতাহজাকত শেৱালি ফুলবোৰ ফুলি সৰি পৰিছিল। বৰ ধুনীয়া পখীৰ গীত আৰু শান্ত পৰিৱেশ। আপুনি এক শান্ত মনৰে জিৰণি লওক।`;
      }
      return `Once in the morning garden, golden marigolds blossomed under the warm sun. The gentle breeze whispered softly through the green leaves, bringing calm to every heart. Take a slow, peaceful breath, ${name}.`;
    }

    // General reassurance
    if (lang === 'hi') {
      return `मैं आपकी बात समझ रही हूँ, ${name} जी। मैं हर पल आपके साथ हूँ। आप बहुत अच्छे हैं और सब कुछ ठीक है। आप मुझसे कुछ भी कह सकते हैं।`;
    }
    if (lang === 'as') {
      return `মই আপোনাৰ কথা বুজি পাইছোঁ, ${name}। মই সদায় আপোনাৰ কাষতেই আছোঁ। আপুনি সম্পূর্ণ নিৰাপদ আৰু মৰমৰ মাজত আছে।`;
    }
    return `I hear you, ${name}. I am right here by your side. Everything is peaceful, you are doing wonderfully today, and I am always happy to talk with you.`;
  }
}

export const smritiAi = new SmritiAiService();
