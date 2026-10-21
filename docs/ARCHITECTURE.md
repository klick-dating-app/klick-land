# Arquitectura de Klick

```
┌────────────────────────────── Cliente ───────────────────────────────┐
│ Next.js 16 (export estático)  →  out/                                │
│   ├─ Firebase Hosting  (web: landing, legales, app en /app/*)        │
│   └─ Capacitor 7       (empaquetado en iOS + Android, sin servidor)  │
└───────────────┬───────────────────────────────┬──────────────────────┘
                │ lecturas / chat (SDK)         │ acciones (callables)
        ┌───────▼────────┐               ┌──────▼───────────────────────┐
        │ Cloud Firestore│◄──────────────│ Cloud Functions (Node 20)    │
        │ + Storage      │  Admin SDK    │  saveProfile  getCandidates  │
        │ + Auth         │               │  swipe  block/report/delete  │
        └───────▲────────┘               │  Stripe checkout + webhook   │
                │ reglas de seguridad    │  push (FCM) + recordatorios  │
                └────────────────────────┴──────────────────────────────┘
```

## Principios
1. **El cliente casi no escribe.** Perfil, swipes, matches, bloqueos, reportes y entitlements solo los escribe el servidor (`firestore.rules` → `allow write: if false`). El cliente únicamente envía mensajes y planes de Safe Date.
2. **Gating en el servidor.** `getCandidates` aplica puertas de seguridad, filtros indispensables (en ambos sentidos), distancia y el umbral del 60 %. El cuestionario profundo (`users/{uid}/restricted/details`) solo lo lee quien tenga `entitlements.canViewDetails`.
3. **Pagos = webhook.** Solo `stripeWebhook` concede planes; el cliente no puede auto-asignarse un plan.
4. **Privacidad.** Ubicación redondeada a ~1 km; fecha de nacimiento y correo en `users/{uid}/private/info`; el selfie de verificación se borra tras aprobarse.

## Modelo de datos (Firestore)
| Ruta | Quién escribe | Contenido |
|---|---|---|
| `users/{uid}` | Functions | Perfil público (nombre, edad, fotos, ciudad, `verified`, `safetyStatus`) |
| `users/{uid}/restricted/details` | Functions | Cuestionario de compatibilidad |
| `users/{uid}/private/info` | Functions | `dob`, `email` |
| `users/{uid}/swipes/*`, `blocks/*` | Functions | Likes/pass y bloqueos |
| `users/{uid}/devices/{token}` | Cliente | Tokens FCM |
| `entitlements/{uid}` | Functions | `plan`, `canChat`, `canViewDetails` |
| `matches/{id}` (+ `/messages`) | Functions / Cliente (mensajes) | Match y chat |
| `safeDates/{id}` (+ `/private/contact`) | Cliente | Plan de primera cita y contacto de confianza |
| `reports/*`, `verifications/*`, `billing/*` | Functions | Trust & Safety y Stripe |

## Motor de compatibilidad
`functions/src/lib/compat.ts` — 10 categorías (43 pts → 0–100). Puertas: seguridad, edad, distancia, templo, matrimonio e hijos indispensables (mutuas). Umbral de match: 60 %.

## Roadmap técnico
- Fase 2 (Solana/USDC): módulo de pagos adicional que escriba `entitlements` igual que Stripe.
- Compras in-app para iOS (StoreKit/RevenueCat) escribiendo también `entitlements`.
- Escala del feed: pasar de consulta+filtro a geohash + precálculo programado.
