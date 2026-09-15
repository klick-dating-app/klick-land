"use client";

import { motion } from "framer-motion";
import {
  FileCheck,
  Heart,
  MessageSquare,
  Sparkles,
  Target,
  CheckCircle2
} from "lucide-react";

const stages = [
  {
    id: 1,
    tag: "STAGE 1",
    title: "Honest Profile Creation",
    description: "Create your 360° profile highlighting your true personality, tastes, and interests.",
    icon: FileCheck,
    supportText: "How does Klick support you in this stage?",
    bullets: [
      { text: "Photo and identity profile verification." },
      { text: "Initial compatibility and interests test." },
      { text: "Clear definition of relationship expectations." }
    ],
    objective: "build an authentic and honest presentation card."
  },
  {
    id: 2,
    tag: "STAGE 2",
    title: "Algoritmo Klick!",
    description: "Our system matches values, lifestyle, and shared passions.",
    icon: Sparkles,
    supportText: "How does Klick support you in this stage?",
    bullets: [
      { text: "Daily suggestions aligned with your preferences." },
      { text: "Location, culture, and language filters." },
      { text: "See who likes you (available on the Pro plan)." }
    ],
    objective: "discover profiles with true affinity."
  },
  {
    id: 3,
    tag: "STAGE 3",
    title: "Conversation & Direct Connection",
    description: "Start fluid and safe chats without barriers or detours.",
    icon: MessageSquare,
    supportText: "How does Klick support you in this stage?",
    bullets: [
      { text: "Direct and instant messaging." },
      { text: "Cultural exchange and shared experiences." },
      { text: "Fluid and respectful communication tips." }
    ],
    objective: "create a real spark and build mutual trust."
  },
  {
    id: 4,
    tag: "STAGE 4",
    title: "The Date & Real Meeting",
    description: "Take the step toward a safe and memorable meeting.",
    icon: Heart,
    supportText: "How does Klick support you in this stage?",
    bullets: [
      { text: "Safety tips for the first date." },
      { text: "Venue and experience recommendations." },
      { text: "Safe community focused on lasting relationships." }
    ],
    objective: "meet your ideal partner in the real world."
  }
];

export default function StageDetails() {
  return (
    <section className="pt-32 bg-white overflow-hidden font-sans" id="fases-viaje">
      <div className="container mx-auto px-6 max-w-[1600px]">

        {/* Header */}
        <div className="mb-16">
          <h2 className="text-4xl md:text-6xl font-medium tracking-tight mb-4 text-slate-900">
            The path to <br />
            your ideal partner!
          </h2>
          <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-2xl">
            Learn the simple steps to connect authentically, honestly, and safely on Klick.
          </p>
        </div>

        {/* CSS Grid for nodes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-32">
            {stages.map((stage) => {
              const Icon = stage.icon;
              return (
                <div
                  key={stage.id}
                  className="group relative w-full flex flex-col justify-start rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.06)] bg-white/90 backdrop-blur-sm border border-slate-200 transition-shadow hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
                >
                  {/* Content Layout */}
                  <div className="relative p-6 w-full flex flex-col h-full z-10">
                    
                    {/* Header line */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="text-[#9b4dca]">
                        <Icon size={24} />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#2d1b4e] to-[#9b4dca]">
                        {stage.tag}
                      </span>
                    </div>
                    
                    {stage.title && (
                      <h4 className="text-lg md:text-xl font-medium tracking-tight leading-snug mb-2 text-slate-900">
                        {stage.title}
                      </h4>
                    )}
                    
                    <p className="text-slate-600 text-xs md:text-sm leading-relaxed mb-5">
                      {stage.description}
                    </p>

                    {/* How we help section */}
                    <div className="flex-1 border-t border-slate-100 pt-5">
                      <p className="font-medium text-xs mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#2d1b4e] to-[#9b4dca]">
                        {stage.supportText}
                      </p>
                      
                      <ul className="space-y-3 mb-6">
                        {stage.bullets.map((bullet, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                            <span className="text-xs text-slate-600 leading-relaxed">{bullet.text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Objective */}
                    <div className="mt-auto flex items-start gap-2 pt-2">
                      <Target className="w-4 h-4 text-[#9b4dca] shrink-0 mt-0.5" />
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        <strong className="text-slate-800 font-medium">Objective: </strong> 
                        {stage.objective}
                      </p>
                    </div>

                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
}
