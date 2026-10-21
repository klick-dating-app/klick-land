import type { Metadata } from 'next';
import { SiteShell, Prose } from '@/components/site/SiteShell';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata('Preguntas frecuentes', 'Respuestas sobre cuentas, verificación, compatibilidad, planes y seguridad en Klick.');

const FAQS: Array<[string, string]> = [
  ['¿Klick es gratis?', 'Para las mujeres, sí: acceso completo sin costo. Los hombres pueden explorar perfiles y ver su compatibilidad gratis; para iniciar conversaciones y ver el detalle de fe y matrimonio necesitan un plan.'],
  ['¿Cómo funciona la compatibilidad?', 'Comparamos fe, objetivos de matrimonio, familia, idiomas, estilo de vida, intereses y preferencias de primera cita. Los requisitos marcados como indispensables excluyen perfiles de inmediato y solo se muestran personas con 60 % o más.'],
  ['¿Cómo me verifico?', 'Desde Perfil → Verifica tu identidad, toma un selfie. Nuestro equipo lo revisa y, si se aprueba, tu perfil muestra la insignia de verificado. El selfie se elimina tras la revisión.'],
  ['¿Ven mi ubicación exacta?', 'No. Solo guardamos una ubicación aproximada (~1 km) para calcular distancia y mostrar tu ciudad.'],
  ['¿Cómo reporto a alguien?', 'Toca el escudo en cualquier perfil o chat. Reportamos y bloqueamos al instante; el equipo revisa cada caso.'],
  ['¿Cómo elimino mi cuenta?', 'Perfil → Eliminar mi cuenta. Borra tu perfil, fotos, matches y mensajes. También puedes escribirnos desde la página de contacto.'],
];

export default function FaqsPage() {
  return (
    <SiteShell>
      <Prose title="Preguntas frecuentes">
        {FAQS.map(([q, a]) => (
          <div key={q}><h2>{q}</h2><p>{a}</p></div>
        ))}
      </Prose>
    </SiteShell>
  );
}
