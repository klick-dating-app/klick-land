"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, MessageSquareQuote, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

interface MobileAppIcebreakersProps {
  onBack: () => void;
  onContinue: (answers: Record<string, string>) => void;
}

const AVAILABLE_PROMPTS = [
  "¿Cuál es tu lenguaje de amor no oficial?",
  "Mi idea de una primera cita inolvidable y diferente...",
  "Un secreto o dato curioso para hacerme sonreír al instante...",
  "¿Cómo describirías tu domingo ideal juntos?",
  "Lo primero que noto en alguien y me hace hacer klick...",
  "Una meta loca o sueño que quiero cumplir este año...",
  "Si cocino para ti en nuestra tercera cita, prepararía...",
  "Una lección espiritual o de vida que me cambió la perspectiva...",
  "El cumplido más lindo o sincero que me han hecho...",
  "Dos verdades y una mentira sobre mí...",
];

export default function MobileAppIcebreakers({
  onBack,
  onContinue,
}: MobileAppIcebreakersProps) {
  // 3 preguntas seleccionables por defecto
  const [selectedPrompts, setSelectedPrompts] = useState([
    AVAILABLE_PROMPTS[0],
    AVAILABLE_PROMPTS[1],
    AVAILABLE_PROMPTS[3],
  ]);

  const [answers, setAnswers] = useState<Record<string, string>>({
    [AVAILABLE_PROMPTS[0]]: "Café por la mañana, detalles inesperados y miradas con complicidad.",
    [AVAILABLE_PROMPTS[1]]: "Paseo nocturno, pizza artesanal y hablar de todo hasta que cierren.",
    [AVAILABLE_PROMPTS[3]]: "Conferencia por la mañana, comida en familia y caminata al atardecer.",
  });

  const handlePromptChange = (index: number, newPrompt: string) => {
    const newSelected = [...selectedPrompts];
    const oldPrompt = newSelected[index];
    newSelected[index] = newPrompt;
    setSelectedPrompts(newSelected);

    const newAnswers = { ...answers };
    newAnswers[newPrompt] = newAnswers[oldPrompt] || "";
    delete newAnswers[oldPrompt];
    setAnswers(newAnswers);
  };

  const handleAnswerChange = (prompt: string, text: string) => {
    setAnswers((prev) => ({ ...prev, [prompt]: text }));
  };

  const handleNextPrompt = (index: number) => {
    const current = selectedPrompts[index];
    const currentIndex = AVAILABLE_PROMPTS.indexOf(current);
    const nextIndex = (currentIndex + 1) % AVAILABLE_PROMPTS.length;
    handlePromptChange(index, AVAILABLE_PROMPTS[nextIndex]);
  };

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center overflow-hidden select-none">
      {/* Contenedor simulador móvil */}
      <div className="w-full max-w-[430px] h-[100dvh] bg-[#070709] text-white flex flex-col justify-between relative overflow-hidden shadow-2xl md:border md:border-zinc-800/80 md:rounded-[40px] px-6 pt-12 pb-8">
        
        {/* Ambient Glow */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-pink-900/15 rounded-full blur-3xl pointer-events-none" />

        {/* 1. Header con Botón Atrás (<), Barra de progreso y Logo */}
        <div className="w-full flex items-center justify-between gap-3 z-10">
          <button
            onClick={onBack}
            type="button"
            className="p-1 -ml-1 text-zinc-400 hover:text-white active:scale-90 transition-all cursor-pointer shrink-0"
            title="Volver"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>

          {/* Barra de progreso Paso 5 (85%) */}
          <div className="flex-1 h-1.5 bg-zinc-800/80 rounded-full overflow-hidden relative">
            <motion.div
              initial={{ width: "70%" }}
              animate={{ width: "85%" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="h-full bg-[linear-gradient(90deg,#008aff_0%,#7c3aed_24%,#ff007f_48%,#ff1744_72%,#ff8c00_100%)] rounded-full"
            />
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 shrink-0">
            <Image
              src="/matchapp-logo-circular.png"
              alt="Klick"
              width={18}
              height={18}
              className="rounded-full object-cover"
              priority
            />
            <span className="text-[11px] font-semibold text-zinc-300">Klick</span>
          </div>
        </div>

        {/* 2. Contenido Principal Scrollable */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex-1 flex flex-col justify-start z-10 mt-6 px-1 overflow-y-auto no-scrollbar"
        >
          {/* Tag de paso en azul */}
          <span className="text-[11px] font-bold tracking-widest text-blue-500 uppercase mb-1.5">
            PASO 5 · ICEBREAKERS
          </span>

          {/* Título en semibold */}
          <h1 className="text-2xl sm:text-[26px] font-semibold tracking-tight text-white mb-1.5 uppercase">
            Rompe el hielo
          </h1>

          {/* Subtítulo */}
          <p className="text-xs sm:text-[13px] text-zinc-400 font-normal mb-5">
            Preguntas coquetas y reales para conectar desde el primer vistazo.
          </p>

          {/* Lista de 3 Prompts interactivos */}
          <div className="flex flex-col gap-4 pb-4">
            {selectedPrompts.map((prompt, index) => (
              <div
                key={index}
                className="p-4 rounded-2xl bg-[#101116] border border-white/10 flex flex-col gap-2.5 shadow-md shadow-black/40"
              >
                {/* Header del Prompt con botón para cambiar pregunta */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 text-pink-500 font-medium text-xs sm:text-[13px]">
                    <MessageSquareQuote className="w-4 h-4 shrink-0 mt-0.5 text-pink-500" />
                    <span className="text-white font-semibold leading-snug">
                      {prompt}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleNextPrompt(index)}
                    className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors shrink-0"
                    title="Cambiar pregunta"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Textarea para escribir la respuesta */}
                <textarea
                  rows={2}
                  value={answers[prompt] || ""}
                  onChange={(e) => handleAnswerChange(prompt, e.target.value)}
                  placeholder="Escribe algo auténtico o coqueto..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a0a0f] border border-white/5 focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/30 outline-none text-zinc-200 text-xs sm:text-[13px] placeholder:text-zinc-600 resize-none transition-all leading-relaxed"
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* 3. Botón Continuar */}
        <div className="w-full z-10 pb-2 pt-2">
          <button
            onClick={() => onContinue(answers)}
            type="button"
            className="w-full h-14 rounded-full bg-white hover:bg-zinc-100 text-black active:scale-[0.98] shadow-xl shadow-white/10 text-[15px] font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center"
          >
            <span>Continuar</span>
          </button>
        </div>

      </div>
    </div>
  );
}
