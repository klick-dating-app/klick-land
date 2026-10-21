'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Camera, ImagePlus, MapPin, X } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { db, storage } from '@/lib/firebase';
import { api } from '@/lib/api';
import { pickPhoto } from '@/lib/platform/photo';
import { getApproxLocation } from '@/lib/platform/location';
import { Button } from '@/components/ui/button';
import { Chips, Field, Toggle, inputCls } from '@/components/app/form';
import * as O from '@/lib/klick/options';
import type { Questionnaire } from '@/lib/types';

const STEPS = ['Sobre ti', 'Fotos', 'Fe y matrimonio', 'Familia y estilo de vida', 'Intereses y preferencias'];

const EMPTY_Q: Questionnaire = {
  faith: 'LDS',
  faithImportance: 'Important',
  templeRecommend: 'Prefiero no indicar',
  templeMarriageRequirement: 'Preferred',
  servedMission: '',
  maritalStatus: 'Soltero/a',
  seekingMarriage: true,
  marriageTimeline: 'Flexible',
  marriageIndispensable: false,
  hasChildren: false,
  wantsChildren: 'No seguro',
  acceptsPartnerWithChildren: 'Flexible',
  familyIndispensable: false,
  languages: ['English'],
  lifestyleRoutine: [],
  occupation: '',
  communicationStyle: 'Directo',
  hobbies: [],
  sports: [],
  preferredDateTypes: ['Café'],
  minAge: 21,
  maxAge: 40,
  maxDistanceMiles: 50,
};

export default function OnboardingPage() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const editing = profile?.onboarded === true;

  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('female');
  const [interestedIn, setInterestedIn] = useState<'male' | 'female'>('male');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [bio, setBio] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [q, setQ] = useState<Questionnaire>(EMPTY_Q);
  const set = <K extends keyof Questionnaire>(k: K, v: Questionnaire[K]) => setQ((p) => ({ ...p, [k]: v }));

  // Al editar, precarga el perfil existente.
  useEffect(() => {
    if (!user || !profile?.onboarded) return;
    setName(profile.name);
    setGender(profile.gender);
    setInterestedIn(profile.interestedIn);
    setCity(profile.city);
    setState(profile.state);
    setCoords({ lat: profile.lat, lng: profile.lng });
    setBio(profile.bio);
    setPhotos(profile.photos);
    void getDoc(doc(db, `users/${user.uid}/restricted/details`)).then((s) => s.exists() && setQ(s.data() as Questionnaire));
  }, [user, profile]);

  const locate = async () => {
    try {
      setCoords(await getApproxLocation());
      toast.success('Ubicación aproximada guardada');
    } catch {
      toast.error('No pudimos obtener tu ubicación. Revisa los permisos.');
    }
  };

  const addPhoto = async (source: 'camera' | 'gallery') => {
    if (!user || photos.length >= 6) return;
    try {
      const blob = await pickPhoto(source);
      if (!blob) return;
      setBusy(true);
      const r = ref(storage, `profiles/${user.uid}/${Date.now()}.jpg`);
      await uploadBytes(r, blob, { contentType: blob.type || 'image/jpeg' });
      const url = await getDownloadURL(r);
      setPhotos((p) => [...p, url]);
    } catch {
      toast.error('No se pudo subir la foto (máx. 5 MB).');
    } finally {
      setBusy(false);
    }
  };

  const stepValid = [
    name.trim().length >= 2 && (editing || /^\d{4}-\d{2}-\d{2}$/.test(dob)) && city.trim() && state.trim() && coords,
    photos.length >= 1,
    true,
    true,
    q.maxAge >= q.minAge,
  ][step];

  const finish = async () => {
    if (!coords) return;
    setBusy(true);
    try {
      await api.saveProfile({
        name,
        ...(editing ? {} : { dob, gender }),
        interestedIn,
        city,
        state,
        ...coords,
        photos,
        bio,
        questionnaire: q,
      });
      toast.success(editing ? 'Perfil actualizado' : '¡Perfil creado!');
      router.replace('/app/discover/');
    } catch (e: any) {
      toast.error(e?.message ?? 'No se pudo guardar el perfil');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6 p-5 pb-10 pt-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-wider text-primary">Paso {step + 1} de {STEPS.length}</p>
        <h1 className="text-3xl font-extrabold tracking-tight">{STEPS[step]}</h1>
        <div className="h-1.5 rounded-full bg-muted">
          <div className="h-full rounded-full bg-gradient-to-r from-rose-500 to-orange-500 transition-all" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
        </div>
      </header>

      {step === 0 && (
        <div className="space-y-4">
          <Field label="Nombre público"><input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} maxLength={40} /></Field>
          {!editing && (
            <>
              <Field label="Fecha de nacimiento" hint="Debes ser mayor de 18 años. No se puede cambiar después.">
                <input type="date" className={inputCls} value={dob} onChange={(e) => setDob(e.target.value)} max={new Date().toISOString().slice(0, 10)} />
              </Field>
              <Field label="Soy"><Chips options={['Mujer', 'Hombre']} value={gender === 'female' ? 'Mujer' : 'Hombre'} onChange={(v) => setGender(v === 'Mujer' ? 'female' : 'male')} /></Field>
            </>
          )}
          <Field label="Busco"><Chips options={['Mujeres', 'Hombres']} value={interestedIn === 'female' ? 'Mujeres' : 'Hombres'} onChange={(v) => setInterestedIn(v === 'Mujeres' ? 'female' : 'male')} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Ciudad"><input className={inputCls} value={city} onChange={(e) => setCity(e.target.value)} /></Field>
            <Field label="Estado"><input className={inputCls} value={state} onChange={(e) => setState(e.target.value)} /></Field>
          </div>
          <Button type="button" variant="outline" className="w-full" onClick={locate}>
            <MapPin className="mr-2 h-4 w-4" /> {coords ? 'Ubicación guardada ✓' : 'Usar mi ubicación aproximada'}
          </Button>
          <Field label="Sobre mí" hint={`${bio.length}/500`}>
            <textarea className={inputCls} rows={4} maxLength={500} value={bio} onChange={(e) => setBio(e.target.value)} />
          </Field>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Sube de 1 a 6 fotos nítidas donde se te vea bien. Revisamos todas las fotos.</p>
          <div className="grid grid-cols-3 gap-2">
            {photos.map((url) => (
              <div key={url} className="relative aspect-[3/4] overflow-hidden rounded-xl bg-muted">
                <Image src={url} alt="" fill unoptimized className="object-cover" />
                <button className="absolute right-1 top-1 rounded-full bg-black/60 p-1" onClick={() => setPhotos((p) => p.filter((x) => x !== url))} aria-label="Quitar foto">
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" className="flex-1" disabled={busy || photos.length >= 6} onClick={() => addPhoto('gallery')}>
              <ImagePlus className="mr-2 h-4 w-4" /> Galería
            </Button>
            <Button type="button" variant="outline" className="flex-1" disabled={busy || photos.length >= 6} onClick={() => addPhoto('camera')}>
              <Camera className="mr-2 h-4 w-4" /> Cámara
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <Field label="Fe"><Chips options={O.FAITHS} value={q.faith} onChange={(v) => set('faith', v)} /></Field>
          <Field label="Importancia de la fe"><Chips options={['Very important', 'Important', 'Flexible']} value={q.faithImportance} onChange={(v) => set('faithImportance', v)} /></Field>
          <Field label="Recomendación del templo"><Chips options={['Sí', 'En proceso', 'No', 'Prefiero no indicar']} value={q.templeRecommend} onChange={(v) => set('templeRecommend', v)} /></Field>
          <Field label="Matrimonio en el templo"><Chips options={['Indispensable', 'Preferred', 'Flexible']} value={q.templeMarriageRequirement} onChange={(v) => set('templeMarriageRequirement', v)} /></Field>
          <Toggle label="Busco matrimonio" checked={q.seekingMarriage} onChange={(v) => set('seekingMarriage', v)} />
          <Toggle label="Es indispensable que mi pareja busque matrimonio" checked={q.marriageIndispensable} onChange={(v) => set('marriageIndispensable', v)} />
          <Field label="Plazo"><Chips options={['<1 año', '1-2 años', '2+ años', 'Flexible']} value={q.marriageTimeline} onChange={(v) => set('marriageTimeline', v)} /></Field>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <Toggle label="Tengo hijos" checked={q.hasChildren} onChange={(v) => set('hasChildren', v)} />
          <Field label="¿Quiero hijos?"><Chips options={['Sí', 'No', 'No seguro']} value={q.wantsChildren} onChange={(v) => set('wantsChildren', v)} /></Field>
          <Field label="¿Acepto pareja con hijos?"><Chips options={['Sí', 'No', 'Flexible']} value={q.acceptsPartnerWithChildren} onChange={(v) => set('acceptsPartnerWithChildren', v)} /></Field>
          <Toggle label="Mi preferencia sobre hijos es indispensable" checked={q.familyIndispensable} onChange={(v) => set('familyIndispensable', v)} />
          <Field label="Idiomas"><Chips multiple options={O.LANGUAGES} value={q.languages} onChange={(v) => set('languages', v)} /></Field>
          <Field label="Estilo de vida"><Chips multiple options={O.LIFESTYLE} value={q.lifestyleRoutine} onChange={(v) => set('lifestyleRoutine', v)} /></Field>
          <Field label="Comunicación"><Chips options={O.COMMUNICATION} value={q.communicationStyle} onChange={(v) => set('communicationStyle', v)} /></Field>
          <Field label="Ocupación"><input className={inputCls} value={q.occupation} onChange={(e) => set('occupation', e.target.value)} maxLength={80} /></Field>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <Field label="Hobbies"><Chips multiple options={O.HOBBIES} value={q.hobbies} onChange={(v) => set('hobbies', v)} /></Field>
          <Field label="Deportes"><Chips multiple options={O.SPORTS} value={q.sports} onChange={(v) => set('sports', v)} /></Field>
          <Field label="Primera cita ideal"><Chips multiple options={O.DATE_TYPES} value={q.preferredDateTypes} onChange={(v) => set('preferredDateTypes', v)} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Edad mínima"><input type="number" className={inputCls} min={18} max={99} value={q.minAge} onChange={(e) => set('minAge', Number(e.target.value))} /></Field>
            <Field label="Edad máxima"><input type="number" className={inputCls} min={18} max={99} value={q.maxAge} onChange={(e) => set('maxAge', Number(e.target.value))} /></Field>
          </div>
          <Field label={`Distancia máxima: ${q.maxDistanceMiles} millas`}>
            <input type="range" className="w-full accent-[hsl(var(--primary))]" min={5} max={200} step={5} value={q.maxDistanceMiles} onChange={(e) => set('maxDistanceMiles', Number(e.target.value))} />
          </Field>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        {step > 0 && <Button variant="outline" onClick={() => setStep(step - 1)} disabled={busy}>Atrás</Button>}
        {step < STEPS.length - 1 ? (
          <Button className="flex-1" disabled={!stepValid || busy} onClick={() => setStep(step + 1)}>Continuar</Button>
        ) : (
          <Button className="flex-1" disabled={!stepValid || busy} onClick={finish}>{busy ? 'Guardando…' : editing ? 'Guardar cambios' : 'Crear mi perfil'}</Button>
        )}
      </div>
    </div>
  );
}
