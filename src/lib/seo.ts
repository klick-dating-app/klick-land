import type { Metadata } from 'next';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://klick.app';
export const SITE_NAME = 'Klick';
export const SITE_DESCRIPTION =
  'Klick es la app de citas enfocada en seguridad: perfiles verificados, compatibilidad profunda de 0 a 100 % y Safe First Date para tu primera cita.';

export const rootMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Klick — Citas seguras con compatibilidad real', template: '%s | Klick' },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: { type: 'website', siteName: SITE_NAME, title: 'Klick — Citas seguras', description: SITE_DESCRIPTION, url: SITE_URL },
  twitter: { card: 'summary_large_image', title: 'Klick — Citas seguras', description: SITE_DESCRIPTION },
};

export const PUBLIC_ROUTES = ['', '/safe-dates', '/faqs', '/contact', '/privacy', '/terms', '/delete-account'];

export const pageMetadata = (title: string, description: string): Metadata => ({ title, description });
