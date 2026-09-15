import React, { useState } from 'react';
import { UserProfile, LanguageCode } from '../types';
import { SmritiAuthWorkflow } from './auth/SmritiAuthWorkflow';
import { getTranslation } from '../utils/translations';
import { SmritiBrandMark } from './SmritiBrandMark';
import {
  User,
  Phone,
  ShieldCheck,
  X,
  LogOut,
  Users,
  ChevronRight,
  Plus
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onAuthSuccess: (user: UserProfile) => void;
  onLogout: () => void;
  initialMode?: 'login' | 'signup' | 'profile';
  currentLanguage?: LanguageCode;
  onSelectLanguage?: (lang: LanguageCode) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onAuthSuccess,
  onLogout,
  initialMode = 'login',
  currentLanguage = 'en',
  onSelectLanguage,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'profile'>(initialMode);
  const t = getTranslation(currentLanguage);

  if (!isOpen) return null;

  // If in login or signup mode, render our full responsive SmritiAuthWorkflow
  if (authMode === 'login' || authMode === 'signup') {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        <div className="my-auto w-full max-w-xl animate-in zoom-in-95">
          <SmritiAuthWorkflow
            initialTab={authMode}
            initialLanguage={currentLanguage}
            onSuccess={(user) => {
              onAuthSuccess(user);
              onClose();
            }}
            onCancel={onClose}
            onLanguageChange={onSelectLanguage}
            isModal={true}
          />
        </div>
      </div>
    );
  }

  // Profile Mode (for active elder/caregiver profile inspect & account options)
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#FFFDF6] rounded-[32px] w-full max-w-md shadow-2xl border border-[#173C36]/10 overflow-hidden my-auto animate-in zoom-in-95 max-h-[92vh] flex flex-col font-sans">
        {/* Header */}
        <div className="p-5 border-b border-[#173C36]/10 bg-[#FFFBEF] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SmritiBrandMark size="sm" />
            <div>
              <h2 className="text-base font-bold text-[#173C36] leading-tight">
                {t.auth?.yourProfile || 'Care Account Profile'}
              </h2>
              <p className="text-[11px] text-[#173C36]/70">
                {currentUser?.preferredName ? `${currentUser.preferredName}'s Care Circle` : 'Active Elder Profile'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-[#173C36]/10 flex items-center justify-center text-[#173C36] hover:bg-gray-50"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Content Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {currentUser && (
            <div className="space-y-4">
              {/* Elder Card */}
              <div className="p-4 rounded-2xl bg-[#FFFBEF] border border-[#173C36]/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#F5C244] text-[#173C36] font-bold text-xl flex items-center justify-center shadow-xs">
                      {currentUser.preferredName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-[#173C36]">
                        {currentUser.elderName} ({currentUser.preferredName})
                      </h3>
                      <p className="text-xs text-[#173C36]/70">
                        {currentUser.districtArea}, {currentUser.stateRegion}
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#E1F5EE] text-[#2F9E76] font-bold text-[10px] uppercase">
                    Active
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 text-xs border-t border-[#173C36]/10">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#173C36]/60 block">
                      Language
                    </span>
                    <span className="font-semibold text-[#173C36]">
                      {currentUser.language.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#173C36]/60 block">
                      Contact Phone
                    </span>
                    <span className="font-semibold text-[#173C36]">
                      {currentUser.phone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Primary Caregiver & Family Contacts Card */}
              <div className="p-4 rounded-2xl bg-white border border-[#173C36]/10 space-y-3 text-xs">
                <h4 className="font-bold text-[#173C36] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#2F9E76]" />
                  <span>Registered Contacts</span>
                </h4>

                {/* Caregiver */}
                <div className="p-3 rounded-xl bg-[#FFFBEF] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-[#FFF3D2] border border-[#173C36]/10 shrink-0 flex items-center justify-center">
                    {currentUser.caregiverPhoto ? (
                      <img
                        src={currentUser.caregiverPhoto}
                        alt={currentUser.caregiverName}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <User className="w-5 h-5 text-[#173C36]/40" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#173C36] truncate">
                        {currentUser.caregiverName}
                      </span>
                      <span className="text-[10px] font-bold text-[#C4641B] px-2 py-0.5 rounded-full bg-[#FDECDA]">
                        Caregiver
                      </span>
                    </div>
                    <p className="text-[11px] text-[#173C36]/70 truncate capitalize">
                      {currentUser.caregiverRelation} · {currentUser.caregiverPhone}
                    </p>
                  </div>
                </div>

                {/* Family Member */}
                <div className="p-3 rounded-xl bg-[#FFFBEF] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#E3EFFC] text-[#2A6DB5] font-bold flex items-center justify-center shrink-0">
                    {currentUser.familyMemberName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#173C36] truncate">
                        {currentUser.familyMemberName}
                      </span>
                      <span className="text-[10px] font-bold text-[#2A6DB5] px-2 py-0.5 rounded-full bg-[#E3EFFC]">
                        Family
                      </span>
                    </div>
                    <p className="text-[11px] text-[#173C36]/70 truncate capitalize">
                      {currentUser.familyMemberRelation} · {currentUser.familyMemberPhone}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setAuthMode('signup')}
                  className="w-full py-2.5 rounded-2xl bg-[#173C36] text-[#F5C244] text-xs font-bold hover:bg-[#1f4e46] transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Register Another Profile / New Signup</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="w-full py-2.5 rounded-2xl bg-[#FFFBEF] border border-[#173C36]/20 text-xs font-bold text-[#173C36] hover:bg-white flex items-center justify-center gap-2"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Switch Account / Sign In</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onLogout();
                    setAuthMode('login');
                  }}
                  className="w-full py-2.5 rounded-2xl bg-rose-50 text-rose-700 text-xs font-bold hover:bg-rose-100 flex items-center justify-center gap-2 border border-rose-200 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out of Smriti</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
