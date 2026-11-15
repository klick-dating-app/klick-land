import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { FieldValue } from 'firebase-admin/firestore';
import { db, requireUid, str, entitlementFor } from './lib/common';
import { ageFromDob, roundCoord } from './lib/geo';
import {
  CHILDREN_STATUS,
  CHURCH_ATTENDANCE,
  CHURCH_IMPORTANCE,
  CORE_VALUES,
  CULTURES,
  EDUCATION_LEVELS,
  IMPORTANCE_LEVELS,
  LANGUAGE_IMPORTANCE,
  MARITAL_STATUS,
  PARTNER_LANGUAGES,
  RELATIONSHIP_GOALS,
  SOCIAL_NETWORKS,
  SPIRITUAL_EXPECTATIONS,
  VALUE_KEYS,
  VALUE_PRIORITY,
  VERIFIED_ONLY,
  YES_NO_MAYBE,
  type Gender,
  type SocialNetwork,
  type Questionnaire,
  type ValueKey,
  type ValuePriority,
} from './lib/types';

const list = (v: unknown, max = 20): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string').slice(0, max).map((s) => s.slice(0, 60)) : [];
const bool = (v: unknown) => v === true;
const oneOf = <T extends string>(v: unknown, opts: readonly T[], field: string): T => {
  if (typeof v !== 'string' || !opts.includes(v as T)) throw new HttpsError('invalid-argument', `Valor inválido: ${field}`);
  return v as T;
};
/** Campo opcional: ausente → undefined; presente pero fuera de la lista → error. */
const maybeOneOf = <T extends string>(v: unknown, opts: readonly T[], field: string): T | undefined =>
  v === undefined || v === null || v === '' ? undefined : oneOf(v, opts, field);
/** Lista opcional: se quedan solo las opciones conocidas (sin duplicados). */
const listOf = (v: unknown, opts: readonly string[]): string[] | undefined =>
  Array.isArray(v) ? [...new Set(v.filter((x): x is string => typeof x === 'string' && opts.includes(x)))] : undefined;
const priorities = (v: unknown): Partial<Record<ValueKey, ValuePriority>> | undefined => {
  if (!v || typeof v !== 'object') return undefined;
  const out: Partial<Record<ValueKey, ValuePriority>> = {};
  for (const key of VALUE_KEYS) {
    const p = (v as Record<string, unknown>)[key];
    if (typeof p === 'string' && (VALUE_PRIORITY as readonly string[]).includes(p)) out[key] = p as ValuePriority;
  }
  return out;
};
/**
 * Redes sociales: solo el usuario (o el número de WhatsApp), nunca una URL libre,
 * para que la app arme enlaces a los dominios oficiales y no se cuelen enlaces maliciosos.
 */
const socials = (v: unknown): Partial<Record<SocialNetwork, string>> => {
  const out: Partial<Record<SocialNetwork, string>> = {};
  if (!v || typeof v !== 'object') return out;
  for (const net of SOCIAL_NETWORKS) {
    const raw = (v as Record<string, unknown>)[net];
    if (typeof raw !== 'string' || !raw.trim()) continue;
    const value = raw.trim().replace(/^@/, '');
    const ok = net === 'whatsapp' ? /^\+?\d{7,15}$/.test(value.replace(/[\s()-]/g, '')) : /^[A-Za-z0-9._-]{1,50}$/.test(value);
    if (!ok) throw new HttpsError('invalid-argument', `Usuario inválido: ${net}`);
    out[net] = net === 'whatsapp' ? value.replace(/[\s()-]/g, '') : value;
  }
  return out;
};
/** Firestore no acepta `undefined`: se omiten los campos opcionales sin respuesta. */
const compact = <T extends object>(o: T): T =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined)) as T;
const num = (v: unknown, min: number, max: number, field: string) => {
  if (typeof v !== 'number' || !Number.isFinite(v) || v < min || v > max) {
    throw new HttpsError('invalid-argument', `Valor inválido: ${field}`);
  }
  return v;
};

/**
 * Crea o actualiza el perfil. Género y fecha de nacimiento se fijan una sola vez
 * (la edad se calcula en el servidor; nunca se confía en el cliente).
 */
export const saveProfile = onCall(async (req) => {
  const uid = requireUid(req);
  const d = (req.data ?? {}) as Record<string, any>;
  const userRef = db().doc(`users/${uid}`);
  const privRef = db().doc(`users/${uid}/private/info`);
  const [userSnap, privSnap] = await Promise.all([userRef.get(), privRef.get()]);
  const existing = userSnap.data();

  let dob: string = privSnap.data()?.dob;
  let gender: Gender = existing?.gender;
  if (!dob) {
    dob = str(d.dob, 10, 'dob');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dob) || Number.isNaN(Date.parse(dob))) {
      throw new HttpsError('invalid-argument', 'Fecha de nacimiento inválida.');
    }
  }
  const age = ageFromDob(dob);
  if (age < 21) throw new HttpsError('failed-precondition', 'Debes ser mayor de 21 años.');
  if (!gender) gender = oneOf(d.gender, ['male', 'female'] as const, 'gender');

  const photos = list(d.photos, 6).filter((u) => u.startsWith('https://') && u.includes(`profiles%2F${uid}%2F`));
  if (photos.length < 1) throw new HttpsError('invalid-argument', 'Sube al menos una foto.');

  const q = d.questionnaire ?? {};
  const minAge = num(q.minAge, 21, 99, 'minAge');
  const maxAge = num(q.maxAge, minAge, 99, 'maxAge');
  const questionnaire: Questionnaire = compact({
    faith: str(q.faith, 40, 'faith'),
    faithImportance: oneOf(q.faithImportance, ['Very important', 'Important', 'Flexible'] as const, 'faithImportance'),
    templeRecommend: oneOf(q.templeRecommend, ['Sí', 'En proceso', 'No', 'Prefiero no indicar'] as const, 'templeRecommend'),
    templeMarriageRequirement: oneOf(q.templeMarriageRequirement, ['Indispensable', 'Preferred', 'Flexible'] as const, 'templeMarriageRequirement'),
    servedMission: str(q.servedMission ?? '', 40, 'servedMission'),
    maritalStatus: str(q.maritalStatus, 40, 'maritalStatus'),
    seekingMarriage: bool(q.seekingMarriage),
    marriageTimeline: oneOf(q.marriageTimeline, ['<1 año', '1-2 años', '2-3 años', '2+ años', 'Persona correcta', 'Flexible'] as const, 'marriageTimeline'),
    marriageIndispensable: bool(q.marriageIndispensable),
    hasChildren: q.childrenStatus ? q.childrenStatus !== 'No' : bool(q.hasChildren),
    wantsChildren: oneOf(q.wantsChildren, ['Sí', 'No', 'Tal vez', 'No seguro'] as const, 'wantsChildren'),
    acceptsPartnerWithChildren: oneOf(q.acceptsPartnerWithChildren, ['Sí', 'No', 'Flexible'] as const, 'acceptsPartnerWithChildren'),
    familyIndispensable: bool(q.familyIndispensable),
    languages: list(q.languages),
    lifestyleRoutine: list(q.lifestyleRoutine),
    occupation: str(q.occupation ?? '', 80, 'occupation'),
    communicationStyle: str(q.communicationStyle, 40, 'communicationStyle'),
    hobbies: list(q.hobbies),
    sports: list(q.sports),
    preferredDateTypes: list(q.preferredDateTypes),
    minAge,
    maxAge,
    maxDistanceMiles: num(q.maxDistanceMiles, 5, 500, 'maxDistanceMiles'),

    churchImportance: maybeOneOf(q.churchImportance, CHURCH_IMPORTANCE, 'churchImportance'),
    churchAttendance: maybeOneOf(q.churchAttendance, CHURCH_ATTENDANCE, 'churchAttendance'),
    partnerTempleImportance: maybeOneOf(q.partnerTempleImportance, IMPORTANCE_LEVELS, 'partnerTempleImportance'),
    spiritualExpectations: listOf(q.spiritualExpectations, SPIRITUAL_EXPECTATIONS),
    relationshipGoals: listOf(q.relationshipGoals, RELATIONSHIP_GOALS),
    partnerLanguages: listOf(q.partnerLanguages, PARTNER_LANGUAGES),
    languageImportance: maybeOneOf(q.languageImportance, LANGUAGE_IMPORTANCE, 'languageImportance'),
    culturalBackground: maybeOneOf(q.culturalBackground, CULTURES, 'culturalBackground'),
    culturePreferences: listOf(q.culturePreferences, CULTURES),
    verifiedOnly: maybeOneOf(q.verifiedOnly, VERIFIED_ONLY, 'verifiedOnly'),
    childrenStatus: maybeOneOf(q.childrenStatus, CHILDREN_STATUS, 'childrenStatus'),
    openToLongDistance: maybeOneOf(q.openToLongDistance, YES_NO_MAYBE, 'openToLongDistance'),
    valuePriorities: priorities(q.valuePriorities),
    coreValues: listOf(q.coreValues, CORE_VALUES),
    education: maybeOneOf(q.education, EDUCATION_LEVELS, 'education'),
    heightCm: q.heightCm === undefined ? undefined : num(q.heightCm, 120, 230, 'heightCm'),
    safeFirstDate: q.safeFirstDate === undefined ? undefined : bool(q.safeFirstDate),
    minCompatibility: q.minCompatibility === undefined ? undefined : num(q.minCompatibility, 0, 100, 'minCompatibility'),
  });
  // Estado civil: se acepta cualquier valor anterior, pero los nuevos registros eligen de la lista.
  if (!questionnaire.maritalStatus) questionnaire.maritalStatus = MARITAL_STATUS[0];

  const links = socials(d.socials);
  const profile = {
    name: str(d.name, 40, 'name'),
    age,
    gender,
    interestedIn: oneOf(d.interestedIn, ['male', 'female'] as const, 'interestedIn'),
    city: str(d.city, 60, 'city'),
    state: str(d.state, 40, 'state'),
    lat: roundCoord(num(d.lat, -90, 90, 'lat')),
    lng: roundCoord(num(d.lng, -180, 180, 'lng')),
    photos,
    bio: str(d.bio ?? '', 500, 'bio'),
    // WhatsApp es un número de teléfono: va al documento privado (hoja "Seguridad": nunca mostrar el número).
    socials: Object.fromEntries(Object.entries(links).filter(([net]) => net !== 'whatsapp')),
    onboarded: true,
    updatedAt: FieldValue.serverTimestamp(),
  };

  const batch = db().batch();
  if (existing) {
    batch.update(userRef, profile);
  } else {
    batch.set(userRef, { ...profile, verified: false, safetyStatus: 'pending', createdAt: FieldValue.serverTimestamp() });
    batch.set(db().doc(`entitlements/${uid}`), entitlementFor(gender, 'free'));
  }
  batch.set(privRef, { dob, email: req.auth?.token.email ?? null, whatsapp: links.whatsapp ?? null }, { merge: true });
  batch.set(db().doc(`users/${uid}/restricted/details`), questionnaire);
  await batch.commit();
  return { ok: true, age };
});
