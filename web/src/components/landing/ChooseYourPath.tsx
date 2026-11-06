"use client";

import { sendMetaEvent } from "@/lib/meta-events";
import {
  Search,
  ClipboardCheck,
  MessageSquare,
  MapPin,
  Activity,
  Heart,
  ShieldCheck,
  Users,
  Clock,
  Sparkles,
  Zap,
  CheckCircle2,
  Crown,
} from "lucide-react";

const paths = [
  {
    title: "Klick Basic",
    price: "$9.99",
    period: "/month",
    subtitle:
      "The simple and authentic way to meet like-minded people safely.",
    features: [
      { text: "360° Complete Profile Creation", icon: Activity },
      { text: "Affinity Algorithm Klick!", icon: Sparkles },
      { text: "Daily Likes & Connections", icon: Heart },
      { text: "Direct Chat with your Matches", icon: MessageSquare },
      { text: "Basic Location & Age Filters", icon: MapPin },
      { text: "Safety Profile Verification", icon: ShieldCheck },
    ],
    href: "https://chat.whatsapp.com/GVlnQKclJuP63qZjeE0r24",
    buttonText: "Choose $9.99 Plan",
    highlighted: false,
    glowColor: "bg-white/20",
    tag: "Starter Plan",
    tagColor:
      "bg-transparent border-l border-b border-white/20 text-white font-semibold",
  },
  {
    title: "Klick Pro",
    price: "$29.99",
    period: "/month",
    subtitle:
      "The unlimited experience with maximum visibility and advanced dating features.",
    features: [
      { text: "Everything included in Klick Basic", icon: CheckCircle2 },
      { text: "Unlimited Likes & Interactions", icon: Zap },
      { text: "See who likes you before connecting", icon: Search },
      { text: "Advanced Lifestyle & Values Filters", icon: ClipboardCheck },
      { text: "Weekly Profile Visibility Boost", icon: Sparkles },
      {
        text: "Unlimited Rewinds so you never miss an opportunity",
        icon: Clock,
      },
      { text: "Incognito Mode & Total Privacy Control", icon: ShieldCheck },
    ],
    href: "https://chat.whatsapp.com/GVlnQKclJuP63qZjeE0r24",
    buttonText: "Choose $29.99 Plan",
    highlighted: true,
    glowColor: "bg-blue-500/25",
    tag: "Most Popular!",
    tagColor:
      "bg-blue-600/20 border-l border-b border-blue-500/40 text-blue-300 font-semibold",
  },
  {
    title: "Klick VIP",
    price: "$49.99",
    period: "/month",
    subtitle:
      "Priority matchmaking, Safe First Date concierge, and complete VIP access.",
    features: [
      { text: "Everything included in Klick Pro", icon: CheckCircle2 },
      { text: "Priority Safe First Date Invitations", icon: Crown },
      { text: "Full 10-Pillar Compatibility Radar", icon: Sparkles },
      { text: "Dedicated Matchmaking & Date Coaching", icon: Users },
      { text: "Top Placement in Discovery Feed", icon: Zap },
      { text: "Verified Date Place & Outfit Concierge", icon: MapPin },
      { text: "VIP Trust & Safety Priority Support", icon: ShieldCheck },
    ],
    href: "https://chat.whatsapp.com/GVlnQKclJuP63qZjeE0r24",
    buttonText: "Choose $49.99 Plan",
    highlighted: false,
    glowColor: "bg-purple-500/25",
    tag: "VIP Experience",
    tagColor:
      "bg-purple-600/20 border-l border-b border-purple-500/40 text-purple-300 font-semibold",
  },
];

export default function ChooseYourPath() {
  return (
    <section
      id="planes"
      className="pt-20 md:pt-28 pb-16 md:pb-20 bg-[#050507] relative overflow-hidden font-sans"
    >
      {/* Sutil efecto de cuadrícula de fondo */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />

      {/* Degradado superior para suavizar la unión con el Hero */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-[#050507] -translate-y-full" />

      <div className="container max-w-[1500px] mx-auto px-6 relative z-10">
        {/* Header Centrado Simplificado */}
        <div className="mb-12 md:mb-20 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-normal tracking-tight text-white leading-tight mb-4">
            Choose Your Plan on Klick
          </h2>
          <p className="text-slate-400 text-base max-w-2xl mx-auto leading-relaxed">
            Select the ideal path for your goal. Exclusive tools and features to
            connect authentically and find your ideal partner.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 max-w-6xl gap-5 md:gap-6 lg:gap-8 mx-auto items-stretch">
          {paths.map((path, index) => (
            <div key={index} className="relative group w-full flex flex-col">
              {/* Glow Effect Background */}
              <div
                className={`absolute -inset-2 ${path.glowColor} rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />

              {/* Card Content */}
              <div
                className={`relative flex-1 bg-black border ${
                  path.highlighted ? "border-blue-500/40" : "border-white/10"
                } rounded-[2rem] p-5 md:p-6 lg:p-8 flex flex-col ring-1 ring-white/5 shadow-2xl overflow-hidden hover:bg-black transition-colors duration-300`}
              >
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl" />

                {/* Floating Tag */}
                {path.tag && (
                  <div
                    className={`absolute top-0 right-0 ${path.tagColor} text-white text-[10px] font-medium uppercase tracking-widest px-3 py-1.5 md:px-5 md:py-2 rounded-bl-3xl shadow-lg z-20`}
                  >
                    {path.tag}
                  </div>
                )}

                {/* Title, Price & Subtitle */}
                <div className="flex flex-col items-center text-center mb-4 md:mb-6 min-h-[7.5rem] justify-start shrink-0 pt-2">
                  <h3 className="text-xl md:text-2xl font-normal text-white tracking-tight mb-2 leading-relaxed">
                    {path.title}
                  </h3>
                  <div className="flex items-baseline justify-center gap-1 mb-3">
                    <span className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
                      {path.price}
                    </span>
                    <span className="text-xs md:text-sm text-slate-400 font-light">
                      {path.period}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm font-light leading-relaxed">
                    {path.subtitle}
                  </p>
                </div>

                {/* CTA Button */}
                <div className="flex flex-col items-center gap-3 mt-2 mb-5 md:mb-8 w-full shrink-0">
                  <a
                    href={path.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      sendMetaEvent("Lead", {
                        source: `ChooseYourPath: ${path.title} (${path.price})`,
                      })
                    }
                    className="w-full py-2.5 md:py-3 rounded-full bg-[#1d61e7] text-white font-medium text-base shadow-lg hover:bg-[#1652c7] hover:scale-[1.03] active:scale-95 transition-all duration-300 border-0 text-center"
                    aria-label={`Ir a ${path.title}`}
                  >
                    {path.buttonText}
                  </a>
                </div>

                <div className="space-y-4 md:space-y-5 flex-1">
                  <p className="text-white font-normal text-xs uppercase tracking-widest opacity-50 mb-3 md:mb-5 text-center">
                    What&apos;s included in this plan?
                  </p>
                  {path.features.map((feature, fIndex) => (
                    <li
                      key={fIndex}
                      className="flex items-start gap-3 text-slate-300 group/item cursor-default leading-loose"
                    >
                      <div className="mt-1.5 transition-transform group-hover/item:scale-110 shrink-0">
                        <feature.icon
                          className="w-5 h-5 text-white"
                          strokeWidth={1.5}
                        />
                      </div>
                      <span className="text-sm font-normal text-slate-100 group-hover/item:text-white transition-colors">
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
