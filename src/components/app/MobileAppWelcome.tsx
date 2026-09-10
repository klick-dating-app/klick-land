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

        {/* 1. Header / Top bar con mini logo */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full flex items-center justify-center pt-2 z-10"
        >
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <Image
              src="/matchapp-logo-circular.png"
              alt="Klick Logo"
              width={20}
              height={20}
              className="rounded-full object-cover"
              priority
            />
            <span className="text-xs font-semibold tracking-wider text-zinc-300">
              Klick
            </span>
          </div>
        </motion.div>

        {/* 2. Centro: Brand name & Slogan */}
        <div className="flex flex-col items-center justify-center text-center my-auto z-10 px-2">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl font-black tracking-wider text-white drop-shadow-md mb-3"
          >
            KLICK
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg font-medium text-zinc-300"
          >
            <span className="text-cyan-400 font-semibold">Make klick</span>{" "}
            <span className="bg-gradient-to-r from-pink-500 via-rose-400 to-amber-400 bg-clip-text text-transparent font-bold">
              with someone real
            </span>
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
            {/* SVG Apple Icon */}
            <svg className="w-5 h-5 fill-current" viewBox="0 0 170 170">
              <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.81-11.96-14.32-6.19-9.51-11.04-20.2-14.55-32.07-3.51-11.87-5.27-23.01-5.27-33.43 0-14.07 3.73-25.75 11.19-35.04 7.46-9.29 16.71-14.05 27.75-14.28 4.36 0 9.29 1.16 14.79 3.49 5.5 2.33 9.4 3.55 11.71 3.66 2.31-.11 6.33-1.39 12.06-3.86 5.73-2.47 10.37-3.64 13.91-3.5 10.23.58 18.73 4.44 25.5 11.59-8.49 5.18-12.71 12.35-12.66 21.51.05 7.15 2.76 13.19 8.13 18.12 5.37 4.93 11.77 7.74 19.2 8.44-2.14 6.3-4.83 12.63-8.08 19-.94 1.83-1.91 3.65-2.91 5.47zM119.22 31.84c0-7.38 2.65-14.19 7.95-20.44 5.3-6.25 11.74-10.38 19.33-12.4 0 .97.05 1.95.05 2.94 0 7.23-2.77 14.18-8.31 20.85-5.54 6.67-12.18 10.63-19.92 11.89-.28-.95-.42-1.9-.42-2.84z"/>
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
