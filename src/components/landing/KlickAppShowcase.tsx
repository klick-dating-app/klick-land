"use client";

import { sendMetaEvent } from "@/lib/meta-events";

export default function KlickAppShowcase() {
    return (
        <section className="py-16 md:py-24 lg:py-28 bg-black text-white overflow-hidden font-sans">
            <div className="container px-6 md:px-12 mx-auto">
                <div className="flex flex-col items-center text-center group">
                    <p className="text-white font-medium mb-6 tracking-tight uppercase text-sm md:text-base">
                        Connect with like-minded people from anywhere
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 mb-8">
                        <h2 className="text-5xl md:text-7xl font-medium tracking-tighter text-white leading-none">
                            Download
                        </h2>
                        <div className="w-16 h-16 md:w-24 md:h-24 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform duration-500 overflow-hidden shrink-0">
                            <img
                                src="/icons/new-icon-klick.png"
                                alt="Klick Logo"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <h2 className="text-5xl md:text-7xl font-medium tracking-tighter text-white leading-none">
                            Klick
                        </h2>
                    </div>

                    <h2 className="text-5xl md:text-7xl font-medium tracking-tighter text-white mb-10 leading-none">
                        to find a partner
                    </h2>

                    <p className="text-lg md:text-xl text-white/60 font-medium mb-12 max-w-2xl tracking-tight">
                        Used by thousands of people seeking authentic, honest, and lasting connections
                    </p>

                    {/* Clean Image Only */}
                    <a
                        href="https://chat.whatsapp.com/GVlnQKclJuP63qZjeE0r24"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => sendMetaEvent('Lead', { source: 'MatchAppShowcase: Descargar Apps Image' })}
                        className="inline-block"
                    >
                        <img
                            src="/5297951-7905525-Photoroom.png"
                            alt="Download Klick"
                            className="w-44 sm:w-56 md:w-64 lg:w-72 h-auto object-contain transition-transform duration-300 hover:scale-105"
                        />
                    </a>
                </div>
            </div>
        </section>
    );
}
