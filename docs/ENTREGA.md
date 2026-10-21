# Guía de entrega — qué falta y cómo se conecta

El código está completo y compila (`npm run typecheck`, `npm run build`, `functions` con `tsc`). Lo que falta son **cuentas, credenciales y pruebas en dispositivo**.

## 1. Lo que debes entregar (checklist)

### Google Cloud / Firebase (imprescindible)
- [ ] **Proyecto Firebase nuevo y exclusivo de Klick** (plan Blaze). `.firebaserc` hoy apunta a `REPLACE_WITH_KLICK_FIREBASE_PROJECT_ID`.
      ⚠ No reutilices `udreamms-platform-1`: las reglas de Klick sobrescribirían las del otro producto.
- [ ] Activar: Authentication (Email/Password), Firestore (modo producción, `nam5`), Storage, Cloud Functions, Cloud Messaging, Hosting.
- [ ] Config web de la app → rellenar `.env.local` (plantilla en `.env.example`).
- [ ] `google-services.json` (Android) → `android/app/`.
- [ ] `GoogleService-Info.plist` (iOS) → `ios/App/App/` y añadirlo al target en Xcode.
- [ ] Clave APNs (.p8) subida en Firebase → Cloud Messaging.

### Stripe
- [ ] Productos/precios mensuales Básico ($19.99), Premium ($39.99) y anual VIP ($199) → IDs en `functions/.env.<proyecto>` (ver `functions/.env.example`).
- [ ] Secretos: `firebase functions:secrets:set STRIPE_SECRET_KEY` y `STRIPE_WEBHOOK_SECRET`.
- [ ] Webhook de Stripe → URL de la función `stripeWebhook`, eventos: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`.
- [ ] Activar el Customer Portal en Stripe.

### Tiendas
- [ ] Apple Developer Program (99 USD/año) + un Mac con Xcode para compilar iOS.
- [ ] Google Play Console (25 USD) + keystore de release (guía en `docs/MOBILE.md`).
- [ ] Dominio final (hoy placeholder `klick.app`), correo de soporte, textos legales revisados por abogado, capturas y ficha de tienda.

## 2. Primer despliegue (cuando tengas el proyecto)

```bash
firebase use --add                 # elige el proyecto y alias
npm install && npm --prefix functions install
cp .env.example .env.local         # rellena
npm run deploy:rules               # Firestore + Storage (reglas e índices)
npm run deploy:functions
npm run deploy:web                 # build estático + Hosting
```

Primer administrador (para revisar verificaciones y reportes):
```bash
cd functions && GOOGLE_APPLICATION_CREDENTIALS=sa.json node scripts/set-admin.mjs <uid>
```

## 3. Lo que NO está hecho / decisiones abiertas
1. **Pruebas de reglas en emulador**: no se pudieron ejecutar (el entorno no tiene Java). Corre `firebase emulators:start` y prueba antes de lanzar.
2. **Pagos en iOS**: Apple exige compras dentro de la app para contenido digital. En iOS la pantalla de planes muestra «próximamente»; falta integrar StoreKit/RevenueCat escribiendo en `entitlements` (la arquitectura ya lo permite).
3. **Sign in with Apple / Google**: hoy el acceso es correo + contraseña. Si añades Google, Apple obliga a ofrecer también Sign in with Apple.
4. **Panel de administración**: existen las funciones (`adminReviewVerification`, `adminResolveReport`) pero no una interfaz. Se puede revisar desde la consola mientras tanto.
5. **Moderación automática de fotos (Vertex AI / Cloud Vision)** y **KYC de terceros**: la verificación actual es selfie + revisión humana.
6. **Contacto de confianza**: se guarda y se muestra solo a quien creó la cita; no se envían SMS (requeriría Twilio u otro proveedor).
7. **Feed a escala**: `getCandidates` evalúa hasta 300 perfiles por petición; con miles de usuarios habrá que pasar a geohash/precálculo.
8. **Textos legales**: son una base; requieren revisión legal.
9. **Compilación nativa** (APK/AAB/IPA): no se puede hacer en este entorno (sin Android SDK ni macOS). Ver `docs/MOBILE.md`.
