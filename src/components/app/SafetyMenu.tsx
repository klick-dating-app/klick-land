'use client';

import { useState } from 'react';
import { Flag, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { REPORT_CATEGORIES } from '@/lib/klick/options';
import { Button } from '@/components/ui/button';
import { inputCls } from '@/components/app/form';

/** Reportar / bloquear: siempre accesible desde perfiles y chats. */
export default function SafetyMenu({ targetId, matchId, onDone }: { targetId: string; matchId?: string; onDone?: () => void }) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState('');
  const [details, setDetails] = useState('');
  const [busy, setBusy] = useState(false);

  const run = async (fn: () => Promise<unknown>, ok: string) => {
    setBusy(true);
    try {
      await fn();
      toast.success(ok);
      setOpen(false);
      onDone?.();
    } catch (e: any) {
      toast.error(e?.message ?? 'No se pudo completar la acción');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button onClick={() => setOpen(true)} aria-label="Reportar o bloquear" className="rounded-full bg-black/40 p-2 text-white">
        <ShieldAlert className="h-5 w-5" />
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/60" onClick={() => setOpen(false)}>
          <div className="mx-auto w-full max-w-lg space-y-4 rounded-t-3xl bg-background p-5 pb-safe" onClick={(e) => e.stopPropagation()}>
            <h2 className="flex items-center gap-2 text-lg font-bold"><Flag className="h-5 w-5 text-primary" /> Seguridad</h2>
            <select className={inputCls} value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">Motivo del reporte…</option>
              {REPORT_CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
            <textarea className={inputCls} rows={3} placeholder="Detalles (opcional)" value={details} maxLength={1000} onChange={(e) => setDetails(e.target.value)} />
            <Button className="w-full" disabled={!category || busy} onClick={() => run(() => api.reportUser({ targetId, category, details, matchId }), 'Reporte enviado y usuario bloqueado')}>
              Reportar y bloquear
            </Button>
            <Button variant="outline" className="w-full" disabled={busy} onClick={() => run(() => api.blockUser({ targetId }), 'Usuario bloqueado')}>
              Solo bloquear
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
