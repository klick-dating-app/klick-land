import { NextRequest, NextResponse } from 'next/server';
import { getStripeClient } from '@/backend/payments/stripe';
import { unlockPurchasesByEmail } from '@/backend/payments/unlock-purchase';
import { PRODUCT_CATALOG } from '@/lib/payments/product-catalog';
import { applySubscription } from '@/backend/payments/subscriptions';
import type Stripe from 'stripe';

export const runtime = 'nodejs';

function parseItemIdsFromMetadata(metadata: Record<string, string> | null | undefined): string[] {
  if (!metadata) return [];
  if (metadata.item_ids) {
    return metadata.item_ids.split(',').map((s) => s.trim()).filter((id) => PRODUCT_CATALOG[id]);
  }
  const single = metadata.product_id || metadata.productId;
  if (single && single !== 'cart' && PRODUCT_CATALOG[single]) {
    return [single];
  }
  return [];
}

export async function POST(request: NextRequest) {
  const stripe = getStripeClient();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: 'Stripe webhook is not configured' }, { status: 503 });
  }

  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event;
  try {
    const body = await request.text();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Invalid webhook signature';
    console.error('[Stripe Webhook] Signature verification failed:', message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    // Suscripciones mensuales: activan, renuevan, degradan (past_due) o cancelan el plan.
    if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
      await applySubscription(event.data.object as Stripe.Subscription);
    }

    if (event.type === 'checkout.session.completed' && event.data.object.mode === 'subscription') {
      const subscriptionId = event.data.object.subscription;
      if (subscriptionId) {
        const id = typeof subscriptionId === 'string' ? subscriptionId : subscriptionId.id;
        await applySubscription(await stripe.subscriptions.retrieve(id));
      }
    } else if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const email =
        session.customer_details?.email ||
        session.metadata?.billing_email ||
        '';

      const itemIds = parseItemIdsFromMetadata(session.metadata);

      if (email && itemIds.length > 0) {
        await unlockPurchasesByEmail(email, itemIds, {
          type: 'stripe',
          referenceId: session.id,
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Webhook handler failed';
    console.error('[Stripe Webhook] Handler error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
