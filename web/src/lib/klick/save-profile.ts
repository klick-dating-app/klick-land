import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { api, type ProfileInput } from '@/lib/api';
import { getApproxLocation } from '@/lib/platform/location';
import {
  CHILDREN_STATUS,
  CHURCH_ATTENDANCE,
  CHURCH_IMPORTANCE,
  CULTURES,
  EDUCATION_LEVELS,
  IMPORTANCE_LEVELS,
  LANGUAGE_IMPORTANCE,
  RELATIONSHIP_GOALS,
  VERIFIED_ONLY,
  YES_NO_MAYBE,
  type Questionnaire,
} from '@/lib/types';

/** Lo que junta el onboarding (pasos con textos en inglés de la UI). */
export interface OnboardingData {
  firstName: string;
  lastName: string;
  birthday: string;
  gender: string;
  city: string;
  state: string;
  /** Texto de `BasicInfoStep` (`5' 10"` o `178 cm`). */
  height?: string;
  photos: string[];
  icebreakers: Record<string, string>;
  preferences: Record<string, unknown>;
}

// Si el usuario no comparte ubicación, se usa el centro de Salt Lake City (el servidor redondea a ~1 km igualmente).
const FALLBACK_COORDS = { lat: 40.7608, lng: -111.891 };

const pick = <T extends string>(value: unknown, map: Record<string, T>, fallback: T): T =>
  (typeof value === 'string' && map[value]) || fallback;
/** Valor tal cual si está en la lista; si no, undefined (campo sin responder). */
const oneOf = <T extends string>(value: unknown, opts: readonly T[]): T | undefined =>
  typeof value === 'string' && (opts as readonly string[]).includes(value) ? (value as T) : undefined;

const numbers = (value: unknown) => (typeof value === 'string' ? value.match(/\d+/g)?.map(Number) ?? [] : []);
const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
const csv = (value: unknown) =>
  typeof value === 'string' ? value.split(/,|&/).map((s) => s.trim()).filter(Boolean).slice(0, 20) : [];
/** Las respuestas nuevas llegan como lista; las anteriores como texto "A, B & C". */
const items = (value: unknown) =>
  Array.isArray(value) ? value.filter((x): x is string => typeof x === 'string').slice(0, 20) : csv(value);

/** `5' 10"` o `178 cm` → centímetros. */
export function heightToCm(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const cm = value.match(/^(\d{3})\s*cm$/);
  if (cm) return clamp(Number(cm[1]), 120, 230);
  const ft = value.match(/^(\d)'\s*(\d{1,2})/);
  return ft ? clamp(Math.round((Number(ft[1]) * 12 + Number(ft[2])) * 2.54), 120, 230) : undefined;
}

const SPORTS = new Set(['Pickleball', 'Fitness / Gym', 'Sports', 'Hiking']);

/** Traduce las opciones del paso de preferencias a los valores que valida `saveProfile`. */
export function toQuestionnaire(p: Record<string, unknown>, extra: { height?: string } = {}): Questionnaire {
  const [minParsed = 21, maxParsed = 35] = numbers(p.ageRange);
  const minRaw = typeof p.minAge === 'number' ? p.minAge : minParsed;
  const maxRaw = typeof p.maxAge === 'number' ? p.maxAge : maxParsed;
  const minAge = clamp(minRaw, 21, 99);
  const maxAge = clamp(Math.max(maxRaw, minAge), minAge, 99);

  const goals = items(p.relationshipGoals).filter((g): g is string => (RELATIONSHIP_GOALS as readonly string[]).includes(g));
  const wantsMarriage = goals.length ? goals.includes('Marriage') || goals.includes('Temple marriage') : p.relationshipGoal === 'Marriage';

  // "Importance in Partner": antes 3 niveles, ahora los 5 de la hoja. Se derivan también los campos anteriores.
  const partnerTemple = oneOf(p.templeImportance, IMPORTANCE_LEVELS);
  const church = oneOf(p.churchImportance, CHURCH_IMPORTANCE);
  const childrenStatus = oneOf(p.childrenStatus, CHILDREN_STATUS);
  const languages = items(p.languages).filter((l) => l !== 'English & Spanish');
  if (p.languages === 'English & Spanish') languages.push('English', 'Spanish');
  const interests = items(p.interests);
  const maxDistance = p.maxDistance === 'Anywhere' ? 500 : clamp(numbers(p.maxDistance)[0] ?? 50, 5, 500);
  const dateTypes = items(p.dateTypes);
  const priorities = (p.valuePriorities && typeof p.valuePriorities === 'object' ? p.valuePriorities : {}) as Questionnaire['valuePriorities'];

  return {
    faith: 'LDS',
    faithImportance: church
      ? pick(church, { 'Very important': 'Very important', Important: 'Important' }, 'Flexible')
      : pick(p.templeImportance, { 'Very important': 'Very important', Important: 'Important', Flexible: 'Flexible' }, 'Important'),
    templeRecommend: pick(p.templeRecommend, { Active: 'Sí', 'In progress': 'En proceso', 'Not right now': 'No' }, 'Prefiero no indicar'),
    templeMarriageRequirement: partnerTemple
      ? pick(partnerTemple, { Essential: 'Indispensable', 'Very important': 'Preferred', Preferred: 'Preferred' }, 'Flexible')
      : pick(p.templeImportance, { 'Very important': 'Indispensable', Important: 'Preferred', Flexible: 'Flexible' }, 'Preferred'),
    servedMission: pick(p.servedMission, { Yes: 'Sí', No: 'No', Planning: 'Planeando' }, ''),
    maritalStatus: pick(p.maritalStatus, { Single: 'Soltero/a', Divorced: 'Divorciado/a', Widowed: 'Viudo/a' }, 'Soltero/a'),
    seekingMarriage: wantsMarriage,
    marriageTimeline: pick(
      p.marriageTimeline,
      {
        '< 1 year': '<1 año',
        '1 – 2 years': '1-2 años',
        '2 – 3 years': '2-3 años',
        'When I find the right person': 'Persona correcta',
        'No set timeline': 'Flexible',
        'No rush': 'Flexible',
      },
      'Flexible',
    ),
    marriageIndispensable: wantsMarriage,
    hasChildren: childrenStatus ? childrenStatus !== 'No' : p.childrenGoal === 'Already have',
    wantsChildren: p.wantsChildren
      ? pick(p.wantsChildren, { Yes: 'Sí', No: 'No', Maybe: 'Tal vez', 'Not sure yet': 'No seguro' }, 'No seguro')
      : pick(p.childrenGoal, { 'Want children': 'Sí', 'Already have': 'Sí', 'Not sure yet': 'No seguro' }, 'No seguro'),
    acceptsPartnerWithChildren: pick(p.acceptsPartnerChildren, { Yes: 'Sí', No: 'No', Depends: 'Flexible' }, 'Flexible'),
    familyIndispensable: p.acceptsPartnerChildren === 'No',
    languages: languages.length ? [...new Set(languages)] : ['English'],
    lifestyleRoutine: items(p.lifestyle),
    occupation: typeof p.occupation === 'string' ? p.occupation.slice(0, 80) : '',
    communicationStyle: typeof p.communication === 'string' && p.communication ? p.communication : 'Balanced',
    hobbies: interests.filter((i) => !SPORTS.has(i)),
    sports: interests.filter((i) => SPORTS.has(i)),
    preferredDateTypes: p.safeFirstDate === false ? dateTypes : ['Safe public place', ...dateTypes],
    minAge,
    maxAge,
    maxDistanceMiles: maxDistance,

    churchImportance: church,
    churchAttendance: p.churchAttendance === 'Returning' ? 'Occasionally' : oneOf(p.churchAttendance, CHURCH_ATTENDANCE),
    partnerTempleImportance: partnerTemple,
    spiritualExpectations: items(p.spiritualExpectations),
    relationshipGoals: goals,
    partnerLanguages: items(p.partnerLanguages),
    languageImportance: oneOf(p.languageImportance, LANGUAGE_IMPORTANCE),
    culturalBackground: oneOf(p.culturalBackground, CULTURES),
    culturePreferences: items(p.culturePreferences),
    verifiedOnly: typeof p.onlyVerified === 'boolean' ? (p.onlyVerified ? 'Yes' : 'No') : oneOf(p.onlyVerified, VERIFIED_ONLY),
    childrenStatus,
    openToLongDistance: oneOf(p.longDistance, YES_NO_MAYBE),
    valuePriorities: priorities,
    coreValues: items(p.coreValues),
    education: oneOf(p.education, EDUCATION_LEVELS),
    heightCm: heightToCm(extra.height),
    safeFirstDate: p.safeFirstDate !== false,
    minCompatibility: typeof p.compatibilityMin === 'number' ? clamp(p.compatibilityMin, 0, 100) : undefined,
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
    questionnaire: toQuestionnaire(data.preferences ?? {}, { height: data.height }),
  };
  return api.saveProfile(input);
}
