'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="eyebrow !text-foreground/60">{label}</label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export const inputCls =
  'w-full rounded-2xl border border-foreground/10 bg-foreground/[0.04] px-4 py-3.5 text-base font-light outline-none transition placeholder:text-muted-foreground focus:border-foreground/40 focus:bg-foreground/[0.06]';

/** Selección única o múltiple con "chips" táctiles. */
export function Chips({
  options,
  value,
  onChange,
  multiple = false,
}: {
  options: readonly string[];
  value: string | string[];
  onChange: (v: any) => void;
  multiple?: boolean;
}) {
  const selected = (o: string) => (Array.isArray(value) ? value.includes(o) : value === o);
  const toggle = (o: string) => {
    if (!multiple) return onChange(o);
    const arr = value as string[];
    onChange(arr.includes(o) ? arr.filter((x) => x !== o) : [...arr, o]);
  };
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => toggle(o)}
          className={cn(
            'rounded-full border px-4 py-2 text-sm font-medium transition active:scale-95',
            selected(o) ? 'border-blue-500/50 bg-blue-500/15 text-blue-700 dark:text-blue-300' : 'border-foreground/10 bg-foreground/5 text-foreground/75 hover:border-foreground/25',
          )}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

export function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 rounded-2xl border border-foreground/10 bg-foreground/[0.04] px-4 py-3.5 text-left text-sm font-light"
    >
      <span>{label}</span>
      <span className={cn('h-7 w-12 shrink-0 rounded-full p-0.5 transition-colors', checked ? 'bg-brand' : 'bg-muted')}>
        <span className={cn('block h-6 w-6 rounded-full bg-white shadow transition-transform', checked && 'translate-x-5')} />
      </span>
    </button>
  );
}

/** Marca de perfil verificado: estrella junto al nombre y la edad. */
export function VerifiedStar({ className }: { className?: string }) {
  return <Star aria-label="Verificado" className={cn('h-[17px] w-[17px] shrink-0 fill-blue-500 text-blue-500', className)} />;
}

export function Spinner({ className }: { className?: string }) {
  return <div className={cn('h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent', className)} />;
}

export function ScoreBadge({ score }: { score: number }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-black/50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
      <span className="text-brand text-sm font-bold normal-case tracking-normal">{Math.round(score)}%</span>
      <span className="text-white/70">Klick</span>
    </span>
  );
}

/** Anillo de compatibilidad (0–100). */
export function ScoreRing({ score, size = 56 }: { score: number; size?: number }) {
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeOpacity={0.12} strokeWidth={5} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="url(#kg)" strokeWidth={5} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - score / 100)} />
        <defs><linearGradient id="kg"><stop offset="0" stopColor="#008aff" /><stop offset="0.5" stopColor="#7c3aed" /><stop offset="1" stopColor="#ff007f" /></linearGradient></defs>
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[13px] font-extrabold">{Math.round(score)}</span>
    </div>
  );
}
