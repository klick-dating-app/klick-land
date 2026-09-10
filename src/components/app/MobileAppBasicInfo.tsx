"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, Calendar } from "lucide-react";
import { motion } from "framer-motion";

interface MobileAppBasicInfoProps {
  onBack: () => void;
  onContinue: (data: BasicInfoData) => void;
}

export interface BasicInfoData {
  firstName: string;
  lastName: string;
  nickname?: string;
  birthday: string;
  heightValue: string;
  heightUnit: "ft" | "cm";
  gender: "Hombre" | "Mujer" | "";
}

export default function MobileAppBasicInfo({
  onBack,
  onContinue,
}: MobileAppBasicInfoProps) {
  const [firstName, setFirstName] = useState("Juan Carlos");
  const [lastName, setLastName] = useState("Morales");
  const [nickname, setNickname] = useState("juancarlos_m");
  const [birthday, setBirthday] = useState("");
  const [heightUnit, setHeightUnit] = useState<"ft" | "cm">("ft");
  const [heightFeet, setHeightFeet] = useState("5");
  const [heightInches, setHeightInches] = useState("10");
  const [heightCm, setHeightCm] = useState("178");
  const [gender, setGender] = useState<"Hombre" | "Mujer" | "">("Hombre");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const heightValue =
      heightUnit === "ft" ? `${heightFeet}' ${heightInches}"` : `${heightCm} cm`;

    onContinue({
      firstName,
      lastName,
      nickname,
      birthday,
      heightValue,
      heightUnit,
      gender,
    });
  };

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center overflow-hidden select-none">
      {/* Contenedor simulador móvil */}
      <div className="w-full max-w-[430px] h-[100dvh] bg-[#070709] text-white flex flex-col justify-between relative overflow-hidden shadow-2xl md:border md:border-zinc-800/80 md:rounded-[40px] px-6 pt-12 pb-8">
        
        {/* Ambient Glow */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />

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

          {/* Barra de progreso Paso 2 (40%) */}
          <div className="flex-1 h-1.5 bg-zinc-800/80 rounded-full overflow-hidden relative">
            <motion.div
              initial={{ width: "25%" }}
              animate={{ width: "40%" }}
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

        {/* 2. Contenido del Formulario (con scroll interno suave si la pantalla es muy pequeña) */}
        <motion.form
          id="basic-info-form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex-1 flex flex-col justify-start z-10 mt-6 px-1 overflow-y-auto no-scrollbar"
        >
          {/* Tag de paso en azul */}
          <span className="text-[11px] font-bold tracking-widest text-blue-500 uppercase mb-1">
            PASO 2 · INFORMACIÓN BÁSICA
          </span>

          {/* Título en semibold */}
          <h1 className="text-2xl sm:text-[26px] font-semibold tracking-tight text-white mb-1.5 uppercase">
            Cuéntanos de ti
          </h1>

          {/* Subtítulo */}
          <p className="text-xs sm:text-[12.5px] text-zinc-400 font-normal mb-5">
            Tu edad se calcula automáticamente desde tu fecha de nacimiento.
          </p>

          {/* Inputs */}
          <div className="flex flex-col gap-3.5">
            {/* Nombre */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                Nombre
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Tu nombre"
                className="w-full h-12 px-4 rounded-xl bg-[#101116] border border-blue-500/40 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none text-white text-sm transition-all"
              />
            </div>

            {/* Apellido */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                Apellido
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Tu apellido"
                className="w-full h-12 px-4 rounded-xl bg-[#101116] border border-white/10 focus:border-blue-400 outline-none text-white text-sm transition-all"
              />
            </div>

            {/* Nickname / Apodo */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Apodo / Nickname
                </label>
                <span className="text-[10px] text-zinc-500 font-normal">Opcional</span>
              </div>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="@tu_apodo"
                className="w-full h-12 px-4 rounded-xl bg-[#101116] border border-white/10 focus:border-blue-400 outline-none text-white text-sm transition-all"
              />
            </div>

            {/* Cumpleaños */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                Cumpleaños
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-[#101116] border border-white/10 focus:border-blue-400 outline-none text-white text-sm transition-all [color-scheme:dark]"
                />
              </div>
            </div>

            {/* Estatura (con selector ft / cm) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Estatura
                </label>
                {/* Switch de unidad inches / cm */}
                <div className="flex items-center gap-1 bg-white/5 p-0.5 rounded-lg border border-white/10 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setHeightUnit("ft")}
                    className={`px-2 py-0.5 rounded-md font-semibold transition-all ${
                      heightUnit === "ft"
                        ? "bg-blue-600 text-white"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    ft / in
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeightUnit("cm")}
                    className={`px-2 py-0.5 rounded-md font-semibold transition-all ${
                      heightUnit === "cm"
                        ? "bg-blue-600 text-white"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    cm
                  </button>
                </div>
              </div>

              {heightUnit === "ft" ? (
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <select
                      value={heightFeet}
                      onChange={(e) => setHeightFeet(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl bg-[#101116] border border-white/10 focus:border-blue-400 outline-none text-white text-sm transition-all appearance-none cursor-pointer"
                    >
                      {[4, 5, 6, 7].map((f) => (
                        <option key={f} value={f} className="bg-zinc-900 text-white">
                          {f} ft
                        </option>
                      ))}
                    </select>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 pointer-events-none">
                      pies
                    </span>
                  </div>
                  <div className="relative">
                    <select
                      value={heightInches}
                      onChange={(e) => setHeightInches(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl bg-[#101116] border border-white/10 focus:border-blue-400 outline-none text-white text-sm transition-all appearance-none cursor-pointer"
                    >
                      {Array.from({ length: 12 }, (_, i) => i).map((inch) => (
                        <option key={inch} value={inch} className="bg-zinc-900 text-white">
                          {inch} in
                        </option>
                      ))}
                    </select>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 pointer-events-none">
                      pulgadas
                    </span>
                  </div>
                </div>
              ) : (
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  placeholder="178 cm"
                  className="w-full h-12 px-4 rounded-xl bg-[#101116] border border-white/10 focus:border-blue-400 outline-none text-white text-sm transition-all"
                />
              )}
            </div>

            {/* Género */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                Género
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setGender("Hombre")}
                  className={`h-12 rounded-xl text-sm font-semibold border transition-all duration-200 cursor-pointer ${
                    gender === "Hombre"
                      ? "bg-blue-600/20 border-blue-500 text-white shadow-md shadow-blue-500/10"
                      : "bg-[#101116] hover:bg-[#15161e] border-white/10 text-zinc-400"
                  }`}
                >
                  Hombre
                </button>
                <button
                  type="button"
                  onClick={() => setGender("Mujer")}
                  className={`h-12 rounded-xl text-sm font-semibold border transition-all duration-200 cursor-pointer ${
                    gender === "Mujer"
                      ? "bg-pink-600/20 border-pink-500 text-white shadow-md shadow-pink-500/10"
                      : "bg-[#101116] hover:bg-[#15161e] border-white/10 text-zinc-400"
                  }`}
                >
                  Mujer
                </button>
              </div>
            </div>
          </div>
        </motion.form>

        {/* 3. Botón Continuar */}
        <div className="w-full z-10 pb-2 pt-3">
          <button
            type="submit"
            form="basic-info-form"
            className="w-full h-14 rounded-full bg-white hover:bg-zinc-100 text-black active:scale-[0.98] shadow-xl shadow-white/10 text-[15px] font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center"
          >
            <span>Continuar</span>
          </button>
        </div>

      </div>
    </div>
  );
}
