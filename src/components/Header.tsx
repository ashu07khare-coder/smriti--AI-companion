import React, { useState } from 'react';
import { SmritiBrandMark } from './SmritiBrandMark';
import { LANGUAGES } from '../data/mockData';
import { LanguageCode, UserProfile } from '../types';
import { getTranslation } from '../utils/translations';
import { getHeaderNotificationStrings } from '../utils/modalLocalization';
import {
  Bell,
  User,
  ChevronDown,
  Check,
  ShieldCheck,
  Volume2,
  Sparkles,
  MapPin,
  LogIn
} from 'lucide-react';

interface HeaderProps {
  currentLanguage: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
  onOpenCaregiverAuth: () => void;
  isCaregiverMode: boolean;
  onExitCaregiverMode: () => void;
  unreadCount?: number;
  currentUser: UserProfile | null;
  onOpenAuthModal: (mode?: 'login' | 'signup' | 'profile') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  onSelectLanguage,
  onOpenCaregiverAuth,
  isCaregiverMode,
  onExitCaregiverMode,
  unreadCount = 2,
  currentUser,
  onOpenAuthModal,
}) => {
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const t = getTranslation(currentLanguage);
  const notifStrings = getHeaderNotificationStrings(currentLanguage);
  const activeLang = LANGUAGES.find(l => l.code === currentLanguage) || LANGUAGES[0];

  return (
    <header className="sticky top-0 z-30 w-full max-w-lg mx-auto px-4 pt-3 pb-2 bg-[#FFFBEF]/90 backdrop-blur-md transition-colors">
      <div className="flex items-center justify-between gap-2">
        {/* Logo & Wordmark */}
        <div className="flex items-center gap-2">
          <SmritiBrandMark size="sm" />

          {/* Language Selector Dropdown Pill */}
          <div className="relative">
            <button
              id="language-dropdown-btn"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFFDF6] border border-[#173C36]/10 text-xs font-semibold text-[#173C36] hover:bg-white transition-all shadow-xs"
              aria-label={t.header.selectLanguage}
            >
              <span className="text-xs text-[#173C36]/70">文A</span>
              <span>{activeLang.nativeLabel}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-[#173C36]/60 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {langDropdownOpen && (
              <div className="absolute left-0 mt-2 w-52 rounded-2xl bg-[#FFFDF6] border border-[#173C36]/10 shadow-lg py-1.5 z-50 animate-in fade-in zoom-in-95 max-h-80 overflow-y-auto">
                <div className="px-3 py-1 text-[10px] uppercase font-bold tracking-wider text-[#173C36]/60 border-b border-[#173C36]/5">
                  {t.header.selectLanguage}
                </div>
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    id={`lang-opt-${lang.code}`}
                    onClick={() => {
                      onSelectLanguage(lang.code);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-left text-xs transition-colors ${
                      currentLanguage === lang.code ? 'bg-[#F5C244]/20 font-bold text-[#173C36]' : 'text-[#173C36]/80 hover:bg-black/5'
                    }`}
                  >
                    <div>
                      <div className="font-medium">{lang.nativeLabel}</div>
                      <div className="text-[10px] text-[#173C36]/60">{lang.label}</div>
                    </div>
                    {currentLanguage === lang.code && <Check className="w-3.5 h-3.5 text-[#2F9E76]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right action controls */}
        <div className="flex items-center gap-1.5">
          {/* Current Elder Profile Badge / Login trigger */}
          {currentUser ? (
            <button
              onClick={() => onOpenAuthModal('profile')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFFDF6] border border-[#173C36]/10 hover:bg-white text-xs font-semibold text-[#173C36] shadow-xs transition-all"
              title="View Elder Profile & Registered Contacts"
            >
              <div className="w-5 h-5 rounded-full bg-[#F5C244] text-[#173C36] font-bold text-[10px] flex items-center justify-center">
                {currentUser.preferredName.charAt(0)}
              </div>
              <span className="max-w-[70px] truncate text-[11px]">
                {currentUser.preferredName}
              </span>
            </button>
          ) : (
            <button
              onClick={() => onOpenAuthModal('login')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#173C36] text-white text-xs font-bold shadow-xs hover:bg-[#1f4e46] transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{t.header.logIn}</span>
            </button>
          )}

          {/* Notification bell */}
          <div className="relative">
            <button
              id="notifications-btn"
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-9 h-9 rounded-full bg-[#FFFDF6] border border-[#173C36]/10 flex items-center justify-center text-[#173C36] hover:bg-white transition-all shadow-xs relative"
              aria-label={t.header.notifications}
            >
              <Bell className="w-4 h-4 text-[#173C36]" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-[#E65100] text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-[#FFFBEF]">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#FFFDF6] border border-[#173C36]/10 shadow-xl p-3 z-50 animate-in fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-[#173C36]/10">
                  <span className="text-xs font-bold text-[#173C36]">{notifStrings.notificationsTitle}</span>
                  <span className="text-[10px] text-[#2F9E76] font-semibold">{notifStrings.liveSynced}</span>
                </div>
                <div className="space-y-2 mt-2 text-xs">
                  <div className="p-2 rounded-xl bg-[#FDECDA] text-[#173C36]">
                    <p className="font-semibold text-[11px] text-[#C4641B]">{notifStrings.item1Title}</p>
                    <p className="text-[11px] mt-0.5">
                      {currentUser?.caregiverName ? `${currentUser.caregiverName}: ${notifStrings.item1Desc}` : notifStrings.item1Desc}
                    </p>
                  </div>
                  <div className="p-2 rounded-xl bg-[#E1F5EE] text-[#173C36]">
                    <p className="font-semibold text-[11px] text-[#2F9E76]">{notifStrings.item2Title}</p>
                    <p className="text-[11px] mt-0.5">{notifStrings.item2Desc}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="w-full mt-2.5 py-1.5 text-center text-xs font-medium text-[#173C36]/70 hover:text-[#173C36]"
                >
                  {notifStrings.dismiss}
                </button>
              </div>
            )}
          </div>

          {/* Caregiver Gate button */}
          {isCaregiverMode ? (
            <button
              id="exit-caregiver-btn"
              onClick={onExitCaregiverMode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#173C36] text-[#F5C244] text-xs font-bold shadow-xs hover:bg-[#1f4e46] transition-all"
              title="Exit Caregiver Mode"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#F5C244]" />
              <span className="hidden sm:inline">{t.header.caregiverMode}</span>
            </button>
          ) : (
            <button
              id="caregiver-auth-btn"
              onClick={onOpenCaregiverAuth}
              className="w-9 h-9 rounded-full bg-[#FFFDF6] border border-[#173C36]/10 flex items-center justify-center text-[#173C36] hover:bg-white transition-all shadow-xs group"
              aria-label={t.header.caregiverMode}
              title={t.header.caregiverMode}
            >
              <ShieldCheck className="w-4 h-4 text-[#173C36] group-hover:scale-105 transition-transform" />
            </button>
          )}
        </div>
      </div>

      {isCaregiverMode && (
        <div className="mt-2 py-1 px-3 bg-[#173C36] text-[#FFFBEF] rounded-full text-[11px] flex items-center justify-between font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#F5C244] animate-pulse"></span>
            <span>{t.header.caregiverModeActive}</span>
          </div>
          <button
            onClick={onExitCaregiverMode}
            className="text-xs text-[#F5C244] underline hover:text-white"
          >
            {t.header.exit}
          </button>
        </div>
      )}
    </header>
  );
};
