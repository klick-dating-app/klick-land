/**
 * Apertura de enlaces externos compatible con web y con Capacitor.
 *
 * - En web: comportamiento estándar (`window.open` en nueva pestaña).
 * - En nativo: abre un navegador in-app (Custom Tab / SFSafariViewController)
 *   vía `@capacitor/browser`, de modo que una URL externa NUNCA reemplaza
 *   la navegación de la app ni deja al usuario "atrapado" fuera.
 *
 * Los enlaces INTERNOS deben seguir usando `next/link` / `useRouter`; esta
 * utilidad es solo para destinos fuera del dominio de la app.
 */
import { isNative } from './index';

/** Host(s) que se consideran "internos" y no deben tratarse como externos. */
const INTERNAL_HOSTS = [
  'click-with-purpose.onrender.com',
  'udreamms.com',
  'www.udreamms.com',
  'localhost',
];

export function isExternalUrl(url: string): boolean {
  try {
    const u = new URL(
      url,
      typeof window !== 'undefined'
        ? window.location.href
        : 'https://click-with-purpose.onrender.com'
    );
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return false;
    return !INTERNAL_HOSTS.includes(u.hostname);
  } catch {
    return false;
  }
}

export async function openExternal(url: string): Promise<void> {
  if (isNative()) {
    try {
      const { Browser } = await import('@capacitor/browser');
      await Browser.open({ url, presentationStyle: 'popover' });
      return;
    } catch {
      /* fallback a window.open */
    }
  }
  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
