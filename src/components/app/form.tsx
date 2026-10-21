'use client';

import { cn } from '@/lib/utils';

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">{label}</label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export const inputCls =
  'w-full rounded-xl border border-input bg-background px-3.5 py-3 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/30';

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
            'rounded-full border px-3.5 py-2 text-sm transition-colors',
            selected(o) ? 'border-primary bg-primary text-primary-foreground' : 'border-input bg-card hover:border-primary/60',
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
      className="flex w-full items-center justify-between rounded-xl border border-input bg-card px-3.5 py-3 text-left text-sm"
    >
      <span>{label}</span>
      <span className={cn('h-6 w-11 rounded-full p-0.5 transition-colors', checked ? 'bg-primary' : 'bg-muted')}>
        <span className={cn('block h-5 w-5 rounded-full bg-white transition-transform', checked && 'translate-x-5')} />
      </span>
    </button>
  );
}

export function Spinner({ className }: { className?: string }) {
  return <div className={cn('h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent', className)} />;
}

export function ScoreBadge({ score }: { score: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-sm font-bold text-primary-foreground shadow-lg">
      {Math.round(score)}% Klick
    </span>
  );
}
