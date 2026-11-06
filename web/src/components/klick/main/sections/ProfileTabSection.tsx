"use client";

import React from "react";
import Image from "next/image";
import {
  Moon,
  Sun,
  Edit3,
  Camera,
  Check,
  CreditCard,
  MapPin,
  MessageSquarePlus,
} from "lucide-react";
import { toast } from "sonner";
import { VerifiedStar } from "@/components/klick/main/badges";

interface ProfileTabSectionProps {
  isLightMode: boolean;
  onToggleLightMode: () => void;
  safeUserPhotos: string[];
  editName: string;
  editAge: number;
  editCity: string;
  userState: string;
  editOccupation: string;
  editBio: string;
  onChangeBio: (val: string) => void;
  isEditingBio: boolean;
  onChangeIsEditingBio: (val: boolean) => void;
  editTemple: string;
  editTimeline: string;
  userRole: "female" | "male_free" | "male_premium";
  datePlaceVenue: string;
  datePlaceOutfitStyle: string;
  feedbackCount: number;
  onOpenEditProfile: () => void;
  onOpenEditFeed: () => void;
  onOpenUpgrade: () => void;
  onOpenDatePlace: () => void;
  onOpenFeedback: () => void;
}

export default function ProfileTabSection({
  isLightMode,
  onToggleLightMode,
  safeUserPhotos,
  editName,
  editAge,
  editCity,
  userState,
  editOccupation,
  editBio,
  onChangeBio,
  isEditingBio,
  onChangeIsEditingBio,
  editTemple,
  editTimeline,
  userRole,
  datePlaceVenue,
  datePlaceOutfitStyle,
  feedbackCount,
  onOpenEditProfile,
  onOpenEditFeed,
  onOpenUpgrade,
  onOpenDatePlace,
  onOpenFeedback,
}: ProfileTabSectionProps) {
  return (
    <div
      className={`flex-1 w-full px-5 pt-10 pb-24 overflow-y-auto no-scrollbar flex flex-col transition-colors duration-300 ${
        isLightMode ? "bg-white text-zinc-900" : "bg-[#070709] text-white"
      }`}
    >
      {/* Barra superior con Switch para cambiar el tema (Negro / Blanco) */}
      <div className="w-full flex items-center justify-end mb-2">
        <button
          type="button"
          onClick={onToggleLightMode}
          aria-label="Toggle theme"
          className={`relative h-8 px-1.5 rounded-full border flex items-center gap-1.5 cursor-pointer transition-all ${
            isLightMode
              ? "bg-zinc-100 border-zinc-300 text-zinc-800"
              : "bg-white/10 border-white/15 text-zinc-200"
          }`}
        >
          <span
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold transition-all ${
              !isLightMode ? "bg-zinc-900 text-white shadow" : "text-zinc-500"
            }`}
          >
            <Moon className="w-3 h-3" />
            <span>Dark</span>
          </span>
          <span
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold transition-all ${
              isLightMode
                ? "bg-white text-zinc-900 shadow border border-zinc-200"
                : "text-zinc-400"
            }`}
          >
            <Sun className="w-3 h-3 text-amber-500" />
            <span>Light</span>
          </span>
        </button>
      </div>

      {/* Foto, Nombre y las 2 cápsulas pequeñas directamente sin contenedor exterior */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-24 h-24 rounded-full overflow-hidden relative border-2 border-blue-500 shadow-xl mb-3">
          <Image
            src={safeUserPhotos[0]}
            alt={editName}
            fill
            unoptimized
            className="object-cover"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <h2
            className={`text-lg font-bold ${
              isLightMode ? "text-zinc-900" : "text-white"
            }`}
          >
            {editName}, {editAge}
          </h2>
          <VerifiedStar />
        </div>
        <span
          className={`text-xs ${
            isLightMode ? "text-zinc-500" : "text-zinc-400"
          }`}
        >
          {editCity}, {userState} · {editOccupation}
        </span>

        <div className="mt-3 flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={onOpenEditProfile}
            className={`text-xs font-semibold px-4 py-1.5 rounded-full flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors ${
              isLightMode
                ? "bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200"
                : "bg-white/10 hover:bg-white/20 text-zinc-200"
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit Profile
          </button>
          <button
            type="button"
            onClick={onOpenEditFeed}
            className={`text-xs font-semibold px-4 py-1.5 rounded-full flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors ${
              isLightMode
                ? "bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200"
                : "bg-white/10 hover:bg-white/20 text-zinc-200"
            }`}
          >
            <Camera className="w-3.5 h-3.5" /> Edit Feed
          </button>
        </div>
      </div>

      {/* About Me: más grande, sin barra de scroll y con botón para Editar / Guardar */}
      <div className="flex flex-col gap-2 mb-5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-blue-500 uppercase tracking-wider">
            About Me
          </span>
          <button
            type="button"
            onClick={() => {
              if (isEditingBio) {
                onChangeIsEditingBio(false);
                toast.success("About Me saved!");
              } else {
                onChangeIsEditingBio(true);
              }
            }}
            className={`text-[11px] font-semibold px-3 py-1 rounded-full flex items-center gap-1 cursor-pointer transition-colors ${
              isEditingBio
                ? "klick-keep-white bg-blue-600 text-white shadow-sm"
                : isLightMode
                  ? "bg-zinc-100 hover:bg-zinc-200 text-blue-600 border border-zinc-200"
                  : "bg-white/10 hover:bg-white/15 text-blue-400"
            }`}
          >
            {isEditingBio ? (
              <>
                <Check className="w-3 h-3" />
                <span>Save</span>
              </>
            ) : (
              <>
                <Edit3 className="w-3 h-3" />
                <span>Edit</span>
              </>
            )}
          </button>
        </div>

        {isEditingBio ? (
          <textarea
            value={editBio}
            onChange={(e) => onChangeBio(e.target.value)}
            rows={5}
            autoFocus
            placeholder="Write a paragraph about yourself..."
            className={`w-full min-h-[128px] p-4 rounded-2xl border text-[13px] leading-relaxed outline-none resize-none no-scrollbar overflow-hidden ${
              isLightMode
                ? "bg-zinc-50 border-blue-500/50 text-zinc-800"
                : "bg-[#0e0f15] border-blue-500/40 text-zinc-100"
            }`}
          />
        ) : (
          <div
            onClick={() => onChangeIsEditingBio(true)}
            className={`w-full min-h-[128px] p-4 rounded-2xl border text-[13px] leading-relaxed cursor-text transition-colors ${
              isLightMode
                ? "bg-zinc-50 border-zinc-200/80 text-zinc-700"
                : "bg-[#0e0f15] border-white/5 text-zinc-200"
            }`}
          >
            {editBio || "Tap Edit to write a paragraph about yourself..."}
          </div>
        )}
      </div>

      {/* Verificación, Recomendación para el Templo, Suscripciones y Date Place */}
      <div className="flex flex-col gap-2.5 mb-5">
        <span className="text-[11px] font-bold text-blue-500 uppercase tracking-wider">
          Verifications & Faith
        </span>

        <div
          className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-colors ${
            isLightMode
              ? "bg-zinc-50 border-zinc-200/80"
              : "bg-[#0e0f15] border-white/5"
          }`}
        >
          <VerifiedStar className="w-6 h-6 shrink-0" />
          <div>
            <span
              className={`text-xs font-bold block ${
                isLightMode ? "text-zinc-900" : "text-white"
              }`}
            >
              Verification
            </span>
            <span
              className={`text-[10px] ${
                isLightMode ? "text-zinc-500" : "text-zinc-400"
              }`}
            >
              Identity and profile authenticity confirmed.
            </span>
          </div>
        </div>

        <div
          className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-colors ${
            isLightMode
              ? "bg-zinc-50 border-zinc-200/80"
              : "bg-[#0e0f15] border-white/5"
          }`}
        >
          {/* Icono de Templo (espigas arquitectónicas sin cruz) */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-6 h-6 text-blue-500 shrink-0"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2v4" />
            <path d="M10 10L12 6l2 4" />
            <path d="M6 13l1.5-3L9 13" />
            <path d="M15 13l1.5-3L18 13" />
            <path d="M4 21V13h16v8" />
            <path d="M9 21v-5h6v5" />
            <path d="M2 21h20" />
          </svg>
          <div>
            <span
              className={`text-xs font-bold block ${
                isLightMode ? "text-zinc-900" : "text-white"
              }`}
            >
              Temple Recommend (
              {editTemple === "Sí" || editTemple === "Yes"
                ? "Active"
                : editTemple}
              )
            </span>
            <span
              className={`text-[10px] ${
                isLightMode ? "text-zinc-500" : "text-zinc-400"
              }`}
            >
              Eternal marriage goal · {editTimeline}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenUpgrade}
          className={`w-full p-3.5 rounded-2xl border flex items-center gap-3 text-left cursor-pointer transition-colors ${
            isLightMode
              ? "bg-zinc-50 hover:bg-zinc-100 border-zinc-200/80"
              : "bg-[#0e0f15] hover:bg-white/[0.04] border-white/5"
          }`}
        >
          <CreditCard className="w-6 h-6 text-blue-500 shrink-0" />
          <div>
            <span
              className={`text-xs font-bold block ${
                isLightMode ? "text-zinc-900" : "text-white"
              }`}
            >
              Subscriptions
            </span>
            <span
              className={`text-[10px] ${
                isLightMode ? "text-zinc-500" : "text-zinc-400"
              }`}
            >
              {userRole === "female"
                ? "Woman Community Pass (Free)"
                : userRole === "male_free"
                  ? "Standard Plan · Tap to manage or upgrade"
                  : "Klick VIP Active · Manage membership"}
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={onOpenDatePlace}
          className={`w-full p-3.5 rounded-2xl border flex items-center gap-3 text-left cursor-pointer transition-colors ${
            isLightMode
              ? "bg-zinc-50 hover:bg-zinc-100 border-zinc-200/80"
              : "bg-[#0e0f15] hover:bg-white/[0.04] border-white/5"
          }`}
        >
          <MapPin className="w-6 h-6 text-blue-500 shrink-0" />
          <div className="min-w-0 flex-1">
            <span
              className={`text-xs font-bold block ${
                isLightMode ? "text-zinc-900" : "text-white"
              }`}
            >
              Date Place
            </span>
            <span
              className={`text-[10px] block truncate ${
                isLightMode ? "text-zinc-500" : "text-zinc-400"
              }`}
            >
              {datePlaceVenue || "Select venue"} · Outfit:{" "}
              {datePlaceOutfitStyle || "Set attire"}
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={onOpenFeedback}
          className={`w-full p-3.5 rounded-2xl border flex items-center gap-3 text-left cursor-pointer transition-colors ${
            isLightMode
              ? "bg-zinc-50 hover:bg-zinc-100 border-zinc-200/80"
              : "bg-[#0e0f15] hover:bg-white/[0.04] border-white/5"
          }`}
        >
          <MessageSquarePlus className="w-6 h-6 text-blue-500 shrink-0" />
          <div className="min-w-0 flex-1">
            <span
              className={`text-xs font-bold block ${
                isLightMode ? "text-zinc-900" : "text-white"
              }`}
            >
              Feedback
            </span>
            <span
              className={`text-[10px] block truncate ${
                isLightMode ? "text-zinc-500" : "text-zinc-400"
              }`}
            >
              Personal improvement notes ({feedbackCount}) · Only visible to you
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}

