'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut as fbSignOut,
  type User,
} from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '@/lib/firebase';
import { registerPush } from '@/lib/platform/push';
import { DEMO, DEMO_ENTITLEMENT, DEMO_PROFILE, DEMO_UID } from '@/lib/demo';
import type { Entitlement, UserProfile } from '@/lib/types';

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  entitlement: Entitlement | null;
  /** `true` hasta conocer sesión + perfil (evita parpadeos en las rutas protegidas). */
  loading: boolean;
  signUp(email: string, password: string): Promise<void>;
  signIn(email: string, password: string): Promise<void>;
  resetPassword(email: string): Promise<void>;
  signOut(): Promise<void>;
}

const Ctx = createContext<AuthState | null>(null);

const DEMO_VALUE: AuthState = {
  user: { uid: DEMO_UID, email: 'demo@klick.app' } as User,
  profile: DEMO_PROFILE,
  entitlement: DEMO_ENTITLEMENT,
  loading: false,
  signUp: async () => undefined,
  signIn: async () => undefined,
  resetPassword: async () => undefined,
  signOut: async () => undefined,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  if (DEMO) return <Ctx.Provider value={DEMO_VALUE}>{children}</Ctx.Provider>;
  return <FirebaseAuthProvider>{children}</FirebaseAuthProvider>;
}

function FirebaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [entitlement, setEntitlement] = useState<Entitlement | null>(null);
  const [authReady, setAuthReady] = useState(!isFirebaseConfigured);
  const [profileReady, setProfileReady] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setProfileReady(!u);
      setAuthReady(true);
    });
  }, []);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setEntitlement(null);
      return;
    }
    const unsubProfile = onSnapshot(
      doc(db, 'users', user.uid),
      (s) => {
        setProfile(s.exists() ? (s.data() as UserProfile) : null);
        setProfileReady(true);
      },
      () => setProfileReady(true),
    );
    const unsubEnt = onSnapshot(doc(db, 'entitlements', user.uid), (s) =>
      setEntitlement(s.exists() ? (s.data() as Entitlement) : null),
    );
    return () => {
      unsubProfile();
      unsubEnt();
    };
  }, [user]);

  const onboarded = profile?.onboarded === true;
  useEffect(() => {
    if (user && onboarded) void registerPush(user.uid, (d) => {
      if (d.matchId) window.location.assign(`/app/chat/?id=${encodeURIComponent(d.matchId)}`);
    });
  }, [user, onboarded]);

  const value = useMemo<AuthState>(
    () => ({
      user,
      profile,
      entitlement,
      loading: !authReady || !profileReady,
      signUp: async (e, p) => void (await createUserWithEmailAndPassword(auth, e, p)),
      signIn: async (e, p) => void (await signInWithEmailAndPassword(auth, e, p)),
      resetPassword: (e) => sendPasswordResetEmail(auth, e),
      signOut: () => fbSignOut(auth),
    }),
    [user, profile, entitlement, authReady, profileReady],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return v;
}
