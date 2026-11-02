"use client";

import React from "react";
import {
  MapPin,
  ChevronsRight,
  Sparkles,
  Coffee,
  ChevronDown,
  Heart,
  CheckCircle2,
  Sliders,
  Flag,
  Star,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type {
  KlickUserProfile,
  CompatibilityResult,
} from "@/lib/klick/compatibility-engine";
import KlickLogo from "@/components/ui/KlickLogo";
import {
  VerifiedStar,
  ScoreBadge,
  type DateReviewItem,
} from "@/components/app/MobileAppBadges";

interface FeedTabSectionProps {
  feedScrollRef: React.RefObject<HTMLDivElement | null>;
  currentCandidate: KlickUserProfile;
  currentCompatibility: CompatibilityResult;
  isLightMode: boolean;
  matchAnimation: boolean;
  dateReviews: DateReviewItem[];
  onOpenReport: () => void;
  onOpenRadar: () => void;
  onPass: () => void;
  onLike: () => void;
  onDateRequest: () => void;
}

export default function FeedTabSection({
  feedScrollRef,
  currentCandidate,
  currentCompatibility,
  isLightMode,
  matchAnimation,
  dateReviews,
  onOpenReport,
  onOpenRadar,
  onPass,
  onLike,
  onDateRequest,
}: FeedTabSectionProps) {
  return (
    <div
      ref={feedScrollRef}
      className="relative flex-1 w-full overflow-y-auto no-scrollbar flex flex-col bg-zinc-950"
    >
      {/* Header Flotante del Feed (altura 0 para no crear barra superior y flotar sobre la imagen) */}
      <div className="sticky top-0 z-30 h-0 w-full overflow-visible pointer-events-none">
        <div className="w-full px-4 pt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 pointer-events-auto">
            <KlickLogo
              size={28}
              showText
              textClassName="font-semibold tracking-tight text-base"
              priority
            />
          </div>
          <button
            type="button"
            onClick={onOpenReport}
            className="pointer-events-auto p-2 rounded-full bg-black/25 hover:bg-black/45 text-white/80 hover:text-white backdrop-blur-sm transition-colors cursor-pointer"
            title="Safety & Report"
          >
            <Flag className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 1. IMAGEN PRINCIPAL (Ocupa 100% desde el borde superior hasta detrás de la barra borrosa de 3 iconos) */}
      <div className="relative w-full h-[calc(100dvh-4rem)] min-h-[520px] shrink-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-300"
          style={{
            backgroundImage: `url(${currentCandidate.photos[0]})`,
          }}
        />

        {/* Nombre, estrella de 12 puntas, porcentaje y frase justo encima de la barra borrosa de 3 iconos */}
        <div className="absolute bottom-[74px] left-5 right-5 z-20 flex flex-col gap-1">
          <div className="flex items-center justify-between gap-3">
            <h2 className="klick-keep-white flex items-center gap-1.5 text-lg sm:text-xl font-semibold leading-none tracking-tight text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.75)]">
              <span className="klick-keep-white">
                {currentCandidate.name},{" "}
                <span className="klick-keep-white font-light">
                  {currentCandidate.age}
                </span>
              </span>
              {currentCandidate.verifiedKYC && <VerifiedStar />}
            </h2>

            <ScoreBadge
              score={currentCompatibility.score}
              onClick={(e) => {
                e.stopPropagation();
                onOpenRadar();
              }}
            />
          </div>

          <div className="klick-keep-white flex items-center gap-1.5 text-xs font-medium mt-0.5 text-white/95 drop-shadow-[0_1px_4px_rgba(0,0,0,0.75)]">
            <MapPin className="w-3.5 h-3.5 text-blue-400" />
            <span className="klick-keep-white">
              {currentCandidate.city}, {currentCandidate.state} ·{" "}
              {currentCandidate.distanceMiles} mi
            </span>
          </div>

          {/* Frase justo arriba/atrás del borde de la barra borrosa de los 3 iconos */}
          <div className="klick-keep-white flex items-center justify-center gap-1.5 pt-2 text-[11px] text-white/90 font-normal drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]">
            <ChevronDown className="w-3.5 h-3.5 animate-bounce text-blue-400" />
            <span className="klick-keep-white">
              Scroll to view full profile
            </span>
          </div>
        </div>
      </div>

      {/* BLOQUE EDITORIAL 1: About Me & Key Shared Strengths */}
      <div className="px-5 py-6 flex flex-col gap-5 bg-[#070709]">
        {/* Biografía */}
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">
            About Me
          </span>
          <p className="text-sm sm:text-[15px] text-zinc-100 leading-relaxed font-light">
            {currentCandidate.bio}
          </p>
        </div>

        {/* Common Ground (Puntos en Común) */}
        <div
          className={`p-4 rounded-2xl border flex flex-col gap-2.5 ${
            isLightMode
              ? "bg-blue-50/70 border-blue-200/80"
              : "bg-gradient-to-br from-blue-950/30 to-purple-950/20 border-blue-500/20"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Why You Klick ({currentCompatibility.commonGround.length})
            </span>
            <button
              type="button"
              onClick={onOpenRadar}
              className="text-[11px] font-bold px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 cursor-pointer"
            >
              {currentCompatibility.score}% Match
            </button>
          </div>
          <div className="flex flex-col gap-1.5 mt-0.5">
            {currentCompatibility.commonGround.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 text-xs text-zinc-200 font-medium"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. SEGUNDA IMAGEN DEL PERFIL (Mismo tamaño que la imagen principal) */}
      {currentCandidate.photos[1] && (
        <div className="relative w-full h-[calc(100dvh-4rem)] min-h-[520px] shrink-0 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${currentCandidate.photos[1]})`,
            }}
          />
        </div>
      )}

      {/* BLOQUE EDITORIAL 2: Valores, Fe y Metas de Relación */}
      <div className="px-5 py-6 flex flex-col gap-5 bg-[#070709]">
        {/* Espiritualidad y Valores */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            Spirituality & Values
          </span>
          <div className="flex flex-wrap gap-2">
            <span className="px-4 py-1.5 rounded-full bg-blue-600/15 border border-blue-500/30 text-blue-300 text-xs font-semibold shadow-sm">
              Temple:{" "}
              {currentCandidate.templeRecommend === "Sí" ||
              currentCandidate.templeRecommend === "Yes"
                ? "Active Recommend"
                : currentCandidate.templeRecommend}
            </span>
            <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-xs font-medium shadow-sm">
              Mission: {currentCandidate.servedMission}
            </span>
            <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-xs font-medium shadow-sm">
              Faith: {currentCandidate.faithImportance}
            </span>
          </div>
        </div>

        {/* Metas de Matrimonio y Familia */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-500" />
            Relationship & Family Goals
          </span>
          <div className="flex flex-wrap gap-2">
            <span
              className={`px-4 py-1.5 rounded-full border text-xs font-semibold shadow-sm ${
                isLightMode
                  ? "bg-rose-50 border-rose-200 text-rose-700"
                  : "bg-rose-600/15 border-rose-500/30 text-rose-300"
              }`}
            >
              Goal: Eternal Marriage ({currentCandidate.marriageTimeline})
            </span>
            <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-xs font-medium shadow-sm">
              Children: {currentCandidate.wantsChildren}
            </span>
            <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-xs font-medium shadow-sm">
              {currentCandidate.occupation}
            </span>
          </div>
        </div>
      </div>

      {/* 3. FOTOS ADICIONALES (3ra foto en adelante, mismo tamaño que la principal) */}
      {currentCandidate.photos.slice(2).map((photoUrl, idx) => (
        <div
          key={`extra-photo-${idx}`}
          className="relative w-full h-[calc(100dvh-4rem)] min-h-[520px] shrink-0 overflow-hidden"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${photoUrl})`,
            }}
          />
        </div>
      ))}

      {/* BLOQUE EDITORIAL 3: Idiomas, Estilo de Vida y Radar */}
      <div className="px-5 py-6 pb-28 flex flex-col gap-5 bg-[#070709]">
        <div className="flex flex-col gap-2.5">
          <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">
            Languages & Lifestyle
          </span>
          <div className="flex flex-wrap gap-2">
            <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-xs font-medium shadow-sm">
              Languages: {currentCandidate.languages.join(", ")}
            </span>
            {currentCandidate.hobbies.map((h, i) => (
              <span
                key={i}
                className="px-4 py-1.5 rounded-full bg-[#12131a] border border-white/10 text-zinc-300 text-xs font-medium shadow-sm"
              >
                {h}
              </span>
            ))}
            {currentCandidate.sports.map((s, i) => (
              <span
                key={`sport-${i}`}
                className="px-4 py-1.5 rounded-full bg-[#12131a] border border-white/10 text-zinc-300 text-xs font-medium shadow-sm"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Botón Ver Desglose Completo de Radar */}
        <button
          type="button"
          onClick={onOpenRadar}
          className="w-full h-11 rounded-2xl bg-[#0e0f15] hover:bg-[#151620] border border-blue-500/30 text-blue-400 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          <Sliders className="w-4 h-4" />
          <span>View Compatibility Radar ({currentCompatibility.score}%)</span>
        </button>

        {/* RESEÑAS PÚBLICAS DE CITAS (Reviews enviados desde Dates) */}
        <div className="flex flex-col gap-3 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 fill-blue-400 text-blue-400" />
              Date Reviews ({dateReviews.length})
            </span>
            <span className="text-[10px] text-zinc-400 font-medium">
              Verified Safe Dates
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {dateReviews.map((rev) => (
              <div
                key={rev.id}
                className="rounded-2xl border border-white/10 bg-[#0d0e14] p-4 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-white block truncate">
                      {rev.author} ·{" "}
                      <span className="text-blue-400 font-normal">
                        {rev.venue}
                      </span>
                    </span>
                    <span className="text-[10px] text-zinc-400">
                      {rev.date}
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5 shrink-0">
                    {Array.from({ length: rev.rating }).map((_, idx) => (
                      <Star
                        key={idx}
                        className="h-3.5 w-3.5 text-amber-400 fill-amber-400"
                      />
                    ))}
                  </div>
                </div>

                {rev.highlights.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {rev.highlights.map((h) => (
                      <span
                        key={h}
                        className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-medium text-blue-400"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-xs font-light text-zinc-200 leading-relaxed">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Barra Flotante de Acciones Fija al Pie sin bordes y con difuminado sobre la imagen */}
      <div
        className={`sticky bottom-0 z-30 w-full h-[70px] -mt-[70px] px-6 backdrop-blur-md flex items-center justify-center gap-10 sm:gap-12 transition-colors border-0 ${
          isLightMode
            ? "bg-gradient-to-t from-white/75 via-white/45 to-transparent"
            : "bg-gradient-to-t from-black/75 via-black/45 to-transparent"
        }`}
      >
        <button
          type="button"
          onClick={onPass}
          className={`w-12 h-12 flex items-center justify-center active:scale-90 transition-all cursor-pointer group ${
            isLightMode
              ? "text-zinc-600 hover:text-zinc-950"
              : "text-zinc-400 hover:text-white"
          }`}
          title="Next candidate"
        >
          <ChevronsRight className="w-8 h-8 stroke-[2.2] group-hover:translate-x-1 transition-transform duration-200" />
        </button>

        <button
          type="button"
          onClick={onLike}
          className="w-14 h-14 flex items-center justify-center active:scale-90 hover:scale-110 transition-all cursor-pointer group"
          title="Give Klick!"
        >
          <KlickLogo size={52} priority />
        </button>

        <button
          type="button"
          onClick={onDateRequest}
          className={`w-12 h-12 flex items-center justify-center active:scale-90 transition-all cursor-pointer group ${
            isLightMode
              ? "text-zinc-600 hover:text-zinc-950"
              : "text-zinc-400 hover:text-white"
          }`}
          title="Propose Safe First Date"
        >
          <Coffee className="w-8 h-8 stroke-[2.2] group-hover:scale-110 transition-transform duration-200" />
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
              It&apos;s a Klick!
            </h2>
            <p className="text-sm text-zinc-300 font-medium">
              You and {currentCandidate.name} share a{" "}
              {currentCompatibility.score}% compatibility score.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

