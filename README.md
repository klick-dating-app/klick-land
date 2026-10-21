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
npm install && npm --prefix functions install
cp .env.example .env.local      # claves del proyecto Firebase
npm run dev                     # http://localhost:3000
npm run typecheck && npm run functions:build
```

## Documentación
- [docs/ENTREGA.md](docs/ENTREGA.md) — **qué falta entregar y cómo desplegar**
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — arquitectura, modelo de datos y seguridad
- [docs/MOBILE.md](docs/MOBILE.md) — compilar y publicar iOS/Android
- Especificación de producto: [docs/01…07](docs/)

## Estructura
```
src/app/            web pública (landing, legales) y la app en /app/*
src/components/     UI (ui/, app/, site/, native/)
src/context/        AuthContext (sesión + perfil + entitlement en tiempo real)
src/lib/            firebase, api (callables), plataforma nativa, opciones
functions/src/      Cloud Functions: perfil, descubrimiento, seguridad, billing, triggers
firestore.rules  storage.rules  firestore.indexes.json  firebase.json
android/  ios/      proyectos nativos Capacitor
```
