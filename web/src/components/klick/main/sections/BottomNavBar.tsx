"use client";

import React from "react";
import {
  Flame,
  Heart,
  MessageCircle,
  Coffee,
  SlidersHorizontal,
  User,
} from "lucide-react";

export type KlickTab = "feed" | "klicks" | "inbox" | "citas" | "perfil";

interface BottomNavBarProps {
  activeTab: KlickTab;
  showFilterModal: boolean;
  matchesCount: number;
  chatsCount: number;
  onSelectTab: (tab: KlickTab) => void;
  onOpenFilters: () => void;
}

export default function BottomNavBar({
  activeTab,
  showFilterModal,
  matchesCount,
  chatsCount,
  onSelectTab,
  onOpenFilters,
}: BottomNavBarProps) {
  return (
    <div className="w-full h-16 bg-[#08080c]/95 border-t border-white/10 backdrop-blur-md px-4 flex items-center justify-around z-40">
      <button
        type="button"
        onClick={() => onSelectTab("feed")}
        className={`flex flex-col items-center gap-0.5 cursor-pointer ${
          activeTab === "feed"
            ? "text-blue-500"
            : "text-zinc-500 hover:text-zinc-300"
        }`}
      >
        <Flame className="w-5 h-5" />
        <span className="text-[10px] font-semibold">Feed</span>
      </button>

      <button
        type="button"
        onClick={() => onSelectTab("klicks")}
        className={`flex flex-col items-center gap-0.5 cursor-pointer relative ${
          activeTab === "klicks"
            ? "text-blue-500"
            : "text-zinc-500 hover:text-zinc-300"
        }`}
      >
        <Heart className="w-5 h-5" />
        <span className="text-[10px] font-semibold">Klicks</span>
        {matchesCount > 0 && (
          <span className="absolute -top-1 right-1 w-2 h-2 rounded-full bg-blue-500" />
        )}
      </button>

      <button
        type="button"
        onClick={() => onSelectTab("inbox")}
        className={`flex flex-col items-center gap-0.5 cursor-pointer relative ${
          activeTab === "inbox"
            ? "text-blue-500"
            : "text-zinc-500 hover:text-zinc-300"
        }`}
      >
        <MessageCircle className="w-5 h-5" />
        <span className="text-[10px] font-semibold">Inbox</span>
        {chatsCount > 0 && (
          <span className="absolute -top-1 right-1 w-2 h-2 rounded-full bg-blue-500" />
        )}
      </button>

      <button
        type="button"
        onClick={() => onSelectTab("citas")}
        className={`flex flex-col items-center gap-0.5 cursor-pointer ${
          activeTab === "citas"
            ? "text-blue-500"
            : "text-zinc-500 hover:text-zinc-300"
        }`}
      >
        <Coffee className="w-5 h-5" />
        <span className="text-[10px] font-semibold">Dates</span>
      </button>

      <button
        type="button"
        onClick={onOpenFilters}
        className={`flex flex-col items-center gap-0.5 cursor-pointer ${
          showFilterModal
            ? "text-blue-500"
            : "text-zinc-500 hover:text-zinc-300"
        }`}
      >
        <SlidersHorizontal className="w-5 h-5" />
        <span className="text-[10px] font-semibold">Filters</span>
      </button>

      <button
        type="button"
        onClick={() => onSelectTab("perfil")}
        className={`flex flex-col items-center gap-0.5 cursor-pointer ${
          activeTab === "perfil"
            ? "text-blue-500"
            : "text-zinc-500 hover:text-zinc-300"
        }`}
      >
        <User className="w-5 h-5" />
        <span className="text-[10px] font-semibold">Profile</span>
      </button>
    </div>
  );
}

