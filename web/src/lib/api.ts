import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';
import type { Candidate, Plan, Questionnaire, SocialNetwork } from './types';

const call = <Req, Res>(name: string) => {
  const fn = httpsCallable<Req, Res>(functions, name);
  return async (data: Req) => (await fn(data)).data;
};

export interface ProfileInput {
  name: string;
  dob?: string;
  gender?: 'male' | 'female';
  interestedIn: 'male' | 'female';
  city: string;
  state: string;
  lat: number;
  lng: number;
  photos: string[];
  bio: string;
  questionnaire: Questionnaire;
  /** Usuario de cada red (WhatsApp: número; el servidor lo guarda en privado). */
  socials?: Partial<Record<SocialNetwork, string>>;
}

export const api = {
  saveProfile: call<ProfileInput, { ok: boolean; age: number }>('saveProfile'),
  getCandidates: call<Record<string, never>, { candidates: Candidate[] }>('getCandidates'),
  swipe: call<{ targetId: string; action: 'like' | 'pass'; intent?: 'friendship' | 'date' }, { matched: boolean; matchId?: string; score?: number }>('swipe'),
  blockUser: call<{ targetId: string }, { ok: boolean }>('blockUser'),
  reportUser: call<{ targetId: string; category: string; details?: string; matchId?: string }, { ok: boolean }>('reportUser'),
  requestVerification: call<Record<string, never>, { ok: boolean }>('requestVerification'),
  deleteAccount: call<Record<string, never>, { ok: boolean }>('deleteAccount'),
  createCheckoutSession: call<{ plan: Plan }, { url: string }>('createCheckoutSession'),
  createPortalSession: call<Record<string, never>, { url: string }>('createPortalSession'),
};
