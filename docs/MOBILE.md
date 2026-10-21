# Apps iOS y Android (Capacitor 7)

La app **empaqueta** el build estático de Next.js (`out/`); no depende de un sitio remoto.

```bash
npm run cap:sync     # build + copia a android/ e ios/
npm run android      # abre Android Studio
npm run ios          # abre Xcode (solo macOS)
```

- Bundle/ID: `com.klickland.app` (cámbialo antes de publicar si usarás otro: `capacitor.config.ts`, `android/app/build.gradle`, Xcode).
- Android: minSdk 23, permisos `INTERNET`, `CAMERA`, `ACCESS_COARSE_LOCATION`, `POST_NOTIFICATIONS`; tráfico en claro desactivado.
- iOS: iOS 14+, descripciones de cámara/fotos/ubicación en `Info.plist`; push vía FirebaseMessaging (pod incluido).
- Desarrollo con recarga: `CAP_SERVER_URL=http://<IP-LAN>:3000 npx cap sync` y `npm run dev`.

## Android — AAB para Google Play
1. `keytool -genkey -v -keystore klick-release.keystore -alias klick -keyalg RSA -keysize 2048 -validity 10000` (guárdalo fuera del repo).
2. Crea `android/keystore.properties` (ignorado por git) con `storeFile`, `storePassword`, `keyAlias`, `keyPassword` y referencia el bloque `signingConfigs` en `android/app/build.gradle`.
3. Copia `google-services.json` a `android/app/`.
4. `npm run cap:sync && cd android && ./gradlew bundleRelease` → `app/build/outputs/bundle/release/app-release.aab`.

## iOS — App Store
1. En un Mac: `sudo gem install cocoapods && npm install && npm run cap:sync`.
2. Xcode → target **App** → Signing & Capabilities: tu Team; añade **Push Notifications** y **Background Modes → Remote notifications**.
3. Añade `GoogleService-Info.plist` al target.
4. Product → Archive → Distribute App → App Store Connect.

## Requisitos de las tiendas ya cubiertos
Eliminación de cuenta dentro de la app y en web (`/delete-account`), reportar/bloquear en perfiles y chats, política de privacidad y términos, verificación de edad ≥ 18, permisos con descripción.
