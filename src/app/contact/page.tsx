import type { Metadata } from 'next';
import { SiteShell, Prose, SUPPORT_EMAIL } from '@/components/site/SiteShell';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata('Contacto', 'Escribe al equipo de soporte y Trust & Safety de Klick.');

export default function ContactPage() {
  return (
    <SiteShell>
      <Prose title="Contacto">
        <p>Soporte, prensa y consultas de privacidad: <a className="text-primary underline" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a></p>
        <p>Para reportar a una persona usa el botón de escudo dentro de la app: es la vía más rápida porque bloquea al instante y llega a Trust &amp; Safety.</p>
        <p>En una emergencia llama al 911.</p>
      </Prose>
    </SiteShell>
  );
}
