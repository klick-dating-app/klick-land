"use client";

import { Button } from '@/components/ui/button';
import { sendMetaEvent } from "@/lib/meta-events";
import { ShieldCheck, HeartHandshake, UserCheck, Globe2 } from "lucide-react";

export default function FreeTrainingShowcase() {
    const features = [
        {
            icon: ShieldCheck,
            title: "Dating Safety & Protection",
            description: "Essential resources and practical security guidelines to connect safely with confidence."
        },
        {
            icon: HeartHandshake,
            title: "Assertive Communication",
            description: "Master emotional intelligence and express your genuine intentions with clarity and respect."
        },
        {
            icon: UserCheck,
            title: "Honest Profile Creation",
            description: "Learn to build an attractive, authentic profile that accurately reflects your unique personality."
        },
        {
            icon: Globe2,
            title: "Cross-Cultural Affinity",
            description: "Understand dating culture across different regions to build deep, meaningful relationships."
        }
    ];

    return (
        <section className="py-16 md:py-24 bg-white text-black overflow-hidden font-sans">
            <div className="container mx-auto px-6 max-w-[1400px]">
                
                {/* Header Section */}
                <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14 md:mb-16">
                    <h2 className="font-normal tracking-tight text-black leading-[1.15]">
                        <span className="text-3xl md:text-5xl lg:text-6xl block mb-3 font-medium">
                            Dating & Safety Guides
                        </span>
                        <span className="text-gray-500 text-xl md:text-2xl lg:text-3xl font-light">
                            To build strong and honest relationships
                        </span>
                    </h2>
                    
                    <p className="mt-6 text-gray-600 text-base md:text-lg leading-relaxed font-light max-w-2xl">
                        Gain immediate access to our resources on dating safety, assertive communication, emotional intelligence, and interest affinity. Learn to create an attractive and honest profile that accurately reflects your personality.
                    </p>
                </div>

                {/* 4 Feature Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 mb-14 md:mb-16">
                    {features.map((feature, idx) => {
                        const Icon = feature.icon;
                        return (
                            <div 
                                key={idx}
                                className="bg-slate-50/70 border border-black/10 rounded-3xl p-6 md:p-8 flex flex-col justify-between hover:border-black/30 hover:bg-slate-50 transition-all duration-300 group shadow-sm hover:shadow-md hover:-translate-y-1"
                            >
                                <div>
                                    <div className="w-12 h-12 rounded-2xl border border-black/10 bg-white flex items-center justify-center mb-6 text-black group-hover:scale-110 transition-transform shadow-xs">
                                        <Icon className="w-6 h-6 stroke-[1.5]" />
                                    </div>
                                    <h3 className="text-lg font-medium text-black mb-2 tracking-tight">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed font-light">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom Highlight Callout & Action */}
                <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
                    <p className="text-gray-600 text-base md:text-lg leading-relaxed font-light mb-8">
                        A practical collection of tools designed so you can connect with confidence, understand dating culture across different regions, and build authentic relationships.
                    </p>
                    
                    <Button asChild className="px-8 py-3 bg-transparent border border-black text-black rounded-full hover:bg-black/10 transition-all flex justify-center items-center hover:scale-105 hover:shadow-lg text-sm md:text-base font-medium">
                        <a 
                            href="https://chat.whatsapp.com/GVlnQKclJuP63qZjeE0r24" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            onClick={() => sendMetaEvent('Lead', { source: 'FreeTrainingShowcase: Encontrar Pareja' })} 
                        >
                            Find my Partner now
                        </a>
                    </Button>
                </div>

            </div>
        </section>
    );
}

