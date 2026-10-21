'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useMatches } from '@/hooks/useKlickData';
import { useAuth } from '@/context/AuthContext';
import { Spinner } from '@/components/app/form';

export default function MatchesPage() {
  const { user } = useAuth();
  const matches = useMatches(user?.uid);

  if (!matches) return <div className="flex h-[70dvh] items-center justify-center"><Spinner className="h-8 w-8" /></div>;

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Tus Klicks</h1>
      {matches.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-center text-muted-foreground">
          <Heart className="h-10 w-10" />
          <p>Aún no tienes matches. ¡Explora perfiles compatibles!</p>
          <Link href="/app/discover/" className="text-primary">Ir a Descubrir</Link>
        </div>
      ) : (
        <ul className="divide-y">
          {matches.map((m) => {
            const otherId = m.members.find((x) => x !== user!.uid)!;
            const other = m.profiles[otherId];
            return (
              <li key={m.id}>
                <Link href={`/app/chat/?id=${m.id}`} className="flex items-center gap-3 py-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-muted">
                    {other?.photo && <Image src={other.photo} alt="" fill unoptimized className="object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{other?.name ?? 'Match'} <span className="text-xs font-normal text-primary">{Math.round(m.score)}%</span></p>
                    <p className="truncate text-sm text-muted-foreground">{m.lastMessage ?? 'Di hola 👋'}</p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
