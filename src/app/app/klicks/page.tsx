'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Coffee, Heart, MessageCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useMatches, useSafeDates } from '@/hooks/useKlickData';
import { ScoreBadge, Spinner, VerifiedStar } from '@/components/app/form';

/** Klicks = personas con las que hubo match. El objetivo es llevarlas a una cita segura. */
export default function KlicksPage() {
  const { user } = useAuth();
  const matches = useMatches(user?.uid);
  const dates = useSafeDates(user?.uid);

  if (!matches) return <div className="flex h-[70dvh] items-center justify-center"><Spinner className="h-7 w-7" /></div>;

  const withDate = new Set((dates ?? []).filter((d) => d.status === 'scheduled').map((d) => d.matchId));

  return (
    <div className="space-y-6 px-5 pt-8">
      <header className="space-y-1">
        <p className="eyebrow">Matches</p>
        <h1 className="text-[26px] font-light tracking-tight">Tus Klicks</h1>
        <p className="text-sm font-light text-muted-foreground">Cada Klick es una oportunidad. Da el siguiente paso: una cita segura.</p>
      </header>

      {matches.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <Heart className="h-7 w-7 text-blue-500" strokeWidth={1.4} />
          <p className="text-sm font-light leading-relaxed text-muted-foreground">Aún no tienes Klicks.<br />Explora perfiles compatibles.</p>
          <Link href="/app/discover/" className="btn-ghost mt-2">Ir al Feed</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {matches.map((m) => {
            const other = m.profiles[m.members.find((x) => x !== user!.uid)!];
            return (
              <div key={m.id} className="surface overflow-hidden !rounded-3xl">
                <div className="relative aspect-[3/4] bg-muted">
                  {other?.photo && <Image src={other.photo} alt="" fill unoptimized className="object-cover" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent via-60% to-black/40" />
                  <span className="absolute left-3 top-3 text-xs font-semibold text-white/90 drop-shadow">{m.kind === 'date' ? 'Dating' : 'Klick'}</span>
                  <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-1 text-white">
                    <p className="flex min-w-0 items-center gap-1.5 text-base font-semibold tracking-tight"><span className="truncate">{other?.name}</span><VerifiedStar className="h-4 w-4" /></p>
                    <ScoreBadge score={m.score} className="[&>span:first-child]:text-base [&>span:last-child]:hidden" />
                  </div>
                </div>
                <div className="flex gap-2 p-2.5">
                  <Link href={`/app/chat/?id=${m.id}`} aria-label="Mensaje" className="flex h-10 w-9 shrink-0 items-center justify-center text-foreground/70"><MessageCircle className="h-[22px] w-[22px]" strokeWidth={1.5} /></Link>
                  {withDate.has(m.id) ? (
                    <Link href="/app/safe-date/" className="flex h-10 flex-1 items-center justify-center whitespace-nowrap rounded-full border border-blue-500/40 bg-blue-500/10 text-[11px] font-semibold text-blue-600 dark:text-blue-400">Cita agendada</Link>
                  ) : (
                    <Link href={`/app/safe-date/?matchId=${m.id}`} className="bg-brand flex h-10 flex-1 items-center justify-center gap-1 whitespace-nowrap rounded-full text-[11px] font-semibold text-white"><Coffee className="h-3.5 w-3.5" /> Planear cita</Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
