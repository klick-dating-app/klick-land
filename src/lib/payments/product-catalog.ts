/**
 * Catálogo único de precios — fuente de verdad para portal, crypto y Stripe.
 * Precios tarjeta alineados con instructions-payment-student / tourist.
 */
export interface ProductCatalogEntry {
  name: string;
  cardPriceUsd: number;
  cryptoPriceUsd: number | null;
  stripePaymentLink: string | null;
}

export const PRODUCT_CATALOG: Record<string, ProductCatalogEntry> = {
  'curso-vip': {
    name: 'Express Masterclass - F-1 Student',
    cardPriceUsd: 9.99,
    cryptoPriceUsd: 9.99,
    stripePaymentLink: null,
  },
  'libro-vip': {
    name: 'Digital Book - F-1 Student',
    cardPriceUsd: 29.99,
    cryptoPriceUsd: 29.99,
    stripePaymentLink: 'https://buy.stripe.com/bJeeVdckP87851w2HxenS0D',
  },
  'curso-basico': {
    name: 'Express Masterclass - B-2 Tourist',
    cardPriceUsd: 9.99,
    cryptoPriceUsd: 9.99,
    stripePaymentLink: null,
  },
  'libro-basico': {
    name: 'Digital Book - B-2 Tourist',
    cardPriceUsd: 29.99,
    cryptoPriceUsd: 29.99,
    stripePaymentLink: 'https://buy.stripe.com/bJeeVdckP87851w2HxenS0D',
  },
  'plan-esencial': {
    name: 'Plan 1: Essential - F-1',
    cardPriceUsd: 380,
    cryptoPriceUsd: 299.99,
    stripePaymentLink: 'https://buy.stripe.com/6oU14n84zcnoalQci7enS0F',
  },
  'plan-pro': {
    name: 'Plan 2: Pro - F-1',
    cardPriceUsd: 550,
    cryptoPriceUsd: 449.99,
    stripePaymentLink: 'https://buy.stripe.com/fZuaEX1GbcnoeC64PFenS0G',
  },
  'plan-elite': {
    name: 'Plan 3: Elite - F-1',
    cardPriceUsd: 3250,
    cryptoPriceUsd: null,
    stripePaymentLink: 'https://buy.stripe.com/9B67sL3OjafgalQ2HxenS0H',
  },
  'plan-allinclusive': {
    name: 'Plan 4: All-Inclusive - F-1',
    cardPriceUsd: 13000,
    cryptoPriceUsd: null,
    stripePaymentLink: 'https://buy.stripe.com/bJeeVddoTafgeC695VenS0I',
  },
  'plan-basico-basico': {
    name: 'Plan 1: Basic Tourist - B-2',
    cardPriceUsd: 380,
    cryptoPriceUsd: 299.99,
    stripePaymentLink: 'https://buy.stripe.com/6oU14n84zcnoalQci7enS0F',
  },
  'plan-basico-premium': {
    name: 'Plan 2: Premium Tourist - B-2',
    cardPriceUsd: 3250,
    cryptoPriceUsd: null,
    stripePaymentLink: 'https://buy.stripe.com/9B67sL3OjafgalQ2HxenS0H',
  },
  'plan-basico-vip': {
    name: 'Plan 3: VIP Experience - B-2',
    cardPriceUsd: 13000,
    cryptoPriceUsd: null,
    stripePaymentLink: 'https://buy.stripe.com/bJeeVddoTafgeC695VenS0I',
  },
};

export type PaymentMethodKind = 'card' | 'crypto';

export function getProductEntry(itemId: string): ProductCatalogEntry | null {
  return PRODUCT_CATALOG[itemId] ?? null;
}

export function getItemPriceUsd(itemId: string, method: PaymentMethodKind): number {
  const entry = getProductEntry(itemId);
  if (!entry) return 0;
  if (method === 'crypto' && entry.cryptoPriceUsd != null) {
    return entry.cryptoPriceUsd;
  }
  return entry.cardPriceUsd;
}

export function getCartTotalUsd(itemIds: string[], method: PaymentMethodKind): number {
  return itemIds.reduce((sum, id) => sum + getItemPriceUsd(id, method), 0);
}

export function supportsCrypto(itemId: string): boolean {
  const entry = getProductEntry(itemId);
  return entry?.cryptoPriceUsd != null;
}

export function cartSupportsCrypto(itemIds: string[]): boolean {
  return itemIds.length > 0 && itemIds.every(supportsCrypto);
}

/** Legacy map for APIs que leen VISA_PLAN_CATALOG_USD con precio crypto por defecto */
export function buildLegacyCatalogUsd(): Record<string, number> {
  const map: Record<string, number> = {};
  for (const [id, entry] of Object.entries(PRODUCT_CATALOG)) {
    map[id] = entry.cryptoPriceUsd ?? entry.cardPriceUsd;
  }
  return map;
}

export function buildLegacyCardCatalogUsd(): Record<string, number> {
  const map: Record<string, number> = {};
  for (const [id, entry] of Object.entries(PRODUCT_CATALOG)) {
    map[id] = entry.cardPriceUsd;
  }
  return map;
}
