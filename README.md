# Klick

App de citas segura (SafeMeet.Ut LLC): perfiles verificados, compatibilidad 0–100 %, chat y **Safe First Date**. Una sola base de código para **web, iOS y Android**.

| Capa | Tecnología |
|---|---|
| UI | Next.js 16 (export estático) · React 18 · Tailwind · shadcn/ui |
| Móvil | Capacitor 7 (push, cámara, geolocalización) |
| Backend | Firebase: Auth · Firestore · Storage · Cloud Functions (Node 20) · FCM · Hosting |
| Pagos | Stripe (Checkout + Portal + webhook) |

## Empezar
```bash
npm run install:all
cp web/.env.example web/.env.local     # claves del proyecto Firebase
npm run dev                     # http://localhost:3000
npm run typecheck && npm run backend:build
```

## Documentación
- [docs/ENTREGA.md](docs/ENTREGA.md) — **qué falta entregar y cómo desplegar**
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — arquitectura, modelo de datos y seguridad
- [docs/MOBILE.md](docs/MOBILE.md) — compilar y publicar iOS/Android
- Especificación de producto: [docs/01…07](docs/)

## Estructura (monorepo)
```
web/        Next.js + Capacitor config. Origen de la UI (y futura base de android/ios)
  src/app · src/components · src/context · src/hooks · src/lib
backend/    Cloud Functions (Node 20): perfil, descubrimiento, seguridad, billing, triggers
database/   Firestore rules, índices y Storage rules
android/    proyecto nativo Capacitor (se genera/sincroniza desde web/)
ios/        proyecto nativo Capacitor
docs/       producto, arquitectura, entrega
firebase.json  .firebaserc     orquestan backend + database + hosting (web/out)
package.json                   scripts raíz que delegan a cada carpeta
```

## Despliegue
- **Vercel (web):** Root Directory = `web`. Variables `NEXT_PUBLIC_*` en el panel (ver `web/.env.example`).
- **Firebase:** desde la raíz → `npm run deploy:rules | deploy:functions | deploy:web`.
- **Apps:** `npm run cap:sync`, luego `npm run android` / `npm run ios`.
