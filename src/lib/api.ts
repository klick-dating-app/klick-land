import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';
import { DEMO, DEMO_CANDIDATES } from './demo';
import type { Candidate, Plan, Questionnaire } from './types';

const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));

/** En modo demo las llamadas se resuelven con datos de ejemplo. */
const demoResult = (name: string, data: any): unknown => {
  if (name === 'getCandidates') return { candidates: DEMO_CANDIDATES };
  if (name === 'swipe') return { matched: data.action === 'like' && data.targetId === 'c1', matchId: 'm1', score: 93 };
  if (name === 'saveProfile') return { ok: true, age: 29 };
  return { ok: true, url: '#' };
};

const call = <Req, Res>(name: string) => {
  const fn = DEMO ? null : httpsCallable<Req, Res>(functions, name);
  return async (data: Req) => {
    if (!fn) return delay().then(() => demoResult(name, data) as Res);
    return (await fn(data)).data;
  };
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
