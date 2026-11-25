'use client';

import { useEffect, useRef, useState, type ComponentType, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export type AuthMode = 'register' | 'login';
/** Únicas tres formas de registro con proveedor; además está correo + contraseña. */
export type SocialProvider = 'google' | 'apple' | 'microsoft';

interface KlickAuthFlowProps {
  /** `web`: pantalla completa. `app`: marco móvil de 430px con safe-areas. */
  variant: 'web' | 'app';
  /** `null` = pantalla de elección; controlado por el padre para poder sincronizarlo con la URL. */
  mode: AuthMode | null;
  onModeChange: (mode: AuthMode | null) => void;
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
    // En pantallas Retina el canvas a 1x se estira y difumina los puntos, lo que tiñe de morado el fondo negro.
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const { w, h } = size();
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const { w, h } = size();
    const count = Math.min(220, Math.round((w * h) / 9000));
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
      const { w, h } = size();
      ctx.clearRect(0, 0, w, h);
      const t = Date.now() * 0.001;
      for (const p of particles) {
        p.x += p.vx + Math.sin(t + p.seed * 10) * 0.2;
        p.y += p.vy + Math.cos(t + p.seed * 10) * 0.2;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
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

function ConsentNotice({ className }: { className?: string }) {
  return (
    <p className={cn('max-w-sm mx-auto text-center text-[11px] sm:text-xs leading-relaxed text-zinc-500', className)}>
      By continuing, you acknowledge SafeMeet&apos;s{' '}
      <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 text-zinc-400 hover:text-white">
        Privacy Policy
      </a>{' '}
      and agree to get occasional promotional emails and notifications.
    </p>
  );
}

const MicrosoftIcon = () => (
  <svg className="w-[18px] h-[18px] shrink-0" viewBox="0 0 23 23" aria-hidden>
    <path fill="#F25022" d="M1 1h10v10H1z" />
    <path fill="#7FBA00" d="M12 1h10v10H12z" />
    <path fill="#00A4EF" d="M1 12h10v10H1z" />
    <path fill="#FFB900" d="M12 12h10v10H12z" />
  </svg>
);

const PROVIDERS: { id: SocialProvider; label: string; icon: ComponentType }[] = [
  { id: 'google', label: 'Continue with Google', icon: GoogleIcon },
  { id: 'apple', label: 'Continue with Apple', icon: AppleIcon },
  { id: 'microsoft', label: 'Continue with Microsoft', icon: MicrosoftIcon },
];

const COPY: Record<AuthMode, string[]> = {
  register: ['Your journey starts today with Klick'],
  login: ['Welcome Back!', 'Sign in to your account to continue'],
};

export default function KlickAuthFlow({
  variant,
  mode,
  onModeChange,
  onSocial,
  onEmailSubmit,
  onBackHome,
  loading = false,
  initialEmail,
}: KlickAuthFlowProps) {
  const isApp = variant === 'app';
  const [email, setEmail] = useState(initialEmail ?? '');
  const [password, setPassword] = useState('');
  // Paso 1: solo el correo. Paso 2: aparece la contraseña para crear la cuenta o entrar.
  const [emailStep, setEmailStep] = useState<'email' | 'password'>('email');
  // En vez del globo nativo del navegador ("Please fill out this field"), el campo inválido se pinta de rojo.
  const [invalid, setInvalid] = useState<'email' | 'password' | null>(null);

  useEffect(() => {
    if (initialEmail) setEmail(initialEmail);
  }, [initialEmail]);

  useEffect(() => {
    setEmailStep('email');
    setPassword('');
    setInvalid(null);
  }, [mode]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setInvalid('email');
    if (emailStep === 'email') return setEmailStep('password');
    if (password.length < (mode === 'register' ? 6 : 1)) return setInvalid('password');
    onEmailSubmit(email.trim(), password);
  };

  // En el marco de la app no usamos breakpoints md: porque en escritorio inflarían el texto dentro del marco.
  const pill = cn(
    'w-full h-14 rounded-full bg-black border border-white/40 text-white hover:bg-white hover:text-black hover:border-white font-normal text-sm transition-all duration-300 shadow-lg active:scale-[0.98]',
    !isApp && 'md:text-base hover:scale-105',
  );
  const linkBtn = 'text-xs text-white/50 hover:text-white/80 transition-colors font-medium';
  const outline =
    'w-full h-12 rounded-full bg-black border border-white/40 text-white hover:bg-white hover:text-black hover:border-white disabled:opacity-50 disabled:hover:bg-black disabled:hover:text-white font-normal text-sm flex items-center justify-center transition-all duration-300 shadow-lg active:scale-[0.98]';
  const invalidField = 'border-red-500 focus-visible:border-red-500 placeholder:text-red-400/70';
  const field =
    'bg-black border-white/10 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-white/40 rounded-full h-12 text-white placeholder:text-white/40 text-sm px-6 text-center read-only:text-white/60';

  const choice = (
    <motion.div
      key="choice"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn('w-full flex flex-col items-center', isApp ? 'min-h-full justify-between py-10' : 'gap-14')}
    >
      <div className={cn('flex flex-col items-center text-center gap-3', isApp ? 'flex-1 justify-center' : 'max-w-4xl')}>
        <RevealWords
          text="Welcome to Klick"
          delay={0.2}
          className={cn('font-light tracking-tight text-white leading-[1.15]', isApp ? 'text-3xl' : 'text-3xl md:text-5xl')}
        />
        <KlickSlogan startDelay={0.6} className={isApp ? 'text-lg' : 'text-lg md:text-2xl'} />
      </div>

      <div className={cn('w-full max-w-md flex flex-col items-center gap-4', isApp && 'pt-8')}>
        <button type="button" onClick={() => onModeChange('register')} className={pill}>
          Get started with Klick
        </button>
        <button type="button" onClick={() => onModeChange('login')} className={pill}>
          I already have a Klick account
        </button>
        <ConsentNotice className="pt-2" />
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
        {PROVIDERS.map(({ id, label, icon: Icon }) => (
          <button key={id} type="button" disabled={loading} onClick={() => onSocial(id)} className={cn(outline, 'gap-3')}>
            <Icon />
            <span>{label}</span>
          </button>
        ))}

        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-white/10" />
          <span className="flex-shrink-0 mx-4 text-white/40 text-xs font-medium">OR</span>
          <div className="flex-grow border-t border-white/10" />
        </div>

        <form onSubmit={submit} noValidate className="flex flex-col gap-3">
          <Input
            type="email"
            autoComplete="email"
            placeholder="Enter your email"
            className={cn(field, invalid === 'email' && invalidField)}
            aria-invalid={invalid === 'email'}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setInvalid(null);
            }}
            readOnly={emailStep === 'password'}
          />
          {emailStep === 'password' && (
            <Input
              type="password"
              autoFocus
              autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
              placeholder={mode === 'register' ? 'Create a password (6+ characters)' : 'Password'}
              className={cn(field, invalid === 'password' && invalidField)}
              aria-invalid={invalid === 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setInvalid(null);
              }}
            />
          )}
          <button type="submit" disabled={loading} className={outline}>
            {loading
              ? 'Syncing...'
              : emailStep === 'email'
                ? 'Continue with email'
                : mode === 'register'
                  ? 'Create account'
                  : 'Sign in'}
          </button>
          {emailStep === 'password' && (
            <button type="button" onClick={() => setEmailStep('email')} className={linkBtn}>
              Use a different email
            </button>
          )}
        </form>

        <ConsentNotice className="pt-3" />

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
