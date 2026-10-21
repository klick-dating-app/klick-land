'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { collection, doc, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { DEMO, DEMO_MATCHES, demoStore } from '@/lib/demo';
import type { Match, Message, SafeDate } from '@/lib/types';

const withId = <T,>(d: { id: string; data(): unknown }) => ({ id: d.id, ...(d.data() as object) }) as T;

/** Matches activos del usuario, ordenados por último mensaje. `null` = cargando. */
export function useMatches(uid?: string) {
  const [matches, setMatches] = useState<Match[] | null>(null);
  useEffect(() => {
    if (DEMO) return setMatches(DEMO_MATCHES);
    if (!uid) return;
    const q = query(collection(db, 'matches'), where('members', 'array-contains', uid), orderBy('lastMessageAt', 'desc'));
    return onSnapshot(q, (s) => setMatches(s.docs.map((d) => withId<Match>(d)).filter((m) => m.status === 'active')), () => setMatches([]));
  }, [uid]);
  return matches;
}

/** Un match concreto; `missing` es true si no existe o no hay permiso. */
export function useMatch(id?: string | null) {
  const [match, setMatch] = useState<Match | null>(null);
  const [missing, setMissing] = useState(false);
  useEffect(() => {
    if (DEMO) return setMatch(DEMO_MATCHES.find((m) => m.id === id) ?? null);
    if (!id) return setMatch(null);
    return onSnapshot(
      doc(db, 'matches', id),
      (s) => (s.exists() ? (setMatch(withId<Match>(s)), setMissing(false)) : setMissing(true)),
      () => setMissing(true),
    );
  }, [id]);
  return { match, missing };
}

/** Últimos `max` mensajes del chat en tiempo real. */
export function useMessages(matchId?: string | null, max = 200) {
  const [messages, setMessages] = useState<Message[]>([]);
  const demoMsgs = useSyncExternalStore(demoStore.subscribe, () => demoStore.messages, () => demoStore.messages);
  useEffect(() => {
    if (DEMO || !matchId) return;
    const q = query(collection(db, `matches/${matchId}/messages`), orderBy('createdAt'));
    return onSnapshot(q, (s) => setMessages(s.docs.slice(-max).map((d) => withId<Message>(d))));
  }, [matchId, max]);
  return DEMO ? (demoMsgs[matchId ?? ''] ?? []) : messages;
}

export function useSafeDates(uid?: string) {
  const [dates, setDates] = useState<SafeDate[] | null>(null);
  const demoDates = useSyncExternalStore(demoStore.subscribe, () => demoStore.dates, () => demoStore.dates);
  useEffect(() => {
    if (DEMO) return;
    if (!uid) return;
    const q = query(collection(db, 'safeDates'), where('participants', 'array-contains', uid), orderBy('dateTimeMs'));
    return onSnapshot(q, (s) => setDates(s.docs.map((d) => withId<SafeDate>(d))), () => setDates([]));
  }, [uid]);
  return DEMO ? demoDates : dates;
}

export function useVerificationStatus(uid?: string) {
  const [status, setStatus] = useState<'none' | 'pending' | 'approved' | 'rejected'>('none');
  useEffect(() => {
    if (!uid) return;
    return onSnapshot(doc(db, 'verifications', uid), (s) => setStatus(s.exists() ? s.data().status : 'none'), () => undefined);
  }, [uid]);
  return status;
}
