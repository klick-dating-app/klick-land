import Link from 'next/link';
import KlickLogo from '@/components/ui/KlickLogo';

export const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@klick.app';

const NAV: Array<[string, string]> = [
  ['Discover', '/#discover'],
  ['Plans', '/#plans'],
  ['Safety', '/safe-dates/'],
  ['FAQ', '/faqs/'],
];

export function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  return (
    <header className={`${overlay ? 'absolute inset-x-0 top-0' : 'sticky top-0 border-b border-white/10 bg-black/70 backdrop-blur-xl'} z-40 pt-safe`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-12">
        <Link href="/" aria-label="Klick"><KlickLogo size={34} showText textClassName="text-lg font-medium tracking-tight text-white" /></Link>
        <nav className="hidden items-center gap-9 md:flex">
          {NAV.map(([label, href]) => <Link key={label} href={href} className="text-[13px] font-medium uppercase tracking-[0.16em] text-white/70 transition hover:text-white">{label}</Link>)}
        </nav>
        <Link href="/login/" className="btn-ghost !px-6 !py-2.5 text-sm">Sign in</Link>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-black pb-safe pt-20 text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-[1.4fr_1fr_1fr] md:px-12">
        <div className="space-y-4">
          <KlickLogo size={40} showText textClassName="text-xl font-medium tracking-tight" />
          <p className="max-w-xs text-2xl font-medium leading-snug tracking-tight">Make a Klick with someone real.</p>
          <p className="max-w-sm text-xs leading-relaxed text-zinc-500">Klick is a dating platform by SafeMeet.Ut LLC. Profiles are reviewed and verified; always follow our Safe First Date guidelines.</p>
        </div>
        <div>
          <h4 className="eyebrow mb-5">Klick</h4>
          <ul className="space-y-3 text-sm font-light text-zinc-400">
            <li><Link className="hover:text-white" href="/#plans">Plans</Link></li>
            <li><Link className="hover:text-white" href="/safe-dates/">Safe First Date</Link></li>
            <li><Link className="hover:text-white" href="/faqs/">FAQ</Link></li>
            <li><Link className="hover:text-white" href="/contact/">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="eyebrow mb-5">Trust &amp; Legal</h4>
          <ul className="space-y-3 text-sm font-light text-zinc-400">
            <li><Link className="hover:text-white" href="/privacy/">Privacy Policy</Link></li>
            <li><Link className="hover:text-white" href="/terms/">Terms &amp; Conditions</Link></li>
            <li><Link className="hover:text-white" href="/delete-account/">Delete account</Link></li>
          </ul>
        </div>
      </div>
      <p className="mx-auto mt-16 max-w-7xl border-t border-white/10 px-6 py-6 text-xs text-zinc-600 md:px-12">© {new Date().getFullYear()} SafeMeet.Ut LLC. All rights reserved.</p>
    </footer>
  );
}

export function SiteShell({ children, overlay = false }: { children: React.ReactNode; overlay?: boolean }) {
  return (
    <div className="flex min-h-dvh flex-col bg-[#050507]">
      <SiteHeader overlay={overlay} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

export function Prose({ title, updated, children }: { title: string; updated?: string; children: React.ReactNode }) {
  return (
    <article className="mx-auto max-w-3xl space-y-5 px-6 py-20 leading-relaxed [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-medium [&_h2]:tracking-tight [&_li]:ml-5 [&_li]:list-disc [&_li]:font-light [&_li]:text-zinc-400 [&_p]:font-light [&_p]:text-zinc-400">
      <p className="eyebrow">Klick</p>
      <h1 className="text-4xl font-light tracking-tighter md:text-5xl">{title}</h1>
      {updated && <p className="text-xs text-zinc-600">Última actualización: {updated}</p>}
      {children}
    </article>
  );
}
