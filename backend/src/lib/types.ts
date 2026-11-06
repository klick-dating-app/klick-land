export type Gender = 'male' | 'female';
export type SafetyStatus = 'verified' | 'pending' | 'restricted' | 'blocked';
export type Plan = 'free' | 'basic' | 'premium' | 'vip';

/** Perfil público: `users/{uid}` (lo leen otros usuarios autenticados). */
export interface PublicProfile {
  name: string;
  age: number;
  gender: Gender;
  interestedIn: Gender;
  city: string;
  state: string;
  /** Coordenadas redondeadas (~1 km). Nunca se guardan coordenadas exactas. */
  lat: number;
  lng: number;
  photos: string[];
  bio: string;
  verified: boolean;
  safetyStatus: SafetyStatus;
  onboarded: boolean;
}

/** Cuestionario: `users/{uid}/restricted/details` (solo dueño o usuarios con `canViewDetails`). */
export interface Questionnaire {
  faith: string;
  faithImportance: 'Very important' | 'Important' | 'Flexible';
  templeRecommend: 'Sí' | 'En proceso' | 'No' | 'Prefiero no indicar';
  templeMarriageRequirement: 'Indispensable' | 'Preferred' | 'Flexible';
  servedMission: string;
  maritalStatus: string;
  seekingMarriage: boolean;
  marriageTimeline: '<1 año' | '1-2 años' | '2+ años' | 'Flexible';
  marriageIndispensable: boolean;
  hasChildren: boolean;
  wantsChildren: 'Sí' | 'No' | 'No seguro';
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
}
