import type { SocialNetwork } from '@/lib/types';

/** Iconos del perfil: TikTok primero, luego las redes del pie de página y Spotify al final. */
export const SOCIALS: { id: SocialNetwork; label: string; icon: string; placeholder: string; url: (handle: string) => string }[] = [
  { id: 'tiktok', label: 'TikTok', icon: '/assets/t.jpg', placeholder: '@username', url: (h) => `https://www.tiktok.com/@${h}` },
  { id: 'facebook', label: 'Facebook', icon: '/assets/f.jpg', placeholder: 'username', url: (h) => `https://www.facebook.com/${h}` },
  { id: 'instagram', label: 'Instagram', icon: '/assets/i.jpg', placeholder: '@username', url: (h) => `https://www.instagram.com/${h}` },
  { id: 'whatsapp', label: 'WhatsApp', icon: '/assets/w.jpg', placeholder: '+1 801 555 0100', url: (h) => `https://wa.me/${h.replace(/\D/g, '')}` },
  { id: 'x', label: 'X', icon: '/assets/x.jpg', placeholder: '@username', url: (h) => `https://x.com/${h}` },
  { id: 'youtube', label: 'YouTube', icon: '/assets/y.jpg', placeholder: '@channel', url: (h) => `https://www.youtube.com/@${h}` },
  { id: 'spotify', label: 'Spotify', icon: '/assets/spotify.svg', placeholder: 'username', url: (h) => `https://open.spotify.com/user/${h}` },
];

/** Marca de los perfiles de ejemplo: muestran la red como conectada pero no abren cuentas reales. */
export const DEMO_HANDLE = 'demo';

/** Igual que la validación del servidor: solo usuarios, nunca URLs. */
export function cleanHandle(id: SocialNetwork, raw: string): string | null {
  const v = raw.trim().replace(/^@/, '');
  if (!v) return '';
  if (id === 'whatsapp') {
    const digits = v.replace(/[\s()-]/g, '');
    return /^\+?\d{7,15}$/.test(digits) ? digits : null;
  }
  return /^[A-Za-z0-9._-]{1,50}$/.test(v) ? v : null;
}
