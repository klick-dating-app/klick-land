import type Stripe from 'stripe';
import { requireAdminDb } from '@/backend/firebase/admin';
import { isSubscriptionPlan, SUBSCRIPTION_PLANS, type SubscriptionPlan } from '@/lib/payments/subscription-plans';

type Plan = 'free' | SubscriptionPlan;

/** Igual que `entitlementFor` de backend/src/lib/common.ts: las mujeres siempre tienen acceso completo gratis. */
function entitlementFor(gender: 'male' | 'female', plan: Plan) {
  const paid = plan !== 'free';
  const full = gender === 'female' || paid;
  return {
    plan: gender === 'female' ? 'free' : plan,
    canChat: full,
    canViewDetails: full,
    status: paid ? 'active' : 'none',
  };
}

/** Precio de Stripe: `STRIPE_PRICE_BASIC|PREMIUM|VIP` si existe; si no, precio mensual en línea. */
export function lineItemFor(plan: SubscriptionPlan): Stripe.Checkout.SessionCreateParams.LineItem {
  const priceId = process.env[`STRIPE_PRICE_${plan.toUpperCase()}`];
  if (priceId) return { price: priceId, quantity: 1 };
  const { name, amountCents } = SUBSCRIPTION_PLANS[plan];
  return {
    quantity: 1,
    price_data: {
      currency: 'usd',
      unit_amount: amountCents,
      recurring: { interval: 'month' },
      product_data: { name },
    },
  };
}

/** Escribe `entitlements/{uid}` según el estado de la suscripción. Única vía de conceder un plan de pago. */
export async function applySubscription(sub: Stripe.Subscription) {
  const uid = sub.metadata?.uid;
  if (!uid) return;
  const db = requireAdminDb();
  const plan: SubscriptionPlan = isSubscriptionPlan(sub.metadata.plan) ? sub.metadata.plan : 'basic';
  const active = sub.status === 'active' || sub.status === 'trialing';
  const gender = (await db.doc(`users/${uid}`).get()).data()?.gender === 'female' ? 'female' : 'male';
  const ent = entitlementFor(gender, active ? plan : 'free');
  await db.doc(`entitlements/${uid}`).set({
    ...ent,
    status: active ? 'active' : sub.status === 'past_due' ? 'past_due' : 'canceled',
    currentPeriodEnd: (sub.items.data[0]?.current_period_end ?? 0) * 1000,
    stripeSubscriptionId: sub.id,
  });
  const customer = typeof sub.customer === 'string' ? sub.customer : sub.customer.id;
  await db.doc(`billing/${uid}`).set({ stripeCustomerId: customer }, { merge: true });
}
