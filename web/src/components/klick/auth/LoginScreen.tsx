'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GoogleAuthProvider, OAuthProvider, signInWithPopup, type AuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import KlickAuthFlow, { type AuthMode, type SocialProvider } from '@/components/klick/auth/KlickAuthFlow';
import { feedHref, onboardingHref, type Surface } from '@/lib/klick/routes';
import { subscribeHref, takePendingPlan } from '@/lib/payments/subscription-plans';

const AUTH_ERRORS: Record<string, string> = {
  'auth/popup-closed-by-user': 'Cerraste la ventana de Google antes de terminar.',
  'auth/cancelled-popup-request': 'Cerraste la ventana de Google antes de terminar.',
  'auth/popup-blocked': 'El navegador bloqueó la ventana de Google. Permite las ventanas emergentes e inténtalo de nuevo.',
  'auth/operation-not-allowed': 'Este método de acceso aún no está activado en Firebase.',
  'auth/account-exists-with-different-credential': 'Ya tienes una cuenta con ese correo usando otro método. Entra con ese método.',
  'auth/unauthorized-domain': 'Este dominio no está autorizado en Firebase Authentication.',
  'auth/email-already-in-use': 'Ya existe una cuenta con ese correo. Inicia sesión.',
  'auth/invalid-credential': 'Correo o contraseña incorrectos.',
  'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
};

// Cada proveedor debe estar habilitado en Firebase → Authentication → Sign-in method.
const PROVIDERS: Record<SocialProvider, () => AuthProvider> = {
  google: () => new GoogleAuthProvider(),
  apple: () => new OAuthProvider('apple.com'),
  microsoft: () => new OAuthProvider('microsoft.com'),
};

function Login({ surface }: { surface: Surface }) {
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
    if (!profile?.onboarded) return router.replace(onboardingHref(surface));
    // Si eligió un plan en la landing antes de entrar, retomamos el pago.
    const plan = takePendingPlan();
    router.replace(plan ? subscribeHref(plan) : feedHref(surface));
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
    setBusy(true);
    try {
      await signInWithPopup(auth, PROVIDERS[provider]());
    } catch (error) {
      fail(error);
    } finally {
      setBusy(false);
    }
  };

  return (
    <KlickAuthFlow
      variant={surface}
      mode={mode}
      onModeChange={setMode}
      onSocial={handleSocial}
      onEmailSubmit={handleEmail}
      onBackHome={surface === 'web' ? () => router.push('/') : undefined}
      loading={busy || (!!user && loading)}
      initialEmail={emailParam}
    />
  );
}

/** Login/registro real (Firebase Auth) compartido por `/web/login` y `/app/login`. */
export default function LoginScreen({ surface }: { surface: Surface }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <Login surface={surface} />
    </Suspense>
  );
}
