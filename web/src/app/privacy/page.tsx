import type { Metadata } from 'next';
import { SiteShell, Prose, SUPPORT_EMAIL } from '@/components/site/SiteShell';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata('Política de privacidad', 'Qué datos recopila Klick, para qué los usa y cómo los proteges.');

export default function PrivacyPage() {
  return (
    <SiteShell>
      <Prose title="Política de privacidad" updated="2026">
        <p>SafeMeet.Ut LLC («Klick») respeta tu privacidad. Esta política describe qué datos tratamos y tus derechos.</p>
        <h2>Datos que recopilamos</h2>
        <ul>
          <li>Cuenta: correo electrónico y fecha de nacimiento (para verificar que eres mayor de 18 años).</li>
          <li>Perfil: nombre, género, fotos, biografía, ciudad y ubicación aproximada (~1 km).</li>
          <li>Cuestionario de compatibilidad: fe, matrimonio, familia, idiomas, estilo de vida e intereses. Son datos sensibles que usas voluntariamente.</li>
          <li>Actividad: likes, matches, mensajes y planes de Safe First Date.</li>
          <li>Seguridad: selfie de verificación (se elimina tras la revisión), reportes y bloqueos.</li>
          <li>Dispositivo: token de notificaciones push y datos de uso anónimos (analítica).</li>
        </ul>
        <h2>Cómo los usamos</h2>
        <ul>
          <li>Calcular compatibilidad y mostrarte perfiles.</li>
          <li>Operar chats, notificaciones y Safe First Date.</li>
          <li>Prevenir fraude y abuso, y revisar reportes.</li>
          <li>Procesar suscripciones a través de Stripe (no almacenamos datos de tu tarjeta).</li>
        </ul>
        <h2>Con quién los compartimos</h2>
        <p>Otros usuarios ven tu perfil público y, según el plan, partes de tu cuestionario. Usamos proveedores (Google Cloud/Firebase, Stripe) como encargados del tratamiento. No vendemos tus datos.</p>
        <h2>Tus derechos</h2>
        <p>Puedes editar tus datos en la app, eliminar tu cuenta desde Perfil o solicitarlo en <a className="text-primary underline" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>. Conservamos únicamente lo exigido por ley.</p>
        <h2>Menores</h2>
        <p>Klick es solo para mayores de 18 años. Eliminamos cuentas de menores.</p>
        <p className="text-xs">Documento base: debe ser revisado por asesoría legal antes del lanzamiento.</p>
      </Prose>
    </SiteShell>
  );
}
