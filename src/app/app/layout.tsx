'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Flame, MessageCircle, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { isFirebaseConfigured } from '@/lib/firebase';
import { DEMO } from '@/lib/demo';
import { Spinner } from '@/components/app/form';
import { cn } from '@/lib/utils';

const TABS = [
  { href: '/app/discover/', label: 'Descubrir', Icon: Flame },
  { href: '/app/matches/', label: 'Chats', Icon: MessageCircle },
  { href: '/app/safe-date/', label: 'Safe Date', Icon: ShieldCheck },
  { href: '/app/profile/', label: 'Perfil', Icon: User },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const onboarding = pathname.startsWith('/app/onboarding');
  const onboarded = profile?.onboarded === true;

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
      {DEMO && <div className="border-b border-white/10 bg-white/5 py-1 text-center text-[10px] font-medium uppercase tracking-[0.2em] text-white/50">Demo · datos de ejemplo</div>}
      <main className={cn('flex-1', showTabs && 'pb-24')}>{children}</main>
      {showTabs && (
        <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-black/80 pb-safe backdrop-blur-xl">
          <ul className="mx-auto flex max-w-lg">
            {TABS.map(({ href, label, Icon }) => {
              const active = pathname.startsWith(href.slice(0, -1));
              return (
                <li key={href} className="flex-1">
                  <Link href={href} className={cn('relative flex flex-col items-center gap-1 py-3 text-[10px] font-medium uppercase tracking-[0.14em] transition', active ? 'text-white' : 'text-zinc-500')}>
                    <Icon className="h-[22px] w-[22px]" strokeWidth={active ? 1.75 : 1.4} />
                    {label}
                    {active && <span className="bg-brand absolute top-0 h-px w-10" />}
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
