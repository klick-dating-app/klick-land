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
| `/web/login`, `/web/onboarding`, `/web/feed` | Pantalla grande: login centrado; feed con menú lateral + panel de compatibilidad |
| `/app/login`, `/app/onboarding`, `/app/feed` | Marco móvil (y lo que abre Capacitor): botones abajo, barra inferior |

- Los archivos de `src/app/web/*` y `src/app/app/*` son **solo rutas finas**: eligen `variant`/`layout` (`'web' | 'app'`) y navegan. Toda la UI vive una sola vez en `src/components/klick/`; un cambio se ve en ambas. Lo que deba diferir se resuelve con esa prop, nunca copiando componentes.
- URLs centralizadas en `src/lib/klick/routes.ts` (`loginHref`, `onboardingHref`, `feedHref`). `?perfil=hombre|mujer` abre los perfiles de ejemplo sin sesión.

### Registro real (web) — código listo, falta desplegar
1. `/web/login` → Google (`signInWithPopup`; los demás proveedores dicen "disponible pronto"; correo/contraseña también funciona).
2. Sin perfil → `/web/onboarding` (`OnboardingFlow`, mismos pasos que la app). `BasicInfoStep` pide nombre (prellenado de Google), nacimiento (≥18), género, ciudad y estado.
3. Al terminar, `lib/klick/save-profile.ts`: reduce y sube fotos a Storage `profiles/{uid}/…`, traduce las preferencias de la UI al `Questionnaire` y llama a la callable `saveProfile` (el cliente nunca escribe `users/`). Sin geolocalización usa coords de Salt Lake City.
4. `AuthContext` detecta `profile.onboarded` → `/web/feed`. `FeedPage` exige sesión + perfil salvo con `?perfil=`.
5. `KlickAppContext` (dentro de `AuthProvider` en `app/layout.tsx`) usa el perfil real como `currentUser` y fija el molde: mujer → `female`; hombre → `male_premium` si `entitlement.canChat`, si no `male_free`. Con sesión, `WebShell` oculta el selector Hombre/Mujer y muestra "Sign out".
- **Sigue siendo de ejemplo:** candidatos, matches, chats y citas del feed (falta conectar `getCandidates`/`swipe`/`useKlickData`), y el cuestionario del perfil propio. En `/app/*` el login aún no autentica.

### Despliegue pendiente (retomar aquí)
Nada de lo anterior está publicado en Firebase todavía. `database/firestore.rules`, `storage.rules` y `firestore.indexes.json` se restauraron con las reglas de Klick (commit `e929564`; las del monorepo eran de otro producto) pero **no se han desplegado**.
1. Consola Firebase → Authentication → Sign-in method → **habilitar Google**; añadir el dominio de Vercel en Authorized domains.
2. Desplegar con la cuenta dueña de `klick-513516` (la CLI local está logueada como `udreamms@gmail.com`, que no ve el proyecto):
   ```bash
   npx firebase-tools login:add
   npx firebase-tools deploy --only firestore,storage --project klick-513516
   npx firebase-tools deploy --only functions:saveProfile,functions:getCandidates,functions:swipe,functions:blockUser,functions:unblockUser,functions:reportUser,functions:requestVerification,functions:deleteAccount,functions:onMessageCreated --project klick-513516
   ```
   (Stripe y `safeDateReminders` quedan fuera: necesitan secretos / Cloud Scheduler.) Si hay varias cuentas, añadir `--account <correo>`.
3. Alternativa: dar a `firebase-adminsdk-fbsvc@klick-513516.iam.gserviceaccount.com` roles mínimos (Service Usage Consumer, Firebase Rules Admin, Cloud Datastore Index Admin, Cloud Functions Admin, Service Account User) y desplegar con la clave. Hoy esa cuenta solo tiene `firebaserules.releases.update` y su clave quedó expuesta en una conversación: **rotarla** y retirar roles extra al terminar.
4. Probar: registro con Google → onboarding → feed con el perfil propio; revisar `users/{uid}`, `entitlements/{uid}` y `profiles/{uid}/` en la consola.

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
1) Desplegar (ver "Despliegue pendiente") y probar el registro con Google. 2) Conectar candidatos/matches/chats/citas de `components/klick` a la capa real (`getCandidates`, `swipe`, `useKlickData`) y retirar `KlickAppContext`. 3) Login real en `/app/*`. Además: decidir el flujo de pagos de la landing (`/membership`, `/instructions-payment-*`, `/crypto-pay`, API routes de QR/Stripe/Solana); revisar y limpiar `web/src/frontend/` (código legacy sin revisar); Stripe real; pruebas de reglas en emulador; compras in-app iOS; panel de administración; revisión legal; publicación en tiendas. Ver `docs/ENTREGA.md`.
