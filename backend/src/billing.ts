import { onCall, onRequest, HttpsError } from 'firebase-functions/v2/https';
import { defineSecret, defineString } from 'firebase-functions/params';
import Stripe from 'stripe';
import { db, requireUid, entitlementFor } from './lib/common';
import type { Plan } from './lib/types';

const STRIPE_SECRET_KEY = defineSecret('STRIPE_SECRET_KEY');
const STRIPE_WEBHOOK_SECRET = defineSecret('STRIPE_WEBHOOK_SECRET');
const APP_URL = defineString('APP_URL', { default: 'https://klick.app' });
const PRICE_BASIC = defineString('STRIPE_PRICE_BASIC', { default: '' });
const PRICE_PREMIUM = defineString('STRIPE_PRICE_PREMIUM', { default: '' });
const PRICE_VIP = defineString('STRIPE_PRICE_VIP', { default: '' });

const priceFor = (plan: Plan) =>
  ({ basic: PRICE_BASIC.value(), premium: PRICE_PREMIUM.value(), vip: PRICE_VIP.value(), free: '' })[plan];

export const createCheckoutSession = onCall({ secrets: [STRIPE_SECRET_KEY] }, async (req) => {
  const uid = requireUid(req);
  const plan = req.data?.plan as Plan;
  const price = ['basic', 'premium', 'vip'].includes(plan) ? priceFor(plan) : '';
  if (!price) throw new HttpsError('failed-precondition', 'Plan no disponible todavía.');

  const user = (await db().doc(`users/${uid}`).get()).data();
  if (user?.gender !== 'male') throw new HttpsError('failed-precondition', 'Las mujeres tienen acceso gratuito.');

  const stripe = new Stripe(STRIPE_SECRET_KEY.value());
  const billingRef = db().doc(`billing/${uid}`);
  let customer = (await billingRef.get()).data()?.stripeCustomerId as string | undefined;
  if (!customer) {
    customer = (await stripe.customers.create({ email: req.auth?.token.email, metadata: { uid } })).id;
    await billingRef.set({ stripeCustomerId: customer }, { merge: true });
  }
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer,
    client_reference_id: uid,
    line_items: [{ price, quantity: 1 }],
    subscription_data: { metadata: { uid, plan } },
    success_url: `${APP_URL.value()}/app/upgrade/?status=success`,
    cancel_url: `${APP_URL.value()}/app/upgrade/?status=cancel`,
  });
  return { url: session.url };
});

export const createPortalSession = onCall({ secrets: [STRIPE_SECRET_KEY] }, async (req) => {
  const uid = requireUid(req);
  const customer = (await db().doc(`billing/${uid}`).get()).data()?.stripeCustomerId as string | undefined;
  if (!customer) throw new HttpsError('failed-precondition', 'No tienes una suscripción.');
  const stripe = new Stripe(STRIPE_SECRET_KEY.value());
  const s = await stripe.billingPortal.sessions.create({ customer, return_url: `${APP_URL.value()}/app/upgrade/` });
  return { url: s.url };
});

async function applySubscription(sub: Stripe.Subscription) {
  const uid = sub.metadata.uid;
  if (!uid) return;
  const plan = (sub.metadata.plan as Plan) || 'basic';
  const active = sub.status === 'active' || sub.status === 'trialing';
  const gender = (await db().doc(`users/${uid}`).get()).data()?.gender ?? 'male';
  const ent = entitlementFor(gender, active ? plan : 'free');
  await db().doc(`entitlements/${uid}`).set({
    ...ent,
    status: active ? 'active' : sub.status === 'past_due' ? 'past_due' : 'canceled',
    currentPeriodEnd: sub.current_period_end * 1000,
  });
}

/** Webhook de Stripe: es la ÚNICA fuente que concede entitlements de pago. */
export const stripeWebhook = onRequest({ secrets: [STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET] }, async (req, res) => {
  const stripe = new Stripe(STRIPE_SECRET_KEY.value());
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, req.headers['stripe-signature'] as string, STRIPE_WEBHOOK_SECRET.value());
  } catch {
    res.status(400).send('Firma inválida');
    return;
  }
  if (event.type === 'checkout.session.completed') {
    const s = event.data.object as Stripe.Checkout.Session;
    if (s.subscription) await applySubscription(await stripe.subscriptions.retrieve(s.subscription as string));
  } else if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
    await applySubscription(event.data.object as Stripe.Subscription);
  }
  res.json({ received: true });
});
