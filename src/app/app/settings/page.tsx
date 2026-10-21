'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { LogOut, Moon, Smartphone, Sun, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { DEMO } from '@/lib/demo';
import { cn } from '@/lib/utils';

const THEMES = [
  { id: 'dark', label: 'Oscuro', Icon: Moon },
  { id: 'light', label: 'Claro', Icon: Sun },
  { id: 'system', label: 'Sistema', Icon: Smartphone },
] as const;

export default function SettingsPage() {
  const { signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [busy, setBusy] = useState(false);
  useEffect(() => setMounted(true), []);

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

  const row = 'flex items-center gap-3 border-b border-foreground/10 py-4 text-left font-light transition active:opacity-70';
  return (
    <div className="space-y-10 px-5 pt-6">
      <header className="space-y-3">
        <Link href="/app/profile/" aria-label="Cerrar" className="-ml-1 inline-flex p-1 text-foreground/70"><X className="h-6 w-6" strokeWidth={1.5} /></Link>
        <div>
          <p className="eyebrow">Ajustes</p>
          <h1 className="text-[26px] font-light tracking-tight">Configuración</h1>
        </div>
      </header>

      <section className="space-y-4">
        <span className="section-label">Apariencia</span>
        <div className="grid grid-cols-3 gap-2.5">
          {THEMES.map(({ id, label, Icon }) => {
            const active = mounted && theme === id;
            return (
              <button key={id} onClick={() => setTheme(id)} className={cn('flex flex-col items-center gap-2 rounded-2xl border py-5 text-xs font-semibold transition active:scale-95', active ? 'border-blue-500/60 bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'border-foreground/10 text-muted-foreground')}>
                <Icon className="h-5 w-5" strokeWidth={1.6} />
                {label}
              </button>
            );
          })}
        </div>
        <p className="text-xs font-light text-muted-foreground">Elige cómo quieres ver Klick. «Sistema» sigue la configuración de tu teléfono.</p>
      </section>

      <section className="space-y-1">
        <span className="section-label mb-2">Legal y ayuda</span>
        <Link href="/privacy/" className={row}>Política de privacidad</Link>
        <Link href="/terms/" className={row}>Términos y condiciones</Link>
        <Link href="/safe-dates/" className={row}>Consejos de seguridad</Link>
        <Link href="/contact/" className={row}>Soporte</Link>
      </section>

      <section className="space-y-2">
        <span className="section-label">Cuenta</span>
        <button className={cn(row, 'w-full')} onClick={() => signOut().then(() => router.replace('/'))}><LogOut className="h-5 w-5" strokeWidth={1.5} /> Cerrar sesión</button>
        <button className={cn(row, 'w-full text-red-500')} disabled={busy || DEMO} onClick={remove}><Trash2 className="h-5 w-5" strokeWidth={1.5} /> Eliminar mi cuenta</button>
      </section>
    </div>
  );
}
