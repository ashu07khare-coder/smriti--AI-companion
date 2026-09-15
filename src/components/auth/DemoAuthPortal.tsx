import React, { useState } from 'react';
import { UserProfile, LanguageCode } from '../../types';
import { SmritiAuthWorkflow } from './SmritiAuthWorkflow';
import { SmritiBrandMark } from '../SmritiBrandMark';
import { AppStorage, DEFAULT_USER_PROFILE } from '../../utils/storage';
import { bhashiniVoice } from '../../utils/bhashiniVoice';
import {
  Sparkles,
  ShieldCheck,
  Heart,
  Users,
  Brain,
  Mic,
  ArrowRight,
  CheckCircle2,
  Lock,
  Globe,
  Star,
  UserCheck
} from 'lucide-react';

interface DemoAuthPortalProps {
  currentUser: UserProfile | null;
  currentLanguage: LanguageCode;
  onAuthSuccess: (user: UserProfile) => void;
  onSelectLanguage: (lang: LanguageCode) => void;
  onSkipToDemo: () => void;
  isModal?: boolean;
  onClose?: () => void;
}

export const DemoAuthPortal: React.FC<DemoAuthPortalProps> = ({
  currentUser,
  currentLanguage,
  onAuthSuccess,
  onSelectLanguage,
  onSkipToDemo,
  isModal = false,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  // Pre-configured Demo Profiles for Hackathon Judges
  const DEMO_PERSONAS = [
    {
      id: 'aita-assam',
      name: 'Bonti Khound (Aita)',
      role: 'Elder Patient (Assam)',
      caregiver: 'Ananya (Granddaughter)',
      lang: 'as' as LanguageCode,
      langLabel: 'অসমীয়া / English',
      avatarBg: 'bg-[#FEF3C7] text-[#B45309]',
      phone: '+91 98765 43210',
      badgeColor: 'bg-[#E1F5EE] text-[#1F8A5F]',
      desc: 'Mild cognitive impairment, routine BP medication, daily memory card games.',
      profile: {
        ...DEFAULT_USER_PROFILE,
        id: 'patient-aita-001',
        elderName: 'Bonti Khound',
        preferredName: 'Aita',
        phone: '+91 98765 43210',
        language: 'as' as LanguageCode,
        stateRegion: 'Assam',
        districtArea: 'Kamrup / Guwahati',
        caregiverName: 'Ananya Bora',
        caregiverPhone: '+91 98765 43211',
      },
    },
    {
      id: 'babaji-hindi',
      name: 'Kailash Nath (Baba Ji)',
      role: 'Elder Patient (Varanasi/Delhi)',
      caregiver: 'Rahul (Son)',
      lang: 'hi' as LanguageCode,
      langLabel: 'हिन्दी (Hindi)',
      avatarBg: 'bg-[#FFEDD5] text-[#C2410C]',
      phone: '+91 98112 34567',
      badgeColor: 'bg-[#FEF3C7] text-[#92400E]',
      desc: 'Early memory lapse, morning diabetes reminder, pattern recall exercises.',
      profile: {
        ...DEFAULT_USER_PROFILE,
        id: 'patient-babaji-002',
        elderName: 'Kailash Nath Sharma',
        preferredName: 'Baba Ji',
        phone: '+91 98112 34567',
        language: 'hi' as LanguageCode,
        stateRegion: 'Delhi',
        districtArea: 'Varanasi / New Delhi',
        caregiverName: 'Rahul Sharma',
        caregiverPhone: '+91 98112 34568',
      },
    },
    {
      id: 'pi-lalthan',
      name: 'Pi Lalthanpuii',
      role: 'Elder Patient (Mizoram)',
      caregiver: 'David (Son)',
      lang: 'lus' as LanguageCode,
      langLabel: 'Mizo ṭawng',
      avatarBg: 'bg-[#DBEAFE] text-[#1D4ED8]',
      phone: '+91 94361 23456',
      badgeColor: 'bg-[#E3EFFC] text-[#2A6DB5]',
      desc: 'Folk audio story lover, evening walking reminder, family photo matching.',
      profile: {
        ...DEFAULT_USER_PROFILE,
        id: 'patient-pilalthan-003',
        elderName: 'Pi Lalthanpuii',
        preferredName: 'Pi Lalthan',
        phone: '+91 94361 23456',
        language: 'lus' as LanguageCode,
        stateRegion: 'Mizoram',
        districtArea: 'Aizawl',
        caregiverName: 'David Lalnunmawia',
        caregiverPhone: '+91 94361 23457',
      },
    },
  ];

  const handleSelectPersona = (persona: typeof DEMO_PERSONAS[0]) => {
    bhashiniVoice.playGentleTone('chime');
    AppStorage.saveUserProfile(persona.profile);
    onAuthSuccess(persona.profile);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFDF6] via-[#FFFBEF] to-[#FFF3D2] text-[#173C36] py-6 px-4 sm:px-6 lg:px-8 flex flex-col justify-between selection:bg-[#F5C244]/30 font-sans">
      {/* Top Banner Navigation */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between pb-6 border-b border-[#173C36]/10">
        <div className="flex items-center gap-3">
          <SmritiBrandMark size="md" />
          <div className="hidden sm:block">
            <span className="text-xs font-bold text-[#2F9E76] uppercase tracking-wider block">
              Cognitive Companion
            </span>
            <span className="text-xs text-[#173C36]/70">
              Dementia &amp; Memory Care Platform
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onSkipToDemo}
            className="px-4 py-2 rounded-full bg-white/90 border border-[#173C36]/15 hover:bg-white text-xs font-bold text-[#173C36] shadow-xs active:scale-95 transition-all flex items-center gap-1.5"
          >
            <span>Explore App Directly</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#2F9E76]" />
          </button>
          {isModal && onClose && (
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white border border-[#173C36]/10 flex items-center justify-center text-[#173C36] hover:bg-gray-50 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Main Content Showcase */}
      <div className="w-full max-w-5xl mx-auto py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Product Story & 1-Click Demo Personas */}
        <div className="lg:col-span-5 space-y-6">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E1F5EE] border border-[#2F9E76]/20 text-[#1F8A5F] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#E07936]" />
            <span>Hackathon &amp; Evaluator Demo Portal</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-[#173C36] leading-tight">
              Gentle Cognitive Care for Every Elder.
            </h1>
            <p className="text-xs sm:text-sm text-[#173C36]/75 leading-relaxed font-medium">
              Multilingual AI voice assistance, memory-stimulating local games, cultural audio stories, and real-time family Care Circle tracking.
            </p>
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-2 gap-2.5 text-xs font-semibold">
            <div className="p-3 rounded-2xl bg-white/80 border border-[#173C36]/10 flex items-center gap-2 shadow-xs">
              <Mic className="w-4 h-4 text-[#2F9E76] shrink-0" />
              <span>Bhashini Voice AI</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/80 border border-[#173C36]/10 flex items-center gap-2 shadow-xs">
              <Brain className="w-4 h-4 text-[#C4641B] shrink-0" />
              <span>Memory Games</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/80 border border-[#173C36]/10 flex items-center gap-2 shadow-xs">
              <Heart className="w-4 h-4 text-[#E11D48] shrink-0" />
              <span>Care Circle Alerts</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/80 border border-[#173C36]/10 flex items-center gap-2 shadow-xs">
              <Globe className="w-4 h-4 text-[#2563EB] shrink-0" />
              <span>11+ Indic Languages</span>
            </div>
          </div>

          {/* Quick 1-Click Demo Profiles Box */}
          <div className="p-5 rounded-3xl bg-[#FFFDF6] border border-[#F5C244]/40 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-[#F5C244] text-[#F5C244]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#173C36]">
                  1-Click Demo Profiles
                </h3>
              </div>
              <span className="text-[10px] text-[#173C36]/60 font-semibold">
                Instant Login
              </span>
            </div>

            <p className="text-xs text-[#173C36]/70 leading-relaxed">
              Select any pre-configured elder profile below to experience the personalized routine, reminders, and audio:
            </p>

            <div className="space-y-2">
              {DEMO_PERSONAS.map((persona) => (
                <button
                  key={persona.id}
                  onClick={() => handleSelectPersona(persona)}
                  className="w-full p-3 rounded-2xl bg-[#FFFBEF] hover:bg-white border border-[#173C36]/10 hover:border-[#F5C244] text-left transition-all group flex items-center justify-between gap-3 shadow-2xs hover:shadow-xs active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-xl ${persona.avatarBg} font-bold text-sm flex items-center justify-center shrink-0 shadow-2xs`}>
                      {persona.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-xs text-[#173C36] truncate group-hover:text-[#2F9E76] transition-colors">
                          {persona.name}
                        </h4>
                        <span className={`text-[9.5px] font-bold px-2 py-0.2 rounded-full ${persona.badgeColor}`}>
                          {persona.langLabel}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#173C36]/60 truncate mt-0.5">
                        {persona.role} · Caregiver: {persona.caregiver}
                      </p>
                    </div>
                  </div>

                  <div className="w-7 h-7 rounded-full bg-[#173C36]/5 group-hover:bg-[#173C36] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Full Interactive SmritiAuthWorkflow (Login / Sign Up) */}
        <div className="lg:col-span-7">
          <div className="rounded-[32px] overflow-hidden shadow-2xl border border-[#173C36]/15 bg-[#FFFDF6]">
            <SmritiAuthWorkflow
              initialTab={activeTab}
              initialLanguage={currentLanguage}
              onSuccess={(user) => {
                bhashiniVoice.playGentleTone('chime');
                onAuthSuccess(user);
              }}
              onLanguageChange={onSelectLanguage}
              isModal={false}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full max-w-5xl mx-auto pt-6 border-t border-[#173C36]/10 text-center text-xs text-[#173C36]/60 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>© 2026 Smriti AI Companion · Designed for Dementia &amp; MCI Care</span>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 font-semibold text-[#2F9E76]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Bhashini &amp; Gemini Powered</span>
          </span>
          <span>·</span>
          <span>HIPAA &amp; Ayushman Bharat Ready</span>
        </div>
      </div>
    </div>
  );
};
