"use client";

import { Instagram, ChevronLeft, ChevronRight, Play, Heart } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

const communityStories = [
  {
    id: 1,
    handle: "@klickdating",
    title: "Conexiones reales basadas en valores LDS.",
    thumb: "/assets/about-community.jpg",
    video: "/assets/chatbot_media/9.mp4"
  },
  {
    id: 2,
    handle: "@klickdating",
    title: "Nuestra primera cita segura en Salt Lake City.",
    thumb: "/assets/hero-newyork.jpg",
    video: "/assets/chatbot_media/8.mp4"
  },
  {
    id: 3,
    handle: "@klickdating",
    title: "Perfiles 100% verificados y sin sorpresas.",
    thumb: "/assets/hero-living-space.jpg",
    video: "/assets/chatbot_media/7.mp4"
  },
  {
    id: 4,
    handle: "@klickdating",
    title: "Compatibilidad profunda que sí funciona.",
    thumb: "/assets/about-community.jpg",
    video: "/assets/chatbot_media/6.mp4"
  },
  {
    id: 5,
    handle: "@klickdating",
    title: "Encontrando a la persona adecuada en Utah.",
    thumb: "/assets/hero-newyork.jpg",
    video: "/assets/chatbot_media/9.mp4"
  },
  {
    id: 6,
    handle: "@klickdating",
    title: "Educación y respeto para construir una relación sólida.",
    thumb: "/assets/hero-living-space.jpg",
    video: "/assets/chatbot_media/8.mp4"
  }
];

export default function JoinOurCommunity() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hoveredCardId, setHoveredCardId] = useState<number | null>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-24 bg-black text-white overflow-hidden relative" id="historias-comunidad">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-bold uppercase tracking-wider mb-4">
              <Heart className="w-3.5 h-3.5 fill-current" /> Comunidad KLICK!
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight">
              Únete a Nuestra <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-[#9b4dca]">Comunidad de Parejas Reales</span>
            </h2>
            <p className="text-slate-400 font-medium max-w-2xl mt-4 text-base md:text-lg">
              Descubre experiencias auténticas de miembros que encontraron a su pareja ideal con nuestra tecnología de compatibilidad y seguridad.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('left')}
              className="rounded-full bg-white/5 border-white/10 hover:bg-white/10 text-white w-12 h-12"
              aria-label="Scroll izquierda"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('right')}
              className="rounded-full bg-white/5 border-white/10 hover:bg-white/10 text-white w-12 h-12"
              aria-label="Scroll derecha"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-8 pt-2 snap-x snap-mandatory scrollbar-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {communityStories.map((story) => (
            <div
              key={story.id}
              className="min-w-[280px] md:min-w-[320px] max-w-[320px] rounded-3xl overflow-hidden bg-slate-900 border border-white/10 snap-start flex flex-col justify-between group relative"
              onMouseEnter={() => setHoveredCardId(story.id)}
              onMouseLeave={() => setHoveredCardId(null)}
            >
              <div className="relative aspect-[9/14] w-full overflow-hidden">
                <img
                  src={story.thumb}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs font-semibold">
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/10 flex items-center gap-1.5">
                    <Instagram className="w-3.5 h-3.5 text-pink-400" /> {story.handle}
                  </span>
                </div>

                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-lg font-bold text-white leading-snug">
                    {story.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
