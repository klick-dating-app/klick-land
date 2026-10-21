'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, MapPin, ShieldCheck, X } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { ScoreBadge, Spinner } from '@/components/app/form';
import SafetyMenu from '@/components/app/SafetyMenu';
import type { Candidate } from '@/lib/types';

export default function DiscoverPage() {
  const { entitlement } = useAuth();
  const [queue, setQueue] = useState<Candidate[] | null>(null);
  const [photoIdx, setPhotoIdx] = useState(0);
  const [matchInfo, setMatchInfo] = useState<{ id: string; name: string; score: number } | null>(null);
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
      if (r.matched && r.matchId) setMatchInfo({ id: r.matchId, name: current.name, score: r.score ?? current.score });
      next();
    } catch (e: any) {
      toast.error(e?.message ?? 'Error');
    } finally {
      setBusy(false);
    }
  };

  if (!queue) return <div className="flex h-[70dvh] items-center justify-center"><Spinner className="h-8 w-8" /></div>;

  if (!current) {
    return (
      <div className="flex h-[70dvh] flex-col items-center justify-center gap-4 p-8 text-center">
        <ShieldCheck className="h-12 w-12 text-primary" />
        <h2 className="text-xl font-bold">Por ahora no hay más perfiles</h2>
        <p className="text-sm text-muted-foreground">Solo mostramos personas verificadas con compatibilidad de 60 % o más. Vuelve pronto o amplía tus preferencias.</p>
        <Button onClick={load}>Actualizar</Button>
      </div>
    );
  }

  const groundShown = entitlement?.canViewDetails ? current.commonGround : current.commonGround.slice(0, 3);
  return (
    <div className="space-y-4 p-4">
      <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-muted shadow-xl">
        {current.photos[photoIdx] && <Image src={current.photos[photoIdx]} alt={current.name} fill unoptimized priority className="object-cover" />}
        <button className="absolute inset-y-0 left-0 w-1/2" aria-label="Foto anterior" onClick={() => setPhotoIdx((i) => Math.max(0, i - 1))} />
        <button className="absolute inset-y-0 right-0 w-1/2" aria-label="Foto siguiente" onClick={() => setPhotoIdx((i) => Math.min(current.photos.length - 1, i + 1))} />
        <div className="absolute inset-x-3 top-3 flex gap-1">
          {current.photos.map((_, i) => <span key={i} className={`h-1 flex-1 rounded-full ${i === photoIdx ? 'bg-white' : 'bg-white/40'}`} />)}
        </div>
        <div className="absolute right-3 top-6"><SafetyMenu targetId={current.uid} onDone={next} /></div>
        <div className="absolute inset-x-0 bottom-0 space-y-1 bg-gradient-to-t from-black/85 to-transparent p-4 pt-16 text-white">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-2xl font-bold">
              {current.name}, {current.age}
              {current.verified && <ShieldCheck className="h-5 w-5 text-emerald-400" aria-label="Verificado" />}
            </h2>
            <ScoreBadge score={current.score} />
          </div>
          <p className="flex items-center gap-1 text-sm text-white/80"><MapPin className="h-4 w-4" />{current.city}, {current.state} · {current.distanceMiles} mi</p>
          {current.bio && <p className="line-clamp-2 text-sm text-white/90">{current.bio}</p>}
        </div>
      </div>

      {groundShown.length > 0 && (
        <section className="rounded-2xl border bg-card p-4">
          <h3 className="mb-2 text-sm font-semibold">Common Ground</h3>
          <ul className="space-y-1 text-sm text-muted-foreground">{groundShown.map((g) => <li key={g}>• {g}</li>)}</ul>
          {!entitlement?.canViewDetails && current.commonGround.length > 3 && (
            <Link href="/app/upgrade/" className="mt-2 inline-block text-sm text-primary">Ver todo con Premium →</Link>
          )}
        </section>
      )}

      <div className="flex justify-center gap-6">
        <button disabled={busy} onClick={() => act('pass')} aria-label="Pasar" className="rounded-full border-2 border-muted-foreground/40 p-5 active:scale-95"><X className="h-8 w-8" /></button>
        <button disabled={busy} onClick={() => act('like')} aria-label="Me gusta" className="rounded-full bg-primary p-5 text-primary-foreground shadow-lg active:scale-95"><Heart className="h-8 w-8" fill="currentColor" /></button>
      </div>

      {matchInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6">
          <div className="w-full max-w-sm space-y-4 rounded-3xl bg-card p-8 text-center">
            <h2 className="text-3xl font-extrabold text-primary">¡Hicieron Klick!</h2>
            <p>Tú y {matchInfo.name} son compatibles al {Math.round(matchInfo.score)} %.</p>
            <Link href={`/app/chat/?id=${matchInfo.id}`}><Button className="w-full">Enviar mensaje</Button></Link>
            <Button variant="ghost" className="w-full" onClick={() => setMatchInfo(null)}>Seguir explorando</Button>
          </div>
        </div>
      )}
    </div>
  );
}
