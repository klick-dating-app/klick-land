"use client";

import { useState, useRef, useEffect } from "react";
import { sendMetaEvent } from "@/lib/meta-events";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/klick/store-links";

interface HeroProps {
  onStartQuote: () => void;
}

const videoLinks = [
  "https://firebasestorage.googleapis.com/v0/b/landluxor.firebasestorage.app/o/Matchapp%2F6670592-uhd_4096_2160_25fps.mp4?alt=media&token=cb69e888-c607-4270-996e-31851a32a096",
  "https://firebasestorage.googleapis.com/v0/b/landluxor.firebasestorage.app/o/Matchapp%2F5102620-uhd_3840_2160_25fps.mp4?alt=media&token=bf00cbc7-a1ad-43f2-a1dd-a0a6d790bb44",
  "https://firebasestorage.googleapis.com/v0/b/landluxor.firebasestorage.app/o/Matchapp%2F4873444-hd_1920_1080_25fps.mp4?alt=media&token=9b8552bc-faa3-4235-9220-4a12e2459bc7",
  "https://firebasestorage.googleapis.com/v0/b/landluxor.firebasestorage.app/o/Matchapp%2F4873427-hd_1920_1080_25fps.mp4?alt=media&token=d9c93ac6-844a-4a5c-bdc6-c393a733a090",
  "https://firebasestorage.googleapis.com/v0/b/landluxor.firebasestorage.app/o/Matchapp%2F4752884-uhd_3840_2160_25fps.mp4?alt=media&token=3a8b4af4-9629-4c2a-bda8-a20780078243",
  "https://firebasestorage.googleapis.com/v0/b/landluxor.firebasestorage.app/o/Matchapp%2F4473066-uhd_3840_2160_25fps.mp4?alt=media&token=a83a5517-cf12-4fd3-be76-2d710f3675f3",
  "https://firebasestorage.googleapis.com/v0/b/landluxor.firebasestorage.app/o/Matchapp%2F15980593_3840_2160_30fps.mp4?alt=media&token=e2751d64-534e-48ac-b857-399e450db768",
  "https://firebasestorage.googleapis.com/v0/b/landluxor.firebasestorage.app/o/Matchapp%2F12488902_3840_2160_24fps.mp4?alt=media&token=45085b47-c933-4bd3-a47e-248ed130fc5e",
  "https://firebasestorage.googleapis.com/v0/b/landluxor.firebasestorage.app/o/Matchapp%2F10220214-uhd_4096_2160_25fps.mp4?alt=media&token=e56544bb-f856-41eb-b879-83ab9dc02159",
  "https://firebasestorage.googleapis.com/v0/b/landluxor.firebasestorage.app/o/Matchapp%2F10212067-uhd_4096_2160_25fps.mp4?alt=media&token=401118b9-d2c9-46b5-bc5a-d31dbff58ef1",
  "https://firebasestorage.googleapis.com/v0/b/landluxor.firebasestorage.app/o/Matchapp%2F6789235-uhd_4096_2160_25fps.mp4?alt=media&token=ce5c53ae-59a7-469a-8cbe-b44d333e7a84"
];

export default function Hero({ onStartQuote }: HeroProps) {
  const [activeVideo, setActiveVideo] = useState<0 | 1>(0);
  const [index0, setIndex0] = useState(0);
  const [index1, setIndex1] = useState(1);

  const video0Ref = useRef<HTMLVideoElement>(null);
  const video1Ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Asegurar que el primer video se reproduzca al cargar
    if (video0Ref.current) {
      video0Ref.current.play().catch(e => console.log("Autoplay prevent:", e));
    }
  }, []);

  const handleTimeUpdate = (videoNum: 0 | 1) => {
    const currentRef = videoNum === 0 ? video0Ref.current : video1Ref.current;
    if (!currentRef) return;

    const { currentTime, duration } = currentRef;
    
    // Crossfade trigger 1 second before end
    if (duration > 0 && duration - currentTime <= 1) {
      if (videoNum === activeVideo) {
        const nextVideo = videoNum === 0 ? 1 : 0;
        const nextRef = nextVideo === 0 ? video0Ref.current : video1Ref.current;
        
        if (nextRef) {
          nextRef.currentTime = 0;
          nextRef.play().catch(e => console.log("Play error:", e));
        }
        
        setActiveVideo(nextVideo);
        
        // Update the old video's source after the transition finishes
        setTimeout(() => {
          if (videoNum === 0) {
            setIndex0((index1 + 1) % videoLinks.length);
          } else {
            setIndex1((index0 + 1) % videoLinks.length);
          }
        }, 1000);
      }
    }
  };

  const handleEnded = (videoNum: 0 | 1) => {
    // Fallback por si falla el onTimeUpdate
    if (videoNum === activeVideo) {
      const nextVideo = videoNum === 0 ? 1 : 0;
      const nextRef = nextVideo === 0 ? video0Ref.current : video1Ref.current;
      
      if (nextRef) {
        nextRef.play().catch(e => console.log("Play error:", e));
      }
      setActiveVideo(nextVideo);
      
      if (videoNum === 0) {
        setIndex0((index1 + 1) % videoLinks.length);
      } else {
        setIndex1((index0 + 1) % videoLinks.length);
      }
    }
  };

  return (
    <section className="relative h-screen min-h-[600px] flex items-end overflow-hidden bg-black">
      {/* Background Container */}
      <div className="absolute inset-0 w-full h-full">
        {/* Video 0 */}
        <video
          ref={video0Ref}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
            activeVideo === 0 ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
          }`}
          autoPlay
          muted
          playsInline
          controlsList="nodownload"
          preload="metadata"
          onTimeUpdate={() => handleTimeUpdate(0)}
          onEnded={() => handleEnded(0)}
          src={videoLinks[index0]}
        />

        {/* Video 1 */}
        <video
          ref={video1Ref}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
            activeVideo === 1 ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
          }`}
          autoPlay
          muted
          playsInline
          controlsList="nodownload"
          preload="metadata"
          onTimeUpdate={() => handleTimeUpdate(1)}
          onEnded={() => handleEnded(1)}
          src={videoLinks[index1]}
        />

        {/* Overlays para legibilidad — no cubrir la barra de controles del video */}
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#050507] via-transparent to-transparent pointer-events-none pb-14" />
      </div>

      {/* Contenido con márgenes de 3cm en desktop, adaptado en movil */}
      <div className="relative z-30 w-full pb-12 md:pb-24 lg:pb-[3cm] px-6 md:px-12 lg:px-[3cm]">
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 w-full">

          <div className="w-full md:max-w-[80%] lg:max-w-[70%] text-left space-y-3">
            {/* Texto superior (Eyebrow) */}
            <p className="text-gray-300 text-sm md:text-base font-medium tracking-[0.2em] uppercase">
              MEET | CONNECT | FALL IN LOVE
            </p>

            {/* Título Principal */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium leading-[1.05] text-white tracking-tighter">
              Make a Klick with someone <br />
              who truly fits with you
            </h1>

            <div className="pt-1">
              <p className="text-gray-300 text-base md:text-lg font-medium tracking-tight">
                A new way to meet people, connect, and create something special.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-4 shrink-0 mb-4">
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sendMetaEvent('Lead', { source: 'Hero App Store Button' })}
              aria-label="Download Klick on the App Store"
              className="group inline-flex w-full sm:w-48 items-center justify-center px-6 py-3 gap-2.5 text-base font-medium text-white rounded-lg bg-black/40 border border-white/40 hover:bg-white hover:text-black hover:border-white hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <svg className="w-5 h-5 fill-current mb-0.5" viewBox="0 0 24 24" aria-hidden>
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8.92-2.85-.9.04-1.99.6-2.61 1.34-.55.63-1.03 1.67-.9 2.69 1 .08 2.02-.43 2.59-1.18Z" />
              </svg>
              App Store
            </a>
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sendMetaEvent('Lead', { source: 'Hero Google Play Button' })}
              aria-label="Get Klick on Google Play"
              className="group inline-flex w-full sm:w-48 items-center justify-center px-6 py-3 gap-2.5 text-base font-medium text-white rounded-lg bg-black/40 border border-white/40 hover:bg-white hover:text-black hover:border-white hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden>
                <path fill="#34A853" d="M3.6 1.8 13.8 12 3.6 22.2c-.4-.2-.6-.7-.6-1.2V3c0-.5.2-1 .6-1.2Z" />
                <path fill="#FBBC04" d="m17.2 8.6-3.4 3.4 3.4 3.4 3.9-2.2c.9-.5.9-1.9 0-2.4l-3.9-2.2Z" />
                <path fill="#EA4335" d="M13.8 12 3.6 22.2c.4.2.9.2 1.4-.1l12.2-6.7L13.8 12Z" />
                <path fill="#4285F4" d="M13.8 12 17.2 8.6 5 1.9c-.5-.3-1-.3-1.4-.1L13.8 12Z" />
              </svg>
              Google Play
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
