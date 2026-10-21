'use client';

import { Suspense, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { addDoc, collection, doc, setDoc, updateDoc } from 'firebase/firestore';
import { CalendarCheck, CheckCircle2, Coffee, MapPin, Phone, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { db } from '@/lib/firebase';
import { DEMO, demoStore } from '@/lib/demo';
import { useAuth } from '@/context/AuthContext';
import { useMatch, useMatches, useSafeDates } from '@/hooks/useKlickData';
import { Chips, Field, Spinner, inputCls } from '@/components/app/form';
import { SAFE_VENUES } from '@/lib/klick/options';
import type { SafeDate } from '@/lib/types';

const STEPS = ['Plan', 'Recordatorio', 'Check-in', 'Feedback'];

function when(ms: number) {
  const days = Math.round((ms - Date.now()) / 86_400_000);
  const label = days <= 0 ? 'Hoy' : days === 1 ? 'Mañana' : `En ${days} días`;
  return `${label} · ${new Date(ms).toLocaleString('es', { weekday: 'long', hour: 'numeric', minute: '2-digit' })}`;
}

function SafeDates() {
  const router = useRouter();
  const matchId = useSearchParams().get('matchId');
  const { user } = useAuth();
  const dates = useSafeDates(user?.uid);
  const matches = useMatches(user?.uid);
  const { match } = useMatch(matchId);
  const [venueType, setVenueType] = useState(SAFE_VENUES[0]);
  const [venueName, setVenueName] = useState('');
  const [venueAddress, setVenueAddress] = useState('');
  const [datetime, setDatetime] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [busy, setBusy] = useState(false);

  const create = async () => {
    if (!user || !match) return;
    const dateTimeMs = new Date(datetime).getTime();
    if (!venueName.trim() || Number.isNaN(dateTimeMs) || dateTimeMs < Date.now()) return toast.error('Elige un lugar público y una fecha futura.');
    setBusy(true);
    try {
      const plan = { matchId: match.id, participants: match.members, createdBy: user.uid, venueType, venueName: venueName.trim(), venueAddress: venueAddress.trim(), dateTimeMs, status: 'scheduled' as const, checkins: {} };
      if (DEMO) demoStore.addDate(plan);
      else {
        const ref = await addDoc(collection(db, 'safeDates'), plan);
        if (contactName.trim() && contactPhone.trim()) await setDoc(doc(db, `safeDates/${ref.id}/private/contact`), { name: contactName.trim(), phone: contactPhone.trim() });
      }
      toast.success('¡Cita creada! Te avisaremos antes de que llegue.');
      setVenueName(''); setVenueAddress(''); setDatetime('');
      router.replace('/app/safe-date/');
    } catch {
      toast.error('No se pudo crear el plan');
    } finally {
      setBusy(false);
    }
  };

  const patch = (d: SafeDate, p: Partial<SafeDate> & Record<string, unknown>) => (DEMO ? Promise.resolve(demoStore.patchDate(d.id, p as Partial<SafeDate>)) : updateDoc(doc(db, 'safeDates', d.id), p));
  const checkIn = (d: SafeDate) => (DEMO ? patch(d, { checkins: { ...d.checkins, [user!.uid]: true } }) : patch(d, { [`checkins.${user!.uid}`]: true })).then(() => toast.success('Check-in confirmado. ¡Disfruta!'));

  if (!dates || !matches) return <div className="flex h-[70dvh] items-center justify-center"><Spinner className="h-7 w-7" /></div>;

  const upcoming = dates.filter((d) => d.status === 'scheduled');
  const past = dates.filter((d) => d.status !== 'scheduled');
  const nameOf = (d: SafeDate) => {
    const m = matches.find((x) => x.id === d.matchId);
    return m?.profiles[m.members.find((x) => x !== user?.uid) ?? '']?.name ?? 'tu match';
  };
  const photoOf = (d: SafeDate) => {
    const m = matches.find((x) => x.id === d.matchId);
    return m?.profiles[m.members.find((x) => x !== user?.uid) ?? '']?.photo ?? null;
  };

  return (
    <div className="space-y-8 px-5 pt-8">
      <header className="space-y-2">
        <div className="flex items-end justify-between">
          <div>
            <p className="eyebrow">Safe First Date</p>
            <h1 className="text-[26px] font-light tracking-tight">Citas seguras</h1>
          </div>
          {!matchId && matches.length > 0 && <a href="#nueva" className="btn-brand !px-4 !py-2 text-xs"><Plus className="h-3.5 w-3.5" /> Nueva</a>}
        </div>
        <p className="text-sm font-light leading-relaxed text-muted-foreground">Todo en Klick lleva a esto: conocerse en persona, con seguridad.</p>
      </header>

      <ol className="flex items-center justify-between gap-1">
        {STEPS.map((s, i) => (
          <li key={s} className="flex flex-1 flex-col items-center gap-1.5 text-center">
            <span className="text-sm font-light text-foreground/60">0{i + 1}</span>
            <span className="eyebrow !text-[9px]">{s}</span>
          </li>
        ))}
      </ol>

      {upcoming.length > 0 && (
        <section className="space-y-3">
          <span className="section-label">Próximas ({upcoming.length})</span>
          {upcoming.map((d, i) => (
            <div key={d.id} className={`surface space-y-4 p-5 ${i === 0 ? '!border-blue-500/40' : ''}`}>
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-muted">{photoOf(d) && <Image src={photoOf(d)!} alt="" fill unoptimized className="object-cover" />}</div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium tracking-tight">Cita con {nameOf(d)}</p>
                  <p className="text-xs font-medium text-blue-600 dark:text-blue-400">{when(d.dateTimeMs)}</p>
                </div>
              </div>
              <div className="space-y-1 text-sm font-light text-foreground/80">
                <p className="flex items-center gap-2"><Coffee className="h-4 w-4 text-muted-foreground" />{d.venueName}</p>
                <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" />{d.venueAddress || 'Lugar público'}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {d.checkins?.[user!.uid] ? (
                  <span className="flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400"><CheckCircle2 className="h-4 w-4" /> Check-in hecho</span>
                ) : (
                  <button className="btn-brand !px-5 !py-2.5 text-sm" onClick={() => checkIn(d)}>Llegué bien</button>
                )}
                <button className="btn-ghost !px-5 !py-2.5 text-sm" onClick={() => patch(d, { status: 'completed' })}>Terminó</button>
                <button className="px-3 text-sm text-muted-foreground" onClick={() => patch(d, { status: 'cancelled' })}>Cancelar</button>
                <a href="tel:911" className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-red-500/40 px-4 py-2.5 text-sm font-medium text-red-500"><Phone className="h-4 w-4" /> 911</a>
              </div>
            </div>
          ))}
        </section>
      )}

      <section id="nueva" className="space-y-4">
        {!match ? (
          <>
            <span className="section-label">{matches.length ? 'Planear una cita con…' : 'Aún no hay Klicks'}</span>
            {matches.length === 0 ? (
              <div className="surface flex flex-col items-center gap-3 p-8 text-center">
                <CalendarCheck className="h-7 w-7 text-blue-500" strokeWidth={1.4} />
                <p className="text-sm font-light text-muted-foreground">Haz Klick con alguien y planea tu primera cita aquí.</p>
                <Link href="/app/discover/" className="btn-ghost">Ir a Partner</Link>
              </div>
            ) : (
              <div className="no-scrollbar -mx-1 flex gap-4 overflow-x-auto px-1 py-1">
                {matches.map((m) => {
                  const o = m.profiles[m.members.find((x) => x !== user?.uid)!];
                  return (
                    <Link key={m.id} href={`/app/safe-date/?matchId=${m.id}`} className="shrink-0 text-center">
                      <div className="relative h-16 w-16 overflow-hidden rounded-full ring-1 ring-foreground/30 ring-offset-2 ring-offset-background">{o?.photo && <Image src={o.photo} alt="" fill unoptimized className="object-cover" />}</div>
                      <p className="mt-1.5 text-xs font-medium">{o?.name}</p>
                    </Link>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <div className="surface space-y-5 p-6">
            <h2 className="text-xl font-light tracking-tight">Nueva cita con {match.profiles[match.members.find((m) => m !== user?.uid)!]?.name}</h2>
            <Field label="Tipo de lugar"><Chips options={SAFE_VENUES} value={venueType} onChange={setVenueType} /></Field>
            <Field label="Nombre del lugar"><input className={inputCls} value={venueName} onChange={(e) => setVenueName(e.target.value)} /></Field>
            <Field label="Dirección"><input className={inputCls} value={venueAddress} onChange={(e) => setVenueAddress(e.target.value)} /></Field>
            <Field label="Fecha y hora"><input type="datetime-local" className={inputCls} value={datetime} onChange={(e) => setDatetime(e.target.value)} /></Field>
            <Field label="Contacto de confianza (opcional)" hint="Solo tú puedes verlo.">
              <div className="grid grid-cols-2 gap-2">
                <input className={inputCls} placeholder="Nombre" value={contactName} onChange={(e) => setContactName(e.target.value)} />
                <input className={inputCls} placeholder="Teléfono" inputMode="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
              </div>
            </Field>
            <button className="btn-brand w-full" disabled={busy} onClick={create}>Crear cita segura</button>
          </div>
        )}
      </section>

      {past.length > 0 && (
        <section className="space-y-2">
          <span className="section-label">Historial</span>
          {past.map((d) => <p key={d.id} className="flex justify-between border-b border-foreground/10 py-3 text-sm font-light text-muted-foreground"><span>{nameOf(d)} · {d.venueName}</span><span>{d.status === 'completed' ? 'Completada' : 'Cancelada'}</span></p>)}
        </section>
      )}
    </div>
  );
}

export default function SafeDatePage() {
  return <Suspense fallback={null}><SafeDates /></Suspense>;
}
