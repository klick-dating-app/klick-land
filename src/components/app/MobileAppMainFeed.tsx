"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  SlidersHorizontal,
  BadgeCheck,
  MapPin,
  RotateCcw,
  Sparkles,
  Flame,
  MessageCircle,
  Coffee,
  User,
  ChevronDown,
  Edit3,
  Check,
  ShieldCheck,
  Building2,
  Heart,
  Languages,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Profile {
  id: string;
  name: string;
  nickname: string;
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
    name: "Camila",
    nickname: "cami_v",
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
    name: "Sofía",
    nickname: "sofi_spark",
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
    name: "Valentina",
    nickname: "vale_m",
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
  const [activeTab, setActiveTab] = useState<"feed" | "klicks" | "inbox" | "citas" | "perfil">("feed");
  const [matchAnimation, setMatchAnimation] = useState(false);
  const [dateAnimation, setDateAnimation] = useState(false);

  // Perfil editable del usuario
  const [userProfile, setUserProfile] = useState({
    name: "Alex",
    nickname: "alex_v",
    age: 24,
    height: "5' 10\"",
    bio: "Amante de la música, el aire libre y conversaciones profundas.",
    temple: "Vigente",
    mission: "Sí",
    relationship: "Matrimonio",
  });

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

  const handleDateRequest = () => {
    setDateAnimation(true);
    setTimeout(() => {
      setDateAnimation(false);
      setProfileIndex((prev) => prev + 1);
      setPhotoIndex(0);
    }, 1400);
  };

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center overflow-hidden select-none">
      {/* Contenedor simulador móvil */}
      <div className="w-full max-w-[430px] h-[100dvh] bg-[#070709] text-white flex flex-col justify-between relative overflow-hidden shadow-2xl md:border md:border-zinc-800/80 md:rounded-[40px]">
        
        {/* ================= PESTAÑA FEED ================= */}
        {activeTab === "feed" && (
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
                          ? "bg-[linear-gradient(90deg,#008aff_0%,#7c3aed_24%,#ff007f_48%,#ff1744_72%,#ff8c00_100%)]"
                          : idx < photoIndex
                          ? "bg-white"
                          : "bg-transparent"
                      }`}
                    />
                  </div>
                ))}
              </div>

              {/* Header con Logo y Filtros */}
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-2">
                  <Image
                    src="/matchapp-logo-circular.png"
                    alt="Klick"
                    width={28}
                    height={28}
                    className="rounded-full"
                    priority
                  />
                  <span className="font-extrabold tracking-tight text-base bg-[linear-gradient(90deg,#008aff_0%,#7c3aed_24%,#ff007f_48%,#ff1744_72%,#ff8c00_100%)] bg-clip-text text-transparent">
                    KLICK
                  </span>
                </div>

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
              
              {/* Nombre, Nickname, Edad y Verificación */}
              <div className="flex flex-col gap-0.5 pointer-events-auto">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl sm:text-[27px] font-semibold tracking-tight text-white drop-shadow-md">
                    {currentProfile.name}, {currentProfile.age}
                  </h2>
                  {currentProfile.verified && (
                    <BadgeCheck className="w-5 h-5 fill-blue-500 text-white shrink-0 shadow-sm" />
                  )}
                </div>

                {/* Nickname / Alias del usuario */}
                <span className="text-[12px] sm:text-[13px] text-blue-400 font-medium tracking-wide mb-0.5">
                  @{currentProfile.nickname}
                </span>

                {/* Ubicación */}
                <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
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

              {/* Hint de navegación */}
              <div className="flex items-center justify-center gap-1 text-[10.5px] text-zinc-400 font-normal">
                <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
                <span>Toca los lados para fotos · Pulsa Klick para conectar</span>
              </div>

              {/* Botones Flotantes de Acción: Pasar (Izq), Klick (Centro - Más Grande), Date (Der - Taza Neutral) */}
              <div className="flex items-center justify-center gap-8 sm:gap-10 pt-2 pointer-events-auto">
                {/* 1. Botón Pasar (Izquierda) */}
                <button
                  type="button"
                  onClick={handlePass}
                  className="w-12 h-12 flex items-center justify-center text-zinc-400 hover:text-white active:scale-90 transition-all cursor-pointer group"
                  title="Siguiente perfil"
                >
                  <RotateCcw className="w-8 h-8 stroke-[2.2] group-hover:-rotate-45 transition-transform duration-200 drop-shadow-md" />
                </button>

                {/* 2. Botón Principal Klick (Centro - Más Grande) */}
                <button
                  type="button"
                  onClick={handleLike}
                  className="w-13 h-13 flex items-center justify-center active:scale-90 transition-all cursor-pointer group"
                  title="Dar Klick"
                >
                  <Image
                    src="/matchapp-logo-circular.png"
                    alt="Klick"
                    width={46}
                    height={46}
                    className="rounded-full object-contain filter drop-shadow-xl group-hover:scale-110 transition-transform duration-200"
                  />
                </button>

                {/* 3. Botón Date / Cita (Derecha - Taza en tono neutro blanco/zinc) */}
                <button
                  type="button"
                  onClick={handleDateRequest}
                  className="w-12 h-12 flex items-center justify-center text-zinc-400 hover:text-white active:scale-90 transition-all cursor-pointer group"
                  title="Invitar a una Date"
                >
                  <Coffee className="w-8 h-8 stroke-[2.2] group-hover:scale-110 transition-transform duration-200 drop-shadow-md" />
                </button>
              </div>

            </div>

            {/* Animación de Match o Date */}
            <AnimatePresence>
              {matchAnimation && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center text-center p-6"
                >
                  <motion.div
                    initial={{ rotate: -15, scale: 0.8 }}
                    animate={{ rotate: 0, scale: 1 }}
                    className="w-24 h-24 rounded-full bg-white/10 border border-white/20 flex items-center justify-center p-3 shadow-2xl mb-4"
                  >
                    <Image
                      src="/matchapp-logo-circular.png"
                      alt="Klick Match"
                      width={70}
                      height={70}
                      className="rounded-full object-contain"
                    />
                  </motion.div>
                  <h2 className="text-3xl font-black tracking-wider text-white mb-1 uppercase">
                    ¡Hiciste Klick!
                  </h2>
                  <p className="text-sm text-zinc-300 font-medium">
                    Tú y {currentProfile.name} se han gustado mutuamente.
                  </p>
                </motion.div>
              )}

              {dateAnimation && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center text-center p-6"
                >
                  <motion.div
                    initial={{ scale: 0.8, rotate: -15 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="w-24 h-24 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white shadow-2xl mb-4 animate-pulse"
                  >
                    <Coffee className="w-13 h-13 stroke-[2]" />
                  </motion.div>
                  <h2 className="text-3xl font-black tracking-wider text-white mb-1 uppercase">
                    ¡Invitación a Date!
                  </h2>
                  <p className="text-sm text-zinc-300 font-medium">
                    Le has enviado una propuesta de cita a {currentProfile.name}.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* ================= PESTAÑA KLICKS ================= */}
        {activeTab === "klicks" && (
          <div className="flex-1 w-full px-6 pt-14 pb-4 overflow-y-auto no-scrollbar flex flex-col">
            <h1 className="text-2xl font-bold uppercase tracking-tight mb-1">Tus Klicks</h1>
            <p className="text-xs text-zinc-400 mb-6">Personas que ya te han dado Klick</p>

            <div className="grid grid-cols-2 gap-3">
              {[
                { name: "Lucía, 22", img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80" },
                { name: "Andrea, 24", img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80" },
                { name: "Elena, 23", img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=400&q=80" },
              ].map((item, i) => (
                <div key={i} className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 group cursor-pointer">
                  <Image src={item.img} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <span className="absolute bottom-2 left-2.5 text-xs font-bold text-white">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= PESTAÑA INBOX ================= */}
        {activeTab === "inbox" && (
          <div className="flex-1 w-full px-6 pt-14 pb-4 overflow-y-auto no-scrollbar flex flex-col">
            <h1 className="text-2xl font-bold uppercase tracking-tight mb-1">Mensajes</h1>
            <p className="text-xs text-zinc-400 mb-6">Conversaciones con tus matches</p>

            <div className="flex flex-col gap-3">
              <div className="p-3.5 rounded-2xl bg-[#0e0f15] border border-white/5 flex items-center gap-3 cursor-pointer hover:bg-white/5 transition-colors">
                <div className="w-12 h-12 rounded-full overflow-relative relative">
                  <Image src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" alt="Camila" fill className="rounded-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Camila</span>
                    <span className="text-[10px] text-zinc-400">12:30</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 truncate">¡Hola! ¿Cómo va tu semana?</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= PESTAÑA CITAS ================= */}
        {activeTab === "citas" && (
          <div className="flex-1 w-full px-6 pt-14 pb-4 overflow-y-auto no-scrollbar flex flex-col">
            <h1 className="text-2xl font-bold uppercase tracking-tight mb-1">Citas y Planes</h1>
            <p className="text-xs text-zinc-400 mb-6">Ideas de citas seguras e invitaciones activas</p>

            <div className="p-4 rounded-2xl bg-[#0e0f15] border border-white/10 flex flex-col gap-3 mb-4">
              <div className="flex items-center gap-2 text-pink-400 font-bold text-xs">
                <Coffee className="w-4 h-4" />
                <span>Primera Cita Segura</span>
              </div>
              <p className="text-xs text-zinc-300">
                Comparte tu ubicación en tiempo real con un contacto de confianza al salir en tu primera cita.
              </p>
            </div>
          </div>
        )}

        {/* ================= PESTAÑA PERFIL ================= */}
        {activeTab === "perfil" && (
          <div className="flex-1 w-full px-6 pt-14 pb-4 overflow-y-auto no-scrollbar flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold uppercase tracking-tight">Tu Perfil</h1>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                100% Completo
              </span>
            </div>

            {/* Foto de Perfil */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative w-24 h-24 rounded-full p-[2px] bg-[linear-gradient(135deg,#008aff_0%,#7c3aed_35%,#ff007f_70%,#ff8c00_100%)] shadow-lg shadow-blue-500/20 mb-2">
                <div className="w-full h-full rounded-full overflow-hidden relative">
                  <Image
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
                    alt="Perfil"
                    fill
                    className="object-cover"
                  />
                </div>
                <button
                  type="button"
                  className="absolute bottom-0 right-0 p-1.5 bg-blue-600 rounded-full text-white border-2 border-black cursor-pointer hover:bg-blue-500 transition-colors"
                  title="Editar foto"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
              <h2 className="text-lg font-semibold text-white">{userProfile.name}, {userProfile.age}</h2>
              <span className="text-xs text-blue-400 font-medium">@{userProfile.nickname}</span>
              <p className="text-xs text-zinc-400 mt-0.5">Estatura: {userProfile.height}</p>
            </div>

            {/* Datos Editables */}
            <div className="space-y-3 pb-6">
              <div className="p-3.5 rounded-2xl bg-[#0e0f15] border border-white/10 flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-zinc-400 uppercase">Apodo / Nickname</span>
                <p className="text-xs text-blue-400 font-medium">@{userProfile.nickname}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0e0f15] border border-white/10 flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-zinc-400 uppercase">Biografía</span>
                <p className="text-xs text-zinc-200">{userProfile.bio}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0e0f15] border border-white/10 flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-blue-400 uppercase">Espiritualidad</span>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Recomendación para el templo</span>
                  <span className="font-semibold text-white">{userProfile.temple}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Misión servida</span>
                  <span className="font-semibold text-white">{userProfile.mission}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0e0f15] border border-white/10 flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-pink-400 uppercase">Metas e Intenciones</span>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Meta de relación</span>
                  <span className="font-semibold text-white">{userProfile.relationship}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. Bottom Navigation Bar (5 Pestañas con color Azul Activo) */}
        <div className="w-full bg-[#08080c] border-t border-white/5 px-4 py-2.5 flex items-center justify-around z-30">
          {/* Feed */}
          <button
            type="button"
            onClick={() => setActiveTab("feed")}
            className={`flex flex-col items-center gap-1 relative cursor-pointer transition-colors ${
              activeTab === "feed" ? "text-blue-500" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Flame className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Feed</span>
            {activeTab === "feed" && (
              <div className="w-4 h-0.5 rounded-full bg-blue-500 absolute -bottom-1" />
            )}
          </button>

          {/* Klicks con Icono de Corazón y Badge 3 */}
          <button
            type="button"
            onClick={() => setActiveTab("klicks")}
            className={`flex flex-col items-center gap-1 relative cursor-pointer transition-colors ${
              activeTab === "klicks" ? "text-blue-500" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <div className="relative">
              <Heart className="w-5 h-5" />
              <span className="absolute -top-1.5 -right-2.5 w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center border border-black">
                3
              </span>
            </div>
            <span className="text-[10px] font-semibold">Klicks</span>
            {activeTab === "klicks" && (
              <div className="w-4 h-0.5 rounded-full bg-blue-500 absolute -bottom-1" />
            )}
          </button>

          {/* Inbox */}
          <button
            type="button"
            onClick={() => setActiveTab("inbox")}
            className={`flex flex-col items-center gap-1 relative cursor-pointer transition-colors ${
              activeTab === "inbox" ? "text-blue-500" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Inbox</span>
            {activeTab === "inbox" && (
              <div className="w-4 h-0.5 rounded-full bg-blue-500 absolute -bottom-1" />
            )}
          </button>

          {/* Citas con Icono de Date / Coffee */}
          <button
            type="button"
            onClick={() => setActiveTab("citas")}
            className={`flex flex-col items-center gap-1 relative cursor-pointer transition-colors ${
              activeTab === "citas" ? "text-blue-500" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Coffee className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Citas</span>
            {activeTab === "citas" && (
              <div className="w-4 h-0.5 rounded-full bg-blue-500 absolute -bottom-1" />
            )}
          </button>

          {/* Perfil */}
          <button
            type="button"
            onClick={() => setActiveTab("perfil")}
            className={`flex flex-col items-center gap-1 relative cursor-pointer transition-colors ${
              activeTab === "perfil" ? "text-blue-500" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Perfil</span>
            {activeTab === "perfil" && (
              <div className="w-4 h-0.5 rounded-full bg-blue-500 absolute -bottom-1" />
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
