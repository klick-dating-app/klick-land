"use client";

import { sendMetaEvent } from "@/lib/meta-events";

import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import Hero from "@/components/landing/Hero";
import ChooseYourPath from "@/components/landing/ChooseYourPath";
import Stats from "@/components/landing/Stats";
import KlickAppShowcase from "@/components/landing/KlickAppShowcase";
import FAQsSection from "@/components/landing/FAQsSection";
import BasicPlanShowcase from "@/components/landing/BasicPlanShowcase";
import VipPlanShowcase from "@/components/landing/VipPlanShowcase";
import MentorshipShowcase from "@/components/landing/MentorshipShowcase";
import FreeTrainingShowcase from "@/components/landing/FreeTrainingShowcase";
import KlickStoriesShowcase from "@/components/landing/KlickStoriesShowcase";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isNative } from "@/lib/platform";
import { loginHref } from "@/lib/klick/routes";

export default function Home() {
  const router = useRouter();

  // Capacitor abre `/`; la app nativa no muestra la landing sino su propio login.
  useEffect(() => {
    if (isNative()) router.replace(loginHref("app"));
  }, [router]);

  const handleStartQuote = () => {
    window.location.href = "/#planes";
  };

  return (
    <div className="min-h-screen bg-black font-sans">
      <Header />

      <main>
        <Hero onStartQuote={handleStartQuote} />

        {/* Bloque de Planes y App Showcase (Fondo Oscuro Continuo sin barra blanca) */}
        <div className="bg-[#050507] [&>section]:scroll-mt-28">
          <ChooseYourPath />
          <KlickAppShowcase />
        </div>

        {/* Bloque Secciones Claras (Fondo Blanco) */}
        <div className="flex flex-col gap-16 md:gap-20 lg:gap-24 bg-white [&>section]:scroll-mt-28 py-12 md:py-16">
          <VipPlanShowcase />
          <BasicPlanShowcase />
          
          <div className="w-full flex justify-center px-6">
            <a
              href="/web/login"
              onClick={() => sendMetaEvent('Lead', { source: 'Home Page Find Partner Button' })}
              className="w-full sm:w-auto px-8 py-3.5 bg-transparent border border-black text-black hover:bg-black/10 transition-all flex items-center justify-center gap-3 text-base md:text-lg font-medium shadow-xl hover:scale-105 rounded-full"
            >
              <span>I Want to Find My Partner!</span>
            </a>
          </div>

          <MentorshipShowcase />
          <FreeTrainingShowcase />
        </div>

        {/* Sección oscura inferior */}
        <div className="flex flex-col gap-16 md:gap-20 lg:gap-24 bg-black [&>section]:scroll-mt-28">
          <KlickStoriesShowcase />
          <Stats />
          <FAQsSection />
        </div>
      </main>

      <div className="bg-black pt-20 md:pt-28 lg:pt-36">
        <Footer />
      </div>
    </div>
  );
}
