"use client";

import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Shield, Home, Plus, Users, Clock, Target, Sparkles, GraduationCap, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const AboutPage = () => {
  const values = [
    {
      category: "Core Value",
      title: "Transparency.",
      description: "Truthful and honest information on every step of your academic process in the US.",
      icon: Shield,
      color: "text-blue-500"
    },
    {
      category: "Priority",
      title: "Excellence.",
      description: "Personalized strategies to ensure your success at prestigious institutions.",
      icon: Target,
      color: "text-purple-500"
    },
    {
      category: "Vision",
      title: "Empathy.",
      description: "We understand the challenge of leaving your country and guide you with human warmth.",
      icon: Heart,
      color: "text-rose-500"
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-primary/10">
      <Header />

      <main>
        <section id="about" className="relative pt-40 pb-24 bg-[#F5F5F7]"> {/* Fondo Gris Apple */}
          <div className="container mx-auto px-6 md:px-12 max-w-[1400px]">

            {/* Header Section - Apple Style Title */}
            <div className="mb-24 text-left">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[#1d1d1f] font-medium tracking-tight text-xl mb-4 block"
              >
                Quiénes Somos
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-6xl md:text-8xl font-medium text-[#1d1d1f] tracking-tighter leading-[0.9] mb-8"
              >
                More than guidance. <br />
                A life plan.
              </motion.h1>

              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl md:text-2xl text-[#86868b] font-medium max-w-3xl leading-relaxed"
                >
                  SafeMeet.Ut LLC (KLICK!) is the bridge between international talent and academic opportunities in the United States, removing barriers with honesty and strategy.
                </motion.p>
                <motion.a
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  href="/contact"
                  className="text-primary font-medium text-lg hover:underline decoration-2 underline-offset-4 flex items-center gap-1 group whitespace-nowrap"
                >
                  Start your process now <span className="group-hover:translate-x-1 transition-transform">›</span>
                </motion.a>
              </div>
            </div>

            {/* Values Section - Estilo Tarjetas Apple */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative bg-white rounded-[2.5rem] p-10 h-[520px] flex flex-col justify-between overflow-hidden shadow-sm hover:scale-[1.01] transition-all duration-500 ease-out border border-transparent hover:border-slate-100"
                >
                  <div className="z-10 relative text-left">
                    <span className="text-xs font-medium text-[#86868b] uppercase tracking-[0.2em] mb-3 block">
                      {value.category}
                    </span>
                    <h3 className="text-4xl md:text-5xl font-medium text-[#1d1d1f] mb-6 leading-tight tracking-tight">
                      {value.title}
                    </h3>
                    <p className="text-lg font-medium text-[#86868b] leading-relaxed max-w-[90%]">
                      {value.description}
                    </p>
                  </div>

                  <div className="absolute bottom-0 left-0 w-full h-1/2 flex items-end justify-center pb-12 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700">
                    <value.icon className={`w-64 h-64 ${value.color}`} />
                  </div>

                  <div className="absolute bottom-8 right-8">
                    <button className="bg-[#1d1d1f] text-white rounded-full p-3 hover:bg-primary transition-colors shadow-lg group-hover:scale-110 duration-300">
                      <Plus className="w-6 h-6" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Mission / Leadership Section - Estilo Bloque Largo */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-[3.5rem] p-10 md:p-24 shadow-sm border border-slate-50"
            >
              <div className="max-w-4xl text-left">
                <span className="text-xs font-medium text-[#86868b] uppercase tracking-[0.2em] mb-4 block">
                  Our Commitment
                </span>
                <h3 className="text-4xl md:text-8xl font-medium text-[#1d1d1f] mb-12 tracking-tighter leading-[0.9]">
                  Experts operating <br /> directly from the USA.
                </h3>

                <div className="grid md:grid-cols-2 gap-16 mt-16">
                  <div>
                    <div className="w-14 h-14 bg-[#F5F5F7] rounded-2xl flex items-center justify-center mb-6">
                      <Shield className="w-7 h-7 text-[#1d1d1f]" />
                    </div>
                    <h4 className="text-2xl font-medium text-[#1d1d1f] mb-4 tracking-tight">Radical Transparency</h4>
                    <p className="text-[#86868b] text-lg font-medium leading-relaxed">
                      SafeMeet.Ut LLC (KLICK!) is a private company. We are not government agents, which is why we guarantee honest information without confusing jargon about your membresía and admission.
                    </p>
                  </div>

                  <div>
                    <div className="w-14 h-14 bg-[#F5F5F7] rounded-2xl flex items-center justify-center mb-6">
                      <GraduationCap className="w-7 h-7 text-[#1d1d1f]" />
                    </div>
                    <h4 className="text-2xl font-medium text-[#1d1d1f] mb-4 tracking-tight">Focus on Your Future</h4>
                    <p className="text-[#86868b] text-lg font-medium leading-relaxed">
                      We foster a sense of belonging in our student community, giving you the necessary tools for a smooth transition to American life.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </section>

        {/* --- FINAL CTA REFINADO - Apple Display Style --- */}
        <section className="py-40 bg-white">
          <div className="container px-6 md:px-12 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl text-left"
            >
              <motion.div className="mb-10">
                <Sparkles className="w-12 h-12 text-[#1d1d1f]" />
              </motion.div>

              <span className="text-[#1d1d1f] font-medium tracking-tight text-xl mb-4 block">
                Your Future
              </span>

              <h2 className="text-6xl md:text-8xl font-medium text-[#1d1d1f] tracking-tighter leading-[0.9] mb-10">
                Big dreams <br />
                require solid plans.
              </h2>

              <p className="text-xl md:text-2xl text-[#86868b] mb-12 font-medium max-w-2xl leading-relaxed">
                Let's build together the roadmap to your professional success in the United States.
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-14 py-7 rounded-full bg-[#1d1d1f] text-white font-medium text-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all"
              >
                Start Now
              </motion.button>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
