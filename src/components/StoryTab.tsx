import React, { useState, useEffect } from 'react';
import { Story, StoryCategory, LanguageCode } from '../types';
import { STORIES_DATA } from '../data/mockData';
import { bhashiniVoice } from '../utils/bhashiniVoice';
import { getTranslation } from '../utils/translations';
import {
  getLocalizedSection,
  getLocalizedStoryMeta,
  getLocalizedState,
  getLocalizedDistrict,
  getStoryUiStrings,
} from '../utils/localizationHelpers';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Sparkles,
  ArrowLeft,
  Headphones,
  Compass,
  Landmark,
  CloudFog,
  Heart,
  Layers,
} from 'lucide-react';

interface StoryTabProps {
  currentLanguage: LanguageCode;
}

interface StorySectionMeta {
  id: StoryCategory;
  name: string;
  shortName: string;
  description: string;
  icon: React.ElementType;
  bgCard: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
  iconBg: string;
  iconColor: string;
}

const SECTIONS_CONFIG: StorySectionMeta[] = [
  {
    id: 'Historical Fiction / Folk-History',
    name: 'Historical Fiction / Folk-History',
    shortName: 'Historical / Folk-History',
    description: 'River battles, royal palaces, sacred stone monoliths, and ancestral courage.',
    icon: Landmark,
    bgCard: 'bg-[#FFFDF6]',
    borderColor: 'border-[#F5C244]/30',
    badgeBg: 'bg-[#FEF3C7]',
    badgeText: 'text-[#92400E]',
    iconBg: 'bg-[#FEF3C7]',
    iconColor: 'text-[#B45309]',
  },
  {
    id: 'Atmospheric Mystery / Thriller',
    name: 'Atmospheric Mystery / Thriller',
    shortName: 'Atmospheric Mystery',
    description: 'Midnight fog, haunting flutes, wandering lake islands, and twilight mountain lights.',
    icon: CloudFog,
    bgCard: 'bg-[#F9FBFE]',
    borderColor: 'border-[#3B82F6]/25',
    badgeBg: 'bg-[#DBEAFE]',
    badgeText: 'text-[#1E40AF]',
    iconBg: 'bg-[#DBEAFE]',
    iconColor: 'text-[#2563EB]',
  },
  {
    id: 'Heartwarming & Emotional',
    name: 'Heartwarming & Emotional',
    shortName: 'Heartwarming',
    description: 'Generations mending family silk, warm dawn tea, and cherished nostalgic letters.',
    icon: Heart,
    bgCard: 'bg-[#FFF8F8]',
    borderColor: 'border-[#F43F5E]/25',
    badgeBg: 'bg-[#FFE4E6]',
    badgeText: 'text-[#9F1239]',
    iconBg: 'bg-[#FFE4E6]',
    iconColor: 'text-[#E11D48]',
  },
  {
    id: 'Folk-Wisdom',
    name: 'Folk-Wisdom',
    shortName: 'Folk-Wisdom',
    description: 'Living root bridges, fables of sharing, and ancient lessons from wise elders.',
    icon: Sparkles,
    bgCard: 'bg-[#F5FBF7]',
    borderColor: 'border-[#10B981]/25',
    badgeBg: 'bg-[#D1FAE5]',
    badgeText: 'text-[#065F46]',
    iconBg: 'bg-[#D1FAE5]',
    iconColor: 'text-[#059669]',
  },
];

export const StoryTab: React.FC<StoryTabProps> = ({ currentLanguage }) => {
  const t = getTranslation(currentLanguage);
  const storyUi = getStoryUiStrings(currentLanguage);
  const [selectedSection, setSelectedSection] = useState<'All' | StoryCategory>('All');
  const [selectedState, setSelectedState] = useState<string>('All States');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All Areas');
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const [ambientSound, setAmbientSound] = useState<boolean>(false);

  const states = ['All States', 'Assam', 'Meghalaya', 'Manipur', 'Mizoram', 'Nagaland', 'Tripura', 'Sikkim'];
  const districtsMap: Record<string, string[]> = {
    'All States': ['All Areas'],
    Assam: ['All Areas', 'Kamrup', 'Majuli', 'Haflong', 'Sualkuchi'],
    Meghalaya: ['All Areas', 'East Khasi Hills', 'Sohra', 'Cherrapunji', 'Shillong'],
    Manipur: ['All Areas', 'Loktak', 'Bishnupur', 'Moirang', 'Imphal'],
    Mizoram: ['All Areas', 'Reiek', 'Aizawl', 'Champhai'],
    Nagaland: ['All Areas', 'Kohima'],
    Tripura: ['All Areas', 'Agartala'],
    Sikkim: ['All Areas', 'Gangtok', 'South Sikkim'],
  };

  const filteredStories = STORIES_DATA.filter(story => {
    if (selectedSection !== 'All' && story.category !== selectedSection) return false;
    if (selectedState !== 'All States' && story.regionState !== selectedState) return false;
    if (
      selectedDistrict !== 'All Areas' &&
      !story.district.toLowerCase().includes(selectedDistrict.toLowerCase()) &&
      !selectedDistrict.toLowerCase().includes(story.district.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleSelectStory = (story: Story) => {
    bhashiniVoice.playGentleTone('chime');
    setActiveStory(story);
    setIsPlaying(true);
    setAudioProgress(0);

    bhashiniVoice.speak(
      story.fullScript,
      currentLanguage,
      () => {
        setIsPlaying(false);
        setAudioProgress(100);
      },
      progressPercent => {
        setAudioProgress(progressPercent);
      }
    );
  };

  const handleTogglePlay = () => {
    if (!activeStory) return;

    if (isPlaying) {
      bhashiniVoice.pause();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      if (bhashiniVoice.isPaused()) {
        bhashiniVoice.resume();
      } else {
        bhashiniVoice.speak(
          activeStory.fullScript,
          currentLanguage,
          () => {
            setIsPlaying(false);
            setAudioProgress(100);
          },
          progressPercent => {
            setAudioProgress(progressPercent);
          },
          audioProgress >= 100 ? 0 : audioProgress
        );
      }
    }
  };

  const handleClosePlayer = () => {
    bhashiniVoice.stop();
    setIsPlaying(false);
    setActiveStory(null);
  };

  const handleRewind = () => {
    if (!activeStory) return;
    bhashiniVoice.playGentleTone('soft');
    const newProgress = Math.max(0, audioProgress - 8);
    setAudioProgress(newProgress);
    if (isPlaying) {
      bhashiniVoice.seek(
        newProgress,
        currentLanguage,
        () => {
          setIsPlaying(false);
          setAudioProgress(100);
        },
        progressPercent => {
          setAudioProgress(progressPercent);
        }
      );
    }
  };

  const handleForward = () => {
    if (!activeStory) return;
    bhashiniVoice.playGentleTone('soft');
    const newProgress = Math.min(100, audioProgress + 8);
    setAudioProgress(newProgress);
    if (isPlaying) {
      bhashiniVoice.seek(
        newProgress,
        currentLanguage,
        () => {
          setIsPlaying(false);
          setAudioProgress(100);
        },
        progressPercent => {
          setAudioProgress(progressPercent);
        }
      );
    }
  };

  const handleToggleAmbient = () => {
    const next = !ambientSound;
    setAmbientSound(next);
    bhashiniVoice.playGentleTone('chime');
    if (next) {
      bhashiniVoice.startAmbientSound();
    } else {
      bhashiniVoice.stopAmbientSound();
    }
  };

  // Cleanup audio & ambient sound on tab change / unmount
  useEffect(() => {
    return () => {
      bhashiniVoice.stop();
      bhashiniVoice.stopAmbientSound();
    };
  }, []);

  const getSectionMeta = (cat: StoryCategory) => {
    return SECTIONS_CONFIG.find(s => s.id === cat) || SECTIONS_CONFIG[0];
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 pb-28 pt-2 space-y-6 animate-in fade-in duration-300">
      {/* Full-Screen Story Audio Player */}
      {activeStory ? (
        (() => {
          const activeMeta = getLocalizedStoryMeta(activeStory.id, currentLanguage);
          const displayTitle = activeMeta?.title || activeStory.title;
          const displaySynopsis = activeMeta?.synopsis || activeStory.synopsis;
          const displayLore = activeMeta?.culturalLore || activeStory.culturalLore;
          const secLocalized = getLocalizedSection(activeStory.category, currentLanguage);
          const stateLocalized = getLocalizedState(activeStory.regionState, currentLanguage);
          const distLocalized = getLocalizedDistrict(activeStory.district, currentLanguage);
          const meta = getSectionMeta(activeStory.category);
          const Icon = meta.icon;

          return (
            <div className="rounded-[32px] bg-[#FFFDF6] border border-[#173C36]/10 p-6 shadow-md space-y-6 animate-in zoom-in-95">
              {/* Top Bar */}
              <div className="flex items-center justify-between">
                <button
                  onClick={handleClosePlayer}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFFBEF] border border-[#173C36]/10 text-xs font-bold text-[#173C36] hover:bg-white active:scale-95 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{t.story.backToStories}</span>
                </button>

                <span className="text-[11px] font-bold text-[#2F9E76] px-3 py-1 rounded-full bg-[#E1F5EE]">
                  {t.story.bhashiniVoiceLabel}
                </span>
              </div>

              {/* Section Badge */}
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${meta.badgeBg} ${meta.badgeText}`}>
                  <Icon className="w-3.5 h-3.5" />
                  {secLocalized.shortName}
                </span>
              </div>

              {/* Cover Art */}
              <div className="relative rounded-[24px] overflow-hidden aspect-[16/10] bg-black/5 shadow-inner">
                <img
                  src={activeStory.coverImage}
                  alt={displayTitle}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="absolute bottom-3.5 left-4 right-4 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#F5C244] text-[#173C36] px-2.5 py-0.5 rounded-full shadow-xs">
                    {stateLocalized} · {distLocalized}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-display font-bold mt-1.5 leading-snug drop-shadow-sm">
                    {displayTitle}
                  </h2>
                </div>
              </div>

              {/* Tags */}
              {activeStory.tags && activeStory.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 -mt-1">
                  {activeStory.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-[#FFFBEF] border border-[#173C36]/10 text-[#173C36]/75"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Synopsis & Lore */}
              <div className="p-3.5 rounded-2xl bg-[#FFFBEF] border border-[#173C36]/10 text-xs text-[#173C36]/80 leading-relaxed">
                <p className="font-medium">{displaySynopsis}</p>
                {displayLore && (
                  <p className="mt-2 pt-2 border-t border-[#173C36]/10 text-[11px] text-[#2F9E76] font-semibold">
                    🌿 {displayLore}
                  </p>
                )}
              </div>

              {/* Read Along Script Display */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold text-[#173C36]/60 px-1">
                  <span>{storyUi.readingView}</span>
                  <span>{activeStory.durationMinutes} {t.story.mins}</span>
                </div>
                <div className="max-h-64 sm:max-h-80 overflow-y-auto p-4 sm:p-5 rounded-2xl bg-[#FFFBEF] border border-[#173C36]/10 text-[13.5px] leading-relaxed text-[#173C36] font-display whitespace-pre-line shadow-inner">
                  {activeStory.fullScript}
                </div>
              </div>

              {/* Audio Progress Bar */}
              <div className="space-y-1">
                <div className="w-full bg-[#173C36]/10 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#F5C244] h-full transition-all duration-300"
                    style={{ width: `${audioProgress}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-semibold text-[#173C36]/60">
                  <span>{Math.floor((audioProgress * 0.05 * activeStory.durationMinutes) * 10) / 10} {t.story.mins}</span>
                  <span>{activeStory.durationMinutes} {t.story.mins}</span>
                </div>
              </div>

              {/* Controls Bar */}
              <div className="flex items-center justify-center gap-5 pt-2">
                <button
                  onClick={handleRewind}
                  className="w-10 h-10 rounded-full bg-[#FFFBEF] border border-[#173C36]/10 flex items-center justify-center text-[#173C36] hover:bg-white active:scale-95"
                  title="Rewind 10s"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {/* Master Play / Pause Button */}
                <button
                  id="story-play-pause-btn"
                  onClick={handleTogglePlay}
                  className="w-16 h-16 rounded-full bg-[#173C36] text-white flex items-center justify-center shadow-lg hover:bg-[#1f4e46] active:scale-95 transition-all"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <Pause className="w-7 h-7 fill-white" />
                  ) : (
                    <Play className="w-7 h-7 fill-white ml-0.5" />
                  )}
                </button>

                <button
                  onClick={handleForward}
                  className="w-10 h-10 rounded-full bg-[#FFFBEF] border border-[#173C36]/10 flex items-center justify-center text-[#173C36] hover:bg-white active:scale-95"
                  title="Forward 10s"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>

              {/* Ambient River / Breeze Sound Toggle */}
              <div className="pt-2 flex items-center justify-center">
                <button
                  onClick={handleToggleAmbient}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                    ambientSound
                      ? 'bg-[#E1F5EE] border-[#2F9E76] text-[#2F9E76]'
                      : 'bg-[#FFFBEF] border-[#173C36]/10 text-[#173C36]/70 hover:text-[#173C36]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t.story.ambientSound}</span>
                </button>
              </div>
            </div>
          );
        })()
      ) : (
        <>
          {/* Eyebrow */}
          <div className="tracking-[0.18em] uppercase text-[11px] font-bold text-[#173C36]/60">
            {t.story.eyebrow}
          </div>

          {/* Title */}
          <div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-[#173C36] leading-tight">
              {t.story.headline}
            </h1>
            <p className="text-xs text-[#173C36]/75 mt-1 font-medium">
              {t.story.subtitle}
            </p>
          </div>

          {/* Story Sections Pill Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#173C36]/70 px-1">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#2F9E76]" />
                {storyUi.allSections}
              </span>
              <span className="text-[11px] text-[#173C36]/50">
                {selectedSection === 'All'
                  ? `${SECTIONS_CONFIG.length} ${storyUi.categoryLabel}`
                  : getLocalizedSection(selectedSection, currentLanguage).shortName}
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1">
              <button
                onClick={() => setSelectedSection('All')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedSection === 'All'
                    ? 'bg-[#173C36] text-white shadow-xs'
                    : 'bg-[#FFFDF6] border border-[#173C36]/10 text-[#173C36]/80 hover:bg-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{storyUi.allSections}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedSection === 'All' ? 'bg-white/20 text-white' : 'bg-[#173C36]/10 text-[#173C36]'
                }`}>
                  {STORIES_DATA.length}
                </span>
              </button>

              {SECTIONS_CONFIG.map(sec => {
                const secLoc = getLocalizedSection(sec.id, currentLanguage);
                const isSelected = selectedSection === sec.id;
                const Icon = sec.icon;
                const count = STORIES_DATA.filter(s => s.category === sec.id).length;
                return (
                  <button
                    key={sec.id}
                    onClick={() => setSelectedSection(sec.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? `${sec.badgeBg} ${sec.badgeText} border border-current shadow-xs`
                        : 'bg-[#FFFDF6] border border-[#173C36]/10 text-[#173C36]/80 hover:bg-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{secLoc.shortName}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-black/10' : 'bg-[#173C36]/10 text-[#173C36]'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Region Picker Dropdowns */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <div className="flex items-center gap-1.5 bg-[#FFFDF6] px-3.5 py-1.5 rounded-full border border-[#173C36]/10 text-xs font-bold text-[#173C36] shadow-xs">
              <Compass className="w-3.5 h-3.5 text-[#2F9E76]" />
              <select
                value={selectedState}
                onChange={e => {
                  setSelectedState(e.target.value);
                  setSelectedDistrict('All Areas');
                }}
                className="bg-transparent font-bold focus:outline-none cursor-pointer text-xs"
              >
                <option value="All States">{t.story.allStates}</option>
                {states.filter(s => s !== 'All States').map(s => (
                  <option key={s} value={s}>
                    {getLocalizedState(s, currentLanguage)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-[#FFFDF6] px-3.5 py-1.5 rounded-full border border-[#173C36]/10 text-xs font-bold text-[#173C36] shadow-xs">
              <select
                value={selectedDistrict}
                onChange={e => setSelectedDistrict(e.target.value)}
                className="bg-transparent font-bold focus:outline-none cursor-pointer text-xs"
              >
                <option value="All Areas">{t.story.allAreas}</option>
                {(districtsMap[selectedState] || ['All Areas']).filter(d => d !== 'All Areas').map(d => (
                  <option key={d} value={d}>
                    {getLocalizedDistrict(d, currentLanguage)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Stories Rendered by Section */}
          <div className="space-y-8">
            {SECTIONS_CONFIG
              .filter(sec => selectedSection === 'All' || selectedSection === sec.id)
              .map(sec => {
                const secLoc = getLocalizedSection(sec.id, currentLanguage);
                const sectionStories = filteredStories.filter(s => s.category === sec.id);
                const SectionIcon = sec.icon;

                return (
                  <section key={sec.id} className="space-y-3.5">
                    {/* Section Header Card */}
                    <div className={`p-4 rounded-[24px] ${sec.bgCard} border ${sec.borderColor} shadow-xs flex items-start gap-3.5`}>
                      <div className={`w-10 h-10 rounded-2xl ${sec.iconBg} ${sec.iconColor} flex items-center justify-center shrink-0 mt-0.5`}>
                        <SectionIcon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h2 className="text-base font-display font-bold text-[#173C36] truncate">
                            {secLoc.name}
                          </h2>
                          <span className={`text-[10.5px] font-bold px-2 py-0.5 rounded-full shrink-0 ${sec.badgeBg} ${sec.badgeText}`}>
                            {sectionStories.length}
                          </span>
                        </div>
                        <p className="text-xs text-[#173C36]/65 mt-0.5 leading-relaxed">
                          {secLoc.description}
                        </p>
                      </div>
                    </div>

                    {/* Section Stories or Empty Publishing Placeholder */}
                    {sectionStories.length === 0 ? (
                      <div className="rounded-[24px] bg-[#FFFDF6] border border-dashed border-[#173C36]/15 p-6 text-center flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full ${sec.iconBg} ${sec.iconColor} flex items-center justify-center mb-2.5 opacity-80`}>
                          <SectionIcon className="w-5 h-5" />
                        </div>
                        <p className="text-sm font-display font-bold text-[#173C36]">
                          {storyUi.awaitingTitle}
                        </p>
                        <p className="text-xs text-[#173C36]/60 mt-1 max-w-sm leading-relaxed">
                          {storyUi.awaitingDesc}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {sectionStories.map(story => {
                          const storyMeta = getLocalizedStoryMeta(story.id, currentLanguage);
                          const displayTitle = storyMeta?.title || story.title;
                          const displaySynopsis = storyMeta?.synopsis || story.synopsis;
                          const stateLoc = getLocalizedState(story.regionState, currentLanguage);
                          const distLoc = getLocalizedDistrict(story.district, currentLanguage);

                          return (
                            <div
                              key={story.id}
                              id={`story-card-${story.id}`}
                              onClick={() => handleSelectStory(story)}
                              className="rounded-[24px] bg-[#FFFDF6] border border-[#173C36]/8 overflow-hidden shadow-xs hover:bg-white hover:border-[#173C36]/20 cursor-pointer active:scale-[0.99] transition-all group"
                            >
                              <div className="flex flex-col sm:flex-row">
                                {/* Thumbnail */}
                                <div className="sm:w-36 h-36 relative shrink-0 overflow-hidden bg-black/5">
                                  <img
                                    src={story.coverImage}
                                    alt={displayTitle}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    referrerPolicy="no-referrer"
                                  />
                                  <div className="absolute top-2 left-2 bg-[#F5C244] text-[#173C36] px-2 py-0.5 rounded-full text-[9px] font-bold shadow-xs">
                                    {distLoc}
                                  </div>
                                </div>

                                {/* Story details */}
                                <div className="p-4 flex-1 flex flex-col justify-between">
                                  <div>
                                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                      <span className="text-[10px] uppercase font-bold text-[#2F9E76]">
                                        {stateLoc}
                                      </span>
                                      <span className="text-[#173C36]/30">•</span>
                                      <span className="text-[10px] font-bold text-[#173C36]/60">
                                        {story.durationMinutes} {t.story.mins}
                                      </span>
                                      <span className="text-[#173C36]/30">•</span>
                                      <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full ${sec.badgeBg} ${sec.badgeText}`}>
                                        {secLoc.shortName}
                                      </span>
                                    </div>
                                    <h3 className="text-base font-display font-bold text-[#173C36] leading-snug group-hover:text-[#2F9E76] transition-colors">
                                      {displayTitle}
                                    </h3>
                                    <p className="text-xs text-[#173C36]/70 mt-1 line-clamp-2 leading-relaxed">
                                      {displaySynopsis}
                                    </p>
                                    {story.tags && story.tags.length > 0 && (
                                      <div className="flex flex-wrap gap-1 mt-2">
                                        {story.tags.slice(0, 3).map(tag => (
                                          <span key={tag} className="text-[9px] font-semibold text-[#173C36]/60 bg-[#173C36]/5 px-2 py-0.5 rounded-full">
                                            #{tag}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                  </div>

                                  <div className="pt-3 flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#173C36] bg-[#FFFBEF] px-3 py-1 rounded-full border border-[#173C36]/10">
                                      <Headphones className="w-3.5 h-3.5 text-[#2F9E76]" />
                                      <span>{t.story.listenAloud}</span>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-[#173C36] text-white flex items-center justify-center group-hover:bg-[#F5C244] group-hover:text-[#173C36] transition-colors shadow-xs">
                                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </section>
                );
              })}
          </div>
        </>
      )}
    </div>
  );
};
