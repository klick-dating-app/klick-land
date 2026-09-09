# Klick Land — App móvil con Capacitor

Este documento explica cómo está integrado [Capacitor](https://capacitorjs.com/)
en el proyecto y cómo trabajar con las apps de **Android** e **iOS** sin afectar
al sitio web.

---

## 1. Estrategia: contenedor híbrido (remote-server)

Klick Land es una app **Next.js con SSR**: usa API Routes (`src/app/api/**`),
`firebase-admin`, Stripe en servidor, `redirects()` y `headers()` en
`next.config.mjs` y rutas dinámicas (`/application/[id]`, `/onboarding/[id]`).

> **Un export estático (`output: 'export'`) NO es compatible** con esta
> arquitectura: rompería las API Routes, los `redirects/headers` y el despliegue
> web actual (Vercel + Firebase App Hosting). El usuario pidió explícitamente
> **no** cambiar la arquitectura.

Solución adoptada (patrón oficial de Capacitor
["Loading remote content"](https://capacitorjs.com/docs/guides/live-reload#using-with-framework-clis)):

```
Next.js SSR (https://udreamms.com)  ← se sigue desplegando igual que hoy
        │
        ▼
Capacitor WebView  ── server.url = https://udreamms.com
        │
        ├── Android  (android/)
        └── iOS      (ios/)
```

- El binario nativo **carga la web ya desplegada** mediante `server.url`.
- `webDir` apunta a `mobile/www/`, una **pantalla de fallback offline** mínima
  que va empaquetada dentro del binario y se muestra si no hay conexión.
- La web (`npm run build` + Vercel/Firebase) **no cambia en absoluto**.

### Ventajas
- Cero cambios en la arquitectura Next.js. La web y la app comparten el mismo
  código y se actualizan **a la vez** al desplegar la web.
- No hay que mantener un export estático paralelo.

### Limitaciones (a tener en cuenta)
- La app **requiere conexión** en el primer arranque (hay pantalla offline).
- Apple/Google pueden pedir que la app aporte valor nativo frente a "solo una
  web". Ya se incluye: splash nativo, status bar, safe-areas, botón atrás de
  Android y apertura de enlaces externos en navegador in-app. Añadir push /
  cámara / biometría cuando el producto lo necesite (ver §10).

### Apuntar a otro entorno (staging)
`server.url` se puede sobreescribir en build:

```bash
CAP_SERVER_URL=https://staging.udreamms.com npx cap sync
```

---

## 2. Dependencias instaladas

| Paquete | Versión | Motivo |
|---|---|---|
| `@capacitor/core` | 7.6.9 | Runtime del puente nativo |
| `@capacitor/cli` (dev) | 7.6.9 | CLI (`cap`) |
| `@capacitor/android` | 7.6.9 | Proyecto nativo Android |
| `@capacitor/ios` | 7.6.9 | Proyecto nativo iOS |
| `@capacitor/app` | 7.1.2 | Estado de app + botón atrás de Android + base para deep links |
| `@capacitor/browser` | 7.0.5 | Abrir enlaces externos en navegador in-app |
| `@capacitor/status-bar` | 7.0.6 | Color/estilo de la status bar según tema |
| `@capacitor/splash-screen` | 7.0.5 | Splash nativo controlado desde JS |
| `@capacitor/assets` (dev) | 3.0.5 | Generar iconos y splash |

> **¿Por qué Capacitor 7 y no 8?** El CLI de Capacitor 8 exige **Node ≥ 22**.
> El proyecto y sus entornos (Firebase Functions `nodejs20`, App Hosting) usan
> **Node 20**. Capacitor 7.6.9 es la última versión estable compatible con
> Node 20 y es totalmente apta para producción. Para migrar a Capacitor 8 en el
> futuro: subir Node a 22+ y `npm i @capacitor/{core,cli,android,ios}@8`.

No se instaló Ionic, Cordova, React Native ni Tauri.

---

## 3. Archivos clave

```
klick-land/
├── capacitor.config.ts          # Configuración de Capacitor
├── mobile/www/                   # Fallback offline empaquetado (webDir)
│   ├── index.html
│   └── logo.png
├── assets/                       # Fuentes para regenerar iconos/splash
│   ├── logo.png
│   └── logo-dark.png
├── android/                      # Proyecto nativo Android (Android Studio)
├── ios/                          # Proyecto nativo iOS (Xcode, requiere macOS)
├── src/
│   ├── lib/platform/
│   │   ├── index.ts              # Detección de plataforma (web/ios/android)
│   │   └── links.ts              # Apertura segura de enlaces externos
│   └── components/native/
│       └── NativeShell.tsx       # Init nativo (splash, status bar, back, links)
└── src/app/
    ├── layout.tsx                # + <NativeShell/> y viewport viewport-fit=cover
    └── globals.css               # + utilidades de safe-area
```

---

## 4. Configuración de Capacitor (`capacitor.config.ts`)

| Campo | Valor |
|---|---|
| `appId` | `com.klickland.app` |
| `appName` | `Klick Land` |
| `webDir` | `mobile/www` |
| `server.url` | `https://udreamms.com` (o `CAP_SERVER_URL`) |
| `server.allowNavigation` | `udreamms.com`, `*.udreamms.com` (resto → navegador del sistema) |
| `server.cleartext` | `false` (solo HTTPS) |
| `plugins.SplashScreen` | fondo `#101A2E`, 1.5 s, autohide |
| `plugins.StatusBar` | estilo `DARK`, fondo `#101A2E` |

---

## 5. Comandos / scripts npm

| Script | Qué hace |
|---|---|
| `npm run build` | **Build web** (Next.js). Sin cambios respecto a hoy. |
| `npm run cap:sync` | `cap sync` — copia `mobile/www` y actualiza plugins nativos |
| `npm run cap:copy` | `cap copy` — solo copia assets web |
| `npm run cap:update` | `cap update` — solo actualiza dependencias nativas |
| `npm run cap:doctor` | Diagnóstico del entorno Capacitor |
| `npm run cap:assets` | Regenera iconos + splash desde `assets/logo*.png` |
| `npm run android` | Abre el proyecto en Android Studio |
| `npm run ios` | Abre el proyecto en Xcode (solo macOS) |
| `npm run mobile:sync` | Alias de `cap sync` |
| `npm run mobile:android` | `cap sync android` + abre Android Studio |
| `npm run mobile:ios` | `cap sync ios` + abre Xcode (solo macOS) |

Ningún script existente fue eliminado ni modificado.

---

## 6. Flujo de trabajo

### Web (sin cambios)
```bash
npm run build      # y desplegar como siempre (Vercel / Firebase App Hosting)
```

### App móvil — al cambiar la web
Como la app carga `https://udreamms.com`, **normalmente basta con desplegar la
web**: la app se actualiza sola al abrirla.

Solo hay que re-sincronizar y recompilar el binario cuando cambies:
`capacitor.config.ts`, la pantalla `mobile/www/`, los iconos/splash o los
plugins nativos:

```
Editar config / assets / plugins
        ↓
npm run cap:sync
        ↓
npm run android      (o  npm run ios  en macOS)
        ↓
Compilar desde Android Studio / Xcode
```

### Desarrollo contra un backend local
`next dev` sirve en `http://localhost:3000`. Para probar la app contra él en un
emulador/dispositivo, apunta `server.url` temporalmente (no commitear):

```bash
# Android emulador: 10.0.2.2 = localhost del host
CAP_SERVER_URL=http://10.0.2.2:3000 npx cap sync android
```
y añade `server.cleartext: true` de forma temporal en `capacitor.config.ts`
(revertir antes de publicar).

---

## 7. Android

- **Package / applicationId:** `com.klickland.app`
- **Nombre visible:** `Klick Land` (`android/app/src/main/res/values/strings.xml`)
- **minSdk 23 · targetSdk 35 · compileSdk 35** (`android/variables.gradle`)
- **versionCode 1 · versionName "1.0"** (`android/app/build.gradle`)
- **Permisos:** solo `INTERNET` (no se añadió ninguno innecesario)
- **Colores de marca:** `android/app/src/main/res/values/colors.xml`
- **Iconos:** `mipmap-*/ic_launcher*` (incluye icono adaptativo)
- **Splash:** `drawable-*/splash.png` (light + `-night` + orientaciones)
- **Orientación:** libre (sigue el sensor). Para bloquear a vertical, añade en el
  `<activity>` de `AndroidManifest.xml`: `android:screenOrientation="portrait"`.
- **Botón atrás:** gestionado por `NativeShell.tsx` (atrás en el historial o
  salir en la raíz).
- **Almacenamiento:** el WebView usa el almacenamiento del dominio remoto
  (`localStorage`, cookies, IndexedDB) de forma persistente. No se sustituyó nada.

### Abrir en Android Studio
```bash
npm run android
# equivale a:  npx cap open android
```
Si no autodetecta el ejecutable, abre Android Studio manualmente y selecciona la
carpeta `android/`.

### Generar APK (debug, para pruebas)
```bash
cd android
./gradlew assembleDebug
# salida: android/app/build/outputs/apk/debug/app-debug.apk
```

### Generar AAB (release, para Google Play)
1. Crear un keystore (una sola vez):
   ```bash
   keytool -genkey -v -keystore klickland-release.keystore \
     -alias klickland -keyalg RSA -keysize 2048 -validity 10000
   ```
   Guardar el `.keystore` **fuera del repo** y en lugar seguro.
2. Crear `android/keystore.properties` (NO commitear):
   ```properties
   storeFile=/ruta/absoluta/klickland-release.keystore
   storePassword=********
   keyAlias=klickland
   keyPassword=********
   ```
3. Referenciar ese fichero en `android/app/build.gradle` (bloque
   `signingConfigs`/`buildTypes.release`) — ver
   <https://capacitorjs.com/docs/android/deploying-to-google-play>.
4. Compilar:
   ```bash
   cd android
   ./gradlew bundleRelease
   # salida: android/app/build/outputs/bundle/release/app-release.aab
   ```
5. Subir el `.aab` a Google Play Console → Producción / Testing interno.
   Antes de publicar: subir versión (`versionCode`/`versionName` en
   `android/app/build.gradle`), rellenar ficha, política de privacidad, etc.

---

## 8. iOS

- **Bundle Identifier:** `com.klickland.app`
- **Nombre visible:** `Klick Land` (`CFBundleDisplayName` en `ios/App/App/Info.plist`)
- **Deployment target:** iOS 14.0
- **Orientación:** vertical + landscape (editable en Xcode → target → General).
- **Iconos:** `ios/App/App/Assets.xcassets/AppIcon.appiconset`
- **Splash:** `ios/App/App/Assets.xcassets/Splash.imageset` (light + dark)
- **Enlaces externos:** navegador in-app vía `@capacitor/browser` (NativeShell).
- **Permisos:** ninguno declarado todavía. Al añadir cámara, ubicación, etc.,
  hay que añadir las claves `NS*UsageDescription` en `Info.plist`.

> **Requiere macOS + Xcode.** En Windows/Linux la carpeta `ios/` queda
> preparada, pero **no se puede compilar ni instalar CocoaPods**. En este entorno
> (Linux) el `pod install` se omitió automáticamente.

### En un Mac
```bash
# 1. Instalar CocoaPods una vez:  sudo gem install cocoapods
npm install
npm run build            # opcional (la app carga contenido remoto)
npx cap sync ios         # ejecuta 'pod install'
npm run ios              # abre ios/App/App.xcworkspace en Xcode
```

### Generar IPA y publicar en App Store
1. En Xcode: seleccionar el target **App** → *Signing & Capabilities* →
   elegir tu *Team* de Apple Developer (cuenta de pago requerida).
2. Subir `MARKETING_VERSION` y `CURRENT_PROJECT_VERSION` (Xcode → General).
3. *Product → Destination →* “Any iOS Device (arm64)”.
4. *Product → Archive*.
5. En el Organizer: *Distribute App → App Store Connect → Upload*.
6. En [App Store Connect](https://appstoreconnect.apple.com): crear la app con
   Bundle ID `com.klickland.app`, completar ficha, capturas, política de
   privacidad y *App Privacy*, y enviar a revisión.

Detalle oficial: <https://capacitorjs.com/docs/ios/deploying-to-app-store>

---

## 9. Iconos y splash screen

Se generaron a partir de **`public/matchapp-logo-circular.png`** (1200×1200),
copiado a `assets/logo.png` y `assets/logo-dark.png`.

Para regenerarlos (p. ej. si cambia el logo, con autorización):

```bash
# reemplaza assets/logo.png y assets/logo-dark.png (mín. 1024×1024) y:
npm run cap:assets
npm run cap:sync
```

### Recursos que convendría aportar (opcional, mejoran el resultado)
| Archivo | Uso | Estado |
|---|---|---|
| `assets/logo.png` 1024²+ | icono + splash (claro) | ✅ presente (logo actual) |
| `assets/logo-dark.png` 1024²+ | icono + splash (oscuro) | ✅ presente (= logo actual) |
| `assets/icon-foreground.png` 1024² con margen | capa frontal del icono adaptativo Android | ❌ opcional — si lo aportas, mejora el recorte del icono |
| `assets/splash.png` 2732² | arte completo del splash | ❌ opcional — hoy se genera centrando el logo sobre color sólido |

No se creó ni modificó ningún logo.

---

## 10. Funcionalidades nativas (preparado, NO instalado)

La arquitectura está lista para añadir, cuando el producto lo requiera:

| Necesidad | Plugin sugerido |
|---|---|
| Push notifications | `@capacitor/push-notifications` (+ Firebase Cloud Messaging) |
| Cámara | `@capacitor/camera` |
| Archivos | `@capacitor/filesystem` |
| Geolocalización | `@capacitor/geolocation` |
| Compartir | `@capacitor/share` |
| Biometría | `@aparajita/capacitor-biometric-auth` |
| Almacenamiento seguro | `@capacitor/preferences` (o Secure Storage) |
| Deep links | `@capacitor/app` (`appUrlOpen`) + Universal/App Links |

Instálalos individualmente + `npx cap sync`. No añadir plugins "por si acaso".

### Detección de plataforma
```ts
import { isNative, isIOS, isAndroid, getPlatform } from '@/lib/platform';

if (isNative()) { /* solo dentro de la app */ }
```
Todo es seguro en SSR (en servidor devuelve `'web'` / `false`).

### Enlaces externos
```ts
import { openExternal } from '@/lib/platform/links';
openExternal('https://instagram.com/...');   // in-app browser en nativo, pestaña en web
```
`NativeShell.tsx` además intercepta clics en `<a>` a dominios externos y los
abre en el navegador in-app, para que una URL externa nunca “secuestre” la app.

---

## 11. Seguridad / variables de entorno

- **No se copió ningún secreto** a `android/` ni `ios/`. El binario solo contiene
  la URL pública `https://udreamms.com` y la pantalla offline.
- Las claves privadas (`STRIPE_SECRET_KEY`, `FIREBASE_PRIVATE_KEY`,
  `WHATSAPP_ACCESS_TOKEN`, `JUPITER_API_KEY`, `META_CAPI_ACCESS_TOKEN`…) viven
  **solo en el servidor** (Vercel / Firebase App Hosting) y se ejecutan en las
  API Routes. La app móvil las consume a través de `https://udreamms.com/api/**`,
  igual que la web.
- Las variables `NEXT_PUBLIC_*` ya son públicas por diseño (van al cliente web).
- `capacitor.config.json` generado dentro de `android/`/`ios/` está en
  `.gitignore` (lo recrea `cap sync`).

---

## 12. Qué necesitas instalar para continuar

### Android
- **Android Studio** (incluye SDK, `sdkmanager`, emulador).
- JDK 17+ (Android Studio trae uno embebido).
- Aceptar licencias del SDK: `sdkmanager --licenses`.
- Definir `ANDROID_HOME` (p. ej. `~/Android/Sdk`) y crear
  `android/local.properties` con `sdk.dir=/ruta/al/Sdk` (Android Studio lo hace
  solo al abrir el proyecto).

### iOS (solo macOS)
- **Xcode** (App Store) + *Command Line Tools*.
- **CocoaPods**: `sudo gem install cocoapods`.
- Cuenta **Apple Developer** de pago para firmar y publicar.

### Google Play / App Store
- Cuenta **Google Play Console** (pago único ~25 USD).
- Cuenta **Apple Developer Program** (99 USD/año).

---

## 13. Estado de las verificaciones (en este entorno Linux)

| Verificación | Resultado |
|---|---|
| `npm install` (Capacitor 7) | ✅ OK |
| `npx tsc --noEmit` (todo el proyecto) | ✅ OK, sin errores |
| `npm run build` (web Next.js) | ✅ OK — 48 rutas, API Routes intactas |
| `npx cap add android` | ✅ OK |
| `npx cap add ios` | ✅ OK (scaffold; `pod install` omitido: sin CocoaPods) |
| `npx cap sync` | ✅ OK |
| `npx cap doctor` → Android | ✅ “Android looking great” |
| `npx cap doctor` → iOS | ⚠️ “Xcode is not installed” (esperado en Linux) |
| Iconos + splash (`cap:assets`) | ✅ generados para Android e iOS |
| Compilar APK/AAB | ⚠️ No ejecutado — falta Android SDK en este entorno |
| Compilar IPA | ⚠️ No ejecutado — requiere macOS + Xcode |
| `npm run lint` | ⚠️ El script `next lint` fue removido en Next 16 (preexistente, ajeno a Capacitor) |

---

## 14. Checklist antes de publicar

- [ ] Web desplegada y estable en `https://udreamms.com`.
- [ ] Probar la app en emulador Android real (`npm run android`).
- [ ] Probar en dispositivo iOS real desde un Mac.
- [ ] Revisar safe-areas en dispositivo con notch / Dynamic Island / barra de gestos.
- [ ] Subir `versionCode`/`versionName` (Android) y `MARKETING_VERSION` (iOS).
- [ ] Keystore de release Android guardado y respaldado.
- [ ] Ficha de tienda, capturas, política de privacidad, App Privacy (iOS).
- [ ] Si se añaden plugins nativos (push, cámara…): declarar permisos y
      `NS*UsageDescription`.
