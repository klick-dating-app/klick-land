'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { feedHref, loginHref, onboardingHref } from '@/lib/klick/routes';
import {
  clearPendingPlan,
  isSubscriptionPlan,
  rememberPendingPlan,
  SUBSCRIPTION_PLANS,
} from '@/lib/payments/subscription-plans';

/**
 * Puente entre los botones de #planes y Stripe Checkout: exige sesión y perfil,
 * y luego redirige al pago. El plan elegido sobrevive al login/onboarding.
 */
function Subscribe() {
  const router = useRouter();
  const plan = useSearchParams().get('plan');
  const { user, profile, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const started = useRef(false);

  const start = async () => {
    if (!user || !isSubscriptionPlan(plan)) return;
    setError(null);
    try {
      const res = await fetch('/api/payments/stripe/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${await user.getIdToken()}` },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.free) {
        toast.success(data.message);
        router.replace(feedHref('web'));
      } else if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error ?? 'No se pudo iniciar el pago.');
      }
    } catch {
      setError('No se pudo conectar con el servidor. Inténtalo de nuevo.');
    }
  };

  useEffect(() => {
    if (!isSubscriptionPlan(plan)) {
      router.replace('/#planes');
      return;
    }
    if (loading) return;
    if (!user) {
      rememberPendingPlan(plan);
      router.replace(loginHref('web'));
    } else if (!profile?.onboarded) {
      rememberPendingPlan(plan);
      router.replace(onboardingHref('web'));
    } else if (!started.current) {
      started.current = true;
      clearPendingPlan();
      void start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan, loading, user, profile?.onboarded]);

  const name = isSubscriptionPlan(plan) ? SUBSCRIPTION_PLANS[plan].name : '';

  return (
    <div className="min-h-[100dvh] bg-black text-white flex flex-col items-center justify-center gap-5 px-6 text-center">
      {error ? (
        <>
          <p className="text-lg">{error}</p>
          <div className="flex gap-3">
            <button onClick={() => void start()} className="rounded-full bg-white text-black px-6 py-2.5 text-sm font-semibold">
              Reintentar
            </button>
            <button onClick={() => router.push('/#planes')} className="rounded-full border border-white/20 px-6 py-2.5 text-sm">
              Volver a los planes
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
          <p className="text-white/70 text-sm">Preparando tu suscripción {name}…</p>
        </>
      )}
    </div>
  );
}

export default function SubscribePage() {
  return (
    <Suspense fallback={<div className="min-h-[100dvh] bg-black" />}>
      <Subscribe />
    </Suspense>
  );
}
