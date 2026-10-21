import Link from 'next/link';
import { BadgeCheck, CalendarHeart, Fingerprint, Lock, ShieldCheck, Sparkles } from 'lucide-react';
import { SiteShell } from '@/components/site/SiteShell';
import HeroVideo from '@/components/site/HeroVideo';
import KlickLogo from '@/components/ui/KlickLogo';
import { PLANS } from '@/lib/klick/options';

const STATS = [
  { Icon: Sparkles, value: '0–100%', title: 'Compatibility score', text: 'Faith, marriage, family, languages and lifestyle weighed into one honest number.' },
  { Icon: BadgeCheck, value: '60%+', title: 'Minimum to match', text: 'You only see people who genuinely fit what you are looking for.' },
  { Icon: Fingerprint, value: '100%', title: 'Verified profiles', text: 'Selfie verification and photo review keep the community real.' },
  { Icon: CalendarHeart, value: '1st', title: 'Date, protected', text: 'Public venue, reminders and arrival check-in on every first date.' },
];

const PLAN_PERKS: Record<string, string> = { basic: 'Everything you need to start.', premium: 'For serious conversations.', vip: 'The complete Klick experience.' };

export default function Home() {
  return (
    <SiteShell overlay>
      <section className="relative flex h-screen min-h-[640px] items-end overflow-hidden">
        <HeroVideo />
        <div className="relative z-10 w-full px-6 pb-16 md:px-12 md:pb-24 lg:px-[6vw]">
          <div className="flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-end">
            <div className="max-w-4xl space-y-5">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/70 sm:text-sm sm:tracking-[0.28em]">Meet &nbsp;|&nbsp; Connect &nbsp;|&nbsp; Fall in love</p>
              <h1 className="text-[2.35rem] font-medium leading-[1.05] tracking-tighter text-white md:text-6xl lg:text-7xl">
                Make a Klick with someone who truly fits with you
              </h1>
              <p className="max-w-xl text-base font-light text-white/70 md:text-lg">A new way to meet people: verified profiles, deep compatibility and a protected first date.</p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row lg:flex-col xl:flex-row">
              <Link href="/login/" className="btn-light whitespace-nowrap px-9">Create my account</Link>
              <Link href="/safe-dates/" className="btn-ghost whitespace-nowrap px-9">How we keep you safe</Link>
            </div>
          </div>
        </div>
      </section>

      <section id="discover" className="relative overflow-hidden bg-[#050507] py-24 md:py-32">
        <div className="bg-grid-faint absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-6 md:px-12">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <p className="eyebrow mb-5">The Klick algorithm</p>
            <h2 className="text-4xl font-light leading-tight tracking-tighter md:text-6xl">Compatibility, measured.<br />Safety, built in.</h2>
          </div>
          <div className="grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map(({ Icon, value, title, text }) => (
              <div key={title} className="group flex flex-col items-center text-center">
                <Icon className="mb-8 h-7 w-7 text-white transition-transform duration-300 group-hover:scale-110" strokeWidth={1.3} />
                <div className="mb-4 text-5xl font-medium tracking-tighter md:text-6xl">{value}</div>
                <h3 className="mb-3 text-lg font-medium">{title}</h3>
                <p className="max-w-[230px] text-sm font-light leading-relaxed text-white/65">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="plans" className="relative overflow-hidden bg-[#050507] py-24 md:py-32">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-gradient-to-b from-purple-900/20 via-blue-900/10 to-transparent blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-6 md:px-12">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-light tracking-tight md:text-5xl">Choose your plan on Klick</h2>
            <p className="font-light leading-relaxed text-slate-400">Always free for women. Men explore for free and subscribe to start conversations.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {PLANS.map((p) => {
              const hi = 'highlight' in p && p.highlight;
              return (
                <div key={p.id} className={`surface relative flex flex-col p-8 ${hi ? '!border-white/30' : ''}`}>
                  {hi && <span className="bg-brand absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white">Most chosen</span>}
                  <div className="mb-8 text-center">
                    <h3 className="mb-2 text-2xl font-normal tracking-tight">{p.en.name}</h3>
                    <p className="text-sm font-light text-slate-400">{PLAN_PERKS[p.id]}</p>
                    <p className="mt-6"><span className="text-5xl font-medium tracking-tighter">{p.price}</span><span className="text-sm font-light text-slate-500"> / {p.en.period}</span></p>
                  </div>
                  <p className="eyebrow mb-5 text-center !text-white/40">What’s included</p>
                  <ul className="mb-8 flex-1 space-y-3.5">
                    {p.en.perks.map((x) => <li key={x} className="flex gap-3 text-sm font-light leading-snug text-slate-300"><ShieldCheck className="mt-px h-4 w-4 shrink-0 text-white" strokeWidth={1.4} />{x}</li>)}
                  </ul>
                  <Link href="/login/" className={hi ? 'btn-brand w-full' : 'btn-ghost w-full'}>Get started</Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-black py-24 text-center md:py-32">
        <div className="group mx-auto flex max-w-5xl flex-col items-center px-6">
          <p className="mb-6 text-sm font-medium uppercase tracking-[0.2em] text-white/80">Connect with like-minded people from anywhere</p>
          <div className="mb-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
            <h2 className="text-5xl font-medium leading-none tracking-tighter md:text-8xl">Download</h2>
            <KlickLogo size={92} className="transition-transform duration-500 group-hover:scale-105" />
            <h2 className="text-5xl font-medium leading-none tracking-tighter md:text-8xl">Klick</h2>
          </div>
          <h2 className="mb-10 text-5xl font-medium leading-none tracking-tighter md:text-8xl"><span className="text-brand">to find a partner</span></h2>
          <p className="mb-12 max-w-2xl text-lg font-light tracking-tight text-white/60 md:text-xl">For authentic, honest and lasting connections.</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/login/" className="btn-light px-10">Join on the web</Link>
            <span className="btn-ghost cursor-default px-10 opacity-60">App Store &amp; Google Play · soon</span>
          </div>
          <p className="mt-10 flex items-center gap-2 text-xs font-light text-zinc-500"><Lock className="h-3.5 w-3.5" /> Your exact location is never shown.</p>
        </div>
      </section>
    </SiteShell>
  );
}
