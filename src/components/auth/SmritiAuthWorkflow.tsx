import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Globe,
  MapPin,
  User,
  Heart,
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Plus,
  Trash2,
  Check,
  ChevronDown,
  X,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { SmritiBrandMark } from '../SmritiBrandMark';
import { PhotoUploadPicker } from './PhotoUploadPicker';
import { StepProgressBar } from './StepProgressBar';
import {
  AUTH_LANGUAGES,
  getAuthUiStrings,
  AuthUiStrings
} from '../../utils/authLocalization';
import {
  createLoginSchema,
  createStep1Schema,
  createStep2Schema,
  createStep4Schema
} from '../../utils/authValidation';
import { AuthLanguageCode, FamilyMemberItem, SignUpFormData } from '../../types/auth';
import { UserProfile, LanguageCode } from '../../types';
import { AppStorage, DEFAULT_USER_PROFILE } from '../../utils/storage';
import { bhashiniVoice } from '../../utils/bhashiniVoice';
import { smritiApi } from '../../utils/apiClient';

interface SmritiAuthWorkflowProps {
  initialTab?: 'login' | 'signup';
  initialLanguage?: LanguageCode | string;
  onSuccess: (user: UserProfile) => void;
  onCancel?: () => void;
  onLanguageChange?: (lang: LanguageCode) => void;
  isModal?: boolean;
}

// Country & Province Presets
const COUNTRIES_AND_STATES: Record<string, { code: string; flag: string; phoneCode: string; states: string[] }> = {
  India: {
    code: 'IN',
    flag: '🇮🇳',
    phoneCode: '+91',
    states: [
      'Assam',
      'Meghalaya',
      'Manipur',
      'Mizoram',
      'Nagaland',
      'Tripura',
      'Sikkim',
      'Arunachal Pradesh',
      'Delhi',
      'West Bengal',
      'Maharashtra',
      'Karnataka',
      'Other',
    ],
  },
  'United States': {
    code: 'US',
    flag: '🇺🇸',
    phoneCode: '+1',
    states: ['California', 'New York', 'Texas', 'Florida', 'Illinois', 'Washington', 'Massachusetts', 'Other'],
  },
  'United Kingdom': {
    code: 'GB',
    flag: '🇬🇧',
    phoneCode: '+44',
    states: ['England', 'Scotland', 'Wales', 'Northern Ireland', 'Other'],
  },
  Spain: {
    code: 'ES',
    flag: '🇪🇸',
    phoneCode: '+34',
    states: ['Madrid', 'Catalonia', 'Andalusia', 'Valencia', 'Galicia', 'Basque Country', 'Other'],
  },
  France: {
    code: 'FR',
    flag: '🇫🇷',
    phoneCode: '+33',
    states: ['Île-de-France', 'Auvergne-Rhône-Alpes', 'Nouvelle-Aquitaine', 'Occitanie', 'Other'],
  },
  Germany: {
    code: 'DE',
    flag: '🇩🇪',
    phoneCode: '+49',
    states: ['Bavaria', 'Berlin', 'North Rhine-Westphalia', 'Baden-Württemberg', 'Other'],
  },
  'Saudi Arabia': {
    code: 'SA',
    flag: '🇸🇦',
    phoneCode: '+966',
    states: ['Riyadh', 'Makkah', 'Eastern Province', 'Madinah', 'Other'],
  },
  Canada: {
    code: 'CA',
    flag: '🇨🇦',
    phoneCode: '+1',
    states: ['Ontario', 'Quebec', 'British Columbia', 'Alberta', 'Other'],
  },
  Australia: {
    code: 'AU',
    flag: '🇦🇺',
    phoneCode: '+61',
    states: ['New South Wales', 'Victoria', 'Queensland', 'Western Australia', 'Other'],
  },
};

export const SmritiAuthWorkflow: React.FC<SmritiAuthWorkflowProps> = ({
  initialTab = 'login',
  initialLanguage = 'en',
  onSuccess,
  onCancel,
  onLanguageChange,
  isModal = false,
}) => {
  // Active Tab
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(initialTab);

  // Active Language State
  const [currentLang, setCurrentLang] = useState<AuthLanguageCode>(() => {
    const valid = AUTH_LANGUAGES.some((l) => l.code === initialLanguage);
    return valid ? (initialLanguage as AuthLanguageCode) : 'en';
  });

  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  // UI Strings
  const ui: AuthUiStrings = getAuthUiStrings(currentLang);
  const isRtl = ui.isRtl;

  // Handle global language change
  const handleSelectLanguage = (langCode: AuthLanguageCode) => {
    setCurrentLang(langCode);
    setLangDropdownOpen(false);
    onLanguageChange?.(langCode as LanguageCode);
    bhashiniVoice.playGentleTone('soft');
  };

  // ----------------------------------------------------
  // LOGIN FORM STATE
  // ----------------------------------------------------
  const [loginMethod, setLoginMethod] = useState<'otp' | 'password'>('otp');
  const [otpPhone, setOtpPhone] = useState('+91 98765 43210');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpNotice, setOtpNotice] = useState('');
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginErrors, setLoginErrors] = useState<Record<string, string>>({});
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // ----------------------------------------------------
  // SIGN UP MULTI-STEP STATE
  // ----------------------------------------------------
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

  // Step 1: Account, Region & Language
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [country, setCountry] = useState('India');
  const [stateProvince, setStateProvince] = useState('Assam');

  // Step 2: Caregiver Profile
  const [caregiverName, setCaregiverName] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [caregiverPhone, setCaregiverPhone] = useState('');
  const [relationship, setRelationship] = useState('child');
  const [caregiverPhotoUrl, setCaregiverPhotoUrl] = useState<string | undefined>(undefined);

  // Step 3: Family Members (Dynamic List)
  const [familyMembers, setFamilyMembers] = useState<FamilyMemberItem[]>([
    {
      id: 'fm-init-1',
      name: 'Junaki Bora',
      relationship: 'daughter',
      phone: '+91 94350 88712',
      emergencyContact: true,
      photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256',
    },
  ]);

  // Step 4: Terms & Complete
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Sync country code when country changes
  const handleCountryChange = (newCountry: string) => {
    setCountry(newCountry);
    const countryData = COUNTRIES_AND_STATES[newCountry];
    if (countryData) {
      setCountryCode(countryData.phoneCode);
      setStateProvince(countryData.states[0] || '');
    }
  };

  // Quick Demo Fill for Login
  const handleFillDemoLogin = (phone: string = '+919876543210', elderName: string = 'Aita') => {
    setOtpPhone(phone);
    setOtpCode('1234');
    setLoginIdentifier('ananya.bora@smriti.care');
    setLoginPassword('smriti2026');
    setLoginErrors({});
    bhashiniVoice.playGentleTone('chime');
  };

  // Request OTP from Backend API
  const handleRequestOtp = async () => {
    if (!otpPhone.trim()) {
      setLoginErrors({ phone: 'Please enter phone number' });
      return;
    }
    setLoginErrors({});
    setIsLoggingIn(true);
    try {
      const res = await smritiApi.requestOtp(otpPhone);
      setOtpSent(true);
      setOtpNotice(res.message || 'OTP sent! Hackathon demo: enter any 4 digits.');
      bhashiniVoice.playGentleTone('chime');
    } catch {
      setOtpSent(true);
      setOtpNotice('Hackathon demo: enter any 4 digits (e.g. 1234).');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Verify OTP via Backend API (Accepts any 4 digits)
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginErrors({});

    const code = otpCode.trim();
    if (code.length !== 4 || !/^\d{4}$/.test(code)) {
      setLoginErrors({ otp: 'Please enter any 4-digit number (e.g. 1234 or 4826)' });
      bhashiniVoice.playGentleTone('soft');
      return;
    }

    setIsLoggingIn(true);
    bhashiniVoice.playGentleTone('soft');

    try {
      const res = await smritiApi.verifyOtp(otpPhone, code);
      setIsLoggingIn(false);

      if (res.success && res.user) {
        const base = AppStorage.getUserProfile() || DEFAULT_USER_PROFILE;
        const authUser: UserProfile = {
          ...base,
          id: res.user.id,
          elderName: res.user.name,
          preferredName: res.user.preferredName || res.user.name.split(' ')[0] || 'Aita',
          email: `${(res.user.preferredName || 'user').toLowerCase()}@smriti.care`,
          phone: res.user.phone,
          pin: '1234',
          language: (res.user.language as LanguageCode) || (currentLang as LanguageCode) || 'as',
          createdAt: new Date().toISOString(),
        };
        AppStorage.saveUserProfile(authUser);
        bhashiniVoice.playGentleTone('chime');
        onSuccess(authUser);
      } else {
        setLoginErrors({ otp: res.error || 'Invalid OTP code' });
      }
    } catch {
      setIsLoggingIn(false);
      // Offline fallback
      const base = AppStorage.getUserProfile() || DEFAULT_USER_PROFILE;
      const fallbackUser: UserProfile = {
        ...base,
        id: `user-${Date.now()}`,
        elderName: 'Bonti Khound',
        preferredName: 'Aita',
        phone: otpPhone,
        pin: '1234',
        language: (currentLang as LanguageCode) || 'as',
        createdAt: new Date().toISOString(),
      };
      AppStorage.saveUserProfile(fallbackUser);
      onSuccess(fallbackUser);
    }
  };

  // Submit Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginErrors({});

    const schema = createLoginSchema(ui);
    const result = schema.safeParse({
      identifier: loginIdentifier,
      password: loginPassword,
      rememberMe,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      const issues = (result.error as any).issues || (result.error as any).errors || [];
      issues.forEach((err: any) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setLoginErrors(fieldErrors);
      bhashiniVoice.playGentleTone('soft');
      return;
    }

    setIsLoggingIn(true);
    bhashiniVoice.playGentleTone('soft');

    setTimeout(() => {
      setIsLoggingIn(false);
      // Retrieve existing or create authenticated profile
      const stored = AppStorage.getUserProfile() || DEFAULT_USER_PROFILE;
      const authenticatedUser: UserProfile = {
        ...stored,
        preferredName: stored.preferredName || 'Aita',
        phone: loginIdentifier.includes('@') ? stored.phone : loginIdentifier,
        email: loginIdentifier.includes('@') ? loginIdentifier : 'caregiver@smriti.care',
        language: (currentLang as LanguageCode) || 'en',
      };

      AppStorage.saveUserProfile(authenticatedUser);
      onSuccess(authenticatedUser);
    }, 850);
  };

  // ----------------------------------------------------
  // MULTI-STEP NAVIGATION & VALIDATION
  // ----------------------------------------------------
  const handleNextStep = () => {
    setStepErrors({});

    if (currentStep === 1) {
      const schema = createStep1Schema(ui);
      const res = schema.safeParse({
        fullName,
        email,
        password,
        confirmPassword,
        country,
        stateProvince,
        preferredLanguage: currentLang,
      });

      if (!res.success) {
        const errors: Record<string, string> = {};
        const issues = (res.error as any).issues || (res.error as any).errors || [];
        issues.forEach((err: any) => {
          if (err.path[0]) {
            errors[err.path[0] as string] = err.message;
          }
        });
        setStepErrors(errors);
        bhashiniVoice.playGentleTone('soft');
        return;
      }

      setCompletedSteps((prev) => Array.from(new Set([...prev, 1])));
      setCurrentStep(2);
      bhashiniVoice.playGentleTone('soft');
    } else if (currentStep === 2) {
      const schema = createStep2Schema(ui);
      const res = schema.safeParse({
        caregiverName,
        countryCode,
        caregiverPhone,
        relationship,
        caregiverPhotoUrl,
      });

      if (!res.success) {
        const errors: Record<string, string> = {};
        const issues = (res.error as any).issues || (res.error as any).errors || [];
        issues.forEach((err: any) => {
          if (err.path[0]) {
            errors[err.path[0] as string] = err.message;
          }
        });
        setStepErrors(errors);
        bhashiniVoice.playGentleTone('soft');
        return;
      }

      setCompletedSteps((prev) => Array.from(new Set([...prev, 2])));
      setCurrentStep(3);
      bhashiniVoice.playGentleTone('soft');
    } else if (currentStep === 3) {
      // Step 3 Family Members: validate if any members have empty required names
      const invalidMember = familyMembers.find((m) => !m.name.trim() || !m.phone.trim());
      if (invalidMember) {
        setStepErrors({
          family: ui.validation.caregiverNameRequired + ' & ' + ui.validation.caregiverPhoneRequired,
        });
        bhashiniVoice.playGentleTone('soft');
        return;
      }

      setCompletedSteps((prev) => Array.from(new Set([...prev, 3])));
      setCurrentStep(4);
      bhashiniVoice.playGentleTone('soft');
    }
  };

  const handlePrevStep = () => {
    setStepErrors({});
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
    }
  };

  // Add Family Member in Step 3
  const handleAddFamilyMember = () => {
    const newId = `fm-${Date.now()}`;
    const newMember: FamilyMemberItem = {
      id: newId,
      name: '',
      relationship: 'daughter',
      phone: countryCode + ' ',
      emergencyContact: familyMembers.length === 0,
      photoUrl: undefined,
    };
    setFamilyMembers((prev) => [...prev, newMember]);
    bhashiniVoice.playGentleTone('soft');
  };

  const handleRemoveFamilyMember = (id: string) => {
    setFamilyMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const handleUpdateFamilyMember = (id: string, updates: Partial<FamilyMemberItem>) => {
    setFamilyMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
  };

  // Final Registration Submission
  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStepErrors({});

    const schema = createStep4Schema(ui);
    const res = schema.safeParse({ acceptTerms });

    if (!res.success) {
      setStepErrors({ terms: ui.validation.termsRequired });
      bhashiniVoice.playGentleTone('soft');
      return;
    }

    setIsCreatingAccount(true);
    bhashiniVoice.playGentleTone('chime');

    setTimeout(() => {
      setIsCreatingAccount(false);

      // Create new user profile object
      const newProfile: UserProfile = {
        id: `user-${Date.now()}`,
        elderName: fullName,
        preferredName: fullName.split(' ')[0] || 'Aita',
        email,
        phone: `${countryCode} ${caregiverPhone}`,
        pin: '1234',
        stateRegion: stateProvince || country,
        districtArea: country,
        language: (currentLang as LanguageCode) || 'en',
        caregiverName: caregiverName || 'Primary Caregiver',
        caregiverPhone: `${countryCode} ${caregiverPhone}`,
        caregiverRelation: relationship,
        caregiverPhoto: caregiverPhotoUrl,
        familyMemberName: familyMembers[0]?.name || 'Family Contact',
        familyMemberPhone: familyMembers[0]?.phone || `${countryCode} 98765 00000`,
        familyMemberRelation: familyMembers[0]?.relationship || 'Family',
        createdAt: new Date().toISOString(),
      };

      // Save user profile
      AppStorage.saveUserProfile(newProfile);

      // Update family members in Smriti storage
      if (familyMembers.length > 0) {
        const convertedMembers = familyMembers.map((fm, idx) => ({
          id: fm.id,
          name: fm.name,
          relationship: fm.relationship,
          photoUrl:
            fm.photoUrl ||
            `https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256`,
          hint: `${fm.name} (${fm.relationship})`,
          addedBy: 'caregiver' as const,
          addedAt: new Date().toISOString(),
        }));
        AppStorage.setFamilyMembers(convertedMembers);
      }

      onSuccess(newProfile);
    }, 1100);
  };

  const activeLangData =
    AUTH_LANGUAGES.find((l) => l.code === currentLang) || AUTH_LANGUAGES[0];

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className={`w-full max-w-xl mx-auto bg-[#FFFDF6] rounded-3xl border border-[#173C36]/10 shadow-2xl overflow-hidden transition-all duration-300 font-sans text-[#173C36] ${
        isModal ? 'p-0' : 'p-4 sm:p-6'
      }`}
    >
      {/* ------------------------------------------------------------------ */}
      {/* TOP HEADER & GLOBAL LANGUAGE SELECTOR */}
      {/* ------------------------------------------------------------------ */}
      <div className="px-5 sm:px-8 pt-6 pb-4 border-b border-[#173C36]/8 bg-[#FFFBEF]/80 backdrop-blur-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <SmritiBrandMark size="sm" />
          <div className="hidden xs:flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#2F9E76]">
              {ui.nav.subheading}
            </span>
          </div>
        </div>

        {/* Global Dynamic Language Switcher Dropdown */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              type="button"
              id="auth-lang-switcher"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#173C36]/15 hover:border-[#173C36]/40 text-xs font-bold text-[#173C36] shadow-xs transition-all focus:ring-2 focus:ring-[#F5C244]"
              aria-label={ui.nav.switchLang}
            >
              <span>{activeLangData.flag}</span>
              <span className="font-semibold">{activeLangData.nativeLabel}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>

            {/* Dropdown Menu */}
            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl border border-[#173C36]/10 shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 text-[10px] font-bold text-[#173C36]/50 uppercase tracking-wider border-b border-[#173C36]/5">
                  {ui.nav.switchLang}
                </div>
                {AUTH_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleSelectLanguage(lang.code)}
                    className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-[#FFF3D2]/50 transition-colors ${
                      currentLang === lang.code
                        ? 'font-bold text-[#173C36] bg-[#FFF3D2]/80'
                        : 'text-[#173C36]/80'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.nativeLabel}</span>
                      <span className="text-[10px] text-[#173C36]/50">({lang.label})</span>
                    </div>
                    {currentLang === lang.code && (
                      <Check className="w-3.5 h-3.5 text-[#2F9E76] stroke-[3]" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Optional Close Button if rendered as a modal */}
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="w-8 h-8 rounded-full bg-white border border-[#173C36]/10 flex items-center justify-center text-[#173C36]/70 hover:text-[#173C36] hover:bg-[#FFF3D2]/30 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* MODE TABS: "LOGIN" / "SIGN UP" */}
      {/* ------------------------------------------------------------------ */}
      <div className="px-5 sm:px-8 pt-5 pb-2">
        <div className="relative flex p-1 rounded-2xl bg-[#173C36]/5 border border-[#173C36]/8">
          <button
            type="button"
            id="tab-login"
            onClick={() => {
              setActiveTab('login');
              setStepErrors({});
              bhashiniVoice.playGentleTone('soft');
            }}
            className={`relative flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all z-10 flex items-center justify-center gap-1.5 ${
              activeTab === 'login'
                ? 'text-[#173C36] shadow-xs'
                : 'text-[#173C36]/60 hover:text-[#173C36]'
            }`}
          >
            {activeTab === 'login' && (
              <motion.div
                layoutId="auth-tab-pill"
                className="absolute inset-0 bg-[#FFFDF6] rounded-xl border border-[#173C36]/10 -z-10"
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              />
            )}
            <ShieldCheck className="w-4 h-4 text-[#2F9E76]" />
            <span>{ui.nav.loginTab}</span>
          </button>

          <button
            type="button"
            id="tab-signup"
            onClick={() => {
              setActiveTab('signup');
              setLoginErrors({});
              bhashiniVoice.playGentleTone('soft');
            }}
            className={`relative flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all z-10 flex items-center justify-center gap-1.5 ${
              activeTab === 'signup'
                ? 'text-[#173C36] shadow-xs'
                : 'text-[#173C36]/60 hover:text-[#173C36]'
            }`}
          >
            {activeTab === 'signup' && (
              <motion.div
                layoutId="auth-tab-pill"
                className="absolute inset-0 bg-[#FFFDF6] rounded-xl border border-[#173C36]/10 -z-10"
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              />
            )}
            <Heart className="w-4 h-4 text-[#E65100]" />
            <span>{ui.nav.signUpTab}</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* TAB CONTENT CONTAINER */}
      {/* ------------------------------------------------------------------ */}
      <div className="px-5 sm:px-8 py-5">
        <AnimatePresence mode="wait">
          {/* ================================================================ */}
          {/* A. LOGIN TAB */}
          {/* ================================================================ */}
          {activeTab === 'login' && (
            <motion.div
              key="login-tab"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              {/* Title & Description */}
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#173C36]">
                  {ui.login.title}
                </h2>
                <p className="text-xs sm:text-sm text-[#173C36]/70 mt-1 leading-relaxed">
                  {loginMethod === 'otp'
                    ? 'Secure phone verification for elders and family caregivers'
                    : ui.login.subtitle}
                </p>
              </div>

              {/* Login Method Toggle: Phone OTP vs Email/Password */}
              <div className="flex p-1 rounded-2xl bg-[#173C36]/5 border border-[#173C36]/10 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod('otp');
                    setLoginErrors({});
                    bhashiniVoice.playGentleTone('soft');
                  }}
                  className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    loginMethod === 'otp'
                      ? 'bg-white text-[#173C36] shadow-xs'
                      : 'text-[#173C36]/60 hover:text-[#173C36]'
                  }`}
                >
                  <Phone className="w-3.5 h-3.5 text-[#2F9E76]" />
                  <span>Phone / OTP Login (Preferred)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod('password');
                    setLoginErrors({});
                    bhashiniVoice.playGentleTone('soft');
                  }}
                  className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    loginMethod === 'password'
                      ? 'bg-white text-[#173C36] shadow-xs'
                      : 'text-[#173C36]/60 hover:text-[#173C36]'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5 text-[#C4641B]" />
                  <span>Password</span>
                </button>
              </div>

              {loginMethod === 'otp' ? (
                /* Phone / OTP Login Form */
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#173C36] mb-1">
                      Phone Number
                    </label>
                    <div className="relative flex gap-2">
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#173C36]/40">
                          <Phone className="w-4 h-4" />
                        </div>
                        <input
                          type="tel"
                          value={otpPhone}
                          onChange={(e) => setOtpPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full pl-10 pr-3.5 py-3 rounded-2xl bg-white border border-[#173C36]/15 text-sm font-medium text-[#173C36] focus:outline-hidden focus:ring-2 focus:ring-[#F5C244]"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleRequestOtp}
                        disabled={isLoggingIn}
                        className="px-4 py-3 rounded-2xl bg-[#FFFBEF] border border-[#173C36]/20 text-xs font-bold text-[#173C36] hover:bg-[#FFF3D2] transition-colors whitespace-nowrap"
                      >
                        {otpSent ? 'Resend' : 'Send OTP'}
                      </button>
                    </div>
                    {loginErrors.phone && (
                      <p className="text-xs text-rose-600 font-medium mt-1">{loginErrors.phone}</p>
                    )}
                  </div>

                  {otpNotice && (
                    <div className="p-3 rounded-xl bg-[#E1F5EE] border border-[#2F9E76]/30 text-xs text-[#173C36] flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#2F9E76] shrink-0" />
                      <span>{otpNotice}</span>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-[#173C36]">
                        Enter 4-Digit OTP
                      </label>
                      <span className="text-[10px] font-semibold text-[#2F9E76]">
                        Hackathon: Any 4 digits accepted
                      </span>
                    </div>
                    <input
                      type="text"
                      maxLength={4}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="e.g. 1234 or 4826"
                      className="w-full text-center tracking-[0.5em] text-lg font-mono font-bold py-3 rounded-2xl bg-white border border-[#173C36]/15 text-[#173C36] focus:outline-hidden focus:ring-2 focus:ring-[#2F9E76]"
                    />
                    {loginErrors.otp && (
                      <p className="text-xs text-rose-600 font-medium mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{loginErrors.otp}</span>
                      </p>
                    )}
                  </div>

                  {/* Demo Quick Select Buttons */}
                  <div className="space-y-1.5">
                    <p className="text-[11px] font-bold text-[#173C36]/70">Demo Personas (1-Tap Fill):</p>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleFillDemoLogin('+919876543210', 'Aita')}
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-[#173C36]/10 text-xs font-medium text-[#173C36] hover:bg-[#FFF3D2]"
                      >
                        👵 Aita (+919876543210)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFillDemoLogin('+919876543211', 'Ananya')}
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-[#173C36]/10 text-xs font-medium text-[#173C36] hover:bg-[#FFF3D2]"
                      >
                        👩 Ananya (Caregiver)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFillDemoLogin('+919876543212', 'Rina')}
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-[#173C36]/10 text-xs font-medium text-[#173C36] hover:bg-[#FFF3D2]"
                      >
                        🩺 Rina Das (ASHA)
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="w-full py-3.5 px-4 rounded-2xl bg-[#173C36] text-[#FFFDF6] font-bold text-sm shadow-md hover:bg-[#1f4e46] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                  >
                    {isLoggingIn ? (
                      <>
                        <div className="w-4 h-4 border-2 border-[#F5C244] border-t-transparent rounded-full animate-spin" />
                        <span>Verifying OTP...</span>
                      </>
                    ) : (
                      <>
                        <span>Verify & Enter Smriti</span>
                        <ArrowRight className="w-4 h-4 text-[#F5C244]" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* Existing Password Login Form */
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                {/* Identifier: Email or Phone */}
                <div>
                  <label
                    htmlFor="login-identifier"
                    className="block text-xs font-bold text-[#173C36] mb-1"
                  >
                    {ui.login.identifierLabel}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#173C36]/40">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="login-identifier"
                      type="text"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder={ui.login.identifierPlaceholder}
                      className={`w-full pl-10 pr-3.5 py-3 rounded-2xl bg-white border text-sm font-medium text-[#173C36] placeholder-[#173C36]/35 transition-all focus:outline-hidden focus:ring-2 ${
                        loginErrors.identifier
                          ? 'border-rose-300 focus:ring-rose-400'
                          : 'border-[#173C36]/15 focus:ring-[#F5C244] focus:border-[#173C36]/40'
                      }`}
                    />
                  </div>
                  {loginErrors.identifier && (
                    <p className="text-xs text-rose-600 font-medium mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{loginErrors.identifier}</span>
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label
                      htmlFor="login-password"
                      className="text-xs font-bold text-[#173C36]"
                    >
                      {ui.login.passwordLabel}
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotPasswordModal(true)}
                      className="text-xs font-semibold text-[#2F9E76] hover:text-[#173C36] hover:underline"
                    >
                      {ui.login.forgotPassword}
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#173C36]/40">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="login-password"
                      type={showLoginPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder={ui.login.passwordPlaceholder}
                      className={`w-full pl-10 pr-10 py-3 rounded-2xl bg-white border text-sm font-medium text-[#173C36] placeholder-[#173C36]/35 transition-all focus:outline-hidden focus:ring-2 ${
                        loginErrors.password
                          ? 'border-rose-300 focus:ring-rose-400'
                          : 'border-[#173C36]/15 focus:ring-[#F5C244] focus:border-[#173C36]/40'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#173C36]/40 hover:text-[#173C36]"
                      aria-label="Toggle password visibility"
                    >
                      {showLoginPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {loginErrors.password && (
                    <p className="text-xs text-rose-600 font-medium mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{loginErrors.password}</span>
                    </p>
                  )}
                </div>

                {/* Remember Me Toggle */}
                <div className="flex items-center gap-2 pt-0.5">
                  <input
                    id="remember-me-checkbox"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded-md border-[#173C36]/25 text-[#173C36] focus:ring-[#F5C244] cursor-pointer"
                  />
                  <label
                    htmlFor="remember-me-checkbox"
                    className="text-xs font-medium text-[#173C36]/80 cursor-pointer select-none"
                  >
                    {ui.login.rememberMe}
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#173C36] text-[#FFFDF6] font-bold text-sm shadow-md hover:bg-[#1f4e46] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-75 cursor-pointer"
                >
                  {isLoggingIn ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#F5C244] border-t-transparent rounded-full animate-spin" />
                      <span>{ui.login.signingIn}</span>
                    </>
                  ) : (
                    <>
                      <span>{ui.login.signInBtn}</span>
                      <ArrowRight className="w-4 h-4 text-[#F5C244]" />
                    </>
                  )}
                </button>
              </form>
            )}

              {/* 1-Click Quick Demo Login Helper Card */}
              <div className="p-3.5 rounded-2xl bg-[#FFF3D2]/70 border border-[#F5C244]/40 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#F5C244] text-[#173C36] flex items-center justify-center font-bold text-xs shadow-xs">
                    ⚡
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#173C36]">
                      {ui.login.demoCredentials}
                    </p>
                    <p className="text-[11px] text-[#173C36]/70">
                      {ui.login.demoTip}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleFillDemoLogin}
                  className="px-3 py-1.5 rounded-xl bg-[#173C36] text-[#F5C244] text-xs font-bold hover:bg-[#1f4e46] transition-colors shadow-xs"
                >
                  Autofill
                </button>
              </div>

              {/* Bottom Switch to Sign Up */}
              <div className="text-center pt-1 border-t border-[#173C36]/8">
                <p className="text-xs text-[#173C36]/70">
                  {ui.login.noAccount}{' '}
                  <button
                    type="button"
                    onClick={() => setActiveTab('signup')}
                    className="font-bold text-[#2F9E76] hover:text-[#173C36] hover:underline"
                  >
                    {ui.login.signUpLink}
                  </button>
                </p>
              </div>
            </motion.div>
          )}

          {/* ================================================================ */}
          {/* B. MULTI-STEP SIGN UP TAB */}
          {/* ================================================================ */}
          {activeTab === 'signup' && (
            <motion.div
              key="signup-tab"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* Progress Indicator */}
              <StepProgressBar
                currentStep={currentStep}
                totalSteps={4}
                completedSteps={completedSteps}
                onStepClick={(step) => {
                  if (completedSteps.includes(step) || step < currentStep) {
                    setCurrentStep(step);
                  }
                }}
                ui={ui}
              />

              {/* ------------------------------------------------------------ */}
              {/* STEP 1: ACCOUNT, REGION & LANGUAGE */}
              {/* ------------------------------------------------------------ */}
              {currentStep === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-4"
                >
                  <div>
                    <h3 className="text-lg font-bold text-[#173C36]">
                      {ui.steps.step1Title}
                    </h3>
                    <p className="text-xs text-[#173C36]/70">
                      {ui.steps.step1Desc}
                    </p>
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-[#173C36] mb-1">
                      {ui.step1.fullNameLabel}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#173C36]/40">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder={ui.step1.fullNamePlaceholder}
                        className={`w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-white border text-sm font-medium text-[#173C36] placeholder-[#173C36]/35 transition-all focus:outline-hidden focus:ring-2 ${
                          stepErrors.fullName
                            ? 'border-rose-300 focus:ring-rose-400'
                            : 'border-[#173C36]/15 focus:ring-[#F5C244]'
                        }`}
                      />
                    </div>
                    {stepErrors.fullName && (
                      <p className="text-xs text-rose-600 font-medium mt-1">
                        {stepErrors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-[#173C36] mb-1">
                      {ui.step1.emailLabel}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#173C36]/40">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={ui.step1.emailPlaceholder}
                        className={`w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-white border text-sm font-medium text-[#173C36] placeholder-[#173C36]/35 transition-all focus:outline-hidden focus:ring-2 ${
                          stepErrors.email
                            ? 'border-rose-300 focus:ring-rose-400'
                            : 'border-[#173C36]/15 focus:ring-[#F5C244]'
                        }`}
                      />
                    </div>
                    {stepErrors.email && (
                      <p className="text-xs text-rose-600 font-medium mt-1">
                        {stepErrors.email}
                      </p>
                    )}
                  </div>

                  {/* Passwords in a 2-column grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#173C36] mb-1">
                        {ui.step1.passwordLabel}
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder={ui.step1.passwordPlaceholder}
                          className={`w-full px-3.5 pr-9 py-2.5 rounded-2xl bg-white border text-sm font-medium text-[#173C36] placeholder-[#173C36]/35 transition-all focus:outline-hidden focus:ring-2 ${
                            stepErrors.password
                              ? 'border-rose-300 focus:ring-rose-400'
                              : 'border-[#173C36]/15 focus:ring-[#F5C244]'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#173C36]/40 hover:text-[#173C36]"
                        >
                          {showPassword ? (
                            <EyeOff className="w-3.5 h-3.5" />
                          ) : (
                            <Eye className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                      {stepErrors.password && (
                        <p className="text-xs text-rose-600 font-medium mt-1">
                          {stepErrors.password}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#173C36] mb-1">
                        {ui.step1.confirmPasswordLabel}
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder={ui.step1.confirmPasswordPlaceholder}
                          className={`w-full px-3.5 pr-9 py-2.5 rounded-2xl bg-white border text-sm font-medium text-[#173C36] placeholder-[#173C36]/35 transition-all focus:outline-hidden focus:ring-2 ${
                            stepErrors.confirmPassword
                              ? 'border-rose-300 focus:ring-rose-400'
                              : 'border-[#173C36]/15 focus:ring-[#F5C244]'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#173C36]/40 hover:text-[#173C36]"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-3.5 h-3.5" />
                          ) : (
                            <Eye className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                      {stepErrors.confirmPassword && (
                        <p className="text-xs text-rose-600 font-medium mt-1">
                          {stepErrors.confirmPassword}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Country & State Selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-xs font-bold text-[#173C36] mb-1">
                        {ui.step1.countryLabel}
                      </label>
                      <div className="relative">
                        <select
                          value={country}
                          onChange={(e) => handleCountryChange(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-[#173C36]/15 text-sm font-medium text-[#173C36] appearance-none focus:outline-hidden focus:ring-2 focus:ring-[#F5C244]"
                        >
                          {Object.keys(COUNTRIES_AND_STATES).map((cName) => (
                            <option key={cName} value={cName}>
                              {COUNTRIES_AND_STATES[cName].flag} {cName}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#173C36]/50">
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#173C36] mb-1">
                        {ui.step1.stateLabel}
                      </label>
                      <div className="relative">
                        <select
                          value={stateProvince}
                          onChange={(e) => setStateProvince(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-[#173C36]/15 text-sm font-medium text-[#173C36] appearance-none focus:outline-hidden focus:ring-2 focus:ring-[#F5C244]"
                        >
                          {COUNTRIES_AND_STATES[country]?.states.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#173C36]/50">
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </div>
                      {stepErrors.stateProvince && (
                        <p className="text-xs text-rose-600 font-medium mt-1">
                          {stepErrors.stateProvince}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Preferred Interface Language */}
                  <div className="p-3.5 rounded-2xl bg-[#FFF3D2]/50 border border-[#F5C244]/40">
                    <label className="block text-xs font-bold text-[#173C36] mb-1 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-[#2F9E76]" />
                      <span>{ui.step1.langLabel}</span>
                    </label>
                    <div className="relative mt-1">
                      <select
                        value={currentLang}
                        onChange={(e) => handleSelectLanguage(e.target.value as AuthLanguageCode)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#173C36]/15 text-sm font-bold text-[#173C36] appearance-none focus:outline-hidden focus:ring-2 focus:ring-[#F5C244]"
                      >
                        {AUTH_LANGUAGES.map((l) => (
                          <option key={l.code} value={l.code}>
                            {l.flag} {l.nativeLabel} ({l.label})
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#173C36]/50">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                    <p className="text-[11px] text-[#173C36]/70 mt-1.5 leading-normal">
                      {ui.step1.langHelper}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* ------------------------------------------------------------ */}
              {/* STEP 2: CAREGIVER PROFILE */}
              {/* ------------------------------------------------------------ */}
              {currentStep === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-4"
                >
                  <div>
                    <h3 className="text-lg font-bold text-[#173C36]">
                      {ui.step2.title}
                    </h3>
                    <p className="text-xs text-[#173C36]/70">
                      {ui.step2.subtitle}
                    </p>
                  </div>

                  {/* Caregiver Name */}
                  <div>
                    <label className="block text-xs font-bold text-[#173C36] mb-1">
                      {ui.step2.caregiverNameLabel}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#173C36]/40">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={caregiverName}
                        onChange={(e) => setCaregiverName(e.target.value)}
                        placeholder={ui.step2.caregiverNamePlaceholder}
                        className={`w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-white border text-sm font-medium text-[#173C36] placeholder-[#173C36]/35 transition-all focus:outline-hidden focus:ring-2 ${
                          stepErrors.caregiverName
                            ? 'border-rose-300 focus:ring-rose-400'
                            : 'border-[#173C36]/15 focus:ring-[#F5C244]'
                        }`}
                      />
                    </div>
                    {stepErrors.caregiverName && (
                      <p className="text-xs text-rose-600 font-medium mt-1">
                        {stepErrors.caregiverName}
                      </p>
                    )}
                  </div>

                  {/* Caregiver Phone with Country Code Prefix */}
                  <div>
                    <label className="block text-xs font-bold text-[#173C36] mb-1">
                      {ui.step2.phoneLabel}
                    </label>
                    <div className="flex gap-2">
                      <div className="relative w-28 shrink-0">
                        <select
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          className="w-full pl-2.5 pr-6 py-2.5 rounded-2xl bg-white border border-[#173C36]/15 text-xs font-bold text-[#173C36] appearance-none focus:outline-hidden focus:ring-2 focus:ring-[#F5C244]"
                        >
                          {Object.values(COUNTRIES_AND_STATES).map((c) => (
                            <option key={c.code} value={c.phoneCode}>
                              {c.flag} {c.phoneCode}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none text-[#173C36]/50">
                          <ChevronDown className="w-3.5 h-3.5" />
                        </div>
                      </div>
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#173C36]/40">
                          <Phone className="w-4 h-4" />
                        </div>
                        <input
                          type="tel"
                          value={caregiverPhone}
                          onChange={(e) => setCaregiverPhone(e.target.value)}
                          placeholder={ui.step2.phonePlaceholder}
                          className={`w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-white border text-sm font-medium text-[#173C36] placeholder-[#173C36]/35 transition-all focus:outline-hidden focus:ring-2 ${
                            stepErrors.caregiverPhone
                              ? 'border-rose-300 focus:ring-rose-400'
                              : 'border-[#173C36]/15 focus:ring-[#F5C244]'
                          }`}
                        />
                      </div>
                    </div>
                    {stepErrors.caregiverPhone && (
                      <p className="text-xs text-rose-600 font-medium mt-1">
                        {stepErrors.caregiverPhone}
                      </p>
                    )}
                  </div>

                  {/* Relationship to Elder */}
                  <div>
                    <label className="block text-xs font-bold text-[#173C36] mb-1">
                      {ui.step2.relationshipLabel}
                    </label>
                    <div className="relative">
                      <select
                        value={relationship}
                        onChange={(e) => setRelationship(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-[#173C36]/15 text-sm font-medium text-[#173C36] appearance-none focus:outline-hidden focus:ring-2 focus:ring-[#F5C244]"
                      >
                        <option value="nurse">{ui.step2.roles.nurse}</option>
                        <option value="guardian">{ui.step2.roles.guardian}</option>
                        <option value="child">{ui.step2.roles.child}</option>
                        <option value="spouse">{ui.step2.roles.spouse}</option>
                        <option value="other">{ui.step2.roles.other}</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#173C36]/50">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Caregiver Photo Upload Component */}
                  <PhotoUploadPicker
                    label={ui.step2.photoLabel}
                    helperText={ui.step2.photoHelper}
                    photoUrl={caregiverPhotoUrl}
                    onPhotoChange={(url) => setCaregiverPhotoUrl(url)}
                    ui={ui}
                    idPrefix="caregiver"
                    size="lg"
                  />
                </motion.div>
              )}

              {/* ------------------------------------------------------------ */}
              {/* STEP 3: FAMILY MEMBERS (DYNAMIC LIST) */}
              {/* ------------------------------------------------------------ */}
              {currentStep === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-bold text-[#173C36]">
                        {ui.step3.title}
                      </h3>
                      <p className="text-xs text-[#173C36]/70">
                        {ui.step3.subtitle}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddFamilyMember}
                      className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#173C36] text-[#F5C244] text-xs font-bold hover:bg-[#1f4e46] transition-all shadow-xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{ui.step3.addMemberBtn}</span>
                    </button>
                  </div>

                  {stepErrors.family && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{stepErrors.family}</span>
                    </div>
                  )}

                  {/* Members Cards */}
                  <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                    {familyMembers.length === 0 ? (
                      <div className="p-6 rounded-2xl border-2 border-dashed border-[#173C36]/15 bg-[#FFFDF6] text-center space-y-2">
                        <Users className="w-8 h-8 text-[#173C36]/30 mx-auto" />
                        <p className="text-xs text-[#173C36]/70 max-w-xs mx-auto">
                          {ui.step3.noMembersYet}
                        </p>
                        <button
                          type="button"
                          onClick={handleAddFamilyMember}
                          className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF3D2] border border-[#F5C244] text-xs font-bold text-[#173C36] hover:bg-[#F5C244]/30 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{ui.step3.addMemberBtn}</span>
                        </button>
                      </div>
                    ) : (
                      familyMembers.map((member, idx) => (
                        <div
                          key={member.id}
                          className="p-4 rounded-2xl bg-white border border-[#173C36]/12 shadow-xs space-y-3 relative group"
                        >
                          {/* Card Header with index and remove button */}
                          <div className="flex items-center justify-between border-b border-[#173C36]/8 pb-2">
                            <span className="text-xs font-bold text-[#173C36] flex items-center gap-1.5">
                              <span className="w-5 h-5 rounded-full bg-[#173C36]/10 flex items-center justify-center text-[10px]">
                                {idx + 1}
                              </span>
                              <span>
                                {member.name || `${ui.step3.memberNameLabel} #${idx + 1}`}
                              </span>
                            </span>

                            <button
                              type="button"
                              onClick={() => handleRemoveFamilyMember(member.id)}
                              className="text-rose-600 hover:text-rose-800 p-1 rounded-lg hover:bg-rose-50 transition-colors"
                              title={ui.step3.removeMember}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Member inputs in responsive grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-bold text-[#173C36] mb-1">
                                {ui.step3.memberNameLabel}
                              </label>
                              <input
                                type="text"
                                value={member.name}
                                onChange={(e) =>
                                  handleUpdateFamilyMember(member.id, { name: e.target.value })
                                }
                                placeholder={ui.step3.memberNamePlaceholder}
                                className="w-full px-3 py-2 rounded-xl bg-[#FFFDF6] border border-[#173C36]/15 text-xs font-medium text-[#173C36] focus:ring-2 focus:ring-[#F5C244] focus:outline-hidden"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-[#173C36] mb-1">
                                {ui.step3.memberRelLabel}
                              </label>
                              <select
                                value={member.relationship}
                                onChange={(e) =>
                                  handleUpdateFamilyMember(member.id, {
                                    relationship: e.target.value,
                                  })
                                }
                                className="w-full px-3 py-2 rounded-xl bg-[#FFFDF6] border border-[#173C36]/15 text-xs font-medium text-[#173C36] focus:ring-2 focus:ring-[#F5C244] focus:outline-hidden"
                              >
                                <option value="daughter">{ui.step3.roles.daughter}</option>
                                <option value="son">{ui.step3.roles.son}</option>
                                <option value="brother">{ui.step3.roles.brother}</option>
                                <option value="sister">{ui.step3.roles.sister}</option>
                                <option value="friend">{ui.step3.roles.friend}</option>
                                <option value="neighbor">{ui.step3.roles.neighbor}</option>
                                <option value="other">{ui.step3.roles.other}</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-[#173C36] mb-1">
                              {ui.step3.memberPhoneLabel}
                            </label>
                            <input
                              type="tel"
                              value={member.phone}
                              onChange={(e) =>
                                handleUpdateFamilyMember(member.id, { phone: e.target.value })
                              }
                              placeholder={ui.step3.memberPhonePlaceholder}
                              className="w-full px-3 py-2 rounded-xl bg-[#FFFDF6] border border-[#173C36]/15 text-xs font-medium text-[#173C36] focus:ring-2 focus:ring-[#F5C244] focus:outline-hidden"
                            />
                          </div>

                          {/* Member Photo Picker */}
                          <PhotoUploadPicker
                            label={ui.step3.memberPhotoLabel}
                            photoUrl={member.photoUrl}
                            onPhotoChange={(url) =>
                              handleUpdateFamilyMember(member.id, { photoUrl: url })
                            }
                            ui={ui}
                            idPrefix={`member-${member.id}`}
                            size="md"
                          />

                          {/* Emergency Contact Toggle */}
                          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FFFBEF] border border-[#173C36]/10">
                            <div className="flex items-center gap-2">
                              <ShieldAlert
                                className={`w-4 h-4 ${
                                  member.emergencyContact
                                    ? 'text-rose-600'
                                    : 'text-[#173C36]/40'
                                }`}
                              />
                              <span className="text-xs font-semibold text-[#173C36]">
                                {ui.step3.emergencyContactToggle}
                              </span>
                            </div>
                            <input
                              type="checkbox"
                              checked={member.emergencyContact}
                              onChange={(e) =>
                                handleUpdateFamilyMember(member.id, {
                                  emergencyContact: e.target.checked,
                                })
                              }
                              className="w-4 h-4 rounded-md text-[#173C36] focus:ring-[#F5C244] cursor-pointer"
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}

              {/* ------------------------------------------------------------ */}
              {/* STEP 4: REVIEW & COMPLETE */}
              {/* ------------------------------------------------------------ */}
              {currentStep === 4 && (
                <motion.div
                  key="step-4"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-4"
                >
                  <div>
                    <h3 className="text-lg font-bold text-[#173C36]">
                      {ui.step4.title}
                    </h3>
                    <p className="text-xs text-[#173C36]/70">
                      {ui.step4.subtitle}
                    </p>
                  </div>

                  {/* Summary Cards */}
                  <div className="space-y-3">
                    {/* 1. Account & Region Card */}
                    <div className="p-3.5 rounded-2xl bg-white border border-[#173C36]/12 shadow-xs">
                      <div className="flex items-center justify-between pb-2 border-b border-[#173C36]/8">
                        <span className="text-xs font-bold text-[#173C36] flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-[#2F9E76]" />
                          <span>{ui.step4.accountSummary}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(1)}
                          className="text-[11px] font-bold text-[#2F9E76] hover:underline"
                        >
                          {ui.step4.editStep}
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                        <div>
                          <p className="text-[10px] text-[#173C36]/50">Full Name</p>
                          <p className="font-semibold text-[#173C36]">{fullName || '—'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-[#173C36]/50">Email</p>
                          <p className="font-semibold text-[#173C36] truncate">{email || '—'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-[#173C36]/50">Region</p>
                          <p className="font-semibold text-[#173C36]">
                            {stateProvince}, {country}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-[#173C36]/50">Language</p>
                          <p className="font-semibold text-[#173C36]">
                            {activeLangData.flag} {activeLangData.nativeLabel}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 2. Caregiver Card */}
                    <div className="p-3.5 rounded-2xl bg-white border border-[#173C36]/12 shadow-xs">
                      <div className="flex items-center justify-between pb-2 border-b border-[#173C36]/8">
                        <span className="text-xs font-bold text-[#173C36] flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#E65100]" />
                          <span>{ui.step4.caregiverSummary}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(2)}
                          className="text-[11px] font-bold text-[#2F9E76] hover:underline"
                        >
                          {ui.step4.editStep}
                        </button>
                      </div>
                      <div className="flex items-center gap-3 mt-2.5">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-[#FFF3D2] border border-[#173C36]/10 shrink-0 flex items-center justify-center">
                          {caregiverPhotoUrl ? (
                            <img
                              src={caregiverPhotoUrl}
                              alt="Caregiver avatar"
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <User className="w-6 h-6 text-[#173C36]/40" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0 text-xs">
                          <p className="font-bold text-sm text-[#173C36]">
                            {caregiverName || 'Caregiver'}
                          </p>
                          <p className="text-[11px] text-[#173C36]/70 capitalize">
                            {relationship} · {countryCode} {caregiverPhone}
                          </p>
                          <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-[#E1F5EE] text-[#2F9E76] text-[10px] font-bold">
                            Primary Guardian
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 3. Family Members Grid */}
                    <div className="p-3.5 rounded-2xl bg-white border border-[#173C36]/12 shadow-xs">
                      <div className="flex items-center justify-between pb-2 border-b border-[#173C36]/8">
                        <span className="text-xs font-bold text-[#173C36] flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-[#173C36]" />
                          <span>
                            {ui.step4.familySummary} ({familyMembers.length})
                          </span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(3)}
                          className="text-[11px] font-bold text-[#2F9E76] hover:underline"
                        >
                          {ui.step4.editStep}
                        </button>
                      </div>

                      {familyMembers.length === 0 ? (
                        <p className="text-xs text-[#173C36]/50 py-2">
                          {ui.step4.noFamilyAdded}
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                          {familyMembers.map((fm) => (
                            <div
                              key={fm.id}
                              className="p-2 rounded-xl bg-[#FFFDF6] border border-[#173C36]/8 flex items-center gap-2.5"
                            >
                              <div className="w-9 h-9 rounded-full overflow-hidden bg-[#FFF3D2] border border-[#173C36]/10 shrink-0 flex items-center justify-center">
                                {fm.photoUrl ? (
                                  <img
                                    src={fm.photoUrl}
                                    alt={fm.name}
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <User className="w-4 h-4 text-[#173C36]/40" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0 text-[11px]">
                                <p className="font-bold text-[#173C36] truncate">
                                  {fm.name}
                                </p>
                                <p className="text-[10px] text-[#173C36]/60 truncate">
                                  {fm.relationship} · {fm.phone}
                                </p>
                                {fm.emergencyContact && (
                                  <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-rose-700">
                                    <ShieldAlert className="w-2.5 h-2.5" />
                                    <span>Emergency</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Terms & Conditions Checkbox */}
                  <div className="pt-1">
                    <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-[#FFF3D2]/40 border border-[#F5C244]/30">
                      <input
                        id="terms-checkbox"
                        type="checkbox"
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded-md border-[#173C36]/25 text-[#173C36] focus:ring-[#F5C244] cursor-pointer"
                      />
                      <label
                        htmlFor="terms-checkbox"
                        className="text-xs font-medium text-[#173C36]/80 leading-relaxed cursor-pointer select-none"
                      >
                        {ui.step4.termsText}
                      </label>
                    </div>
                    {stepErrors.terms && (
                      <p className="text-xs text-rose-600 font-medium mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{stepErrors.terms}</span>
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Navigation Controls: Back & Next / Complete */}
              <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#173C36]/8">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="px-4 py-2.5 rounded-xl border border-[#173C36]/20 bg-white hover:bg-[#FFFDF6] text-xs font-bold text-[#173C36] transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{ui.common.back}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setActiveTab('login')}
                    className="text-xs font-semibold text-[#173C36]/60 hover:text-[#173C36] transition-colors"
                  >
                    ← {ui.nav.loginTab}
                  </button>
                )}

                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="ml-auto px-5 py-2.5 rounded-xl bg-[#173C36] text-[#F5C244] text-xs font-bold shadow-sm hover:bg-[#1f4e46] active:scale-[0.98] transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{ui.common.next}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isCreatingAccount}
                    onClick={handleFinalSubmit}
                    className="ml-auto px-6 py-2.5 rounded-xl bg-[#2F9E76] text-white text-xs font-bold shadow-md hover:bg-[#268563] active:scale-[0.98] transition-all flex items-center gap-2 disabled:opacity-75 cursor-pointer"
                  >
                    {isCreatingAccount ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>{ui.step4.creatingAccount}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{ui.step4.createAccountBtn}</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* FORGOT PASSWORD MODAL */}
      {/* ------------------------------------------------------------------ */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-[#173C36]/15 space-y-3 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#173C36]/10 pb-2">
              <h4 className="font-bold text-[#173C36] text-sm flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-[#E65100]" />
                <span>{ui.login.forgotPasswordModalTitle}</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowForgotPasswordModal(false)}
                className="text-[#173C36]/60 hover:text-[#173C36]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-[#173C36]/80 leading-relaxed">
              {ui.login.forgotPasswordModalDesc}
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowForgotPasswordModal(false)}
                className="w-full py-2 rounded-xl bg-[#173C36] text-white text-xs font-bold hover:bg-[#1f4e46] transition-colors"
              >
                {ui.login.forgotPasswordModalClose}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
