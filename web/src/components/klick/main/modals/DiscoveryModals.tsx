"use client";

import React from "react";
import Image from "next/image";
import {
  AlertTriangle,
  UserX,
  Flag,
  Sparkles,
  X,
  CheckCircle2,
  MapPin,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import type {
  KlickUserProfile,
  CompatibilityResult,
} from "@/lib/klick/compatibility-engine";
import {
  UTAH_SAFE_FIRST_DATE_VENUES,
  type UtahSafeVenue,
} from "@/lib/klick/mock-profiles";
import { VerifiedStar } from "@/components/klick/main/badges";

interface CandidateEntry {
  profile: KlickUserProfile;
  compatibility: CompatibilityResult;
}

interface DiscoveryModalsProps {
  // Report & Block Modal
  showReportModal: boolean;
  onCloseReport: () => void;
  reportReason: string;
  setReportReason: (val: string) => void;
  onBlockCurrentCandidate: () => void;
  onReportCurrentCandidate: (e: React.FormEvent) => void;

  // Radar Modal
  showRadarModal: boolean;
  onCloseRadar: () => void;
  currentCompatibility?: CompatibilityResult | null;

  // Safe Date Modal
  showSafeDateModal: boolean;
  onCloseSafeDate: () => void;
  onSaveSafeDate: (e: React.FormEvent) => void;
  matches: CandidateEntry[];
  activeCandidates: CandidateEntry[];
  dateCandidateId: string;
  setDateCandidateId: (id: string) => void;
  datePreselected: boolean;
  setDatePreselected: (val: boolean) => void;
  selectedVenue: UtahSafeVenue;
  setSelectedVenue: (v: UtahSafeVenue) => void;
  dateTimeText: string;
  setDateTimeText: (val: string) => void;
  guardianName: string;
  setGuardianName: (val: string) => void;
  guardianPhone: string;
  setGuardianPhone: (val: string) => void;

  // Search Filters Modal
  showFilterModal: boolean;
  onCloseFilters: () => void;
  activeFilters: any;
  setFilters: React.Dispatch<React.SetStateAction<any>>;
}

export default function DiscoveryModals({
  showReportModal,
  onCloseReport,
  reportReason,
  setReportReason,
  onBlockCurrentCandidate,
  onReportCurrentCandidate,
  showRadarModal,
  onCloseRadar,
  currentCompatibility,
  showSafeDateModal,
  onCloseSafeDate,
  onSaveSafeDate,
  matches,
  activeCandidates,
  dateCandidateId,
  setDateCandidateId,
  datePreselected,
  setDatePreselected,
  selectedVenue,
  setSelectedVenue,
  dateTimeText,
  setDateTimeText,
  guardianName,
  setGuardianName,
  guardianPhone,
  setGuardianPhone,
  showFilterModal,
  onCloseFilters,
  activeFilters,
  setFilters,
}: DiscoveryModalsProps) {
  return (
    <>
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
            <h2 className="text-lg font-bold text-white mb-1">
              Trust & Safety Center
            </h2>
            <p className="text-xs text-zinc-400 mb-4 max-w-xs">
              Klick maintains a respectful community with strict identity
              verification.
            </p>

            <div className="w-full flex flex-col gap-2.5">
              <button
                type="button"
                onClick={onBlockCurrentCandidate}
                className="w-full h-11 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs font-semibold text-zinc-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserX className="w-4 h-4 text-rose-400" /> Block this user
              </button>

              <form
                onSubmit={onReportCurrentCandidate}
                className="w-full flex flex-col gap-2 pt-2"
              >
                <input
                  type="text"
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder="Reason for report (e.g. inappropriate behavior)..."
                  className="w-full h-11 px-3 rounded-xl bg-[#14151f] border border-white/10 text-xs text-white outline-none"
                />
                <button
                  type="submit"
                  className="w-full h-11 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Flag className="w-4 h-4" /> Send Report to Trust & Safety
                </button>
              </form>

              <button
                type="button"
                onClick={onCloseReport}
                className="w-full h-10 rounded-xl bg-transparent text-xs text-zinc-500 hover:text-zinc-300 mt-2 cursor-pointer"
              >
                Cancel
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
                  Compatibility Radar ({currentCompatibility.score}%)
                </h2>
              </div>
              <button
                type="button"
                onClick={onCloseRadar}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-4 py-4">
              <div className="p-4 rounded-2xl bg-blue-600/10 border border-blue-500/20">
                <span className="text-xs font-bold text-blue-400 block mb-1">
                  Utah LDS Algorithmic Analysis
                </span>
                <p className="text-[11px] text-zinc-300 leading-relaxed">
                  Evaluated across 10 fundamental pillars with strict safety
                  gate and essential faith requirements.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {Object.entries(currentCompatibility.categoryScores).map(
                  ([cat, rawScore]) => {
                    const normalizedScore = Math.min(
                      100,
                      Math.round((rawScore / 5) * 100)
                    );
                    return (
                      <div key={cat} className="flex flex-col gap-1">
                        <div className="flex justify-between text-xs font-semibold text-zinc-300">
                          <span className="capitalize">{cat}</span>
                          <span className="text-blue-400">
                            {normalizedScore}%
                          </span>
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
                  Key Shared Strengths
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
              onClick={onCloseRadar}
              className="w-full h-12 rounded-full bg-white text-black font-semibold text-xs mt-auto cursor-pointer"
            >
              Close Radar
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* MODAL PROGRAMAR SAFE FIRST DATE (Diseño Editorial v9)     */}
      {/* ========================================================= */}
      <AnimatePresence>
        {showSafeDateModal && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="absolute inset-0 z-50 bg-[#070709]/95 backdrop-blur-xl flex flex-col px-5 pt-10 pb-8 overflow-y-auto no-scrollbar"
          >
            <div className="flex items-start justify-between pb-5 border-b border-white/10">
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-blue-400">
                  Safe First Date
                </p>
                <h2 className="text-[24px] font-light tracking-tight text-white">
                  Plan a Safe Date
                </h2>
              </div>
              <button
                type="button"
                onClick={onCloseSafeDate}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={onSaveSafeDate} className="flex flex-col gap-5 py-6">
              {(() => {
                const selectableProfiles = [
                  ...matches.map((m) => m.profile),
                  ...activeCandidates
                    .map((c) => c.profile)
                    .filter(
                      (p) => !matches.some((m) => m.profile.id === p.id)
                    ),
                ];
                const selectedPerson =
                  selectableProfiles.find((p) => p.id === dateCandidateId) ||
                  selectableProfiles[0];

                if (datePreselected && selectedPerson) {
                  return (
                    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-3.5">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-zinc-900">
                          <Image
                            src={selectedPerson.photos[0]}
                            alt={selectedPerson.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-400">
                            Date With
                          </p>
                          <p className="flex items-center gap-1.5 text-sm font-medium text-white">
                            <span>{selectedPerson.name}</span>
                            <VerifiedStar className="h-3.5 w-3.5 shrink-0" />
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setDatePreselected(false)}
                        className="text-xs font-medium text-blue-400 hover:text-blue-300 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 cursor-pointer"
                      >
                        Change
                      </button>
                    </div>
                  );
                }

                return (
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/60 block">
                      Choose Your Klick
                    </label>
                    <div className="no-scrollbar -mx-1 flex gap-4 overflow-x-auto px-2 py-1.5">
                      {selectableProfiles.map((person) => {
                        const isSelected =
                          (dateCandidateId || selectableProfiles[0]?.id) ===
                          person.id;
                        return (
                          <button
                            key={person.id}
                            type="button"
                            onClick={() => setDateCandidateId(person.id)}
                            className="shrink-0 text-center cursor-pointer transition-transform active:scale-95"
                          >
                            <div
                              className={`relative h-16 w-16 overflow-hidden rounded-full transition-all ${
                                isSelected
                                  ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-[#070709] shadow-lg shadow-blue-500/30"
                                  : "ring-1 ring-white/20 opacity-65 hover:opacity-100"
                              }`}
                            >
                              <Image
                                src={person.photos[0]}
                                alt={person.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <p
                              className={`mt-1.5 text-xs font-medium ${
                                isSelected
                                  ? "text-blue-400 font-semibold"
                                  : "text-white/75"
                              }`}
                            >
                              {person.name.split(" ")[0]}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* Selector táctil de lugares verificados con chips */}
              <div className="space-y-2.5">
                <label className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/60 block">
                  Verified Public Venue (Utah)
                </label>
                <div className="flex flex-wrap gap-2">
                  {UTAH_SAFE_FIRST_DATE_VENUES.map((v) => {
                    const active = selectedVenue.id === v.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVenue(v)}
                        className={`rounded-full border px-4 py-2 text-xs font-medium transition active:scale-95 cursor-pointer ${
                          active
                            ? "border-blue-500/50 bg-blue-500/15 text-blue-300"
                            : "border-white/10 bg-white/5 text-white/75 hover:border-white/25"
                        }`}
                      >
                        {v.name}
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs font-light text-zinc-400 flex items-center gap-1.5 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>
                    {selectedVenue.address} ·{" "}
                    {selectedVenue.publicLightingScore}% Safe Score
                  </span>
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/60 block">
                  Date & Time
                </label>
                <input
                  type="text"
                  value={dateTimeText}
                  onChange={(e) => setDateTimeText(e.target.value)}
                  placeholder="e.g. Saturday, 5:00 PM"
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm font-light text-white outline-none transition placeholder:text-zinc-500 focus:border-white/40 focus:bg-white/[0.06]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/60 block">
                  Trusted Contact (Optional)
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    value={guardianName}
                    onChange={(e) => setGuardianName(e.target.value)}
                    placeholder="Name"
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm font-light text-white outline-none transition placeholder:text-zinc-500 focus:border-white/40 focus:bg-white/[0.06]"
                  />
                  <input
                    type="tel"
                    value={guardianPhone}
                    onChange={(e) => setGuardianPhone(e.target.value)}
                    placeholder="Phone"
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm font-light text-white outline-none transition placeholder:text-zinc-500 focus:border-white/40 focus:bg-white/[0.06]"
                  />
                </div>
                <p className="text-[11px] font-light text-zinc-500">
                  Only visible to you. A check-in reminder will be sent before
                  your date.
                </p>
              </div>

              <button
                type="submit"
                className="klick-keep-white w-full h-12 rounded-full bg-[linear-gradient(90deg,#008aff_0%,#7c3aed_45%,#ff007f_100%)] hover:opacity-95 active:scale-[0.98] text-white font-semibold text-sm mt-2 cursor-pointer shadow-lg shadow-purple-500/25 transition-all"
              >
                Create Safe Date
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* MODAL FILTROS (Diseño Editorial Modernizado)              */}
      {/* ========================================================= */}
      <AnimatePresence>
        {showFilterModal && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="absolute inset-0 z-50 bg-[#07070b]/98 backdrop-blur-xl flex flex-col px-5 pt-11 pb-6 overflow-y-auto no-scrollbar"
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400 block">
                  Discovery Preferences
                </span>
                <h2 className="text-lg font-semibold text-white tracking-tight">
                  Search Filters
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setFilters({
                      minAge: 21,
                      maxAge: 32,
                      maxDistance: 50,
                      faithRequired: "LDS",
                      mustHaveTempleRecommend: true,
                      mustWantMarriage: true,
                      templeRequirementIndispensable: false,
                    });
                    toast.success("Filters reset to default");
                  }}
                  className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 px-2.5 py-1 rounded-full bg-white/5 cursor-pointer"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={onCloseFilters}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-5 py-5">
              {/* Rango de Edad */}
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    Age Range
                  </span>
                  <span className="text-xs font-semibold text-blue-400">
                    {activeFilters.minAge} – {activeFilters.maxAge} yrs
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-2xl bg-[#0e0f15] border border-white/5 flex items-center justify-between">
                    <span className="text-xs text-zinc-400">Min</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setFilters((p: any) => ({
                            ...p,
                            minAge: Math.max(18, p.minAge - 1),
                          }))
                        }
                        className="w-7 h-7 rounded-full bg-white/10 text-white text-xs font-bold flex items-center justify-center cursor-pointer"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold text-white w-5 text-center">
                        {activeFilters.minAge}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setFilters((p: any) => ({
                            ...p,
                            minAge: Math.min(p.maxAge - 1, p.minAge + 1),
                          }))
                        }
                        className="w-7 h-7 rounded-full bg-white/10 text-white text-xs font-bold flex items-center justify-center cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#0e0f15] border border-white/5 flex items-center justify-between">
                    <span className="text-xs text-zinc-400">Max</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setFilters((p: any) => ({
                            ...p,
                            maxAge: Math.max(p.minAge + 1, p.maxAge - 1),
                          }))
                        }
                        className="w-7 h-7 rounded-full bg-white/10 text-white text-xs font-bold flex items-center justify-center cursor-pointer"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold text-white w-5 text-center">
                        {activeFilters.maxAge}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setFilters((p: any) => ({
                            ...p,
                            maxAge: Math.min(60, p.maxAge + 1),
                          }))
                        }
                        className="w-7 h-7 rounded-full bg-white/10 text-white text-xs font-bold flex items-center justify-center cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Distancia Máxima en Utah */}
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    Maximum Distance (Utah)
                  </span>
                  <span className="text-xs font-semibold text-blue-400">
                    {activeFilters.maxDistance} miles
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={activeFilters.maxDistance}
                  onChange={(e) =>
                    setFilters((prev: any) => ({
                      ...prev,
                      maxDistance: Number(e.target.value),
                    }))
                  }
                  className="w-full accent-blue-500 cursor-pointer"
                />
                <div className="flex items-center justify-between gap-1.5 pt-0.5">
                  {[15, 30, 50, 75, 100].map((miles) => (
                    <button
                      key={miles}
                      type="button"
                      onClick={() =>
                        setFilters((prev: any) => ({
                          ...prev,
                          maxDistance: miles,
                        }))
                      }
                      className={`flex-1 py-1.5 rounded-full text-[11px] font-semibold border transition-all cursor-pointer ${
                        activeFilters.maxDistance === miles
                          ? "klick-keep-white bg-blue-600 border-blue-500 text-white shadow-sm"
                          : "bg-white/5 border-white/10 text-zinc-400 hover:text-white"
                      }`}
                    >
                      {miles} mi
                    </button>
                  ))}
                </div>
              </div>

              {/* Pilares de Fe y Matrimonio con Switches Modernos */}
              <div className="flex flex-col gap-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Faith & Relationship Pillars
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setFilters((prev: any) => ({
                      ...prev,
                      mustHaveTempleRecommend: !prev.mustHaveTempleRecommend,
                    }))
                  }
                  className="w-full p-3.5 rounded-2xl bg-[#0e0f15] border border-white/5 flex items-center justify-between text-left cursor-pointer"
                >
                  <div>
                    <span className="text-xs font-semibold text-white block">
                      Active Temple Recommend
                    </span>
                    <span className="text-[10px] text-zinc-400">
                      Prioritize members with an active recommend
                    </span>
                  </div>
                  <div
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors flex items-center ${
                      activeFilters.mustHaveTempleRecommend
                        ? "bg-blue-600 justify-end"
                        : "bg-zinc-700 justify-start"
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-white shadow" />
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setFilters((prev: any) => ({
                      ...prev,
                      mustWantMarriage: !prev.mustWantMarriage,
                    }))
                  }
                  className="w-full p-3.5 rounded-2xl bg-[#0e0f15] border border-white/5 flex items-center justify-between text-left cursor-pointer"
                >
                  <div>
                    <span className="text-xs font-semibold text-white block">
                      Eternal Marriage Goal
                    </span>
                    <span className="text-[10px] text-zinc-400">
                      Only show people intentionally dating for marriage
                    </span>
                  </div>
                  <div
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors flex items-center ${
                      activeFilters.mustWantMarriage
                        ? "bg-blue-600 justify-end"
                        : "bg-zinc-700 justify-start"
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-white shadow" />
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setFilters((prev: any) => ({
                      ...prev,
                      templeRequirementIndispensable:
                        !prev.templeRequirementIndispensable,
                    }))
                  }
                  className="w-full p-3.5 rounded-2xl bg-[#0e0f15] border border-white/5 flex items-center justify-between text-left cursor-pointer"
                >
                  <div>
                    <span className="text-xs font-semibold text-white block">
                      Temple Sealing Indispensable
                    </span>
                    <span className="text-[10px] text-zinc-400">
                      Strict compatibility filter for temple sealing
                    </span>
                  </div>
                  <div
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors flex items-center ${
                      activeFilters.templeRequirementIndispensable
                        ? "bg-blue-600 justify-end"
                        : "bg-zinc-700 justify-start"
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-white shadow" />
                  </div>
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onCloseFilters();
                toast.success("Search filters applied!");
              }}
              className="klick-keep-white w-full h-12 rounded-full bg-gradient-to-r from-[#008aff] via-[#7c3aed] to-[#ff007f] text-white font-semibold text-xs mt-auto cursor-pointer shadow-lg shadow-purple-500/25"
            >
              Apply Filters
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

