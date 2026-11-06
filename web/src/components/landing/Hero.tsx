"use client";

import { useState, useRef, useEffect } from "react";
import { sendMetaEvent } from "@/lib/meta-events";

interface HeroProps {
  onStartQuote: () => void;
}

const videoLinks = [
  "https://firebasestorage.googleapis.com/v0/b/landluxor.firebasestorage.app/o/Matchapp%2F6789235-uhd_4096_2160_25fps.mp4?alt=media&token=ce5c53ae-59a7-469a-8cbe-b44d333e7a84",
  "https://firebasestorage.googleapis.com/v0/b/landluxor.firebasestorage.app/o/Matchapp%2F6670592-uhd_4096_2160_25fps.mp4?alt=media&token=cb69e888-c607-4270-996e-31851a32a096",
  "https://firebasestorage.googleapis.com/v0/b/landluxor.firebasestorage.app/o/Matchapp%2F5102620-uhd_3840_2160_25fps.mp4?alt=media&token=bf00cbc7-a1ad-43f2-a1dd-a0a6d790bb44",
  "https://firebasestorage.googleapis.com/v0/b/landluxor.firebasestorage.app/o/Matchapp%2F4873444-hd_1920_1080_25fps.mp4?alt=media&token=9b8552bc-faa3-4235-9220-4a12e2459bc7",
  "https://firebasestorage.googleapis.com/v0/b/landluxor.firebasestorage.app/o/Matchapp%2F4873427-hd_1920_1080_25fps.mp4?alt=media&token=d9c93ac6-844a-4a5c-bdc6-c393a733a090",
  "https://firebasestorage.googleapis.com/v0/b/landluxor.firebasestorage.app/o/Matchapp%2F4752884-uhd_3840_2160_25fps.mp4?alt=media&token=3a8b4af4-9629-4c2a-bda8-a20780078243",
  "https://firebasestorage.googleapis.com/v0/b/landluxor.firebasestorage.app/o/Matchapp%2F4473066-uhd_3840_2160_25fps.mp4?alt=media&token=a83a5517-cf12-4fd3-be76-2d710f3675f3",
  "https://firebasestorage.googleapis.com/v0/b/landluxor.firebasestorage.app/o/Matchapp%2F15980593_3840_2160_30fps.mp4?alt=media&token=e2751d64-534e-48ac-b857-399e450db768",
  "https://firebasestorage.googleapis.com/v0/b/landluxor.firebasestorage.app/o/Matchapp%2F12488902_3840_2160_24fps.mp4?alt=media&token=45085b47-c933-4bd3-a47e-248ed130fc5e",
  "https://firebasestorage.googleapis.com/v0/b/landluxor.firebasestorage.app/o/Matchapp%2F10220214-uhd_4096_2160_25fps.mp4?alt=media&token=e56544bb-f856-41eb-b879-83ab9dc02159",
  "https://firebasestorage.googleapis.com/v0/b/landluxor.firebasestorage.app/o/Matchapp%2F10212067-uhd_4096_2160_25fps.mp4?alt=media&token=401118b9-d2c9-46b5-bc5a-d31dbff58ef1"
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
              href="https://chat.whatsapp.com/GVlnQKclJuP63qZjeE0r24"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sendMetaEvent('Contact', { source: 'Hero WhatsApp Button' })}
              className="group relative inline-flex items-center justify-center px-8 py-3 gap-2 text-base font-medium text-white overflow-hidden rounded-full bg-transparent border border-white/40 hover:bg-white/10 hover:border-white/80 hover:text-white hover:[transition-property:transform,box-shadow] hover:scale-105 transition-all duration-300 shadow-lg"
            >
              I have questions before getting started
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
