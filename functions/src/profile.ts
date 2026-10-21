import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { FieldValue } from 'firebase-admin/firestore';
import { db, requireUid, str, entitlementFor } from './lib/common';
import { ageFromDob, roundCoord } from './lib/geo';
import type { Gender, Questionnaire } from './lib/types';

const list = (v: unknown, max = 20): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string').slice(0, max).map((s) => s.slice(0, 60)) : [];
const bool = (v: unknown) => v === true;
const oneOf = <T extends string>(v: unknown, opts: readonly T[], field: string): T => {
  if (typeof v !== 'string' || !opts.includes(v as T)) throw new HttpsError('invalid-argument', `Valor inválido: ${field}`);
  return v as T;
};
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
  if (age < 18) throw new HttpsError('failed-precondition', 'Debes ser mayor de 18 años.');
  if (!gender) gender = oneOf(d.gender, ['male', 'female'] as const, 'gender');

  const photos = list(d.photos, 6).filter((u) => u.startsWith('https://') && u.includes(`profiles%2F${uid}%2F`));
  if (photos.length < 1) throw new HttpsError('invalid-argument', 'Sube al menos una foto.');

  const q = d.questionnaire ?? {};
  const minAge = num(q.minAge, 18, 99, 'minAge');
  const maxAge = num(q.maxAge, minAge, 99, 'maxAge');
  const questionnaire: Questionnaire = {
    faith: str(q.faith, 40, 'faith'),
    faithImportance: oneOf(q.faithImportance, ['Very important', 'Important', 'Flexible'] as const, 'faithImportance'),
    templeRecommend: oneOf(q.templeRecommend, ['Sí', 'En proceso', 'No', 'Prefiero no indicar'] as const, 'templeRecommend'),
    templeMarriageRequirement: oneOf(q.templeMarriageRequirement, ['Indispensable', 'Preferred', 'Flexible'] as const, 'templeMarriageRequirement'),
    servedMission: str(q.servedMission ?? '', 40, 'servedMission'),
    maritalStatus: str(q.maritalStatus, 40, 'maritalStatus'),
    seekingMarriage: bool(q.seekingMarriage),
    marriageTimeline: oneOf(q.marriageTimeline, ['<1 año', '1-2 años', '2+ años', 'Flexible'] as const, 'marriageTimeline'),
    marriageIndispensable: bool(q.marriageIndispensable),
    hasChildren: bool(q.hasChildren),
    wantsChildren: oneOf(q.wantsChildren, ['Sí', 'No', 'No seguro'] as const, 'wantsChildren'),
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
  };

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
  batch.set(privRef, { dob, email: req.auth?.token.email ?? null }, { merge: true });
  batch.set(db().doc(`users/${uid}/restricted/details`), questionnaire);
  await batch.commit();
  return { ok: true, age };
});
