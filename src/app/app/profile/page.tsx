'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { doc, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';
import { BadgeCheck, ChevronRight, Crown, LogOut, Pencil, ShieldCheck, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { db, storage } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { pickPhoto } from '@/lib/platform/photo';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
  const { user, profile, entitlement, signOut } = useAuth();
  const router = useRouter();
  const [verification, setVerification] = useState<string>('none');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    return onSnapshot(doc(db, 'verifications', user.uid), (s) => setVerification(s.exists() ? s.data().status : 'none'), () => undefined);
  }, [user]);

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

  const row = 'flex items-center justify-between rounded-2xl border bg-card p-4';
  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center gap-4">
        <div className="relative h-20 w-20 overflow-hidden rounded-full bg-muted">
          {profile.photos[0] && <Image src={profile.photos[0]} alt="" fill unoptimized className="object-cover" />}
        </div>
        <div>
          <h1 className="flex items-center gap-1.5 text-2xl font-bold">{profile.name}, {profile.age}{profile.verified && <BadgeCheck className="h-6 w-6 text-emerald-500" />}</h1>
          <p className="text-sm text-muted-foreground">{profile.city}, {profile.state}</p>
          <p className="text-xs text-primary">Plan: {entitlement?.plan === 'free' || !entitlement ? (profile.gender === 'female' ? 'Gratis completo' : 'Gratis') : entitlement.plan}</p>
        </div>
      </div>

      <Link href="/app/onboarding/" className={row}><span className="flex items-center gap-3"><Pencil className="h-5 w-5" /> Editar perfil y preferencias</span><ChevronRight className="h-5 w-5" /></Link>

      <div className={row}>
        <span className="flex items-center gap-3"><ShieldCheck className="h-5 w-5" />
          {profile.verified ? 'Identidad verificada' : verification === 'pending' ? 'Verificación en revisión' : verification === 'rejected' ? 'Verificación rechazada' : 'Verifica tu identidad'}
        </span>
        {!profile.verified && verification !== 'pending' && <Button size="sm" disabled={busy} onClick={verify}>Tomar selfie</Button>}
      </div>

      {profile.gender === 'male' && <Link href="/app/upgrade/" className={row}><span className="flex items-center gap-3"><Crown className="h-5 w-5 text-amber-400" /> Planes y suscripción</span><ChevronRight className="h-5 w-5" /></Link>}

      <div className="flex flex-wrap gap-x-4 gap-y-1 px-1 pt-2 text-xs text-muted-foreground">
        <Link href="/privacy/">Privacidad</Link><Link href="/terms/">Términos</Link><Link href="/safe-dates/">Consejos de seguridad</Link><Link href="/contact/">Soporte</Link>
      </div>

      <Button variant="outline" className="w-full" onClick={() => signOut().then(() => router.replace('/'))}><LogOut className="mr-2 h-4 w-4" /> Cerrar sesión</Button>
      <Button variant="ghost" className="w-full text-destructive" disabled={busy} onClick={remove}><Trash2 className="mr-2 h-4 w-4" /> Eliminar mi cuenta</Button>
    </div>
  );
}
