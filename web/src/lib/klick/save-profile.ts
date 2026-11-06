import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { api, type ProfileInput } from '@/lib/api';
import { getApproxLocation } from '@/lib/platform/location';
import type { Questionnaire } from '@/lib/types';

/** Lo que junta el onboarding (pasos con textos en inglés de la UI). */
export interface OnboardingData {
  firstName: string;
  lastName: string;
  birthday: string;
  gender: string;
  city: string;
  state: string;
  photos: string[];
  icebreakers: Record<string, string>;
  preferences: Record<string, unknown>;
}

// Si el usuario no comparte ubicación, se usa el centro de Salt Lake City (el servidor redondea a ~1 km igualmente).
const FALLBACK_COORDS = { lat: 40.7608, lng: -111.891 };

const pick = <T extends string>(value: unknown, map: Record<string, T>, fallback: T): T =>
  (typeof value === 'string' && map[value]) || fallback;

const numbers = (value: unknown) => (typeof value === 'string' ? value.match(/\d+/g)?.map(Number) ?? [] : []);
const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
const csv = (value: unknown) =>
  typeof value === 'string' ? value.split(/,|&/).map((s) => s.trim()).filter(Boolean).slice(0, 20) : [];

/** Traduce las opciones del paso de preferencias a los valores que valida `saveProfile`. */
export function toQuestionnaire(p: Record<string, unknown>): Questionnaire {
  const [minRaw = 21, maxRaw = 35] = numbers(p.ageRange);
  const minAge = clamp(minRaw, 18, 99);
  const maxAge = clamp(Math.max(maxRaw, minAge), minAge, 99);
  const wantsMarriage = p.relationshipGoal === 'Marriage';

  return {
    faith: 'LDS',
    faithImportance: pick(p.templeImportance, { 'Very important': 'Very important', Important: 'Important', Flexible: 'Flexible' }, 'Important'),
    templeRecommend: pick(p.templeRecommend, { Active: 'Sí', 'In progress': 'En proceso', 'Not right now': 'No' }, 'Prefiero no indicar'),
    templeMarriageRequirement: pick(p.templeImportance, { 'Very important': 'Indispensable', Important: 'Preferred', Flexible: 'Flexible' }, 'Preferred'),
    servedMission: pick(p.servedMission, { Yes: 'Sí', No: 'No', Planning: 'Planeando' }, ''),
    maritalStatus: 'Soltero/a',
    seekingMarriage: wantsMarriage,
    marriageTimeline: pick(p.marriageTimeline, { '< 1 year': '<1 año', '1 – 2 years': '1-2 años', 'No rush': 'Flexible' }, 'Flexible'),
    marriageIndispensable: wantsMarriage,
    hasChildren: p.childrenGoal === 'Already have',
    wantsChildren: pick(p.childrenGoal, { 'Want children': 'Sí', 'Already have': 'Sí', 'Not sure yet': 'No seguro' }, 'No seguro'),
    acceptsPartnerWithChildren: 'Flexible',
    familyIndispensable: false,
    languages: csv(p.languages).length ? csv(p.languages) : ['English'],
    lifestyleRoutine: [],
    occupation: '',
    communicationStyle: 'Balanced',
    hobbies: csv(p.interests),
    sports: [],
    preferredDateTypes: p.safeFirstDate === false ? [] : ['Safe public place'],
    minAge,
    maxAge,
    maxDistanceMiles: clamp(numbers(p.maxDistance)[0] ?? 50, 5, 500),
  };
}

/** Reduce la foto a ≤1600 px en JPEG (las reglas de Storage limitan a 5 MB). */
async function toJpeg(dataUrl: string): Promise<Blob> {
  const img = new Image();
  img.src = dataUrl;
  await img.decode();
  const scale = Math.min(1, 1600 / Math.max(img.naturalWidth, img.naturalHeight));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.naturalWidth * scale);
  canvas.height = Math.round(img.naturalHeight * scale);
  canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('No se pudo procesar la foto.'))), 'image/jpeg', 0.85),
  );
}

export const imagePhotos = (photos: string[]) => photos.filter((p) => p.startsWith('data:image/'));

async function uploadPhotos(uid: string, photos: string[]): Promise<string[]> {
  const stamp = Date.now();
  return Promise.all(
    imagePhotos(photos)
      .slice(0, 6)
      .map(async (dataUrl, i) => {
        const fileRef = ref(storage, `profiles/${uid}/${stamp}-${i}.jpg`);
        await uploadBytes(fileRef, await toJpeg(dataUrl), { contentType: 'image/jpeg' });
        return getDownloadURL(fileRef);
      }),
  );
}

async function locate() {
  try {
    return await Promise.race([
      getApproxLocation(),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), 8000)),
    ]);
  } catch {
    return FALLBACK_COORDS;
  }
}

/** Sube las fotos y crea el perfil vía la callable `saveProfile` (el cliente no escribe `users/`). */
export async function saveOnboardingProfile(uid: string, data: OnboardingData) {
  const gender = data.gender === 'Mujer' || data.gender === 'Woman' ? 'female' : 'male';
  const [photos, coords] = await Promise.all([uploadPhotos(uid, data.photos), locate()]);
  const bio = Object.values(data.icebreakers ?? {}).filter(Boolean).join('\n').slice(0, 500);

  const input: ProfileInput = {
    name: data.firstName,
    dob: data.birthday,
    gender,
    interestedIn: gender === 'male' ? 'female' : 'male',
    city: data.city,
    state: data.state,
    lat: coords.lat,
    lng: coords.lng,
    photos,
    bio,
    questionnaire: toQuestionnaire(data.preferences ?? {}),
  };
  return api.saveProfile(input);
}
