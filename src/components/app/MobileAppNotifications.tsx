"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, Bell } from "lucide-react";
import { motion } from "framer-motion";

interface MobileAppNotificationsProps {
  onBack: () => void;
  onContinue: () => void;
}

export default function MobileAppNotifications({
  onBack,
  onContinue,
}: MobileAppNotificationsProps) {
  const [permissionStatus, setPermissionStatus] = useState<"pending" | "accepted" | "dismissed">("pending");

  const handleAccept = () => {
    setPermissionStatus("accepted");
    // Si estamos en nativo podemos solicitar permiso real
  };

  const handleDismiss = () => {
    setPermissionStatus("dismissed");
  };

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center overflow-hidden select-none">
      {/* Contenedor simulador móvil */}
      <div className="w-full max-w-[430px] h-[100dvh] bg-[#070709] text-white flex flex-col justify-between relative overflow-hidden shadow-2xl md:border md:border-zinc-800/80 md:rounded-[40px] px-6 pt-12 pb-8">
        
        {/* Ambient Glow */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-pink-900/15 rounded-full blur-3xl pointer-events-none" />

        {/* 1. Header con Botón Atrás (<), Barra de progreso y Logo */}
        <div className="w-full flex items-center justify-between gap-3 z-10">
          <button
            onClick={onBack}
            type="button"
            className="p-1 -ml-1 text-zinc-400 hover:text-white active:scale-90 transition-all cursor-pointer shrink-0"
            title="Volver"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>

          {/* Barra de progreso Paso 3 (60%) */}
          <div className="flex-1 h-1.5 bg-zinc-800/80 rounded-full overflow-hidden relative">
            <motion.div
              initial={{ width: "40%" }}
              animate={{ width: "60%" }}
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
            PASO 3 · PERMISOS
          </span>

          {/* Título en semibold */}
          <h1 className="text-2xl sm:text-[26px] font-semibold tracking-tight text-white mb-2 uppercase">
            Activa las notificaciones
          </h1>

          {/* Subtítulo */}
          <p className="text-xs sm:text-[13px] text-zinc-400 font-normal mb-8">
            Te avisamos cuando alguien hace klick contigo o te escribe.
          </p>

          {/* Tarjeta con borde gradiente multicolor */}
          <div className="relative p-[1.5px] rounded-3xl bg-[linear-gradient(135deg,#008aff_0%,#7c3aed_35%,#ff007f_70%,#ff8c00_100%)] shadow-2xl shadow-pink-500/10">
            <div className="w-full bg-[#0c0d12] rounded-[23px] p-6 sm:p-7 flex flex-col items-center text-center">
              
              {/* Icono campana con gradiente circular */}
              <div className="w-16 h-16 rounded-full bg-[linear-gradient(135deg,#008aff_0%,#7c3aed_35%,#ff007f_70%,#ff8c00_100%)] flex items-center justify-center text-white shadow-lg shadow-pink-500/25 mb-5">
                <Bell className="w-7 h-7 stroke-[2.2]" />
              </div>

              {/* Mensaje */}
              <p className="text-xs sm:text-[13.5px] text-zinc-300 leading-relaxed mb-6 px-1">
                &ldquo;Klick&rdquo; quiere enviarte notificaciones de matches, mensajes y recordatorios de citas.
              </p>

              {/* Botones de acción dentro de la tarjeta */}
              <div className="w-full grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleDismiss}
                  className={`h-11 rounded-full text-xs sm:text-[13px] font-semibold border transition-all duration-200 cursor-pointer ${
                    permissionStatus === "dismissed"
                      ? "bg-white/15 border-white/30 text-white"
                      : "bg-[#16171f] hover:bg-[#1f202b] border-white/10 text-zinc-400 hover:text-white"
                  }`}
                >
                  Ahora no
                </button>
                <button
                  type="button"
                  onClick={handleAccept}
                  className={`h-11 rounded-full text-xs sm:text-[13px] font-semibold text-white shadow-lg transition-all duration-200 cursor-pointer active:scale-95 ${
                    permissionStatus === "accepted"
                      ? "bg-gradient-to-r from-blue-500 to-green-500 shadow-green-500/20"
                      : "bg-[linear-gradient(90deg,#008aff_0%,#ff007f_50%,#ff8c00_100%)] hover:opacity-95 shadow-pink-500/20"
                  }`}
                >
                  {permissionStatus === "accepted" ? "Activadas ✓" : "Aceptar"}
                </button>
              </div>

            </div>
          </div>
        </motion.div>

        {/* 3. Botón Continuar */}
        <div className="w-full z-10 pb-2">
          <button
            onClick={onContinue}
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
