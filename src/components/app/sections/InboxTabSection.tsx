"use client";

import React from "react";
import Image from "next/image";
import {
  ChevronLeft,
  Calendar,
  ShieldCheck,
  Coffee,
  Sparkles,
  Send,
  Lock,
} from "lucide-react";
import type { ChatThread } from "@/context/KlickAppContext";
import type {
  KlickUserProfile,
  CompatibilityResult,
} from "@/lib/klick/compatibility-engine";
import { VerifiedStar, ScoreRing } from "@/components/app/MobileAppBadges";

interface MatchItem {
  profile: KlickUserProfile;
  compatibility: CompatibilityResult;
}

interface InboxTabSectionProps {
  currentUserId: string;
  matches: MatchItem[];
  chats: ChatThread[];
  activeChatThread: ChatThread | null;
  typedMessage: string;
  canInitiateChat: boolean;
  onSelectChatThread: (thread: ChatThread | null) => void;
  onChangeTypedMessage: (val: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
  onPlanDateWithCandidate: (candidateId: string) => void;
  onOpenReport: () => void;
  onOpenUpgrade: () => void;
}

export default function InboxTabSection({
  currentUserId,
  matches,
  chats,
  activeChatThread,
  typedMessage,
  canInitiateChat,
  onSelectChatThread,
  onChangeTypedMessage,
  onSendMessage,
  onPlanDateWithCandidate,
  onOpenReport,
  onOpenUpgrade,
}: InboxTabSectionProps) {
  return (
    <div className="flex-1 w-full flex flex-col bg-[#070709] overflow-hidden">
      {!activeChatThread ? (
        <div className="flex-1 w-full px-5 pt-10 pb-6 overflow-y-auto no-scrollbar space-y-7">
          <header className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-blue-400">
              Messages
            </p>
            <h1 className="text-[26px] font-light tracking-tight text-white">
              Inbox
            </h1>
          </header>

          {/* Nuevos Klicks en fila horizontal con anillo */}
          {matches.length > 0 && (
            <section className="space-y-3.5">
              <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-blue-400">
                New Klicks
              </span>
              <div className="no-scrollbar -mx-1 flex gap-5 overflow-x-auto px-2 py-1.5">
                {matches.map((m, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      const existing = chats.find(
                        (c) => c.candidate.id === m.profile.id
                      );
                      if (existing) {
                        onSelectChatThread(existing);
                      } else {
                        onSelectChatThread({
                          id: `thread_${m.profile.id}`,
                          candidate: m.profile,
                          compatibility: m.compatibility,
                          lastMessageAt: "New",
                          messages: [],
                        });
                      }
                    }}
                    className="shrink-0 text-center cursor-pointer group"
                  >
                    <div className="relative h-[72px] w-[72px] overflow-hidden rounded-full ring-1 ring-white/30 ring-offset-[3px] ring-offset-[#070709] group-hover:ring-blue-400 transition-all">
                      <Image
                        src={m.profile.photos[0]}
                        alt={m.profile.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="mt-2 text-xs font-medium text-white/80">
                      {m.profile.name.split(" ")[0]}
                    </p>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Lista de conversaciones con líneas finas y ScoreRing */}
          <ul className="divide-y divide-white/10 border-y border-white/10">
            {chats.map((thread) => (
              <li key={thread.id}>
                <button
                  type="button"
                  onClick={() => onSelectChatThread(thread)}
                  className="w-full flex items-center gap-4 py-4 transition active:opacity-70 cursor-pointer text-left"
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-zinc-900">
                    <Image
                      src={thread.candidate.photos[0]}
                      alt={thread.candidate.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1.5 text-[16px] font-medium tracking-tight text-white">
                      <span className="truncate">{thread.candidate.name}</span>
                      <VerifiedStar className="h-3.5 w-3.5 shrink-0" />
                    </p>
                    <p className="truncate text-sm font-light text-zinc-400 mt-0.5">
                      {thread.messages[thread.messages.length - 1]?.text ||
                        "Say hello 👋"}
                    </p>
                  </div>
                  <ScoreRing score={thread.compatibility.score} size={46} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        /* Vista de Chat Abierto — Diseño Editorial v9 */
        <div className="flex-1 w-full flex flex-col justify-between overflow-hidden bg-[#070709]">
          {/* Header Glass del Chat */}
          <header className="w-full px-3 pt-10 pb-3 bg-[#070709]/80 backdrop-blur-xl border-b border-white/10 flex items-center gap-3 z-10">
            <button
              type="button"
              onClick={() => onSelectChatThread(null)}
              aria-label="Close chat"
              className="p-1.5 text-white/70 hover:text-white cursor-pointer"
            >
              <ChevronLeft className="h-6 w-6" strokeWidth={1.6} />
            </button>
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-zinc-900">
              <Image
                src={activeChatThread.candidate.photos[0]}
                alt={activeChatThread.candidate.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 truncate text-base font-medium leading-tight tracking-tight text-white">
                <span className="truncate">
                  {activeChatThread.candidate.name}
                </span>
                <VerifiedStar className="h-4 w-4 shrink-0" />
              </p>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400 mt-0.5">
                <span className="bg-[linear-gradient(90deg,#008aff_0%,#7c3aed_24%,#ff007f_48%,#ff1744_72%,#ff8c00_100%)] bg-clip-text text-transparent font-bold">
                  {Math.round(activeChatThread.compatibility.score)}%
                </span>{" "}
                K
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                onPlanDateWithCandidate(activeChatThread.candidate.id)
              }
              aria-label="Plan Safe First Date"
              className="p-2 text-blue-400 hover:text-blue-300 cursor-pointer"
              title="Plan Safe Date"
            >
              <Calendar className="h-5 w-5" strokeWidth={1.6} />
            </button>
            <button
              type="button"
              onClick={onOpenReport}
              aria-label="Safety menu"
              className="p-2 text-zinc-400 hover:text-white cursor-pointer"
              title="Safety & Report"
            >
              <ShieldCheck className="h-5 w-5" strokeWidth={1.6} />
            </button>
          </header>

          {/* Banner Siguiente Paso: Invitar a un café seguro */}
          <button
            type="button"
            onClick={() =>
              onPlanDateWithCandidate(activeChatThread.candidate.id)
            }
            className="w-full flex items-center gap-3 border-b border-white/10 bg-blue-500/10 hover:bg-blue-500/15 px-4 py-3 text-left transition-colors cursor-pointer"
          >
            <Coffee
              className="h-5 w-5 shrink-0 text-blue-400"
              strokeWidth={1.6}
            />
            <span className="flex-1 text-xs font-medium leading-snug text-zinc-200">
              Next step: invite{" "}
              {activeChatThread.candidate.name.split(" ")[0]} to a safe coffee
              date
            </span>
            <span className="text-xs font-semibold text-blue-400">Plan</span>
          </button>

          {/* Mensajes */}
          <div className="flex-1 space-y-2.5 overflow-y-auto no-scrollbar p-4">
            {activeChatThread.compatibility.commonGround.length > 0 && (
              <div className="space-y-2.5 rounded-2xl border border-blue-500/25 bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-4 mb-3">
                <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-400">
                  <Sparkles className="h-3.5 w-3.5" /> Icebreaker Common Ground
                </span>
                <ul className="space-y-1.5">
                  {activeChatThread.compatibility.commonGround
                    .slice(0, 3)
                    .map((g, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 text-xs font-light text-white/85"
                      >
                        <span className="h-1 w-1 shrink-0 rounded-full bg-blue-400" />
                        {g}
                      </li>
                    ))}
                </ul>
              </div>
            )}

            {activeChatThread.messages.map((msg) => {
              const isMe = msg.senderId === currentUserId;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    isMe ? "items-end" : "items-start"
                  }`}
                >
                  <p
                    className={`max-w-[78%] whitespace-pre-wrap break-words px-4 py-2.5 text-[14px] font-light leading-snug ${
                      isMe
                        ? "klick-keep-white bg-[linear-gradient(90deg,#008aff_0%,#7c3aed_45%,#ff007f_100%)] rounded-[1.4rem] rounded-br-md text-white shadow-md"
                        : "rounded-[1.4rem] rounded-bl-md border border-white/10 bg-white/[0.06] text-zinc-100"
                    }`}
                  >
                    {msg.text}
                  </p>
                  <span className="text-[9px] text-zinc-500 mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Input de Mensaje Minimalista */}
          {canInitiateChat ? (
            <form
              onSubmit={onSendMessage}
              className="flex items-center gap-2 p-3 border-t border-white/10 bg-[#070709]"
            >
              <input
                type="text"
                value={typedMessage}
                onChange={(e) => onChangeTypedMessage(e.target.value)}
                maxLength={2000}
                placeholder={`Message ${activeChatThread.candidate.name.split(" ")[0]}…`}
                className="flex-1 rounded-full border border-white/15 bg-transparent px-5 py-3 text-sm font-light text-white outline-none placeholder:text-zinc-500 focus:border-white/40 transition-colors"
              />
              <button
                type="submit"
                className="p-2.5 text-blue-500 hover:text-blue-400 active:scale-90 transition-transform cursor-pointer"
                aria-label="Send"
              >
                <Send className="h-5 w-5" strokeWidth={1.7} />
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={onOpenUpgrade}
              className="w-full flex items-center justify-center gap-2 border-t border-white/10 p-4 text-xs font-medium text-blue-400 hover:text-blue-300 cursor-pointer"
            >
              <Lock className="h-4 w-4" /> Unlock VIP to start the conversation
            </button>
          )}
        </div>
      )}
    </div>
  );
}

