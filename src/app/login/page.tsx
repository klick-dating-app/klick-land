'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { isFirebaseConfigured } from '@/lib/firebase';
import KlickLogo from '@/components/ui/KlickLogo';
import { ShieldCheck } from 'lucide-react';
import { Field, inputCls } from '@/components/app/form';

const ERRORS: Record<string, string> = {
  'auth/invalid-credential': 'Correo o contraseña incorrectos.',
  'auth/email-already-in-use': 'Ya existe una cuenta con ese correo.',
  'auth/weak-password': 'La contraseña debe tener al menos 8 caracteres.',
  'auth/invalid-email': 'Correo inválido.',
  'auth/too-many-requests': 'Demasiados intentos. Inténtalo más tarde.',
};

export default function LoginPage() {
  const { user, loading, signIn, signUp, resetPassword } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<'signin' | 'signup'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace('/app/');
  }, [loading, user, router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'signup' && (!accepted || password.length < 8)) return toast.error('Acepta los términos y usa una contraseña de 8+ caracteres.');
    setBusy(true);
    try {
      await (mode === 'signup' ? signUp(email, password) : signIn(email, password));
    } catch (err: any) {
      toast.error(ERRORS[err?.code] ?? 'No se pudo iniciar sesión.');
      setBusy(false);
    }
  };

  const forgot = async () => {
    if (!email) return toast.error('Escribe tu correo primero.');
    await resetPassword(email).catch(() => undefined);
    toast.success('Si existe una cuenta, te enviamos un enlace para restablecer tu contraseña.');
  };

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-black">
      <div className="pointer-events-none absolute left-1/2 top-[-10%] h-[350px] w-[350px] -translate-x-1/2 rounded-full bg-gradient-to-b from-purple-900/25 via-pink-900/10 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-10%] right-[-10%] h-[260px] w-[260px] rounded-full bg-cyan-900/15 blur-3xl" />

      <div className="relative z-10 flex w-full max-w-[430px] flex-col justify-between gap-10 px-7 py-10 pb-safe pt-safe">
        <div className="space-y-4 pt-6 text-center">
          <div className="flex items-center justify-center gap-3"><KlickLogo size={48} priority /><span className="text-3xl font-semibold tracking-tight">Klick Dating</span></div>
          <p className="text-brand text-lg font-medium tracking-tight">Make klick with someone real</p>
        </div>

        {!isFirebaseConfigured && <p className="rounded-xl border border-white/10 bg-white/5 p-3 text-center text-xs text-zinc-400">Firebase aún no está configurado (.env.local).</p>}

        <form onSubmit={submit} className="space-y-5">
          <h1 className="eyebrow text-center">{mode === 'signup' ? 'Crea tu cuenta' : 'Bienvenido de vuelta'}</h1>
          <Field label="Correo"><input type="email" required autoComplete="email" className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
          <Field label="Contraseña"><input type="password" required minLength={8} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} className={inputCls} value={password} onChange={(e) => setPassword(e.target.value)} /></Field>
          {mode === 'signup' && (
            <label className="flex items-start gap-2.5 text-[11px] font-light leading-relaxed text-zinc-400">
              <input type="checkbox" className="mt-0.5 accent-blue-500" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} />
              <span>Tengo 18 años o más y acepto los <Link href="/terms/" className="text-white underline">Términos</Link> y la <Link href="/privacy/" className="text-white underline">Política de privacidad</Link>.</span>
            </label>
          )}
          <button className="btn-brand w-full" disabled={busy || !isFirebaseConfigured}>{busy ? 'Un momento…' : mode === 'signup' ? 'Crear cuenta' : 'Entrar'}</button>
          <div className="space-y-2 text-center text-sm font-light">
            <button type="button" className="text-zinc-300" onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')}>{mode === 'signup' ? '¿Ya tienes cuenta? Inicia sesión' : '¿Nueva en Klick? Crea tu cuenta'}</button>
            {mode === 'signin' && <div><button type="button" className="text-zinc-500" onClick={forgot}>Olvidé mi contraseña</button></div>}
          </div>
          <p className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-zinc-400"><ShieldCheck className="h-3.5 w-3.5 text-cyan-400" /> Perfiles verificados y citas seguras</p>
        </form>
      </div>
    </main>
  );
}
