# CLAUDE.md — Klick

App de citas segura (SafeMeet.Ut LLC). Una base de código para **web + iOS + Android**. Idioma de UI y docs: español.

## Comandos
```bash
npm install && npm --prefix functions install
npm run dev                  # Next.js en :3000 (necesita .env.local)
npm run verify               # typecheck + tests de functions + build estático (lo que corre el CI)
npm run typecheck            # tsc de la app
npm run functions:build      # tsc de Cloud Functions
npm run functions:test       # tests del motor de compatibilidad (node:test)
npm run cap:sync             # build + copia a android/ e ios/
npm run deploy:rules | deploy:functions | deploy:web
firebase emulators:start     # auth, firestore, storage, functions (requiere Java)
```

## Arquitectura (resumen; detalle en docs/ARCHITECTURE.md)
- **Next.js 16 con `output: 'export'`** → `out/` se sirve en Firebase Hosting y se empaqueta en Capacitor 7. **No hay servidor Next**: nada de API routes, `getServerSideProps`, `headers()/redirects()` en `next.config.mjs` ni rutas dinámicas `[id]` (usa query params + `Suspense`, ej. `/app/chat/?id=`). Redirecciones/cabeceras van en `firebase.json`.
- **El cliente casi no escribe en Firestore.** Perfil, swipes, matches, bloqueos, reportes y entitlements los escribe solo Cloud Functions (`firestore.rules`: `allow write: if false`). El cliente solo envía **mensajes** y **safeDates** (y tokens FCM).
- **Entitlements** (`entitlements/{uid}`) los concede únicamente el webhook de Stripe / `saveProfile`. Las mujeres son gratis y completas; hombres gratis solo exploran.
- **Privacidad:** ubicación redondeada a ~1 km; `dob`/email en `users/{uid}/private/info`; cuestionario en `users/{uid}/restricted/details` (lectura condicionada a `canViewDetails` en las reglas).

## Estructura
```
src/app/              rutas: / (landing), legales, login, /app/* (app protegida por app/layout.tsx)
src/components/ui/    primitivas (solo button, KlickLogo; añade shadcn con CLI cuando haga falta)
src/components/app/   UI de la app (form.tsx, SafetyMenu)   site/ = shell de web pública   native/ = Capacitor
src/context/          AuthContext: sesión + perfil + entitlement en tiempo real
src/hooks/            useKlickData.ts: TODAS las suscripciones Firestore (las páginas no llaman onSnapshot)
src/lib/              firebase.ts · api.ts (callables tipados) · types.ts · klick/options.ts · platform/ (native, push, location, photo, links)
functions/src/        profile · discovery · safety · billing · triggers · lib/{compat,common,geo,types}
```

## Convenciones
- Nueva acción sensible = **callable** en `functions/src/` + wrapper en `src/lib/api.ts` + regla en `firestore.rules`. No abras escritura de cliente para saltarte esto.
- Lecturas en tiempo real = hook en `src/hooks/useKlickData.ts`; las páginas solo renderizan.
- Valida todo input en el servidor (`str`, `oneOf`, `num` en `functions/src/profile.ts`); nunca confíes en edad, género o plan enviados por el cliente.
- **Tipos duplicados a propósito**: `src/lib/types.ts` y `functions/src/lib/types.ts` (functions se despliega aislado). Si cambias uno, cambia el otro.
- Cambios en el algoritmo: edita `functions/src/lib/compat.ts` y **actualiza `compat.test.ts`**. Puertas duras mutuas; umbral de match 60 %.
- Nuevas consultas compuestas → añade el índice en `firestore.indexes.json`.
- Código nativo solo vía `src/lib/platform/*` (siempre con `isNative()` y `import()` dinámico del plugin; debe funcionar en web).
- Estilo: Tailwind con tokens del tema (`bg-primary`, `text-muted-foreground`), dark por defecto, safe-areas con `pt-safe`/`pb-safe`.
- Comentarios solo para el *por qué*. Textos de UI en español.

## No hacer
- No reintroducir API routes / SSR / dependencias de `server.url` remoto en Capacitor.
- No commitear `.env*`, `google-services.json`, `GoogleService-Info.plist`, keystores ni claves de Stripe (secretos van en Secret Manager: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`).
- No desplegar a un proyecto Firebase compartido: `.firebaserc` debe apuntar a un proyecto exclusivo de Klick.

## Estado y pendientes
Ver `docs/ENTREGA.md` (credenciales, despliegue, decisiones abiertas). Resumen de lo pendiente: proyecto Firebase + Stripe reales, pruebas de reglas en emulador, compras in-app de iOS, sign-in con Apple/Google, panel de administración, moderación automática de fotos, revisión legal de `/privacy` y `/terms`, compilación y publicación en tiendas.
