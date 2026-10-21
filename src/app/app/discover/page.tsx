'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, Crown, Flower2, Heart, MapPin, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import KlickLogo from '@/components/ui/KlickLogo';
import { ScoreBadge, Spinner, VerifiedStar } from '@/components/app/form';
import SafetyMenu from '@/components/app/SafetyMenu';
import type { Candidate } from '@/lib/types';

type Intent = 'friendship' | 'date';

export default function DiscoverPage() {
  const { entitlement } = useAuth();
  const [queue, setQueue] = useState<Candidate[] | null>(null);
  const [photoIdx, setPhotoIdx] = useState(0);
  const [matchInfo, setMatchInfo] = useState<{ id: string; name: string; score: number; photo?: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const touchX = useRef<number | null>(null);

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
    window.scrollTo({ top: 0 });
    setQueue((q) => (q ? q.slice(1) : q));
  };

  const act = async (action: 'like' | 'pass', intent?: Intent) => {
    if (!current || busy) return;
    setBusy(true);
    try {
      const r = await api.swipe({ targetId: current.uid, action, intent });
      if (r.matched && r.matchId) setMatchInfo({ id: r.matchId, name: current.name, score: r.score ?? current.score, photo: current.photos[0] });
      next();
    } catch (e: any) {
      toast.error(e?.message ?? 'Error');
    } finally {
      setBusy(false);
    }
  };

  if (!queue) return <div className="flex h-[80dvh] items-center justify-center"><Spinner className="h-7 w-7" /></div>;

  if (!current) {
    return (
      <div className="flex h-[80dvh] flex-col items-center justify-center gap-5 px-10 text-center">
        <KlickLogo size={34} />
        <h2 className="text-xl font-light tracking-tight">Eso es todo por hoy</h2>
        <p className="text-sm font-light leading-relaxed text-muted-foreground">Solo mostramos personas verificadas con 60 % de compatibilidad o más. Vuelve pronto o amplía tus preferencias.</p>
        <button className="btn-ghost" onClick={load}>Actualizar</button>
      </div>
    );
  }

  const groundShown = entitlement?.canViewDetails ? current.commonGround : current.commonGround.slice(0, 3);
  return (
    <>
      <div key={current.uid} className="animate-card-in -mt-[var(--safe-top)]">
        {/* Foto casi a pantalla completa: la información aparece al hacer scroll. */}
        <div
          className="relative h-[calc(100dvh-4rem-var(--safe-bottom))] min-h-[520px] overflow-hidden bg-muted"
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current !== null && e.changedTouches[0].clientX - touchX.current < -90) void act('pass');
            touchX.current = null;
          }}
        >
          {current.photos[photoIdx] && <Image src={current.photos[photoIdx]} alt={current.name} fill unoptimized priority className="object-cover" />}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent via-45% to-black/90" />
          <button className="absolute inset-y-0 left-0 w-1/2" aria-label="Foto anterior" onClick={() => setPhotoIdx((i) => Math.max(0, i - 1))} />
          <button className="absolute inset-y-0 right-0 w-1/2" aria-label="Foto siguiente" onClick={() => setPhotoIdx((i) => Math.min(current.photos.length - 1, i + 1))} />

          <header className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between px-5 pt-[calc(0.9rem+var(--safe-top))] text-white">
            <KlickLogo size={26} showText textClassName="text-base font-semibold tracking-tight" />
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/70">Solo 60 %+</span>
          </header>
          <div className="absolute right-3 top-[calc(3.2rem+var(--safe-top))] z-10"><SafetyMenu onPhoto targetId={current.uid} onDone={next} /></div>

          {current.photos.length > 1 && (
            <div className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 flex-col gap-1.5">
              {current.photos.map((_, i) => <span key={i} className={`h-1.5 w-1.5 rounded-full ${i === photoIdx ? 'bg-white' : 'bg-white/35'}`} />)}
            </div>
          )}

          <div className="pointer-events-none absolute inset-x-5 bottom-[5.5rem] space-y-2 text-white">
            <ScoreBadge score={current.score} />
            <h2 className="flex items-center gap-2 text-2xl font-semibold leading-none tracking-tight">
              {current.name}, <span className="font-light">{current.age}</span>
              {current.verified && <VerifiedStar />}
            </h2>
            <p className="flex items-center gap-1.5 text-xs font-medium text-white/80"><MapPin className="h-3.5 w-3.5 text-blue-400" />{current.city}, {current.state} · {current.distanceMiles} mi</p>
          </div>

          <div className="absolute inset-x-0 bottom-3 z-10 flex items-end justify-center gap-20 text-white">
            <button disabled={busy} onClick={() => act('like', 'friendship')} aria-label="Amistad" className="flex flex-col items-center gap-1 p-2 transition active:scale-90">
              <Heart className="h-10 w-10 drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]" fill="white" strokeWidth={1.2} />
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80">Amistad</span>
            </button>
            <button disabled={busy} onClick={() => act('like', 'date')} aria-label="Cita" className="flex flex-col items-center gap-1 p-2 text-[#ff4fa3] transition active:scale-90">
              <Flower2 className="h-10 w-10 drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]" fill="currentColor" fillOpacity={0.35} strokeWidth={1.5} />
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80">Cita</span>
            </button>
          </div>
        </div>

        <div className="space-y-6 px-5 pb-6 pt-6">
          <p className="text-center text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">Desliza a la izquierda para pasar</p>
          {current.bio && (
            <div className="space-y-2">
              <span className="section-label">Sobre mí</span>
              <p className="text-[14px] font-light leading-relaxed text-foreground/80">{current.bio}</p>
            </div>
          )}
          {groundShown.length > 0 && (
            <div className="space-y-3 rounded-2xl border border-blue-500/25 bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-4">
              <span className="section-label"><Sparkles className="h-3.5 w-3.5" /> Common Ground</span>
              <ul className="space-y-2">
                {groundShown.map((g) => <li key={g} className="flex items-start gap-2 text-xs font-medium leading-snug text-foreground/85"><CheckCircle2 className="mt-px h-3.5 w-3.5 shrink-0 text-blue-600 dark:text-blue-400" />{g}</li>)}
              </ul>
              {!entitlement?.canViewDetails && current.commonGround.length > 3 && <Link href="/app/upgrade/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400"><Crown className="h-3.5 w-3.5" /> Ver todo con Premium</Link>}
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
              <h2 className="text-brand text-4xl font-medium tracking-tighter">Klick</h2>
              <p className="text-sm font-light text-foreground/80">Tú y {matchInfo.name} son compatibles al {Math.round(matchInfo.score)} %.</p>
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
