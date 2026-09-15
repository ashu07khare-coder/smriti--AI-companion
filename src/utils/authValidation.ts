import { z } from 'zod';
import { AuthUiStrings } from './authLocalization';

export const createLoginSchema = (t: AuthUiStrings) => {
  return z.object({
    identifier: z
      .string()
      .min(1, { message: t.validation.identifierRequired })
      .refine((val) => val.trim().length >= 3, {
        message: t.validation.identifierRequired,
      }),
    password: z
      .string()
      .min(1, { message: t.validation.loginPasswordRequired })
      .min(4, { message: t.validation.passwordMin }),
    rememberMe: z.boolean().default(true),
  });
};

export const createStep1Schema = (t: AuthUiStrings) => {
  return z
    .object({
      fullName: z.string().min(2, { message: t.validation.nameRequired }),
      email: z.string().email({ message: t.validation.emailInvalid }),
      password: z.string().min(6, { message: t.validation.passwordMin }),
      confirmPassword: z.string().min(1, { message: t.validation.passwordMin }),
      country: z.string().min(1, { message: t.validation.countryRequired }),
      stateProvince: z.string().min(1, { message: t.validation.stateRequired }),
      preferredLanguage: z.string().default('en'),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t.validation.passwordsMatch,
      path: ['confirmPassword'],
    });
};

export const createStep2Schema = (t: AuthUiStrings) => {
  return z.object({
    caregiverName: z.string().min(2, { message: t.validation.caregiverNameRequired }),
    countryCode: z.string().default('+91'),
    caregiverPhone: z
      .string()
      .min(7, { message: t.validation.caregiverPhoneRequired }),
    relationship: z.string().min(1, { message: t.validation.caregiverRelRequired }),
    caregiverPhotoUrl: z.string().optional(),
  });
};

export const createFamilyMemberSchema = (t: AuthUiStrings) => {
  return z.object({
    id: z.string(),
    name: z.string().min(2, { message: t.validation.nameRequired }),
    relationship: z.string().min(1, { message: t.validation.caregiverRelRequired }),
    phone: z.string().min(7, { message: t.validation.caregiverPhoneRequired }),
    photoUrl: z.string().optional(),
    emergencyContact: z.boolean().default(false),
  });
};

export const createStep4Schema = (t: AuthUiStrings) => {
  return z.object({
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: t.validation.termsRequired,
    }),
  });
};
