'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import KlickAuthFlow, { type AuthMode, type SocialProvider } from '@/components/klick/auth/KlickAuthFlow';
import { feedHref, onboardingHref } from '@/lib/klick/routes';

const AUTH_ERRORS: Record<string, string> = {
  'auth/popup-closed-by-user': 'Cerraste la ventana de Google antes de terminar.',
  'auth/cancelled-popup-request': 'Cerraste la ventana de Google antes de terminar.',
  'auth/popup-blocked': 'El navegador bloqueó la ventana de Google. Permite las ventanas emergentes e inténtalo de nuevo.',
  'auth/operation-not-allowed': 'Este método de acceso aún no está activado en Firebase.',
  'auth/unauthorized-domain': 'Este dominio no está autorizado en Firebase Authentication.',
  'auth/email-already-in-use': 'Ya existe una cuenta con ese correo. Inicia sesión.',
  'auth/invalid-credential': 'Correo o contraseña incorrectos.',
  'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
};

function WebLogin() {
  const searchParams = useSearchParams();
  const isRegisterParam = searchParams.get('register') === 'true';
  const isLoginParam = searchParams.get('mode') === 'login';
  const emailParam = searchParams.get('email') ?? undefined;

  const [mode, setMode] = useState<AuthMode | null>(null);
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const { user, profile, loading, signIn, signUp } = useAuth();

  useEffect(() => {
    if (isRegisterParam) setMode('register');
    else if (isLoginParam) setMode('login');
    else setMode(null);
  }, [isRegisterParam, isLoginParam]);

  // Con sesión: quien ya completó su perfil va al feed; quien no, a llenar sus datos.
  useEffect(() => {
    if (loading || !user) return;
    router.replace(profile?.onboarded ? feedHref('web') : onboardingHref('web'));
  }, [loading, user, profile?.onboarded, router]);

  const fail = (error: unknown) => {
    const code = (error as { code?: string })?.code ?? '';
    toast.error(AUTH_ERRORS[code] ?? 'No se pudo iniciar sesión. Inténtalo de nuevo.');
  };

  const handleEmail = async (email: string, password: string) => {
    setBusy(true);
    try {
      await (mode === 'register' ? signUp(email, password) : signIn(email, password));
    } catch (error) {
      fail(error);
    } finally {
      setBusy(false);
    }
  };

  const handleSocial = async (provider: SocialProvider) => {
    if (provider !== 'google') {
      toast.info('Por ahora el acceso es con Google. Este método estará disponible pronto.');
      return;
    }
    setBusy(true);
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (error) {
      fail(error);
    } finally {
      setBusy(false);
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
      loading={busy || (!!user && loading)}
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
