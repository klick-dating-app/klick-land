import { HttpsError, type CallableRequest } from 'firebase-functions/v2/https';
import { getFirestore } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';
import type { Plan } from './types';

export const db = () => getFirestore();

export function requireUid(req: CallableRequest): string {
  if (!req.auth) throw new HttpsError('unauthenticated', 'Inicia sesión para continuar.');
  return req.auth.uid;
}

export function requireAdmin(req: CallableRequest): string {
  const uid = requireUid(req);
  if (req.auth?.token.admin !== true) throw new HttpsError('permission-denied', 'Solo administradores.');
  return uid;
}

export const matchIdFor = (a: string, b: string) => [a, b].sort().join('_');

export function str(v: unknown, max: number, field: string): string {
  if (typeof v !== 'string') throw new HttpsError('invalid-argument', `Campo inválido: ${field}`);
  const t = v.trim();
  if (t.length > max) throw new HttpsError('invalid-argument', `${field} demasiado largo`);
  return t;
}

export interface EntitlementDoc {
  plan: Plan;
  canChat: boolean;
  canViewDetails: boolean;
  status: 'active' | 'past_due' | 'canceled' | 'none';
  currentPeriodEnd?: number;
}

/** Regla de negocio: mujeres gratis y completas; hombres gratis solo exploran. */
export function entitlementFor(gender: 'male' | 'female', plan: Plan): EntitlementDoc {
  const paid = plan !== 'free';
  const full = gender === 'female' || paid;
  return {
    plan: gender === 'female' ? 'free' : plan,
    canChat: full,
    canViewDetails: full,
    status: paid ? 'active' : 'none',
  };
}

/** Envía un push a todos los dispositivos del usuario y limpia tokens inválidos. */
export async function pushTo(uid: string, title: string, body: string, data: Record<string, string> = {}) {
  const snap = await db().collection(`users/${uid}/devices`).get();
  if (snap.empty) return;
  const tokens = snap.docs.map((d) => d.id);
  const res = await getMessaging().sendEachForMulticast({
    tokens,
    notification: { title, body },
    data,
    apns: { payload: { aps: { sound: 'default' } } },
  });
  await Promise.all(
    res.responses.map((r, i) =>
      !r.success && /registration-token-not-registered|invalid-argument/.test(r.error?.code ?? '')
        ? snap.docs[i].ref.delete()
        : null,
    ),
  );
}
