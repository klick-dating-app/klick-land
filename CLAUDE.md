# CLAUDE.md — Klick

App de citas segura (SafeMeet.Ut LLC). Una base de código para **web + iOS + Android**. Idioma de UI y docs: español.

## Comandos
```bash
npm run install:all
npm run dev                  # Next.js en :3000 (necesita web/.env.local)
npm run verify               # typecheck + tests de functions + build (lo que corre el CI)
npm run typecheck            # tsc de la app
npm run backend:build        # tsc de Cloud Functions
npm run backend:test         # tests del motor de compatibilidad (node:test)
npm run cap:sync             # build + copia a android/ e ios/
npm run deploy:rules | deploy:functions
firebase emulators:start     # auth, firestore, storage, functions (requiere Java)
```

## Arquitectura
- **Tres piezas:** `web/` (Next.js 16: landing + app de citas, también empaquetada en Capacitor), `backend/` (Cloud Functions: única pieza que escribe datos sensibles y valida) y `database/` (reglas + índices). Proyecto Firebase: `klick-513516`.
- **Despliegue web actual: Vercel** (Root Directory = `web`). Por eso hoy hay `redirects()` en `next.config.mjs` y algunas API routes de pagos. Firebase Hosting / export estático quedan para cuando se empaquete la app nativa.
- **El cliente casi no escribe en Firestore.** Perfil, swipes, matches, bloqueos, reportes y entitlements los escribe solo Cloud Functions (`database/firestore.rules`: `allow write: if false`). El cliente solo envía **mensajes** y **safeDates** (y tokens FCM).
- **Entitlements** (`entitlements/{uid}`) los concede únicamente el webhook de Stripe / `saveProfile`. Las mujeres son gratis y completas; hombres gratis solo exploran.
- **Privacidad:** ubicación redondeada a ~1 km; `dob`/email en `users/{uid}/private/info`; cuestionario en `users/{uid}/restricted/details`.

## App de citas: una UI, dos superficies
| Ruta | Qué es |
|---|---|
| `/web/login`, `/web/feed` | Pantalla grande: login centrado; feed con menú lateral + panel de compatibilidad |
| `/app/login`, `/app/onboarding`, `/app/feed` | Marco móvil (y lo que abre Capacitor): botones abajo, barra inferior |

- Los archivos de `src/app/web/*` y `src/app/app/*` son **solo rutas finas**: eligen `variant`/`layout` (`'web' | 'app'`) y navegan. Toda la UI vive una sola vez en `src/components/klick/`; un cambio se ve en ambas. Lo que deba diferir se resuelve con esa prop, nunca copiando componentes.
- URLs centralizadas en `src/lib/klick/routes.ts` (`loginHref`, `feedHref`). `?perfil=hombre|mujer` abre los perfiles de ejemplo.
- **Estado de los datos:** la UI usa hoy datos de ejemplo (`src/context/KlickAppContext.tsx` + `lib/klick/mock-profiles.ts`). La capa real ya existe (`AuthContext`, `hooks/useKlickData.ts`, `lib/api.ts` → backend) y falta conectarla a la UI. El login web sí autentica con Firebase.

## Estructura
```
web/src/app/                 / (landing) · páginas públicas · web/* y app/* (app de citas) · api/ (pagos, Meta)
web/src/components/klick/    auth/KlickAuthFlow · onboarding/(OnboardingFlow + *Step) · main/(KlickMain, WebShell, FeedPage, sections/, modals/, badges)
web/src/components/landing/  secciones de la landing     ui/ = primitivas     native/ = Capacitor     payments/ = flujo de planes
web/src/context/             AuthContext (sesión real) · KlickAppContext (datos de ejemplo de la UI)
web/src/hooks/useKlickData.ts  suscripciones Firestore (las páginas no llaman onSnapshot)
web/src/lib/                 firebase.ts · api.ts (callables) · types.ts · klick/ (routes, options, compatibility-engine, mock-profiles) · platform/
backend/src/                 index (exporta SOLO funciones Klick) · profile · discovery · safety · billing · triggers · lib/{compat,common,geo,types}
```

## Convenciones
- Nueva acción sensible = **callable** en `backend/src/` (y exportarla en `index.ts`) + wrapper en `web/src/lib/api.ts` + regla en `database/firestore.rules`.
- Lecturas en tiempo real = hook en `web/src/hooks/useKlickData.ts`; las páginas solo renderizan.
- Valida todo input en el servidor; nunca confíes en edad, género o plan enviados por el cliente.
- **Tipos duplicados a propósito**: `web/src/lib/types.ts` y `backend/src/lib/types.ts`. Si cambias uno, cambia el otro.
- Algoritmo: la fuente de verdad es `backend/src/lib/compat.ts` (+ `compat.test.ts`). `web/src/lib/klick/compatibility-engine.ts` solo alimenta los datos de ejemplo.
- Nuevas consultas compuestas → índice en `database/firestore.indexes.json`.
- Código nativo solo vía `web/src/lib/platform/*` (`isNative()` = solo Capacitor; para ver la app en el navegador usa `/app/login`).
- Estilo: Tailwind, dark por defecto, safe-areas con `pt-safe`/`pb-safe`. Comentarios solo para el *por qué*.

## No hacer
- No crear rutas o componentes paralelos para web y app (`/demo`, `?app=true`, `MobileX` vs `WebX`): una UI en `components/klick/` + prop de superficie.
- No commitear `.env*`, `backend/service-account-key.json`, `google-services.json`, `GoogleService-Info.plist`, keystores ni claves de Stripe (secretos en Secret Manager).
- No desplegar a un proyecto Firebase compartido.

## Pendientes
Conectar la UI de `components/klick` a la capa real (auth + Firestore + callables) y retirar `KlickAppContext`; decidir el flujo de pagos de la landing (`/membership`, `/instructions-payment-*`, `/crypto-pay`, API routes de QR/Stripe/Solana); onboarding en web; Stripe real; pruebas de reglas en emulador; compras in-app iOS; panel de administración; revisión legal; publicación en tiendas. Ver `docs/ENTREGA.md`.
