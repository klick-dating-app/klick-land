import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Klick Land — Capacitor configuration.
 *
 * ESTRATEGIA: "hybrid / remote-server".
 * Esta app Next.js usa SSR + API Routes + firebase-admin + redirects()/headers(),
 * por lo que NO puede exportarse como sitio estático (`output: 'export'`) sin
 * romper la arquitectura y el despliegue web. En su lugar, el contenedor nativo
 * carga la web ya desplegada mediante `server.url`. Ver CAPACITOR.md.
 *
 * `webDir` apunta a `mobile/www`, un fallback local mínimo (pantalla offline)
 * que se empaqueta dentro del binario y se usa si no hay conexión.
 *
 * El host remoto se puede sobreescribir en build con la variable de entorno
 * `CAP_SERVER_URL` (p. ej. para apuntar a un entorno de staging).
 */
const SERVER_URL = process.env.CAP_SERVER_URL || 'https://click-with-purpose.onrender.com';

const config: CapacitorConfig = {
  appId: 'com.klickland.app',
  appName: 'Klick Land',
  webDir: 'mobile/www',
  server: {
    url: SERVER_URL,
    cleartext: true,
    androidScheme: 'https',
    iosScheme: 'https',
    // Rutas que se abren DENTRO del webview (mismo dominio de producción o Render).
    // Cualquier otro host se delega al navegador del sistema.
    allowNavigation: [
      'click-with-purpose.onrender.com',
      '*.onrender.com',
      'udreamms.com',
      '*.udreamms.com',
    ],
  },
  android: {
    allowMixedContent: true,
  },
  ios: {
    contentInset: 'always',
    limitsNavigationsToAppBoundDomains: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      launchAutoHide: true,
      backgroundColor: '#101a2e',
      showSpinner: false,
      androidScaleType: 'CENTER_CROP',
      splashFullScreen: true,
      splashImmersive: false,
    },
    StatusBar: {
      // La app arranca en tema oscuro (defaultTheme="dark").
      style: 'DARK',
      backgroundColor: '#101a2e',
      overlaysWebView: false,
    },
  },
};

export default config;
