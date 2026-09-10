"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  SlidersHorizontal,
  BadgeCheck,
  MapPin,
  X,
  Heart,
  Flame,
  MessageCircle,
  BookOpen,
  User,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Profile {
  id: string;
  name: string;
  age: number;
  location: string;
  distance: string;
  verified: boolean;
  photos: string[];
  icebreaker: {
    question: string;
    answer: string;
  };
  details: {
    temple: string;
    height: string;
    mission: string;
  };
}

const SAMPLE_PROFILES: Profile[] = [
  {
    id: "1",
    name: "CAMILA",
    age: 24,
    location: "Provo, Utah",
    distance: "a 4 km",
    verified: true,
    photos: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
    ],
    icebreaker: {
      question: "¿Cómo describirías tu domingo ideal?",
      answer: "Conferencia por la mañana, pan casero y una llamada larga con mi abuela.",
    },
    details: {
      temple: "Recomendación vigente",
      height: "5' 6\"",
      mission: "Sirvió en Madrid, España",
    },
  },
  {
    id: "2",
    name: "SOFÍA",
    age: 23,
    location: "Salt Lake City, UT",
    distance: "a 12 km",
    verified: true,
    photos: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80",
    ],
    icebreaker: {
      question: "Mi idea de una primera cita inolvidable...",
      answer: "Ir por un helado artesanal, escuchar música acústica y reírnos de cualquier tontería.",
    },
    details: {
      temple: "Recomendación vigente",
      height: "5' 4\"",
      mission: "Sirvió en Santiago, Chile",
    },
  },
  {
    id: "3",
    name: "VALENTINA",
    age: 25,
    location: "Orem, Utah",
    distance: "a 6 km",
    verified: true,
    photos: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
    ],
    icebreaker: {
      question: "¿Cuál es tu lenguaje de amor no oficial?",
      answer: "Compartir comida rica y mandarnos memes que solo nosotros entendemos.",
    },
    details: {
      temple: "Recomendación vigente",
      height: "5' 7\"",
      mission: "Sirvió en Ciudad de México",
    },
  },
];

export default function MobileAppMainFeed() {
  const [profileIndex, setProfileIndex] = useState(0);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"feed" | "likes" | "inbox" | "aprende" | "perfil">("feed");
  const [matchAnimation, setMatchAnimation] = useState(false);

  const currentProfile = SAMPLE_PROFILES[profileIndex % SAMPLE_PROFILES.length];

  const handleNextPhoto = () => {
    if (photoIndex < currentProfile.photos.length - 1) {
      setPhotoIndex((prev) => prev + 1);
    } else {
      setPhotoIndex(0);
    }
  };

  const handlePrevPhoto = () => {
    if (photoIndex > 0) {
      setPhotoIndex((prev) => prev - 1);
    }
  };

  const handlePass = () => {
    setProfileIndex((prev) => prev + 1);
    setPhotoIndex(0);
  };

  const handleLike = () => {
    setMatchAnimation(true);
    setTimeout(() => {
      setMatchAnimation(false);
      setProfileIndex((prev) => prev + 1);
      setPhotoIndex(0);
    }, 1200);
  };

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center overflow-hidden select-none">
      {/* Contenedor simulador móvil */}
      <div className="w-full max-w-[430px] h-[100dvh] bg-[#070709] text-white flex flex-col justify-between relative overflow-hidden shadow-2xl md:border md:border-zinc-800/80 md:rounded-[40px]">
        
        {/* Main Feed Card */}
        <div className="relative flex-1 w-full overflow-hidden bg-zinc-950 flex flex-col justify-between">
          
          {/* Imagen de fondo del perfil */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-300"
            style={{ backgroundImage: `url(${currentProfile.photos[photoIndex]})` }}
          >
            {/* Gradientes de superposición cinematográfica */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/95" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-[#070709]/40 to-transparent" />
          </div>

          {/* 1. Header superior del Feed */}
          <div className="relative z-20 px-4 pt-12 flex flex-col gap-2">
            {/* Barra de progreso de fotos de la persona */}
            <div className="w-full flex items-center gap-1.5">
              {currentProfile.photos.map((_, idx) => (
                <div
                  key={idx}
                  className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden"
                >
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      idx === photoIndex
                        ? "bg-gradient-to-r from-pink-500 to-amber-400"
                        : idx < photoIndex
                        ? "bg-white"
                        : "bg-transparent"
                    }`}
                  />
                </div>
              ))}
            </div>

            {/* Botón de filtros / ajustes en la esquina derecha */}
            <div className="flex items-center justify-end">
              <button
                type="button"
                className="w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 flex items-center justify-center text-zinc-300 backdrop-blur-md transition-transform active:scale-95 cursor-pointer"
                title="Filtros"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Zona táctil para cambiar fotos (izquierda / derecha) */}
          <div className="absolute inset-0 z-10 flex">
            <div className="w-1/2 h-full cursor-pointer" onClick={handlePrevPhoto} />
            <div className="w-1/2 h-full cursor-pointer" onClick={handleNextPhoto} />
          </div>

          {/* 2. Información del perfil y Icebreaker */}
          <div className="relative z-20 px-5 pb-4 flex flex-col gap-3 pointer-events-none">
            
            {/* Nombre, edad y verificación */}
            <div className="flex flex-col gap-1 pointer-events-auto">
              <div className="flex items-center gap-2">
                <h2 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-md">
                  {currentProfile.name}, {currentProfile.age}
                </h2>
                {currentProfile.verified && (
                  <BadgeCheck className="w-6 h-6 fill-blue-500 text-white shrink-0 shadow-sm" />
                )}
              </div>

              {/* Ubicación */}
              <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-medium">
                <MapPin className="w-3.5 h-3.5 text-pink-500" />
                <span>
                  {currentProfile.location} · {currentProfile.distance}
                </span>
              </div>
            </div>

            {/* Tarjeta Icebreaker */}
            <div className="p-3.5 rounded-2xl bg-[#0c0d12]/90 border border-white/10 backdrop-blur-xl shadow-lg pointer-events-auto">
              <p className="text-[11px] font-bold text-blue-400 mb-1">
                {currentProfile.icebreaker.question}
              </p>
              <p className="text-xs sm:text-[12.5px] text-zinc-100 font-medium leading-relaxed">
                {currentProfile.icebreaker.answer}
              </p>
            </div>

            {/* Hint de deslizamiento */}
            <div className="flex items-center justify-center gap-1 text-[10.5px] text-zinc-400 font-normal">
              <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
              <span>Desliza hacia abajo para pasar · toca a la derecha para más fotos</span>
            </div>

            {/* Botones Flotantes de Acción (X y Corazón) */}
            <div className="flex items-center justify-center gap-6 pt-1 pointer-events-auto">
              {/* Botón Dislike (X) */}
              <button
                type="button"
                onClick={handlePass}
                className="w-14 h-14 rounded-full bg-[#12131a]/90 hover:bg-[#181a24] active:scale-90 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white shadow-xl backdrop-blur-md transition-all cursor-pointer"
                title="Pasar"
              >
                <X className="w-6 h-6 stroke-[2.5]" />
              </button>

              {/* Botón Like (Corazón) */}
              <button
                type="button"
                onClick={handleLike}
                className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-600 via-rose-500 to-amber-500 active:scale-90 flex items-center justify-center text-white shadow-xl shadow-pink-500/30 transition-all cursor-pointer"
                title="Hacer Klick"
              >
                <Heart className="w-7 h-7 fill-white stroke-none drop-shadow-md" />
              </button>
            </div>

          </div>

          {/* Animación de Match */}
          <AnimatePresence>
            {matchAnimation && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center text-center p-6"
              >
                <motion.div
                  initial={{ rotate: -15 }}
                  animate={{ rotate: 0 }}
                  className="w-20 h-20 rounded-full bg-[linear-gradient(135deg,#008aff_0%,#ff007f_50%,#ff8c00_100%)] flex items-center justify-center text-white shadow-2xl shadow-pink-500/40 mb-4"
                >
                  <Heart className="w-10 h-10 fill-white stroke-none" />
                </motion.div>
                <h2 className="text-3xl font-black tracking-wider text-white mb-1 uppercase">
                  ¡Hiciste Klick!
                </h2>
                <p className="text-sm text-zinc-300 font-medium">
                  Tú y {currentProfile.name} se han gustado mutuamente.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* 3. Bottom Navigation Bar (5 Pestañas) */}
        <div className="w-full bg-[#08080c] border-t border-white/5 px-4 py-2.5 flex items-center justify-around z-30">
          {/* Feed */}
          <button
            type="button"
            onClick={() => setActiveTab("feed")}
            className={`flex flex-col items-center gap-1 relative cursor-pointer ${
              activeTab === "feed" ? "text-pink-500" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Flame className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Feed</span>
            {activeTab === "feed" && (
              <div className="w-4 h-0.5 rounded-full bg-pink-500 absolute -bottom-1" />
            )}
          </button>

          {/* Likes con Badge 3 */}
          <button
            type="button"
            onClick={() => setActiveTab("likes")}
            className={`flex flex-col items-center gap-1 relative cursor-pointer ${
              activeTab === "likes" ? "text-pink-500" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <div className="relative">
              <Heart className="w-5 h-5" />
              <span className="absolute -top-1.5 -right-2.5 w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center border border-black">
                3
              </span>
            </div>
            <span className="text-[10px] font-semibold">Likes</span>
            {activeTab === "likes" && (
              <div className="w-4 h-0.5 rounded-full bg-pink-500 absolute -bottom-1" />
            )}
          </button>

          {/* Inbox */}
          <button
            type="button"
            onClick={() => setActiveTab("inbox")}
            className={`flex flex-col items-center gap-1 relative cursor-pointer ${
              activeTab === "inbox" ? "text-pink-500" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Inbox</span>
            {activeTab === "inbox" && (
              <div className="w-4 h-0.5 rounded-full bg-pink-500 absolute -bottom-1" />
            )}
          </button>

          {/* Aprende */}
          <button
            type="button"
            onClick={() => setActiveTab("aprende")}
            className={`flex flex-col items-center gap-1 relative cursor-pointer ${
              activeTab === "aprende" ? "text-pink-500" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Aprende</span>
            {activeTab === "aprende" && (
              <div className="w-4 h-0.5 rounded-full bg-pink-500 absolute -bottom-1" />
            )}
          </button>

          {/* Perfil */}
          <button
            type="button"
            onClick={() => setActiveTab("perfil")}
            className={`flex flex-col items-center gap-1 relative cursor-pointer ${
              activeTab === "perfil" ? "text-pink-500" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Perfil</span>
            {activeTab === "perfil" && (
              <div className="w-4 h-0.5 rounded-full bg-pink-500 absolute -bottom-1" />
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
