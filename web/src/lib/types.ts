export type Gender = 'male' | 'female';
export type Plan = 'free' | 'basic' | 'premium' | 'vip';

export interface UserProfile {
  name: string;
  age: number;
  gender: Gender;
  interestedIn: Gender;
  city: string;
  state: string;
  lat: number;
  lng: number;
  photos: string[];
  bio: string;
  verified: boolean;
  safetyStatus: 'verified' | 'pending' | 'restricted' | 'blocked';
  onboarded: boolean;
  /** Redes que la persona conectó (usuario o número de WhatsApp). */
  socials?: Partial<Record<SocialNetwork, string>>;
}

/**
 * Catálogo del cuestionario SafeMeet.Ut (hoja "Filtros de Búsqueda").
 * El valor guardado es el texto en inglés de la UI; el servidor valida contra estas listas.
 */
export const IMPORTANCE_LEVELS = ['Essential', 'Very important', 'Preferred', 'Not important', 'Indifferent'] as const;
export const LANGUAGE_IMPORTANCE = ['Essential', 'Very important', 'Preferred', 'Not important'] as const;
export const CHURCH_IMPORTANCE = ['Very important', 'Important', 'Moderately important', 'Slightly important'] as const;
export const CHURCH_ATTENDANCE = ['Every week', 'Almost every week', 'A few times a month', 'Occasionally'] as const;
export const SPIRITUAL_EXPECTATIONS = ['Similar faith', 'Regular attendance', 'Temple recommend', 'Temple marriage', 'Not important'] as const;
export const RELATIONSHIP_GOALS = ['Meeting people', 'Friendship', 'Casual dating', 'Serious relationship', 'Marriage', 'Temple marriage'] as const;
export const PARTNER_LANGUAGES = ['English', 'Spanish', 'Portuguese', 'French', 'Italian', 'German', 'Other'] as const;
export const CULTURES = ['Latin American', 'North American', 'European', 'Asian', 'African', 'Middle Eastern', 'Other', 'No preference'] as const;
export const CHILDREN_STATUS = ['No', 'Yes, they live with me', 'Yes, shared custody', "Yes, they don't live with me"] as const;
export const VERIFIED_ONLY = ['Yes', 'No', 'Indifferent'] as const;
export const YES_NO_MAYBE = ['Yes', 'No', 'Maybe'] as const;
export const VALUE_KEYS = ['Faith', 'Family', 'Health', 'Responsible finances', 'Service', 'Travel', 'Physical activity', 'Affection'] as const;
export const VALUE_PRIORITY = ['Essential', 'Important', 'Nice to have', 'Not important'] as const;
export const CORE_VALUES = ['Faith', 'Family', 'Honesty', 'Integrity', 'Service', 'Kindness', 'Loyalty', 'Humor', 'Growth', 'Health'] as const;
export const MARITAL_STATUS = ['Soltero/a', 'Divorciado/a', 'Viudo/a'] as const;
export const EDUCATION_LEVELS = ['High school', 'Some college', 'Trade school', "Associate's", "Bachelor's", "Master's", 'Doctorate'] as const;

/** Orden de los iconos en el perfil (TikTok y Spotify intercambiados respecto al pie de página). Se guarda el usuario (no la URL). */
export const SOCIAL_NETWORKS = ['tiktok', 'facebook', 'instagram', 'whatsapp', 'x', 'youtube', 'spotify'] as const;
export type SocialNetwork = (typeof SOCIAL_NETWORKS)[number];

export type ImportanceLevel = (typeof IMPORTANCE_LEVELS)[number];
export type ValueKey = (typeof VALUE_KEYS)[number];
export type ValuePriority = (typeof VALUE_PRIORITY)[number];

export interface Questionnaire {
  faith: string;
  faithImportance: 'Very important' | 'Important' | 'Flexible';
  templeRecommend: 'Sí' | 'En proceso' | 'No' | 'Prefiero no indicar';
  templeMarriageRequirement: 'Indispensable' | 'Preferred' | 'Flexible';
  servedMission: string;
  maritalStatus: string;
  seekingMarriage: boolean;
  marriageTimeline: '<1 año' | '1-2 años' | '2-3 años' | '2+ años' | 'Persona correcta' | 'Flexible';
  marriageIndispensable: boolean;
  hasChildren: boolean;
  wantsChildren: 'Sí' | 'No' | 'Tal vez' | 'No seguro';
  acceptsPartnerWithChildren: 'Sí' | 'No' | 'Flexible';
  familyIndispensable: boolean;
  languages: string[];
  lifestyleRoutine: string[];
  occupation: string;
  communicationStyle: string;
  hobbies: string[];
  sports: string[];
  preferredDateTypes: string[];
  minAge: number;
  maxAge: number;
  maxDistanceMiles: number;
  // Campos SafeMeet.Ut. Opcionales: los perfiles guardados antes no los tienen y el algoritmo usa los campos anteriores como respaldo.
  churchImportance?: (typeof CHURCH_IMPORTANCE)[number];
  churchAttendance?: (typeof CHURCH_ATTENDANCE)[number];
  partnerTempleImportance?: ImportanceLevel;
  spiritualExpectations?: string[];
  relationshipGoals?: string[];
  partnerLanguages?: string[];
  languageImportance?: (typeof LANGUAGE_IMPORTANCE)[number];
  culturalBackground?: string;
  culturePreferences?: string[];
  verifiedOnly?: (typeof VERIFIED_ONLY)[number];
  childrenStatus?: (typeof CHILDREN_STATUS)[number];
  openToLongDistance?: (typeof YES_NO_MAYBE)[number];
  valuePriorities?: Partial<Record<ValueKey, ValuePriority>>;
  coreValues?: string[];
  education?: string;
  heightCm?: number;
  safeFirstDate?: boolean;
  minCompatibility?: number;
}

export interface Entitlement {
  plan: Plan;
  canChat: boolean;
  canViewDetails: boolean;
  status: 'active' | 'past_due' | 'canceled' | 'none';
  currentPeriodEnd?: number;
}

export interface Candidate {
  uid: string;
  name: string;
  age: number;
  city: string;
  state: string;
  distanceMiles: number;
  photos: string[];
  bio: string;
  verified: boolean;
  score: number;
  commonGround: string[];
  /** Puntaje 0–100 por factor de la hoja "Compatibilidad" (fe, meta, familia…). */
  factors?: Record<string, number>;
}

export interface Match {
  id: string;
  members: string[];
  profiles: Record<string, { name: string; photo: string | null }>;
  score: number;
  commonGround: string[];
  kind?: 'date' | 'friendship';
  status: 'active' | 'blocked';
  lastMessage: string | null;
  lastMessageAt?: { toMillis(): number };
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  createdAt?: { toMillis(): number };
}

export interface SafeDate {
  id: string;
  matchId: string;
  participants: string[];
  createdBy: string;
  venueName: string;
  venueAddress: string;
  dateTimeMs: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  checkins: Record<string, boolean>;
}
