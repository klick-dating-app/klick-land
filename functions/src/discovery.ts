import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { FieldValue } from 'firebase-admin/firestore';
import { db, requireUid, matchIdFor, pushTo } from './lib/common';
import { compatibility, type Subject } from './lib/compat';
import { distanceMiles } from './lib/geo';
import type { Candidate, PublicProfile, Questionnaire } from './lib/types';

async function loadSubject(uid: string): Promise<Subject | undefined> {
  const [u, q] = await Promise.all([db().doc(`users/${uid}`).get(), db().doc(`users/${uid}/restricted/details`).get()]);
  if (!u.exists || !q.exists) return undefined;
  return { profile: u.data() as PublicProfile, q: q.data() as Questionnaire };
}

/** Candidatos puntuados: aplica puertas de seguridad/compatibilidad y la regla del 60 %. */
export const getCandidates = onCall(async (req) => {
  const uid = requireUid(req);
  const me = await loadSubject(uid);
  if (!me?.profile.onboarded) throw new HttpsError('failed-precondition', 'Completa tu perfil primero.');

  const [swiped, blocked, blockedBy, pool] = await Promise.all([
    db().collection(`users/${uid}/swipes`).get(),
    db().collection(`users/${uid}/blocks`).get(),
    db().collectionGroup('blocks').where('blockedUid', '==', uid).get(),
    db().collection('users')
      .where('onboarded', '==', true)
      .where('gender', '==', me.profile.interestedIn)
      .where('interestedIn', '==', me.profile.gender)
      .limit(300)
      .get(),
  ]);
  const skip = new Set<string>([
    uid,
    ...swiped.docs.map((d) => d.id),
    ...blocked.docs.map((d) => d.id),
    ...blockedBy.docs.map((d) => d.ref.parent.parent!.id),
  ]);

  const out: Candidate[] = [];
  // Una sola lectura en lote del cuestionario de todos los candidatos (en vez de N lecturas).
  const pending = pool.docs.filter((d) => !skip.has(d.id));
  const details = pending.length
    ? await db().getAll(...pending.map((d) => db().doc(`users/${d.id}/restricted/details`)))
    : [];
  const subjects = pending.map((d, i) =>
    details[i].exists
      ? { uid: d.id, s: { profile: d.data() as PublicProfile, q: details[i].data() as Questionnaire } }
      : null,
  );
  for (const item of subjects) {
    if (!item) continue;
    const r = compatibility(me, item.s);
    if (!r.eligible) continue;
    const p = item.s.profile;
    out.push({
      uid: item.uid,
      name: p.name,
      age: p.age,
      city: p.city,
      state: p.state,
      distanceMiles: distanceMiles(me.profile.lat, me.profile.lng, p.lat, p.lng),
      photos: p.photos,
      bio: p.bio,
      verified: p.verified,
      score: r.score,
      commonGround: r.commonGround,
    });
  }
  out.sort((a, b) => b.score - a.score);
  return { candidates: out.slice(0, 40) };
});

/** Like / pass. Si hay like mutuo se crea el match y se notifica a ambos. */
export const swipe = onCall(async (req) => {
  const uid = requireUid(req);
  const { targetId, action } = (req.data ?? {}) as { targetId?: string; action?: 'like' | 'pass' };
  if (!targetId || targetId === uid || (action !== 'like' && action !== 'pass')) {
    throw new HttpsError('invalid-argument', 'Solicitud inválida.');
  }
  const [me, other] = await Promise.all([loadSubject(uid), loadSubject(targetId)]);
  if (!me || !other) throw new HttpsError('not-found', 'Perfil no disponible.');
  const r = compatibility(me, other);
  if (!r.eligible) throw new HttpsError('failed-precondition', 'Este perfil no es compatible.');

  await db().doc(`users/${uid}/swipes/${targetId}`).set({ action, at: FieldValue.serverTimestamp() });
  if (action === 'pass') return { matched: false };

  const reciprocal = await db().doc(`users/${targetId}/swipes/${uid}`).get();
  if (reciprocal.data()?.action !== 'like') return { matched: false };

  const matchId = matchIdFor(uid, targetId);
  await db().doc(`matches/${matchId}`).set({
    members: [uid, targetId],
    profiles: {
      [uid]: { name: me.profile.name, photo: me.profile.photos[0] ?? null },
      [targetId]: { name: other.profile.name, photo: other.profile.photos[0] ?? null },
    },
    score: r.score,
    commonGround: r.commonGround,
    status: 'active',
    createdAt: FieldValue.serverTimestamp(),
    lastMessage: null,
    lastMessageAt: FieldValue.serverTimestamp(),
  });
  await Promise.all([
    pushTo(uid, '¡Hicieron Klick!', `Tú y ${other.profile.name} son compatibles al ${r.score}%.`, { matchId }),
    pushTo(targetId, '¡Hicieron Klick!', `Tú y ${me.profile.name} son compatibles al ${r.score}%.`, { matchId }),
  ]);
  return { matched: true, matchId, score: r.score };
});
