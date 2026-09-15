import React, { useState, useEffect, useRef } from 'react';
import { Reminder, FamilyMember, LanguageCode, UserProfile } from '../types';
import { LANGUAGES } from '../data/mockData';
import { bhashiniVoice } from '../utils/bhashiniVoice';
import { AppStorage } from '../utils/storage';
import { getTranslation } from '../utils/translations';
import { getTodayTabUiStrings } from '../utils/localizationHelpers';
import { SpeakWithSmritiModal } from './SpeakWithSmritiModal';
import { calculateReminderAdherenceMetrics, evaluateReminderTimeliness } from '../utils/adherenceMetrics';
import {
  Volume2,
  VolumeX,
  Plus,
  Check,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  HelpCircle,
  Clock,
  Mic,
  Sparkles,
  Heart,
  ChevronDown,
  Activity,
  Flame,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface TodayTabProps {
  currentLanguage: LanguageCode;
  reminders: Reminder[];
  familyMembers: FamilyMember[];
  onToggleReminder: (id: string) => void;
  onSelectGame: (gameId: string) => void;
  onOpenVoiceReminder: () => void;
  onOpenCaregiverMode: () => void;
  onSync: () => void;
  currentUser?: UserProfile | null;
}

export const TodayTab: React.FC<TodayTabProps> = ({
  currentLanguage,
  reminders,
  familyMembers,
  onToggleReminder,
  onSelectGame,
  onOpenVoiceReminder,
  onOpenCaregiverMode,
  onSync,
  currentUser,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [isSlideshowPlaying, setIsSlideshowPlaying] = useState(false);
  const [isPlayingVoiceNote, setIsPlayingVoiceNote] = useState(false);
  const [playingVoiceReminderId, setPlayingVoiceReminderId] = useState<string | null>(null);
  const voiceAudioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const [showPlanHelp, setShowPlanHelp] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing'>('synced');
  const [timeSelectorOpen, setTimeSelectorOpen] = useState(false);
  const [isSmritiAiModalOpen, setIsSmritiAiModalOpen] = useState(false);

  const t = getTranslation(currentLanguage);
  const ui = getTodayTabUiStrings(currentLanguage);
  const activeLang = LANGUAGES.find(l => l.code === currentLanguage) || LANGUAGES[0];
  const currentMember = familyMembers[activePhotoIdx] || familyMembers[0];
  const elderCallName = currentUser?.preferredName || 'Aita';

  const adherenceMetrics = calculateReminderAdherenceMetrics(
    reminders,
    AppStorage.getAdherenceHistory(),
    30
  );

  // Slideshow timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSlideshowPlaying && familyMembers.length > 0) {
      timer = setInterval(() => {
        setActivePhotoIdx(prev => (prev + 1) % familyMembers.length);
      }, 4000);
    }
    return () => clearInterval(timer);
  }, [isSlideshowPlaying, familyMembers.length]);

  const handleListenGreeting = () => {
    if (isPlayingAudio) {
      bhashiniVoice.stop();
      setIsPlayingAudio(false);
      return;
    }

    bhashiniVoice.playGentleTone('chime');
    setIsPlayingAudio(true);

    const spokenScripts: Record<LanguageCode, string> = {
      as: `নমস্কাৰ ${elderCallName}! আজি এটা সুন্দৰ আৰু শান্ত দিন। পুৱাৰ ঔষধ আৰু ৫ মিনিটৰ মনসংযোগ খেলা আছে। আপোনাক সকলোৱে বহুত ভাল পায়।`,
      brx: `खुलुमबाय ${elderCallName}! दिनै मोनसे गोजोन सान। फुंनि मुलि लोंनाय आरो ५ मिनिट गेलेनाय दं। नोंथांखौ गासैबो अननाय हरो।`,
      mni: `খুরুমজরি ${elderCallName}! ঙসি অয়ুক্কী নুংঙাইবা মতম্নি। অয়ুক্কী হিদাক চাবা অমসুং ৱাখলগী শান্নবা য়াওরি। পুন্না নুংশিজরি।`,
      lus: `Chibai ${elderCallName}! Vawiin chu ni nuam tak a ni. Zing damdawi ei leh rilru sawizawina minute 5 infiamna i nei e. Kan ngaina vek che!`,
      kha: `Khublei ${elderCallName}! Mynta ka dei ka step ba suk. Don ka dawai step bad ka jingïalehkai bor pyrkhat. Baroh ngi ieid ïa phi!`,
      grt: `Mitingalo ${elderCallName}! Da·al namen tom·toma sal ong·a. Pringni sam ringani aro gisik kal·ani donga. Pilakan nang·ko ka·saa!`,
      trp: `Khulumkha ${elderCallName}! Tini kaham sal. Phungni bwsari chano tei uansukma khalani tongo. Joto nongo hamjakgo!`,
      nag: `Namaste ${elderCallName}! Aji bishi bhal shuruat asey. Medicine time aru thura khela asey. Sob manu apuni ke bhal paye!`,
      ne: `नमस्ते ${elderCallName}! आज एक सुन्दर र शान्त बिहानी छ। बिहानको औषधि र ५ मिनेटको मस्तिष्क खेल छ। सबैको न्यानो माया छ!`,
      hi: `नमस्ते ${elderCallName}! आज एक बहुत ही शांत और सुखद दिन है। सुबह की दवाई और थोड़ी सी दिमागी कसरत। हम सब आपसे बहुत प्यार करते हैं।`,
      en: `Namaskar ${elderCallName}! Today is a beautiful, peaceful morning. You have your morning medicine and gentle brain exercise. We all love you!`,
    };

    const textToSpeak = spokenScripts[currentLanguage] || spokenScripts.as;

    bhashiniVoice.speak(textToSpeak, currentLanguage, () => {
      setIsPlayingAudio(false);
    });
  };

  const handlePlayVoiceNote = (text?: string) => {
    if (!text) return;
    if (isPlayingVoiceNote) {
      bhashiniVoice.stop();
      setIsPlayingVoiceNote(false);
      return;
    }
    bhashiniVoice.playGentleTone('soft');
    setIsPlayingVoiceNote(true);
    bhashiniVoice.speak(text, currentLanguage, () => {
      setIsPlayingVoiceNote(false);
    });
  };

  const handlePlayVoiceReminder = (reminder: Reminder) => {
    if (!reminder.audio_file_path) {
      // Fallback voice tone if no audio path
      bhashiniVoice.speak(reminder.title, currentLanguage);
      return;
    }

    if (playingVoiceReminderId === reminder.id) {
      if (voiceAudioPlayerRef.current) {
        voiceAudioPlayerRef.current.pause();
        voiceAudioPlayerRef.current = null;
      }
      setPlayingVoiceReminderId(null);
      return;
    }

    if (voiceAudioPlayerRef.current) {
      voiceAudioPlayerRef.current.pause();
    }

    const audio = new Audio(reminder.audio_file_path);
    voiceAudioPlayerRef.current = audio;
    setPlayingVoiceReminderId(reminder.id);

    audio.onended = () => {
      setPlayingVoiceReminderId(null);
    };
    audio.onerror = () => {
      setPlayingVoiceReminderId(null);
    };

    audio.play().catch(() => {
      setPlayingVoiceReminderId(null);
    });
  };

  const handleSyncTap = () => {
    setSyncStatus('syncing');
    bhashiniVoice.playGentleTone('chime');
    onSync();
    setTimeout(() => {
      setSyncStatus('synced');
    }, 900);
  };

  const nextPhoto = () => {
    setActivePhotoIdx(prev => (prev + 1) % familyMembers.length);
  };

  const prevPhoto = () => {
    setActivePhotoIdx(prev => (prev - 1 + familyMembers.length) % familyMembers.length);
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 pb-28 pt-2 space-y-6 animate-in fade-in duration-300">
      {/* Date Eyebrow */}
      <div className="tracking-[0.18em] uppercase text-[11px] font-bold text-[#173C36]/60">
        {t.today.gentleStart}
      </div>

      {/* Greeting & Sync Status Row */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-[#173C36] leading-[1.15]">
            {t.today.greetingGreeting},<br />{elderCallName}
          </h1>
          <p className="text-xs text-[#173C36]/70 mt-1 font-medium">
            {currentUser?.districtArea ? `${currentUser.districtArea}, ${currentUser.stateRegion} · ` : ''}{activeLang.greeting}
          </p>
        </div>

        {/* Sync Status Pill */}
        <button
          id="sync-button"
          onClick={handleSyncTap}
          className="shrink-0 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFDF6] border border-[#173C36]/10 text-xs font-semibold text-[#173C36] shadow-xs hover:bg-white active:scale-95 transition-all"
          aria-label={t.today.tapToSync}
        >
          <span className={`w-2.5 h-2.5 rounded-full bg-[#2F9E76] ${syncStatus === 'syncing' ? 'animate-ping' : ''}`} />
          <span>{syncStatus === 'syncing' ? '...' : t.today.syncOnline}</span>
        </button>
      </div>

      {/* Card: A GENTLE START */}
      <div className="relative rounded-[28px] bg-[#FFFDF6] border border-[#173C36]/5 p-6 shadow-xs overflow-hidden">
        {/* Decorative soft backdrop arc */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-[#FDF0BE]/40 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

        <div className="tracking-[0.18em] uppercase text-[10px] font-bold text-[#173C36]/60 mb-4">
          {t.today.gentleStart}
        </div>

        <div className="flex items-center gap-4 mb-4">
          {/* Gentle AI & Voice Avatar */}
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#F5C244] to-[#FDECDA] border border-[#173C36]/10 flex items-center justify-center text-[#173C36] shrink-0 shadow-xs relative">
            <Sparkles className="w-7 h-7 text-[#173C36] stroke-[2]" />
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#2F9E76] ring-2 ring-white" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-display font-bold text-[#173C36] leading-tight">
                {t.today.greetingGreeting}!
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-[#E1F5EE] text-[#1F8A5F] text-[10px] font-bold">
                {ui.aiCompanionBadge}
              </span>
            </div>
            <p className="text-xs text-[#173C36]/75 font-medium mt-0.5">
              {ui.aiCompanionDesc}
            </p>
          </div>
        </div>

        {/* Speak with Smriti AI button */}
        <div className="flex justify-center w-full pt-1">
          <button
            id="listen-greeting-btn"
            onClick={() => {
              bhashiniVoice.stop();
              setIsPlayingAudio(false);
              setIsSmritiAiModalOpen(true);
            }}
            className="w-full sm:w-auto px-7 py-3.5 rounded-full font-bold text-sm sm:text-base flex items-center justify-center gap-3 transition-all duration-200 shadow-md hover:shadow-lg bg-[#173C36] hover:bg-[#1f4e46] active:scale-[0.98] text-white group ring-2 ring-[#173C36]/10 hover:ring-[#2F9E76]/40 cursor-pointer"
            aria-label={ui.speakWithSmritiBtn}
          >
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <Sparkles className="w-4 h-4 text-[#F5C244] animate-pulse" />
            </div>
            <span className="font-semibold tracking-wide">{ui.speakWithSmritiBtn}</span>
            <span className="text-[10px] tracking-wider uppercase font-bold px-2.5 py-0.5 rounded-full bg-white/15 text-[#FDF0BE] border border-white/20">
              {ui.aiVoiceBadge}
            </span>
          </button>
        </div>
      </div>

      {/* Today's simple plan Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-display font-bold text-[#173C36]">
              {t.today.todaysPlan}
            </h2>
            <button
              onClick={() => setShowPlanHelp(!showPlanHelp)}
              className="w-7 h-7 rounded-full text-[#173C36]/60 hover:text-[#173C36] flex items-center justify-center"
              aria-label="Information about today's plan"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>

          {/* Direct record action button in Reminders section */}
          <button
            id="plan-record-voice-btn"
            onClick={onOpenVoiceReminder}
            className="px-3.5 py-1.5 rounded-full bg-[#E07936] hover:bg-[#C96425] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-transform active:scale-95"
            aria-label={ui.addVoiceReminderBtn}
          >
            <Mic className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>{ui.addVoiceReminderBtn}</span>
          </button>
        </div>

        {showPlanHelp && (
          <div className="p-3.5 bg-[#FFFDF6] border border-[#173C36]/10 rounded-2xl text-xs text-[#173C36]/80 leading-relaxed animate-in fade-in">
            {elderCallName}, {t.today.routineCompleted}
          </div>
        )}

        {/* Daily Adherence Metric Summary Strip */}
        <div className="p-3 rounded-2xl bg-[#FFFBEF] border border-[#173C36]/10 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-[#173C36] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2F9E76]" />
              {adherenceMetrics.completedCount}/{adherenceMetrics.totalScheduled} Done ({adherenceMetrics.completionRate}%)
            </span>
            <span className="text-[#173C36]/30 hidden sm:inline">·</span>
            <span className="text-[#2A6DB5] font-semibold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {adherenceMetrics.timelinessRate}% On-Time (±30m)
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {adherenceMetrics.missedCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#FEE2E2] text-[#B91C1C] text-[10px] font-bold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {adherenceMetrics.missedCount} Missed
              </span>
            )}
            <span className="px-2.5 py-0.5 rounded-full bg-[#FDECDA] text-[#C4641B] text-[11px] font-bold flex items-center gap-1">
              <Flame className="w-3 h-3 fill-current" />
              {adherenceMetrics.adherenceStreak}-day streak
            </span>
          </div>
        </div>

        {/* Stacked Plan Cards */}
        <div className="space-y-2.5">
          {/* Reminders List */}
          {reminders.map(rem => {
            const isVoice = rem.isVoiceReminder || rem.category === 'voice' || !!rem.audio_file_path;

            if (isVoice) {
              return (
                <div
                  key={rem.id}
                  className={`rounded-[24px] bg-[#FFFDF6] border ${
                    rem.status === 'snoozed' ? 'border-[#F5C244]/40 bg-[#FFFDF0]' : 'border-[#173C36]/10'
                  } p-4 flex items-center justify-between gap-3 shadow-xs transition-all ${
                    rem.completed ? 'opacity-70' : ''
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    {/* Done / Check button */}
                    <button
                      id={`reminder-check-${rem.id}`}
                      onClick={() => onToggleReminder(rem.id)}
                      className={`w-11 h-11 rounded-full flex items-center justify-center transition-all shrink-0 ${
                        rem.completed
                          ? 'bg-[#2F9E76] text-white'
                          : 'bg-[#FDECDA] text-[#C4641B] hover:scale-105'
                      }`}
                      aria-label={rem.completed ? t.today.alreadyTaken : t.today.markDone}
                    >
                      {rem.completed ? <Check className="w-5 h-5 stroke-[2.5]" /> : <Plus className="w-5 h-5 stroke-[2.5]" />}
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className={`text-sm font-bold text-[#173C36] ${rem.completed ? 'line-through text-[#173C36]/60' : ''}`}>
                          {ui.voiceReminderCardTitle}
                        </h3>
                        {rem.status === 'snoozed' && (
                          <span className="px-2 py-0.5 rounded-full bg-[#FFF3D2] text-[#B7791F] text-[10px] font-bold">
                            {ui.snoozedBadge}
                          </span>
                        )}
                        {rem.completed && (
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            rem.completionStatus === 'late'
                              ? 'bg-[#FDECDA] text-[#C4641B]'
                              : 'bg-[#E1F5EE] text-[#2F9E76]'
                          }`}>
                            {rem.completionStatus === 'late' ? 'Late' : 'On-Time'}
                          </span>
                        )}
                      </div>
                      {/* Set time display */}
                      <p className="text-xs text-[#173C36]/70 flex items-center gap-1 mt-0.5 font-medium">
                        <Clock className="w-3.5 h-3.5 text-[#E07936]" />
                        <span>{rem.time}</span>
                      </p>
                    </div>
                  </div>

                  {/* Play / Waveform Icon Button */}
                  <div className="flex items-center gap-2">
                    <button
                      id={`play-voice-${rem.id}`}
                      onClick={() => handlePlayVoiceReminder(rem)}
                      className={`w-11 h-11 rounded-full flex items-center justify-center transition-all shadow-xs ${
                        playingVoiceReminderId === rem.id
                          ? 'bg-[#E07936] text-white scale-105 shadow-md'
                          : 'bg-[#FFFBEF] border border-[#173C36]/15 text-[#173C36] hover:bg-[#E07936] hover:text-white hover:scale-105'
                      }`}
                      title={playingVoiceReminderId === rem.id ? "Pause playback" : "Play original voice reminder"}
                      aria-label="Play original voice reminder"
                    >
                      {playingVoiceReminderId === rem.id ? (
                        <Activity className="w-5 h-5 animate-pulse stroke-[2.5]" />
                      ) : (
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      )}
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={rem.id}
                className={`rounded-[24px] bg-[#FFFDF6] border border-[#173C36]/5 p-4 flex items-center justify-between gap-3 shadow-xs transition-all ${
                  rem.completed ? 'opacity-70' : ''
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <button
                    id={`reminder-check-${rem.id}`}
                    onClick={() => onToggleReminder(rem.id)}
                    className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                      rem.completed
                        ? 'bg-[#2F9E76] text-white'
                        : 'bg-[#FDECDA] text-[#C4641B] hover:scale-105'
                    }`}
                    aria-label={rem.completed ? t.today.alreadyTaken : t.today.markDone}
                  >
                    {rem.completed ? <Check className="w-5 h-5 stroke-[2.5]" /> : <Plus className="w-5 h-5 stroke-[2.5]" />}
                  </button>

                  <div>
                    <h3 className={`text-sm font-bold text-[#173C36] ${rem.completed ? 'line-through text-[#173C36]/60' : ''}`}>
                      {rem.title}
                    </h3>
                    <p className="text-xs text-[#173C36]/70">
                      {rem.subtitle}
                    </p>
                  </div>
                </div>

                {/* Time & Timeliness Control Pill */}
                <div className="flex items-center gap-1.5">
                  {rem.completed && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      rem.completionStatus === 'late'
                        ? 'bg-[#FDECDA] text-[#C4641B]'
                        : 'bg-[#E1F5EE] text-[#2F9E76]'
                    }`}>
                      {rem.completionStatus === 'late' ? 'Late' : 'On-Time'}
                    </span>
                  )}
                  <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#FFFBEF] border border-[#173C36]/10 text-xs font-semibold text-[#173C36]">
                    <span>{rem.time}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Brain Exercise Quick-Jump Card */}
          <div
            onClick={() => onSelectGame('target_spotting')}
            className="rounded-[24px] bg-[#FFFDF6] border border-[#173C36]/5 p-4 flex items-center justify-between gap-3 shadow-xs cursor-pointer hover:bg-white transition-all group"
          >
            <div className="flex items-center gap-3.5">
              {/* Pastel blue badge */}
              <div className="w-11 h-11 rounded-full bg-[#E3EFFC] text-[#2A6DB5] flex items-center justify-center font-bold text-sm shrink-0">
                A+
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#173C36] group-hover:text-[#2A6DB5] transition-colors">
                  {t.today.gentleBrain}
                </h3>
                <p className="text-xs text-[#173C36]/70">
                  {t.today.brainSub}
                </p>
              </div>
            </div>

            <div className="px-3 py-1.5 rounded-full bg-[#F5C244] text-[#173C36] text-xs font-bold flex items-center gap-1 group-hover:scale-105 transition-transform">
              <span>{t.games.playNow}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Memory Lane Slideshow Card */}
      {familyMembers.length > 0 && currentMember && (
        <div className="rounded-[28px] bg-[#FFFDF6] border border-[#173C36]/5 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="tracking-[0.18em] uppercase text-[10px] font-bold text-[#173C36]/60">
                {t.today.memoryLaneTitle}
              </div>
              <h2 className="text-lg font-display font-bold text-[#173C36]">
                {t.today.memoryLaneSub}
              </h2>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-[11px] font-semibold text-[#173C36]/60">
                {activePhotoIdx + 1} / {familyMembers.length}
              </span>
            </div>
          </div>

          {/* Photo frame with rounded corners */}
          <div className="relative rounded-[22px] overflow-hidden bg-black/5 aspect-[4/3] border border-black/5 shadow-inner">
            <img
              src={currentMember.photoUrl}
              alt={currentMember.name}
              className="w-full h-full object-cover transition-all duration-300"
              referrerPolicy="no-referrer"
            />
            {/* Gentle overlay gradient for legibility */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-4 text-white">
              <h3 className="text-xl font-display font-bold leading-tight">
                {currentMember.name}
              </h3>
              <p className="text-xs text-white/90 font-medium">
                {currentMember.relationship}
              </p>
            </div>
          </div>

          {/* Caption & Voice Note from Caregiver */}
          {currentMember.voiceNoteText && (
            <div className="p-3 bg-[#FFFBEF] rounded-2xl border border-[#173C36]/10 flex items-start justify-between gap-2">
              <p className="text-xs italic text-[#173C36]/80 flex-1">
                "{currentMember.voiceNoteText}"
              </p>
              <button
                onClick={() => handlePlayVoiceNote(currentMember.voiceNoteText)}
                className={`shrink-0 p-2 rounded-full transition-all ${
                  isPlayingVoiceNote ? 'bg-[#E07936] text-white animate-bounce' : 'bg-[#F5C244] text-[#173C36] hover:scale-105'
                }`}
                title={t.today.hearVoiceNote}
                aria-label={t.today.hearVoiceNote}
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Slideshow Controls Row */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={prevPhoto}
              className="w-9 h-9 rounded-full bg-[#FFFBEF] border border-[#173C36]/10 flex items-center justify-center text-[#173C36] hover:bg-white active:scale-95"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Play / Pause toggle */}
            <button
              onClick={() => setIsSlideshowPlaying(!isSlideshowPlaying)}
              className="px-4 py-1.5 rounded-full bg-[#173C36] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs hover:bg-[#1f4e46]"
            >
              {isSlideshowPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-white" />
                  <span>{ui.pauseSlideshow}</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>{ui.playSlideshow}</span>
                </>
              )}
            </button>

            <button
              onClick={nextPhoto}
              className="w-9 h-9 rounded-full bg-[#FFFBEF] border border-[#173C36]/10 flex items-center justify-center text-[#173C36] hover:bg-white active:scale-95"
              aria-label="Next photo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Dot Indicators */}
          <div className="flex items-center justify-center gap-1.5 pt-1">
            {familyMembers.map((_, i) => (
              <button
                key={i}
                onClick={() => setActivePhotoIdx(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === activePhotoIdx ? 'w-5 bg-[#173C36]' : 'w-1.5 bg-[#173C36]/20'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Voice Reminder Quick Action Button */}
      <div className="rounded-[28px] bg-gradient-to-r from-[#FDECDA] to-[#FFF3D2] border-2 border-[#E07936]/30 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full bg-[#E07936] text-white flex items-center justify-center shrink-0 shadow-md">
            <Mic className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#173C36]">
              {ui.voiceReminderCardTitle}
            </h3>
            <p className="text-xs text-[#173C36]/75 mt-0.5 leading-relaxed">
              {ui.voiceReminderCardDesc}
            </p>
          </div>
        </div>

        <button
          id="speak-reminder-btn"
          onClick={onOpenVoiceReminder}
          className="w-full sm:w-auto px-5 py-3 rounded-full bg-[#173C36] hover:bg-[#1f4e46] active:scale-95 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all shrink-0"
          aria-label={ui.recordVoiceReminderBtn}
        >
          <Mic className="w-4 h-4 text-[#F5C244]" />
          <span>{ui.recordVoiceReminderBtn}</span>
        </button>
      </div>

      {/* Speak with Smriti AI Voice Conversation Modal */}
      <SpeakWithSmritiModal
        isOpen={isSmritiAiModalOpen}
        onClose={() => setIsSmritiAiModalOpen(false)}
        currentUser={currentUser || null}
        currentLanguage={currentLanguage}
        reminders={reminders}
        familyMembers={familyMembers}
      />
    </div>
  );
};
