'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Coffee, Flame, Heart, MessageCircle, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { isFirebaseConfigured } from '@/lib/firebase';
import { DEMO } from '@/lib/demo';
import { Spinner } from '@/components/app/form';
import { useMatches } from '@/hooks/useKlickData';
import { cn } from '@/lib/utils';

/** Pestañas originales de Klick: Feed · Klicks · Inbox · Citas · Perfil. */
const TABS = [
  { href: '/app/discover/', label: 'Feed', Icon: Flame },
  { href: '/app/klicks/', label: 'Klicks', Icon: Heart },
  { href: '/app/matches/', label: 'Inbox', Icon: MessageCircle },
  { href: '/app/safe-date/', label: 'Citas', Icon: Coffee },
  { href: '/app/profile/', label: 'Perfil', Icon: User },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const onboarding = pathname.startsWith('/app/onboarding');
  const onboarded = profile?.onboarded === true;
  const matches = useMatches(user?.uid);
  const fresh = (matches ?? []).filter((m) => !m.lastMessage).length;

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace('/login/');
    else if (!onboarded && !onboarding) router.replace('/app/onboarding/');
  }, [loading, user, onboarded, onboarding, router]);

  if (!isFirebaseConfigured && !DEMO) {
    return (
      <div className="flex min-h-dvh items-center justify-center p-8 text-center text-sm text-muted-foreground">
        Falta configurar Firebase. Copia <code className="mx-1">.env.example</code> a <code className="mx-1">.env.local</code> y rellena las claves.
      </div>
    );
  }
  if (loading || !user || (!onboarded && !onboarding)) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  const showTabs = onboarded && !pathname.startsWith('/app/chat') && !onboarding;
  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col pt-safe">
      {DEMO && <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] py-0.5 text-center text-[9px] font-medium uppercase tracking-[0.2em] text-white/45 mix-blend-difference">Demo · datos de ejemplo</div>}
      <main className={cn('flex-1', showTabs && 'pb-20')}>{children}</main>
      {showTabs && (
        <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-foreground/10 bg-background/90 pb-safe backdrop-blur-xl">
          <ul className="mx-auto flex h-16 max-w-lg items-center justify-around px-2">
            {TABS.map(({ href, label, Icon }) => {
              const active = pathname.startsWith(href.slice(0, -1));
              return (
                <li key={href} className="flex-1">
                  <Link href={href} className={cn('relative flex flex-col items-center gap-0.5 py-2 transition', active ? 'text-blue-500' : 'text-muted-foreground hover:text-foreground')}>
                    <Icon className="h-5 w-5" strokeWidth={active ? 2.2 : 1.8} />
                    <span className="text-[10px] font-semibold">{label}</span>
                    {href.includes('klicks') && fresh > 0 && <span className="absolute right-[28%] top-1 h-2 w-2 rounded-full bg-blue-500" />}
                    {active && <span className="bg-brand absolute -top-px h-px w-10" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </div>
  );
}
