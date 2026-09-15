/** Stripe Payment Links — productos Klick */
export const STRIPE_PAYMENT_LINKS = {
  libroVIP: 'https://buy.stripe.com/bJeeVdckP87851w2HxenS0D',
  planEsencial: 'https://buy.stripe.com/6oU14n84zcnoalQci7enS0F',
  planPro: 'https://buy.stripe.com/fZuaEX1GbcnoeC64PFenS0G',
  planElite: 'https://buy.stripe.com/9B67sL3OjafgalQ2HxenS0H',
  planAllInclusive: 'https://buy.stripe.com/bJeeVddoTafgeC695VenS0I',
  planBásicoBasico: 'https://buy.stripe.com/6oU14n84zcnoalQci7enS0F',
  planBásicoPremium: 'https://buy.stripe.com/9B67sL3OjafgalQ2HxenS0H',
  planBásicoVip: 'https://buy.stripe.com/bJeeVddoTafgeC695VenS0I',
} as const;

/** Catálogo portal / carrito → Payment Link de Stripe */
export const STRIPE_ITEM_LINKS: Record<string, string> = {
  'libro-vip': STRIPE_PAYMENT_LINKS.libroVIP,
  'libro-basico': STRIPE_PAYMENT_LINKS.libroVIP,
  'plan-esencial': STRIPE_PAYMENT_LINKS.planEsencial,
  'plan-pro': STRIPE_PAYMENT_LINKS.planPro,
  'plan-elite': STRIPE_PAYMENT_LINKS.planElite,
  'plan-allinclusive': STRIPE_PAYMENT_LINKS.planAllInclusive,
  'plan-basico-basico': STRIPE_PAYMENT_LINKS.planBásicoBasico,
  'plan-basico-premium': STRIPE_PAYMENT_LINKS.planBásicoPremium,
  'plan-basico-vip': STRIPE_PAYMENT_LINKS.planBásicoVip,
};

/** Precio en centavos USD (tarjeta) para verificación Stripe */
export const STRIPE_ITEM_PRICE_CENTS: Record<string, number> = {
  'libro-vip': 2999,
  'libro-basico': 2999,
  'plan-esencial': 38000,
  'plan-basico-basico': 38000,
  'plan-pro': 55000,
  'plan-elite': 250000,
  'plan-allinclusive': 1000000,
  'plan-basico-premium': 325000,
  'plan-basico-vip': 1300000,
};

export const PORTAL_STRIPE_SUCCESS_URL =
  process.env.NEXT_PUBLIC_PORTAL_STRIPE_SUCCESS_URL ||
  'https://www.klick.com/portal?stripe=success';

export const BOOK_STRIPE_SUCCESS_URL =
  process.env.NEXT_PUBLIC_BOOK_STRIPE_SUCCESS_URL ||
  'https://www.klick.com/membership/vip/book?stripe=success';

export function buildStripePaymentLink(itemId: string, email?: string) {
  const base = STRIPE_ITEM_LINKS[itemId];
  if (!base) {
    return null;
  }
  const params = new URLSearchParams();
  const trimmed = email?.trim();
  if (trimmed) {
    params.set('prefilled_email', trimmed);
  }
  const query = params.toString();
  return query ? `${base}?${query}` : base;
}

export function buildStripeBookLink(email: string) {
  return buildStripePaymentLink('libro-vip', email) || STRIPE_PAYMENT_LINKS.libroVIP;
}

export function getStripeLinkForCart(items: string[]) {
  if (items.length !== 1) {
    return null;
  }
  return STRIPE_ITEM_LINKS[items[0]] || null;
}

export function resolveItemIdFromStripeMetadata(
  metadata: Record<string, string> | null | undefined
): string | null {
  const productId = metadata?.product_id || metadata?.productId || metadata?.item_id;
  if (productId && STRIPE_ITEM_LINKS[productId]) {
    return productId;
  }
  return null;
}

export function resolveItemIdsFromAmountCents(amountCents: number): string[] {
  return Object.entries(STRIPE_ITEM_PRICE_CENTS)
    .filter(([, cents]) => cents === amountCents)
    .map(([itemId]) => itemId);
}
