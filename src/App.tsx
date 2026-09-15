/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { NavTab, BottomNav } from './components/BottomNav';
import { Header } from './components/Header';
import { TodayTab } from './components/TodayTab';
import { GamesTab } from './components/GamesTab';
import { StoryTab } from './components/StoryTab';
import { CareCircleTab } from './components/CareCircleTab';
import { CaregiverModeModal } from './components/CaregiverModeModal';
import { VoiceReminderModal } from './components/VoiceReminderModal';
import { VoiceReminderActiveAlarm } from './components/VoiceReminderActiveAlarm';
import { AuthModal } from './components/AuthModal';
import { DemoAuthPortal } from './components/auth/DemoAuthPortal';
import { LanguageCode, Reminder, FamilyMember, GameSession, DailyScore, CaregiverAlert, UserProfile, DailyAdherenceLog } from './types';
import { AppStorage, DEFAULT_USER_PROFILE } from './utils/storage';
import { bhashiniVoice } from './utils/bhashiniVoice';
import { voiceReminderScheduler } from './utils/voiceReminderScheduler';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('today');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => AppStorage.getUserProfile());
  const [showAuthPortal, setShowAuthPortal] = useState<boolean>(() => !AppStorage.getUserProfile());
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>(() => {
    const profile = AppStorage.getUserProfile();
    return profile ? profile.language : AppStorage.getSelectedLanguage();
  });

  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(() => AppStorage.getFamilyMembers());
  const [reminders, setReminders] = useState<Reminder[]>(() => AppStorage.getReminders());
  const [dailyScores, setDailyScores] = useState<DailyScore[]>(() => AppStorage.getDailyScores());
  const [alerts, setAlerts] = useState<CaregiverAlert[]>(() => AppStorage.getAlerts());
  const [adherenceHistory, setAdherenceHistory] = useState<DailyAdherenceLog[]>(() => AppStorage.getAdherenceHistory());

  const [isCaregiverMode, setIsCaregiverMode] = useState<boolean>(false);
  const [isCaregiverModalOpen, setIsCaregiverModalOpen] = useState<boolean>(false);
  const [isVoiceReminderModalOpen, setIsVoiceReminderModalOpen] = useState<boolean>(false);
  const [activeAlarmReminder, setActiveAlarmReminder] = useState<Reminder | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | 'profile'>('login');

  const [activeGameFromToday, setActiveGameFromToday] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Subscribe to voice reminder alarm triggers
  useEffect(() => {
    const unsubscribe = voiceReminderScheduler.subscribe((alarmReminder) => {
      setActiveAlarmReminder(alarmReminder);
    });
    return () => unsubscribe();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleSelectLanguage = (lang: LanguageCode) => {
    setCurrentLanguage(lang);
    AppStorage.setSelectedLanguage(lang);
    if (currentUser) {
      const updated = { ...currentUser, language: lang };
      setCurrentUser(updated);
      AppStorage.saveUserProfile(updated);
    }
    bhashiniVoice.playGentleTone('soft');
    showToast(`Language set to ${lang.toUpperCase()}`);
  };

  const handleAuthSuccess = (profile: UserProfile) => {
    setCurrentUser(profile);
    setCurrentLanguage(profile.language);
    setShowAuthPortal(false);
    showToast(`Welcome back, ${profile.preferredName}!`);
  };

  const handleLogout = () => {
    AppStorage.logoutUser();
    setCurrentUser(null);
    setShowAuthPortal(true);
    showToast('Logged out of Smriti');
  };

  const handleToggleReminder = (id: string, customCompletedAt?: string) => {
    bhashiniVoice.playGentleTone('chime');
    const updated = AppStorage.toggleReminder(id, customCompletedAt);
    setReminders(updated);
    setAdherenceHistory(AppStorage.getAdherenceHistory());
    showToast("Reminder updated");
  };

  const handleGameCompleted = (session: GameSession) => {
    AppStorage.recordGameSession(session);
    setDailyScores(AppStorage.getDailyScores());
    showToast(`Session recorded: ${session.score} points`);
  };

  const handleSync = () => {
    const syncedCount = AppStorage.flushSyncQueue();
    showToast(`Cloud Sync Complete (${syncedCount} queued updates uploaded)`);
  };

  const handleAcknowledgeAlert = (alertId: string) => {
    const updated = AppStorage.acknowledgeAlert(alertId);
    setAlerts(updated);
  };

  const handleOpenAuth = (mode?: 'login' | 'signup' | 'profile') => {
    setAuthModalMode(mode || (currentUser ? 'profile' : 'login'));
    setIsAuthModalOpen(true);
  };

  // If Auth Portal is active, show the full showcase page for evaluation / login
  if (showAuthPortal) {
    return (
      <DemoAuthPortal
        currentUser={currentUser}
        currentLanguage={currentLanguage}
        onAuthSuccess={handleAuthSuccess}
        onSelectLanguage={handleSelectLanguage}
        onSkipToDemo={() => {
          if (!currentUser) {
            const fallback = DEFAULT_USER_PROFILE;
            setCurrentUser(fallback);
            AppStorage.saveUserProfile(fallback);
          }
          setShowAuthPortal(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFBEF] via-[#FFFBEF] to-[#FFF3D2] text-[#173C36] flex flex-col justify-between selection:bg-[#F5C244]/30">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-[#173C36] text-[#FFFBEF] text-xs font-semibold rounded-full shadow-lg animate-in fade-in slide-in-from-top-2">
          {toastMessage}
        </div>
      )}

      {/* Sticky Header */}
      <Header
        currentLanguage={currentLanguage}
        onSelectLanguage={handleSelectLanguage}
        onOpenCaregiverAuth={() => setIsCaregiverModalOpen(true)}
        isCaregiverMode={isCaregiverMode}
        onExitCaregiverMode={() => {
          setIsCaregiverMode(false);
          showToast("Switched to Patient Mode");
        }}
        unreadCount={2}
        currentUser={currentUser}
        onOpenAuthModal={handleOpenAuth}
        onOpenAuthDemo={() => setShowAuthPortal(true)}
      />

      {/* Main Tab Content */}
      <main className="flex-1 w-full max-w-lg mx-auto">
        {activeTab === 'today' && (
          <TodayTab
            currentLanguage={currentLanguage}
            reminders={reminders}
            familyMembers={familyMembers}
            onToggleReminder={handleToggleReminder}
            onSelectGame={gameId => {
              setActiveGameFromToday(gameId);
              setActiveTab('games');
            }}
            onOpenVoiceReminder={() => setIsVoiceReminderModalOpen(true)}
            onOpenCaregiverMode={() => setIsCaregiverModalOpen(true)}
            onSync={handleSync}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'games' && (
          <GamesTab
            familyMembers={familyMembers}
            currentLanguage={currentLanguage}
            onGameCompleted={handleGameCompleted}
            activeGameId={activeGameFromToday}
            onCloseGame={() => setActiveGameFromToday(null)}
          />
        )}

        {activeTab === 'story' && (
          <StoryTab currentLanguage={currentLanguage} />
        )}

        {activeTab === 'care_circle' && (
          <CareCircleTab
            dailyScores={dailyScores}
            alerts={alerts}
            onAcknowledgeAlert={handleAcknowledgeAlert}
            onOpenCaregiverMode={() => setIsCaregiverModalOpen(true)}
            currentUser={currentUser}
            currentLanguage={currentLanguage}
            reminders={reminders}
            adherenceHistory={adherenceHistory}
            onToggleReminder={handleToggleReminder}
          />
        )}
      </main>

      {/* Floating Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        currentLanguage={currentLanguage}
        onChangeTab={tab => {
          setActiveTab(tab);
          if (tab !== 'games') {
            setActiveGameFromToday(null);
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Login / Sign Up / Profile Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onAuthSuccess={handleAuthSuccess}
        onLogout={handleLogout}
        initialMode={authModalMode}
        currentLanguage={currentLanguage}
        onSelectLanguage={handleSelectLanguage}
      />

      {/* Caregiver PIN Gate & Admin Dashboard Modal */}
      <CaregiverModeModal
        isOpen={isCaregiverModalOpen}
        onClose={() => setIsCaregiverModalOpen(false)}
        isUnlocked={isCaregiverMode}
        onUnlockSuccess={() => {
          setIsCaregiverMode(true);
          showToast("Caregiver Mode Unlocked");
        }}
        familyMembers={familyMembers}
        reminders={reminders}
        onUpdateFamily={updated => setFamilyMembers(updated)}
        onUpdateReminders={updated => setReminders(updated)}
        onFlushSync={handleSync}
      />

      {/* Voice Reminder Sheet Modal */}
      <VoiceReminderModal
        isOpen={isVoiceReminderModalOpen}
        onClose={() => setIsVoiceReminderModalOpen(false)}
        currentLanguage={currentLanguage}
        onReminderSaved={newRem => {
          setReminders(AppStorage.getReminders());
          showToast(`Voice Reminder scheduled for ${newRem.time}`);
        }}
      />

      {/* Voice Reminder Triggered Alarm & Playback Overlay */}
      <VoiceReminderActiveAlarm
        activeReminder={activeAlarmReminder}
        onDismiss={() => {
          setActiveAlarmReminder(null);
          setReminders(AppStorage.getReminders());
          showToast("Voice Reminder completed");
        }}
        onSnooze={updatedRem => {
          setActiveAlarmReminder(null);
          setReminders(AppStorage.getReminders());
          showToast(`Voice Reminder snoozed for 10 minutes (${updatedRem.time})`);
        }}
      />
    </div>
  );
}
