'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { isIOS } from '@/lib/platform';
import { openExternal } from '@/lib/platform/links';
import { PLANS } from '@/lib/klick/options';
import { Button } from '@/components/ui/button';
import type { Plan } from '@/lib/types';

export default function UpgradePage() {
  const { profile, entitlement } = useAuth();
  const [busy, setBusy] = useState<string | null>(null);

  const go = async (fn: () => Promise<{ url: string }>, key: string) => {
    setBusy(key);
    try {
      await openExternal((await fn()).url);
    } catch (e: any) {
      toast.error(e?.message ?? 'No se pudo abrir el pago');
    } finally {
      setBusy(null);
    }
  };

  if (profile?.gender === 'female') {
    return (
      <div className="space-y-3 px-6 pt-20 text-center">
        <h1 className="text-4xl font-light tracking-tighter">Klick es gratis para ti</h1>
        <p className="text-sm font-light text-zinc-400">Tienes acceso completo a búsqueda, compatibilidad, chats y Safe First Date sin costo.</p>
      </div>
    );
  }

  const current = entitlement?.plan ?? 'free';
  return (
    <div className="space-y-8 px-5 pt-10">
      <header className="space-y-2 text-center">
        <p className="eyebrow">Membresías</p>
        <h1 className="text-4xl font-light tracking-tighter">Elige tu plan</h1>
        <p className="mx-auto max-w-xs text-sm font-light leading-relaxed text-zinc-400">Gratis: explora y ve tu compatibilidad. Con un plan inicias conversaciones.</p>
      </header>

      {isIOS() ? (
        <p className="surface p-6 text-center text-sm font-light text-zinc-400">Las suscripciones en iPhone estarán disponibles pronto dentro de la app.</p>
      ) : (
        PLANS.map((p) => {
          const hi = 'highlight' in p && p.highlight;
          return (
            <section key={p.id} className={`surface relative space-y-5 p-7 ${hi ? '!border-white/30' : ''}`}>
              {hi && <span className="bg-brand absolute -top-3 left-7 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">Más elegido</span>}
              <div className="flex items-end justify-between">
                <h2 className="text-2xl font-light tracking-tight">{p.name}</h2>
                <p><span className="text-3xl font-medium tracking-tighter">{p.price}</span><span className="text-sm font-light text-zinc-500"> / {p.period}</span></p>
              </div>
              <ul className="space-y-3 text-sm font-light text-zinc-300">{p.perks.map((x) => <li key={x} className="flex gap-3"><Check className="h-4 w-4 shrink-0 text-white" strokeWidth={1.5} />{x}</li>)}</ul>
              <Button className="w-full" variant={hi ? 'default' : 'outline'} disabled={busy !== null || current === p.id} onClick={() => go(() => api.createCheckoutSession({ plan: p.id as Plan }), p.id)}>
                {current === p.id ? 'Plan actual' : busy === p.id ? 'Abriendo…' : `Elegir ${p.name}`}
              </Button>
            </section>
          );
        })
      )}

      {current !== 'free' && !isIOS() && (
        <Button variant="outline" className="w-full" disabled={busy !== null} onClick={() => go(() => api.createPortalSession({}), 'portal')}>Administrar suscripción</Button>
      )}
    </div>
  );
}
