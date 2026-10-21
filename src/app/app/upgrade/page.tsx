'use client';

import { useState } from 'react';
import { Check, Crown } from 'lucide-react';
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
        <h1 className="text-gradient text-3xl font-extrabold">Klick es gratis para ti</h1>
        <p className="text-muted-foreground">Tienes acceso completo a búsqueda, compatibilidad, chats y Safe First Date sin costo.</p>
      </div>
    );
  }

  const current = entitlement?.plan ?? 'free';
  return (
    <div className="space-y-6 px-5 pt-8">
      <header className="space-y-2 text-center">
        <div className="mx-auto w-fit rounded-full bg-amber-400/15 p-3"><Crown className="h-7 w-7 text-amber-400" /></div>
        <h1 className="text-3xl font-extrabold tracking-tight">Elige tu plan</h1>
        <p className="text-sm text-muted-foreground">Gratis: explora y ve tu compatibilidad. Con un plan inicias conversaciones.</p>
      </header>

      {isIOS() ? (
        <p className="surface p-5 text-center text-sm text-muted-foreground">Las suscripciones en iPhone estarán disponibles pronto dentro de la app.</p>
      ) : (
        PLANS.map((p) => {
          const hi = 'highlight' in p && p.highlight;
          return (
            <section key={p.id} className={`relative space-y-4 rounded-3xl p-6 ${hi ? 'bg-gradient-to-br from-rose-500/20 to-orange-500/10 ring-2 ring-primary' : 'surface'}`}>
              {hi && <span className="absolute -top-3 left-6 rounded-full bg-gradient-to-br from-rose-500 to-orange-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">Más popular</span>}
              <div className="flex items-end justify-between">
                <h2 className="text-xl font-extrabold">{p.name}</h2>
                <p><span className="text-3xl font-black">{p.price}</span><span className="text-sm text-muted-foreground"> / {p.period}</span></p>
              </div>
              <ul className="space-y-2 text-sm">{p.perks.map((x) => <li key={x} className="flex gap-2.5"><Check className="h-4 w-4 shrink-0 text-primary" />{x}</li>)}</ul>
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
