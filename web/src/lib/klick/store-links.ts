/**
 * Enlaces a las tiendas. La app aún no está publicada: cuando lo esté, pon las URLs reales en
 * NEXT_PUBLIC_APP_STORE_URL / NEXT_PUBLIC_PLAY_STORE_URL (la de Play ya usa el appId de capacitor.config.ts).
 */
export const APP_STORE_URL = process.env.NEXT_PUBLIC_APP_STORE_URL || 'https://apps.apple.com/us/search?term=Klick%20SafeMeet';
export const PLAY_STORE_URL =
  process.env.NEXT_PUBLIC_PLAY_STORE_URL || 'https://play.google.com/store/apps/details?id=com.klickland.app';
