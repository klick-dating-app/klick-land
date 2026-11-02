"use client";

import React from "react";

export interface DateReviewItem {
  id: string;
  author: string;
  partnerName: string;
  venue: string;
  rating: number;
  highlights: string[];
  comment: string;
  date: string;
}

export interface PersonalFeedbackItem {
  id: string;
  topic: string;
  improvement: string;
  date: string;
}

/** Estrella de 12 puntas con visto blanco (sello de verificado), calculada una sola vez. */
const STAR_POINTS_12 = Array.from({ length: 24 }, (_, i) => {
  const r = i % 2 === 0 ? 11.2 : 8.2;
  const a = (Math.PI * i) / 12 - Math.PI / 2;
  return `${(12 + r * Math.cos(a)).toFixed(2)},${(12 + r * Math.sin(a)).toFixed(2)}`;
}).join(" ");

export function VerifiedStar({
  className = "h-4 w-4 shrink-0",
}: {
  className?: string;
}) {
  return (
    <svg
      role="img"
      aria-label="Verificado"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <polygon
        points={STAR_POINTS_12}
        fill="#3b82f6"
        strokeLinejoin="round"
        stroke="#3b82f6"
        strokeWidth="0.6"
      />
      <path
        d="m8.8 12.2 2.1 2.1 4.3-4.3"
        stroke="#FFFFFF"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Porcentaje de compatibilidad multicolor junto al nombre, sin cápsula. */
export function ScoreBadge({
  score,
  onClick,
}: {
  score: number;
  onClick?: (e: React.MouseEvent) => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-baseline gap-0.5 cursor-pointer active:scale-95 transition-transform shrink-0"
      title="View compatibility breakdown"
    >
      <span className="bg-[linear-gradient(90deg,#008aff_0%,#7c3aed_24%,#ff007f_48%,#ff1744_72%,#ff8c00_100%)] bg-clip-text text-transparent text-lg sm:text-xl font-semibold leading-none tracking-tight">
        {Math.round(score)}%
      </span>
      <span className="klick-keep-white text-[10px] font-bold uppercase text-white/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.75)]">
        K
      </span>
    </button>
  );
}

/** Anillo de compatibilidad con degradado de marca (0–100). */
export function ScoreRing({
  score,
  size = 46,
}: {
  score: number;
  size?: number;
}) {
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.12}
          strokeWidth={4.5}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#klickScoreRingGrad)"
          strokeWidth={4.5}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - score / 100)}
        />
        <defs>
          <linearGradient id="klickScoreRingGrad">
            <stop offset="0" stopColor="#008aff" />
            <stop offset="0.5" stopColor="#7c3aed" />
            <stop offset="1" stopColor="#ff007f" />
          </linearGradient>
        </defs>
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[12px] font-bold text-white">
        {Math.round(score)}
      </span>
    </div>
  );
}

/** Estilos globales de adaptación para el Modo Claro (White Mode). */
export function MobileAppLightThemeStyles() {
  return (
    <style>{`
      .klick-light-theme .bg-\\[\\#070709\\],
      .klick-light-theme .bg-\\[\\#07070b\\],
      .klick-light-theme .bg-\\[\\#07080d\\]\\/95,
      .klick-light-theme .bg-\\[\\#070709\\]\\/95,
      .klick-light-theme .bg-\\[\\#07070b\\]\\/98,
      .klick-light-theme .bg-black\\/95,
      .klick-light-theme .bg-black\\/90,
      .klick-light-theme .bg-zinc-950 {
        background-color: #ffffff !important;
        color: #0f172a !important;
      }
      .klick-light-theme .bg-\\[\\#070709\\]\\/80,
      .klick-light-theme .bg-black\\/80 {
        background-color: rgba(255, 255, 255, 0.88) !important;
      }
      .klick-light-theme .bg-\\[\\#0d0e14\\],
      .klick-light-theme .bg-\\[\\#0e0f15\\],
      .klick-light-theme .bg-\\[\\#10121a\\],
      .klick-light-theme .bg-\\[\\#101018\\]\\/90,
      .klick-light-theme .bg-\\[\\#11121c\\],
      .klick-light-theme .bg-\\[\\#12131a\\],
      .klick-light-theme .bg-\\[\\#14151f\\],
      .klick-light-theme .bg-zinc-900,
      .klick-light-theme .bg-white\\/5,
      .klick-light-theme .bg-white\\/\\[0\\.03\\],
      .klick-light-theme .bg-white\\/\\[0\\.04\\],
      .klick-light-theme .bg-white\\/\\[0\\.06\\],
      .klick-light-theme .bg-white\\/10 {
        background-color: #f3f5fa !important;
        border-color: rgba(15, 23, 42, 0.1) !important;
      }
      .klick-light-theme .bg-\\[\\#08080c\\]\\/95 {
        background-color: rgba(255, 255, 255, 0.96) !important;
        border-color: rgba(15, 23, 42, 0.1) !important;
      }
      .klick-light-theme .text-white:not(.klick-keep-white),
      .klick-light-theme .text-white\\/90:not(.klick-keep-white),
      .klick-light-theme .text-white\\/85:not(.klick-keep-white),
      .klick-light-theme .text-white\\/80:not(.klick-keep-white),
      .klick-light-theme .text-white\\/75:not(.klick-keep-white),
      .klick-light-theme .text-white\\/70:not(.klick-keep-white),
      .klick-light-theme .text-white\\/60:not(.klick-keep-white) {
        color: #0f172a !important;
      }
      .klick-light-theme .text-zinc-100,
      .klick-light-theme .text-zinc-200,
      .klick-light-theme .text-zinc-300 {
        color: #334155 !important;
      }
      .klick-light-theme .text-zinc-400,
      .klick-light-theme .text-zinc-500 {
        color: #64748b !important;
      }
      .klick-light-theme .text-blue-300,
      .klick-light-theme .text-blue-400 {
        color: #2563eb !important;
      }
      .klick-light-theme .border-white\\/5,
      .klick-light-theme .border-white\\/10,
      .klick-light-theme .border-white\\/15,
      .klick-light-theme .border-white\\/20 {
        border-color: rgba(15, 23, 42, 0.1) !important;
      }
      .klick-light-theme .divide-white\\/10 > :not([hidden]) ~ :not([hidden]) {
        border-color: rgba(15, 23, 42, 0.1) !important;
      }
      .klick-light-theme .ring-offset-\\[\\#070709\\] {
        --tw-ring-offset-color: #ffffff !important;
      }
      .klick-light-theme .shadow-\\[0_20px_40px_-20px_rgba\\(0\\,0\\,0\\,0\\.6\\)\\],
      .klick-light-theme .shadow-\\[0_25px_50px_-25px_rgba\\(0\\,0\\,0\\,0\\.6\\)\\] {
        box-shadow: 0 12px 28px -12px rgba(15, 23, 42, 0.12) !important;
      }
    `}</style>
  );
}

