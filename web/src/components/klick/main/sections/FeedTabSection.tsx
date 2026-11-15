"use client";

import React from "react";
import {
  MapPin,
  ChevronsRight,
  Coffee,
  ChevronDown,
  Heart,
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
} from "@/components/klick/main/badges";
import { profileFactGroups, type Fact } from "@/lib/klick/profile-facts";
import SocialLinks from "@/components/klick/main/SocialLinks";

interface FeedTabSectionProps {
  feedScrollRef: React.RefObject<HTMLDivElement>;
  currentCandidate: KlickUserProfile;
  currentCompatibility: CompatibilityResult;
  isLightMode: boolean;
  matchAnimation: boolean;
  dateReviews: DateReviewItem[];
  onBlock: () => void;
  onReport: (e: React.FormEvent) => void;
  reportReason: string;
  onChangeReportReason: (v: string) => void;
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
  onBlock,
  onReport,
  reportReason,
  onChangeReportReason,
  onOpenRadar,
  onPass,
  onLike,
  onDateRequest,
}: FeedTabSectionProps) {
  return (
    <div
      ref={feedScrollRef}
      className="relative flex-1 w-full overflow-y-auto no-scrollbar flex flex-col bg-black"
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

        {/* Redes de la persona: columna a la derecha, centrada en la primera foto (Spotify + iconos del pie de página) */}
        <div className="absolute right-4 top-[44%] -translate-y-1/2 z-20">
          <SocialLinks socials={currentCandidate.socials} size={34} vertical />
        </div>

        {/* Nombre, estrella de 12 puntas, porcentaje y frase justo encima de la barra borrosa de 3 iconos */}
        <div className="absolute bottom-[74px] left-5 right-5 z-20 flex flex-col gap-2">
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

          <div className="klick-keep-white flex items-center gap-1.5 text-xs font-medium mt-1 leading-relaxed text-white/95 drop-shadow-[0_1px_4px_rgba(0,0,0,0.75)]">
            <MapPin className="w-3.5 h-3.5 text-blue-400" />
            <span className="klick-keep-white">
              {currentCandidate.city}, {currentCandidate.state} ·{" "}
              {currentCandidate.distanceMiles} mi
            </span>
          </div>

          {/* Frase justo arriba/atrás del borde de la barra borrosa de los 3 iconos */}
          <div className="klick-keep-white flex items-center justify-center gap-1.5 pt-3 text-[11px] text-white/90 font-normal drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]">
            <ChevronDown className="w-3.5 h-3.5 animate-bounce text-blue-400" />
            <span className="klick-keep-white">
              Scroll to view full profile
            </span>
          </div>
        </div>
      </div>

      {/* BLOQUE EDITORIAL 1: About Me & Key Shared Strengths */}
      <div className="px-5 py-9 flex flex-col gap-9 bg-black">
        {/* Biografía */}
        <div className="flex flex-col gap-2">
          <span className="text-[13px] font-semibold text-zinc-500">About Me</span>
          <p className="text-[15px] text-zinc-100 leading-[1.8]">
            {currentCandidate.bio}
          </p>
        </div>

        {/* Por qué hacen Klick: lista simple, sin caja */}
        {currentCompatibility.commonGround.length > 0 && (
          <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between">
              <span className="text-[13px] font-semibold text-zinc-500">Why You Klick</span>
              <button type="button" onClick={onOpenRadar} className="text-[13px] font-semibold text-[#0a84ff] cursor-pointer">
                {Math.round(currentCompatibility.score)}% match ›
              </button>
            </div>
            <ul className="flex flex-col gap-3.5 pt-1">
              {currentCompatibility.commonGround.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-[14px] text-zinc-200 leading-relaxed">
                  <Heart className="w-4 h-4 mt-1 text-[#ff007f] fill-[#ff007f] shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
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

      {/* BLOQUE EDITORIAL 2: Fe y Relación, como texto editorial (sin cajas ni cápsulas) */}
      <div className="px-5 py-9 flex flex-col gap-11 bg-black">
        {profileFactGroups(currentCandidate)
          .filter((g) => g.title !== "About")
          .map((g) => (
            <FactSection key={g.title} title={g.title} facts={g.facts} />
          ))}
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

      {/* BLOQUE EDITORIAL 3: Sobre la persona, reseñas y seguridad (al final del perfil) */}
      <div className="px-5 pt-9 pb-28 flex flex-col gap-11 bg-black">
        {profileFactGroups(currentCandidate)
          .filter((g) => g.title === "About")
          .map((g) => (
            <FactSection key={g.title} title={g.title} facts={g.facts} />
          ))}

        <button type="button" onClick={onOpenRadar} className="self-start text-[14px] font-semibold text-[#0a84ff] cursor-pointer">
          See compatibility breakdown ({Math.round(currentCompatibility.score)}%) ›
        </button>

        {/* Reseñas públicas de citas */}
        {dateReviews.length > 0 && (
          <div className="flex flex-col">
            <div className="flex items-baseline justify-between pb-2">
              <span className="text-[13px] font-semibold text-zinc-500">Date Reviews ({dateReviews.length})</span>
              <span className="text-[11px] text-zinc-600">Verified Safe Dates</span>
            </div>
            {dateReviews.map((rev) => (
              <div key={rev.id} className="py-5 border-b border-white/[0.08] last:border-b-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[14px] text-white truncate">
                    {rev.author} <span className="text-zinc-500">· {rev.venue}</span>
                  </span>
                  <span className="flex items-center gap-0.5 shrink-0">
                    {Array.from({ length: rev.rating }).map((_, idx) => (
                      <Star key={idx} className="h-3 w-3 text-amber-400 fill-amber-400" />
                    ))}
                  </span>
                </div>
                <p className="mt-2.5 text-[14px] text-zinc-300 leading-[1.75]">&ldquo;{rev.comment}&rdquo;</p>
                <p className="mt-2 text-[11px] text-zinc-500 leading-relaxed">
                  {[rev.date, ...rev.highlights].join(" · ")}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Seguridad: bloquear o reportar solo al llegar al final del perfil */}
        <div className="flex flex-col">
          <span className="text-[13px] font-semibold text-zinc-500">Trust & Safety</span>
          <p className="mt-2 text-[12px] text-zinc-500 leading-relaxed">
            Klick keeps a respectful community with strict identity verification. Reports are private and reviewed by our team.
          </p>
          <button
            type="button"
            onClick={onBlock}
            className="mt-4 py-4 text-left text-[14px] text-rose-500 border-b border-white/[0.08] cursor-pointer"
          >
            Block {currentCandidate.name.split(" ")[0]}
          </button>
          <form onSubmit={onReport} className="flex items-center gap-3 py-4 border-b border-white/[0.08]">
            <input
              type="text"
              value={reportReason}
              onChange={(e) => onChangeReportReason(e.target.value)}
              placeholder="Reason for report"
              aria-label="Reason for report"
              className="flex-1 min-w-0 bg-transparent text-[14px] text-white placeholder:text-zinc-600 outline-none"
            />
            <button type="submit" className="text-[14px] font-semibold text-rose-500 cursor-pointer shrink-0">
              Report
            </button>
          </form>
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

/** Datos de la persona como texto: título pequeño y filas "etiqueta · valor" sin fondo ni cápsulas. */
function FactSection({ title, facts }: { title: string; facts: Fact[] }) {
  return (
    <div className="flex flex-col">
      <span className="text-[13px] font-semibold text-zinc-500 pb-2">{title}</span>
      {facts.map((f) => (
        <div key={f.label} className="flex items-start justify-between gap-6 py-4 border-b border-white/[0.08] last:border-b-0">
          <span className="text-[14px] text-zinc-500 shrink-0 leading-relaxed">{f.label}</span>
          <span className="text-[14px] text-white text-right leading-relaxed">{f.value}</span>
        </div>
      ))}
    </div>
  );
}
