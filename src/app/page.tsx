import Link from 'next/link';
import { BadgeCheck, CalendarHeart, Heart, HeartHandshake, Lock, MapPin, ShieldCheck, Sparkles, X } from 'lucide-react';
import { SiteShell } from '@/components/site/SiteShell';
import { PLANS } from '@/lib/klick/options';

const FEATURES = [
  { Icon: BadgeCheck, title: 'Perfiles verificados', text: 'Verificación con selfie y moderación de fotos. Menos perfiles falsos, más conexiones reales.' },
  { Icon: Sparkles, title: 'Compatibilidad 0–100 %', text: 'Fe, matrimonio, familia, idiomas y estilo de vida. Solo ves personas con 60 % o más.' },
  { Icon: HeartHandshake, title: 'Common Ground', text: 'Lo que realmente tienen en común, para que la primera conversación sea fácil.' },
  { Icon: CalendarHeart, title: 'Safe First Date', text: 'Lugar público, recordatorios, check-in de llegada y contacto de confianza.' },
  { Icon: ShieldCheck, title: 'Reporta y bloquea', text: 'Un toque desde cualquier perfil o chat, con revisión humana.' },
  { Icon: Lock, title: 'Privacidad primero', text: 'Nunca mostramos tu ubicación exacta. Elimina tu cuenta cuando quieras.' },
];

const STEPS = [
  ['1', 'Crea tu perfil', 'Cuéntanos quién eres y qué buscas con un cuestionario de 5 pasos.'],
  ['2', 'Haz Klick', 'Descubre personas verificadas y compatibles. Si el interés es mutuo, es un match.'],
  ['3', 'Conoce con seguridad', 'Planea tu primera cita con nuestro protocolo Safe First Date.'],
];

function PhoneMock() {
  return (
    <div className="relative mx-auto w-[270px] rotate-[3deg] rounded-[2.6rem] border-[10px] border-[#1b2236] bg-[#0b1020] p-1.5 shadow-[0_40px_90px_-20px_rgba(244,63,94,0.45)]">
      <div className="relative aspect-[9/17] overflow-hidden rounded-[2rem] bg-gradient-to-br from-rose-400/70 via-fuchsia-500/50 to-orange-400/70">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.35),transparent_55%)]" />
        <div className="absolute inset-x-0 bottom-0 space-y-1.5 bg-gradient-to-t from-black/85 to-transparent p-4 pt-24 text-white">
          <span className="inline-flex rounded-full bg-gradient-to-br from-rose-500 to-orange-500 px-2.5 py-1 text-xs font-extrabold">♥ 93%</span>
          <p className="flex items-center gap-1.5 text-xl font-extrabold">Camila, 27 <BadgeCheck className="h-5 w-5 fill-emerald-500 text-black" /></p>
          <p className="flex items-center gap-1 text-[11px] text-white/80"><MapPin className="h-3 w-3" /> Orem, UT · 6 mi</p>
          <div className="flex justify-center gap-4 pt-2">
            <span className="rounded-full border border-white/25 bg-white/10 p-2.5"><X className="h-5 w-5" /></span>
            <span className="rounded-full bg-gradient-to-br from-rose-500 to-orange-500 p-3"><Heart className="h-6 w-6" fill="currentColor" /></span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <SiteShell>
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 sm:py-24 lg:grid-cols-2">
        <div className="text-center lg:text-left">
          <p className="pill mb-5"><ShieldCheck className="h-3.5 w-3.5 text-primary" /> Citas seguras · Utah</p>
          <h1 className="text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl">
            Conecta con intención.<br /><span className="text-gradient">Haz Klick</span> con seguridad.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground lg:mx-0">
            Verificación de identidad, compatibilidad profunda y un protocolo de primera cita segura para relaciones que van en serio.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
            <Link href="/login/" className="btn-brand px-9 py-4 text-lg">Crear mi cuenta</Link>
            <Link href="/safe-dates/" className="btn-ghost px-9 py-4 text-lg">Cómo te protegemos</Link>
          </div>
          <p className="mt-5 text-sm text-muted-foreground">Gratis para mujeres · Disponible en iOS, Android y web</p>
        </div>
        <PhoneMock />
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20">
        <h2 className="mb-10 text-center text-3xl font-extrabold tracking-tight">Así funciona</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {STEPS.map(([n, t, d]) => (
            <div key={n} className="surface p-7">
              <span className="text-gradient text-5xl font-black">{n}</span>
              <h3 className="mt-3 text-lg font-bold">{t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-5 pb-24 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ Icon, title, text }) => (
          <div key={title} className="surface space-y-3 p-7">
            <span className="inline-flex rounded-2xl bg-primary/15 p-3"><Icon className="h-6 w-6 text-primary" /></span>
            <h3 className="text-lg font-bold">{title}</h3>
            <p className="text-sm text-muted-foreground">{text}</p>
          </div>
        ))}
      </section>

      <section className="border-y border-white/5 bg-white/[0.02] py-24">
        <div className="mx-auto max-w-5xl px-5">
          <h2 className="text-center text-3xl font-extrabold tracking-tight sm:text-4xl">Gratis para ellas.<br className="sm:hidden" /> Planes simples para ellos.</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">Las mujeres tienen acceso completo sin costo. Los hombres exploran gratis y se suscriben para iniciar conversaciones.</p>
          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            {PLANS.map((p) => {
              const hi = 'highlight' in p && p.highlight;
              return (
                <div key={p.id} className={`relative space-y-4 rounded-3xl p-7 ${hi ? 'bg-gradient-to-br from-rose-500/20 to-orange-500/10 ring-2 ring-primary' : 'surface'}`}>
                  {hi && <span className="absolute -top-3 left-7 rounded-full bg-gradient-to-br from-rose-500 to-orange-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">Más popular</span>}
                  <h3 className="text-lg font-bold">{p.name}</h3>
                  <p><span className="text-4xl font-black">{p.price}</span><span className="text-sm text-muted-foreground"> / {p.period}</span></p>
                  <ul className="space-y-2 text-sm text-muted-foreground">{p.perks.map((x) => <li key={x}>✓ {x}</li>)}</ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-24 text-center">
        <h2 className="text-4xl font-black tracking-tight">¿Lista/o para hacer <span className="text-gradient">Klick</span>?</h2>
        <Link href="/login/" className="btn-brand mt-8 px-10 py-4 text-lg">Empezar ahora</Link>
      </section>
    </SiteShell>
  );
}
