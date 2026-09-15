"use client";

import React, { useState } from "react";
import Image from "next/image";

interface KlickLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  textClassName?: string;
  priority?: boolean;
}

export default function KlickLogo({
  size = 32,
  className = "",
  showText = false,
  textClassName = "",
  priority = false,
}: KlickLogoProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      <div
        className="relative flex items-center justify-center rounded-full shrink-0 overflow-hidden shadow-md"
        style={{ width: size, height: size }}
      >
        {!imgError ? (
          <Image
            src="/klick-logo-circular.png"
            alt="KLICK"
            width={size}
            height={size}
            priority={priority}
            unoptimized
            onError={() => setImgError(true)}
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          /* SVG Vector Fallback that ALWAYS renders flawlessly */
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full rounded-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="klickGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#008aff" />
                <stop offset="25%" stopColor="#7c3aed" />
                <stop offset="50%" stopColor="#ff007f" />
                <stop offset="75%" stopColor="#ff1744" />
                <stop offset="100%" stopColor="#ff8c00" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <circle cx="50" cy="50" r="48" fill="#090a10" stroke="url(#klickGrad)" strokeWidth="3" />
            {/* Signature Klick Symbol */}
            <path
              d="M 34 26 L 34 74 M 34 50 L 64 26 M 46 41 L 68 74"
              stroke="url(#klickGrad)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              filter="url(#glow)"
            />
          </svg>
        )}
      </div>

      {showText && (
        <span
          className={`font-black tracking-tight bg-[linear-gradient(90deg,#008aff_0%,#7c3aed_24%,#ff007f_48%,#ff1744_72%,#ff8c00_100%)] bg-clip-text text-transparent ${
            textClassName || "text-lg"
          }`}
        >
          KLICK!
        </span>
      )}
    </div>
  );
}
