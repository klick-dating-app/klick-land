import { NextRequest, NextResponse } from 'next/server';
import { getStripeClient } from '@/backend/payments/stripe';
import { requireAdminDb } from '@/backend/firebase/admin';
import { uidFromRequest } from '@/backend/firebase/require-user';

export const runtime = 'nodejs';

/** Portal de Stripe para que el usuario cambie de plan, actualice su tarjeta o cancele. */
export async function POST(request: NextRequest) {
  const stripe = getStripeClient();
  if (!stripe) return NextResponse.json({ error: 'Stripe no está configurado.' }, { status: 503 });
  const user = await uidFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Inicia sesión.' }, { status: 401 });

  try {
    const customer = (await requireAdminDb().doc(`billing/${user.uid}`).get()).data()?.stripeCustomerId as string | undefined;
    if (!customer) return NextResponse.json({ error: 'No tienes una suscripción.' }, { status: 404 });
    const s = await stripe.billingPortal.sessions.create({ customer, return_url: `${request.nextUrl.origin}/web/feed` });
    return NextResponse.json({ url: s.url });
  } catch (error) {
    console.error('[Stripe portal]', error);
    return NextResponse.json({ error: 'No se pudo abrir el portal.' }, { status: 500 });
  }
}
