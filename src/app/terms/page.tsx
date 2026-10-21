import type { Metadata } from 'next';
import { SiteShell, Prose } from '@/components/site/SiteShell';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata('Términos de servicio', 'Condiciones de uso de Klick.');

export default function TermsPage() {
  return (
    <SiteShell>
      <Prose title="Términos de servicio" updated="2026">
        <h2>1. Elegibilidad</h2>
        <p>Debes tener 18 años o más y proporcionar información veraz. Una persona, una cuenta.</p>
        <h2>2. Conducta</h2>
        <ul>
          <li>Prohibido el acoso, la discriminación, las estafas, la suplantación y el contenido sexual explícito.</li>
          <li>No uses Klick con fines comerciales ni para captar usuarios hacia otros servicios.</li>
          <li>Podemos restringir o eliminar cuentas que incumplan estas reglas o pongan en riesgo a otras personas.</li>
        </ul>
        <h2>3. Seguridad</h2>
        <p>Klick ofrece herramientas de seguridad, pero no puede garantizar la conducta de los usuarios. Sigue los consejos de Safe First Date y usa tu criterio.</p>
        <h2>4. Suscripciones</h2>
        <p>Las suscripciones se renuevan automáticamente hasta que las canceles desde la app (Administrar suscripción). Las mujeres tienen acceso gratuito. Los reembolsos se rigen por la política del proveedor de pago.</p>
        <h2>5. Contenido</h2>
        <p>Conservas la propiedad de tu contenido y nos das licencia para mostrarlo dentro del servicio. Debes tener derecho a las fotos que subes.</p>
        <h2>6. Terminación</h2>
        <p>Puedes eliminar tu cuenta en cualquier momento desde Perfil.</p>
        <p className="text-xs">Documento base: debe ser revisado por asesoría legal antes del lanzamiento.</p>
      </Prose>
    </SiteShell>
  );
}
