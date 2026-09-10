"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, Camera, Sparkles, X, Plus } from "lucide-react";
import { motion } from "framer-motion";

interface MobileAppPhotosProps {
  onBack: () => void;
  onContinue: (photos: string[]) => void;
}

export default function MobileAppPhotos({
  onBack,
  onContinue,
}: MobileAppPhotosProps) {
  // Array de 5 fotos
  const [photos, setPhotos] = useState<(string | null)[]>([null, null, null, null, null]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeSlotIndex, setActiveSlotIndex] = useState<number | null>(null);

  const handleSlotClick = (index: number) => {
    setActiveSlotIndex(index);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeSlotIndex !== null) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPhotos = [...photos];
        newPhotos[activeSlotIndex] = reader.result as string;
        setPhotos(newPhotos);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newPhotos = [...photos];
    newPhotos[index] = null;
    setPhotos(newPhotos);
  };

  const handleProceed = () => {
    const validPhotos = photos.filter((p): p is string => p !== null);
    onContinue(validPhotos);
  };

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center overflow-hidden select-none">
      {/* Input oculto para subir fotos reales */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Contenedor simulador móvil */}
      <div className="w-full max-w-[430px] h-[100dvh] bg-[#070709] text-white flex flex-col justify-between relative overflow-hidden shadow-2xl md:border md:border-zinc-800/80 md:rounded-[40px] px-6 pt-12 pb-8">
        
        {/* Ambient Glow */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-purple-900/15 rounded-full blur-3xl pointer-events-none" />

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
          className="flex-1 flex flex-col justify-start z-10 mt-6 px-1"
        >
          {/* Tag de paso en azul */}
          <span className="text-[11px] font-bold tracking-widest text-blue-500 uppercase mb-1.5">
            PASO 4 · FOTOS
          </span>

          {/* Título en semibold */}
          <h1 className="text-2xl sm:text-[26px] font-semibold tracking-tight text-white mb-1.5 uppercase">
            Sube 5 fotos
          </h1>

          {/* Subtítulo */}
          <p className="text-xs sm:text-[13px] text-zinc-400 font-normal mb-5">
            Rostro visible, sin filtros pesados. Así generas confianza real.
          </p>

          {/* Grid de 5 Fotos */}
          <div className="grid grid-cols-3 gap-2.5 mb-4">
            {/* Foto 1 (Principal - Ocupa 2 columnas de alto o fila completa destacada) */}
            {photos.map((photo, index) => (
              <div
                key={index}
                onClick={() => handleSlotClick(index)}
                className={`relative aspect-[3/4] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all duration-200 group select-none ${
                  photo
                    ? "border-transparent bg-zinc-900"
                    : "border-white/15 bg-[#101116] hover:bg-[#15161f] hover:border-blue-500/50"
                } ${index === 0 ? "col-span-1" : ""}`}
              >
                {photo ? (
                  <>
                    <img
                      src={photo}
                      alt={`Foto ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={(e) => handleRemovePhoto(index, e)}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center backdrop-blur-md transition-transform active:scale-90"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-bold text-white">
                      #{index + 1}
                    </span>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-1.5 text-zinc-500 group-hover:text-zinc-300">
                    <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-blue-500/10 group-hover:text-blue-400 transition-colors">
                      <Camera className="w-5 h-5 stroke-[1.7]" />
                    </div>
                    <span className="text-[11px] font-medium">Foto {index + 1}</span>
                  </div>
                )}
              </div>
            ))}

            {/* Espacio para la 6ta tarjeta o hint decorativo */}
            <div className="aspect-[3/4] rounded-2xl border border-dashed border-white/5 bg-[#0a0a0e]/50 flex flex-col items-center justify-center p-3 text-center">
              <Plus className="w-6 h-6 text-zinc-700 mb-1" />
              <span className="text-[10px] text-zinc-600 font-medium">
                5 requeridas
              </span>
            </div>
          </div>

          {/* Banner de recomendación */}
          <div className="w-full p-3.5 rounded-2xl bg-[#101116] border border-white/5 flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <p className="text-[12px] text-zinc-300 leading-snug font-normal">
              Los perfiles con <span className="text-white font-semibold">5 fotos</span> reciben <span className="text-pink-400 font-semibold">4x más klicks</span>.
            </p>
          </div>
        </motion.div>

        {/* 3. Botón Continuar (Permite avanzar aunque no se hayan subido para pruebas) */}
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
