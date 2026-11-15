"use client";

import React from "react";
import Image from "next/image";
import {
  AlertTriangle,
  UserX,
  Flag,
  X,
  Heart,
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
import { DEFAULT_FILTERS } from "@/context/KlickAppContext";
import { Group, MultiSelectRow, PrimaryButton, Row, SliderRow, ToggleRow } from "@/components/klick/ui/apple";
import { FACTOR_LABELS, FACTOR_WEIGHTS, type CompatFactor } from "@/lib/klick/compatibility-engine";
import { CHILDREN_STATUS, CHURCH_ATTENDANCE, CULTURES, PARTNER_LANGUAGES, RELATIONSHIP_GOALS } from "@/lib/types";

/** Filtros de lista (selección múltiple): vacío = cualquiera. */
const LIST_FILTERS: Array<{ key: string; label: string; options: readonly string[] }> = [
  { key: "relationshipGoals", label: "Looking for", options: RELATIONSHIP_GOALS },
  { key: "churchAttendance", label: "Church attendance", options: CHURCH_ATTENDANCE },
  { key: "languages", label: "Speaks", options: PARTNER_LANGUAGES },
  { key: "cultures", label: "Culture", options: CULTURES.filter((c) => c !== "No preference") },
  { key: "childrenStatus", label: "Has children", options: CHILDREN_STATUS },
  { key: "wantsChildren", label: "Wants children", options: ["Yes", "No", "Maybe", "Not sure yet"] },
];

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
                className="w-full h-11 rounded-xl bg-black hover:bg-white/[0.06] border border-white/10 text-xs font-semibold text-zinc-200 flex items-center justify-center gap-2 cursor-pointer"
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
                  className="w-full h-11 px-3 rounded-xl bg-black border border-white/10 text-xs text-white outline-none"
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
            className="absolute inset-0 z-50 bg-black flex flex-col px-4 pt-11 pb-6 overflow-y-auto no-scrollbar"
          >
            <div className="flex items-center justify-between pb-5">
              <span className="w-8" />
              <h2 className="text-[15px] font-semibold text-white">Compatibility</h2>
              <button
                type="button"
                onClick={onCloseRadar}
                aria-label="Close"
                className="h-8 w-8 flex items-center justify-center rounded-full bg-white/10 text-zinc-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center pb-6">
              <span className="text-[56px] font-bold leading-none tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                {Math.round(currentCompatibility.score)}%
              </span>
              <p className="mt-2 text-[13px] text-zinc-500">
                Weighted across the 7 SafeMeet.Ut factors
              </p>
            </div>

            <div className="flex flex-col gap-6 pb-6">
              <Group title="Factors">
                {(Object.keys(FACTOR_WEIGHTS) as CompatFactor[]).map((key) => {
                  const value = currentCompatibility.factors?.[key] ?? 0;
                  const meta = FACTOR_LABELS[key];
                  return (
                    <div key={key} className="pr-4 py-3 border-b border-white/[0.08] last:border-b-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[14px] text-white">
                          {meta.emoji} {meta.label}
                        </span>
                        <span className="text-[14px] text-zinc-400 tabular-nums">{value}%</span>
                      </div>
                      <div className="mt-2 h-1 w-full rounded-full bg-[rgba(120,120,128,0.32)] overflow-hidden">
                        <div className="h-full rounded-full bg-[#0a84ff]" style={{ width: `${value}%` }} />
                      </div>
                      <span className="mt-1.5 block text-[11px] text-zinc-500">
                        {meta.compares} · weight {FACTOR_WEIGHTS[key]}
                      </span>
                    </div>
                  );
                })}
              </Group>

              {currentCompatibility.commonGround.length > 0 && (
                <Group title="Why You Klick">
                  {currentCompatibility.commonGround.map((cg, i) => (
                    <Row key={i} label={cg}>
                      <Heart className="w-4 h-4 text-[#ff007f] fill-[#ff007f] shrink-0" />
                    </Row>
                  ))}
                </Group>
              )}
            </div>

            <div className="mt-auto">
              <PrimaryButton onClick={onCloseRadar}>Done</PrimaryButton>
            </div>
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
            className="absolute inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col px-5 pt-10 pb-8 overflow-y-auto no-scrollbar"
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
                    <div className="flex items-center justify-between rounded-2xl border border-white/[0.12] bg-black p-3.5">
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
                                  ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-black shadow-lg shadow-blue-500/30"
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
                  className="w-full rounded-2xl border border-white/[0.12] bg-black px-4 py-3.5 text-sm font-light text-white outline-none transition placeholder:text-zinc-500 focus:border-white/40 focus:bg-white/[0.06]"
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
                    className="w-full rounded-2xl border border-white/[0.12] bg-black px-4 py-3.5 text-sm font-light text-white outline-none transition placeholder:text-zinc-500 focus:border-white/40 focus:bg-white/[0.06]"
                  />
                  <input
                    type="tel"
                    value={guardianPhone}
                    onChange={(e) => setGuardianPhone(e.target.value)}
                    placeholder="Phone"
                    className="w-full rounded-2xl border border-white/[0.12] bg-black px-4 py-3.5 text-sm font-light text-white outline-none transition placeholder:text-zinc-500 focus:border-white/40 focus:bg-white/[0.06]"
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
            className="absolute inset-0 z-50 bg-black flex flex-col px-4 pt-11 pb-6 overflow-y-auto no-scrollbar"
          >
            {/* Barra superior estilo hoja de Apple: Reset · título · cerrar */}
            <div className="flex items-center justify-between pb-5">
              <button
                type="button"
                onClick={() => {
                  setFilters({ ...DEFAULT_FILTERS, maxAge: 32, templeRequirementIndispensable: false });
                  toast.success("Filters reset to default");
                }}
                className="text-[15px] text-[#0a84ff] cursor-pointer"
              >
                Reset
              </button>
              <h2 className="text-[15px] font-semibold text-white">Filters</h2>
              <button
                type="button"
                onClick={onCloseFilters}
                aria-label="Close"
                className="h-8 w-8 flex items-center justify-center rounded-full bg-white/10 text-zinc-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-6 pb-6">
              <Group title="Age & Distance">
                <SliderRow
                  label="Minimum age"
                  value={activeFilters.minAge}
                  min={21}
                  max={70}
                  onChange={(v) => setFilters((p: any) => ({ ...p, minAge: Math.min(v, p.maxAge - 1) }))}
                />
                <SliderRow
                  label="Maximum age"
                  value={activeFilters.maxAge}
                  min={22}
                  max={75}
                  onChange={(v) => setFilters((p: any) => ({ ...p, maxAge: Math.max(v, p.minAge + 1) }))}
                />
                <SliderRow
                  label="Maximum distance"
                  value={activeFilters.maxDistance}
                  min={10}
                  max={100}
                  step={5}
                  format={(v) => `${v} mi`}
                  onChange={(v) => setFilters((p: any) => ({ ...p, maxDistance: v }))}
                />
                <ToggleRow
                  label="Include long distance"
                  hint="People farther away who are open to it"
                  checked={!!activeFilters.includeLongDistance}
                  onChange={(v) => setFilters((p: any) => ({ ...p, includeLongDistance: v }))}
                />
              </Group>

              <Group title="Faith & Relationship">
                <ToggleRow
                  label="Active temple recommend"
                  hint="Prioritize members with an active recommend"
                  checked={!!activeFilters.mustHaveTempleRecommend}
                  onChange={(v) => setFilters((p: any) => ({ ...p, mustHaveTempleRecommend: v }))}
                />
                <ToggleRow
                  label="Eternal marriage goal"
                  hint="Only people dating with marriage in mind"
                  checked={!!activeFilters.mustWantMarriage}
                  onChange={(v) => setFilters((p: any) => ({ ...p, mustWantMarriage: v }))}
                />
                <ToggleRow
                  label="Temple sealing indispensable"
                  hint="Strict compatibility filter"
                  checked={!!activeFilters.templeRequirementIndispensable}
                  onChange={(v) => setFilters((p: any) => ({ ...p, templeRequirementIndispensable: v }))}
                />
              </Group>

              <Group title="Safety">
                <ToggleRow
                  label="Verified profiles only"
                  hint="Identity and photo verified"
                  checked={!!activeFilters.onlyVerified}
                  onChange={(v) => setFilters((p: any) => ({ ...p, onlyVerified: v }))}
                />
              </Group>

              <Group title="Preferences" footer="Leave a filter on “Any” to see everyone.">
                {LIST_FILTERS.map((f) => (
                  <MultiSelectRow
                    key={f.key}
                    label={f.label}
                    value={activeFilters[f.key] ?? []}
                    options={f.options}
                    onChange={(v) => setFilters((p: any) => ({ ...p, [f.key]: v }))}
                  />
                ))}
              </Group>

              <Group title="Compatibility">
                <SliderRow
                  label="Minimum compatibility"
                  value={activeFilters.minCompatibility ?? 0}
                  min={0}
                  max={95}
                  step={5}
                  format={(v) => (v ? `${v}%` : "Any")}
                  onChange={(v) => setFilters((p: any) => ({ ...p, minCompatibility: v }))}
                />
              </Group>
            </div>

            <div className="mt-auto">
              <PrimaryButton
                variant="gradient"
                onClick={() => {
                  onCloseFilters();
                  toast.success("Search filters applied!");
                }}
              >
                Apply Filters
              </PrimaryButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

