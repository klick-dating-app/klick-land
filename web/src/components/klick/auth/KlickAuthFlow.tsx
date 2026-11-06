'use client';

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export type AuthMode = 'register' | 'login';
export type SocialProvider = 'google' | 'apple' | 'microsoft' | 'facebook' | 'x' | 'github' | 'phone';
import type { DemoGender } from '@/lib/klick/routes';
export type { DemoGender };

interface KlickAuthFlowProps {
  /** `web`: pantalla completa. `app`: marco móvil de 430px con safe-areas. */
  variant: 'web' | 'app';
  /** `null` = pantalla de elección; controlado por el padre para poder sincronizarlo con la URL. */
  mode: AuthMode | null;
  onModeChange: (mode: AuthMode | null) => void;
  onDemoAccess: (gender: DemoGender) => void;
  onSocial: (provider: SocialProvider) => void;
  onEmailSubmit: (email: string, password: string) => void;
  onBackHome?: () => void;
  loading?: boolean;
  initialEmail?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  seed: number;
}

// El conteo se escala por área para que el marco de la app tenga la misma densidad que la web a pantalla completa.
function Particles({ fixed }: { fixed: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = fixed ? null : canvas?.parentElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const size = () => ({
      w: host ? host.clientWidth : window.innerWidth,
      h: host ? host.clientHeight : window.innerHeight,
    });
    const resize = () => {
      const { w, h } = size();
      canvas.width = w;
      canvas.height = h;
    };
    resize();

    const { w, h } = size();
    const count = Math.min(450, Math.round((w * h) / 4600));
    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      size: Math.random() * 1.5 + 0.5,
      seed: Math.random(),
    }));

    let frame = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const t = Date.now() * 0.001;
      for (const p of particles) {
        p.x += p.vx + Math.sin(t + p.seed * 10) * 0.2;
        p.y += p.vy + Math.cos(t + p.seed * 10) * 0.2;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.fillStyle = `rgba(168, 85, 247, ${0.1 + p.seed * 0.3})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      frame = requestAnimationFrame(animate);
    };
    animate();

    const observer = new ResizeObserver(resize);
    observer.observe(host ?? document.documentElement);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [fixed]);

  return (
    <canvas
      ref={canvasRef}
      className={cn('inset-0 z-[10] pointer-events-none', fixed ? 'fixed' : 'absolute')}
    />
  );
}

function RevealWords({
  text,
  delay = 0,
  step = 0.1,
  className,
}: {
  text: string;
  delay?: number;
  step?: number;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-wrap justify-center gap-x-[0.25em] gap-y-1', className)}>
      {text.split(' ').map((word, i) => (
        <motion.span
          key={`${text}-${i}`}
          initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ delay: delay + i * step, duration: 0.8, ease: 'easeOut' }}
          className="inline-block"
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}

const SLOGAN = 'Make klick with someone real';

export function KlickSlogan({ startDelay = 0, className }: { startDelay?: number; className?: string }) {
  const [cycle, setCycle] = useState(0);
  const chars = SLOGAN.split('');
  const offset = cycle === 0 ? startDelay : 0;

  useEffect(() => {
    const timer = setTimeout(
      () => setCycle((c) => c + 1),
      offset * 1000 + chars.length * 65 + 1600,
    );
    return () => clearTimeout(timer);
  }, [cycle, chars.length, offset]);

  return (
    <p
      key={cycle}
      className={cn('min-h-[1.75rem] flex items-center justify-center font-medium tracking-tight', className)}
    >
      {chars.map((char, i) => (
        <motion.span
          key={`${cycle}-${i}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: [0, 1, 1], y: [10, -4, 0] }}
          transition={{ duration: 0.45, delay: offset + i * 0.065, ease: 'easeOut' }}
          className="inline-block bg-clip-text text-transparent"
          style={{
            backgroundImage:
              'linear-gradient(90deg, #008aff 0%, #7c3aed 24%, #ff007f 48%, #ff1744 72%, #ff8c00 100%)',
            backgroundSize: `${chars.length * 100}% 100%`,
            backgroundPosition: `${(i / (chars.length - 1)) * 100}% 0%`,
          }}
        >
          {char === ' ' ? ' ' : char}
        </motion.span>
      ))}
    </p>
  );
}

const GoogleIcon = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden>
    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z" />
    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24Z" />
    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15Z" />
    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z" />
  </svg>
);

const AppleIcon = () => (
  <svg className="w-5 h-5 fill-current mb-0.5 shrink-0" viewBox="0 0 24 24" aria-hidden>
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8.92-2.85-.9.04-1.99.6-2.61 1.34-.55.63-1.03 1.67-.9 2.69 1 .08 2.02-.43 2.59-1.18Z" />
  </svg>
);

function VerifiedBadge({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center gap-1.5 text-[11px] sm:text-xs text-zinc-400 font-medium', className)}>
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden>
        <polygon
          points="12,1 14.12,4.08 17.5,2.47 17.8,6.2 21.53,6.5 19.92,9.88 23,12 19.92,14.12 21.53,17.5 17.8,17.8 17.5,21.53 14.12,19.92 12,23 9.88,19.92 6.5,21.53 6.2,17.8 2.47,17.5 4.08,14.12 1,12 4.08,9.88 2.47,6.5 6.2,6.2 6.5,2.47 9.88,4.08"
          fill="#3B82F6"
          stroke="#3B82F6"
          strokeWidth="0.6"
          strokeLinejoin="round"
        />
        <path d="m8.8 12.2 2.1 2.1 4.3-4.3" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>Verified LDS Community · 18+ Only</span>
    </div>
  );
}

const SECONDARY_PROVIDERS: { id: SocialProvider; label: string; icon: ReactNode }[] = [
  {
    id: 'microsoft',
    label: 'Microsoft',
    icon: (
      <svg viewBox="0 0 448 512" width="16" height="16" aria-hidden>
        <path fill="currentColor" d="M0 93.7l183.6-25.3v177.4H0V93.7zm0 324.6l183.6 25.3V268.4H0v149.9zm203.8 28L448 480V268.4H203.8v177.9zm0-380.6v180.1H448V32L203.8 65.7z" />
      </svg>
    ),
  },
  {
    id: 'facebook',
    label: 'Facebook',
    icon: (
      <svg viewBox="0 0 320 512" width="16" height="16" aria-hidden>
        <path fill="currentColor" d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
      </svg>
    ),
  },
  {
    id: 'x',
    label: 'X (Twitter)',
    icon: (
      <svg viewBox="0 0 512 512" width="14" height="14" aria-hidden>
        <path fill="currentColor" d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
      </svg>
    ),
  },
  {
    id: 'github',
    label: 'GitHub',
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
        <path fill="currentColor" d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.4-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
      </svg>
    ),
  },
  { id: 'phone', label: 'Phone', icon: <Phone className="w-4 h-4" aria-hidden /> },
];

const COPY: Record<AuthMode, [string, string]> = {
  register: ['Your journey starts today with Klick', "Let's create your account to get started"],
  login: ['Welcome Back!', 'Sign in to your account to continue'],
};

export default function KlickAuthFlow({
  variant,
  mode,
  onModeChange,
  onDemoAccess,
  onSocial,
  onEmailSubmit,
  onBackHome,
  loading = false,
  initialEmail,
}: KlickAuthFlowProps) {
  const isApp = variant === 'app';
  const [email, setEmail] = useState(initialEmail ?? '');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (initialEmail) setEmail(initialEmail);
  }, [initialEmail]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    onEmailSubmit(email, password);
  };

  // En el marco de la app no usamos breakpoints md: porque en escritorio inflarían el texto dentro del marco.
  const pill = cn(
    'w-full h-14 rounded-full bg-white/5 border border-white/40 text-white hover:bg-white/10 hover:border-white/80 font-light text-xs tracking-widest transition-all duration-300 shadow-lg active:scale-[0.98]',
    !isApp && 'md:text-sm hover:scale-105',
  );
  const capsule =
    'w-full h-12 rounded-full text-white font-bold text-xs sm:text-[13px] flex items-center justify-center transition-all duration-200 hover:opacity-95 active:scale-[0.98]';
  const linkBtn =
    'text-[9px] text-white/40 hover:text-white/80 transition-colors tracking-[0.3em] font-semibold uppercase';

  const choice = (
    <motion.div
      key="choice"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn('w-full flex flex-col items-center', isApp ? 'min-h-full justify-between py-10' : 'gap-10')}
    >
      <div className={cn('flex flex-col items-center text-center gap-3', isApp ? 'flex-1 justify-center' : 'max-w-4xl')}>
        <RevealWords
          text="Welcome to Klick"
          delay={0.2}
          className={cn('font-light tracking-tight text-white leading-[1.15]', isApp ? 'text-3xl' : 'text-3xl md:text-5xl')}
        />
        <KlickSlogan startDelay={0.6} className={isApp ? 'text-lg' : 'text-lg md:text-2xl'} />
      </div>

      <div className="w-full max-w-sm flex flex-col items-center gap-4">
        <div className="w-full grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => onDemoAccess('male')}
            className={cn(capsule, 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/25')}
          >
            Perfil de Hombre
          </button>
          <button
            type="button"
            onClick={() => onDemoAccess('female')}
            className={cn(capsule, 'bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg shadow-pink-500/25')}
          >
            Perfil de Mujer
          </button>
        </div>
        <RevealWords
          text="Choose how you want to sign in"
          delay={1.2}
          className={cn('text-gray-400 font-light tracking-wide uppercase text-xs', !isApp && 'md:text-sm')}
        />
        <button type="button" onClick={() => onModeChange('register')} className={pill}>
          GET STARTED WITH KLICK
        </button>
        <button type="button" onClick={() => onModeChange('login')} className={pill}>
          I ALREADY HAVE A KLICK ACCOUNT
        </button>
        <VerifiedBadge className="pt-2" />
        {onBackHome && (
          <button type="button" onClick={onBackHome} className={cn(linkBtn, 'pt-2')}>
            Back to home page
          </button>
        )}
      </div>
    </motion.div>
  );

  const form = mode && (
    <motion.div
      key={`form-${mode}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn('w-full max-w-sm mx-auto flex flex-col gap-4', isApp ? 'min-h-full justify-between py-10' : 'py-8')}
    >
      <div className={cn('text-center flex flex-col gap-3 mb-4', isApp && 'flex-1 justify-center')}>
        {COPY[mode].map((line, i) => (
          <RevealWords
            key={`${mode}-${i}`}
            text={line}
            delay={0.3 + i * 1.0}
            step={0.15}
            className={cn(
              'font-light tracking-wide',
              i === 0
                ? cn('text-white/90 text-2xl', !isApp && 'md:text-3xl')
                : cn('text-white/60 text-base', !isApp && 'md:text-xl'),
            )}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="flex flex-col gap-3"
      >
        <form onSubmit={submit} className="flex flex-col gap-3">
          <Input
            type="email"
            autoComplete="email"
            placeholder="Email address"
            className="bg-white/5 border-white/10 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-white/40 rounded-full h-12 text-white placeholder:text-white/30 text-xs tracking-widest px-6 text-center"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
            placeholder="Password"
            className="bg-white/5 border-white/10 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-white/40 rounded-full h-12 text-white placeholder:text-white/30 text-xs tracking-widest px-6 text-center"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-full bg-transparent border border-white/40 text-white hover:bg-white/10 hover:border-white/80 font-light text-sm tracking-wider transition-all duration-300 shadow-lg disabled:opacity-50 mt-1"
          >
            {loading ? 'Syncing...' : mode === 'register' ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="relative flex items-center py-3">
          <div className="flex-grow border-t border-white/10" />
          <span className="flex-shrink-0 mx-4 text-white/30 text-[10px] tracking-widest uppercase font-semibold">
            Or continue with
          </span>
          <div className="flex-grow border-t border-white/10" />
        </div>

        <button
          type="button"
          disabled={loading}
          onClick={() => onSocial('google')}
          className="w-full h-12 bg-white hover:bg-zinc-100 active:scale-[0.98] text-black font-semibold text-[14px] rounded-full flex items-center justify-center gap-3 shadow-lg shadow-white/5 transition-all duration-200 disabled:opacity-50"
        >
          <GoogleIcon />
          <span>Continue with Google</span>
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => onSocial('apple')}
          className="w-full h-12 bg-[#181920] hover:bg-[#20222c] active:scale-[0.98] border border-white/10 text-white font-semibold text-[14px] rounded-full flex items-center justify-center gap-3 shadow-lg transition-all duration-200 disabled:opacity-50"
        >
          <AppleIcon />
          <span>Continue with Apple ID</span>
        </button>

        <div className="flex items-center justify-center gap-2.5 pt-1">
          {SECONDARY_PROVIDERS.map((p) => (
            <button
              key={p.id}
              type="button"
              disabled={loading}
              onClick={() => onSocial(p.id)}
              aria-label={`Continue with ${p.label}`}
              title={p.label}
              className="h-11 w-11 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/30 active:scale-95 transition-all flex items-center justify-center disabled:opacity-50"
            >
              {p.icon}
            </button>
          ))}
        </div>

        <VerifiedBadge className="pt-3" />

        <button type="button" onClick={() => onModeChange(null)} className={cn(linkBtn, 'pt-2')}>
          Back
        </button>
      </motion.div>
    </motion.div>
  );

  const content = <AnimatePresence mode="wait">{mode ? form : choice}</AnimatePresence>;

  if (isApp) {
    return (
      <div className="min-h-screen w-full bg-black flex items-center justify-center overflow-hidden select-none">
        <div className="relative w-full max-w-[430px] h-[100dvh] bg-black text-white overflow-hidden shadow-2xl md:border md:border-zinc-800/80 md:rounded-[40px]">
          <Particles fixed={false} />
          <div className="relative z-[20] h-full overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-7 pt-safe pb-safe">{content}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative flex flex-col items-center justify-center overflow-hidden selection:bg-white/10">
      <Particles fixed />
      <div className="relative z-[20] w-full flex flex-col items-center justify-center px-6 pb-24 xl:pb-0 min-h-screen">
        {content}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[9px] tracking-[0.6em] uppercase text-white/40 whitespace-nowrap"
      >
        Klick Platform
      </motion.div>
    </div>
  );
}
