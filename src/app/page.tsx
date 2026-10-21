import Link from 'next/link';
import { BadgeCheck, CalendarHeart, HeartHandshake, Lock, ShieldCheck, Sparkles } from 'lucide-react';
import { SiteShell } from '@/components/site/SiteShell';
import { PLANS } from '@/lib/klick/options';

const FEATURES = [
  { Icon: BadgeCheck, title: 'Perfiles verificados', text: 'Verificación de identidad con selfie y moderación de fotos. Menos perfiles falsos, más conexiones reales.' },
  { Icon: Sparkles, title: 'Compatibilidad de 0 a 100 %', text: 'Fe, matrimonio, familia, idiomas, estilo de vida e intereses. Solo ves personas con 60 % o más.' },
  { Icon: HeartHandshake, title: 'Common Ground', text: 'Te mostramos lo que realmente tienen en común para que la primera conversación sea fácil.' },
  { Icon: CalendarHeart, title: 'Safe First Date', text: 'Lugar público, recordatorios, check-in de llegada y contacto de confianza en cada primera cita.' },
  { Icon: ShieldCheck, title: 'Reporta y bloquea', text: 'Reportes y bloqueo instantáneos en cada perfil y chat, con revisión humana.' },
  { Icon: Lock, title: 'Tu privacidad primero', text: 'Nunca mostramos tu ubicación exacta. Puedes eliminar tu cuenta y datos en cualquier momento.' },
];

export default function Home() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-5xl px-5 py-20 text-center">
        <p className="mb-4 inline-block rounded-full border border-primary/40 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-primary">Citas seguras · Utah</p>
        <h1 className="text-4xl font-extrabold leading-tight sm:text-6xl">Conecta con intención.<br /><span className="text-primary">Haz Klick</span> con seguridad.</h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">Klick combina verificación de identidad, un algoritmo de compatibilidad profunda y un protocolo de primera cita segura para relaciones que van en serio.</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/login/" className="rounded-full bg-primary px-8 py-3.5 font-semibold text-primary-foreground shadow-lg">Crear mi cuenta</Link>
          <Link href="/safe-dates/" className="rounded-full border px-8 py-3.5 font-semibold">Cómo te protegemos</Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-4 px-5 pb-20 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ Icon, title, text }) => (
          <div key={title} className="space-y-2 rounded-2xl border bg-card p-6">
            <Icon className="h-7 w-7 text-primary" />
            <h2 className="text-lg font-bold">{title}</h2>
            <p className="text-sm text-muted-foreground">{text}</p>
          </div>
        ))}
      </section>

      <section className="border-y bg-card/40 py-20">
        <div className="mx-auto max-w-5xl px-5">
          <h2 className="text-center text-3xl font-extrabold">Gratis para ellas. Planes simples para ellos.</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">Las mujeres tienen acceso completo sin costo. Los hombres pueden explorar gratis y suscribirse para iniciar conversaciones.</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {PLANS.map((p) => (
              <div key={p.id} className={`space-y-3 rounded-2xl border p-6 ${'highlight' in p && p.highlight ? 'border-primary bg-primary/5' : 'bg-card'}`}>
                <h3 className="text-lg font-bold">{p.name}</h3>
                <p><span className="text-3xl font-extrabold">{p.price}</span><span className="text-sm text-muted-foreground"> / {p.period}</span></p>
                <ul className="space-y-1 text-sm text-muted-foreground">{p.perks.map((x) => <li key={x}>✓ {x}</li>)}</ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
