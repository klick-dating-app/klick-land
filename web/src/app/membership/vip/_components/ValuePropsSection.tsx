"use client";

import { motion } from "framer-motion";
import { FadeIn } from "./Animations";
import {
    GraduationCap, School, Globe, Award, AlertTriangle,
    CheckCircle2, BrainCircuit, ShieldCheck, TrendingUp
} from "lucide-react";

export default function ValuePropsSection() {
    return (
        <div className="relative z-30 pt-32 md:pt-48 pb-32 px-6 bg-white">
            <div className="container mx-auto">
                {/* Floating Icons adapted for Students */}
                <FadeIn>
                    <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 mb-12">
                        {[
                            { icon: GraduationCap },
                            { icon: School },
                            { icon: Globe },
                            { icon: Award },
                            { icon: AlertTriangle }, // Warning is universal
                            { icon: CheckCircle2 },
                            { icon: BrainCircuit },
                            { icon: ShieldCheck },
                            { icon: TrendingUp }
                        ].map((item, index) => {
                            const Icon = item.icon;
                            const yRange = 45;

                            return (
                                <motion.div
                                    key={index}
                                    className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center justify-center text-[#9b4dca] hover:text-[#2d1b4e] cursor-pointer border border-slate-50"
                                    animate={{
                                        y: [0, -yRange, 0],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: index * 0.2
                                    }}
                                    whileHover={{ scale: 1.15, rotate: 5 }}
                                >
                                    <Icon strokeWidth={1.5} className="w-6 h-6 md:w-8 md:h-8" />
                                </motion.div>
                            );
                        })}
                    </div>
                </FadeIn>

                {/* Introductory Phrase */}
                <FadeIn delay={0.4}>
                    <div className="text-center mt-24 md:mt-32 max-w-4xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-[#1a2b3b] leading-tight">
                            We make your dream of studying in the United States possible with <br />
                            <span className="bg-gradient-to-r from-[#2d1b4e] to-[#9b4dca] bg-clip-text text-transparent font-semibold">Klick</span>
                        </h2>
                    </div>
                </FadeIn>

                {/* Requisitos Section */}
                <FadeIn delay={0.6}>
                    <div className="mt-24 md:mt-32 max-w-5xl mx-auto px-4 md:px-0">
                        <h3 className="text-2xl md:text-4xl font-medium text-center mb-16 text-[#1a2b3b]">Requirements to Begin the Process</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 mb-16">
                            {/* Columna Pasaporte */}
                            <div className="flex flex-col items-center md:items-start text-center md:text-left">
                                <div className="text-[#9b4dca] mb-5">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
                                </div>
                                <p className="text-lg text-gray-700 leading-relaxed font-light">
                                    Have your <span className="font-medium text-[#1a2b3b]">passport ready and valid</span> for at least the next 6 months.
                                </p>
                            </div>

                            {/* Columna Estado de Cuenta */}
                            <div className="flex flex-col items-center md:items-start text-center md:text-left">
                                <div className="text-[#9b4dca] mb-5">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                                </div>
                                <p className="text-lg text-gray-700 leading-relaxed font-light">
                                    Have a <span className="font-medium text-[#1a2b3b]">bank statement</span> demonstrating sufficient financial backing of at least <span className="font-medium text-[#1a2b3b]">$5,000 USD</span>. The statement can be yours or from a sponsor.
                                </p>
                            </div>
                        </div>

                        {/* Notas */}
                        <div className="flex flex-col gap-4 text-center max-w-4xl mx-auto">
                            <p className="text-sm text-gray-500 font-light leading-relaxed">
                                <span className="font-medium text-gray-700">Important Note:</span> You do not pay this money to anyone (including us); it simply serves as financial proof in your account. Our company never asks for this money to be transferred.
                            </p>
                            <p className="text-sm text-gray-500 font-light leading-relaxed">
                                Documents should be scanned in PDF format and sent to our email <a href="mailto:support@klick.app" className="text-blue-500 hover:underline">support@klick.app</a>.
                            </p>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </div>
    );
}
