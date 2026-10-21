'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ref, uploadBytes } from 'firebase/storage';
import { BadgeCheck, ChevronRight, Crown, LogOut, Pencil, ShieldCheck, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { storage } from '@/lib/firebase';
import { useVerificationStatus } from '@/hooks/useKlickData';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { pickPhoto } from '@/lib/platform/photo';
import { Button } from '@/components/ui/button';

const PLAN_LABEL: Record<string, string> = { free: 'Gratis', basic: 'Básico', premium: 'Premium', vip: 'VIP' };

export default function ProfilePage() {
  const { user, profile, entitlement, signOut } = useAuth();
  const router = useRouter();
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

  const remove = async () => {
    if (!confirm('Esto eliminará tu cuenta, fotos, matches y mensajes de forma permanente. ¿Continuar?')) return;
    setBusy(true);
    try {
      await api.deleteAccount({});
      await signOut();
      router.replace('/');
    } catch {
      toast.error('No se pudo eliminar la cuenta. Cierra sesión, vuelve a entrar e inténtalo de nuevo.');
      setBusy(false);
    }
  };

  const plan = profile.gender === 'female' ? 'Gratis completo' : PLAN_LABEL[entitlement?.plan ?? 'free'];
  const row = 'flex items-center justify-between gap-3 border-b border-white/10 py-4 transition active:opacity-70';
  return (
    <div className="space-y-5 pb-4">
      <section className="relative overflow-hidden px-5 pb-8 pt-10 text-center">
        <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-gradient-to-b from-purple-700/25 via-blue-700/10 to-transparent blur-3xl" />
        <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-full ring-1 ring-white/30 ring-offset-4 ring-offset-black">
          {profile.photos[0] && <Image src={profile.photos[0]} alt="" fill unoptimized className="object-cover" />}
        </div>
        <h1 className="relative mt-5 flex items-center justify-center gap-2 text-3xl font-light tracking-tighter">
          {profile.name}, {profile.age}
          {profile.verified && <BadgeCheck className="h-6 w-6 fill-blue-500 text-white" />}
        </h1>
        <p className="eyebrow relative mt-2">{profile.city}, {profile.state}</p>
        <span className="pill relative mt-4"><Crown className="h-3 w-3 text-blue-400" /> Plan {plan}</span>
      </section>

      <div className="px-5">
        <Link href="/app/onboarding/" className={row}><span className="flex items-center gap-3 font-light"><Pencil className="h-5 w-5 text-blue-400" strokeWidth={1.5} /> Editar perfil y preferencias</span><ChevronRight className="h-5 w-5 text-zinc-600" /></Link>

        <div className={row}>
          <span className="flex items-center gap-3 font-light"><ShieldCheck className="h-5 w-5 text-blue-400" strokeWidth={1.5} />
            {profile.verified ? 'Identidad verificada' : verification === 'pending' ? 'Verificación en revisión' : verification === 'rejected' ? 'Verificación rechazada' : 'Verifica tu identidad'}
          </span>
          {!profile.verified && verification !== 'pending' && <Button size="sm" disabled={busy} onClick={verify}>Selfie</Button>}
        </div>

        {profile.gender === 'male' && <Link href="/app/upgrade/" className={row}><span className="flex items-center gap-3 font-light"><Crown className="h-5 w-5 text-blue-400" strokeWidth={1.5} /> Planes y suscripción</span><ChevronRight className="h-5 w-5 text-zinc-600" /></Link>}

        <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 pt-3 text-xs text-muted-foreground">
          <Link href="/privacy/">Privacidad</Link><Link href="/terms/">Términos</Link><Link href="/safe-dates/">Seguridad</Link><Link href="/contact/">Soporte</Link>
        </div>

        <Button variant="outline" className="mt-6 w-full" onClick={() => signOut().then(() => router.replace('/'))}><LogOut className="mr-2 h-4 w-4" /> Cerrar sesión</Button>
        <Button variant="ghost" className="w-full text-destructive" disabled={busy} onClick={remove}><Trash2 className="mr-2 h-4 w-4" /> Eliminar mi cuenta</Button>
      </div>
    </div>
  );
}
