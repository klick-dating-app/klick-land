import { cn } from '@/lib/utils';

/** Corazón rojo (Dating): forma redondeada con degradado y brillo. */
export function RedHeartIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn('h-10 w-10', className)} role="img" aria-label="Dating">
      <defs>
        <linearGradient id="dating-heart" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor="#ff6b81" />
          <stop offset="0.55" stopColor="#f0143c" />
          <stop offset="1" stopColor="#b8002a" />
        </linearGradient>
      </defs>
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill="url(#dating-heart)"
      />
      <path d="M6.2 6.1c-1.3.7-2 2-1.8 3.4" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth={1.3} strokeLinecap="round" />
    </svg>
  );
}
