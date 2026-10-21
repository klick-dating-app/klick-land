'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BadgeCheck, CheckCircle2, Heart, MapPin, Sparkles, X } from 'lucide-react';
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
    <header className="flex items-center justify-between px-5 pb-3 pt-5">
      <KlickLogo size={30} showText textClassName="text-lg font-semibold tracking-tight" />
      <span className="eyebrow !text-[10px]">Solo 60 %+</span>
    </header>
  );

  if (!queue) return <>{header}<div className="flex h-[60dvh] items-center justify-center"><Spinner className="h-7 w-7" /></div></>;

  if (!current) {
    return (
      <>
        {header}
        <div className="flex h-[60dvh] flex-col items-center justify-center gap-5 px-10 text-center">
          <Sparkles className="h-7 w-7 text-blue-600 dark:text-blue-400" strokeWidth={1.4} />
          <h2 className="text-2xl font-light tracking-tight">Eso es todo por hoy</h2>
          <p className="text-sm font-light leading-relaxed text-muted-foreground">Solo mostramos personas verificadas con 60 % de compatibilidad o más. Vuelve pronto o amplía tus preferencias.</p>
          <button className="btn-ghost" onClick={load}>Actualizar</button>
        </div>
      </>
    );
  }

  const groundShown = entitlement?.canViewDetails ? current.commonGround : current.commonGround.slice(0, 3);
  return (
    <>
      {header}
      <div key={current.uid} className="animate-card-in">
        <div className="relative aspect-[4/5] overflow-hidden bg-muted">
          {current.photos[photoIdx] && <Image src={current.photos[photoIdx]} alt={current.name} fill unoptimized priority className="object-cover" />}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/95" />
          <button className="absolute inset-y-0 left-0 w-1/2" aria-label="Foto anterior" onClick={() => setPhotoIdx((i) => Math.max(0, i - 1))} />
          <button className="absolute inset-y-0 right-0 w-1/2" aria-label="Foto siguiente" onClick={() => setPhotoIdx((i) => Math.min(current.photos.length - 1, i + 1))} />
          <div className="absolute inset-x-5 top-3 flex gap-1.5">
            {current.photos.map((_, i) => <span key={i} className={`h-[3px] flex-1 rounded-full ${i === photoIdx ? 'bg-white' : 'bg-white/25'}`} />)}
          </div>
          <div className="absolute right-4 top-8"><SafetyMenu onPhoto targetId={current.uid} onDone={next} /></div>
          <div className="pointer-events-none absolute inset-x-5 bottom-12 space-y-2 text-white">
            <ScoreBadge score={current.score} />
            <h2 className="flex items-center gap-2 text-[30px] font-semibold leading-none tracking-tight">
              {current.name}, <span className="font-light">{current.age}</span>
              {current.verified && <BadgeCheck className="h-5 w-5 fill-blue-500 text-white" aria-label="Verificado" />}
            </h2>
            <p className="flex items-center gap-1.5 text-xs font-medium text-white/80"><MapPin className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />{current.city}, {current.state} · {current.distanceMiles} mi</p>
          </div>
        </div>

        <div className="-mt-7 relative z-10 flex items-center justify-center gap-6">
          <button disabled={busy} onClick={() => act('pass')} aria-label="Pasar" className="flex h-[60px] w-[60px] items-center justify-center rounded-full border border-foreground/15 bg-background/80 text-foreground/80 backdrop-blur-xl transition active:scale-90"><X className="h-6 w-6" strokeWidth={1.6} /></button>
          <button disabled={busy} onClick={() => act('like')} aria-label="Me gusta" className="bg-brand flex h-[72px] w-[72px] items-center justify-center rounded-full text-white shadow-[0_16px_40px_-10px_rgba(124,58,237,0.8)] transition active:scale-90"><Heart className="h-7 w-7" fill="currentColor" /></button>
        </div>

        <div className="space-y-6 px-5 pb-6 pt-7">
          {current.bio && (
            <div className="space-y-2">
              <span className="section-label">Sobre mí</span>
              <p className="text-[14px] font-light leading-relaxed text-foreground/75">{current.bio}</p>
            </div>
          )}
          {groundShown.length > 0 && (
            <div className="space-y-3 rounded-2xl border border-blue-500/25 bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-4">
              <span className="section-label"><Sparkles className="h-3.5 w-3.5" /> Common Ground</span>
              <ul className="space-y-2">
                {groundShown.map((g) => <li key={g} className="flex items-start gap-2 text-xs font-medium leading-snug text-foreground/85"><CheckCircle2 className="mt-px h-3.5 w-3.5 shrink-0 text-blue-600 dark:text-blue-400" />{g}</li>)}
              </ul>
              {!entitlement?.canViewDetails && current.commonGround.length > 3 && <Link href="/app/upgrade/" className="inline-block text-xs font-semibold text-blue-600 dark:text-blue-400">Ver todo con Premium →</Link>}
            </div>
          )}
        </div>
      </div>

      {matchInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6 backdrop-blur-md">
          <div className="animate-pop relative w-full max-w-sm space-y-6 overflow-hidden rounded-[2rem] border border-foreground/10 bg-card p-9 text-center">
            <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-gradient-to-b from-purple-700/30 to-transparent blur-3xl" />
            {matchInfo.photo && <div className="relative mx-auto h-28 w-28 overflow-hidden rounded-full ring-1 ring-foreground/30 ring-offset-4 ring-offset-background"><Image src={matchInfo.photo} alt="" fill unoptimized className="object-cover" /></div>}
            <div className="relative space-y-2">
              <p className="eyebrow">Es mutuo</p>
              <h2 className="text-brand text-5xl font-medium tracking-tighter">Klick</h2>
              <p className="text-sm font-light text-foreground/75">Tú y {matchInfo.name} son compatibles al {Math.round(matchInfo.score)} %.</p>
            </div>
            <div className="relative flex flex-col gap-3">
              <Link href={`/app/chat/?id=${matchInfo.id}`} className="btn-brand w-full">Enviar mensaje</Link>
              <button className="text-sm font-light text-muted-foreground" onClick={() => setMatchInfo(null)}>Seguir explorando</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
