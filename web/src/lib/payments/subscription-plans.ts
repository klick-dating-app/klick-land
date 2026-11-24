/** Planes mensuales de la landing (sección #planes). `premium` se muestra como "Klick Pro". */
export type SubscriptionPlan = 'basic' | 'premium' | 'vip';

export const SUBSCRIPTION_PLANS: Record<SubscriptionPlan, { name: string; amountCents: number }> = {
  basic: { name: 'Klick Basic', amountCents: 999 },
  premium: { name: 'Klick Pro', amountCents: 2999 },
  vip: { name: 'Klick VIP', amountCents: 4999 },
};

export const isSubscriptionPlan = (v: unknown): v is SubscriptionPlan =>
  typeof v === 'string' && v in SUBSCRIPTION_PLANS;

/** Plan que el usuario eligió antes de iniciar sesión; se retoma tras login/onboarding. */
const PENDING_KEY = 'klick:pendingPlan';

export function rememberPendingPlan(plan: SubscriptionPlan) {
  try { localStorage.setItem(PENDING_KEY, plan); } catch {}
}

export function takePendingPlan(): SubscriptionPlan | null {
  try {
    const v = localStorage.getItem(PENDING_KEY);
    return isSubscriptionPlan(v) ? v : null;
  } catch {
    return null;
  }
}

export function clearPendingPlan() {
  try { localStorage.removeItem(PENDING_KEY); } catch {}
}

export const subscribeHref = (plan: SubscriptionPlan) => `/web/subscribe?plan=${plan}`;
