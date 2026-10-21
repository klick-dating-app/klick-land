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
}

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
}

export interface Match {
  id: string;
  members: string[];
  profiles: Record<string, { name: string; photo: string | null }>;
  score: number;
  commonGround: string[];
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
