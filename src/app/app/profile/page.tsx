'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ref, uploadBytes } from 'firebase/storage';
import { BadgeCheck, ChevronRight, Crown, Pencil, Settings, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { storage } from '@/lib/firebase';
import { useVerificationStatus } from '@/hooks/useKlickData';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { pickPhoto } from '@/lib/platform/photo';
import { Button } from '@/components/ui/button';

const PLAN_LABEL: Record<string, string> = { free: 'Gratis', basic: 'Básico', premium: 'Premium', vip: 'VIP' };

export default function ProfilePage() {
  const { user, profile, entitlement } = useAuth();
  const verification = useVerificationStatus(user?.uid);
  const [busy, setBusy] = useState(false);

  if (!user || !profile) return null;

  const verify = async () => {
    try {
      const blob = await pickPhoto('camera');
      if (!blob) return;
      setBusy(true);
      await uploadBytes(ref(storage, `verification/${user.uid}/selfie.jpg`), blob, { contentType: 'image/jpeg' });
      await api.requestVerification({});
      toast.success('Selfie enviado. Te avisaremos cuando sea revisado.');
    } catch {
      toast.error('No se pudo enviar la verificación');
    } finally {
      setBusy(false);
    }
  };

  const plan = profile.gender === 'female' ? 'Gratis completo' : PLAN_LABEL[entitlement?.plan ?? 'free'];
  const row = 'flex items-center justify-between gap-3 border-b border-foreground/10 py-4 transition active:opacity-70';
  return (
    <div className="space-y-5 pb-4">
      <section className="relative overflow-hidden px-5 pb-8 pt-10 text-center">
        <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-gradient-to-b from-purple-700/25 via-blue-700/10 to-transparent blur-3xl" />
        <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-full ring-1 ring-foreground/30 ring-offset-4 ring-offset-background">
          {profile.photos[0] && <Image src={profile.photos[0]} alt="" fill unoptimized className="object-cover" />}
        </div>
        <h1 className="relative mt-5 flex items-center justify-center gap-2 text-3xl font-light tracking-tighter">
          {profile.name}, {profile.age}
          {profile.verified && <BadgeCheck className="h-6 w-6 fill-blue-500 text-white" />}
        </h1>
        <p className="eyebrow relative mt-2">{profile.city}, {profile.state}</p>
        <span className="pill relative mt-4"><Crown className="h-3 w-3 text-blue-600 dark:text-blue-400" /> Plan {plan}</span>
      </section>

      <div className="px-5">
        <Link href="/app/onboarding/" className={row}><span className="flex items-center gap-3 font-light"><Pencil className="h-5 w-5 text-blue-600 dark:text-blue-400" strokeWidth={1.5} /> Editar perfil y preferencias</span><ChevronRight className="h-5 w-5 text-muted-foreground" /></Link>

        <div className={row}>
          <span className="flex items-center gap-3 font-light"><ShieldCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" strokeWidth={1.5} />
            {profile.verified ? 'Identidad verificada' : verification === 'pending' ? 'Verificación en revisión' : verification === 'rejected' ? 'Verificación rechazada' : 'Verifica tu identidad'}
          </span>
          {!profile.verified && verification !== 'pending' && <Button size="sm" disabled={busy} onClick={verify}>Selfie</Button>}
        </div>

        {profile.gender === 'male' && <Link href="/app/upgrade/" className={row}><span className="flex items-center gap-3 font-light"><Crown className="h-5 w-5 text-blue-600 dark:text-blue-400" strokeWidth={1.5} /> Planes y suscripción</span><ChevronRight className="h-5 w-5 text-muted-foreground" /></Link>}

        <Link href="/app/settings/" className={row}><span className="flex items-center gap-3 font-light"><Settings className="h-5 w-5 text-blue-600 dark:text-blue-400" strokeWidth={1.5} /> Configuración y apariencia</span><ChevronRight className="h-5 w-5 text-muted-foreground" /></Link>
      </div>
    </div>
  );
}
