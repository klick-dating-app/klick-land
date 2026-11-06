import type { Metadata } from 'next';
import { SiteShell, Prose, SUPPORT_EMAIL } from '@/components/site/SiteShell';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata('Eliminar cuenta', 'Cómo eliminar tu cuenta de Klick y tus datos.');

export default function DeleteAccountPage() {
  return (
    <SiteShell>
      <Prose title="Eliminar tu cuenta y datos">
        <h2>Desde la app</h2>
        <p>Abre Klick → Perfil → <strong>Eliminar mi cuenta</strong>. La eliminación es inmediata y permanente.</p>
        <h2>Qué se elimina</h2>
        <ul>
          <li>Perfil, cuestionario y fotos.</li>
          <li>Matches, mensajes y planes de Safe First Date.</li>
          <li>Tokens de notificaciones y selfie de verificación.</li>
          <li>Tu cuenta de acceso.</li>
        </ul>
        <h2>Qué podemos conservar</h2>
        <p>Reportes de seguridad en los que participaste y registros de facturación que la ley nos exige guardar.</p>
        <h2>Sin acceso a la app</h2>
        <p>Escribe a <a className="text-primary underline" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> desde el correo de tu cuenta.</p>
      </Prose>
    </SiteShell>
  );
}
