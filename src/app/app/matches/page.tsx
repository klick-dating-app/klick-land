'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useMatches } from '@/hooks/useKlickData';
import { ScoreRing, Spinner } from '@/components/app/form';

export default function MatchesPage() {
  const { user } = useAuth();
  const matches = useMatches(user?.uid);

  if (!matches) return <div className="flex h-[70dvh] items-center justify-center"><Spinner className="h-8 w-8" /></div>;

  const view = matches.map((m) => {
    const otherId = m.members.find((x) => x !== user!.uid)!;
    return { m, other: m.profiles[otherId] };
  });
  const fresh = view.filter(({ m }) => !m.lastMessage);

  return (
    <div className="space-y-6 px-5 pt-5">
      <h1 className="text-3xl font-extrabold tracking-tight">Chats</h1>

      {matches.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-24 text-center text-muted-foreground">
          <div className="rounded-full bg-primary/15 p-5"><Heart className="h-9 w-9 text-primary" /></div>
          <p>Aún no tienes matches.<br />¡Explora perfiles compatibles!</p>
          <Link href="/app/discover/" className="btn-brand mt-2">Ir a Descubrir</Link>
        </div>
      ) : (
        <>
          {fresh.length > 0 && (
            <section>
              <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-primary">Nuevos Klicks</h2>
              <div className="flex gap-4 overflow-x-auto pb-1 no-scrollbar">
                {fresh.map(({ m, other }) => (
                  <Link key={m.id} href={`/app/chat/?id=${m.id}`} className="shrink-0 text-center">
                    <div className="relative h-20 w-20 overflow-hidden rounded-full ring-[3px] ring-primary ring-offset-2 ring-offset-background">
                      {other?.photo && <Image src={other.photo} alt="" fill unoptimized className="object-cover" />}
                    </div>
                    <p className="mt-1.5 text-xs font-medium">{other?.name}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <ul className="space-y-2">
            {view.map(({ m, other }) => (
              <li key={m.id}>
                <Link href={`/app/chat/?id=${m.id}`} className="surface flex items-center gap-4 p-3.5 transition active:scale-[0.98]">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-muted">
                    {other?.photo && <Image src={other.photo} alt="" fill unoptimized className="object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold">{other?.name ?? 'Match'}</p>
                    <p className="truncate text-sm text-muted-foreground">{m.lastMessage ?? 'Di hola 👋'}</p>
                  </div>
                  <ScoreRing score={m.score} size={48} />
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
