"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import WhatsappIcon from "@/components/icons/WhatsappIcon";

const categories = [
  {
    id: "klick",
    title: "Klick",
    faqs: [
      {
        question: "What is Klick?",
        answer: "Klick is a dating and matchmaking platform designed to connect people seeking honest, authentic, and meaningful relationships. We combine a smart compatibility algorithm with profile verification and constant guidance."
      },
      {
        question: "How does the algoritmo Klick work?",
        answer: "Our algorithm analyzes your values, hobbies, lifestyle, and personal goals to suggest truly compatible people. We prioritize real compatibility over superficial matches."
      },
      {
        question: "What is the difference between Klick and Klick Pro?",
        answer: "The Klick plan includes 360° profile creation, basic interest algorithm, direct chat, and daily likes. The Klick Pro plan unlocks unlimited interactions, seeing who likes you before connecting, advanced value and lifestyle filters, weekly visibility boost, and incognito mode."
      },
      {
        question: "Where do I start?",
        answer: "You start by selecting your plan (Klick or Klick Pro) and completing your profile honestly about your tastes and interests to start connecting right away."
      }
    ]
  },
  {
    id: "compatibility",
    title: "Compatibility & Interests",
    faqs: [
      {
        question: "How is affinity between users evaluated?",
        answer: "Through a personality and interest test where you define your passions, habits, and life vision. This ensures fluid conversations and mutual interest from the very first message."
      },
      {
        question: "Can I connect with people from other countries?",
        answer: "Of course! Klick encourages cultural exchange and international dating. You can discover the culture, customs, and lifestyles of people from different countries."
      }
    ]
  },
  {
    id: "safety",
    title: "Safety & Verification",
    faqs: [
      {
        question: "How do you ensure safety and honesty in profiles?",
        answer: "Each user goes through a photo and phone identity verification process. Additionally, our moderation team continuously supervises the community to maintain a safe environment free of fake profiles."
      },
      {
        question: "Is my personal data protected?",
        answer: "Absolutely. Your data is encrypted and we only share what you choose to make public on your profile. You can use incognito mode on the Pro plan for greater privacy."
      }
    ]
  }
];

export default function FAQsSection() {
  const [selectedCategory, setSelectedCategory] = useState(categories[0].id);
  const [expandedIndex, setExpandedIndex] = useState<string | null>(null);

  const filteredFaqs = selectedCategory === "all"
    ? categories.flatMap(cat => cat.faqs.map(faq => ({ ...faq, categoryId: cat.id, categoryTitle: cat.title })))
    : categories.find(cat => cat.id === selectedCategory)?.faqs.map(faq => {
      const cat = categories.find(c => c.id === selectedCategory)!;
      return { ...faq, categoryId: cat.id, categoryTitle: cat.title };
    }) || [];

  const toggleExpand = (id: string) => {
    setExpandedIndex(expandedIndex === id ? null : id);
  };

  return (
    <section id="faqs" className="py-16 md:py-24 lg:py-28 bg-black font-sans text-white relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 max-w-5xl relative z-10">
        
        <div className="mb-16 text-center flex flex-col items-center">
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-4 text-white">
            Your questions answered <br className="hidden md:inline" />
            <span className="text-gray-400">transparently</span>
          </h2>
          <p className="text-lg text-gray-400 font-normal leading-relaxed max-w-2xl mx-auto">
            Find clarity about our plans, verified profiles, and proceso de conexión Klick. Total honesty from day one.
          </p>
        </div>

        {/* Category Pills (Filtros) */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setExpandedIndex(null);
              }}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
                selectedCategory === cat.id
                  ? "bg-white text-black shadow-md shadow-white/10"
                  : "bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 hover:text-white"
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>

        {/* Vertical Accordion List */}
        <div className="border-t border-white/10 divide-y divide-white/10 mb-20">
          <AnimatePresence initial={false}>
            {filteredFaqs.map((faq, idx) => {
              const id = `${faq.categoryId}-${idx}`;
              const isExpanded = expandedIndex === id;

              return (
                <div key={id} className="py-5 transition-colors duration-300 hover:bg-white/[0.02] px-2 rounded-xl">
                  <button
                    onClick={() => toggleExpand(id)}
                    className="w-full flex justify-between items-center text-left py-2 group focus:outline-none"
                    aria-expanded={isExpanded}
                  >
                    <div className="flex flex-col gap-1 pr-6">
                      <span className="text-base md:text-lg font-medium text-white transition-colors duration-200">
                        {faq.question}
                      </span>
                    </div>
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-white group-hover:bg-white/10 transition-all duration-300 ${
                        isExpanded ? "rotate-180 bg-white border-white text-black group-hover:bg-white group-hover:text-black" : ""
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{
                          height: "auto",
                          opacity: 1,
                          transition: { height: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }, opacity: { duration: 0.25, delay: 0.05 } }
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                          transition: { height: { duration: 0.25, ease: [0.16, 1, 0.3, 1] }, opacity: { duration: 0.15 } }
                        }}
                        className="overflow-hidden"
                      >
                        <div className="pb-4 pt-2 text-sm md:text-base text-gray-400 leading-relaxed max-w-3xl">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </AnimatePresence>
        </div>

        <div className="mt-16 text-center max-w-xl mx-auto flex flex-col items-center">
          <p className="text-gray-400 text-xs md:text-sm mb-6 leading-relaxed">
            <span className="font-semibold text-white block mb-1 text-sm md:text-base">Still have questions?</span>
            If you want to talk to our matchmaking team or have questions about our plans, we are ready to assist you on WhatsApp.
          </p>
          
          <a
            href="https://chat.whatsapp.com/GVlnQKclJuP63qZjeE0r24"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-auto px-5 py-3 rounded-full bg-white/5 border border-white/10 text-white font-medium text-xs md:text-sm hover:bg-white/10 hover:border-white/40 hover:[transition-property:transform,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 transition-all duration-300"
          >
            <WhatsappIcon className="w-4 h-4" />
            <span className="ml-2">Chat on WhatsApp</span>
          </a>
        </div>
        
      </div>
    </section>
  );
}
