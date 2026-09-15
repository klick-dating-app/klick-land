"use client";

import Link from "next/link";
import { sendMetaEvent } from "@/lib/meta-events";
import { Button } from "@/components/ui/button";
import InlineYouTubeFeature from "@/components/landing/InlineYouTubeFeature";

const STUDENT_SHOWCASE_VIDEO_ID = "rLGS2ecW1Rw";
const STUDENT_SHOWCASE_START_SECONDS = 1530;
const STUDENT_SHOWCASE_POSTER = "/assets/generated/dating_showcase_community.png";

export default function VipPlanShowcase() {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-white text-black overflow-hidden font-sans">
      <div className="container mx-auto px-6 max-w-[1600px]">
        <div className="flex flex-col lg:flex-row-reverse gap-8 lg:gap-16 items-center lg:items-center">
          <div className="w-full lg:w-[35%] xl:w-[30%] flex flex-col pt-2 lg:pt-4 items-center lg:items-start text-center lg:text-left">
            <h2 className="font-normal tracking-tight text-black mb-6 leading-[1.15]">
              <span className="text-3xl sm:text-4xl lg:text-4xl xl:text-5xl block mb-2 font-medium">
                Klick
              </span>
              <span className="text-gray-500 text-xl sm:text-2xl lg:text-3xl font-light">
                Authentic connections based on honesty
              </span>
            </h2>
            <p className="text-gray-600 text-base leading-[1.7] font-light max-w-xl lg:max-w-none">
              Our Klick plan is designed for those looking for a transparent dating experience without false pretenses. Thanks to our smart affinity algorithm and 100% verified profiles, you will be able to directly connect with people who share your lifestyle, passions, and worldview.
              <br />
              <br />
              Discover the culture, tastes, and stories of fascinating people. We foster honesty and safety in every interaction so you enjoy real conversations and find your ideal person.
            </p>
            <p className="text-xs text-gray-400 mt-4 leading-relaxed max-w-xl lg:max-w-none">
              *Every profile undergoes identity verification to ensure a safe and high-quality community.*
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button
                asChild
                className="w-full sm:w-64 px-5 py-2.5 bg-transparent border border-black text-black rounded-full hover:bg-black/10 transition-all flex justify-center items-center hover:scale-105 hover:shadow-lg text-sm"
              >
                <a href="https://chat.whatsapp.com/GVlnQKclJuP63qZjeE0r24" target="_blank" rel="noopener noreferrer" onClick={() => sendMetaEvent('Lead', { source: 'VipPlanShowcase: Encontrar Pareja' })}>Find my Partner now</a>
              </Button>
              <Button
                asChild
                className="w-full sm:w-64 px-5 py-2.5 bg-transparent border border-black text-black rounded-full hover:bg-black/10 transition-all flex justify-center items-center hover:scale-105 hover:shadow-lg text-sm"
              >
                <Link href="#planes" onClick={() => sendMetaEvent('Lead', { source: 'VipPlanShowcase: Conocer Plan' })}>View Plan Details</Link>
              </Button>
            </div>
          </div>

          <div className="w-full lg:w-[70%] relative aspect-video rounded-3xl overflow-hidden shadow-2xl bg-black">
            <InlineYouTubeFeature
              videoId={STUDENT_SHOWCASE_VIDEO_ID}
              startSeconds={STUDENT_SHOWCASE_START_SECONDS}
              posterSrc={STUDENT_SHOWCASE_POSTER}
              posterAlt="Klick - Authentic Connections"
              className="rounded-3xl w-full h-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
