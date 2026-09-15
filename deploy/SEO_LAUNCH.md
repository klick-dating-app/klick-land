# SEO — Lanzamiento en Google Search Console

Checklist tras desplegar en Vercel (producción en `https://klick.com`).

## Dominio canónico en Vercel (obligatorio, una sola vez)

En **Vercel → Project → Settings → Domains**:

1. Añade `klick.com` y `www.klick.com` si faltan.
2. Elige **un** dominio principal (recomendado: `klick.com` sin www).
3. En el otro dominio, usa la opción de Vercel **Redirect to** el principal (no configures lo mismo en `next.config.mjs`).
4. Si ves `ERR_TOO_MANY_REDIRECTS`, suele ser apex y www redirigiendo uno al otro: deja el redirect **solo en Vercel**, no en código.

## Verificación técnica (5 min)

- [ ] `https://klick.com/` → 200
- [ ] `https://www.klick.com/` → 301 **una vez** al dominio principal (sin bucle)
- [ ] `https://klick.com/robots.txt` → incluye `Sitemap: https://klick.com/sitemap.xml`
- [ ] `https://klick.com/sitemap.xml` → 14 URLs públicas
- [ ] `https://klick.com/cso` → 301 a `/`
- [ ] Vercel → Domains: `klick.com` + `www` con SSL válido

## Google Search Console

1. Propiedad: `https://klick.com` (o dominio `klick.com` con TXT en Squarespace).
2. **Sitemaps** → enviar `https://klick.com/sitemap.xml`.
3. **Inspección de URLs** → probar e indexar (una por una, “Solicitar indexación”):
   - `https://klick.com/`
   - `https://klick.com/membership/vip`
   - `https://klick.com/membership/basic`
   - `https://klick.com/about`
   - `https://klick.com/contact`
   - `https://klick.com/features`
   - `https://klick.com/safe-dates`
   - `https://klick.com/education`
   - `https://klick.com/guides`
   - `https://klick.com/partnerships`
   - `https://klick.com/referrals`
   - `https://klick.com/faqs`
   - `https://klick.com/privacidad`
   - `https://klick.com/terminos`
4. **Páginas** → revisar 404; por cada URL antigua con tráfico, añadir 301 en `next.config.mjs` y volver a solicitar indexación.
5. No uses “Eliminación temporal” salvo URLs que deban desaparecer ya (sin sustituto).

### Favicon / logo en resultados de Google

Google **cachea el favicon durante semanas** (a veces 2–4+). No se actualiza al instante al cambiar el sitio.

Tras el deploy, comprueba en el navegador:

- `https://klick.com/icons/new-icon-klick.png` → imagen nueva (200)
- `https://klick.com/favicon.ico` → generado por Next desde `src/app/icon.png`

Luego en GSC → **Inspección de URLs** → `https://klick.com/` → **Probar URL publicada** → **Solicitar indexación**.

El icono rojo con ave es el favicon **antiguo de Hostinger** guardado por Google hasta que vuelva a rastrear.

## Firebase (mismo dominio)

- Auth → dominios autorizados: `klick.com`, `www.klick.com`.
- No desplegar Firebase Hosting en el mismo dominio que Vercel.

## Mantenimiento

- Rutas públicas nuevas: añadir en `src/lib/seo.ts` (`PUBLIC_SITEMAP_ROUTES` + `PAGE_SEO`) y crear `layout.tsx` con `pageMetadata`.
- Rutas privadas: `noindexMetadata` en su `layout.tsx` + `disallow` en `robots.ts` si aplica.
