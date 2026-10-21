import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Klick — Capacitor.
 * La app NO carga un sitio remoto: empaqueta la exportación estática de Next.js
 * (`out/`) dentro del binario, por lo que funciona como app nativa real
 * (requisito de App Store / Google Play) y habla con Firebase directamente.
 * Para desarrollo con recarga en vivo: `CAP_SERVER_URL=http://<ip-lan>:3000 npx cap sync`.
 */
const devServer = process.env.CAP_SERVER_URL;

const config: CapacitorConfig = {
  appId: 'com.klickland.app',
  appName: 'Klick',
  webDir: 'out',
  ...(devServer ? { server: { url: devServer, cleartext: true } } : { server: { androidScheme: 'https', iosScheme: 'capacitor' } }),
  ios: { contentInset: 'always' },
  plugins: {
    SplashScreen: { launchAutoHide: false, backgroundColor: '#101a2e', showSpinner: false },
    StatusBar: { style: 'DARK', backgroundColor: '#101a2e', overlaysWebView: false },
    Keyboard: { resize: 'body', resizeOnFullScreen: true },
    PushNotifications: { presentationOptions: ['badge', 'sound', 'alert'] },
  },
};

export default config;
