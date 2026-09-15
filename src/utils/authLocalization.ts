import { AuthLanguageCode, AuthLanguageOption } from '../types/auth';
export type { AuthLanguageCode, AuthLanguageOption };

export const AUTH_LANGUAGES: AuthLanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English (US)', flag: '🇺🇸', isRtl: false },
  { code: 'es', label: 'Spanish', nativeLabel: 'Español', flag: '🇪🇸', isRtl: false },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी', flag: '🇮🇳', isRtl: false },
  { code: 'fr', label: 'French', nativeLabel: 'Français', flag: '🇫🇷', isRtl: false },
  { code: 'de', label: 'German', nativeLabel: 'Deutsch', flag: '🇩🇪', isRtl: false },
  { code: 'ar', label: 'Arabic', nativeLabel: 'العربية', flag: '🇸🇦', isRtl: true },
  { code: 'as', label: 'Assamese', nativeLabel: 'অসমীয়া', flag: '🇮🇳', isRtl: false },
];

export interface AuthUiStrings {
  isRtl?: boolean;
  nav: {
    loginTab: string;
    signUpTab: string;
    subheading: string;
    switchLang: string;
  };
  steps: {
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    step4Title: string;
    step4Desc: string;
  };
  login: {
    title: string;
    subtitle: string;
    identifierLabel: string;
    identifierPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    rememberMe: string;
    forgotPassword: string;
    signInBtn: string;
    signingIn: string;
    noAccount: string;
    signUpLink: string;
    demoCredentials: string;
    demoTip: string;
    forgotPasswordModalTitle: string;
    forgotPasswordModalDesc: string;
    forgotPasswordModalClose: string;
  };
  step1: {
    fullNameLabel: string;
    fullNamePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    confirmPasswordLabel: string;
    confirmPasswordPlaceholder: string;
    countryLabel: string;
    stateLabel: string;
    statePlaceholder: string;
    langLabel: string;
    langHelper: string;
  };
  step2: {
    title: string;
    subtitle: string;
    caregiverNameLabel: string;
    caregiverNamePlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    relationshipLabel: string;
    photoLabel: string;
    photoHelper: string;
    roles: {
      nurse: string;
      guardian: string;
      spouse: string;
      child: string;
      other: string;
    };
  };
  step3: {
    title: string;
    subtitle: string;
    addMemberBtn: string;
    memberNameLabel: string;
    memberNamePlaceholder: string;
    memberRelLabel: string;
    memberPhoneLabel: string;
    memberPhonePlaceholder: string;
    memberPhotoLabel: string;
    emergencyContactToggle: string;
    emergencyBadge: string;
    removeMember: string;
    noMembersYet: string;
    roles: {
      daughter: string;
      son: string;
      brother: string;
      sister: string;
      friend: string;
      neighbor: string;
      other: string;
    };
  };
  step4: {
    title: string;
    subtitle: string;
    accountSummary: string;
    caregiverSummary: string;
    familySummary: string;
    termsText: string;
    createAccountBtn: string;
    creatingAccount: string;
    editStep: string;
    noFamilyAdded: string;
  };
  common: {
    back: string;
    next: string;
    cancel: string;
    uploadPhoto: string;
    changePhoto: string;
    removePhoto: string;
    dragDropText: string;
    maxFileSize: string;
    fileTooLarge: string;
    invalidFileType: string;
    stepCount: (curr: number, total: number) => string;
  };
  validation: {
    nameRequired: string;
    emailInvalid: string;
    passwordMin: string;
    passwordsMatch: string;
    countryRequired: string;
    stateRequired: string;
    caregiverNameRequired: string;
    caregiverPhoneRequired: string;
    caregiverRelRequired: string;
    termsRequired: string;
    identifierRequired: string;
    loginPasswordRequired: string;
  };
}

export const AUTH_TRANSLATIONS: Record<AuthLanguageCode, AuthUiStrings> = {
  en: {
    isRtl: false,
    nav: {
      loginTab: 'Log In',
      signUpTab: 'Sign Up',
      subheading: 'Compassionate Senior Care & Family Network',
      switchLang: 'Language',
    },
    steps: {
      step1Title: 'Account & Region',
      step1Desc: 'Basic login credentials and region setup',
      step2Title: 'Caregiver Profile',
      step2Desc: 'Primary support guardian & contact photo',
      step3Title: 'Family Members',
      step3Desc: 'Dynamic emergency circle and loved ones',
      step4Title: 'Review & Complete',
      step4Desc: 'Verify all details and activate account',
    },
    login: {
      title: 'Welcome back to Smriti',
      subtitle: 'Sign in to access senior care schedules, gentle brain games, and family circles.',
      identifierLabel: 'Email or Mobile Phone',
      identifierPlaceholder: 'e.g. priya.care@gmail.com or +91 98765 43210',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Enter your account password',
      rememberMe: 'Remember Me',
      forgotPassword: 'Forgot Password?',
      signInBtn: 'Sign In to Smriti',
      signingIn: 'Signing in...',
      noAccount: "Don't have an account yet?",
      signUpLink: 'Create a caregiver account',
      demoCredentials: '1-Click Quick Demo Login (Majuli Family)',
      demoTip: 'Autofills with sample elder & caregiver credentials',
      forgotPasswordModalTitle: 'Reset Password',
      forgotPasswordModalDesc: 'A password reset instructions code will be dispatched to your registered email or phone via SMS/Bhashini voice bridge.',
      forgotPasswordModalClose: 'Understood',
    },
    step1: {
      fullNameLabel: 'Account / Elder Full Name',
      fullNamePlaceholder: 'e.g. Bhabadhar Bora (Aita)',
      emailLabel: 'Email Address',
      emailPlaceholder: 'elder.care@example.com',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Minimum 6 characters',
      confirmPasswordLabel: 'Confirm Password',
      confirmPasswordPlaceholder: 'Re-enter your password',
      countryLabel: 'Country / Region',
      stateLabel: 'State / Province',
      statePlaceholder: 'Select or type state (e.g. Assam, California)',
      langLabel: 'Preferred Interface Language',
      langHelper: 'Changing this instantly updates the entire application interface.',
    },
    step2: {
      title: 'Primary Caregiver Profile',
      subtitle: 'Who is the main guardian or nurse responsible for daily care and emergency alerts?',
      caregiverNameLabel: 'Caregiver Full Name',
      caregiverNamePlaceholder: 'e.g. Ananya Bora',
      phoneLabel: 'Caregiver Mobile Number',
      phonePlaceholder: '98765 43210',
      relationshipLabel: 'Relationship to Elder',
      photoLabel: 'Caregiver Photo Avatar',
      photoHelper: 'Recognizable photo helps the elder feel reassured during voice reminder calls.',
      roles: {
        nurse: 'Professional Nurse / Attendant',
        guardian: 'Guardian / Legal Caregiver',
        spouse: 'Spouse / Partner',
        child: 'Son / Daughter',
        other: 'Other Relative / Neighbor',
      },
    },
    step3: {
      title: 'Family Members & Care Circle',
      subtitle: 'Add close relatives who will appear in Memory Lane and can be reached in emergencies.',
      addMemberBtn: '+ Add Family Member',
      memberNameLabel: 'Family Member Name',
      memberNamePlaceholder: 'e.g. Rohan Bora',
      memberRelLabel: 'Relationship',
      memberPhoneLabel: 'Contact Number',
      memberPhonePlaceholder: 'e.g. +91 94350 12345',
      memberPhotoLabel: 'Profile Photo',
      emergencyContactToggle: 'Can be contacted in emergency',
      emergencyBadge: 'Emergency Contact',
      removeMember: 'Remove',
      noMembersYet: 'No additional family members added yet. Click "+ Add Family Member" or continue to the next step.',
      roles: {
        daughter: 'Daughter',
        son: 'Son',
        brother: 'Brother',
        sister: 'Sister',
        friend: 'Close Friend',
        neighbor: 'Neighbor',
        other: 'Other Relative',
      },
    },
    step4: {
      title: 'Review & Activate Account',
      subtitle: 'Please inspect the details below before creating your care account.',
      accountSummary: 'Account & Regional Profile',
      caregiverSummary: 'Primary Caregiver',
      familySummary: 'Family Circle & Emergency Contacts',
      termsText: 'I agree to the Smriti Caregiving Terms of Service and Privacy Policy for compassionate elder care.',
      createAccountBtn: 'Complete Registration & Start',
      creatingAccount: 'Activating your care account...',
      editStep: 'Edit',
      noFamilyAdded: 'No additional family members registered yet.',
    },
    common: {
      back: 'Back',
      next: 'Next Step',
      cancel: 'Cancel',
      uploadPhoto: 'Upload Photo',
      changePhoto: 'Change',
      removePhoto: 'Remove',
      dragDropText: 'Drag & drop image here, or click to browse',
      maxFileSize: 'JPEG, PNG, or WebP up to 5MB',
      fileTooLarge: 'Image is too large (maximum 5MB allowed)',
      invalidFileType: 'Only JPEG, PNG, and WebP images are supported',
      stepCount: (curr, total) => `Step ${curr} of ${total}`,
    },
    validation: {
      nameRequired: 'Please enter a full name (min 2 characters)',
      emailInvalid: 'Please enter a valid email address',
      passwordMin: 'Password must be at least 6 characters',
      passwordsMatch: 'Passwords do not match',
      countryRequired: 'Please select your country or region',
      stateRequired: 'Please enter or select a state/province',
      caregiverNameRequired: 'Caregiver full name is required',
      caregiverPhoneRequired: 'Please provide a valid phone number (min 7 digits)',
      caregiverRelRequired: 'Please select a caregiver relationship',
      termsRequired: 'You must accept the terms of service to proceed',
      identifierRequired: 'Please enter your email or phone number',
      loginPasswordRequired: 'Please enter your password',
    },
  },

  es: {
    isRtl: false,
    nav: {
      loginTab: 'Iniciar Sesión',
      signUpTab: 'Registrarse',
      subheading: 'Cuidado Amoroso de Adultos Mayores y Red Familiar',
      switchLang: 'Idioma',
    },
    steps: {
      step1Title: 'Cuenta y Región',
      step1Desc: 'Credenciales básicas y preferencias regionales',
      step2Title: 'Perfil del Cuidador',
      step2Desc: 'Contacto de apoyo principal y foto',
      step3Title: 'Familiares',
      step3Desc: 'Círculo de emergencia y seres queridos',
      step4Title: 'Revisar y Completar',
      step4Desc: 'Verifica los detalles y activa la cuenta',
    },
    login: {
      title: 'Bienvenido de nuevo a Smriti',
      subtitle: 'Inicia sesión para acceder a horarios de cuidado, juegos cognitivos y círculos familiares.',
      identifierLabel: 'Correo Electrónico o Teléfono',
      identifierPlaceholder: 'ej. maria.cuidado@gmail.com o +34 612 345 678',
      passwordLabel: 'Contraseña',
      passwordPlaceholder: 'Introduce tu contraseña',
      rememberMe: 'Recordarme',
      forgotPassword: '¿Olvidaste tu contraseña?',
      signInBtn: 'Entrar a Smriti',
      signingIn: 'Iniciando sesión...',
      noAccount: '¿Aún no tienes cuenta?',
      signUpLink: 'Crear cuenta de cuidador',
      demoCredentials: 'Acceso Rápido de Demostración (1 Clic)',
      demoTip: 'Rellena automáticamente con credenciales de muestra',
      forgotPasswordModalTitle: 'Restablecer Contraseña',
      forgotPasswordModalDesc: 'Se enviará un enlace de restablecimiento a tu correo o teléfono registrado.',
      forgotPasswordModalClose: 'Entendido',
    },
    step1: {
      fullNameLabel: 'Nombre Completo del Adulto Mayor o Titular',
      fullNamePlaceholder: 'ej. Carmen Rodríguez',
      emailLabel: 'Correo Electrónico',
      emailPlaceholder: 'cuidado@ejemplo.com',
      passwordLabel: 'Contraseña',
      passwordPlaceholder: 'Mínimo 6 caracteres',
      confirmPasswordLabel: 'Confirmar Contraseña',
      confirmPasswordPlaceholder: 'Vuelve a introducir la contraseña',
      countryLabel: 'País / Región',
      stateLabel: 'Estado / Provincia',
      statePlaceholder: 'Selecciona o escribe el estado',
      langLabel: 'Idioma Preferido de la Interfaz',
      langHelper: 'Al cambiarlo, se actualiza inmediatamente toda la interfaz.',
    },
    step2: {
      title: 'Perfil del Cuidador Principal',
      subtitle: '¿Quién es el tutor o enfermero responsable de la atención y alertas diarias?',
      caregiverNameLabel: 'Nombre del Cuidador',
      caregiverNamePlaceholder: 'ej. Sofía Martínez',
      phoneLabel: 'Número de Móvil del Cuidador',
      phonePlaceholder: '612 345 678',
      relationshipLabel: 'Relación con el Adulto Mayor',
      photoLabel: 'Foto del Cuidador',
      photoHelper: 'Una foto reconocible ayuda al adulto mayor a sentirse tranquilo durante los recordatorios.',
      roles: {
        nurse: 'Enfermero(a) Profesional',
        guardian: 'Tutor / Cuidador Legal',
        spouse: 'Cónyuge / Pareja',
        child: 'Hijo / Hija',
        other: 'Otro Familiar / Vecino',
      },
    },
    step3: {
      title: 'Círculo Familiar y Contactos',
      subtitle: 'Añade a familiares cercanos para recordatorios visuales y contactos de emergencia.',
      addMemberBtn: '+ Añadir Familiar',
      memberNameLabel: 'Nombre del Familiar',
      memberNamePlaceholder: 'ej. Carlos Martínez',
      memberRelLabel: 'Parentesco',
      memberPhoneLabel: 'Número de Teléfono',
      memberPhonePlaceholder: 'ej. +34 699 112 233',
      memberPhotoLabel: 'Foto de Perfil',
      emergencyContactToggle: 'Contacto en caso de emergencia',
      emergencyBadge: 'Contacto de Emergencia',
      removeMember: 'Eliminar',
      noMembersYet: 'Aún no hay familiares añadidos. Haz clic en "+ Añadir Familiar" o continúa.',
      roles: {
        daughter: 'Hija',
        son: 'Hijo',
        brother: 'Hermano',
        sister: 'Hermana',
        friend: 'Amigo(a) Cercano',
        neighbor: 'Vecino(a)',
        other: 'Otro Pariente',
      },
    },
    step4: {
      title: 'Revisar y Activar Cuenta',
      subtitle: 'Por favor, confirma los datos antes de crear la cuenta.',
      accountSummary: 'Cuenta y Región',
      caregiverSummary: 'Cuidador Principal',
      familySummary: 'Círculo Familiar y Emergencias',
      termsText: 'Acepto los Términos de Servicio y la Política de Privacidad de Smriti.',
      createAccountBtn: 'Completar Registro y Comenzar',
      creatingAccount: 'Activando tu cuenta de cuidado...',
      editStep: 'Editar',
      noFamilyAdded: 'No se han registrado familiares adicionales.',
    },
    common: {
      back: 'Atrás',
      next: 'Siguiente',
      cancel: 'Cancelar',
      uploadPhoto: 'Subir Foto',
      changePhoto: 'Cambiar',
      removePhoto: 'Quitar',
      dragDropText: 'Arrastra y suelta la imagen aquí o haz clic para buscar',
      maxFileSize: 'JPEG, PNG o WebP hasta 5MB',
      fileTooLarge: 'El archivo excede el límite de 5MB',
      invalidFileType: 'Solo se admiten imágenes JPEG, PNG y WebP',
      stepCount: (curr, total) => `Paso ${curr} de ${total}`,
    },
    validation: {
      nameRequired: 'Ingresa un nombre completo válido (mínimo 2 caracteres)',
      emailInvalid: 'Introduce un correo electrónico válido',
      passwordMin: 'La contraseña debe tener al menos 6 caracteres',
      passwordsMatch: 'Las contraseñas no coinciden',
      countryRequired: 'Por favor selecciona tu país o región',
      stateRequired: 'Por favor ingresa o selecciona un estado/provincia',
      caregiverNameRequired: 'El nombre del cuidador es obligatorio',
      caregiverPhoneRequired: 'Ingresa un teléfono válido (mínimo 7 dígitos)',
      caregiverRelRequired: 'Selecciona la relación del cuidador',
      termsRequired: 'Debes aceptar los términos de servicio para continuar',
      identifierRequired: 'Introduce tu correo electrónico o teléfono',
      loginPasswordRequired: 'Introduce tu contraseña',
    },
  },

  hi: {
    isRtl: false,
    nav: {
      loginTab: 'लॉग इन',
      signUpTab: 'साइन अप',
      subheading: 'बुजुर्गों की ममतामयी देखभाल और पारिवारिक नेटवर्क',
      switchLang: 'भाषा',
    },
    steps: {
      step1Title: 'खाता और क्षेत्र',
      step1Desc: 'बुनियादी लॉगिन विवरण और क्षेत्र प्राथमिकता',
      step2Title: 'देखभालकर्ता प्रोफाइल',
      step2Desc: 'मुख्य सहायक संरक्षक और संपर्क फोटो',
      step3Title: 'परिवार के सदस्य',
      step3Desc: 'आपातकालीन संपर्क और आत्मीय जन',
      step4Title: 'समीक्षा और पूर्ण',
      step4Desc: 'सभी विवरण जांचें और खाता सक्रिय करें',
    },
    login: {
      title: 'स्मृति में आपका स्वागत है',
      subtitle: 'दैनिक दिनचर्या, स्मृति-वर्धक खेल और पारिवारिक मंडल तक पहुंचने के लिए साइन इन करें।',
      identifierLabel: 'ईमेल या मोबाइल फोन नंबर',
      identifierPlaceholder: 'उदा. priya.care@gmail.com या +91 98765 43210',
      passwordLabel: 'पासवर्ड',
      passwordPlaceholder: 'अपना पासवर्ड दर्ज करें',
      rememberMe: 'मुझे याद रखें',
      forgotPassword: 'पासवर्ड भूल गए?',
      signInBtn: 'स्मृति में लॉगिन करें',
      signingIn: 'लॉगिन हो रहा है...',
      noAccount: 'क्या आपके पास खाता नहीं है?',
      signUpLink: 'देखभालकर्ता खाता बनाएं',
      demoCredentials: '1-क्लिक त्वरित डेमो लॉगिन',
      demoTip: 'सैंपल विवरणों से स्वतः भरें',
      forgotPasswordModalTitle: 'पासवर्ड रीसेट करें',
      forgotPasswordModalDesc: 'आपके पंजीकृत ईमेल या फोन पर एसएमएस द्वारा पासवर्ड रीसेट लिंक भेजा जाएगा।',
      forgotPasswordModalClose: 'समझ गया',
    },
    step1: {
      fullNameLabel: 'बुजुर्ग / खाताधारक का पूरा नाम',
      fullNamePlaceholder: 'उदा. हेमंता बोरा (आईता)',
      emailLabel: 'ईमेल पता',
      emailPlaceholder: 'elder.care@example.com',
      passwordLabel: 'पासवर्ड बनाएं',
      passwordPlaceholder: 'कम से कम 6 अक्षर',
      confirmPasswordLabel: 'पासवर्ड की पुष्टि करें',
      confirmPasswordPlaceholder: 'पासवर्ड दोबारा दर्ज करें',
      countryLabel: 'देश / क्षेत्र',
      stateLabel: 'राज्य / प्रांत',
      statePlaceholder: 'राज्य चुनें या लिखें (उदा. असम, दिल्ली)',
      langLabel: 'पसंदीदा इंटरफ़ेस भाषा',
      langHelper: 'इसे बदलते ही संपूर्ण ऐप की भाषा तुरंत बदल जाएगी।',
    },
    step2: {
      title: 'प्राथमिक देखभालकर्ता की जानकारी',
      subtitle: 'दैनिक देखभाल और आपातकालीन चेतावनियों के लिए मुख्य जिम्मेदार व्यक्ति कौन है?',
      caregiverNameLabel: 'देखभालकर्ता का पूरा नाम',
      caregiverNamePlaceholder: 'उदा. अनन्या बोरा',
      phoneLabel: 'देखभालकर्ता का मोबाइल नंबर',
      phonePlaceholder: '98765 43210',
      relationshipLabel: 'बुजुर्ग से संबंध',
      photoLabel: 'देखभालकर्ता की फोटो',
      photoHelper: 'पहचानने योग्य फोटो बुजुर्गों को आवाज अनुस्मारक के दौरान सुरक्षा का अहसास कराती है।',
      roles: {
        nurse: 'प्रशिक्षित नर्स / सहायक',
        guardian: 'संरक्षक / मुख्य देखभालकर्ता',
        spouse: 'पति / पत्नी',
        child: 'बेटा / बेटी',
        other: 'अन्य रिश्तेदार / पड़ोसी',
      },
    },
    step3: {
      title: 'परिवार के सदस्य और केयर सर्कल',
      subtitle: 'उन करीबी परिजनों को जोड़ें जिनकी यादें और संपर्क आपातकाल में उपलब्ध हों।',
      addMemberBtn: '+ परिवार का सदस्य जोड़ें',
      memberNameLabel: 'सदस्य का नाम',
      memberNamePlaceholder: 'उदा. रोहन बोरा (पोता)',
      memberRelLabel: 'संबंध',
      memberPhoneLabel: 'फोन नंबर',
      memberPhonePlaceholder: 'उदा. +91 94350 12345',
      memberPhotoLabel: 'प्रोफ़ाइल फोटो',
      emergencyContactToggle: 'आपातकाल में संपर्क किया जा सकता है',
      emergencyBadge: 'आपातकालीन संपर्क',
      removeMember: 'हटाएं',
      noMembersYet: 'अभी कोई अतिरिक्त सदस्य नहीं जोड़ा गया है। "+ परिवार का सदस्य जोड़ें" पर क्लिक करें।',
      roles: {
        daughter: 'बेटी',
        son: 'बेटा',
        brother: 'भाई',
        sister: 'बहन',
        friend: 'करीबी दोस्त',
        neighbor: 'पड़ोसी',
        other: 'अन्य परिजन',
      },
    },
    step4: {
      title: 'समीक्षा करें और खाता सक्रिय करें',
      subtitle: 'कृपया खाता बनाने से पहले नीचे दिए गए सभी विवरणों की जांच कर लें।',
      accountSummary: 'खाता और क्षेत्रीय प्रोफाइल',
      caregiverSummary: 'प्राथमिक देखभालकर्ता',
      familySummary: 'पारिवारिक घेरा और आपातकालीन संपर्क',
      termsText: 'मैं स्मृति की सेवा की शर्तों और गोपनीयता नीति से सहमत हूं।',
      createAccountBtn: 'पंजीकरण पूरा करें और शुरू करें',
      creatingAccount: 'आपका खाता सक्रिय हो रहा है...',
      editStep: 'संपादित करें',
      noFamilyAdded: 'अभी कोई अतिरिक्त परिजन पंजीकृत नहीं किया गया।',
    },
    common: {
      back: 'पीछे',
      next: 'अगला चरण',
      cancel: 'रद्द करें',
      uploadPhoto: 'फोटो अपलोड करें',
      changePhoto: 'बदलें',
      removePhoto: 'हटाएं',
      dragDropText: 'फोटो यहाँ खींचें और छोड़ें, या चुनने के लिए क्लिक करें',
      maxFileSize: 'अधिकतम 5MB (JPEG, PNG, WebP)',
      fileTooLarge: 'फ़ाइल का आकार 5MB से अधिक है',
      invalidFileType: 'केवल JPEG, PNG और WebP चित्र समर्थित हैं',
      stepCount: (curr, total) => `चरण ${curr} / ${total}`,
    },
    validation: {
      nameRequired: 'कृपया पूरा नाम दर्ज करें (न्यूनतम 2 अक्षर)',
      emailInvalid: 'कृपया एक वैध ईमेल पता दर्ज करें',
      passwordMin: 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए',
      passwordsMatch: 'पासवर्ड मेल नहीं खाते हैं',
      countryRequired: 'कृपया देश या क्षेत्र चुनें',
      stateRequired: 'कृपया राज्य या प्रांत दर्ज करें',
      caregiverNameRequired: 'देखभालकर्ता का नाम आवश्यक है',
      caregiverPhoneRequired: 'कृपया वैध फोन नंबर दर्ज करें (न्यूनतम 7 अंक)',
      caregiverRelRequired: 'कृपया संबंध चुनें',
      termsRequired: 'आगे बढ़ने के लिए शर्तों को स्वीकार करना अनिवार्य है',
      identifierRequired: 'कृपया ईमेल या फोन नंबर दर्ज करें',
      loginPasswordRequired: 'कृपया अपना पासवर्ड दर्ज करें',
    },
  },

  fr: {
    isRtl: false,
    nav: {
      loginTab: 'Connexion',
      signUpTab: "S'inscrire",
      subheading: 'Soin bienveillant des aînés et réseau familial',
      switchLang: 'Langue',
    },
    steps: {
      step1Title: 'Compte & Région',
      step1Desc: 'Identifiants de base et région',
      step2Title: 'Profil de l’aidant',
      step2Desc: 'Contact principal et photo',
      step3Title: 'Membres de la famille',
      step3Desc: 'Cercle d’urgence et proches',
      step4Title: 'Vérifier & Terminer',
      step4Desc: 'Vérifiez et activez le compte',
    },
    login: {
      title: 'Bienvenue sur Smriti',
      subtitle: 'Connectez-vous pour accéder aux routines quotidiennes, jeux cognitifs et au cercle familial.',
      identifierLabel: 'E-mail ou Téléphone Portable',
      identifierPlaceholder: 'ex. marie.soins@gmail.com ou +33 6 12 34 56 78',
      passwordLabel: 'Mot de passe',
      passwordPlaceholder: 'Entrez votre mot de passe',
      rememberMe: 'Se souvenir de moi',
      forgotPassword: 'Mot de passe oublié ?',
      signInBtn: 'Se connecter à Smriti',
      signingIn: 'Connexion en cours...',
      noAccount: "Vous n'avez pas encore de compte ?",
      signUpLink: 'Créer un compte aidant',
      demoCredentials: 'Connexion démo rapide (1 Clic)',
      demoTip: 'Pré-remplit avec des identifiants tests',
      forgotPasswordModalTitle: 'Réinitialiser le mot de passe',
      forgotPasswordModalDesc: 'Un lien de réinitialisation sera envoyé à votre adresse e-mail ou par SMS.',
      forgotPasswordModalClose: 'Compris',
    },
    step1: {
      fullNameLabel: 'Nom complet du titulaire ou de l’aîné',
      fullNamePlaceholder: 'ex. Jean Dupont',
      emailLabel: 'Adresse e-mail',
      emailPlaceholder: 'soins@exemple.com',
      passwordLabel: 'Mot de passe',
      passwordPlaceholder: 'Au moins 6 caractères',
      confirmPasswordLabel: 'Confirmer le mot de passe',
      confirmPasswordPlaceholder: 'Ressaisissez le mot de passe',
      countryLabel: 'Pays / Région',
      stateLabel: 'État / Région / Département',
      statePlaceholder: 'Sélectionnez ou écrivez la région',
      langLabel: 'Langue préférée de l’interface',
      langHelper: 'Changer la langue met immédiatement à jour toute l’application.',
    },
    step2: {
      title: 'Profil de l’aidant principal',
      subtitle: 'Qui est la personne responsable des soins quotidiens et des alertes ?',
      caregiverNameLabel: 'Nom complet de l’aidant',
      caregiverNamePlaceholder: 'ex. Sophie Dupont',
      phoneLabel: 'Numéro de mobile de l’aidant',
      phonePlaceholder: '06 12 34 56 78',
      relationshipLabel: 'Lien avec l’aîné',
      photoLabel: 'Photo de l’aidant',
      photoHelper: 'Une photo reconnaissable rassure l’aîné lors des rappels vocaux.',
      roles: {
        nurse: 'Infirmier(ère) / Professionnel',
        guardian: 'Tuteur / Aidant légal',
        spouse: 'Conjoint(e) / Partenaire',
        child: 'Fils / Fille',
        other: 'Autre parent / Voisin',
      },
    },
    step3: {
      title: 'Famille et cercle de soins',
      subtitle: 'Ajoutez les proches qui apparaîtront dans la galerie de mémoire et seront joints en cas d’urgence.',
      addMemberBtn: '+ Ajouter un membre de la famille',
      memberNameLabel: 'Nom du proche',
      memberNamePlaceholder: 'ex. Lucas Dupont',
      memberRelLabel: 'Lien de parenté',
      memberPhoneLabel: 'Numéro de téléphone',
      memberPhonePlaceholder: 'ex. +33 6 98 76 54 32',
      memberPhotoLabel: 'Photo de profil',
      emergencyContactToggle: 'Peut être contacté en cas d’urgence',
      emergencyBadge: 'Contact d’urgence',
      removeMember: 'Supprimer',
      noMembersYet: 'Aucun membre supplémentaire ajouté. Cliquez sur "+ Ajouter un membre" ou continuez.',
      roles: {
        daughter: 'Fille',
        son: 'Fils',
        brother: 'Frère',
        sister: 'Sœur',
        friend: 'Ami(e) proche',
        neighbor: 'Voisin(e)',
        other: 'Autre parent',
      },
    },
    step4: {
      title: 'Vérifier et activer le compte',
      subtitle: 'Veuillez vérifier les informations ci-dessous avant d’activer le compte.',
      accountSummary: 'Compte et région',
      caregiverSummary: 'Aidant principal',
      familySummary: 'Cercle familial & Urgences',
      termsText: 'J’accepte les Conditions d’utilisation et la Politique de confidentialité de Smriti.',
      createAccountBtn: 'Créer le compte et démarrer',
      creatingAccount: 'Activation de votre compte...',
      editStep: 'Modifier',
      noFamilyAdded: 'Aucun membre de la famille supplémentaire enregistré.',
    },
    common: {
      back: 'Retour',
      next: 'Étape suivante',
      cancel: 'Annuler',
      uploadPhoto: 'Téléverser photo',
      changePhoto: 'Changer',
      removePhoto: 'Supprimer',
      dragDropText: 'Glissez-déposez l’image ou cliquez pour parcourir',
      maxFileSize: 'JPEG, PNG ou WebP jusqu’à 5 Mo',
      fileTooLarge: 'L’image dépasse la limite de 5 Mo',
      invalidFileType: 'Seuls les formats JPEG, PNG et WebP sont acceptés',
      stepCount: (curr, total) => `Étape ${curr} sur ${total}`,
    },
    validation: {
      nameRequired: 'Veuillez saisir un nom complet (au moins 2 caractères)',
      emailInvalid: 'Veuillez saisir une adresse e-mail valide',
      passwordMin: 'Le mot de passe doit comporter au moins 6 caractères',
      passwordsMatch: 'Les mots de passe ne correspondent pas',
      countryRequired: 'Veuillez sélectionner un pays ou une région',
      stateRequired: 'Veuillez renseigner un état ou une région',
      caregiverNameRequired: 'Le nom de l’aidant est obligatoire',
      caregiverPhoneRequired: 'Numéro de téléphone valide requis (min 7 chiffres)',
      caregiverRelRequired: 'Veuillez sélectionner le lien avec l’aîné',
      termsRequired: 'Vous devez accepter les conditions pour continuer',
      identifierRequired: 'Veuillez saisir votre e-mail ou téléphone',
      loginPasswordRequired: 'Veuillez saisir votre mot de passe',
    },
  },

  de: {
    isRtl: false,
    nav: {
      loginTab: 'Anmelden',
      signUpTab: 'Registrieren',
      subheading: 'Liebevolle Seniorenpflege & Familiennetzwerk',
      switchLang: 'Sprache',
    },
    steps: {
      step1Title: 'Konto & Region',
      step1Desc: 'Zugangsdaten und regionale Einstellungen',
      step2Title: 'Betreuerprofil',
      step2Desc: 'Hauptansprechpartner und Profilfoto',
      step3Title: 'Familienmitglieder',
      step3Desc: 'Notfallkreis und Angehörige',
      step4Title: 'Prüfen & Abschließen',
      step4Desc: 'Angaben bestätigen und Konto aktivieren',
    },
    login: {
      title: 'Willkommen zurück bei Smriti',
      subtitle: 'Melden Sie sich an, um Tagesroutinen, Gedächtnisspiele und Familienkreise abzurufen.',
      identifierLabel: 'E-Mail oder Mobiltelefonnummer',
      identifierPlaceholder: 'z.B. anna.pflege@gmail.com oder +49 170 1234567',
      passwordLabel: 'Passwort',
      passwordPlaceholder: 'Geben Sie Ihr Passwort ein',
      rememberMe: 'Angemeldet bleiben',
      forgotPassword: 'Passwort vergessen?',
      signInBtn: 'Bei Smriti anmelden',
      signingIn: 'Anmeldung läuft...',
      noAccount: 'Noch kein Konto?',
      signUpLink: 'Betreuerkonto erstellen',
      demoCredentials: '1-Klick Schnell-Demo-Login',
      demoTip: 'Füllt Testdaten für Senioren und Betreuer ein',
      forgotPasswordModalTitle: 'Passwort zurücksetzen',
      forgotPasswordModalDesc: 'Ein Link zum Zurücksetzen wird an Ihre hinterlegte E-Mail-Adresse oder per SMS gesendet.',
      forgotPasswordModalClose: 'Verstanden',
    },
    step1: {
      fullNameLabel: 'Vollständiger Name des Seniors / Kontoinhabers',
      fullNamePlaceholder: 'z.B. Gerhard Weber',
      emailLabel: 'E-Mail-Adresse',
      emailPlaceholder: 'pflege@beispiel.de',
      passwordLabel: 'Passwort erstellen',
      passwordPlaceholder: 'Mindestens 6 Zeichen',
      confirmPasswordLabel: 'Passwort bestätigen',
      confirmPasswordPlaceholder: 'Passwort erneut eingeben',
      countryLabel: 'Land / Region',
      stateLabel: 'Bundesland / Region',
      statePlaceholder: 'Bundesland auswählen oder eingeben',
      langLabel: 'Bevorzugte Oberflächensprache',
      langHelper: 'Ein Wechsel passt die gesamte Benutzeroberfläche sofort an.',
    },
    step2: {
      title: 'Profil des Hauptbetreuers',
      subtitle: 'Wer übernimmt die Hauptverantwortung für Betreuung und Notfallalarme?',
      caregiverNameLabel: 'Vollständiger Name des Betreuers',
      caregiverNamePlaceholder: 'z.B. Julia Weber',
      phoneLabel: 'Mobilnummer des Betreuers',
      phonePlaceholder: '0170 1234567',
      relationshipLabel: 'Beziehung zum Senior',
      photoLabel: 'Foto des Betreuers',
      photoHelper: 'Ein vertrautes Foto gibt Sicherheit bei Sprachanrufen und Erinnerungen.',
      roles: {
        nurse: 'Pflegefachkraft / Pfleger(in)',
        guardian: 'Gesetzlicher Betreuer / Vormund',
        spouse: 'Ehepartner(in) / Lebenspartner(in)',
        child: 'Sohn / Tochter',
        other: 'Anderer Verwandter / Nachbar',
      },
    },
    step3: {
      title: 'Familienkreis & Angehörige',
      subtitle: 'Fügen Sie nahe Angehörige für den Gedächtnispfad und Notfallkontakte hinzu.',
      addMemberBtn: '+ Familienmitglied hinzufügen',
      memberNameLabel: 'Name des Angehörigen',
      memberNamePlaceholder: 'z.B. Felix Weber (Enkel)',
      memberRelLabel: 'Verwandtschaftsgrad',
      memberPhoneLabel: 'Telefonnummer',
      memberPhonePlaceholder: 'z.B. +49 160 9876543',
      memberPhotoLabel: 'Profilfoto',
      emergencyContactToggle: 'Im Notfall kontaktierbar',
      emergencyBadge: 'Notfallkontakt',
      removeMember: 'Entfernen',
      noMembersYet: 'Noch keine weiteren Familienmitglieder hinzugefügt.',
      roles: {
        daughter: 'Tochter',
        son: 'Sohn',
        brother: 'Bruder',
        sister: 'Schwester',
        friend: 'Enger Freund',
        neighbor: 'Nachbar',
        other: 'Anderer Angehöriger',
      },
    },
    step4: {
      title: 'Überprüfen & Konto aktivieren',
      subtitle: 'Bitte prüfen Sie alle Angaben sorgfältig vor der Kontoerstellung.',
      accountSummary: 'Konto & Region',
      caregiverSummary: 'Hauptbetreuer',
      familySummary: 'Familienkreis & Notfallkontakte',
      termsText: 'Ich stimme den Nutzungsbedingungen und der Datenschutzerklärung von Smriti zu.',
      createAccountBtn: 'Registrierung abschließen & Starten',
      creatingAccount: 'Konto wird eingerichtet...',
      editStep: 'Bearbeiten',
      noFamilyAdded: 'Keine weiteren Familienmitglieder eingetragen.',
    },
    common: {
      back: 'Zurück',
      next: 'Nächster Schritt',
      cancel: 'Abbrechen',
      uploadPhoto: 'Foto hochladen',
      changePhoto: 'Ändern',
      removePhoto: 'Entfernen',
      dragDropText: 'Bild hierher ziehen oder klicken zum Auswählen',
      maxFileSize: 'JPEG, PNG oder WebP bis 5 MB',
      fileTooLarge: 'Datei ist größer als 5 MB',
      invalidFileType: 'Nur JPEG, PNG und WebP Formate unterstützt',
      stepCount: (curr, total) => `Schritt ${curr} von ${total}`,
    },
    validation: {
      nameRequired: 'Bitte vollständigen Namen eingeben (mind. 2 Zeichen)',
      emailInvalid: 'Bitte gültige E-Mail-Adresse eingeben',
      passwordMin: 'Passwort muss mindestens 6 Zeichen lang sein',
      passwordsMatch: 'Passwörter stimmen nicht überein',
      countryRequired: 'Bitte Land oder Region auswählen',
      stateRequired: 'Bitte Bundesland/Region angeben',
      caregiverNameRequired: 'Name des Betreuers ist erforderlich',
      caregiverPhoneRequired: 'Gültige Telefonnummer erforderlich (mind. 7 Ziffern)',
      caregiverRelRequired: 'Bitte Beziehung auswählen',
      termsRequired: 'Zustimmung zu den Nutzungsbedingungen ist erforderlich',
      identifierRequired: 'Bitte E-Mail oder Telefonnummer eingeben',
      loginPasswordRequired: 'Bitte Passwort eingeben',
    },
  },

  ar: {
    isRtl: true,
    nav: {
      loginTab: 'تسجيل الدخول',
      signUpTab: 'إنشاء حساب',
      subheading: 'رعاية المسنين الكريمة والشبكة العائلية',
      switchLang: 'اللغة',
    },
    steps: {
      step1Title: 'الحساب والمنطقة',
      step1Desc: 'بيانات الحساب الأساسية والإعدادات الإقليمية',
      step2Title: 'ملف مقدم الرعاية',
      step2Desc: 'المشرف الرئيسي وصورة التواصل',
      step3Title: 'أفراد العائلة',
      step3Desc: 'دائرة الطوارئ والأحباء',
      step4Title: 'المراجعة والإكمال',
      step4Desc: 'التحقق من البيانات وتفعيل الحساب',
    },
    login: {
      title: 'مرحبًا بك مجددًا في سمريتي',
      subtitle: 'سجّل الدخول للوصول إلى جداول رعاية المسنين وألعاب تنشيط الذاكرة والدائرة العائلية.',
      identifierLabel: 'البريد الإلكتروني أو رقم الهاتف',
      identifierPlaceholder: 'مثال: fatima.care@gmail.com أو +966 50 123 4567',
      passwordLabel: 'كلمة المرور',
      passwordPlaceholder: 'أدخل كلمة المرور الخاصة بك',
      rememberMe: 'تذكرني',
      forgotPassword: 'نسيت كلمة المرور؟',
      signInBtn: 'تسجيل الدخول إلى سمريتي',
      signingIn: 'جاري تسجيل الدخول...',
      noAccount: 'ليس لديك حساب بعد؟',
      signUpLink: 'إنشاء حساب مقدم رعاية',
      demoCredentials: 'تسجيل دخول تجريبي سريع (نقرة واحدة)',
      demoTip: 'تعبئة تلقائية ببيانات المسن ومقدم الرعاية التجريبية',
      forgotPasswordModalTitle: 'إعادة تعيين كلمة المرور',
      forgotPasswordModalDesc: 'سيتم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني أو عبر رسالة نصية قصيرة.',
      forgotPasswordModalClose: 'حسناً',
    },
    step1: {
      fullNameLabel: 'الاسم الكامل للمسن أو صاحب الحساب',
      fullNamePlaceholder: 'مثال: عبد الله أحمد',
      emailLabel: 'عنوان البريد الإلكتروني',
      emailPlaceholder: 'care@example.com',
      passwordLabel: 'إنشاء كلمة المرور',
      passwordPlaceholder: 'على الأقل 6 أحرف أو أرقام',
      confirmPasswordLabel: 'تأكيد كلمة المرور',
      confirmPasswordPlaceholder: 'أعد إدخال كلمة المرور',
      countryLabel: 'الدولة / المنطقة',
      stateLabel: 'المنطقة / المحافظة',
      statePlaceholder: 'اختر أو اكتب المحافظة',
      langLabel: 'لغة الواجهة المفضلة',
      langHelper: 'تغيير اللغة يحدّث واجهة التطبيق بأكملها فوراً.',
    },
    step2: {
      title: 'ملف مقدم الرعاية الرئيسي',
      subtitle: 'من هو المسؤول الأساسي عن الرعاية اليومية وتنبيهات الطوارئ؟',
      caregiverNameLabel: 'الاسم الكامل لمقدم الرعاية',
      caregiverNamePlaceholder: 'مثال: نورة عبد الله',
      phoneLabel: 'رقم هاتف مقدم الرعاية',
      phonePlaceholder: '050 123 4567',
      relationshipLabel: 'صلة القرابة بالمسن',
      photoLabel: 'صورة مقدم الرعاية',
      photoHelper: 'الصورة الواضحة تمنح المسن الاطمئنان أثناء التذكيرات الصوتية.',
      roles: {
        nurse: 'ممرض(ة) متخصص(ة)',
        guardian: 'وصي / مقدم رعاية قانوني',
        spouse: 'الزوج / الزوجة',
        child: 'الابن / الابنة',
        other: 'قريب آخر / جار',
      },
    },
    step3: {
      title: 'أفراد العائلة ودائرة الرعاية',
      subtitle: 'أضف أفراد العائلة المقربين الذين يظهرون في شريط الذكريات وللتواصل في الطوارئ.',
      addMemberBtn: '+ إضافة فرد من العائلة',
      memberNameLabel: 'اسم فرد العائلة',
      memberNamePlaceholder: 'مثال: عمر (الحفيد)',
      memberRelLabel: 'صلة القرابة',
      memberPhoneLabel: 'رقم الهاتف',
      memberPhonePlaceholder: 'مثال: +966 55 987 6543',
      memberPhotoLabel: 'الصورة الشخصية',
      emergencyContactToggle: 'يمكن الاتصال به في حالات الطوارئ',
      emergencyBadge: 'جهة اتصال طوارئ',
      removeMember: 'حذف',
      noMembersYet: 'لم تتم إضافة أفراد إضافيين بعد. انقر على "+ إضافة فرد من العائلة" أو تابع.',
      roles: {
        daughter: 'ابنة',
        son: 'ابن',
        brother: 'أخ',
        sister: 'أخت',
        friend: 'صديق مقرب',
        neighbor: 'جار',
        other: 'قريب آخر',
      },
    },
    step4: {
      title: 'المراجعة وتفعيل الحساب',
      subtitle: 'يرجى التأكد من صحة البيانات المسجلة قبل المتابعة.',
      accountSummary: 'ملف الحساب والمنطقة',
      caregiverSummary: 'مقدم الرعاية الرئيسي',
      familySummary: 'الدائرة العائلية والطوارئ',
      termsText: 'أوافق على شروط خدمة سمريتي وسياسة الخصوصية لرعاية كبار السن.',
      createAccountBtn: 'إتمام التسجيل والبدء',
      creatingAccount: 'جاري تفعيل الحساب...',
      editStep: 'تعديل',
      noFamilyAdded: 'لم يتم تسجيل أفراد عائلة إضافيين حتى الآن.',
    },
    common: {
      back: 'رجوع',
      next: 'الخطوة التالية',
      cancel: 'إلغاء',
      uploadPhoto: 'رفع الصورة',
      changePhoto: 'تغيير',
      removePhoto: 'حذف',
      dragDropText: 'اسحب وأفلت الصورة هنا، أو انقر للاختيار',
      maxFileSize: 'JPEG أو PNG أو WebP بحد أقصى 5 ميجابايت',
      fileTooLarge: 'حجم الصورة يتجاوز الحد المسموح به (5 ميجابايت)',
      invalidFileType: 'تنسيقات الصور المدعومة فقط: JPEG, PNG, WebP',
      stepCount: (curr, total) => `الخطوة ${curr} من ${total}`,
    },
    validation: {
      nameRequired: 'يرجى إدخال الاسم الكامل (حرفان على الأقل)',
      emailInvalid: 'يرجى إدخال بريد إلكتروني صالح',
      passwordMin: 'يجب ألا تقل كلمة المرور عن 6 أحرف',
      passwordsMatch: 'كلمتا المرور غير متطابقتين',
      countryRequired: 'يرجى تحديد الدولة أو المنطقة',
      stateRequired: 'يرجى إدخال المنطقة أو المحافظة',
      caregiverNameRequired: 'اسم مقدم الرعاية مطلوب',
      caregiverPhoneRequired: 'يرجى إدخال رقم هاتف صالح (7 أرقام كحد أدنى)',
      caregiverRelRequired: 'يرجى اختيار صلة القرابة',
      termsRequired: 'يجب الموافقة على شروط الخدمة للمتابعة',
      identifierRequired: 'يرجى إدخال البريد الإلكتروني أو رقم الهاتف',
      loginPasswordRequired: 'يرجى إدخال كلمة المرور',
    },
  },

  as: {
    isRtl: false,
    nav: {
      loginTab: 'লগ ইন',
      signUpTab: 'ছাইন আপ',
      subheading: 'জ্যেষ্ঠজনৰ স্নেহময় যত্ন আৰু পাৰিবাৰিক সংযোগ',
      switchLang: 'ভাষা',
    },
    steps: {
      step1Title: 'একাউণ্ট আৰু অঞ্চল',
      step1Desc: 'প্ৰাথমিক তথ্য আৰু আঞ্চলিক পছন্দ',
      step2Title: 'যত্নকৰ্তাৰ প্ৰফাইল',
      step2Desc: 'মুখ্য সাহায্যকৰ্তা আৰু ফটো',
      step3Title: 'পৰিয়ালৰ সদস্য',
      step3Desc: 'জৰুৰীকালীন বৃত্ত আৰু আত্মীয়',
      step4Title: 'নিৰীক্ষণ আৰু সম্পূৰ্ণ',
      step4Desc: 'সকলো তথ্য পৰীক্ষা কৰি সক্ৰিয় কৰক',
    },
    login: {
      title: 'স্মৃতিলৈ পুনৰ স্বাগতম',
      subtitle: 'দৈনন্দিন তালিকা, মগজুৰ খেল আৰু পৰিয়াল মণ্ডললৈ প্ৰৱেশ কৰক।',
      identifierLabel: 'ইমেইল বা ম’বাইল নম্বৰ',
      identifierPlaceholder: 'उदा. priya.care@gmail.com বা +91 98765 43210',
      passwordLabel: 'পাছৱৰ্ড',
      passwordPlaceholder: 'পাছৱৰ্ড প্ৰৱেশ কৰক',
      rememberMe: 'মোক মনত ৰাখক',
      forgotPassword: 'পাছৱৰ্ড পাহৰিলে?',
      signInBtn: 'স্মৃতিত প্ৰৱেশ কৰক',
      signingIn: 'প্ৰৱেশ কৰি থকা হৈছে...',
      noAccount: 'এতিয়াও একাউণ্ট নাই নেকি?',
      signUpLink: 'যত্নকৰ্তা একাউণ্ট সৃষ্টি কৰক',
      demoCredentials: '১-ক্লিক দ্ৰুত ডেমো লগইন (মাজুলী পৰিয়াল)',
      demoTip: 'নমুনা তথ্যৰে স্বয়ংক্ৰিয়ভাৱে পূৰণ কৰক',
      forgotPasswordModalTitle: 'পাছৱৰ্ড পুনৰ নিৰ্ধাৰণ',
      forgotPasswordModalDesc: 'আপোনাৰ পঞ্জীভুক্ত নম্বৰলৈ নিৰ্দেশনা প্ৰেৰণ কৰা হ’ব।',
      forgotPasswordModalClose: 'বুজি পালোঁ',
    },
    step1: {
      fullNameLabel: 'জ্যেষ্ঠজন / একাউণ্টৰ সম্পূৰ্ণ নাম',
      fullNamePlaceholder: 'उदा. ভৱধৰ বৰা (আইতা)',
      emailLabel: 'ইমেইল ঠিকনা',
      emailPlaceholder: 'elder.care@example.com',
      passwordLabel: 'পাছৱৰ্ড নিৰ্ধাৰণ কৰক',
      passwordPlaceholder: 'নূন্যতম ৬টা বৰ্ণ',
      confirmPasswordLabel: 'পাছৱৰ্ড নিশ্চিত কৰক',
      confirmPasswordPlaceholder: 'পাছৱৰ্ড পুনৰ প্ৰৱেশ কৰক',
      countryLabel: 'দেশ / অঞ্চল',
      stateLabel: 'ৰাজ্য / প্ৰদেশ',
      statePlaceholder: 'ৰাজ্য বাছনি বা টাইপ কৰক (যেনে অসম)',
      langLabel: 'প্ৰাথমিক ভাষা',
      langHelper: 'এইটো সলনি কৰিলে তৎক্ষণাত সম্পূৰ্ণ এপৰ ভাষা সলনি হ’ব।',
    },
    step2: {
      title: 'মুখ্য যত্নকৰ্তাৰ তথ্য',
      subtitle: 'দৈনন্দিন সহায় আৰু জৰুৰী সতৰ্কতাৰ বাবে মূল দায়বদ্ধ ব্যক্তি কোন?',
      caregiverNameLabel: 'যত্নকৰ্তাৰ সম্পূৰ্ণ নাম',
      caregiverNamePlaceholder: 'उदा. অনন্যা বৰা',
      phoneLabel: 'যত্নকৰ্তাৰ ম’বাইল নম্বৰ',
      phonePlaceholder: '98765 43210',
      relationshipLabel: 'জ্যেষ্ঠজনৰ সৈতে সম্পৰ্ক',
      photoLabel: 'যত্নকৰ্তাৰ ফটো',
      photoHelper: 'চিনাকি ফটোৱে জ্যেষ্ঠজনক মাত শুনিলে আশ্বস্ত কৰে।',
      roles: {
        nurse: 'প্ৰশিক্ষিত নাৰ্ছ / সহায়িকা',
        guardian: 'অভিভাৱক / আইনী যত্নকৰ্তা',
        spouse: 'স্বামী / স্ত্ৰী',
        child: 'পুত্ৰ / কন্যা',
        other: 'অন্য আত্মীয় / চুবুৰীয়া',
      },
    },
    step3: {
      title: 'পৰিয়ালৰ সদস্য আৰু সুৰক্ষা বৃত্ত',
      subtitle: 'স্মৃতিৰ পাত আৰু জৰুৰীকালীন সংযোগৰ বাবে আত্মীয়ক অন্তৰ্ভুক্ত কৰক।',
      addMemberBtn: '+ পৰিয়ালৰ সদস্য যোগ কৰক',
      memberNameLabel: 'সদস্যৰ নাম',
      memberNamePlaceholder: 'उदा. ৰোহন বৰা (নাতি)',
      memberRelLabel: 'সম্পৰ্ক',
      memberPhoneLabel: 'ফোন নম্বৰ',
      memberPhonePlaceholder: 'उदा. +91 94350 12345',
      memberPhotoLabel: 'প্ৰফাইল ফটো',
      emergencyContactToggle: 'জৰুৰীকালীন সময়ত যোগাযোগ কৰিব পাৰি',
      emergencyBadge: 'জৰুৰীকালীন যোগাযোগ',
      removeMember: 'আঁতৰাওক',
      noMembersYet: 'এতিয়ালৈকে কোনো সদস্য যোগ কৰা হোৱা নাই। "+ পৰিয়ালৰ সদস্য যোগ কৰক" টিপক।',
      roles: {
        daughter: 'জী',
        son: 'ল’ৰা',
        brother: 'ভায়েক / ককায়েক',
        sister: 'ভনীয়েক / বায়েক',
        friend: 'ঘনিষ্ঠ বন্ধু',
        neighbor: 'চুবুৰীয়া',
        other: 'অন্য আত্মীয়',
      },
    },
    step4: {
      title: 'নিৰীক্ষণ আৰু একাউণ্ট সক্ৰিয়কৰণ',
      subtitle: 'অনুগ্ৰহ কৰি তলৰ সকলো তথ্য শুদ্ধ নে পৰীক্ষা কৰক।',
      accountSummary: 'একাউণ্ট আৰু আঞ্চলিক তথ্য',
      caregiverSummary: 'মুখ্য যত্নকৰ্তা',
      familySummary: 'পৰিয়াল বৃত্ত আৰু জৰুৰীকালীন যোগাযোগ',
      termsText: 'মই স্মৃতিৰ সেৱাৰ নীতি আৰু গোপনীয়তা নীতি মানি লৈছোঁ।',
      createAccountBtn: 'পঞ্জীয়ন সম্পূৰ্ণ কৰক আৰু আৰম্ভ কৰক',
      creatingAccount: 'একাউণ্ট সক্ৰিয় হৈ আছে...',
      editStep: 'সম্পাদনা',
      noFamilyAdded: 'এতিয়ালৈকে অতিৰিক্ত সদস্য পঞ্জীয়ন কৰা হোৱা নাই।',
    },
    common: {
      back: 'পিচলৈ',
      next: 'পৰৱৰ্তী স্তৰ',
      cancel: 'বাতিল কৰক',
      uploadPhoto: 'ফটো আপলোড কৰক',
      changePhoto: 'সলনি কৰক',
      removePhoto: 'আঁতৰাওক',
      dragDropText: 'ফটো ইয়ালৈ টানি আনক বা বাছনি কৰিবলৈ ক্লিক কৰক',
      maxFileSize: 'সৰ্বোচ্চ ৫MB (JPEG, PNG, WebP)',
      fileTooLarge: 'ফটোখন ৫MB তকৈ ডাঙৰ',
      invalidFileType: 'কেৱল JPEG, PNG আৰু WebP ছবিহে গ্ৰহণযোগ্য',
      stepCount: (curr, total) => `স্তৰ ${curr} / ${total}`,
    },
    validation: {
      nameRequired: 'অনুগ্ৰহ কৰি সম্পূৰ্ণ নাম প্ৰৱেশ কৰক (নূন্যতম ২টা আখৰ)',
      emailInvalid: 'অনুগ্ৰহ কৰি এটা বৈধ ইমেইল ঠিকনা দিয়ক',
      passwordMin: 'পাছৱৰ্ড নূন্যতম ৬টা আখৰৰ হ’ব লাগিব',
      passwordsMatch: 'পাছৱৰ্ড দুটা একে হোৱা নাই',
      countryRequired: 'অনুগ্ৰহ কৰি দেশ বা অঞ্চল বাছনি কৰক',
      stateRequired: 'অনুগ্ৰহ কৰি ৰাজ্য বা প্ৰদেশ উল্লেখ কৰক',
      caregiverNameRequired: 'যত্নকৰ্তাৰ নাম প্ৰয়োজনীয়',
      caregiverPhoneRequired: 'অনুগ্ৰহ কৰি এটা বৈধ নম্বৰ দিয়ক (নূন্যতম ৭টা অংক)',
      caregiverRelRequired: 'অনুগ্ৰহ কৰি সম্পৰ্ক বাছনি কৰক',
      termsRequired: 'আগবাঢ়িবলৈ চৰ্তসমূহ মানি লোৱাটো বাধ্যতামূলক',
      identifierRequired: 'অনুগ্ৰহ কৰি ইমেইল বা ফোন নম্বৰ দিয়ক',
      loginPasswordRequired: 'অনুগ্ৰহ কৰি পাছৱৰ্ড দিয়ক',
    },
  },
};

export const getAuthUiStrings = (lang: string = 'en'): AuthUiStrings => {
  const code = (lang in AUTH_TRANSLATIONS) ? (lang as AuthLanguageCode) : 'en';
  return AUTH_TRANSLATIONS[code] || AUTH_TRANSLATIONS.en;
};
