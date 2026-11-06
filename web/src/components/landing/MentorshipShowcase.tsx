"use client";

import { useRef } from "react";
import { sendMetaEvent } from "@/lib/meta-events";
import { Button } from "@/components/ui/button";
import InlineYouTubeFeature from "@/components/landing/InlineYouTubeFeature";

export default function MentorshipShowcase() {
    const containerRef = useRef(null);

    return (
        <section className="py-12 md:py-16 lg:py-20 bg-white text-black overflow-hidden font-sans">
            <div className="container mx-auto px-6 max-w-[1600px]">
                <div className="flex flex-col lg:flex-row-reverse gap-8 lg:gap-16 items-center lg:items-center">
                    
                    {/* Left Column: Text */}
                    <div className="w-full lg:w-[35%] xl:w-[30%] flex flex-col pt-2 lg:pt-4 items-center lg:items-start text-center lg:text-left">
                        <h2 className="font-normal tracking-tight text-black mb-6 leading-[1.15]">
                            <span className="text-3xl sm:text-4xl lg:text-4xl xl:text-5xl block mb-2 font-medium">Matchmaking & Coaching</span>
                            <span className="text-gray-500 text-xl sm:text-2xl lg:text-3xl font-light">Connect transparently with expert guidance</span>
                        </h2>
                        <p className="text-gray-600 text-base leading-[1.7] font-light mb-8 max-w-xl lg:max-w-none">
                            Finding the right partner requires honesty, clarity in your goals, and shared interests. Our matchmaking coaching provides you with practical tools to optimize your profile, communicate your authenticity, and understand dating culture in different parts of the world.<br /><br />
                            Learn tips for engaging in deep conversations, having safe dates, and conveying confidence from the very first interaction.
                        </p>
                        <a href="https://chat.whatsapp.com/GVlnQKclJuP63qZjeE0r24" target="_blank" rel="noopener noreferrer" onClick={() => sendMetaEvent('Lead', { source: 'MentorshipShowcase: Encontrar Pareja' })} className="w-full sm:w-auto">
                           <Button className="mt-2 w-full sm:w-64 px-5 py-2.5 bg-transparent border border-black text-black rounded-full hover:bg-black/10 transition-all flex justify-center items-center hover:scale-105 hover:shadow-lg text-sm">Find my Partner now</Button>
                        </a>
                    </div>

                    {/* Right Column: Video/Media */}
                    <div ref={containerRef} className="w-full lg:w-[70%] relative aspect-video bg-[#0a0a0a] rounded-3xl overflow-hidden shadow-2xl">
                        <InlineYouTubeFeature
                            videoId="5Dhn5ZkWJl4"
                            startSeconds={1000}
                            posterAlt="Matchmaking & Dating Coaching"
                            className="rounded-3xl w-full h-full"
                        />
                    </div>

                </div>
            </div>
        </section>
    );
}
