"use client";

import { motion } from "framer-motion";
import { FadeIn } from "./Animations";
import { FileCheck, CalendarClock, MessageSquare } from "lucide-react";

export default function BenefitsSection() {
    return (
        <section className="relative z-30 py-24 md:py-32 px-6 bg-transparent text-center">
            <div className="container mx-auto">
                <FadeIn className="text-center max-w-4xl mx-auto">
                    {/* Phrase */}
                    <h3 className="text-3xl md:text-5xl font-medium text-white font-sans tracking-tight leading-[1.1]">
                        Enjoy Unforgettable Experiences <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2d1b4e] to-[#9b4dca]">Around the World</span>
                    </h3>
                </FadeIn>

                {/* Requisitos Section */}
                <FadeIn delay={0.3}>
                    <div className="mt-24 md:mt-32 max-w-5xl mx-auto px-4 md:px-0">
                        <h3 className="text-2xl md:text-4xl font-medium text-center mb-16 text-white">Requirements to Begin the Process</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 mb-16">
                            {/* Columna Pasaporte */}
                            <div className="flex flex-col items-center md:items-start text-center md:text-left">
                                <div className="text-[#9b4dca] mb-5">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
                                </div>
                                <p className="text-lg text-gray-300 leading-relaxed font-light">
                                    Have your <span className="font-medium text-white">passport ready and valid</span> for at least the next 6 months.
                                </p>
                            </div>

                            {/* Columna Estado de Cuenta */}
                            <div className="flex flex-col items-center md:items-start text-center md:text-left">
                                <div className="text-[#9b4dca] mb-5">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                                </div>
                                <p className="text-lg text-gray-300 leading-relaxed font-light">
                                    Have a <span className="font-medium text-white">bank statement</span> demonstrating financial backing of at least <span className="font-medium text-white">$5,000 USD</span>.
                                </p>
                            </div>
                        </div>

                        {/* Notas */}
                        <div className="flex flex-col gap-4 text-center max-w-4xl mx-auto">
                            <p className="text-sm text-gray-400 font-light leading-relaxed">
                                <span className="font-medium text-gray-300">Important Note:</span> You do not pay this money to anyone (including us); it simply serves as financial proof in your account. Our company never asks for this money to be transferred.
                            </p>
                            <p className="text-sm text-gray-400 font-light leading-relaxed">
                                Documents should be scanned in PDF format and sent to our email <a href="mailto:support@klick.app" className="text-blue-400 hover:underline">support@klick.app</a>.
                            </p>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
