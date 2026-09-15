"use client";

import { motion } from "framer-motion";
import { FadeIn, ScaleIn } from "./Animations";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ShoppingCart } from "lucide-react";

export default function BookPromoSection() {
    return (
        <section className="bg-black py-32 relative overflow-hidden font-sans">

            <div className="container max-w-6xl mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    
                    {/* Contenido Izquierdo */}
                    <div className="flex-1 text-center lg:text-left">
                        <FadeIn>
                            <h2 className="text-5xl md:text-6xl font-normal tracking-tight text-white leading-tight mb-6">
                                Would you like to manage the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2d1b4e] to-[#9b4dca] font-normal">process yourself?</span>
                            </h2>
                            <p className="text-base text-slate-300 leading-relaxed mb-6">
                                Klick created this digital guide to walk you step-by-step through your process at your own pace.
                            </p>
                            
                            <div className="mb-6 inline-block text-left w-full max-w-lg">
                                <h3 className="text-xl font-medium text-white mb-4">Inside the book you will find:</h3>
                                <ul className="space-y-3">
                                    {[
                                        "Official links for the entire process",
                                        "Step-by-step instructions to complete your information",
                                        "Techniques to answer interview questions effectively",
                                        "Practical guides and exclusive resources"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start">
                                            <span className="text-sm text-slate-300 font-normal leading-relaxed">• {item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </FadeIn>
                    </div>

                    {/* Imagen Derecha y Botón */}
                    <div className="flex-1 w-full max-w-md mx-auto flex flex-col items-center">
                        <ScaleIn>
                            <div className="relative w-full aspect-[4/5] mx-auto overflow-hidden">
                                <img 
                                    src="/book-klick.jpeg" 
                                    alt="Digital Book Klick - Step by Step Guide" 
                                    className="w-full h-full object-cover block"
                                />
                                {/* Difuminado súper pesado para perder completamente los bordes en el fondo negro */}
                                <div className="absolute inset-0 shadow-[inset_0_0_150px_100px_#050507] pointer-events-none"></div>
                                <div className="absolute inset-0 shadow-[inset_0_0_80px_40px_#050507] pointer-events-none"></div>
                            </div>
                        </ScaleIn>

                        <div className="mt-8 w-full flex justify-center">
                            <Button asChild className="rounded-full px-8 py-3 w-full bg-transparent border border-white/40 hover:bg-white/10 hover:border-white/80 text-white font-medium tracking-wide text-base transition-all active:scale-95 shadow-lg">
                                <a href="/membership/vip/book" target="_blank" rel="noopener noreferrer">
                                    Get Digital Book
                                </a>
                            </Button>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
