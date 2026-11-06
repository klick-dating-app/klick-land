"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { loginHref } from "@/lib/klick/routes";
import {
  Flame,
  Heart,
  MessageCircle,
  Coffee,
  SlidersHorizontal,
  User,
  LogOut,
  CalendarCheck,
  ChevronRight,
} from "lucide-react";
import KlickLogo from "@/components/ui/KlickLogo";
import { VerifiedStar } from "@/components/klick/main/badges";
import type { KlickTab } from "@/components/klick/main/sections/BottomNavBar";
import type { UserGenderRole, SafeDatePlan } from "@/context/KlickAppContext";
import type {
  KlickUserProfile,
  CompatibilityResult,
} from "@/lib/klick/compatibility-engine";
import { cn } from "@/lib/utils";

type ScoredProfile = { profile: KlickUserProfile; compatibility: CompatibilityResult };

const NAV: { tab: KlickTab; label: string; icon: typeof Flame }[] = [
  { tab: "feed", label: "Feed", icon: Flame },
  { tab: "klicks", label: "Klicks", icon: Heart },
  { tab: "inbox", label: "Inbox", icon: MessageCircle },
  { tab: "citas", label: "Safe Dates", icon: Coffee },
  { tab: "perfil", label: "Profile", icon: User },
];

interface WebSidebarProps {
  activeTab: KlickTab;
  showFilterModal: boolean;
  matchesCount: number;
  chatsCount: number;
  userRole: UserGenderRole;
  currentUser: KlickUserProfile;
  onSelectTab: (tab: KlickTab) => void;
  onOpenFilters: () => void;
  onSwitchRole: (role: UserGenderRole) => void;
}

export function WebSidebar({
  activeTab,
  showFilterModal,
  matchesCount,
  chatsCount,
  userRole,
  currentUser,
  onSelectTab,
  onOpenFilters,
  onSwitchRole,
}: WebSidebarProps) {
  const isMale = userRole !== "female";
  const router = useRouter();
  const { user, profile, signOut } = useAuth();
  // Con perfil real el molde lo fija el perfil; el selector Hombre/Mujer es solo para la demo.
  const isSignedIn = !!user && !!profile?.onboarded;
  const exitClass =
    "flex items-center gap-2 px-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/40 hover:text-white/80 transition-colors";
  const item = (active: boolean) =>
    cn(
      "w-full flex items-center gap-3 px-4 h-11 rounded-full text-sm font-medium transition-colors",
      active ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white hover:bg-white/5",
    );

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col justify-between border-r border-white/5 bg-black px-4 py-6">
      <div className="flex flex-col gap-8">
        <Link href="/" className="px-2">
          <KlickLogo size={32} showText textClassName="font-semibold tracking-tight text-lg" priority />
        </Link>

        <nav className="flex flex-col gap-1">
          {NAV.map(({ tab, label, icon: Icon }) => {
            const count = tab === "klicks" ? matchesCount : tab === "inbox" ? chatsCount : 0;
            return (
              <button key={tab} type="button" onClick={() => onSelectTab(tab)} className={item(activeTab === tab)}>
                <Icon className={cn("w-5 h-5", activeTab === tab && "text-blue-500")} />
                <span className="flex-1 text-left">{label}</span>
                {count > 0 && (
                  <span className="min-w-5 h-5 px-1.5 rounded-full bg-blue-600 text-[11px] font-bold text-white flex items-center justify-center">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
          <button type="button" onClick={onOpenFilters} className={item(showFilterModal)}>
            <SlidersHorizontal className={cn("w-5 h-5", showFilterModal && "text-blue-500")} />
            <span className="flex-1 text-left">Filters</span>
          </button>
        </nav>
      </div>

      <div className="flex flex-col gap-4">
        {!isSignedIn && (
        <div className="flex flex-col gap-2">
          <span className="px-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-500">
            Demo profile
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onSwitchRole("male_premium")}
              className={cn(
                "h-10 rounded-full text-xs font-bold transition-all",
                isMale
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                  : "bg-white/5 text-zinc-400 hover:text-white",
              )}
            >
              Hombre
            </button>
            <button
              type="button"
              onClick={() => onSwitchRole("female")}
              className={cn(
                "h-10 rounded-full text-xs font-bold transition-all",
                !isMale
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-pink-500/25"
                  : "bg-white/5 text-zinc-400 hover:text-white",
              )}
            >
              Mujer
            </button>
          </div>
        </div>
        )}

        <button
          type="button"
          onClick={() => onSelectTab("perfil")}
          className="flex items-center gap-3 rounded-2xl bg-white/5 hover:bg-white/10 p-2.5 text-left transition-colors"
        >
          <span
            className="w-10 h-10 rounded-full bg-cover bg-center shrink-0 border border-white/10"
            style={{ backgroundImage: `url(${currentUser.photos[0]})` }}
          />
          <span className="flex-1 min-w-0">
            <span className="flex items-center gap-1 text-sm font-semibold text-white truncate">
              {currentUser.name}
              <VerifiedStar className="h-3.5 w-3.5 shrink-0" />
            </span>
            <span className="block text-xs text-zinc-500 truncate">
              {currentUser.city}, {currentUser.state}
            </span>
          </span>
        </button>

        {isSignedIn ? (
          <button
            type="button"
            onClick={async () => {
              await signOut();
              router.replace(loginHref("web"));
            }}
            className={exitClass}
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </button>
        ) : (
          <Link href={loginHref("web")} className={exitClass}>
            <LogOut className="w-3.5 h-3.5" />
            Exit demo
          </Link>
        )}
      </div>
    </aside>
  );
}

const CATEGORY_LABELS: { key: keyof CompatibilityResult["categoryScores"]; label: string; max: number }[] = [
  { key: "safety", label: "Safety", max: 6 },
  { key: "faith", label: "Faith", max: 5 },
  { key: "marriage", label: "Marriage", max: 5 },
  { key: "family", label: "Family", max: 5 },
  { key: "languages", label: "Languages", max: 4 },
  { key: "distance", label: "Distance", max: 4 },
  { key: "lifestyle", label: "Lifestyle", max: 4 },
  { key: "personality", label: "Personality", max: 4 },
  { key: "hobbies", label: "Hobbies", max: 3 },
  { key: "safeFirstDate", label: "Safe first date", max: 3 },
];

interface WebContextPanelProps {
  activeTab: KlickTab;
  currentCandidate?: KlickUserProfile;
  currentCompatibility?: CompatibilityResult;
  upNext: ScoredProfile[];
  matches: ScoredProfile[];
  safeDatePlans: SafeDatePlan[];
  onSelectTab: (tab: KlickTab) => void;
}

export function WebContextPanel({
  activeTab,
  currentCandidate,
  currentCompatibility,
  upNext,
  matches,
  safeDatePlans,
  onSelectTab,
}: WebContextPanelProps) {
  const card = "rounded-3xl border border-white/5 bg-white/[0.03] p-5";
  const title = "text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-500";
  const upcoming = safeDatePlans.filter((p) => p.status === "scheduled" || p.status === "checked_in");

  return (
    <aside className="hidden xl:flex w-[340px] shrink-0 flex-col gap-4 overflow-y-auto no-scrollbar border-l border-white/5 bg-black px-5 py-6">
      {activeTab === "feed" && currentCandidate && currentCompatibility && (
        <div className={card}>
          <div className="flex items-baseline justify-between">
            <span className={title}>Compatibility</span>
            <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
              {Math.round(currentCompatibility.score)}%
            </span>
          </div>
          <p className="mt-1 text-sm text-zinc-400">
            with <span className="text-white font-medium">{currentCandidate.name}</span>
          </p>
          <div className="mt-4 flex flex-col gap-2.5">
            {CATEGORY_LABELS.map(({ key, label, max }) => {
              const value = currentCompatibility.categoryScores[key] ?? 0;
              return (
                <div key={key} className="flex items-center gap-3">
                  <span className="w-28 shrink-0 text-xs text-zinc-400">{label}</span>
                  <span className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <span
                      className="block h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                      style={{ width: `${Math.min(100, (value / max) * 100)}%` }}
                    />
                  </span>
                  <span className="w-10 text-right text-[11px] text-zinc-500 tabular-nums">
                    {value}/{max}
                  </span>
                </div>
              );
            })}
          </div>
          {currentCompatibility.commonGround.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {currentCompatibility.commonGround.slice(0, 6).map((g) => (
                <span key={g} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-zinc-300">
                  {g}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "feed" && upNext.length > 0 && (
        <div className={card}>
          <span className={title}>Up next</span>
          <div className="mt-3 flex flex-col gap-3">
            {upNext.map(({ profile, compatibility }) => (
              <div key={profile.id} className="flex items-center gap-3">
                <span
                  className="w-11 h-11 rounded-full bg-cover bg-center shrink-0 border border-white/10"
                  style={{ backgroundImage: `url(${profile.photos[0]})` }}
                />
                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-medium text-white truncate">
                    {profile.name}, {profile.age}
                  </span>
                  <span className="block text-xs text-zinc-500 truncate">
                    {profile.city} · {profile.distanceMiles} mi
                  </span>
                </span>
                <span className="text-xs font-semibold text-blue-400 tabular-nums">{Math.round(compatibility.score)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <button type="button" onClick={() => onSelectTab("klicks")} className={cn(card, "text-left hover:bg-white/[0.06] transition-colors")}>
        <div className="flex items-center justify-between">
          <span className={title}>Your Klicks</span>
          <ChevronRight className="w-4 h-4 text-zinc-500" />
        </div>
        {matches.length > 0 ? (
          <div className="mt-3 flex items-center">
            {matches.slice(0, 5).map(({ profile }, i) => (
              <span
                key={profile.id}
                className={cn("w-10 h-10 rounded-full bg-cover bg-center border-2 border-black", i > 0 && "-ml-3")}
                style={{ backgroundImage: `url(${profile.photos[0]})` }}
              />
            ))}
            <span className="ml-3 text-sm text-zinc-300">
              {matches.length} {matches.length === 1 ? "match" : "matches"}
            </span>
          </div>
        ) : (
          <p className="mt-2 text-sm text-zinc-500">No Klicks yet. Like profiles to start matching.</p>
        )}
      </button>

      <button type="button" onClick={() => onSelectTab("citas")} className={cn(card, "text-left hover:bg-white/[0.06] transition-colors")}>
        <div className="flex items-center justify-between">
          <span className={title}>Upcoming Safe Dates</span>
          <ChevronRight className="w-4 h-4 text-zinc-500" />
        </div>
        {upcoming.length > 0 ? (
          <div className="mt-3 flex flex-col gap-3">
            {upcoming.slice(0, 3).map((plan) => (
              <div key={plan.id} className="flex items-center gap-3">
                <span
                  className="w-10 h-10 rounded-full bg-cover bg-center shrink-0 border border-white/10"
                  style={{ backgroundImage: `url(${plan.candidatePhoto})` }}
                />
                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-medium text-white truncate">{plan.candidateName}</span>
                  <span className="flex items-center gap-1 text-xs text-zinc-500 truncate">
                    <CalendarCheck className="w-3 h-3 shrink-0" />
                    {plan.dateTime} · {plan.venueName}
                  </span>
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-zinc-500">No dates planned yet.</p>
        )}
      </button>
    </aside>
  );
}
