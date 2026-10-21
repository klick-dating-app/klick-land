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
      <div className="space-y-3 p-6 text-center">
        <h1 className="text-2xl font-bold">Klick es gratis para ti</h1>
        <p className="text-muted-foreground">Tienes acceso completo a búsqueda, compatibilidad, chats y Safe First Date sin costo.</p>
      </div>
    );
  }

  const current = entitlement?.plan ?? 'free';
  return (
    <div className="space-y-5 p-4">
      <header className="space-y-1 text-center">
        <h1 className="text-2xl font-bold">Elige tu plan</h1>
        <p className="text-sm text-muted-foreground">Gratis: explora perfiles y ve tu puntaje de compatibilidad. Con un plan inicias conversaciones.</p>
      </header>

      {isIOS() ? (
        <p className="rounded-2xl border bg-card p-5 text-center text-sm text-muted-foreground">
          Las suscripciones en iPhone estarán disponibles pronto dentro de la app.
        </p>
      ) : (
        PLANS.map((p) => (
          <section key={p.id} className={`space-y-3 rounded-2xl border p-5 ${'highlight' in p && p.highlight ? 'border-primary bg-primary/5' : 'bg-card'}`}>
            <div className="flex items-baseline justify-between">
              <h2 className="text-lg font-bold">{p.name}</h2>
              <p><span className="text-2xl font-extrabold">{p.price}</span><span className="text-sm text-muted-foreground"> / {p.period}</span></p>
            </div>
            <ul className="space-y-1.5 text-sm">{p.perks.map((x) => <li key={x} className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-primary" />{x}</li>)}</ul>
            <Button className="w-full" disabled={busy !== null || current === p.id} onClick={() => go(() => api.createCheckoutSession({ plan: p.id as Plan }), p.id)}>
              {current === p.id ? 'Plan actual' : busy === p.id ? 'Abriendo…' : `Elegir ${p.name}`}
            </Button>
          </section>
        ))
      )}

      {current !== 'free' && !isIOS() && (
        <Button variant="outline" className="w-full" disabled={busy !== null} onClick={() => go(() => api.createPortalSession({}), 'portal')}>
          Administrar suscripción
        </Button>
      )}
    </div>
  );
}
