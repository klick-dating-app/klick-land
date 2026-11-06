"use client";

import { useRef } from "react";
import Link from "next/link";
import { sendMetaEvent } from "@/lib/meta-events";
import { Button } from '@/components/ui/button';
import InlineYouTubeFeature from "@/components/landing/InlineYouTubeFeature";

export default function BasicPlanShowcase() {
    const ref = useRef(null);

    return (
        <section className="py-12 md:py-16 lg:py-20 bg-white text-black overflow-hidden font-sans">
            <div className="container mx-auto px-6 max-w-[1600px]">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center lg:items-center">
                    
                    {/* Left Column: Text */}
                    <div className="w-full lg:w-[35%] xl:w-[30%] flex flex-col pt-2 lg:pt-4 items-center lg:items-start text-center lg:text-left">
                        <h2 className="font-normal tracking-tight text-black mb-6 leading-[1.15]">
                            <span className="text-3xl sm:text-4xl lg:text-4xl xl:text-5xl block mb-2 font-medium">Klick Pro</span>
                            <span className="text-gray-500 text-xl sm:text-2xl lg:text-3xl font-light">International connections & cultural exchange</span>
                        </h2>
                        <p className="text-gray-600 text-base leading-[1.7] font-light max-w-xl lg:max-w-none">
                            The Klick Pro plan breaks down geographical and cultural barriers. Connect with incredible people from different countries, learn about new cultures, lifestyles, and languages while searching for your ideal partner.<br /><br /> Access advanced compatibility filters, unlimited likes, incognito mode, and the ability to know who likes you right away. Experience the most exclusive and effective level of matchmaking.
                        </p>
                        <div className="mt-6 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <Button asChild className="w-full sm:w-64 px-5 py-2.5 bg-transparent border border-black text-black rounded-full hover:bg-black/10 transition-all flex justify-center items-center hover:scale-105 hover:shadow-lg text-sm">
                                <a href="https://chat.whatsapp.com/GVlnQKclJuP63qZjeE0r24" target="_blank" rel="noopener noreferrer" onClick={() => sendMetaEvent('Lead', { source: 'BasicPlanShowcase: Encontrar Pareja Pro' })}>Find my Partner now</a>
                            </Button>
                            <Button asChild className="w-full sm:w-64 px-5 py-2.5 bg-transparent border border-black text-black rounded-full hover:bg-black/10 transition-all flex justify-center items-center hover:scale-105 hover:shadow-lg text-sm">
                                <Link href="#planes" onClick={() => sendMetaEvent('Lead', { source: 'BasicPlanShowcase: Conocer Plan Pro' })}>View Pro Plan Details</Link>
                            </Button>
                        </div>
                    </div>

                    {/* Right Column: Video/Media */}
                    <div ref={ref} className="w-full lg:w-[70%] relative aspect-video rounded-3xl overflow-hidden shadow-2xl bg-black">
                        <InlineYouTubeFeature
                            videoId="9NEnvqghAAo"
                            startSeconds={2040}
                            posterSrc="/assets/generated/dating_showcase_park.png"
                            posterAlt="Klick Pro - International Connections"
                            className="rounded-3xl w-full h-full"
                        />
                    </div>

                </div>
            </div>
        </section>
    );
}
