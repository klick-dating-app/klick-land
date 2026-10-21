'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { addDoc, collection, doc, setDoc, updateDoc } from 'firebase/firestore';
import { CalendarHeart, CheckCircle2, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Chips, Field, Spinner, inputCls } from '@/components/app/form';
import { SAFE_VENUES } from '@/lib/klick/options';
import { useMatch, useSafeDates } from '@/hooks/useKlickData';
import type { SafeDate } from '@/lib/types';

function SafeDates() {
  const matchId = useSearchParams().get('matchId');
  const { user } = useAuth();
  const dates = useSafeDates(user?.uid);
  const { match } = useMatch(matchId);
  const [venueType, setVenueType] = useState(SAFE_VENUES[0]);
  const [venueName, setVenueName] = useState('');
  const [venueAddress, setVenueAddress] = useState('');
  const [when, setWhen] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [busy, setBusy] = useState(false);

  const create = async () => {
    if (!user || !match) return;
    const dateTimeMs = new Date(when).getTime();
    if (!venueName.trim() || Number.isNaN(dateTimeMs) || dateTimeMs < Date.now()) return toast.error('Elige un lugar público y una fecha futura.');
    setBusy(true);
    try {
      const ref = await addDoc(collection(db, 'safeDates'), {
        matchId: match.id,
        participants: match.members,
        createdBy: user.uid,
        venueType,
        venueName: venueName.trim(),
        venueAddress: venueAddress.trim(),
        dateTimeMs,
        status: 'scheduled',
        checkins: {},
      });
      if (contactName.trim() && contactPhone.trim()) {
        await setDoc(doc(db, `safeDates/${ref.id}/private/contact`), { name: contactName.trim(), phone: contactPhone.trim() });
      }
      toast.success('Safe First Date creada. Te avisaremos antes de la cita.');
      history.replaceState(null, '', '/app/safe-date/');
    } catch {
      toast.error('No se pudo crear el plan');
    } finally {
      setBusy(false);
    }
  };

  const checkIn = (d: SafeDate) => updateDoc(doc(db, 'safeDates', d.id), { [`checkins.${user!.uid}`]: true }).then(() => toast.success('Check-in confirmado. ¡Disfruta!'));
  const setStatus = (d: SafeDate, status: 'completed' | 'cancelled') => updateDoc(doc(db, 'safeDates', d.id), { status });

  return (
    <div className="space-y-6 px-5 pt-6">
      <header className="space-y-1">
        <h1 className="flex items-center gap-2 text-3xl font-extrabold tracking-tight"><ShieldCheck className="h-6 w-6 text-primary" /> Safe First Date</h1>
        <p className="text-sm text-muted-foreground">Lugar público, horario de día y un contacto de confianza. Te recordamos 1 hora antes y te pedimos confirmar que llegaste bien.</p>
      </header>

      {match && (
        <section className="space-y-4 surface p-5">
          <h2 className="font-semibold">Nueva cita con {match.profiles[match.members.find((m) => m !== user?.uid)!]?.name}</h2>
          <Field label="Tipo de lugar"><Chips options={SAFE_VENUES} value={venueType} onChange={setVenueType} /></Field>
          <Field label="Nombre del lugar"><input className={inputCls} value={venueName} onChange={(e) => setVenueName(e.target.value)} /></Field>
          <Field label="Dirección"><input className={inputCls} value={venueAddress} onChange={(e) => setVenueAddress(e.target.value)} /></Field>
          <Field label="Fecha y hora"><input type="datetime-local" className={inputCls} value={when} onChange={(e) => setWhen(e.target.value)} /></Field>
          <Field label="Contacto de confianza (opcional)" hint="Solo tú puedes verlo.">
            <div className="grid grid-cols-2 gap-2">
              <input className={inputCls} placeholder="Nombre" value={contactName} onChange={(e) => setContactName(e.target.value)} />
              <input className={inputCls} placeholder="Teléfono" inputMode="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
            </div>
          </Field>
          <Button className="w-full" disabled={busy} onClick={create}>Crear plan</Button>
        </section>
      )}

      {!dates ? <div className="flex justify-center py-10"><Spinner /></div> : dates.length === 0 && !match ? (
        <div className="flex flex-col items-center gap-2 py-12 text-center text-muted-foreground">
          <CalendarHeart className="h-10 w-10" />
          <p className="text-sm">Planea tu primera cita desde el chat con un match.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {dates.map((d) => (
            <li key={d.id} className="space-y-3 surface p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{d.venueName}</p>
                  <p className="flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-4 w-4" />{d.venueAddress || 'Lugar público'}</p>
                  <p className="text-sm">{new Date(d.dateTimeMs).toLocaleString('es', { dateStyle: 'full', timeStyle: 'short' })}</p>
                </div>
                <span className="rounded-full bg-muted px-2.5 py-1 text-xs">{d.status === 'scheduled' ? 'Programada' : d.status === 'completed' ? 'Completada' : 'Cancelada'}</span>
              </div>
              {d.status === 'scheduled' && (
                <div className="flex flex-wrap gap-2">
                  {d.checkins?.[user!.uid] ? (
                    <span className="flex items-center gap-1 text-sm text-emerald-500"><CheckCircle2 className="h-4 w-4" /> Check-in hecho</span>
                  ) : (
                    <Button size="sm" onClick={() => checkIn(d)}>Llegué bien</Button>
                  )}
                  <Button size="sm" variant="outline" onClick={() => setStatus(d, 'completed')}>Terminó</Button>
                  <Button size="sm" variant="ghost" onClick={() => setStatus(d, 'cancelled')}>Cancelar</Button>
                  <a href="tel:911" className="inline-flex items-center gap-1 rounded-md bg-destructive px-3 py-1.5 text-sm text-white"><Phone className="h-4 w-4" /> Emergencia</a>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function SafeDatePage() {
  return <Suspense fallback={null}><SafeDates /></Suspense>;
}
