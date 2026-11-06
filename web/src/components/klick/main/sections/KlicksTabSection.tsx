"use client";

import React from "react";
import Image from "next/image";
import { Heart, MessageCircle, Coffee } from "lucide-react";
import type { ChatThread, SafeDatePlan } from "@/context/KlickAppContext";
import type {
  KlickUserProfile,
  CompatibilityResult,
} from "@/lib/klick/compatibility-engine";
import { VerifiedStar, ScoreBadge } from "@/components/klick/main/badges";

interface MatchItem {
  profile: KlickUserProfile;
  compatibility: CompatibilityResult;
}

interface KlicksTabSectionProps {
  matches: MatchItem[];
  chats: ChatThread[];
  safeDatePlans: SafeDatePlan[];
  onGoToFeed: () => void;
  onOpenChatFromMatch: (thread?: ChatThread) => void;
  onGoToDates: () => void;
  onPlanDateWithCandidate: (candidateId: string) => void;
}

export default function KlicksTabSection({
  matches,
  chats,
  safeDatePlans,
  onGoToFeed,
  onOpenChatFromMatch,
  onGoToDates,
  onPlanDateWithCandidate,
}: KlicksTabSectionProps) {
  return (
    <div className="flex-1 w-full px-5 pt-10 pb-6 overflow-y-auto no-scrollbar flex flex-col gap-6 bg-[#070709]">
      <header className="space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-blue-400">
          Matches
        </p>
        <h1 className="text-[26px] font-light tracking-tight text-white">
          Your Klicks
        </h1>
        <p className="text-sm font-light text-zinc-400">
          Every Klick is an opportunity. Take the next step: a safe first date.
        </p>
      </header>

      {matches.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <Heart className="h-7 w-7 text-blue-500" strokeWidth={1.4} />
          <p className="text-sm font-light leading-relaxed text-zinc-400">
            No Klicks yet.
            <br />
            Explore compatible profiles in the Feed.
          </p>
          <button
            type="button"
            onClick={onGoToFeed}
            className="mt-2 rounded-full border border-white/15 px-6 py-2.5 text-xs font-medium text-white hover:bg-white/5 cursor-pointer"
          >
            Go to Feed
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 pb-4">
          {matches.map((m, i) => {
            const hasScheduledDate = safeDatePlans.some(
              (d) =>
                d.candidateName === m.profile.name && d.status === "scheduled"
            );
            return (
              <div
                key={i}
                className="rounded-3xl border border-white/10 bg-[#0d0e14] overflow-hidden shadow-[0_20px_40px_-20px_rgba(0,0,0,0.6)]"
              >
                <div className="relative aspect-[3/4] bg-zinc-900">
                  <Image
                    src={m.profile.photos[0]}
                    alt={m.profile.name}
                    fill
                    className="object-cover"
                  />
                  <span className="klick-keep-white absolute left-3 top-3 text-[11px] font-semibold text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.75)]">
                    Klick
                  </span>
                  <div className="klick-keep-white absolute inset-x-3 bottom-3 flex items-center justify-between gap-1 text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
                    <p className="klick-keep-white flex min-w-0 items-center gap-1.5 text-sm font-semibold tracking-tight">
                      <span className="klick-keep-white truncate">
                        {m.profile.name.split(" ")[0]}
                      </span>
                      <VerifiedStar className="h-3.5 w-3.5 shrink-0" />
                    </p>
                    <ScoreBadge score={m.compatibility.score} />
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      const targetThread = chats.find(
                        (c) => c.candidate.id === m.profile.id
                      );
                      onOpenChatFromMatch(targetThread);
                    }}
                    aria-label="Message"
                    className="flex h-10 w-9 shrink-0 items-center justify-center text-zinc-300 hover:text-white cursor-pointer transition-colors"
                  >
                    <MessageCircle
                      className="h-[22px] w-[22px]"
                      strokeWidth={1.5}
                    />
                  </button>
                  {hasScheduledDate ? (
                    <button
                      type="button"
                      onClick={onGoToDates}
                      className="flex h-10 flex-1 items-center justify-center whitespace-nowrap rounded-full border border-blue-500/40 bg-blue-500/10 text-[11px] font-semibold text-blue-400 cursor-pointer"
                    >
                      Date Scheduled
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onPlanDateWithCandidate(m.profile.id)}
                      className="klick-keep-white bg-[linear-gradient(90deg,#008aff_0%,#7c3aed_45%,#ff007f_100%)] flex h-10 flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-full text-[11px] font-semibold text-white cursor-pointer active:scale-95 transition-transform"
                    >
                      <Coffee className="h-3.5 w-3.5" />
                      <span>Plan Date</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

