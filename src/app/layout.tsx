import type { Metadata, Viewport } from 'next';
import { Montserrat } from 'next/font/google';
import { Toaster } from 'sonner';

import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import OrganizationJsonLd from '@/components/seo/OrganizationJsonLd';
import NativeShell from '@/components/native/NativeShell';
import { AuthProvider } from '@/context/AuthContext';
import { rootMetadata } from '@/lib/seo';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = rootMetadata;

/** `viewportFit: cover` habilita `env(safe-area-inset-*)` en notch / Dynamic Island. */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#101a2e',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${montserrat.variable} font-sans`}>
        <GoogleAnalytics />
        <OrganizationJsonLd />
        <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
          <AuthProvider>
            <NativeShell />
            {children}
            <Toaster position="top-center" richColors />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
