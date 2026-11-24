import { NextRequest, NextResponse } from 'next/server';
import { getStripeClient } from '@/backend/payments/stripe';
import { requireAdminDb } from '@/backend/firebase/admin';
import { uidFromRequest } from '@/backend/firebase/require-user';
import { lineItemFor } from '@/backend/payments/subscriptions';
import { isSubscriptionPlan } from '@/lib/payments/subscription-plans';

export const runtime = 'nodejs';

/** Crea una sesión de Stripe Checkout (suscripción mensual) para el usuario con sesión. */
export async function POST(request: NextRequest) {
  const stripe = getStripeClient();
  if (!stripe) return NextResponse.json({ error: 'Stripe no está configurado.' }, { status: 503 });

  const user = await uidFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Inicia sesión para suscribirte.' }, { status: 401 });

  const { plan } = await request.json().catch(() => ({}));
  if (!isSubscriptionPlan(plan)) return NextResponse.json({ error: 'Plan no válido.' }, { status: 400 });

  try {
    const db = requireAdminDb();
    const profile = (await db.doc(`users/${user.uid}`).get()).data();
    if (profile?.gender === 'female') {
      return NextResponse.json({ free: true, message: 'Las mujeres tienen acceso completo gratis.' });
    }

    const billingRef = db.doc(`billing/${user.uid}`);
    let customer = (await billingRef.get()).data()?.stripeCustomerId as string | undefined;
    if (!customer) {
      customer = (await stripe.customers.create({ email: user.email, metadata: { uid: user.uid } })).id;
      await billingRef.set({ stripeCustomerId: customer }, { merge: true });
    }

    const origin = request.nextUrl.origin;
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer,
      client_reference_id: user.uid,
      line_items: [lineItemFor(plan)],
      metadata: { uid: user.uid, plan },
      subscription_data: { metadata: { uid: user.uid, plan } },
      allow_promotion_codes: true,
      success_url: `${origin}/web/feed?subscription=success`,
      cancel_url: `${origin}/#planes`,
    });
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('[Stripe subscribe]', error);
    const message = error instanceof Error ? error.message : 'No se pudo iniciar el pago.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
