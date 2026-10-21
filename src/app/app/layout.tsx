'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Flame, Heart, MessageCircle, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { isFirebaseConfigured } from '@/lib/firebase';
import { Spinner } from '@/components/app/form';
import { cn } from '@/lib/utils';

const TABS = [
  { href: '/app/discover/', label: 'Descubrir', Icon: Flame },
  { href: '/app/matches/', label: 'Matches', Icon: MessageCircle },
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

  if (!isFirebaseConfigured) {
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
      <main className={cn('flex-1', showTabs && 'pb-24')}>{children}</main>
      {showTabs && (
        <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 backdrop-blur pb-safe">
          <ul className="mx-auto flex max-w-lg">
            {TABS.map(({ href, label, Icon }) => {
              const active = pathname.startsWith(href.slice(0, -1));
              return (
                <li key={href} className="flex-1">
                  <Link
                    href={href}
                    className={cn('flex flex-col items-center gap-0.5 py-2.5 text-[11px]', active ? 'text-primary' : 'text-muted-foreground')}
                  >
                    <Icon className="h-6 w-6" fill={active && Icon === Heart ? 'currentColor' : 'none'} />
                    {label}
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
