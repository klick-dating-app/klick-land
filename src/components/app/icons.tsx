import { cn } from '@/lib/utils';

/** Flor de 5 pétalos en (cx, cy). */
function Bloom({ cx, cy, r, petal, core = '#fbbf24' }: { cx: number; cy: number; r: number; petal: string; core?: string }) {
  return (
    <g>
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
        return <circle key={i} cx={cx + Math.cos(a) * r * 0.95} cy={cy + Math.sin(a) * r * 0.95} r={r * 0.72} fill={petal} stroke="rgba(0,0,0,0.12)" strokeWidth={0.4} />;
      })}
      <circle cx={cx} cy={cy} r={r * 0.5} fill={core} />
    </g>
  );
}

/** Ramo de flores (amistad). */
export function BouquetIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 52" className={cn('h-11 w-11', className)} role="img" aria-label="Ramo de flores">
      <g stroke="#16a34a" strokeWidth={1.6} strokeLinecap="round" fill="none">
        <path d="M24 36 L24 19" />
        <path d="M24 36 L14 22" />
        <path d="M24 36 L34 22" />
      </g>
      <ellipse cx="17.5" cy="32" rx="4.6" ry="2" transform="rotate(-35 17.5 32)" fill="#22c55e" />
      <ellipse cx="30.5" cy="32" rx="4.6" ry="2" transform="rotate(35 30.5 32)" fill="#22c55e" />
      <Bloom cx={14} cy={20} r={4.2} petal="#fafafa" />
      <Bloom cx={34} cy={20} r={4.2} petal="#c4b5fd" />
      <Bloom cx={24} cy={14} r={5.2} petal="#ff4fa3" />
      <path d="M12 30 L36 30 L27 49 L21 49 Z" fill="#f1e2cc" stroke="rgba(0,0,0,0.18)" strokeWidth={0.6} strokeLinejoin="round" />
      <path d="M12 30 L24 36 L36 30" fill="none" stroke="rgba(0,0,0,0.16)" strokeWidth={0.6} />
      <path d="M21.5 34 L26.5 34 L25.5 38 L22.5 38 Z" fill="#ef233c" />
      <path d="M21.5 34 L19 37 M26.5 34 L29 37" stroke="#ef233c" strokeWidth={1.4} strokeLinecap="round" />
    </svg>
  );
}

/** Corazón rojo (cita). */
export function RedHeartIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 44" className={cn('h-10 w-10', className)} role="img" aria-label="Corazón rojo">
      <defs>
        <linearGradient id="rh" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff4d5e" />
          <stop offset="1" stopColor="#d90429" />
        </linearGradient>
      </defs>
      <path d="M24 41 C8 29 2 21 2 13.5 C2 7.5 6.8 3 12.6 3 C17 3 21.2 5.6 24 9.8 C26.8 5.6 31 3 35.4 3 C41.2 3 46 7.5 46 13.5 C46 21 40 29 24 41 Z" fill="url(#rh)" />
      <path d="M11 9 C8 10 6.6 13 7.4 16" stroke="rgba(255,255,255,0.55)" strokeWidth={2.2} strokeLinecap="round" fill="none" />
    </svg>
  );
}
