import type { Metadata } from 'next';
import { SiteShell, Prose } from '@/components/site/SiteShell';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata('Safe First Date', 'Cómo Klick te protege antes, durante y después de tu primera cita.');

export default function SafeDatesPage() {
  return (
    <SiteShell>
      <Prose title="Safe First Date">
        <p>La seguridad no es una función extra en Klick: es parte de cada paso, desde el registro hasta la primera cita.</p>
        <h2>Antes de la cita</h2>
        <ul>
          <li>Conversa dentro de Klick; no compartas tu teléfono, dirección ni datos financieros hasta sentirte segura/o.</li>
          <li>Prefiere perfiles verificados (insignia verde) y revisa el Common Ground.</li>
          <li>Planea la cita desde el chat: elegimos con ustedes un lugar público y en horario diurno.</li>
          <li>Agrega un contacto de confianza (solo tú lo ves) y avísale dónde y con quién estarás.</li>
        </ul>
        <h2>Durante la cita</h2>
        <ul>
          <li>Una hora antes te enviamos un recordatorio con el plan.</li>
          <li>Confirma con un toque que llegaste bien. Si no confirmas, te preguntamos si todo está bien.</li>
          <li>Ve y regresa por tus propios medios. Mantén tu teléfono cargado.</li>
          <li>El botón de emergencia llama al 911 en un toque.</li>
        </ul>
        <h2>Después de la cita</h2>
        <ul>
          <li>Reporta o bloquea a cualquier persona en cualquier momento; el equipo de Trust &amp; Safety revisa cada reporte.</li>
          <li>Tras varios reportes de personas distintas, las cuentas se restringen automáticamente mientras se revisan.</li>
        </ul>
      </Prose>
    </SiteShell>
  );
}
