"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Plus,
  Calendar,
  Coffee,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Phone,
  Star,
  MessageSquarePlus,
  Sparkles,
  Send,
  Lock,
  History,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import type { SafeDatePlan } from "@/context/KlickAppContext";
import type {
  KlickUserProfile,
  CompatibilityResult,
} from "@/lib/klick/compatibility-engine";
import type {
  DateReviewItem,
  PersonalFeedbackItem,
} from "@/components/klick/main/badges";

interface MatchItem {
  profile: KlickUserProfile;
  compatibility: CompatibilityResult;
}

interface PastDateItem {
  id: string;
  candidateName: string;
  candidatePhoto: string;
  venueName: string;
  venueAddress: string;
  dateTime: string;
}

interface SafeDatesTabSectionProps {
  safeDatePlans: SafeDatePlan[];
  matches: MatchItem[];
  dateReviews: DateReviewItem[];
  onAddReview: (review: DateReviewItem) => void;
  onAddFeedback: (feedback: PersonalFeedbackItem) => void;
  onOpenNewSafeDate: () => void;
  onPlanDateWithCandidate: (candidateId: string) => void;
  onCheckInSafeDate: (planId: string) => void;
}

export default function SafeDatesTabSection({
  safeDatePlans,
  matches,
  onAddReview,
  onAddFeedback,
  onOpenNewSafeDate,
  onPlanDateWithCandidate,
  onCheckInSafeDate,
}: SafeDatesTabSectionProps) {
  // Citas que ya pasaron (Past Dates)
  const [completedPlanIds, setCompletedPlanIds] = useState<string[]>([]);
  const [pastDates, setPastDates] = useState<PastDateItem[]>([
    {
      id: "past-1",
      candidateName:
        matches[0]?.profile.name ||
        safeDatePlans[0]?.candidateName ||
        "Camila Valencia",
      candidatePhoto:
        matches[0]?.profile.photos[0] ||
        safeDatePlans[0]?.candidatePhoto ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80",
      venueName: "Sugar House Coffee (Salt Lake City)",
      venueAddress: "2011 S 1100 E, Salt Lake City, UT 84106",
      dateTime: "Last Saturday · 4:30 PM (Completed)",
    },
  ]);

  // Modal activo al hacer click en los botones de la tarjeta de cita pasada ("review" | "feedback" | null)
  const [activePastModal, setActivePastModal] = useState<
    "review" | "feedback" | null
  >(null);
  const [selectedPastDateId, setSelectedPastDateId] =
    useState<string>("past-1");

  const upcomingDates = safeDatePlans.filter(
    (p) => !completedPlanIds.includes(p.id)
  );

  const selectedPastDate =
    pastDates.find((d) => d.id === selectedPastDateId) || pastDates[0];

  const handleMarkDateCompleted = (plan: SafeDatePlan) => {
    setCompletedPlanIds((prev) => [...prev, plan.id]);
    const newPast: PastDateItem = {
      id: `past-${plan.id}`,
      candidateName: plan.candidateName,
      candidatePhoto: plan.candidatePhoto,
      venueName: plan.venueName,
      venueAddress: plan.venueAddress,
      dateTime: `${plan.dateTime} (Completed)`,
    };
    setPastDates((prev) => [newPast, ...prev]);
    setSelectedPastDateId(newPast.id);
    toast.success(
      "Date moved to Past Dates! Tap Reviews or Feedback on the card."
    );
  };

  // Estado para Reseñas de Citas Pasadas (Todo lo bueno — se publica en el Feed)
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [selectedHighlights, setSelectedHighlights] = useState<string[]>([
    "Great conversation",
    "Safe & welcoming venue",
  ]);
  const [reviewText, setReviewText] = useState("");

  // Estado para Feedback de Citas Pasadas (Qué puede mejorar — privado para el Perfil)
  const [selectedFeedbackTopic, setSelectedFeedbackTopic] = useState<string>(
    "Venue seating & noise"
  );
  const [feedbackText, setFeedbackText] = useState("");

  const POSITIVE_HIGHLIGHTS = [
    "Great conversation",
    "Respectful & kind",
    "Safe & welcoming venue",
    "Punctual",
    "Great chemistry",
  ];

  const IMPROVEMENT_TOPICS = [
    "Venue seating & noise",
    "Date timing / schedule",
    "Check-in reminder timing",
    "Parking / meeting spot clarity",
  ];

  const toggleHighlight = (tag: string) => {
    setSelectedHighlights((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handlePostReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) {
      toast.error("Write a few words about what went great on your past date!");
      return;
    }
    const newReview: DateReviewItem = {
      id: `rev-${Date.now()}`,
      author: `Date with ${selectedPastDate?.candidateName || "Klick Match"}`,
      partnerName: selectedPastDate?.candidateName || "Your Klick",
      venue: selectedPastDate?.venueName || "Sugar House Coffee",
      rating: reviewRating,
      highlights: selectedHighlights,
      comment: reviewText.trim(),
      date: selectedPastDate?.dateTime || "Past Safe Date",
    };
    onAddReview(newReview);
    setReviewText("");
    setActivePastModal(null);
    toast.success("Review posted! It is now visible on the public Feed.");
  };

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) {
      toast.error("Please share what could be improved from this past date.");
      return;
    }
    const newFb: PersonalFeedbackItem = {
      id: `fb-${Date.now()}`,
      topic: `${selectedFeedbackTopic} (${selectedPastDate?.candidateName || "Past Date"})`,
      improvement: feedbackText.trim(),
      date: selectedPastDate?.dateTime || "Past Date",
    };
    onAddFeedback(newFb);
    setFeedbackText("");
    setActivePastModal(null);
    toast.success(
      "Private feedback saved! View your personal feedbacks in Profile → Feedback."
    );
  };

  return (
    <div className="flex-1 w-full px-5 pt-10 pb-24 overflow-y-auto no-scrollbar space-y-7 bg-[#070709]">
      <header className="space-y-2">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-blue-400">
              Safe First Date
            </p>
            <h1 className="text-[26px] font-light tracking-tight text-white">
              Safe Dates
            </h1>
          </div>
          <button
            type="button"
            onClick={onOpenNewSafeDate}
            className="klick-keep-white bg-[linear-gradient(90deg,#008aff_0%,#7c3aed_45%,#ff007f_100%)] inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-white shadow-md active:scale-95 transition-transform cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" /> New
          </button>
        </div>
        <p className="text-sm font-light leading-relaxed text-zinc-400">
          Everything in Klick leads here: meeting in person, safely.
        </p>
      </header>

      {/* Indicador de 4 pasos de protocolo */}
      <ol className="flex items-center justify-between gap-1 border-y border-white/10 py-3">
        {["Plan", "Reminder", "Check-in", "Feedback"].map((s, i) => (
          <li
            key={s}
            className="flex flex-1 flex-col items-center gap-1 text-center"
          >
            <span className="text-xs font-light text-white/60">0{i + 1}</span>
            <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-400">
              {s}
            </span>
          </li>
        ))}
      </ol>

      {/* ========================================================= */}
      {/* 1. CITAS QUE VIENEN (Upcoming Dates)                      */}
      {/* ========================================================= */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-blue-400">
            <Calendar className="h-3.5 w-3.5" />
            Upcoming Dates ({upcomingDates.length})
          </span>
          <span className="text-[10px] text-zinc-500">
            Live safety protocol
          </span>
        </div>

        {upcomingDates.length === 0 ? (
          <div className="rounded-[2rem] border border-white/10 bg-[#0d0e14] flex flex-col items-center gap-3 p-7 text-center">
            <Calendar className="h-6 w-6 text-blue-500" strokeWidth={1.4} />
            <p className="text-xs font-light text-zinc-400">
              No upcoming dates scheduled right now. Plan a new Safe Date above!
            </p>
          </div>
        ) : (
          upcomingDates.map((plan, i) => (
            <div
              key={plan.id}
              className={`rounded-[2rem] border bg-[#0d0e14] p-5 space-y-4 shadow-[0_25px_50px_-25px_rgba(0,0,0,0.6)] ${
                i === 0 ? "border-blue-500/40" : "border-white/10"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-zinc-900">
                    <Image
                      src={plan.candidatePhoto}
                      alt={plan.candidateName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium tracking-tight text-white truncate">
                      Date with {plan.candidateName}
                    </p>
                    <p className="text-xs font-medium text-blue-400">
                      {plan.dateTime}
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-[10px] font-semibold text-blue-400 shrink-0">
                  Upcoming
                </span>
              </div>

              <div className="space-y-1.5 text-sm font-light text-white/80">
                <p className="flex items-center gap-2">
                  <Coffee className="h-4 w-4 text-zinc-400 shrink-0" />
                  <span>{plan.venueName}</span>
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-zinc-400 shrink-0" />
                  <span>{plan.venueAddress}</span>
                </p>
                {plan.trustedContactName && (
                  <p className="flex items-center gap-2 text-xs text-emerald-400/90 pt-0.5">
                    <ShieldCheck className="h-4 w-4 shrink-0" />
                    <span>Trusted Contact: {plan.trustedContactName}</span>
                  </p>
                )}
              </div>

              {/* Botones exclusivos de cita próxima / en curso */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {plan.status === "checked_in" ? (
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-full">
                    <CheckCircle2 className="h-4 w-4" /> Checked-in Safely
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => onCheckInSafeDate(plan.id)}
                    className="klick-keep-white bg-[linear-gradient(90deg,#008aff_0%,#7c3aed_45%,#ff007f_100%)] rounded-full px-5 py-2.5 text-xs font-semibold text-white cursor-pointer active:scale-95 transition-transform shadow-md"
                  >
                    I Arrived Safely
                  </button>
                )}

                <a
                  href={`https://wa.me/?text=Hello%2C%20I%20am%20on%20my%20date%20with%20${encodeURIComponent(
                    plan.candidateName
                  )}%20at%20${encodeURIComponent(
                    plan.venueName
                  )}.%20Klick%20SafeDate%20Protocol.`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/15 px-4 py-2.5 text-xs font-medium text-white/85 hover:bg-white/5 transition-colors"
                >
                  Share Live Status
                </a>
              </div>

              <div className="flex items-center justify-between gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleMarkDateCompleted(plan)}
                  className="rounded-full border border-white/15 bg-white/5 hover:bg-white/10 px-3.5 py-2 text-[11px] font-medium text-zinc-300 transition-colors cursor-pointer"
                >
                  Mark Date as Completed
                </button>

                <a
                  href="tel:911"
                  className="inline-flex items-center gap-1.5 rounded-full border border-red-500/40 px-3.5 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Phone className="h-3.5 w-3.5" /> 911
                </a>
              </div>
            </div>
          ))
        )}
      </section>

      {/* Planear una cita con tus Klicks */}
      {matches.length > 0 && (
        <section className="space-y-3">
          <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-blue-400">
            Plan a safe date with…
          </span>
          <div className="no-scrollbar -mx-1 flex gap-4 overflow-x-auto px-2 py-1">
            {matches.map((m, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onPlanDateWithCandidate(m.profile.id)}
                className="shrink-0 text-center cursor-pointer group"
              >
                <div className="relative h-16 w-16 overflow-hidden rounded-full ring-1 ring-white/30 ring-offset-2 ring-offset-[#070709] group-hover:ring-blue-400 transition-all">
                  <Image
                    src={m.profile.photos[0]}
                    alt={m.profile.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="mt-1.5 text-xs font-medium text-white/85">
                  {m.profile.name.split(" ")[0]}
                </p>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ========================================================= */}
      {/* 2. CITAS QUE YA PASARON (Past Dates — Con Reviews/Feedback) */}
      {/* ========================================================= */}
      <section className="space-y-3 pt-2 border-t border-white/10">
        <div className="flex items-center justify-between pt-2">
          <div>
            <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              <History className="h-3.5 w-3.5" />
              Past Dates ({pastDates.length})
            </span>
            <p className="text-xs font-light text-zinc-400 mt-0.5">
              Tap Reviews or Feedback on a past date card below
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {pastDates.map((past) => (
            <div
              key={past.id}
              className="rounded-[2rem] border border-emerald-500/35 bg-[#0d0e14] p-5 space-y-4 transition-all"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-zinc-900">
                    <Image
                      src={past.candidatePhoto}
                      alt={past.candidateName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium tracking-tight text-white truncate">
                      Date with {past.candidateName}
                    </p>
                    <p className="text-xs font-medium text-emerald-400">
                      {past.dateTime}
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-semibold text-emerald-400 shrink-0">
                  Completed
                </span>
              </div>

              <div className="space-y-1 text-xs font-light text-white/80">
                <p className="flex items-center gap-2">
                  <Coffee className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                  <span>{past.venueName}</span>
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                  <span>{past.venueAddress}</span>
                </p>
              </div>

              {/* Dos botones en la tarjeta: al hacer click se abre el modal de Reviews o Feedback */}
              <div className="flex items-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPastDateId(past.id);
                    setActivePastModal("review");
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full border border-blue-500/35 bg-blue-500/10 hover:bg-blue-500/20 px-4 py-2.5 text-xs font-semibold text-blue-400 transition-colors cursor-pointer"
                >
                  <Star className="h-3.5 w-3.5 fill-blue-400" />
                  <span>Reviews</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedPastDateId(past.id);
                    setActivePastModal("feedback");
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full border border-purple-500/35 bg-purple-500/10 hover:bg-purple-500/20 px-4 py-2.5 text-xs font-semibold text-purple-400 transition-colors cursor-pointer"
                >
                  <MessageSquarePlus className="h-3.5 w-3.5" />
                  <span>Feedback</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* MODAL AL HACER CLICK EN "REVIEWS" O "FEEDBACK"            */}
      {/* ========================================================= */}
      <AnimatePresence>
        {activePastModal === "review" && selectedPastDate && (
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 80 }}
            className="absolute inset-0 z-50 bg-[#07080d]/95 backdrop-blur-2xl flex flex-col p-6 overflow-y-auto no-scrollbar"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Star className="w-5 h-5 fill-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white leading-tight">
                    Past Date Review
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    Share everything good · Visible on the Feed
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActivePastModal(null)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tarjeta resumen de la cita pasada */}
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#10121a] border border-white/10 mb-4">
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-zinc-900">
                <Image
                  src={selectedPastDate.candidatePhoto}
                  alt={selectedPastDate.candidateName}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate">
                  Date with {selectedPastDate.candidateName}
                </p>
                <p className="text-[11px] text-blue-400 truncate">
                  {selectedPastDate.venueName}
                </p>
              </div>
            </div>

            <form
              onSubmit={handlePostReview}
              className="flex flex-col gap-4 flex-1"
            >
              <div className="p-4 rounded-2xl bg-[#10121a] border border-white/10 space-y-4">
                {/* Selector de Estrellas */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-300">
                    Past Date Rating
                  </span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="p-0.5 cursor-pointer transition-transform active:scale-90"
                      >
                        <Star
                          className={`h-5 w-5 ${
                            star <= reviewRating
                              ? "text-amber-400 fill-amber-400"
                              : "text-zinc-600"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chips de cosas positivas */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                    What Went Great?
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {POSITIVE_HIGHLIGHTS.map((tag) => {
                      const active = selectedHighlights.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleHighlight(tag)}
                          className={`px-3 py-1.5 rounded-full text-[11px] font-medium border transition-all cursor-pointer ${
                            active
                              ? "klick-keep-white bg-blue-600 border-blue-500 text-white shadow-sm"
                              : "bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10"
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Texto de reseña positiva */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1.5">
                    Your Positive Review
                  </label>
                  <textarea
                    rows={4}
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder={`Write everything that went great on your date with ${selectedPastDate.candidateName}...`}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] p-3.5 text-xs text-white leading-relaxed outline-none placeholder:text-zinc-500 focus:border-blue-500/50 resize-none no-scrollbar"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="klick-keep-white mt-auto w-full h-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-lg active:scale-[0.98] transition-transform"
              >
                <Sparkles className="h-4 w-4" />
                <span>Post Review to Feed</span>
              </button>
            </form>
          </motion.div>
        )}

        {activePastModal === "feedback" && selectedPastDate && (
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 80 }}
            className="absolute inset-0 z-50 bg-[#07080d]/95 backdrop-blur-2xl flex flex-col p-6 overflow-y-auto no-scrollbar"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <MessageSquarePlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white leading-tight">
                    Past Date Feedback
                  </h3>
                  <p className="text-[11px] text-zinc-400 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-purple-400" />
                    <span>100% Private · Saved in Profile → Feedback</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActivePastModal(null)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tarjeta resumen de la cita pasada */}
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#10121a] border border-white/10 mb-4">
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-zinc-900">
                <Image
                  src={selectedPastDate.candidatePhoto}
                  alt={selectedPastDate.candidateName}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate">
                  Date with {selectedPastDate.candidateName}
                </p>
                <p className="text-[11px] text-purple-400 truncate">
                  {selectedPastDate.venueName}
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSendFeedback}
              className="flex flex-col gap-4 flex-1"
            >
              <div className="p-4 rounded-2xl bg-[#10121a] border border-white/10 space-y-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                    What Could Be Improved?
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {IMPROVEMENT_TOPICS.map((topic) => {
                      const active = selectedFeedbackTopic === topic;
                      return (
                        <button
                          key={topic}
                          type="button"
                          onClick={() => setSelectedFeedbackTopic(topic)}
                          className={`px-3 py-1.5 rounded-full text-[11px] font-medium border transition-all cursor-pointer ${
                            active
                              ? "klick-keep-white bg-purple-600 border-purple-500 text-white shadow-sm"
                              : "bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10"
                          }`}
                        >
                          {topic}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1.5">
                    Private Improvement Note
                  </label>
                  <textarea
                    rows={4}
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder={`Write privately what could be improved from your past date with ${selectedPastDate.candidateName}...`}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] p-3.5 text-xs text-white leading-relaxed outline-none placeholder:text-zinc-500 focus:border-purple-500/50 resize-none no-scrollbar"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="klick-keep-white mt-auto w-full h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-lg active:scale-[0.98] transition-transform"
              >
                <Send className="h-4 w-4" />
                <span>Send Private Feedback</span>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
