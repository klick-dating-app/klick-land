"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, BadgeCheck, ShieldCheck, Sparkles, Camera } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MobileAppVerificationProps {
  onBack: () => void;
  onFinish: () => void;
}

export default function MobileAppVerification({
  onBack,
  onFinish,
}: MobileAppVerificationProps) {
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleStartVerification = () => {
    setIsVerifying(true);
    // Simular escaneo de selfie
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center overflow-hidden select-none">
      {/* Contenedor simulador móvil */}
      <div className="w-full max-w-[430px] h-[100dvh] bg-[#070709] text-white flex flex-col justify-between relative overflow-hidden shadow-2xl md:border md:border-zinc-800/80 md:rounded-[40px] px-6 pt-12 pb-8">
        
        {/* Ambient Glow */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-blue-900/15 rounded-full blur-3xl pointer-events-none" />

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

          {/* Barra de progreso Paso 5 (100%) */}
          <div className="flex-1 h-1.5 bg-zinc-800/80 rounded-full overflow-hidden relative">
            <motion.div
              initial={{ width: "80%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="h-full bg-[linear-gradient(90deg,#008aff_0%,#7c3aed_24%,#ff007f_48%,#ff1744_72%,#ff8c00_100%)] rounded-full"
            />
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
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex-1 flex flex-col justify-start z-10 mt-8 px-1"
        >
          {/* Tag de paso en azul */}
          <span className="text-[11px] font-bold tracking-widest text-blue-500 uppercase mb-2">
            PASO 5 · VERIFICACIÓN
          </span>

          {/* Título en semibold */}
          <h1 className="text-2xl sm:text-[26px] font-semibold tracking-tight text-white mb-2 uppercase">
            Verificación de fotos
          </h1>

          {/* Subtítulo */}
          <p className="text-xs sm:text-[13px] text-zinc-400 font-normal mb-8">
            Un gesto rápido para confirmar que eres tú.
          </p>

          {/* Tarjeta limpia sin contenedor circular de icono */}
          <div className="w-full bg-[#0e0f15] border border-white/10 rounded-3xl p-7 flex flex-col items-center text-center shadow-2xl">
            <AnimatePresence mode="wait">
              {!isVerified ? (
                /* Estado 1: No verificado */
                <motion.div
                  key="unverified"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="w-full flex flex-col items-center"
                >
                  {/* Icono de verificación limpio sin contenedor circular */}
                  <BadgeCheck className="w-16 h-16 stroke-[1.5] text-blue-400 mb-4 drop-shadow-md" />

                  <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider mb-2">
                    Verificar Ahora
                  </h3>

                  <p className="text-xs sm:text-[13px] text-zinc-400 leading-relaxed mb-6 px-2">
                    Tomaremos un selfie rápido y lo compararemos con tus fotos para activar tu insignia de confianza.
                  </p>

                  <button
                    type="button"
                    disabled={isVerifying}
                    onClick={handleStartVerification}
                    className="w-full h-12 rounded-full text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 active:scale-95 shadow-lg shadow-blue-500/25 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isVerifying ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Verificando selfie...</span>
                      </>
                    ) : (
                      <>
                        <Camera className="w-4 h-4" />
                        <span>Iniciar verificación</span>
                      </>
                    )}
                  </button>
                </motion.div>
              ) : (
                /* Estado 2: Verificado con éxito */
                <motion.div
                  key="verified"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full flex flex-col items-center py-4"
                >
                  {/* Icono verificado standalone */}
                  <BadgeCheck className="w-20 h-20 fill-blue-500 text-black mb-4 drop-shadow-xl animate-pulse" />

                  <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider mb-2">
                    Perfil Verificado
                  </h3>

                  <p className="text-xs sm:text-[13px] text-zinc-300 leading-relaxed px-2">
                    ¡Listo! Tu insignia azul de verificación ya está activa.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* 3. Botón Continuar (Blanco Sólido) */}
        <div className="w-full z-10 pb-2">
          <button
            onClick={onFinish}
            type="button"
            className="w-full h-14 rounded-full bg-white hover:bg-zinc-100 text-black active:scale-[0.98] shadow-xl shadow-white/10 text-[15px] font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center"
          >
            <span>Continuar</span>
          </button>
        </div>

      </div>
    </div>
  );
}
