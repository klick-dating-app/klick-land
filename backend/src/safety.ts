import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { FieldValue } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';
import { db, requireUid, requireAdmin, matchIdFor, str } from './lib/common';

const REPORT_CATEGORIES = ['fake_profile', 'harassment', 'inappropriate_content', 'scam', 'underage', 'safety_threat', 'other'];
const AUTO_RESTRICT_AT = 3;

async function applyBlock(uid: string, targetId: string) {
  await db().doc(`users/${uid}/blocks/${targetId}`).set({ blockerUid: uid, blockedUid: targetId, at: FieldValue.serverTimestamp() });
  const m = db().doc(`matches/${matchIdFor(uid, targetId)}`);
  if ((await m.get()).exists) await m.update({ status: 'blocked' });
}

export const blockUser = onCall(async (req) => {
  const uid = requireUid(req);
  const targetId = str(req.data?.targetId, 128, 'targetId');
  if (targetId === uid) throw new HttpsError('invalid-argument', 'No puedes bloquearte a ti mismo.');
  await applyBlock(uid, targetId);
  return { ok: true };
});

export const unblockUser = onCall(async (req) => {
  const uid = requireUid(req);
  await db().doc(`users/${uid}/blocks/${str(req.data?.targetId, 128, 'targetId')}`).delete();
  return { ok: true };
});

/** Crea un ticket de reporte, bloquea al usuario y restringe tras reportes de varias personas. */
export const reportUser = onCall(async (req) => {
  const uid = requireUid(req);
  const targetId = str(req.data?.targetId, 128, 'targetId');
  const category = str(req.data?.category, 40, 'category');
  if (!REPORT_CATEGORIES.includes(category) || targetId === uid) {
    throw new HttpsError('invalid-argument', 'Reporte inválido.');
  }
  await db().collection('reports').add({
    reporterUid: uid,
    targetUid: targetId,
    category,
    details: str(req.data?.details ?? '', 1000, 'details'),
    matchId: typeof req.data?.matchId === 'string' ? req.data.matchId : null,
    status: 'open',
    createdAt: FieldValue.serverTimestamp(),
  });
  await applyBlock(uid, targetId);

  const reporters = new Set(
    (await db().collection('reports').where('targetUid', '==', targetId).get()).docs.map((d) => d.data().reporterUid),
  );
  if (reporters.size >= AUTO_RESTRICT_AT) {
    await db().doc(`users/${targetId}`).update({ safetyStatus: 'restricted' });
  }
  return { ok: true };
});

/** El usuario subió un selfie a `verification/{uid}/selfie.jpg`; queda en cola de revisión. */
export const requestVerification = onCall(async (req) => {
  const uid = requireUid(req);
  const [exists] = await getStorage().bucket().file(`verification/${uid}/selfie.jpg`).exists();
  if (!exists) throw new HttpsError('failed-precondition', 'Sube tu selfie de verificación primero.');
  await db().doc(`verifications/${uid}`).set({ status: 'pending', requestedAt: FieldValue.serverTimestamp() });
  return { ok: true };
});

export const adminReviewVerification = onCall(async (req) => {
  const admin = requireAdmin(req);
  const uid = str(req.data?.uid, 128, 'uid');
  const approve = req.data?.approve === true;
  await db().doc(`verifications/${uid}`).set(
    { status: approve ? 'approved' : 'rejected', reviewedBy: admin, reviewedAt: FieldValue.serverTimestamp() },
    { merge: true },
  );
  await db().doc(`users/${uid}`).update({ verified: approve, safetyStatus: approve ? 'verified' : 'pending' });
  if (approve) await getStorage().bucket().file(`verification/${uid}/selfie.jpg`).delete({ ignoreNotFound: true });
  return { ok: true };
});

export const adminResolveReport = onCall(async (req) => {
  const admin = requireAdmin(req);
  const reportId = str(req.data?.reportId, 128, 'reportId');
  const action = str(req.data?.action, 20, 'action'); // dismiss | restrict | ban
  const ref = db().doc(`reports/${reportId}`);
  const snap = await ref.get();
  if (!snap.exists) throw new HttpsError('not-found', 'Reporte no encontrado.');
  const target = snap.data()!.targetUid as string;
  if (action === 'restrict') await db().doc(`users/${target}`).update({ safetyStatus: 'restricted' });
  if (action === 'ban') {
    await db().doc(`users/${target}`).update({ safetyStatus: 'blocked' });
    await getAuth().updateUser(target, { disabled: true });
  }
  await ref.update({ status: 'resolved', action, resolvedBy: admin, resolvedAt: FieldValue.serverTimestamp() });
  return { ok: true };
});

/** Derecho al olvido: borra perfil, fotos, swipes, chats y la cuenta de Auth. */
export const deleteAccount = onCall(async (req) => {
  const uid = requireUid(req);
  const matches = await db().collection('matches').where('members', 'array-contains', uid).get();
  for (const m of matches.docs) await db().recursiveDelete(m.ref);
  const dates = await db().collection('safeDates').where('participants', 'array-contains', uid).get();
  for (const d of dates.docs) await db().recursiveDelete(d.ref);
  await Promise.all([
    db().recursiveDelete(db().doc(`users/${uid}`)),
    db().doc(`entitlements/${uid}`).delete(),
    db().doc(`billing/${uid}`).delete(),
    db().doc(`verifications/${uid}`).delete(),
    getStorage().bucket().deleteFiles({ prefix: `profiles/${uid}/` }),
    getStorage().bucket().deleteFiles({ prefix: `verification/${uid}/` }),
  ]);
  await getAuth().deleteUser(uid);
  return { ok: true };
});
