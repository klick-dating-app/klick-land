'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BadgeCheck, Heart, MapPin, Sparkles, X } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import KlickLogo from '@/components/ui/KlickLogo';
import { ScoreBadge, Spinner } from '@/components/app/form';
import SafetyMenu from '@/components/app/SafetyMenu';
import type { Candidate } from '@/lib/types';

export default function DiscoverPage() {
  const { entitlement } = useAuth();
  const [queue, setQueue] = useState<Candidate[] | null>(null);
  const [photoIdx, setPhotoIdx] = useState(0);
  const [matchInfo, setMatchInfo] = useState<{ id: string; name: string; score: number; photo?: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setQueue(null);
    try {
      setQueue((await api.getCandidates({})).candidates);
    } catch (e: any) {
      toast.error(e?.message ?? 'No pudimos cargar perfiles');
      setQueue([]);
    }
  }, []);
  useEffect(() => void load(), [load]);

  const current = queue?.[0];
  const next = () => {
    setPhotoIdx(0);
    setQueue((q) => (q ? q.slice(1) : q));
  };

  const act = async (action: 'like' | 'pass') => {
    if (!current || busy) return;
    setBusy(true);
    try {
      const r = await api.swipe({ targetId: current.uid, action });
      if (r.matched && r.matchId) setMatchInfo({ id: r.matchId, name: current.name, score: r.score ?? current.score, photo: current.photos[0] });
      next();
    } catch (e: any) {
      toast.error(e?.message ?? 'Error');
    } finally {
      setBusy(false);
    }
  };

  const header = (
    <header className="flex items-center justify-between px-5 pb-3 pt-4">
      <KlickLogo size={32} showText textClassName="text-xl font-extrabold tracking-tight" />
      <span className="pill"><Sparkles className="h-3.5 w-3.5 text-primary" /> Solo 60 %+</span>
    </header>
  );

  if (!queue) return <>{header}<div className="flex h-[60dvh] items-center justify-center"><Spinner className="h-8 w-8" /></div></>;

  if (!current) {
    return (
      <>
        {header}
        <div className="flex h-[60dvh] flex-col items-center justify-center gap-4 px-8 text-center">
          <div className="rounded-full bg-primary/15 p-5"><BadgeCheck className="h-10 w-10 text-primary" /></div>
          <h2 className="text-xl font-bold">Por hoy, eso es todo</h2>
          <p className="text-sm text-muted-foreground">Solo mostramos personas verificadas con compatibilidad de 60 % o más. Vuelve pronto o amplía tus preferencias.</p>
          <button className="btn-brand" onClick={load}>Actualizar</button>
        </div>
      </>
    );
  }

  const groundShown = entitlement?.canViewDetails ? current.commonGround : current.commonGround.slice(0, 3);
  return (
    <>
      {header}
      <div key={current.uid} className="animate-card-in space-y-5 px-4">
        <div className="relative aspect-[3/4.1] overflow-hidden rounded-[2rem] bg-muted shadow-2xl shadow-black/60 ring-1 ring-white/10">
          {current.photos[photoIdx] && <Image src={current.photos[photoIdx]} alt={current.name} fill unoptimized priority className="object-cover" />}
          <button className="absolute inset-y-0 left-0 w-1/2" aria-label="Foto anterior" onClick={() => setPhotoIdx((i) => Math.max(0, i - 1))} />
          <button className="absolute inset-y-0 right-0 w-1/2" aria-label="Foto siguiente" onClick={() => setPhotoIdx((i) => Math.min(current.photos.length - 1, i + 1))} />
          <div className="absolute inset-x-4 top-4 flex gap-1.5">
            {current.photos.map((_, i) => <span key={i} className={`h-1 flex-1 rounded-full ${i === photoIdx ? 'bg-white' : 'bg-white/35'}`} />)}
          </div>
          <div className="absolute right-4 top-9"><SafetyMenu targetId={current.uid} onDone={next} /></div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 space-y-2 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-5 pt-28 text-white">
            <ScoreBadge score={current.score} />
            <h2 className="flex items-center gap-2 text-3xl font-extrabold leading-none">
              {current.name}, {current.age}
              {current.verified && <BadgeCheck className="h-6 w-6 fill-emerald-500 text-black" aria-label="Verificado" />}
            </h2>
            <p className="flex items-center gap-1 text-sm text-white/75"><MapPin className="h-4 w-4" />{current.city}, {current.state} · {current.distanceMiles} mi</p>
            {current.bio && <p className="line-clamp-2 text-sm text-white/90">{current.bio}</p>}
          </div>
        </div>

        <div className="flex items-center justify-center gap-7">
          <button disabled={busy} onClick={() => act('pass')} aria-label="Pasar" className="glass rounded-full p-5 text-white/80 shadow-xl transition active:scale-90"><X className="h-8 w-8" /></button>
          <button disabled={busy} onClick={() => act('like')} aria-label="Me gusta" className="btn-brand !rounded-full !p-6"><Heart className="h-9 w-9" fill="currentColor" /></button>
        </div>

        {groundShown.length > 0 && (
          <section className="surface p-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold"><Sparkles className="h-4 w-4 text-primary" /> Common Ground</h3>
            <ul className="space-y-2 text-sm text-foreground/80">
              {groundShown.map((g) => <li key={g} className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />{g}</li>)}
            </ul>
            {!entitlement?.canViewDetails && current.commonGround.length > 3 && (
              <Link href="/app/upgrade/" className="mt-3 inline-block text-sm font-semibold text-primary">Ver todo con Premium →</Link>
            )}
          </section>
        )}
      </div>

      {matchInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-6 backdrop-blur-md">
          <div className="animate-pop w-full max-w-sm space-y-5 rounded-[2rem] border border-white/10 bg-card p-8 text-center shadow-2xl">
            {matchInfo.photo && <div className="relative mx-auto h-28 w-28 overflow-hidden rounded-full ring-4 ring-primary"><Image src={matchInfo.photo} alt="" fill unoptimized className="object-cover" /></div>}
            <h2 className="text-gradient text-4xl font-black">¡Klick!</h2>
            <p className="text-foreground/80">Tú y {matchInfo.name} son compatibles al <b>{Math.round(matchInfo.score)} %</b>.</p>
            <Link href={`/app/chat/?id=${matchInfo.id}`} className="btn-brand w-full">Enviar mensaje</Link>
            <button className="text-sm text-muted-foreground" onClick={() => setMatchInfo(null)}>Seguir explorando</button>
          </div>
        </div>
      )}
    </>
  );
}
