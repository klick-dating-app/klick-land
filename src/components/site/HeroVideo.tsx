'use client';

import { useEffect, useRef, useState } from 'react';

/** Vídeos del hero (mismos del diseño original). Muévelos al Storage del proyecto nuevo cuando exista. */
const BASE = 'https://firebasestorage.googleapis.com/v0/b/landluxor.firebasestorage.app/o/Matchapp%2F';
const CLIPS = [
  `${BASE}4873444-hd_1920_1080_25fps.mp4?alt=media&token=9b8552bc-faa3-4235-9220-4a12e2459bc7`,
  `${BASE}4873427-hd_1920_1080_25fps.mp4?alt=media&token=d9c93ac6-844a-4a5c-bdc6-c393a733a090`,
  `${BASE}4752884-uhd_3840_2160_25fps.mp4?alt=media&token=3a8b4af4-9629-4c2a-bda8-a20780078243`,
];

/** Fondo cinematográfico: un vídeo a la vez con fundido suave; sin movimiento si el usuario lo prefiere. */
export default function HeroVideo() {
  const [i, setI] = useState(0);
  const [still, setStill] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setStill(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);
  useEffect(() => void ref.current?.play().catch(() => undefined), [i]);

  return (
    <div className="absolute inset-0 bg-[#050507]">
      {!still && (
        <video
          key={i}
          ref={ref}
          className="animate-fade-slow absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          playsInline
          preload="metadata"
          src={CLIPS[i]}
          onEnded={() => setI((n) => (n + 1) % CLIPS.length)}
        />
      )}
      <div className="absolute inset-0 bg-black/35" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-transparent to-black/60" />
    </div>
  );
}
