'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
  OAuthProvider,
  onAuthStateChanged,
  type AuthProvider,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { toast } from 'sonner';
import KlickAuthFlow, { type AuthMode, type SocialProvider } from '@/components/klick/auth/KlickAuthFlow';
import { feedHref } from '@/lib/klick/routes';

const PROVIDERS: Record<Exclude<SocialProvider, 'phone'>, { name: string; create: () => AuthProvider }> = {
  google: { name: 'Google', create: () => new GoogleAuthProvider() },
  apple: { name: 'Apple', create: () => new OAuthProvider('apple.com') },
  microsoft: { name: 'Microsoft', create: () => new OAuthProvider('microsoft.com') },
  facebook: { name: 'Facebook', create: () => new FacebookAuthProvider() },
  x: { name: 'X', create: () => new TwitterAuthProvider() },
  github: { name: 'GitHub', create: () => new GithubAuthProvider() },
};

function WebLogin() {
  const searchParams = useSearchParams();
  const isRegisterParam = searchParams.get('register') === 'true';
  const isLoginParam = searchParams.get('mode') === 'login';
  const emailParam = searchParams.get('email') ?? undefined;

  const [mode, setMode] = useState<AuthMode | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isRegisterParam) setMode('register');
    else if (isLoginParam) setMode('login');
    else setMode(null);
  }, [isRegisterParam, isLoginParam]);

  useEffect(() => onAuthStateChanged(auth, (user) => user && router.push(feedHref('web'))), [router]);

  const fail = (error: unknown) => {
    const message = error instanceof Error ? error.message : 'No se pudo iniciar sesión';
    toast.error(message);
  };

  // El perfil en Firestore lo crea la callable `saveProfile` (reglas: el cliente no escribe `users/`).
  const handleEmail = async (email: string, password: string) => {
    setLoading(true);
    try {
      if (mode === 'register') await createUserWithEmailAndPassword(auth, email, password);
      else await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      fail(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSocial = async (provider: SocialProvider) => {
    if (provider === 'phone') {
      toast.info('Phone authentication coming soon');
      return;
    }
    setLoading(true);
    try {
      await signInWithPopup(auth, PROVIDERS[provider].create());
    } catch (error) {
      fail(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KlickAuthFlow
      variant="web"
      mode={mode}
      onModeChange={setMode}
      onDemoAccess={(gender) => router.push(feedHref('web', gender))}
      onSocial={handleSocial}
      onEmailSubmit={handleEmail}
      onBackHome={() => router.push('/')}
      loading={loading}
      initialEmail={emailParam}
    />
  );
}

export default function WebLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <WebLogin />
    </Suspense>
  );
}
