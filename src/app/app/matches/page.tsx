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

  if (!matches) return <div className="flex h-[70dvh] items-center justify-center"><Spinner className="h-7 w-7" /></div>;

  const view = matches.map((m) => ({ m, other: m.profiles[m.members.find((x) => x !== user!.uid)!] }));
  const fresh = view.filter(({ m }) => !m.lastMessage);

  return (
    <div className="space-y-8 px-5 pt-8">
      <header className="space-y-1">
        <p className="eyebrow">Mensajes</p>
        <h1 className="text-4xl font-light tracking-tighter">Tus Klicks</h1>
      </header>

      {matches.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-24 text-center">
          <Heart className="h-7 w-7 text-blue-400" strokeWidth={1.4} />
          <p className="text-sm font-light leading-relaxed text-zinc-400">Aún no tienes matches.<br />Explora perfiles compatibles.</p>
          <Link href="/app/discover/" className="btn-ghost mt-2">Ir a Descubrir</Link>
        </div>
      ) : (
        <>
          {fresh.length > 0 && (
            <section className="space-y-4">
              <span className="section-label">Nuevos Klicks</span>
              <div className="no-scrollbar -mx-1 flex gap-5 overflow-x-auto px-2 py-1.5">
                {fresh.map(({ m, other }) => (
                  <Link key={m.id} href={`/app/chat/?id=${m.id}`} className="shrink-0 text-center">
                    <div className="relative h-[76px] w-[76px] overflow-hidden rounded-full ring-1 ring-white/30 ring-offset-[3px] ring-offset-black">
                      {other?.photo && <Image src={other.photo} alt="" fill unoptimized className="object-cover" />}
                    </div>
                    <p className="mt-2 text-xs font-medium text-zinc-300">{other?.name}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <ul className="divide-y divide-white/10 border-y border-white/10">
            {view.map(({ m, other }) => (
              <li key={m.id}>
                <Link href={`/app/chat/?id=${m.id}`} className="flex items-center gap-4 py-4 transition active:opacity-70">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-zinc-900">
                    {other?.photo && <Image src={other.photo} alt="" fill unoptimized className="object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[17px] font-medium tracking-tight">{other?.name ?? 'Match'}</p>
                    <p className="truncate text-sm font-light text-zinc-400">{m.lastMessage ?? 'Di hola 👋'}</p>
                  </div>
                  <ScoreRing score={m.score} size={46} />
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
