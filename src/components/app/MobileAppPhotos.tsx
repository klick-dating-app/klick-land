"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, Camera, Video, Sparkles, X, Plus, Play, Check } from "lucide-react";
import { motion } from "framer-motion";

interface MobileAppPhotosProps {
  onBack: () => void;
  onContinue: (photos: string[]) => void;
}

interface MediaSlot {
  type: "photo" | "video";
  url: string | null;
  label: string;
}

export default function MobileAppPhotos({
  onBack,
  onContinue,
}: MobileAppPhotosProps) {
  const [mediaSlots, setMediaSlots] = useState<MediaSlot[]>([
    { type: "photo", url: null, label: "Foto Principal" },
    { type: "video", url: null, label: "Video Perfil" },
    { type: "photo", url: null, label: "Foto 2" },
    { type: "photo", url: null, label: "Foto 3" },
    { type: "photo", url: null, label: "Foto 4" },
    { type: "photo", url: null, label: "Foto 5" },
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeSlotIndex, setActiveSlotIndex] = useState<number | null>(null);

  const handleSlotClick = (index: number) => {
    setActiveSlotIndex(index);
    if (fileInputRef.current) {
      fileInputRef.current.accept = mediaSlots[index].type === "video" ? "video/*" : "image/*";
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeSlotIndex !== null) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updated = [...mediaSlots];
        updated[activeSlotIndex].url = reader.result as string;
        setMediaSlots(updated);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveMedia = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = [...mediaSlots];
    updated[index].url = null;
    setMediaSlots(updated);
  };

  const handleProceed = () => {
    const validPhotos = mediaSlots
      .filter((m) => m.url !== null)
      .map((m) => m.url as string);
    onContinue(validPhotos);
  };

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center overflow-hidden select-none">
      {/* Input oculto para subir fotos o video */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Contenedor simulador móvil */}
      <div className="w-full max-w-[430px] h-[100dvh] bg-[#070709] text-white flex flex-col justify-between relative overflow-hidden shadow-2xl md:border md:border-zinc-800/80 md:rounded-[40px] px-6 pt-12 pb-8">
        
        {/* Ambient Glow */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-blue-900/15 rounded-full blur-3xl pointer-events-none" />

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

          {/* Barra de progreso Paso 4 (80%) */}
          <div className="flex-1 h-1.5 bg-zinc-800/80 rounded-full overflow-hidden relative">
            <motion.div
              initial={{ width: "60%" }}
              animate={{ width: "80%" }}
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
          className="flex-1 flex flex-col justify-start z-10 mt-6 px-1 overflow-y-auto no-scrollbar"
        >
          {/* Tag de paso en azul */}
          <span className="text-[11px] font-bold tracking-widest text-blue-500 uppercase mb-1">
            PASO 4 · MULTIMEDIA
          </span>

          {/* Título en semibold */}
          <h1 className="text-2xl sm:text-[26px] font-semibold tracking-tight text-white mb-1 uppercase">
            Tus fotos y video
          </h1>

          {/* Subtítulo */}
          <p className="text-xs sm:text-[12.5px] text-zinc-400 font-normal mb-5">
            Sube tus mejores ángulos y un video corto para que tu perfil resalte.
          </p>

          {/* Grid Moderno de Fotos y Video */}
          <div className="grid grid-cols-3 gap-2.5 mb-4">
            
            {/* Slot 1: Foto Principal (Destacada, 2 columnas) */}
            <div
              onClick={() => handleSlotClick(0)}
              className="col-span-2 row-span-2 relative aspect-[3/4] rounded-2xl bg-[#0e0f15] border border-white/10 hover:border-blue-500/60 transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden group shadow-lg"
            >
              {mediaSlots[0].url ? (
                <>
                  <img
                    src={mediaSlots[0].url}
                    alt="Foto Principal"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={(e) => handleRemoveMedia(0, e)}
                    className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center backdrop-blur-md transition-transform active:scale-90 shadow-md"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <span className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-full bg-blue-600 text-[10px] font-bold text-white shadow-md">
                    Foto Principal ⭐
                  </span>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2 p-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                    <Camera className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold text-white">Foto Principal</span>
                  <span className="text-[10px] text-zinc-500 leading-tight">La primera que verán</span>
                </div>
              )}
            </div>

            {/* Slot 2: Video de Perfil */}
            <div
              onClick={() => handleSlotClick(1)}
              className="col-span-1 relative aspect-[3/4] rounded-2xl bg-[#0e0f15] border border-blue-500/20 hover:border-blue-500/60 transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden group shadow-md"
            >
              {mediaSlots[1].url ? (
                <>
                  <video
                    src={mediaSlots[1].url}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                  />
                  <button
                    type="button"
                    onClick={(e) => handleRemoveMedia(1, e)}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-black/70 text-[9px] font-bold text-blue-400">
                    Video 🎥
                  </span>
                </>
              ) : (
                <div className="flex flex-col items-center gap-1.5 text-center p-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600/10 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Video className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-semibold text-white">Video</span>
                  <span className="text-[9px] text-zinc-500">Opcional</span>
                </div>
              )}
            </div>

            {/* Slot 3 */}
            <div
              onClick={() => handleSlotClick(2)}
              className="col-span-1 relative aspect-[3/4] rounded-2xl bg-[#0e0f15] border border-white/10 hover:border-blue-500/50 transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden group shadow-md"
            >
              {mediaSlots[2].url ? (
                <>
                  <img src={mediaSlots[2].url} alt="Foto 3" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={(e) => handleRemoveMedia(2, e)}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center gap-1 text-zinc-500 group-hover:text-blue-400">
                  <Plus className="w-5 h-5" />
                  <span className="text-[10px] font-medium">Foto 2</span>
                </div>
              )}
            </div>

            {/* Slots 4, 5, 6 (Fila inferior de 3 fotos) */}
            {[3, 4, 5].map((idx) => (
              <div
                key={idx}
                onClick={() => handleSlotClick(idx)}
                className="col-span-1 relative aspect-[3/4] rounded-2xl bg-[#0e0f15] border border-white/10 hover:border-blue-500/50 transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden group shadow-md"
              >
                {mediaSlots[idx].url ? (
                  <>
                    <img src={mediaSlots[idx].url!} alt={`Foto ${idx}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={(e) => handleRemoveMedia(idx, e)}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-1 text-zinc-500 group-hover:text-blue-400">
                    <Plus className="w-5 h-5" />
                    <span className="text-[10px] font-medium">Foto {idx}</span>
                  </div>
                )}
              </div>
            ))}

          </div>

          {/* Banner de recomendación */}
          <div className="w-full p-3 rounded-2xl bg-[#0e0f15] border border-white/5 flex items-center gap-2.5 mb-2">
            <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
            <p className="text-[11.5px] text-zinc-300 leading-snug font-normal">
              Perfiles con <span className="text-white font-semibold">video y fotos reales</span> tienen <span className="text-blue-400 font-semibold">3x más match rate</span>.
            </p>
          </div>
        </motion.div>

        {/* 3. Botón Continuar (Blanco Sólido) */}
        <div className="w-full z-10 pb-2">
          <button
            onClick={handleProceed}
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
