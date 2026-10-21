import Link from 'next/link';
import KlickLogo from '@/components/ui/KlickLogo';

export const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@klick.app';

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="glass sticky top-0 z-30 border-x-0 border-t-0 pt-safe">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
          <Link href="/" aria-label="Klick"><KlickLogo size={34} showText textClassName="text-lg font-bold" /></Link>
          <nav className="flex items-center gap-5 text-sm">
            <Link href="/safe-dates/" className="hidden text-muted-foreground hover:text-foreground sm:inline">Safe First Date</Link>
            <Link href="/faqs/" className="hidden text-muted-foreground hover:text-foreground sm:inline">FAQ</Link>
            <Link href="/login/" className="btn-brand !px-5 !py-2 text-sm">Entrar</Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-white/5 py-8 pb-safe text-sm text-muted-foreground">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-5 sm:flex-row">
          <p>© {new Date().getFullYear()} SafeMeet.Ut LLC · Klick</p>
          <nav className="flex flex-wrap justify-center gap-x-5 gap-y-1">
            <Link href="/privacy/">Privacidad</Link>
            <Link href="/terms/">Términos</Link>
            <Link href="/delete-account/">Eliminar cuenta</Link>
            <Link href="/contact/">Contacto</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

export function Prose({ title, updated, children }: { title: string; updated?: string; children: React.ReactNode }) {
  return (
    <article className="mx-auto max-w-3xl space-y-4 px-5 py-12 leading-relaxed [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_li]:ml-5 [&_li]:list-disc [&_p]:text-muted-foreground [&_li]:text-muted-foreground">
      <h1 className="text-3xl font-extrabold">{title}</h1>
      {updated && <p className="text-xs">Última actualización: {updated}</p>}
      {children}
    </article>
  );
}
