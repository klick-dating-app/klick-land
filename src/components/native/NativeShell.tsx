'use client';

/**
 * NativeShell
 * -----------
 * Componente sin UI que inicializa el comportamiento nativo cuando la app
 * corre dentro de Capacitor (Android / iOS). En web es un no-op absoluto:
 * no importa ningún plugin y no ejecuta efectos.
 *
 * Responsabilidades:
 *  1. Ocultar el splash screen cuando la web ya cargó.
 *  2. Ajustar la StatusBar al tema actual (claro/oscuro).
 *  3. Botón "atrás" físico de Android: navegar hacia atrás o salir en la raíz.
 *  4. Interceptar enlaces EXTERNOS (`target="_blank"` u otro host) y abrirlos
 *     en un navegador in-app, sin romper la navegación de la aplicación.
 *
 * Se monta una sola vez en `src/app/layout.tsx`.
 */
import { useEffect } from 'react';
import { getPlatform, isNative } from '@/lib/platform';
import { isExternalUrl, openExternal } from '@/lib/platform/links';

export default function NativeShell() {
  useEffect(() => {
    if (!isNative()) return;

    let cleanup: Array<() => void> = [];

    // Marca el <html> para que el CSS pueda aplicar safe-areas solo en nativo.
    const root = document.documentElement;
    root.classList.add('cap-native', `cap-${getPlatform()}`);
    cleanup.push(() => root.classList.remove('cap-native', `cap-${getPlatform()}`));

    (async () => {
      // 1. Splash screen
      try {
        const { SplashScreen } = await import('@capacitor/splash-screen');
        await SplashScreen.hide();
      } catch {
        /* plugin ausente */
      }

      // 2. Status bar acorde al tema
      try {
        const { StatusBar, Style } = await import('@capacitor/status-bar');
        const isDark = document.documentElement.classList.contains('dark');
        await StatusBar.setStyle({ style: isDark ? Style.Dark : Style.Light });

        const observer = new MutationObserver(async () => {
          const dark = document.documentElement.classList.contains('dark');
          try {
            await StatusBar.setStyle({ style: dark ? Style.Dark : Style.Light });
          } catch {
            /* noop */
          }
        });
        observer.observe(document.documentElement, {
          attributes: true,
          attributeFilter: ['class'],
        });
        cleanup.push(() => observer.disconnect());
      } catch {
        /* plugin ausente */
      }

      // 3. Botón atrás de Android
      try {
        const { App } = await import('@capacitor/app');
        const handle = await App.addListener('backButton', ({ canGoBack }) => {
          if (canGoBack || window.history.length > 1) {
            window.history.back();
          } else {
            App.exitApp();
          }
        });
        cleanup.push(() => handle.remove());
      } catch {
        /* plugin ausente */
      }

      // 4. Enlaces externos -> navegador in-app
      const onClick = (event: MouseEvent) => {
        const anchor = (event.target as HTMLElement | null)?.closest('a');
        if (!anchor) return;
        const href = anchor.getAttribute('href');
        if (!href) return;
        const opensNewWindow = anchor.target === '_blank';
        if (opensNewWindow || isExternalUrl(href)) {
          if (isExternalUrl(href)) {
            event.preventDefault();
            void openExternal(href);
          }
        }
      };
      document.addEventListener('click', onClick, true);
      cleanup.push(() => document.removeEventListener('click', onClick, true));
    })();

    return () => {
      cleanup.forEach((fn) => fn());
      cleanup = [];
    };
  }, []);

  return null;
}
