import type { NextRequest } from 'next/server';
import { auth } from '@/backend/firebase/admin';

/** uid del token `Authorization: Bearer <Firebase ID token>`, o null. */
export async function uidFromRequest(request: NextRequest): Promise<{ uid: string; email?: string } | null> {
  const token = request.headers.get('authorization')?.match(/^Bearer (.+)$/)?.[1];
  if (!token || !auth) return null;
  try {
    const decoded = await auth.verifyIdToken(token);
    return { uid: decoded.uid, email: decoded.email };
  } catch {
    return null;
  }
}
