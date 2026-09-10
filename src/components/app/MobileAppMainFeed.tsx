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
  ChevronLeft,
  Edit3,
  Check,
  ShieldCheck,
  Building2,
  Heart,
  Languages,
  Send,
  Camera,
  Search,
  CheckCheck,
  Navigation,
  Lock,
  Plus,
  Settings,
  Bell,
  X,
  Calendar,
  Share2,
  Info,
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
  compatibility: number;
  bio: string;
  photos: string[];
  icebreakers: Array<{
    question: string;
    answer: string;
  }>;
  details: {
    temple: string;
    height: string;
    mission: string;
    churchAttendance: string;
    relationshipGoal: string;
    childrenGoal: string;
    languages: string;
    values: string[];
    interests: string[];
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
    compatibility: 96,
    bio: "Diseñadora y apasionada de la música acústica. Me encanta aprender cosas nuevas, cocinar los domingos y pasar tiempo con personas con metas claras.",
    photos: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
    ],
    icebreakers: [
      {
        question: "¿Cuál es tu lenguaje de amor no oficial?",
        answer: "Café por la mañana, detalles inesperados y miradas con complicidad.",
      },
      {
        question: "Mi idea de una primera cita inolvidable...",
        answer: "Paseo tranquilo, una buena conversación sobre metas de vida y helado artesanal.",
      },
      {
        question: "¿Cómo describirías tu domingo ideal juntos?",
        answer: "Conferencia por la mañana, comida casera y caminata al atardecer.",
      },
    ],
    details: {
      temple: "Recomendación vigente",
      height: "5' 6\"",
      mission: "Sirvió en Madrid, España",
      churchAttendance: "Cada semana",
      relationshipGoal: "Matrimonio",
      childrenGoal: "Quiero hijos",
      languages: "Español e Inglés",
      values: ["Fe y devoción", "Familia", "Lealtad", "Humor"],
      interests: ["Templo", "Música", "Senderismo", "Fotografía", "Cocina"],
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
    compatibility: 92,
    bio: "Estudiante de Comunicación. Fan de los museos, los viajes espontáneos y los atardeceres en las montañas.",
    photos: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80",
    ],
    icebreakers: [
      {
        question: "Un secreto o dato curioso para hacerme sonreír...",
        answer: "Sé tocar el violín y me sé todos los diálogos de las películas clásicas.",
      },
      {
        question: "Lo primero que noto en alguien y me hace hacer klick...",
        answer: "Una sonrisa honesta y que hable con pasión sobre lo que ama.",
      },
    ],
    details: {
      temple: "Recomendación vigente",
      height: "5' 4\"",
      mission: "Sirvió en Santiago, Chile",
      churchAttendance: "Cada semana",
      relationshipGoal: "Matrimonio",
      childrenGoal: "Quiero hijos",
      languages: "Español e Inglés",
      values: ["Honestidad", "Servicio", "Crecimiento"],
      interests: ["Arte", "Música", "Viajes", "Lectura"],
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
    compatibility: 89,
    bio: "Arquitecta. Me apasiona el diseño sostenible, el fitness y cocinar para mis amigos.",
    photos: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
    ],
    icebreakers: [
      {
        question: "¿Cuál es tu lenguaje de amor no oficial?",
        answer: "Compartir comida rica y mandarnos memes que solo nosotros entendemos.",
      },
    ],
    details: {
      temple: "Recomendación vigente",
      height: "5' 7\"",
      mission: "Sirvió en Ciudad de México",
      churchAttendance: "Cada semana",
      relationshipGoal: "Noviazgo serio hacia matrimonio",
      childrenGoal: "Aún no sé",
      languages: "Español",
      values: ["Lealtad", "Autenticidad", "Superación"],
      interests: ["Arquitectura", "Fitness / Gym", "Café", "Playa"],
    },
  },
];

export default function MobileAppMainFeed() {
  const [profileIndex, setProfileIndex] = useState(0);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"feed" | "klicks" | "inbox" | "citas" | "perfil">("feed");
  const [matchAnimation, setMatchAnimation] = useState(false);
  const [dateAnimation, setDateAnimation] = useState(false);

  // Chat activo en la pestaña Inbox
  const [activeChatProfile, setActiveChatProfile] = useState<Profile | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "me" | "them"; text: string; time: string }>>([
    { sender: "them", text: "¡Hola! Vi que también serviste en España, qué lindo recuerdo ✨", time: "12:30" },
    { sender: "me", text: "¡Hola Camila! Sí, fue una experiencia inolvidable. ¿Cómo estuvo tu semana?", time: "12:32" },
  ]);
  const [typedMessage, setTypedMessage] = useState("");

  // Perfil editable del usuario conectado
  const [userProfile, setUserProfile] = useState({
    name: "Kevin",
    nickname: "kevin_m",
    age: 24,
    height: "5' 10\"",
    bio: "Ingeniero de software, apasionado por el piano, el senderismo en las montañas y las buenas conversaciones.",
    temple: "Vigente",
    mission: "Sí",
    churchAttendance: "Cada semana",
    relationship: "Matrimonio",
    children: "Quiero hijos",
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Estado de Primera Cita Segura
  const [safeDateActive, setSafeDateActive] = useState(false);

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
    }, 1300);
  };

  const handleDateRequest = () => {
    setDateAnimation(true);
    setTimeout(() => {
      setDateAnimation(false);
      setProfileIndex((prev) => prev + 1);
      setPhotoIndex(0);
    }, 1400);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;
    const newMsg = {
      sender: "me" as const,
      text: typedMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setChatMessages((prev) => [...prev, newMsg]);
    setTypedMessage("");

    // Respuesta simulada automática
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "them",
          text: "¡Totalmente de acuerdo! ¿Te gustaría que vayamos por un café esta semana? ☕",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center overflow-hidden select-none">
      {/* Contenedor simulador móvil */}
      <div className="w-full max-w-[430px] h-[100dvh] bg-[#070709] text-white flex flex-col justify-between relative overflow-hidden shadow-2xl md:border md:border-zinc-800/80 md:rounded-[40px]">
        
        {/* ========================================================= */}
        {/* 1. PESTAÑA FEED (Scrollable Completo y Navegación Suave) */}
        {/* ========================================================= */}
        {activeTab === "feed" && (
          <div className="relative flex-1 w-full overflow-y-auto no-scrollbar flex flex-col justify-between bg-zinc-950">
            
            {/* Header Flotante del Feed con Logo y Filtros */}
            <div className="sticky top-0 z-30 w-full px-4 pt-11 pb-2 bg-gradient-to-b from-black/90 via-black/60 to-transparent backdrop-blur-md flex flex-col gap-2">
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

              {/* Logo y Botón de Ajustes */}
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

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/20">
                    {currentProfile.compatibility}% Compatible
                  </span>
                  <button
                    type="button"
                    className="w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 flex items-center justify-center text-zinc-300 backdrop-blur-md transition-transform active:scale-95 cursor-pointer"
                    title="Filtros"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Tarjeta de Foto Principal con Zonas Táctiles */}
            <div className="relative w-full aspect-[4/5] shrink-0 overflow-hidden -mt-16">
              <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-300"
                style={{ backgroundImage: `url(${currentProfile.photos[photoIndex]})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90" />
              </div>

              {/* Zonas táctiles para pasar fotos */}
              <div className="absolute inset-0 z-10 flex">
                <div className="w-1/2 h-full cursor-pointer" onClick={handlePrevPhoto} />
                <div className="w-1/2 h-full cursor-pointer" onClick={handleNextPhoto} />
              </div>

              {/* Nombre y datos rápidos superpuestos al pie de la foto */}
              <div className="absolute bottom-4 left-5 right-5 z-20 pointer-events-none flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl sm:text-[28px] font-semibold tracking-tight text-white drop-shadow-lg">
                    {currentProfile.name}, {currentProfile.age}
                  </h2>
                  {currentProfile.verified && (
                    <BadgeCheck className="w-5 h-5 fill-blue-500 text-white shrink-0 shadow-sm" />
                  )}
                </div>

                <span className="text-[12px] sm:text-[13px] text-blue-400 font-medium tracking-wide">
                  @{currentProfile.nickname}
                </span>

                <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-medium mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  <span>
                    {currentProfile.location} · {currentProfile.distance}
                  </span>
                </div>
              </div>
            </div>

            {/* Hint de deslizamiento */}
            <div className="flex items-center justify-center gap-1.5 py-2 text-[11px] text-zinc-400 font-normal bg-[#070709]">
              <ChevronDown className="w-3.5 h-3.5 animate-bounce text-blue-400" />
              <span>Desliza hacia abajo para ver perfil completo</span>
            </div>

            {/* Sección de Información Detallada del Perfil (Scrollable) */}
            <div className="px-5 py-4 flex flex-col gap-5 bg-[#070709] pb-28">
              
              {/* Biografía */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">
                  Sobre mí
                </span>
                <p className="text-xs sm:text-[13px] text-zinc-200 leading-relaxed font-normal">
                  {currentProfile.bio}
                </p>
              </div>

              {/* Preguntas Icebreakers */}
              <div className="flex flex-col gap-3">
                <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">
                  Icebreakers
                </span>
                {currentProfile.icebreakers.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-[#0e0f15] border border-white/5 flex flex-col gap-1.5"
                  >
                    <p className="text-[11px] font-semibold text-blue-300">
                      {item.question}
                    </p>
                    <p className="text-xs sm:text-[12.5px] text-zinc-100 font-normal leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>

              {/* Espiritualidad y Valores */}
              <div className="flex flex-col gap-2.5">
                <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">
                  Espiritualidad y Valores
                </span>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-blue-600/15 border border-blue-500/30 text-blue-300 text-xs font-semibold">
                    {currentProfile.details.temple}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-xs font-medium">
                    {currentProfile.details.mission}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-xs font-medium">
                    {currentProfile.details.churchAttendance}
                  </span>
                  {currentProfile.details.values.map((v, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-xs font-medium">
                      {v}
                    </span>
                  ))}
                </div>
              </div>

              {/* Familia e Intenciones */}
              <div className="flex flex-col gap-2.5">
                <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">
                  Metas de Relación
                </span>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-blue-600/15 border border-blue-500/30 text-blue-300 text-xs font-semibold">
                    {currentProfile.details.relationshipGoal}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-xs font-medium">
                    {currentProfile.details.childrenGoal}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-xs font-medium">
                    Estatura: {currentProfile.details.height}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-xs font-medium">
                    Idiomas: {currentProfile.details.languages}
                  </span>
                </div>
              </div>

              {/* Intereses */}
              <div className="flex flex-col gap-2.5">
                <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">
                  Intereses y Pasatiempos
                </span>
                <div className="flex flex-wrap gap-2">
                  {currentProfile.details.interests.map((interest, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-[#12131a] border border-white/5 text-zinc-300 text-xs font-medium">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              {/* Galería adicional de fotos */}
              {currentProfile.photos.length > 1 && (
                <div className="flex flex-col gap-2.5">
                  <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">
                    Fotos de {currentProfile.name}
                  </span>
                  <div className="grid grid-cols-2 gap-2.5">
                    {currentProfile.photos.slice(1).map((photo, i) => (
                      <div key={i} className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10">
                        <Image src={photo} alt={currentProfile.name} fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Barra Flotante de Acciones Fija al Pie: Pasar (Izq), Klick (Centro - Grande), Date (Der) */}
            <div className="sticky bottom-0 z-30 w-full px-6 py-2 bg-transparent flex items-center justify-center gap-10 sm:gap-12">
              {/* 1. Botón Pasar (Izquierda) */}
              <button
                type="button"
                onClick={handlePass}
                className="w-12 h-12 flex items-center justify-center text-zinc-400 hover:text-white active:scale-90 transition-all cursor-pointer group"
                title="Siguiente perfil"
              >
                <RotateCcw className="w-8 h-8 stroke-[2.2] group-hover:-rotate-45 transition-transform duration-200 drop-shadow-md" />
              </button>

              {/* 2. Botón Principal Klick (Centro - Grande y Destacado sin fondo oscuro) */}
              <button
                type="button"
                onClick={handleLike}
                className="w-14 h-14 flex items-center justify-center active:scale-90 transition-all cursor-pointer group"
                title="Dar Klick"
              >
                <Image
                  src="/5297951-7905525-Photoroom.png"
                  alt="Klick"
                  width={52}
                  height={52}
                  className="object-contain filter drop-shadow-lg group-hover:scale-110 transition-transform duration-200"
                />
              </button>

              {/* 3. Botón Date / Cita (Derecha - Taza en tono neutro) */}
              <button
                type="button"
                onClick={handleDateRequest}
                className="w-12 h-12 flex items-center justify-center text-zinc-400 hover:text-white active:scale-90 transition-all cursor-pointer group"
                title="Invitar a una Date"
              >
                <Coffee className="w-8 h-8 stroke-[2.2] group-hover:scale-110 transition-transform duration-200 drop-shadow-md" />
              </button>
            </div>

            {/* Modales de Animación */}
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

        {/* ========================================================= */}
        {/* 2. PESTAÑA KLICKS (Tus Likes recibidos con interactividad) */}
        {/* ========================================================= */}
        {activeTab === "klicks" && (
          <div className="flex-1 w-full px-5 pt-12 pb-4 overflow-y-auto no-scrollbar flex flex-col bg-[#070709]">
            <div className="flex items-center justify-between mb-1">
              <h1 className="text-2xl font-bold uppercase tracking-tight text-white">Tus Klicks</h1>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-600 text-white">
                3 Nuevos
              </span>
            </div>
            <p className="text-xs text-zinc-400 mb-5">
              Personas que ya te dieron Klick y quieren conectar contigo.
            </p>

            {/* Filtros rápidos */}
            <div className="flex items-center gap-2 mb-4 overflow-x-auto no-scrollbar">
              {["Todos (3)", "Cerca de ti (2)", "Alta afinidad (1)"].map((filter, i) => (
                <button
                  key={i}
                  type="button"
                  className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 transition-colors ${
                    i === 0
                      ? "bg-blue-600 text-white font-semibold"
                      : "bg-[#12131a] hover:bg-[#181a24] text-zinc-400"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Cuadrícula de perfiles que te dieron Klick */}
            <div className="grid grid-cols-2 gap-3.5 pb-6">
              {[
                {
                  name: "Lucía, 22",
                  nickname: "@luci_fit",
                  dist: "a 3 km",
                  match: "97%",
                  img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80",
                },
                {
                  name: "Andrea, 24",
                  nickname: "@andy_art",
                  dist: "a 5 km",
                  match: "94%",
                  img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=80",
                },
                {
                  name: "Elena, 23",
                  nickname: "@elena_provo",
                  dist: "a 8 km",
                  match: "91%",
                  img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=500&q=80",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 group shadow-lg bg-[#0e0f15]"
                >
                  <Image src={item.img} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  
                  {/* Badge de afinidad */}
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-blue-600/90 text-white text-[10px] font-bold backdrop-blur-md">
                    {item.match} match
                  </span>

                  {/* Info al pie */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between">
                    <div>
                      <span className="block text-xs font-bold text-white leading-tight">{item.name}</span>
                      <span className="block text-[10px] text-zinc-300">{item.dist}</span>
                    </div>

                    {/* Botón rápido para hacer Klick de vuelta */}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("feed");
                        handleLike();
                      }}
                      className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center active:scale-90 transition-transform shadow-md"
                      title="Hacer Klick de vuelta"
                    >
                      <Image src="/matchapp-logo-circular.png" alt="Klick" width={20} height={20} className="rounded-full" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 3. PESTAÑA INBOX (Mensajes + Chat Interactivo Completo) */}
        {/* ========================================================= */}
        {activeTab === "inbox" && (
          <div className="flex-1 w-full flex flex-col bg-[#070709] overflow-hidden">
            {!activeChatProfile ? (
              /* Vista Lista de Conversaciones */
              <div className="flex-1 w-full px-5 pt-12 pb-4 overflow-y-auto no-scrollbar flex flex-col">
                <h1 className="text-2xl font-bold uppercase tracking-tight text-white mb-1">Mensajes</h1>
                <p className="text-xs text-zinc-400 mb-5">Conversaciones con tus matches activos.</p>

                {/* Burbujas de Matches Nuevos */}
                <div className="flex flex-col gap-2 mb-6">
                  <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">
                    Nuevos Matches
                  </span>
                  <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
                    {SAMPLE_PROFILES.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setActiveChatProfile(p)}
                        className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group"
                      >
                        <div className="w-14 h-14 rounded-full p-[2px] bg-blue-600 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                          <div className="w-full h-full rounded-full overflow-hidden relative">
                            <Image src={p.photos[0]} alt={p.name} fill className="object-cover" />
                          </div>
                        </div>
                        <span className="text-[11px] font-semibold text-zinc-300">{p.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Lista de Chats */}
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider mb-1">
                    Conversaciones
                  </span>

                  {SAMPLE_PROFILES.map((p, i) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setActiveChatProfile(p)}
                      className="p-3.5 rounded-2xl bg-[#0e0f15] hover:bg-[#141620] border border-white/5 flex items-center gap-3 cursor-pointer transition-colors text-left"
                    >
                      <div className="w-12 h-12 rounded-full overflow-hidden relative shrink-0">
                        <Image src={p.photos[0]} alt={p.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-xs font-bold text-white truncate">{p.name}</span>
                          <span className="text-[10px] text-zinc-500">12:3{i}</span>
                        </div>
                        <p className="text-[11px] text-zinc-400 truncate">
                          {i === 0 ? "¡Totalmente! ¿Vamos por un café? ☕" : "¡Hola! Me encantó tu foto en las montañas"}
                        </p>
                      </div>
                      {i === 0 && (
                        <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Vista de Chat Abierto con el Match */
              <div className="flex-1 w-full flex flex-col justify-between overflow-hidden bg-[#070709]">
                {/* Header del Chat */}
                <div className="w-full px-4 pt-11 pb-3 bg-[#0c0d12] border-b border-white/5 flex items-center justify-between z-10">
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setActiveChatProfile(null)}
                      className="p-1 text-zinc-400 hover:text-white cursor-pointer -ml-1"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <div className="w-9 h-9 rounded-full overflow-hidden relative">
                      <Image src={activeChatProfile.photos[0]} alt={activeChatProfile.name} fill className="object-cover" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-white leading-tight">{activeChatProfile.name}</h3>
                      <span className="text-[10px] text-blue-400">En línea</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("citas");
                      setActiveChatProfile(null);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 text-xs font-semibold hover:bg-blue-600/30 cursor-pointer"
                  >
                    <Coffee className="w-3.5 h-3.5" />
                    <span>Invitar a Date</span>
                  </button>
                </div>

                {/* Mensajes */}
                <div className="flex-1 px-4 py-4 overflow-y-auto no-scrollbar flex flex-col gap-3">
                  <div className="flex justify-center my-2">
                    <span className="px-3 py-1 rounded-full bg-white/5 text-[10px] text-zinc-400 border border-white/5">
                      Hicieron Klick · Hoy
                    </span>
                  </div>

                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col max-w-[78%] ${
                        msg.sender === "me" ? "self-end items-end" : "self-start items-start"
                      }`}
                    >
                      <div
                        className={`px-3.5 py-2 rounded-2xl text-xs sm:text-[13px] leading-relaxed ${
                          msg.sender === "me"
                            ? "bg-blue-600 text-white rounded-br-none"
                            : "bg-[#141620] text-zinc-100 rounded-bl-none border border-white/5"
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[9px] text-zinc-500 mt-1 px-1">{msg.time}</span>
                    </div>
                  ))}
                </div>

                {/* Input para escribir mensaje */}
                <form
                  onSubmit={handleSendMessage}
                  className="w-full p-3 bg-[#0c0d12] border-t border-white/5 flex items-center gap-2 z-10"
                >
                  <input
                    type="text"
                    value={typedMessage}
                    onChange={(e) => setTypedMessage(e.target.value)}
                    placeholder={`Escribe a ${activeChatProfile.name}...`}
                    className="flex-1 h-11 px-4 rounded-full bg-[#14151f] border border-white/10 focus:border-blue-500 outline-none text-xs sm:text-sm text-white placeholder:text-zinc-500"
                  />
                  <button
                    type="submit"
                    className="w-11 h-11 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shrink-0 active:scale-90 transition-transform cursor-pointer shadow-md shadow-blue-500/20"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* 4. PESTAÑA CITAS (Planes, Date Requests y Cita Segura)     */}
        {/* ========================================================= */}
        {activeTab === "citas" && (
          <div className="flex-1 w-full px-5 pt-12 pb-6 overflow-y-auto no-scrollbar flex flex-col bg-[#070709]">
            <h1 className="text-2xl font-bold uppercase tracking-tight text-white mb-1">Citas y Planes</h1>
            <p className="text-xs text-zinc-400 mb-5">Coordina citas seguras y salidas con tus matches.</p>

            {/* Tarjeta de Invitaciones Activas */}
            <div className="flex flex-col gap-3 mb-6">
              <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">
                Propuestas de Date
              </span>

              <div className="p-4 rounded-2xl bg-[#0e0f15] border border-white/10 flex flex-col gap-3 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full overflow-hidden relative">
                      <Image src={SAMPLE_PROFILES[0].photos[0]} alt="Camila" fill className="object-cover" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">Camila te invitó a un café</span>
                      <span className="text-[10px] text-zinc-400">Café artesanal en Provo · Sábado 5:00 PM</span>
                    </div>
                  </div>
                  <Coffee className="w-5 h-5 text-blue-400" />
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => alert("¡Cita aceptada y añadida a tu agenda!")}
                    className="h-9 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Aceptar Cita
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveChatProfile(SAMPLE_PROFILES[0]);
                      setActiveTab("inbox");
                    }}
                    className="h-9 rounded-full bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-semibold cursor-pointer border border-white/10 transition-colors"
                  >
                    Responder
                  </button>
                </div>
              </div>
            </div>

            {/* Módulo Primera Cita Segura */}
            <div className="flex flex-col gap-3 mb-6">
              <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">
                Herramienta de Seguridad
              </span>

              <div className="p-4 rounded-2xl bg-[#0e0f15] border border-blue-500/20 flex flex-col gap-3 shadow-md">
                <div className="flex items-center gap-2 text-blue-400 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  <span>Primera Cita Segura</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed font-normal">
                  Comparte tu ubicación en vivo con un familiar o amigo de confianza durante tu cita.
                </p>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-zinc-400">
                    {safeDateActive ? "Ubicación compartiéndose ✓" : "Activar para tu próxima salida"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSafeDateActive(!safeDateActive)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      safeDateActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                        : "bg-white/10 text-zinc-300 hover:bg-white/20"
                    }`}
                  >
                    {safeDateActive ? "Activada" : "Activar"}
                  </button>
                </div>
              </div>
            </div>

            {/* Lugares sugeridos para citas */}
            <div className="flex flex-col gap-3">
              <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">
                Lugares Recomendados en tu zona
              </span>

              {[
                { name: "Peace on Earth Coffee", tag: "Café tranquilo", loc: "Provo Center" },
                { name: "Rockwell Ice Cream", tag: "Heladería artesanal", loc: "Downtown Provo" },
                { name: "Canyon View Trail", tag: "Caminata al atardecer", loc: "Orem, UT" },
              ].map((place, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-[#0e0f15] border border-white/5 flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-white block">{place.name}</span>
                    <span className="text-[10px] text-zinc-400">{place.tag} · {place.loc}</span>
                  </div>
                  <Navigation className="w-4 h-4 text-blue-400" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 5. PESTAÑA PERFIL (Gestión y Edición Completa de Datos)   */}
        {/* ========================================================= */}
        {activeTab === "perfil" && (
          <div className="flex-1 w-full px-5 pt-12 pb-6 overflow-y-auto no-scrollbar flex flex-col bg-[#070709]">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold uppercase tracking-tight text-white">Tu Perfil</h1>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/20">
                100% Completo
              </span>
            </div>

            {/* Foto de Perfil y Nombre */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative w-24 h-24 rounded-full p-[2px] bg-blue-600 shadow-xl shadow-blue-500/20 mb-2">
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
                  onClick={() => setIsEditingProfile(true)}
                  className="absolute bottom-0 right-0 p-1.5 bg-blue-600 rounded-full text-white border-2 border-black cursor-pointer hover:bg-blue-500 transition-colors shadow-md"
                  title="Editar perfil"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>

              <h2 className="text-lg font-semibold text-white">{userProfile.name}, {userProfile.age}</h2>
              <span className="text-xs text-blue-400 font-medium">@{userProfile.nickname}</span>
              <p className="text-xs text-zinc-400 mt-0.5">Estatura: {userProfile.height}</p>
            </div>

            {/* Datos Editables del Perfil */}
            <div className="space-y-3 pb-6">
              <div className="p-3.5 rounded-2xl bg-[#0e0f15] border border-white/5 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase">Apodo / Nickname</span>
                  <button onClick={() => setIsEditingProfile(true)} className="text-[10px] text-blue-400 font-medium">Editar</button>
                </div>
                <p className="text-xs text-blue-400 font-medium">@{userProfile.nickname}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0e0f15] border border-white/5 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase">Biografía</span>
                  <button onClick={() => setIsEditingProfile(true)} className="text-[10px] text-blue-400 font-medium">Editar</button>
                </div>
                <p className="text-xs text-zinc-200 leading-relaxed">{userProfile.bio}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0e0f15] border border-white/5 flex flex-col gap-2">
                <span className="text-[10px] font-bold text-blue-400 uppercase">Espiritualidad</span>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Recomendación para el templo</span>
                  <span className="font-semibold text-white">{userProfile.temple}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Misión servida</span>
                  <span className="font-semibold text-white">{userProfile.mission}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Asistencia a la iglesia</span>
                  <span className="font-semibold text-white">{userProfile.churchAttendance}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0e0f15] border border-white/5 flex flex-col gap-2">
                <span className="text-[10px] font-bold text-blue-400 uppercase">Metas e Intenciones</span>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Meta de relación</span>
                  <span className="font-semibold text-white">{userProfile.relationship}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Hijos</span>
                  <span className="font-semibold text-white">{userProfile.children}</span>
                </div>
              </div>

              {/* Botón de configuración general */}
              <button
                type="button"
                onClick={() => alert("Ajustes de cuenta Klick guardados.")}
                className="w-full h-12 rounded-2xl bg-[#0e0f15] hover:bg-[#151722] border border-white/5 flex items-center justify-between px-4 text-xs font-semibold text-zinc-300 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-zinc-400" />
                  <span>Ajustes y Filtros de Búsqueda</span>
                </div>
                <ChevronLeft className="w-4 h-4 rotate-180 text-zinc-500" />
              </button>
            </div>

            {/* Modal para editar datos del perfil */}
            <AnimatePresence>
              {isEditingProfile && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
                >
                  <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="w-full max-w-sm bg-[#0e0f15] border border-white/10 rounded-3xl p-5 flex flex-col gap-3.5 shadow-2xl"
                  >
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">Editar Perfil</h3>
                      <button
                        onClick={() => setIsEditingProfile(false)}
                        className="p-1 text-zinc-400 hover:text-white cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Nombre</label>
                      <input
                        type="text"
                        value={userProfile.name}
                        onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                        className="w-full h-10 px-3 rounded-xl bg-[#070709] border border-white/10 text-xs text-white outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Nickname</label>
                      <input
                        type="text"
                        value={userProfile.nickname}
                        onChange={(e) => setUserProfile({ ...userProfile, nickname: e.target.value })}
                        className="w-full h-10 px-3 rounded-xl bg-[#070709] border border-white/10 text-xs text-white outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Biografía</label>
                      <textarea
                        rows={3}
                        value={userProfile.bio}
                        onChange={(e) => setUserProfile({ ...userProfile, bio: e.target.value })}
                        className="w-full p-3 rounded-xl bg-[#070709] border border-white/10 text-xs text-white outline-none focus:border-blue-500 resize-none"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="w-full h-11 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer shadow-md shadow-blue-500/20 mt-1"
                    >
                      Guardar Cambios
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* ========================================================= */}
        {/* 6. BOTTOM NAVIGATION BAR (5 Pestañas con color Azul)      */}
        {/* ========================================================= */}
        <div className="w-full bg-[#08080c] border-t border-white/5 px-4 py-2.5 flex items-center justify-around z-30">
          {/* Feed */}
          <button
            type="button"
            onClick={() => {
              setActiveTab("feed");
              setActiveChatProfile(null);
            }}
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
            onClick={() => {
              setActiveTab("klicks");
              setActiveChatProfile(null);
            }}
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
            onClick={() => {
              setActiveTab("inbox");
            }}
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
            onClick={() => {
              setActiveTab("citas");
              setActiveChatProfile(null);
            }}
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
            onClick={() => {
              setActiveTab("perfil");
              setActiveChatProfile(null);
            }}
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
