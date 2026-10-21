'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { isFirebaseConfigured } from '@/lib/firebase';
import KlickLogo from '@/components/ui/KlickLogo';
import { Button } from '@/components/ui/button';
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
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center gap-7 p-6 pt-safe pb-safe">
      <div className="flex flex-col items-center gap-2 text-center">
        <KlickLogo size={72} priority />
        <h1 className="text-3xl font-extrabold tracking-tight">{mode === 'signup' ? 'Crea tu cuenta' : 'Bienvenido de vuelta'}</h1>
        <p className="text-sm text-muted-foreground">Citas seguras con compatibilidad real.</p>
      </div>

      {!isFirebaseConfigured && <p className="rounded-xl bg-amber-500/15 p-3 text-xs text-amber-300">Firebase no está configurado todavía (.env.local).</p>}

      <form onSubmit={submit} className="surface space-y-4 p-5">
        <Field label="Correo"><input type="email" required autoComplete="email" className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
        <Field label="Contraseña"><input type="password" required minLength={8} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} className={inputCls} value={password} onChange={(e) => setPassword(e.target.value)} /></Field>
        {mode === 'signup' && (
          <label className="flex items-start gap-2 text-xs text-muted-foreground">
            <input type="checkbox" className="mt-0.5" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} />
            <span>Tengo 18 años o más y acepto los <Link href="/terms/" className="text-primary underline">Términos</Link> y la <Link href="/privacy/" className="text-primary underline">Política de privacidad</Link>.</span>
          </label>
        )}
        <Button size="lg" className="w-full" disabled={busy || !isFirebaseConfigured}>{busy ? 'Un momento…' : mode === 'signup' ? 'Crear cuenta' : 'Entrar'}</Button>
      </form>

      <div className="space-y-2 text-center text-sm">
        <button className="text-primary" onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')}>
          {mode === 'signup' ? '¿Ya tienes cuenta? Inicia sesión' : '¿Nueva en Klick? Crea tu cuenta'}
        </button>
        {mode === 'signin' && <div><button className="text-muted-foreground" onClick={forgot}>Olvidé mi contraseña</button></div>}
      </div>
    </main>
  );
}
