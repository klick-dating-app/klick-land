"use client";

import React from "react";
import Image from "next/image";
import {
  X,
  Plus,
  Sparkles,
  Check,
  MapPin,
  MessageSquarePlus,
  Lock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { subscribeHref } from "@/lib/payments/subscription-plans";
import { UTAH_SAFE_FIRST_DATE_VENUES } from "@/lib/klick/mock-profiles";
import {
  VerifiedStar,
  type PersonalFeedbackItem,
} from "@/components/klick/main/badges";
import type { ProfileDetails } from "@/lib/klick/profile-details";
import { PREFERENCE_OPTIONS } from "@/components/klick/onboarding/PreferencesStep";
import {
  CHILDREN_STATUS,
  CHURCH_ATTENDANCE,
  CHURCH_IMPORTANCE,
  CORE_VALUES,
  CULTURES,
  EDUCATION_LEVELS,
  IMPORTANCE_LEVELS,
  LANGUAGE_IMPORTANCE,
  PARTNER_LANGUAGES,
  RELATIONSHIP_GOALS,
  SPIRITUAL_EXPECTATIONS,
  VALUE_KEYS,
  VALUE_PRIORITY,
  VERIFIED_ONLY,
  YES_NO_MAYBE,
} from "@/lib/types";
import { Group, MultiSelectRow, PrimaryButton, SelectRow, TextRow } from "@/components/klick/ui/apple";
import { SOCIALS, cleanHandle } from "@/lib/klick/socials";

interface ProfileModalsProps {
  isLightMode: boolean;
  userState: string;
  userRole: "female" | "male_free" | "male_premium";

  // Edit Profile Modal
  showEditProfileModal: boolean;
  onCloseEditProfile: () => void;
  editName: string;
  setEditName: (val: string) => void;
  editAge: number;
  setEditAge: (val: number) => void;
  editCity: string;
  setEditCity: (val: string) => void;
  editOccupation: string;
  setEditOccupation: (val: string) => void;
  editBio: string;
  setEditBio: (val: string) => void;
  editTemple: any;
  setEditTemple: (val: any) => void;
  editMission: any;
  setEditMission: (val: any) => void;
  editTimeline: any;
  setEditTimeline: (val: any) => void;
  editDetails: ProfileDetails;
  setEditDetails: React.Dispatch<React.SetStateAction<ProfileDetails>>;

  // Edit Feed Modal
  showEditFeedModal: boolean;
  onCloseEditFeed: () => void;
  safeUserPhotos: string[];
  setUserPhotos: (photos: string[]) => void;

  // Subscriptions Modal
  showUpgradeModal: boolean;
  onCloseUpgrade: () => void;

  // Date Place Modal
  showDatePlaceModal: boolean;
  onCloseDatePlace: () => void;
  datePlaceVenue: string;
  setDatePlaceVenue: (val: string) => void;
  datePlaceAddress: string;
  setDatePlaceAddress: (val: string) => void;
  datePlaceOutfitStyle: string;
  setDatePlaceOutfitStyle: (val: string) => void;
  datePlaceOutfitDesc: string;
  setDatePlaceOutfitDesc: (val: string) => void;
  datePlaceVibe: string;
  setDatePlaceVibe: (val: string) => void;
  datePlaceNotes: string;
  setDatePlaceNotes: (val: string) => void;

  // Personal Feedback Modal
  showFeedbackModal: boolean;
  onCloseFeedback: () => void;
  personalFeedbacks: PersonalFeedbackItem[];
}

export default function ProfileModals({
  isLightMode,
  userState,
  userRole,
  showEditProfileModal,
  onCloseEditProfile,
  editName,
  setEditName,
  editAge,
  setEditAge,
  editCity,
  setEditCity,
  editOccupation,
  setEditOccupation,
  editBio,
  setEditBio,
  editTemple,
  setEditTemple,
  editMission,
  setEditMission,
  editTimeline,
  setEditTimeline,
  editDetails,
  setEditDetails,
  showEditFeedModal,
  onCloseEditFeed,
  safeUserPhotos,
  setUserPhotos,
  showUpgradeModal,
  onCloseUpgrade,
  showDatePlaceModal,
  onCloseDatePlace,
  datePlaceVenue,
  setDatePlaceVenue,
  datePlaceAddress,
  setDatePlaceAddress,
  datePlaceOutfitStyle,
  setDatePlaceOutfitStyle,
  datePlaceOutfitDesc,
  setDatePlaceOutfitDesc,
  datePlaceVibe,
  setDatePlaceVibe,
  datePlaceNotes,
  setDatePlaceNotes,
  showFeedbackModal,
  onCloseFeedback,
  personalFeedbacks,
}: ProfileModalsProps) {
  return (
    <>
      {/* ========================================================= */}
      {/* MODAL EDIT PROFILE (Editor de Datos Personales)           */}
      {/* ========================================================= */}
      <AnimatePresence>
        {showEditProfileModal && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="absolute inset-0 z-50 bg-black flex flex-col px-4 pt-11 pb-6 overflow-y-auto no-scrollbar"
          >
            {/* Barra superior estilo hoja de Apple */}
            <div className="flex items-center justify-between pb-5">
              <button type="button" onClick={onCloseEditProfile} className="text-[15px] text-[#0a84ff] cursor-pointer">
                Cancel
              </button>
              <h2 className="text-[15px] font-semibold text-white">Edit Profile</h2>
              <button
                type="button"
                onClick={() => {
                  const bad = SOCIALS.find((n) => cleanHandle(n.id, editDetails.socials[n.id] ?? "") === null);
                  if (bad) return toast.error(`Check your ${bad.label} username.`);
                  onCloseEditProfile();
                  toast.success("Profile information updated!");
                }}
                className="text-[15px] font-semibold text-[#0a84ff] cursor-pointer"
              >
                Done
              </button>
            </div>

            {(() => {
              const d = editDetails;
              const set = <K extends keyof ProfileDetails>(key: K) => (v: ProfileDetails[K]) =>
                setEditDetails((prev) => ({ ...prev, [key]: v }));
              return (
                <div className="flex flex-col gap-6 pb-6">
                  <Group title="Personal Info">
                    <TextRow label="Full name" value={editName} onChange={setEditName} maxLength={40} />
                    <TextRow label="Age" type="number" value={editAge} onChange={(v) => setEditAge(Math.max(21, Number(v) || 21))} />
                    <TextRow label="City" value={editCity} onChange={setEditCity} />
                    <TextRow label="Occupation" value={editOccupation} onChange={setEditOccupation} maxLength={80} />
                  </Group>

                  <Group title="Biography">
                    <div className="pr-4 py-3">
                      <textarea
                        value={editBio}
                        onChange={(e) => setEditBio(e.target.value)}
                        rows={4}
                        maxLength={500}
                        aria-label="Biography"
                        className="w-full bg-transparent text-[14px] text-white leading-relaxed outline-none resize-none placeholder:text-zinc-600"
                      />
                    </div>
                  </Group>

                  <Group title="Faith">
                    <SelectRow
                      label="Temple recommend"
                      value={editTemple === "Yes" || editTemple === "Sí" ? "Active" : editTemple === "No" ? "Not currently" : editTemple}
                      options={["Active", "In progress", "Not currently"]}
                      onChange={(v) => setEditTemple(v === "Active" ? "Yes" : v === "Not currently" ? "No" : v)}
                      allowEmpty={false}
                    />
                    <SelectRow
                      label="Served a mission"
                      value={String(editMission).startsWith("Yes") || String(editMission).startsWith("Sí") ? "Yes" : editMission === "Planning to" ? "Planning to serve" : editMission}
                      options={["Yes", "Planning to serve", "No"]}
                      onChange={(v) => setEditMission(v === "Planning to serve" ? "Planning to" : v)}
                      allowEmpty={false}
                    />
                    <SelectRow label="Importance of the Church" value={d.churchImportance} options={CHURCH_IMPORTANCE} onChange={set("churchImportance")} />
                    <SelectRow label="Church attendance" value={d.churchAttendance} options={CHURCH_ATTENDANCE} onChange={set("churchAttendance")} />
                  </Group>

                  <Group title="Relationship">
                    <MultiSelectRow label="Looking for" value={d.relationshipGoals} options={RELATIONSHIP_GOALS} onChange={set("relationshipGoals")} emptyLabel="Choose" />
                    <SelectRow
                      label="Marriage timeline"
                      value={editTimeline}
                      options={["<1 year", "1-2 years", "2+ years", "Flexible"]}
                      onChange={setEditTimeline}
                      allowEmpty={false}
                    />
                    <SelectRow label="Marital status" value={d.maritalStatus} options={PREFERENCE_OPTIONS.maritalStatus} onChange={set("maritalStatus")} />
                  </Group>

                  <Group title="Family">
                    <SelectRow label="Children" value={d.childrenStatus} options={CHILDREN_STATUS} onChange={set("childrenStatus")} />
                    <SelectRow label="Want children" value={d.wantsChildren} options={PREFERENCE_OPTIONS.wantsChildren} onChange={set("wantsChildren")} />
                  </Group>

                  <Group title="About Me">
                    <SelectRow label="Education" value={d.education} options={EDUCATION_LEVELS} onChange={set("education")} />
                    <MultiSelectRow label="Languages" value={d.languages} options={PARTNER_LANGUAGES} onChange={set("languages")} emptyLabel="Choose" />
                    <SelectRow label="Cultural background" value={d.culturalBackground} options={CULTURES.filter((c) => c !== "No preference")} onChange={set("culturalBackground")} />
                    <SelectRow label="Long distance" value={d.openToLongDistance} options={YES_NO_MAYBE} onChange={set("openToLongDistance")} />
                    <MultiSelectRow label="Core values" value={d.coreValues} options={CORE_VALUES} onChange={set("coreValues")} emptyLabel="Choose" />
                    <MultiSelectRow label="Interests" value={d.interests} options={PREFERENCE_OPTIONS.interests} onChange={set("interests")} emptyLabel="None" />
                  </Group>

                  <Group title="Social Media" footer="Shown as icons on your profile. WhatsApp is only shared after you both Klick.">
                    {SOCIALS.map((net) => (
                      <TextRow
                        key={net.id}
                        label={net.label}
                        value={d.socials[net.id] ?? ""}
                        placeholder={net.placeholder}
                        maxLength={net.id === "whatsapp" ? 20 : 51}
                        onChange={(v) => setEditDetails((prev) => ({ ...prev, socials: { ...prev.socials, [net.id]: v } }))}
                      />
                    ))}
                  </Group>

                  <Group title="Partner Preferences" footer="Private · used only for matching, never shown on your profile.">
                    <SelectRow label="Temple recommend" value={d.partnerTempleImportance} options={IMPORTANCE_LEVELS} onChange={set("partnerTempleImportance")} />
                    <MultiSelectRow label="Spiritual expectations" value={d.spiritualExpectations} options={SPIRITUAL_EXPECTATIONS} onChange={set("spiritualExpectations")} emptyLabel="None" />
                    <SelectRow label="Partner with children" value={d.acceptsPartnerChildren} options={PREFERENCE_OPTIONS.acceptsPartnerChildren} onChange={set("acceptsPartnerChildren")} />
                    <MultiSelectRow label="Languages" value={d.partnerLanguages} options={PARTNER_LANGUAGES} onChange={set("partnerLanguages")} />
                    <SelectRow label="Sharing a language" value={d.languageImportance} options={LANGUAGE_IMPORTANCE} onChange={set("languageImportance")} />
                    <MultiSelectRow label="Culture" value={d.culturePreferences} options={CULTURES} onChange={set("culturePreferences")} exclusive="No preference" />
                    <SelectRow label="Verified only" value={d.verifiedOnly} options={VERIFIED_ONLY} onChange={set("verifiedOnly")} />
                  </Group>

                  <Group title="Shared Values" footer="How important is it that your partner shares each value?">
                    {VALUE_KEYS.map((key) => (
                      <SelectRow
                        key={key}
                        label={key}
                        value={d.valuePriorities[key] ?? ""}
                        options={VALUE_PRIORITY}
                        onChange={(v) =>
                          setEditDetails((prev) => {
                            const next = { ...prev.valuePriorities };
                            if (v) next[key] = v as (typeof VALUE_PRIORITY)[number];
                            else delete next[key];
                            return { ...prev, valuePriorities: next };
                          })
                        }
                      />
                    ))}
                  </Group>
                </div>
              );
            })()}

            <div className="mt-auto">
              <PrimaryButton
                variant="gradient"
                onClick={() => {
                  const bad = SOCIALS.find((n) => cleanHandle(n.id, editDetails.socials[n.id] ?? "") === null);
                  if (bad) return toast.error(`Check your ${bad.label} username.`);
                  onCloseEditProfile();
                  toast.success("Profile information updated!");
                }}
              >
                Save Changes
              </PrimaryButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* MODAL EDIT FEED (Editor de Fotos y Tarjeta del Feed)      */}
      {/* ========================================================= */}
      <AnimatePresence>
        {showEditFeedModal && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="absolute inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col px-5 pt-11 pb-6 overflow-y-auto no-scrollbar"
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-purple-400 block">
                  Photos & Feed Card
                </span>
                <h2 className="text-lg font-semibold text-white tracking-tight">
                  Edit Feed
                </h2>
              </div>
              <button
                type="button"
                onClick={onCloseEditFeed}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Gestor de Fotos del Perfil (Todas se guardan en el perfil sin eliminarse) */}
            <div className="py-4 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-300">
                  Saved Profile Photos ({safeUserPhotos.length})
                </span>
                <span className="text-[11px] text-zinc-400">
                  Tap any photo to feature as Main
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {safeUserPhotos.map((photoUrl, idx) => (
                  <div
                    key={`${photoUrl}-${idx}`}
                    onClick={() => {
                      if (idx === 0) return;
                      const updated = [...safeUserPhotos];
                      const [picked] = updated.splice(idx, 1);
                      updated.unshift(picked);
                      setUserPhotos(updated);
                      toast.success("Updated main Feed photo!");
                    }}
                    className={`relative aspect-[3/4] rounded-2xl overflow-hidden border cursor-pointer group transition-all ${
                      idx === 0
                        ? "border-blue-500 ring-2 ring-blue-500/30"
                        : "border-white/10 hover:border-blue-400/50"
                    }`}
                  >
                    <Image
                      src={photoUrl}
                      alt={`Photo ${idx + 1}`}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                    {idx === 0 ? (
                      <span className="klick-keep-white absolute top-2 left-2 px-2 py-0.5 rounded-full bg-blue-600/90 text-[9px] font-bold uppercase text-white shadow">
                        Main
                      </span>
                    ) : (
                      <span className="klick-keep-white absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-black/60 text-[9px] font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        Set Main
                      </span>
                    )}
                  </div>
                ))}

                <label className="relative aspect-[3/4] rounded-2xl border border-dashed border-white/20 hover:border-blue-400/60 bg-white/[0.03] hover:bg-white/[0.06] flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors">
                  <div className="w-9 h-9 rounded-full bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <Plus className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-semibold text-zinc-300">
                    Add Photo
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = URL.createObjectURL(file);
                        setUserPhotos([...safeUserPhotos, url]);
                        toast.success("Photo saved to your profile!");
                      }
                    }}
                  />
                </label>
              </div>

              {/* Vista previa en vivo de cómo se ve tu tarjeta en el Feed */}
              <div className="mt-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400 block mb-2">
                  Live Feed Card Preview
                </span>
                <div className="relative w-full aspect-[4/5] max-h-72 rounded-[26px] overflow-hidden border border-white/10 shadow-xl">
                  <Image
                    src={safeUserPhotos[0]}
                    alt={editName}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                  <div className="absolute bottom-4 inset-x-4 flex flex-col drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
                    <div className="flex items-center gap-1.5">
                      <span className="klick-keep-white text-lg font-semibold text-white">
                        {editName}, {editAge}
                      </span>
                      <VerifiedStar className="w-4 h-4 shrink-0" />
                    </div>
                    <span className="klick-keep-white text-xs text-white/90">
                      {editCity}, {userState} · {editOccupation}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onCloseEditFeed();
                toast.success("Feed photos saved!");
              }}
              className="klick-keep-white w-full h-12 rounded-full bg-gradient-to-r from-[#008aff] via-[#7c3aed] to-[#ff007f] text-white font-semibold text-xs mt-auto cursor-pointer shadow-lg shadow-purple-500/25"
            >
              Save Feed Changes
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* MODAL SUBSCRIPTIONS & DATE PLACE                          */}
      {/* ========================================================= */}
      <AnimatePresence>
        {showUpgradeModal && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="absolute inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col px-5 pt-11 pb-6 overflow-y-auto no-scrollbar"
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-purple-400 block">
                  Membership & Billing
                </span>
                <h2 className="text-lg font-semibold text-white tracking-tight">
                  Subscriptions
                </h2>
              </div>
              <button
                type="button"
                onClick={onCloseUpgrade}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-5 flex flex-col gap-3.5">
              {/* Plan actual activo */}
              <div className="p-4 rounded-2xl bg-black border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                    Current Plan
                  </span>
                  <span className="text-sm font-semibold text-white">
                    {userRole === "female"
                      ? "Woman Community Pass (100% Free)"
                      : userRole === "male_free"
                        ? "Standard Free Plan"
                        : "Klick VIP Membership"}
                  </span>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                  Active
                </span>
              </div>

              {/* Tres planes de suscripción: $9.99, $29.99 y $49.99 */}
              {[
                {
                  name: "Klick Basic",
                  price: "$9.99",
                  badge: "Starter Plan",
                  desc: "Daily likes, verified profiles & basic Utah filters",
                  plan: "basic" as const,
                },
                {
                  name: "Klick Pro",
                  price: "$29.99",
                  badge: "Most Popular",
                  desc: "Unlimited likes, see who likes you & advanced filters",
                  plan: "premium" as const,
                },
                {
                  name: "Klick VIP",
                  price: "$49.99",
                  badge: "VIP Experience",
                  desc: "Unlimited Chat, Priority Safe Dates & Full 10-Pillar Radar",
                  plan: "vip" as const,
                },
              ].map((planItem) => (
                <div
                  key={planItem.name}
                  className={`p-4 rounded-3xl border flex flex-col gap-2.5 shadow-lg ${
                    isLightMode
                      ? "bg-gradient-to-br from-purple-50 via-white to-blue-50 border-purple-200"
                      : "bg-gradient-to-br from-[#19132e] via-[#121222] to-[#0f101a] border-purple-500/35"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center shadow">
                        <Sparkles className="klick-keep-white w-4 h-4 text-white" />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-white block">
                          {planItem.name}
                        </span>
                        <span className="text-[10px] text-purple-400">
                          {planItem.badge}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-bold text-white block">
                        {planItem.price}
                        <span className="text-[10px] font-normal text-zinc-400">
                          /mo
                        </span>
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {planItem.desc}
                  </p>

                  <button
                    type="button"
                    // El plan solo se activa cuando el webhook de Stripe confirma el pago.
                    onClick={() => {
                      window.location.href = subscribeHref(planItem.plan);
                    }}
                    className="klick-keep-white mt-0.5 w-full h-10 rounded-full bg-gradient-to-r from-[#008aff] via-[#7c3aed] to-[#ff007f] text-white font-semibold text-xs cursor-pointer shadow-md active:scale-98 transition-transform"
                  >
                    Select {planItem.name} ({planItem.price})
                  </button>
                </div>
              ))}

            </div>

            <button
              type="button"
              onClick={onCloseUpgrade}
              className="w-full h-11 rounded-full bg-white/10 hover:bg-white/15 text-zinc-200 font-semibold text-xs mt-auto cursor-pointer"
            >
              Done
            </button>
          </motion.div>
        )}

        {/* MODAL DE DATE PLACE (Lugar de la cita, vestimenta y detalles) */}
        {showDatePlaceModal && (
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 80 }}
            className="absolute inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col p-6 overflow-y-auto no-scrollbar"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white leading-tight">
                    Date Place
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    Set your ideal venue, outfit &amp; date details
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onCloseDatePlace}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 flex-1 pb-4">
              {/* 1. LUGAR DE LA CITA (Venue & Address) */}
              <div className="p-4 rounded-2xl bg-black border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-300">
                    1. Where is the Date?
                  </span>
                  <span className="text-[10px] font-medium text-blue-400">
                    Venue &amp; Location
                  </span>
                </div>

                {/* Quick-select verified Utah venues */}
                <div>
                  <span className="text-[10px] text-zinc-400 block mb-1.5">
                    Quick Select Verified Spot or Type Below
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {UTAH_SAFE_FIRST_DATE_VENUES.map((v) => {
                      const isSelected = datePlaceVenue === v.name;
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => {
                            setDatePlaceVenue(v.name);
                            setDatePlaceAddress(v.address);
                          }}
                          className={`px-2.5 py-1.5 rounded-xl text-[11px] font-semibold transition-all cursor-pointer border ${
                            isSelected
                              ? "klick-keep-white bg-blue-600 text-white border-blue-500 shadow-sm"
                              : "bg-white/[0.04] text-zinc-300 border-white/10 hover:bg-white/10"
                          }`}
                        >
                          {v.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                    Place / Venue Name
                  </label>
                  <input
                    type="text"
                    value={datePlaceVenue}
                    onChange={(e) => setDatePlaceVenue(e.target.value)}
                    placeholder="e.g. La Caille, Sugar House Coffee, Temple Square..."
                    className="w-full h-10 px-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none focus:border-blue-500/60"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                    Exact Address / Meeting Point
                  </label>
                  <input
                    type="text"
                    value={datePlaceAddress}
                    onChange={(e) => setDatePlaceAddress(e.target.value)}
                    placeholder="Street, City or specific meeting area..."
                    className="w-full h-10 px-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none focus:border-blue-500/60"
                  />
                </div>
              </div>

              {/* 2. VESTIMENTA (Outfit & Dress Code) */}
              <div className="p-4 rounded-2xl bg-black border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-300">
                    2. Outfit &amp; Dress Code
                  </span>
                  <span className="text-[10px] font-medium text-blue-400">
                    What I&apos;ll Wear
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {[
                    "Smart Casual",
                    "Sunday Best / Dressy",
                    "Casual & Cozy",
                    "Active / Outdoors",
                    "Formal Evening",
                  ].map((style) => {
                    const active = datePlaceOutfitStyle === style;
                    return (
                      <button
                        key={style}
                        type="button"
                        onClick={() => setDatePlaceOutfitStyle(style)}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all cursor-pointer border ${
                          active
                            ? "klick-keep-white bg-blue-600 text-white border-blue-500 shadow-sm"
                            : "bg-white/[0.04] text-zinc-300 border-white/10 hover:bg-white/10"
                        }`}
                      >
                        {style}
                      </button>
                    );
                  })}
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                    My Outfit Description (So they recognize you)
                  </label>
                  <input
                    type="text"
                    value={datePlaceOutfitDesc}
                    onChange={(e) => setDatePlaceOutfitDesc(e.target.value)}
                    placeholder="e.g. Black blazer, white shirt & boots / Floral midi dress..."
                    className="w-full h-10 px-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none focus:border-blue-500/60"
                  />
                </div>
              </div>

              {/* 3. DETALLES ADICIONALES (Vibe & Future Details) */}
              <div className="p-4 rounded-2xl bg-black border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-300">
                    3. Date Details &amp; Vibe
                  </span>
                  <span className="text-[10px] font-medium text-blue-400">
                    Plan &amp; Notes
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {[
                    "Coffee & Conversation",
                    "Sweet Treat & Walk",
                    "Dinner Table",
                    "Park / Temple Grounds Stroll",
                  ].map((vibe) => {
                    const active = datePlaceVibe === vibe;
                    return (
                      <button
                        key={vibe}
                        type="button"
                        onClick={() => setDatePlaceVibe(vibe)}
                        className={`px-2.5 py-1.5 rounded-xl text-[11px] font-semibold transition-all cursor-pointer border ${
                          active
                            ? "klick-keep-white bg-blue-600 text-white border-blue-500 shadow-sm"
                            : "bg-white/[0.04] text-zinc-300 border-white/10 hover:bg-white/10"
                        }`}
                      >
                        {vibe}
                      </button>
                    );
                  })}
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                    Additional Date Notes &amp; Preferences
                  </label>
                  <textarea
                    rows={3}
                    value={datePlaceNotes}
                    onChange={(e) => setDatePlaceNotes(e.target.value)}
                    placeholder="Add any extra details for your date (preferred time, table preference, conversation starters, etc.)..."
                    className="w-full p-3 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white leading-relaxed focus:outline-none focus:border-blue-500/60 resize-none no-scrollbar"
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onCloseDatePlace();
                toast.success("Date Place & Outfit saved to your profile!");
              }}
              className="klick-keep-white w-full h-12 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold text-xs shadow-lg cursor-pointer shrink-0"
            >
              Save Date Place
            </button>
          </motion.div>
        )}

        {/* MODAL DE FEEDBACK PERSONAL (100% Privado — Solo para ti) */}
        {showFeedbackModal && (
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 80 }}
            className="absolute inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col p-6 overflow-y-auto no-scrollbar"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <MessageSquarePlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white leading-tight">
                    Personal Feedback
                  </h3>
                  <p className="text-[11px] text-zinc-400 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-blue-400" />
                    <span>Private notes on what can improve</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onCloseFeedback}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/25 mb-4">
              <p className="text-xs text-zinc-200 leading-relaxed">
                Your feedbacks are <strong>100% private</strong> and never
                shown on the public Feed. Only positive Reviews appear on the
                Feed.
              </p>
            </div>

            <div className="space-y-3 flex-1 pb-4">
              {personalFeedbacks.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-black p-6 text-center">
                  <p className="text-xs text-zinc-400">
                    No personal feedbacks yet.
                  </p>
                </div>
              ) : (
                personalFeedbacks.map((fb) => (
                  <div
                    key={fb.id}
                    className="rounded-2xl border border-white/10 bg-black p-4 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-400">
                        {fb.topic}
                      </span>
                      <span className="text-[10px] text-zinc-400">
                        {fb.date}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-200 leading-relaxed">
                      {fb.improvement}
                    </p>
                  </div>
                ))
              )}
            </div>

            <button
              type="button"
              onClick={onCloseFeedback}
              className="w-full h-11 rounded-full bg-white/10 hover:bg-white/15 text-zinc-200 font-semibold text-xs mt-auto cursor-pointer shrink-0"
            >
              Done
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

