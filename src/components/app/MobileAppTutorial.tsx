"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MobileAppTutorialProps {
  onBack: () => void;
  onFinish: () => void;
}

const TUTORIAL_SLIDES = [
  {
    number: "01",
    title: "DESLIZA SUS FOTOS",
    description: "Desliza horizontalmente sobre la foto o toca a la derecha para ver todas sus imágenes y biografía.",
  },
  {
    number: "02",
    title: "DALE KLICK",
    description: "Desliza a la derecha o pulsa el corazón para conectar. Si ambos coinciden, ¡es un Match inmediato!",
  },
  {
    number: "03",
    title: "PRIMERA CITA SEGURA",
    description: "Chatea con confianza, comparte datos seguros y encuentra a tu persona especial con valores reales.",
  },
];

export default function MobileAppTutorial({
  onBack,
  onFinish,
}: MobileAppTutorialProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNextSlide = () => {
    if (currentSlide < TUTORIAL_SLIDES.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      onFinish();
    }
  };

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center overflow-hidden select-none">
      {/* Contenedor simulador móvil */}
      <div className="w-full max-w-[430px] h-[100dvh] bg-[#070709] text-white flex flex-col justify-between relative overflow-hidden shadow-2xl md:border md:border-zinc-800/80 md:rounded-[40px] px-6 pt-12 pb-8">
        
        {/* Ambient Glow */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-pink-900/15 rounded-full blur-3xl pointer-events-none" />

        {/* 1. Header con Botón Atrás (<), Barra de progreso al 100% y Logo */}
        <div className="w-full flex items-center justify-between gap-3 z-10">
          <button
            onClick={onBack}
            type="button"
            className="p-1 -ml-1 text-zinc-400 hover:text-white active:scale-90 transition-all cursor-pointer shrink-0"
            title="Volver"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>

          {/* Barra de progreso Paso 7 (100%) */}
          <div className="flex-1 h-1.5 bg-zinc-800/80 rounded-full overflow-hidden relative">
            <div className="h-full w-full bg-[linear-gradient(90deg,#008aff_0%,#7c3aed_24%,#ff007f_48%,#ff1744_72%,#ff8c00_100%)] rounded-full" />
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 shrink-0">
            <Image
              src="/matchapp-logo-circular.png"
              alt="Klick"
              width={18}
              height={18}
              className="rounded-full object-cover"
              priority
            />
            <span className="text-[11px] font-semibold text-zinc-300">Klick</span>
          </div>
        </div>

        {/* 2. Contenido Principal */}
        <div className="flex-1 flex flex-col justify-start z-10 mt-8 px-1">
          {/* Tag de paso en azul */}
          <span className="text-[11px] font-bold tracking-widest text-blue-500 uppercase mb-2">
            PASO 7 · TUTORIAL
          </span>

          {/* Título en semibold */}
          <h1 className="text-2xl sm:text-[26px] font-semibold tracking-tight text-white mb-2 uppercase">
            Así funciona Klick
          </h1>

          {/* Subtítulo */}
          <p className="text-xs sm:text-[13px] text-zinc-400 font-normal mb-8">
            Desliza para ver cómo aprovechar la app al máximo.
          </p>

          {/* Tarjeta de Slide Tutorial interactiva */}
          <div className="relative p-[1.5px] rounded-3xl bg-[linear-gradient(135deg,#008aff_0%,#7c3aed_35%,#ff007f_70%,#ff8c00_100%)] shadow-2xl shadow-pink-500/10 mb-6">
            <div className="w-full min-h-[190px] bg-[#0c0d12] rounded-[23px] p-7 flex flex-col justify-between">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-3"
                >
                  <span className="text-3xl font-black bg-[linear-gradient(90deg,#ff007f_0%,#ff8c00_100%)] bg-clip-text text-transparent">
                    {TUTORIAL_SLIDES[currentSlide].number}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-wide uppercase">
                    {TUTORIAL_SLIDES[currentSlide].title}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-zinc-300 leading-relaxed font-normal">
                    {TUTORIAL_SLIDES[currentSlide].description}
                  </p>
                </motion.div>
              </AnimatePresence>

            </div>
          </div>

          {/* Indicadores de puntos (Dots) */}
          <div className="flex items-center justify-center gap-2">
            {TUTORIAL_SLIDES.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentSlide === index
                    ? "w-7 bg-gradient-to-r from-pink-500 to-amber-400"
                    : "w-2 bg-zinc-800 hover:bg-zinc-700"
                }`}
              />
            ))}
          </div>
        </div>

        {/* 3. Botón Entrar a Klick (Blanco Sólido) */}
        <div className="w-full z-10 pb-2">
          <button
            onClick={handleNextSlide}
            type="button"
            className="w-full h-14 rounded-full bg-white hover:bg-zinc-100 text-black active:scale-[0.98] shadow-xl shadow-white/10 text-[15px] font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center"
          >
            <span>{currentSlide === TUTORIAL_SLIDES.length - 1 ? "Entrar a Klick" : "Siguiente"}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
