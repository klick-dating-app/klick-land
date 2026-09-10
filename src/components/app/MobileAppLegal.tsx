"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ShieldCheck, Check } from "lucide-react";
import { motion } from "framer-motion";

interface MobileAppLegalProps {
  onBack: () => void;
  onContinue: () => void;
}

export default function MobileAppLegal({
  onBack,
  onContinue,
}: MobileAppLegalProps) {
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center overflow-hidden select-none">
      {/* Contenedor simulador móvil con espacio superior para cámara/notch */}
      <div className="w-full max-w-[430px] h-[100dvh] bg-[#070709] text-white flex flex-col justify-between relative overflow-hidden shadow-2xl md:border md:border-zinc-800/80 md:rounded-[40px] px-6 pt-12 pb-8">
        
        {/* Ambient Glow */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />

        {/* 1. Header con Botón Atrás (< sin contenedor), Barra de progreso y Logo */}
        <div className="w-full flex items-center justify-between gap-3 z-10">
          {/* Botón Atrás sin contenedor */}
          <button
            onClick={onBack}
            type="button"
            className="p-1 -ml-1 text-zinc-400 hover:text-white active:scale-90 transition-all cursor-pointer shrink-0"
            title="Volver"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>

          {/* Barra de progreso con el degradado oficial de la marca */}
          <div className="flex-1 h-1.5 bg-zinc-800/80 rounded-full overflow-hidden relative">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "25%" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="h-full bg-[linear-gradient(90deg,#008aff_0%,#7c3aed_24%,#ff007f_48%,#ff1744_72%,#ff8c00_100%)] rounded-full"
            />
          </div>

          {/* Logo en miniatura Klick */}
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

        {/* 2. Contenido Principal (con espacio prudente hacia abajo) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex-1 flex flex-col justify-start z-10 mt-8 px-1"
        >
          {/* Tag de paso en azul */}
          <span className="text-[11px] font-bold tracking-widest text-blue-500 uppercase mb-2">
            PASO 1 · LEGAL
          </span>

          {/* Título en semibold */}
          <h1 className="text-2xl sm:text-[26px] font-semibold tracking-tight text-white mb-2 uppercase">
            Antes de empezar
          </h1>

          {/* Subtítulo */}
          <p className="text-xs sm:text-[13px] text-zinc-400 font-normal mb-6">
            Klick es una comunidad real. Necesitamos tu acuerdo.
          </p>

          {/* Tarjeta 1: Aceptación de Términos (Interactiva) */}
          <div
            onClick={() => setAcceptedTerms(!acceptedTerms)}
            role="button"
            tabIndex={0}
            className={`w-full p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-start gap-3.5 mb-3.5 select-none ${
              acceptedTerms
                ? "bg-white/[0.08] border-purple-500/50 shadow-lg shadow-purple-500/10"
                : "bg-[#101116] hover:bg-[#15161e] border-white/10"
            }`}
          >
            {/* Checkbox circular interactivo */}
            <div
              className={`w-5 h-5 rounded-full mt-0.5 flex items-center justify-center shrink-0 transition-all duration-200 ${
                acceptedTerms
                  ? "bg-[linear-gradient(135deg,#008aff_0%,#7c3aed_35%,#ff007f_70%,#ff1744_100%)] text-white shadow-md shadow-pink-500/20"
                  : "border-2 border-zinc-600 hover:border-zinc-400"
              }`}
            >
              {acceptedTerms && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>

            {/* Texto de términos con enlaces en Azul */}
            <p className="text-xs sm:text-[13px] text-zinc-200 leading-relaxed">
              Acepto los{" "}
              <a
                href="/terminos"
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-blue-400 hover:text-blue-300 underline font-medium"
              >
                Términos y Condiciones
              </a>{" "}
              y la{" "}
              <a
                href="/privacidad"
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-blue-400 hover:text-blue-300 underline font-medium"
              >
                Política de Privacidad
              </a>{" "}
              de Klick.
            </p>
          </div>

          {/* Tarjeta 2: Garantía de Privacidad en Azul */}
          <div className="w-full p-4 rounded-2xl bg-[#101116]/80 border border-white/5 flex items-start gap-3.5">
            <div className="p-1 rounded-full bg-blue-500/10 text-blue-400 shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <p className="text-xs sm:text-[12.5px] text-zinc-400 leading-relaxed font-normal">
              Nunca compartimos tu ubicación exacta ni tus datos personales con terceros.
            </p>
          </div>
        </motion.div>

        {/* 3. Botón Continuar (Limpio y centrado sin icono) */}
        <div className="w-full z-10 pb-2">
          <button
            onClick={onContinue}
            disabled={!acceptedTerms}
            type="button"
            className={`w-full h-14 rounded-full flex items-center justify-center text-[15px] font-semibold transition-all duration-200 cursor-pointer ${
              acceptedTerms
                ? "bg-white hover:bg-zinc-100 text-black active:scale-[0.98] shadow-xl shadow-white/10"
                : "bg-[#181920] text-zinc-500 cursor-not-allowed border border-white/5"
            }`}
          >
            <span>Continuar</span>
          </button>
        </div>

      </div>
    </div>
  );
}
