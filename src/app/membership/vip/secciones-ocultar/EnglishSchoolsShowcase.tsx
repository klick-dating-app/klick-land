"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ChevronRight, Play, Volume2, VolumeX, Sparkles, Heart } from "lucide-react";

const communities = [
    {
        id: "slc",
        title: "Salt Lake City & Sugar House",
        location: "Salt Lake County, Utah",
        description: "El epicentro de nuestra comunidad. Cafés tranquilos, eventos culturales y rutas de senderismo seguras para conectar con solteros que comparten tus valores.",
        videoId: "fXk63YvK_38",
        thumbnail: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: "provo",
        title: "Provo & Orem Hub",
        location: "Utah Valley",
        description: "Comunidad activa y dinámica en Utah Valley. Conexiones enfocadas en metas serias, matrimonio y principios de fe compartidos.",
        videoId: "M_865U8t6_Y",
        thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: "davis",
        title: "Davis & Weber Valley",
        location: "Northern Utah",
        description: "Espacios familiares, paseos escénicos y actividades al aire libre perfectas para coordinar tus primeras citas del protocolo Safe First Date.",
        videoId: "j7_L8hG_h9M",
        thumbnail: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: "stgeorge",
        title: "St. George & Red Cliffs",
        location: "Southern Utah",
        description: "Clima cálido todo el año y paisajes impresionantes para citas activas, senderismo seguro y conversaciones significativas.",
        videoId: "C9C3dUpS_XU",
        thumbnail: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: "mesa",
        title: "Mesa & Gilbert",
        location: "Arizona LDS Community",
        description: "Comunidad consolidada con valores afines, búsqueda de matrimonio eterno y compatibilidad en estilo de vida.",
        videoId: "iHk9pT-l-3E",
        thumbnail: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: "rexburg",
        title: "Rexburg & Idaho Falls",
        location: "Idaho Community",
        description: "Ambiente enfocado en relaciones estables, metas familiares y compatibilidad profunda comprobada.",
        videoId: "C8vO46pE6vY",
        thumbnail: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=600&auto=format&fit=crop"
    }
];

export default function CommunityEventsShowcase() {
    const [selectedCommunity, setSelectedCommunity] = useState(communities[0]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);

    return (
        <section className="py-24 bg-slate-900 text-white relative overflow-hidden" id="comunidades-klick">
            {/* Background ambient glow */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-600/10 blur-[140px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-3xl mb-16">
                    <span className="text-pink-400 font-bold tracking-wider text-xs uppercase bg-pink-500/10 px-3.5 py-1.5 rounded-full border border-pink-500/20 inline-flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" /> Comunidades Destacadas
                    </span>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight mt-4 text-white">
                        Conecta en las Mejores <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-[#9b4dca]">Zonas de Utah y EE.UU.</span>
                    </h2>
                    <p className="text-slate-400 font-medium mt-4 text-base md:text-lg">
                        Descubre comunidades activas de solteros con valores afines y lugares recomendados para primeras citas seguras.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Lista de Comunidades */}
                    <div className="lg:col-span-5 flex flex-col gap-3">
                        {communities.map((comm) => {
                            const isSelected = selectedCommunity.id === comm.id;
                            return (
                                <button
                                    key={comm.id}
                                    onClick={() => {
                                        setSelectedCommunity(comm);
                                        setIsPlaying(false);
                                    }}
                                    className={`w-full text-left p-4 md:p-5 rounded-2xl transition-all duration-300 flex items-center justify-between border ${
                                        isSelected
                                            ? "bg-white/10 border-pink-500 shadow-lg shadow-pink-500/10"
                                            : "bg-white/[0.03] border-white/5 hover:bg-white/[0.06] hover:border-white/10"
                                    }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                                            isSelected ? "bg-pink-600 text-white" : "bg-white/5 text-slate-400"
                                        }`}>
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white text-base leading-snug">{comm.title}</h4>
                                            <p className="text-xs text-slate-400 mt-0.5">{comm.location}</p>
                                        </div>
                                    </div>
                                    <ChevronRight className={`w-5 h-5 transition-transform ${isSelected ? "text-pink-400 translate-x-1" : "text-slate-600"}`} />
                                </button>
                            );
                        })}
                    </div>

                    {/* Visor Multimedia de la Comunidad */}
                    <div className="lg:col-span-7">
                        <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-slate-950 shadow-2xl">
                            <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                                <img
                                    src={selectedCommunity.thumbnail}
                                    alt={selectedCommunity.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                                <div className="absolute bottom-6 left-6 right-6">
                                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-pink-500/80 text-white backdrop-blur-sm inline-flex items-center gap-1 mb-2">
                                        <Heart className="w-3 h-3 fill-current" /> Comunidad Verificada
                                    </span>
                                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{selectedCommunity.title}</h3>
                                    <p className="text-slate-300 text-sm md:text-base line-clamp-3 leading-relaxed">
                                        {selectedCommunity.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
