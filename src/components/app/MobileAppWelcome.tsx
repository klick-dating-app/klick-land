"use client";

import React from "react";
import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

interface MobileAppWelcomeProps {
  onGoogleLogin?: () => void;
  onAppleLogin?: () => void;
}

export default function MobileAppWelcome({
  onGoogleLogin,
  onAppleLogin,
}: MobileAppWelcomeProps) {
  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center overflow-hidden select-none">
      {/* Contenedor simulador móvil centrado */}
      <div className="w-full max-w-[430px] h-[100dvh] bg-[#070709] text-white flex flex-col justify-between relative overflow-hidden shadow-2xl md:border md:border-zinc-800/80 md:rounded-[40px] px-7 py-8 pt-safe pb-safe">
        
        {/* Glow ambient background effects */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-gradient-to-b from-purple-900/20 via-pink-900/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[250px] h-[250px] bg-cyan-900/15 rounded-full blur-3xl pointer-events-none" />

        {/* Centro ópticamente perfecto: Logo + Klick Dating + Slogan */}
        <div className="flex-1 flex flex-col items-center justify-center text-center z-10 px-2 gap-4 my-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-3 px-4 py-1.5 bg-transparent"
          >
            <Image
              src="/matchapp-logo-circular.png"
              alt="Klick Dating Logo"
              width={40}
              height={40}
              className="rounded-full object-cover shrink-0 shadow-md"
              priority
            />
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Klick Dating
            </span>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-lg sm:text-xl font-medium tracking-tight bg-[linear-gradient(90deg,#008aff_0%,#7c3aed_24%,#ff007f_48%,#ff1744_72%,#ff8c00_100%)] bg-clip-text text-transparent"
          >
            Make klick with someone real
          </motion.p>
        </div>

        {/* 3. Bottom: Botones de Inicio de Sesión y Disclaimer */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full flex flex-col items-center gap-3.5 z-10 pb-2"
        >
          {/* Botón Google */}
          <button
            onClick={onGoogleLogin}
            type="button"
            className="w-full h-14 bg-white hover:bg-zinc-100 active:scale-[0.98] text-black font-semibold text-[15px] rounded-full flex items-center justify-center gap-3 shadow-lg shadow-white/5 transition-all duration-200 cursor-pointer"
          >
            {/* SVG Google Color Icon */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24Z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Botón Apple */}
          <button
            onClick={onAppleLogin}
            type="button"
            className="w-full h-14 bg-[#181920] hover:bg-[#20222c] active:scale-[0.98] border border-white/10 text-white font-semibold text-[15px] rounded-full flex items-center justify-center gap-3 shadow-lg transition-all duration-200 cursor-pointer"
          >
            {/* SVG Apple Icon Oficial */}
            <svg className="w-5 h-5 fill-current mb-0.5 shrink-0" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8.92-2.85-.9.04-1.99.6-2.61 1.34-.55.63-1.03 1.67-.9 2.69 1 .08 2.02-.43 2.59-1.18Z" />
            </svg>
            <span>Continue with Apple ID</span>
          </button>

          {/* Subtexto de confianza */}
          <div className="flex items-center justify-center gap-1.5 text-[11px] sm:text-xs text-zinc-400 mt-1 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>Comunidad SUD verificada · Solo mayores de 18</span>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
