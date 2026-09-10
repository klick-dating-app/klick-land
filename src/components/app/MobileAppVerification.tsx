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

          {/* Tarjeta con borde gradiente multicolor */}
          <div className="relative p-[1.5px] rounded-3xl bg-[linear-gradient(135deg,#008aff_0%,#7c3aed_35%,#ff007f_70%,#ff8c00_100%)] shadow-2xl shadow-purple-500/10">
            <div className="w-full bg-[#0c0d12] rounded-[23px] p-7 flex flex-col items-center text-center">
              
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
                    {/* Icono de verificación circular oscuro */}
                    <div className="w-16 h-16 rounded-full bg-[#181922] border border-white/10 flex items-center justify-center text-zinc-300 mb-5">
                      <BadgeCheck className="w-8 h-8 stroke-[1.8]" />
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider mb-2">
                      Verificar Ahora
                    </h3>

                    <p className="text-xs sm:text-[13px] text-zinc-400 leading-relaxed mb-6 px-2">
                      Tomaremos un selfie y lo compararemos con tus fotos.
                    </p>

                    <button
                      type="button"
                      disabled={isVerifying}
                      onClick={handleStartVerification}
                      className="w-full h-12 rounded-full text-sm font-semibold text-white bg-[linear-gradient(90deg,#008aff_0%,#ff007f_50%,#ff8c00_100%)] hover:opacity-95 active:scale-95 shadow-lg shadow-pink-500/25 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isVerifying ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Verificando...</span>
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
                    className="w-full flex flex-col items-center"
                  >
                    {/* Badge circular con gradiente vibrante */}
                    <div className="w-18 h-18 rounded-full bg-[linear-gradient(135deg,#008aff_0%,#7c3aed_35%,#ff007f_70%,#ff8c00_100%)] flex items-center justify-center text-black shadow-xl shadow-pink-500/30 mb-5 animate-pulse">
                      <BadgeCheck className="w-9 h-9 fill-black stroke-white stroke-[2]" />
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider mb-2">
                      Perfil Verificado
                    </h3>

                    <p className="text-xs sm:text-[13px] text-zinc-300 leading-relaxed px-2">
                      Tu insignia azul ya aparece en tu perfil.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>
        </motion.div>

        {/* 3. Botón Continuar (Con gradiente vibrante al estar verificado) */}
        <div className="w-full z-10 pb-2">
          <button
            onClick={onFinish}
            type="button"
            className={`w-full h-14 rounded-full text-[15px] font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center shadow-xl ${
              isVerified
                ? "bg-[linear-gradient(90deg,#008aff_0%,#ff007f_50%,#ff8c00_100%)] text-white shadow-pink-500/25 hover:opacity-95 active:scale-[0.98]"
                : "bg-white hover:bg-zinc-100 text-black shadow-white/10 active:scale-[0.98]"
            }`}
          >
            <span>Continuar</span>
          </button>
        </div>

      </div>
    </div>
  );
}
