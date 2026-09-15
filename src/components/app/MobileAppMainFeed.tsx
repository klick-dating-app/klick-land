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
  Phone,
  Church,
  BookOpen,
  ArrowRight,
  Zap,
  CreditCard,
  CheckCircle2,
  Sliders,
  AlertTriangle,
  Star,
  Flag,
  UserX,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useKlickApp,
  type ChatThread,
  type SafeDatePlan,
} from "@/context/KlickAppContext";
import {
  calculateKlickCompatibility,
  type KlickUserProfile,
  type CompatibilityResult,
} from "@/lib/klick/compatibility-engine";
import {
  UTAH_SAFE_FIRST_DATE_VENUES,
  type UtahSafeVenue,
} from "@/lib/klick/mock-profiles";
import KlickLogo from "@/components/ui/KlickLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function MobileAppMainFeed() {
  const {
    currentUser,
    userRole,
    setUserRole,
    candidatesWithScore,
    activeFilters,
    setFilters,
    matches,
    chats,
    safeDatePlans,
    likeProfile,
    passProfile,
    sendMessage,
    createSafeDatePlan,
    checkInSafeDate,
    blockUser,
    reportUser,
    canInitiateChat,
  } = useKlickApp();

  const [profileIndex, setProfileIndex] = useState(0);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<
    "feed" | "klicks" | "inbox" | "citas" | "perfil"
  >("feed");

  const [matchAnimation, setMatchAnimation] = useState(false);
  const [dateAnimation, setDateAnimation] = useState(false);

  // Modales
  const [showRadarModal, setShowRadarModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSafeDateModal, setShowSafeDateModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showCandidateProfileModal, setShowCandidateProfileModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");

  // Chat activo
  const [activeChatThread, setActiveChatThread] = useState<ChatThread | null>(
    chats[0] || null
  );
  const [typedMessage, setTypedMessage] = useState("");

  // Formulario Safe Date
  const [selectedVenue, setSelectedVenue] = useState<UtahSafeVenue>(
    UTAH_SAFE_FIRST_DATE_VENUES[0]
  );
  const [dateCandidateId, setDateCandidateId] = useState<string>("");
  const [dateTimeText, setDateTimeText] = useState("Sábado, 5:00 PM");
  const [guardianName, setGuardianName] = useState("");
  const [guardianPhone, setGuardianPhone] = useState("");

  // Estado editable de mi perfil
  const [editBio, setEditBio] = useState(currentUser.bio);
  const [editOccupation, setEditOccupation] = useState(currentUser.occupation);
  const [editTemple, setEditTemple] = useState(currentUser.templeRecommend);
  const [editMission, setEditMission] = useState(currentUser.servedMission);
  const [editTimeline, setEditTimeline] = useState(currentUser.marriageTimeline);

  const activeCandidates = candidatesWithScore;
  const currentCandidateEntry =
    activeCandidates.length > 0
      ? activeCandidates[profileIndex % activeCandidates.length]
      : null;
  const currentCandidate = currentCandidateEntry?.profile;
  const currentCompatibility = currentCandidateEntry?.compatibility;

  const handleNextPhoto = () => {
    if (!currentCandidate) return;
    if (photoIndex < currentCandidate.photos.length - 1) {
      setPhotoIndex((prev) => prev + 1);
    } else {
      setPhotoIndex(0);
    }
  };

  const handlePrevPhoto = () => {
    if (!currentCandidate) return;
    if (photoIndex > 0) {
      setPhotoIndex((prev) => prev - 1);
    }
  };

  const handlePass = () => {
    if (!currentCandidate) return;
    passProfile(currentCandidate.id);
    setProfileIndex((prev) => prev + 1);
    setPhotoIndex(0);
  };

  const handleLike = () => {
    if (!currentCandidate) return;
    const res = likeProfile(currentCandidate.id);
    if (res.isMatch) {
      setMatchAnimation(true);
      setTimeout(() => {
        setMatchAnimation(false);
        setProfileIndex((prev) => prev + 1);
        setPhotoIndex(0);
      }, 1500);
    } else {
      setProfileIndex((prev) => prev + 1);
      setPhotoIndex(0);
    }
  };

  const handleDateRequest = () => {
    if (!currentCandidate) return;
    setDateCandidateId(currentCandidate.id);
    setShowSafeDateModal(true);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() || !activeChatThread) return;

    if (!canInitiateChat()) {
      setShowUpgradeModal(true);
      return;
    }

    sendMessage(activeChatThread.id, typedMessage);
    setTypedMessage("");
  };

  const handleSaveSafeDate = (e: React.FormEvent) => {
    e.preventDefault();
    const target =
      activeCandidates.find((c) => c.profile.id === dateCandidateId)?.profile ||
      currentCandidate ||
      activeChatThread?.candidate;

    if (!target) return;

    createSafeDatePlan({
      matchId: target.id,
      candidateName: target.name,
      candidatePhoto: target.photos[0],
      venueName: selectedVenue.name,
      venueAddress: selectedVenue.address,
      dateTime: dateTimeText,
      trustedContactName: guardianName || "Familiar de Confianza",
      trustedContactPhone: guardianPhone || "+1 (801) 555-0199",
      notes: "Encuentro público seguro validado por el protocolo Klick Safe Date.",
    });

    setShowSafeDateModal(false);
    toast.success("¡Cita Segura programada con éxito!");
    setActiveTab("citas");
  };

  const handleBlockCurrentCandidate = () => {
    if (!currentCandidate) return;
    blockUser(currentCandidate.id, "Bloqueado por el usuario");
    setShowReportModal(false);
    setShowCandidateProfileModal(false);
    toast.success("Usuario bloqueado y excluido de tus recomendaciones.");
    handlePass();
  };

  const handleReportCurrentCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCandidate) return;
    reportUser(currentCandidate.id, "Reporte de seguridad", reportReason || "Infracción de normas comunitarias");
    setShowReportModal(false);
    setShowCandidateProfileModal(false);
    toast.success("Reporte enviado a Trust & Safety de Klick.");
    handlePass();
  };

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center overflow-hidden select-none">
      {/* Contenedor simulador móvil */}
      <div className="w-full max-w-[430px] h-[100dvh] bg-[#070709] text-white flex flex-col justify-between relative overflow-hidden shadow-2xl md:border md:border-zinc-800/80 md:rounded-[40px]">
        {/* ========================================================= */}
        {/* 1. PESTAÑA FEED (Descubrir y Algoritmo de Compatibilidad) */}
        {/* ========================================================= */}
        {activeTab === "feed" && currentCandidate && currentCompatibility && (
          <div className="relative flex-1 w-full overflow-y-auto no-scrollbar flex flex-col justify-between bg-zinc-950">
            {/* Header Flotante del Feed con Logo y Filtros */}
            <div className="sticky top-0 z-30 w-full px-4 pt-10 pb-2 bg-gradient-to-b from-black/95 via-black/85 to-transparent backdrop-blur-md flex flex-col gap-2">
              {/* Barra de progreso de fotos */}
              <div className="w-full flex items-center gap-1.5">
                {currentCandidate.photos.map((_, idx) => (
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
                  <KlickLogo size={28} showText textClassName="font-black tracking-tight text-base" priority />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowRadarModal(true)}
                    className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 active:scale-95 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-blue-400" />
                    <span>{currentCompatibility.score}% Klick</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowFilterModal(true)}
                    className="w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 border border-white/10 flex items-center justify-center text-zinc-300 backdrop-blur-md transition-transform active:scale-95 cursor-pointer"
                    title="Filtros LDS"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Tarjeta de Foto Principal con Zonas Táctiles */}
            <div className="relative w-full aspect-[4/5] shrink-0 overflow-hidden -mt-16">
              <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-300 cursor-pointer"
                style={{
                  backgroundImage: `url(${currentCandidate.photos[photoIndex]})`,
                }}
                onClick={() => setShowCandidateProfileModal(true)}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/95" />
              </div>

              {/* Zonas táctiles para pasar fotos */}
              <div className="absolute inset-0 z-10 flex pointer-events-none">
                <div
                  className="w-1/2 h-full pointer-events-auto cursor-pointer"
                  onClick={handlePrevPhoto}
                />
                <div
                  className="w-1/2 h-full pointer-events-auto cursor-pointer"
                  onClick={handleNextPhoto}
                />
              </div>

              {/* Nombre y datos rápidos superpuestos al pie de la foto */}
              <div
                className="absolute bottom-4 left-5 right-5 z-20 flex flex-col gap-0.5 cursor-pointer"
                onClick={() => setShowCandidateProfileModal(true)}
              >
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl sm:text-[28px] font-bold tracking-tight text-white drop-shadow-lg">
                    {currentCandidate.name}, {currentCandidate.age}
                  </h2>
                  {currentCandidate.verifiedKYC && (
                    <BadgeCheck className="w-5 h-5 fill-blue-500 text-white shrink-0 shadow-sm" />
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-zinc-300 font-medium mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  <span>
                    {currentCandidate.city}, {currentCandidate.state} ·{" "}
                    {currentCandidate.distanceMiles} mi
                  </span>
                </div>

                {/* Common Ground Quick Pills */}
                {currentCompatibility.commonGround.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {currentCompatibility.commonGround.slice(0, 2).map((cg, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-full bg-blue-500/25 border border-blue-400/40 text-[10px] font-semibold text-blue-200 backdrop-blur-md"
                      >
                        ✓ {cg}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Hint de deslizamiento */}
            <div
              onClick={() => setShowCandidateProfileModal(true)}
              className="flex items-center justify-center gap-1.5 py-2 text-[11px] text-zinc-400 font-normal bg-[#070709] cursor-pointer hover:text-white transition-colors"
            >
              <ChevronDown className="w-3.5 h-3.5 animate-bounce text-blue-400" />
              <span>Toca o desliza para ver perfil completo LDS</span>
            </div>

            {/* Sección de Información Detallada del Perfil LDS */}
            <div className="px-5 py-4 flex flex-col gap-5 bg-[#070709] pb-32">
              {/* Common Ground (Puntos en Común) */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-950/30 to-purple-950/20 border border-blue-500/20 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Puntos Fuertes en Común ({currentCompatibility.commonGround.length})
                  </span>
                  <span className="text-[10px] font-bold text-zinc-400">
                    Radar: {currentCompatibility.score}%
                  </span>
                </div>
                <div className="flex flex-col gap-1.5 mt-1">
                  {currentCompatibility.commonGround.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-xs text-zinc-200 font-medium"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Biografía */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">
                  Sobre mí
                </span>
                <p className="text-xs sm:text-[13px] text-zinc-200 leading-relaxed font-normal">
                  {currentCandidate.bio}
                </p>
              </div>

              {/* Espiritualidad y Fe LDS */}
              <div className="flex flex-col gap-2.5">
                <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Church className="w-3.5 h-3.5 text-blue-400" />
                  Espiritualidad y Valores LDS
                </span>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-blue-600/15 border border-blue-500/30 text-blue-300 text-xs font-semibold">
                    Templo: {currentCandidate.templeRecommend === "Sí" ? "Recomendación Vigente" : currentCandidate.templeRecommend}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-xs font-medium">
                    Misión: {currentCandidate.servedMission}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-xs font-medium">
                    Importancia: {currentCandidate.faithImportance}
                  </span>
                </div>
              </div>

              {/* Metas de Matrimonio y Familia */}
              <div className="flex flex-col gap-2.5">
                <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  Metas de Relación y Familia
                </span>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-rose-600/15 border border-rose-500/30 text-rose-300 text-xs font-semibold">
                    Meta: Matrimonio Eterno ({currentCandidate.marriageTimeline})
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-xs font-medium">
                    Hijos: {currentCandidate.wantsChildren}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-xs font-medium">
                    Ocupación: {currentCandidate.occupation}
                  </span>
                </div>
              </div>

              {/* Idiomas & Pasatiempos */}
              <div className="flex flex-col gap-2.5">
                <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">
                  Idiomas & Estilo de Vida
                </span>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-xs font-medium">
                    Idiomas: {currentCandidate.languages.join(", ")}
                  </span>
                  {currentCandidate.hobbies.map((h, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full bg-[#12131a] border border-white/5 text-zinc-300 text-xs font-medium"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              {/* Botón Ver Desglose Completo de Radar */}
              <button
                type="button"
                onClick={() => setShowRadarModal(true)}
                className="w-full h-11 rounded-2xl bg-[#0e0f15] hover:bg-[#151620] border border-blue-500/30 text-blue-400 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Sliders className="w-4 h-4" />
                <span>Ver Radar de 10 Categorías de Compatibilidad</span>
              </button>
            </div>

            {/* Barra Flotante de Acciones Fija al Pie: Pasar (Izq), Klick (Centro), Date (Der) */}
            <div className="sticky bottom-0 z-30 w-full px-6 pt-3 pb-3 bg-gradient-to-t from-black via-black/95 to-black/30 backdrop-blur-md flex items-center justify-center gap-10 sm:gap-12 border-t border-white/5">
              <button
                type="button"
                onClick={handlePass}
                className="w-12 h-12 rounded-full bg-zinc-900/80 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white active:scale-90 transition-all cursor-pointer group shadow-lg"
                title="Siguiente candidato"
              >
                <RotateCcw className="w-6 h-6 stroke-[2.2] group-hover:-rotate-45 transition-transform duration-200" />
              </button>

              <button
                type="button"
                onClick={handleLike}
                className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500 via-purple-600 to-blue-500 p-[2px] shadow-xl shadow-pink-500/25 active:scale-90 hover:scale-105 transition-all cursor-pointer flex items-center justify-center group"
                title="Dar Klick!"
              >
                <div className="w-full h-full rounded-full bg-[#0d0e15] flex items-center justify-center group-hover:bg-transparent transition-colors">
                  <KlickLogo size={42} priority />
                </div>
              </button>

              <button
                type="button"
                onClick={handleDateRequest}
                className="w-12 h-12 rounded-full bg-zinc-900/80 border border-white/10 flex items-center justify-center text-blue-400 hover:text-white active:scale-90 transition-all cursor-pointer group shadow-lg"
                title="Proponer Safe First Date"
              >
                <Coffee className="w-6 h-6 stroke-[2.2] group-hover:scale-110 transition-transform duration-200" />
              </button>
            </div>

            {/* Animación Match */}
            <AnimatePresence>
              {matchAnimation && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center text-center p-6"
                >
                  <motion.div
                    initial={{ rotate: -15, scale: 0.8 }}
                    animate={{ rotate: 0, scale: 1 }}
                    className="w-24 h-24 rounded-full bg-white/10 border border-white/20 flex items-center justify-center p-3 shadow-2xl mb-4"
                  >
                    <KlickLogo size={70} priority />
                  </motion.div>
                  <h2 className="text-3xl font-black tracking-wider text-white mb-1 uppercase">
                    ¡Hicieron Klick!
                  </h2>
                  <p className="text-sm text-zinc-300 font-medium">
                    Tú y {currentCandidate.name} tienen una compatibilidad del{" "}
                    {currentCompatibility.score}%.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* ========================================================= */}
        {/* 2. PESTAÑA KLICKS (Matches Activos y Afinidad)             */}
        {/* ========================================================= */}
        {activeTab === "klicks" && (
          <div className="flex-1 w-full px-5 pt-12 pb-4 overflow-y-auto no-scrollbar flex flex-col bg-[#070709]">
            <div className="flex items-center justify-between mb-1">
              <h1 className="text-2xl font-bold uppercase tracking-tight text-white">
                Tus Klicks
              </h1>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-600 text-white">
                {matches.length} Matches
              </span>
            </div>
            <p className="text-xs text-zinc-400 mb-5">
              Candidatos verificados con alta afinidad mutua en Utah.
            </p>

            <div className="grid grid-cols-2 gap-3.5 pb-6">
              {matches.map((m, i) => (
                <div
                  key={i}
                  className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 group shadow-lg bg-[#0e0f15]"
                >
                  <Image
                    src={m.profile.photos[0]}
                    alt={m.profile.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-blue-600/90 text-white text-[10px] font-bold backdrop-blur-md">
                    {m.compatibility.score}% Klick
                  </span>

                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between">
                    <div>
                      <span className="block text-xs font-bold text-white leading-tight">
                        {m.profile.name}, {m.profile.age}
                      </span>
                      <span className="block text-[10px] text-zinc-300">
                        {m.profile.city}, UT
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const targetThread = chats.find(
                          (c) => c.candidate.id === m.profile.id
                        );
                        if (targetThread) {
                          setActiveChatThread(targetThread);
                        }
                        setActiveTab("inbox");
                      }}
                      className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center active:scale-90 transition-transform shadow-md cursor-pointer"
                      title="Chatear"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 3. PESTAÑA INBOX (Mensajería & Protocolo Entitlements)     */}
        {/* ========================================================= */}
        {activeTab === "inbox" && (
          <div className="flex-1 w-full flex flex-col bg-[#070709] overflow-hidden">
            {!activeChatThread ? (
              <div className="flex-1 w-full px-5 pt-12 pb-4 overflow-y-auto no-scrollbar flex flex-col">
                <h1 className="text-2xl font-bold uppercase tracking-tight text-white mb-1">
                  Mensajes
                </h1>
                <p className="text-xs text-zinc-400 mb-5">
                  Conversaciones con tus matches activos.
                </p>

                <div className="flex flex-col gap-2">
                  {chats.map((thread) => (
                    <button
                      key={thread.id}
                      type="button"
                      onClick={() => setActiveChatThread(thread)}
                      className="p-3.5 rounded-2xl bg-[#0e0f15] hover:bg-[#141620] border border-white/5 flex items-center gap-3 cursor-pointer transition-colors text-left"
                    >
                      <div className="w-12 h-12 rounded-full overflow-hidden relative shrink-0">
                        <Image
                          src={thread.candidate.photos[0]}
                          alt={thread.candidate.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-xs font-bold text-white truncate">
                            {thread.candidate.name}
                          </span>
                          <span className="text-[10px] text-zinc-500">
                            {thread.lastMessageAt}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 truncate">
                          {thread.messages[thread.messages.length - 1]?.text ||
                            "Inicia una conversación..."}
                        </p>
                      </div>
                      <span className="text-[10px] font-bold text-blue-400 px-2 py-0.5 rounded-full bg-blue-500/10">
                        {thread.compatibility.score}%
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex-1 w-full flex flex-col justify-between overflow-hidden bg-[#070709]">
                {/* Header del Chat */}
                <div className="w-full px-4 pt-10 pb-3 bg-[#0c0d12] border-b border-white/5 flex items-center justify-between z-10">
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setActiveChatThread(null)}
                      className="p-1 text-zinc-400 hover:text-white cursor-pointer -ml-1"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <div className="w-9 h-9 rounded-full overflow-hidden relative">
                      <Image
                        src={activeChatThread.candidate.photos[0]}
                        alt={activeChatThread.candidate.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-white leading-tight">
                        {activeChatThread.candidate.name}
                      </h3>
                      <span className="text-[10px] text-blue-400">
                        {activeChatThread.compatibility.score}% Compatibilidad
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setDateCandidateId(activeChatThread.candidate.id);
                      setShowSafeDateModal(true);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 text-xs font-semibold hover:bg-blue-600/30 cursor-pointer"
                  >
                    <Coffee className="w-3.5 h-3.5" />
                    <span>Safe Date</span>
                  </button>
                </div>

                {/* Mensajes */}
                <div className="flex-1 px-4 py-4 overflow-y-auto no-scrollbar flex flex-col gap-3">
                  <div className="flex justify-center my-2">
                    <span className="px-3 py-1 rounded-full bg-white/5 text-[10px] text-zinc-400 border border-white/5">
                      Hicieron Klick · Chat Seguro Verificado
                    </span>
                  </div>

                  {activeChatThread.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col max-w-[78%] ${
                        msg.senderId === currentUser.id
                          ? "self-end items-end"
                          : "self-start items-start"
                      }`}
                    >
                      <div
                        className={`px-3.5 py-2 rounded-2xl text-xs sm:text-[13px] leading-relaxed ${
                          msg.senderId === currentUser.id
                            ? "bg-blue-600 text-white rounded-br-none"
                            : "bg-[#141620] text-zinc-100 rounded-bl-none border border-white/5"
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[9px] text-zinc-500 mt-1 px-1">
                        {msg.timestamp}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Input de Mensaje */}
                <form
                  onSubmit={handleSendMessage}
                  className="w-full p-3 bg-[#0c0d12] border-t border-white/5 flex items-center gap-2 z-10"
                >
                  <input
                    type="text"
                    value={typedMessage}
                    onChange={(e) => setTypedMessage(e.target.value)}
                    placeholder={
                      !canInitiateChat()
                        ? "Membresía VIP requerida para enviar mensajes..."
                        : `Escribe a ${activeChatThread.candidate.name}...`
                    }
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
        {/* 4. PESTAÑA CITAS (Protocolo Safe First Date en Utah)       */}
        {/* ========================================================= */}
        {activeTab === "citas" && (
          <div className="flex-1 w-full px-5 pt-12 pb-6 overflow-y-auto no-scrollbar flex flex-col bg-[#070709]">
            <div className="flex items-center justify-between mb-1">
              <h1 className="text-2xl font-bold uppercase tracking-tight text-white">
                Citas Seguras
              </h1>
              <button
                type="button"
                onClick={() => setShowSafeDateModal(true)}
                className="text-xs font-bold px-3 py-1 rounded-full bg-blue-600 text-white flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Nueva
              </button>
            </div>
            <p className="text-xs text-zinc-400 mb-5">
              Protocolo de citas públicas con contacto de emergencia en Utah.
            </p>

            {/* Lista de Citas Programadas */}
            <div className="flex flex-col gap-3 mb-6">
              <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">
                Citas Programadas ({safeDatePlans.length})
              </span>

              {safeDatePlans.length === 0 ? (
                <div className="p-6 rounded-2xl bg-[#0e0f15] border border-white/5 text-center text-xs text-zinc-400">
                  No tienes citas activas. ¡Invita a un match a un café seguro!
                </div>
              ) : (
                safeDatePlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="p-4 rounded-2xl bg-[#0e0f15] border border-white/10 flex flex-col gap-3 shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-full overflow-hidden relative">
                          <Image
                            src={plan.candidatePhoto}
                            alt={plan.candidateName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white block">
                            Cita con {plan.candidateName}
                          </span>
                          <span className="text-[10px] text-zinc-400">
                            {plan.venueName} · {plan.dateTime}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          plan.status === "checked_in"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                        }`}
                      >
                        {plan.status === "checked_in"
                          ? "✓ Check-in Confirmado"
                          : "Agendada"}
                      </span>
                    </div>

                    <div className="text-[11px] text-zinc-400 bg-white/5 p-2 rounded-xl">
                      <div className="flex items-center gap-1 text-zinc-300">
                        <MapPin className="w-3.5 h-3.5 text-blue-400" />
                        <span>{plan.venueAddress}</span>
                      </div>
                      {plan.trustedContactName && (
                        <div className="flex items-center gap-1 text-zinc-400 mt-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Contacto: {plan.trustedContactName}</span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {plan.status !== "checked_in" && (
                        <button
                          type="button"
                          onClick={() => checkInSafeDate(plan.id)}
                          className="h-9 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer transition-colors"
                        >
                          Confirmar Llegada (Check-in)
                        </button>
                      )}
                      <a
                        href={`https://wa.me/?text=Hola%2C%20estoy%20en%20mi%20cita%20con%20${encodeURIComponent(
                          plan.candidateName
                        )}%20en%20${encodeURIComponent(
                          plan.venueName
                        )}.%20Protocolo%20Klick%20SafeDate.`}
                        target="_blank"
                        rel="noreferrer"
                        className="h-9 rounded-full bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-semibold cursor-pointer border border-white/10 transition-colors flex items-center justify-center gap-1"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Compartir SOS</span>
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Lugares Recomendados en Utah */}
            <div className="flex flex-col gap-3">
              <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">
                Lugares Públicos Verificados (Utah)
              </span>
              <div className="grid grid-cols-1 gap-2">
                {UTAH_SAFE_FIRST_DATE_VENUES.slice(0, 3).map((v) => (
                  <div
                    key={v.id}
                    className="p-3 rounded-2xl bg-[#0e0f15] border border-white/5 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>{v.name}</span>
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <span className="text-[10px] text-zinc-400">
                        {v.address}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-blue-400 px-2 py-0.5 bg-blue-500/10 rounded-full">
                      {v.publicLightingScore}% Seguro
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 5. PESTAÑA PERFIL (LDS Identity & Simulador de Roles)      */}
        {/* ========================================================= */}
        {activeTab === "perfil" && (
          <div className="flex-1 w-full px-5 pt-12 pb-24 overflow-y-auto no-scrollbar flex flex-col bg-[#070709]">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-24 h-24 rounded-full overflow-hidden relative border-2 border-blue-500 shadow-xl mb-3">
                <Image
                  src={currentUser.photos[0]}
                  alt={currentUser.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-lg font-bold text-white">
                  {currentUser.name}, {currentUser.age}
                </h2>
                <BadgeCheck className="w-5 h-5 fill-blue-500 text-white" />
              </div>
              <span className="text-xs text-zinc-400">
                {currentUser.city}, {currentUser.state} · {editOccupation}
              </span>
              <button
                type="button"
                onClick={() => setShowEditProfileModal(true)}
                className="mt-2 text-xs font-semibold px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" /> Editar Mi Perfil LDS
              </button>
            </div>

            {/* Simulador de Rol de Género & Monetización */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-950/40 to-zinc-900 border border-blue-500/20 mb-5 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  Simulador de Membresía
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold">
                  {userRole === "female"
                    ? "Mujer (100% Free)"
                    : userRole === "male_free"
                    ? "Hombre (Free)"
                    : "Hombre VIP ($39.99)"}
                </span>
              </div>
              <p className="text-[11px] text-zinc-300">
                En Klick, las mujeres disfrutan 100% de las funciones gratis. Los
                hombres tienen acceso gratuito para descubrir perfiles y ver su
                score de compatibilidad, y membresía VIP para chatear sin límites.
              </p>
              <div className="grid grid-cols-3 gap-1.5 mt-1">
                <button
                  type="button"
                  onClick={() => setUserRole("female")}
                  className={`py-1.5 px-2 rounded-xl text-[10px] font-bold transition-colors ${
                    userRole === "female"
                      ? "bg-blue-600 text-white"
                      : "bg-white/5 text-zinc-400 hover:bg-white/10"
                  }`}
                >
                  Mujer Free
                </button>
                <button
                  type="button"
                  onClick={() => setUserRole("male_free")}
                  className={`py-1.5 px-2 rounded-xl text-[10px] font-bold transition-colors ${
                    userRole === "male_free"
                      ? "bg-blue-600 text-white"
                      : "bg-white/5 text-zinc-400 hover:bg-white/10"
                  }`}
                >
                  Hombre Free
                </button>
                <button
                  type="button"
                  onClick={() => setUserRole("male_premium")}
                  className={`py-1.5 px-2 rounded-xl text-[10px] font-bold transition-colors ${
                    userRole === "male_premium"
                      ? "bg-purple-600 text-white"
                      : "bg-white/5 text-zinc-400 hover:bg-white/10"
                  }`}
                >
                  Hombre VIP
                </button>
              </div>
            </div>

            {/* Badges de Verificación LDS */}
            <div className="flex flex-col gap-2 mb-6">
              <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">
                Verificaciones & Fe
              </span>
              <div className="p-3.5 rounded-2xl bg-[#0e0f15] border border-white/5 flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-white block">
                    Identidad KYC Verificada
                  </span>
                  <span className="text-[10px] text-zinc-400">
                    Selfie biométrica y documento oficial validados.
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0e0f15] border border-white/5 flex items-center gap-3">
                <Church className="w-6 h-6 text-blue-400 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-white block">
                    Recomendación para el Templo ({editTemple})
                  </span>
                  <span className="text-[10px] text-zinc-400">
                    Meta de matrimonio eterno sellado · {editTimeline}
                  </span>
                </div>
              </div>
            </div>

            {/* Botón Upgrade VIP */}
            {userRole === "male_free" && (
              <button
                type="button"
                onClick={() => setShowUpgradeModal(true)}
                className="w-full h-12 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Activar Klick VIP ($39.99/mes o 35 USDC)</span>
              </button>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* BARRA DE NAVEGACIÓN INFERIOR (5 Pestañas Móviles)         */}
        {/* ========================================================= */}
        <div className="w-full h-16 bg-[#08080c]/95 border-t border-white/10 backdrop-blur-md px-4 flex items-center justify-around z-40">
          <button
            type="button"
            onClick={() => setActiveTab("feed")}
            className={`flex flex-col items-center gap-0.5 cursor-pointer ${
              activeTab === "feed" ? "text-blue-500" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Flame className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Feed</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("klicks")}
            className={`flex flex-col items-center gap-0.5 cursor-pointer relative ${
              activeTab === "klicks" ? "text-blue-500" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Heart className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Klicks</span>
            {matches.length > 0 && (
              <span className="absolute -top-1 right-1 w-2 h-2 rounded-full bg-blue-500" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("inbox")}
            className={`flex flex-col items-center gap-0.5 cursor-pointer relative ${
              activeTab === "inbox" ? "text-blue-500" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Inbox</span>
            {chats.length > 0 && (
              <span className="absolute -top-1 right-1 w-2 h-2 rounded-full bg-blue-500" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("citas")}
            className={`flex flex-col items-center gap-0.5 cursor-pointer ${
              activeTab === "citas" ? "text-blue-500" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Coffee className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Citas</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("perfil")}
            className={`flex flex-col items-center gap-0.5 cursor-pointer ${
              activeTab === "perfil" ? "text-blue-500" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Perfil</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* MODAL PERFIL COMPLETO DEL CANDIDATO                       */}
        {/* ========================================================= */}
        <AnimatePresence>
          {showCandidateProfileModal && currentCandidate && currentCompatibility && (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="absolute inset-0 z-50 bg-[#070709] flex flex-col overflow-y-auto no-scrollbar"
            >
              {/* Header con botón cerrar */}
              <div className="sticky top-0 z-20 w-full px-4 pt-10 pb-3 bg-black/80 backdrop-blur-md flex items-center justify-between border-b border-white/10">
                <button
                  type="button"
                  onClick={() => setShowCandidateProfileModal(false)}
                  className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{currentCandidate.name}</span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">
                    {currentCompatibility.score}% Klick
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowReportModal(true)}
                  className="p-1.5 rounded-full bg-white/5 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400"
                  title="Reportar o Bloquear"
                >
                  <Flag className="w-4 h-4" />
                </button>
              </div>

              {/* Galería completa */}
              <div className="px-4 py-4 flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-3">
                  {currentCandidate.photos.map((p, idx) => (
                    <div key={idx} className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border border-white/10">
                      <Image src={p} alt={currentCandidate.name} fill className="object-cover" />
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-3">
                  <h3 className="text-lg font-bold text-white">{currentCandidate.name}, {currentCandidate.age}</h3>
                  <p className="text-xs text-zinc-300 leading-relaxed">{currentCandidate.bio}</p>

                  <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
                    <span className="text-xs font-bold text-blue-400 uppercase">Detalles de Fe & Vida LDS</span>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300">Templo: {currentCandidate.templeRecommend}</span>
                      <span className="px-3 py-1 rounded-full bg-white/5 text-zinc-300">Misión: {currentCandidate.servedMission}</span>
                      <span className="px-3 py-1 rounded-full bg-white/5 text-zinc-300">Meta: {currentCandidate.marriageTimeline}</span>
                      <span className="px-3 py-1 rounded-full bg-white/5 text-zinc-300">Ocupación: {currentCandidate.occupation}</span>
                    </div>
                  </div>
                </div>

                {/* Botones de acción dentro del modal */}
                <div className="grid grid-cols-2 gap-3 pb-8">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCandidateProfileModal(false);
                      handleDateRequest();
                    }}
                    className="h-12 rounded-full bg-blue-600/20 border border-blue-500/40 text-blue-400 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Coffee className="w-4 h-4" /> Proponer Safe Date
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCandidateProfileModal(false);
                      handleLike();
                    }}
                    className="h-12 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-500/25"
                  >
                    <Heart className="w-4 h-4 fill-white" /> Dar Klick!
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ========================================================= */}
        {/* MODAL EDITAR MI PERFIL LDS                                */}
        {/* ========================================================= */}
        <AnimatePresence>
          {showEditProfileModal && (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="absolute inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col p-6 overflow-y-auto no-scrollbar"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-blue-400" />
                  <h2 className="text-base font-bold text-white">
                    Editar Mi Perfil LDS
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowEditProfileModal(false)}
                  className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col gap-4 py-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Biografía</label>
                  <textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    rows={3}
                    className="p-3 rounded-xl bg-[#14151f] border border-white/10 text-xs text-white outline-none resize-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Ocupación / Carrera</label>
                  <input
                    type="text"
                    value={editOccupation}
                    onChange={(e) => setEditOccupation(e.target.value)}
                    className="h-11 px-3 rounded-xl bg-[#14151f] border border-white/10 text-xs text-white outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Recomendación para el Templo</label>
                  <select
                    value={editTemple}
                    onChange={(e) => setEditTemple(e.target.value as any)}
                    className="h-11 px-3 rounded-xl bg-[#14151f] border border-white/10 text-xs text-white outline-none"
                  >
                    <option value="Sí">Sí (Recomendación Vigente)</option>
                    <option value="En proceso">En proceso</option>
                    <option value="No">No por el momento</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Meta de Matrimonio Eterno</label>
                  <select
                    value={editTimeline}
                    onChange={(e) => setEditTimeline(e.target.value as any)}
                    className="h-11 px-3 rounded-xl bg-[#14151f] border border-white/10 text-xs text-white outline-none"
                  >
                    <option value="<1 año">Dentro de 1 año</option>
                    <option value="1-2 años">1 a 2 años</option>
                    <option value="2+ años">2+ años</option>
                    <option value="Flexible">Flexible</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowEditProfileModal(false);
                  toast.success("¡Perfil LDS actualizado correctamente!");
                }}
                className="w-full h-12 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs mt-auto cursor-pointer"
              >
                Guardar Cambios
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ========================================================= */}
        {/* MODAL REPORTAR / BLOQUEAR USUARIO                         */}
        {/* ========================================================= */}
        <AnimatePresence>
          {showReportModal && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col p-6 items-center justify-center text-center"
            >
              <div className="w-14 h-14 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center mb-3">
                <AlertTriangle className="w-7 h-7 text-rose-400" />
              </div>
              <h2 className="text-lg font-bold text-white mb-1">Centro de Seguridad & Confianza</h2>
              <p className="text-xs text-zinc-400 mb-4 max-w-xs">
                Klick mantiene una comunidad respetuosa con verificación estricta.
              </p>

              <div className="w-full flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={handleBlockCurrentCandidate}
                  className="w-full h-11 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs font-semibold text-zinc-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UserX className="w-4 h-4 text-rose-400" /> Bloquear a este usuario
                </button>

                <form onSubmit={handleReportCurrentCandidate} className="w-full flex flex-col gap-2 pt-2">
                  <input
                    type="text"
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    placeholder="Motivo del reporte (ej. conducta inapropiada)..."
                    className="w-full h-11 px-3 rounded-xl bg-[#14151f] border border-white/10 text-xs text-white outline-none"
                  />
                  <button
                    type="submit"
                    className="w-full h-11 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Flag className="w-4 h-4" /> Enviar Reporte a Seguridad
                  </button>
                </form>

                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="w-full h-10 rounded-xl bg-transparent text-xs text-zinc-500 hover:text-zinc-300 mt-2 cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ========================================================= */}
        {/* MODAL RADAR DE COMPATIBILIDAD (10 Categorías 0-100%)      */}
        {/* ========================================================= */}
        <AnimatePresence>
          {showRadarModal && currentCompatibility && (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="absolute inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col p-6 overflow-y-auto no-scrollbar"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-400" />
                  <h2 className="text-base font-bold text-white">
                    Radar de Compatibilidad ({currentCompatibility.score}%)
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowRadarModal(false)}
                  className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col gap-4 py-4">
                <div className="p-4 rounded-2xl bg-blue-600/10 border border-blue-500/20">
                  <span className="text-xs font-bold text-blue-400 block mb-1">
                    Análisis Algorítmico Utah LDS
                  </span>
                  <p className="text-[11px] text-zinc-300 leading-relaxed">
                    Evaluado sobre 10 pilares fundamentales con filtro de seguridad
                    estricto e indispensables de fe.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  {Object.entries(currentCompatibility.categoryScores).map(
                    ([cat, rawScore]) => {
                      const normalizedScore = Math.min(100, Math.round((rawScore / 5) * 100));
                      return (
                        <div key={cat} className="flex flex-col gap-1">
                          <div className="flex justify-between text-xs font-semibold text-zinc-300">
                            <span className="capitalize">{cat}</span>
                            <span className="text-blue-400">{normalizedScore}%</span>
                          </div>
                          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                              style={{ width: `${normalizedScore}%` }}
                            />
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                    Puntos Fuertes en Común
                  </span>
                  {currentCompatibility.commonGround.map((cg, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-zinc-200 flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{cg}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowRadarModal(false)}
                className="w-full h-12 rounded-full bg-white text-black font-semibold text-xs mt-auto cursor-pointer"
              >
                Cerrar Radar
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ========================================================= */}
        {/* MODAL PROGRAMAR SAFE FIRST DATE                           */}
        {/* ========================================================= */}
        <AnimatePresence>
          {showSafeDateModal && (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="absolute inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col p-6 overflow-y-auto no-scrollbar"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-base font-bold text-white">
                    Programar Cita Segura
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSafeDateModal(false)}
                  className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveSafeDate} className="flex flex-col gap-4 py-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-zinc-300">
                    Lugar Público Verificado (Utah)
                  </label>
                  <select
                    value={selectedVenue.id}
                    onChange={(e) => {
                      const v = UTAH_SAFE_FIRST_DATE_VENUES.find(
                        (x) => x.id === e.target.value
                      );
                      if (v) setSelectedVenue(v);
                    }}
                    className="h-11 px-3 rounded-xl bg-[#14151f] border border-white/10 text-xs text-white outline-none"
                  >
                    {UTAH_SAFE_FIRST_DATE_VENUES.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} ({v.city})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-zinc-300">
                    Fecha y Hora Propuesta
                  </label>
                  <input
                    type="text"
                    value={dateTimeText}
                    onChange={(e) => setDateTimeText(e.target.value)}
                    placeholder="Ej. Sábado, 5:00 PM"
                    className="h-11 px-3 rounded-xl bg-[#14151f] border border-white/10 text-xs text-white outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-zinc-300">
                    Contacto de Emergencia / Familiar
                  </label>
                  <input
                    type="text"
                    value={guardianName}
                    onChange={(e) => setGuardianName(e.target.value)}
                    placeholder="Nombre de familiar de confianza"
                    className="h-11 px-3 rounded-xl bg-[#14151f] border border-white/10 text-xs text-white outline-none mb-2"
                  />
                  <input
                    type="tel"
                    value={guardianPhone}
                    onChange={(e) => setGuardianPhone(e.target.value)}
                    placeholder="Teléfono (+1 801 ...)"
                    className="h-11 px-3 rounded-xl bg-[#14151f] border border-white/10 text-xs text-white outline-none"
                  />
                </div>

                <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-[11px] text-emerald-300">
                  ✓ Se generará un enlace de monitoreo y recordatorio de check-in
                  para ambos.
                </div>

                <button
                  type="submit"
                  className="w-full h-12 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs mt-4 cursor-pointer"
                >
                  Confirmar y Enviar Propuesta
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ========================================================= */}
        {/* MODAL FILTROS LDS                                         */}
        {/* ========================================================= */}
        <AnimatePresence>
          {showFilterModal && (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="absolute inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col p-6 overflow-y-auto no-scrollbar"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-blue-400" />
                  <h2 className="text-base font-bold text-white">
                    Filtros de Búsqueda LDS
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowFilterModal(false)}
                  className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col gap-4 py-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-zinc-300">
                    Distancia Máxima: {activeFilters.maxDistance} millas
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={activeFilters.maxDistance}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        maxDistance: Number(e.target.value),
                      }))
                    }
                    className="accent-blue-500 cursor-pointer"
                  />
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <span className="text-xs text-zinc-200">
                    Recomendación del Templo Requerida
                  </span>
                  <input
                    type="checkbox"
                    checked={activeFilters.mustHaveTempleRecommend}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        mustHaveTempleRecommend: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 accent-blue-500 rounded"
                  />
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <span className="text-xs text-zinc-200">
                    Búsqueda orientada a Matrimonio
                  </span>
                  <input
                    type="checkbox"
                    checked={activeFilters.mustWantMarriage}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        mustWantMarriage: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 accent-blue-500 rounded"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowFilterModal(false);
                  toast.success("Filtros aplicados correctamente");
                }}
                className="w-full h-12 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs mt-auto cursor-pointer"
              >
                Aplicar Filtros
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ========================================================= */}
        {/* MODAL UPGRADE A VIP (Hombres)                             */}
        {/* ========================================================= */}
        <AnimatePresence>
          {showUpgradeModal && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col p-6 items-center justify-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center mb-4 shadow-xl">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white uppercase tracking-tight mb-2">
                Desbloquea Klick VIP
              </h2>
              <p className="text-xs text-zinc-300 leading-relaxed max-w-xs mb-6">
                Chatea sin límites con todas las personas con las que hagas Klick,
                recibe propuestas de Safe Date prioritarias y visualiza todos los
                detalles de afinidad.
              </p>

              <div className="w-full p-4 rounded-2xl bg-white/5 border border-purple-500/30 flex flex-col gap-2 mb-6 text-left">
                <div className="flex justify-between items-center text-sm font-bold text-white">
                  <span>Membresía Mensual VIP</span>
                  <span className="text-purple-400">$39.99 / mes</span>
                </div>
                <span className="text-[10px] text-zinc-400">
                  O paga con Solana USDC (35 USDC) con 12% de descuento.
                </span>
              </div>

              <div className="w-full flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setUserRole("male_premium");
                    setShowUpgradeModal(false);
                    toast.success("¡Membresía VIP activada!");
                  }}
                  className="w-full h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs cursor-pointer shadow-lg shadow-purple-500/25"
                >
                  Simular Activación VIP Inmediata
                </button>
                <button
                  type="button"
                  onClick={() => setShowUpgradeModal(false)}
                  className="w-full h-11 rounded-full bg-transparent text-zinc-400 hover:text-white text-xs cursor-pointer"
                >
                  Quizás más tarde
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
