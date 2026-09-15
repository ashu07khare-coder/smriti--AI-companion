import { LanguageCode } from '../types';

export type AuthLanguageCode = 'en' | 'es' | 'hi' | 'fr' | 'de' | 'ar' | 'as';

export interface AuthLanguageOption {
  code: AuthLanguageCode;
  label: string;
  nativeLabel: string;
  flag: string;
  isRtl?: boolean;
}

export interface FamilyMemberItem {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  photoUrl?: string;
  emergencyContact: boolean;
}

export interface LoginFormValues {
  identifier: string; // Email or Phone Number
  password: string;
  rememberMe: boolean;
}

export interface SignUpStep1Values {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  country: string;
  stateProvince: string;
  preferredLanguage: AuthLanguageCode;
}

export interface SignUpStep2Values {
  caregiverName: string;
  countryCode: string;
  caregiverPhone: string;
  relationship: string;
  caregiverPhotoUrl?: string;
}

export interface SignUpFormData extends SignUpStep1Values, SignUpStep2Values {
  familyMembers: FamilyMemberItem[];
  acceptTerms: boolean;
}
