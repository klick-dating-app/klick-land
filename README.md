# 💘 KLICK! — Dating & Relationship Platform

> **SafeMeet.Ut LLC** — Plataforma de citas y relaciones enfocada en **seguridad, verificación KYC, algoritmo de compatibilidad profunda (0–100%), educación relacional y Safe First Date**.

---

## 📖 Documentación Principal

Toda la especificación técnica, ejecutiva y de diseño está centralizada en la carpeta [`docs/`](docs/):

1. **[Resumen Ejecutivo del Proyecto](docs/01_RESUMEN_EJECUTIVO_KLICK.md)** — Visión del CEO Juan Carlos Llumipanta, mercado LDS en Utah, modelo de negocio e impacto.
2. **[Documento de Alcanzables y Entregables por Fases](docs/02_ALCANZABLES_Y_ENTREGABLES_FASES.md)** — Alcance exacto de la **Fase 1 (Web2 Google Cloud / Firebase)** y la **Fase 2 (Web3 Solana Híbrido)**.
3. **[Diagramas de Funciones, Flujos y Arquitectura](docs/03_DIAGRAMA_DE_FUNCIONES_Y_ARQUITECTURA.md)** — Diagramas de flujo (Mermaid): motor de matching, Safe First Date, arquitectura y entitlements.
4. **[Especificación Técnica de Desarrollo (Dev Specs)](docs/04_ESPECIFICACION_TECNICA_DEV_SPECS.md)** — Especificación exhaustiva (Hojas 00 a 10 de Excel): filtros F-001..031, módulos DEV-001..020, controles de seguridad y pruebas de aceptación AT-001..015.

---

## 🏗️ Estructura del Repositorio

| Carpeta / Archivo | Rol en el Proyecto |
| :--- | :--- |
| [`docs/`](docs/) | Documentación ejecutiva, técnica, diagramas y especificación del algoritmo. |
| [`src/app/`](src/app/) | Rutas y pantallas Next.js (App Router) + API endpoints. |
| [`src/backend/`](src/backend/) | Lógica del servidor: Firebase Admin, Stripe, gestión de pagos y entitlements. |
| [`src/components/`](src/components/) | Componentes visuales UI (Tailwind CSS, shadcn/ui). |
| [`functions/`](functions/) | Firebase Cloud Functions (Matching engine, notificaciones FCM, moderación). |
| [`android/`](android/) & [`ios/`](ios/) | Proyecto móvil compilado con Capacitor. |
| [`.env.example`](.env.example) | Plantilla limpia y documentada de variables de entorno requeridas. |

---

## 🚀 Puesta en Marcha en Desarrollo

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env.local

# 3. Iniciar servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.
