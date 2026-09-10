"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  Building2,
  Heart,
  Languages,
  ShieldCheck,
  Sparkles,
  Award,
} from "lucide-react";
import { motion } from "framer-motion";

interface MobileAppPreferencesProps {
  onBack: () => void;
  onContinue: (prefs: any) => void;
}

export default function MobileAppPreferences({
  onBack,
  onContinue,
}: MobileAppPreferencesProps) {
  // Espiritualidad
  const [templeRecommend, setTempleRecommend] = useState("Vigente");
  const [templeImportance, setTempleImportance] = useState("Muy importante");
  const [churchAttendance, setChurchAttendance] = useState("Cada semana");
  const [servedMission, setServedMission] = useState("Sí");

  // Familia e Intenciones
  const [relationshipGoal, setRelationshipGoal] = useState("Matrimonio");
  const [childrenGoal, setChildrenGoal] = useState("Quiero hijos");
  const [marriageTimeline, setMarriageTimeline] = useState("1 – 2 años");

  // Logística
  const [ageRange, setAgeRange] = useState("21 – 32 años");
  const [maxDistance, setMaxDistance] = useState("40 km");
  const [languages, setLanguages] = useState("Español e Inglés");

  // Seguridad y Valores
  const [coreValues, setCoreValues] = useState("Fe, honestidad, servicio");
  const [onlyVerified, setOnlyVerified] = useState(true);
  const [safeFirstDate, setSafeFirstDate] = useState(true);

  // Afinidad
  const [interests, setInterests] = useState("Templo, música, aire libre");
  const [compatibilityMin, setCompatibilityMin] = useState(70);

  const handleSubmit = () => {
    onContinue({
      templeRecommend,
      templeImportance,
      churchAttendance,
      servedMission,
      relationshipGoal,
      childrenGoal,
      marriageTimeline,
      ageRange,
      maxDistance,
      languages,
      coreValues,
      onlyVerified,
      safeFirstDate,
      interests,
      compatibilityMin,
    });
  };

  const pillClass = (selected: boolean) =>
    `px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer border ${
      selected
        ? "bg-blue-600/20 border-blue-500 text-white shadow-md shadow-blue-500/10"
        : "bg-[#101116] hover:bg-[#15161e] text-zinc-400 hover:text-white border-white/10"
    }`;

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center overflow-hidden select-none">
      {/* Contenedor simulador móvil */}
      <div className="w-full max-w-[430px] h-[100dvh] bg-[#070709] text-white flex flex-col justify-between relative overflow-hidden shadow-2xl md:border md:border-zinc-800/80 md:rounded-[40px] px-6 pt-12 pb-8">
        
        {/* Ambient Glow */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-blue-900/15 rounded-full blur-3xl pointer-events-none" />

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

          {/* Barra de progreso Paso 6 (92%) */}
          <div className="flex-1 h-1.5 bg-zinc-800/80 rounded-full overflow-hidden relative">
            <motion.div
              initial={{ width: "85%" }}
              animate={{ width: "92%" }}
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

        {/* 2. Contenido Scrollable de Preferencias (Limpio y sin exceso de cajas) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex-1 flex flex-col justify-start z-10 mt-6 px-1 overflow-y-auto no-scrollbar space-y-6 pb-6"
        >
          {/* Header */}
          <div>
            <span className="text-[11px] font-bold tracking-widest text-blue-500 uppercase mb-1">
              PASO 6 · FILTROS Y PREFERENCIAS
            </span>
            <h1 className="text-2xl sm:text-[26px] font-semibold tracking-tight text-white mb-1 uppercase">
              Tus no negociables
            </h1>
            <p className="text-xs text-zinc-400 font-normal">
              Puedes cambiarlos cuando quieras desde tu perfil.
            </p>
          </div>

          {/* Sección 1: Espiritualidad */}
          <div className="flex flex-col gap-3.5 pb-2 border-b border-white/5">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
              <Building2 className="w-4 h-4 text-blue-400" />
              <span>Espiritualidad</span>
            </div>

            {/* Recomendación para el templo */}
            <div>
              <p className="text-[11px] text-zinc-400 font-medium mb-1.5">
                Recomendación para el templo
              </p>
              <div className="flex flex-wrap gap-2">
                {["Vigente", "En proceso", "No por ahora"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setTempleRecommend(item)}
                    className={pillClass(templeRecommend === item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Importancia en la pareja */}
            <div>
              <p className="text-[11px] text-zinc-400 font-medium mb-1.5">
                Importancia en la pareja
              </p>
              <div className="flex flex-wrap gap-2">
                {["Muy importante", "Importante", "Flexible"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setTempleImportance(item)}
                    className={pillClass(templeImportance === item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Asistencia a la iglesia */}
            <div>
              <p className="text-[11px] text-zinc-400 font-medium mb-1.5">
                Asistencia a la iglesia
              </p>
              <div className="flex flex-wrap gap-2">
                {["Cada semana", "A veces", "Regresando"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setChurchAttendance(item)}
                    className={pillClass(churchAttendance === item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* ¿Has servido una misión? */}
            <div>
              <p className="text-[11px] text-zinc-400 font-medium mb-1.5">
                ¿Has servido una misión?
              </p>
              <div className="flex flex-wrap gap-2">
                {["Sí", "No", "En planes"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setServedMission(item)}
                    className={pillClass(servedMission === item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sección 2: Familia e Intenciones */}
          <div className="flex flex-col gap-3.5 pb-2 border-b border-white/5">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
              <Heart className="w-4 h-4 text-blue-400" />
              <span>Familia e Intenciones</span>
            </div>

            {/* Meta de relación */}
            <div>
              <p className="text-[11px] text-zinc-400 font-medium mb-1.5">
                Meta de relación
              </p>
              <div className="flex flex-wrap gap-2">
                {["Matrimonio", "Noviazgo serio", "Conocer gente"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setRelationshipGoal(item)}
                    className={pillClass(relationshipGoal === item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Hijos */}
            <div>
              <p className="text-[11px] text-zinc-400 font-medium mb-1.5">
                Hijos
              </p>
              <div className="flex flex-wrap gap-2">
                {["Quiero hijos", "Ya tengo", "Aún no sé"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setChildrenGoal(item)}
                    className={pillClass(childrenGoal === item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Tiempo para casarse */}
            <div>
              <p className="text-[11px] text-zinc-400 font-medium mb-1.5">
                Tiempo para casarse
              </p>
              <div className="flex flex-wrap gap-2">
                {["< 1 año", "1 – 2 años", "Sin prisa"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setMarriageTimeline(item)}
                    className={pillClass(marriageTimeline === item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sección 3: Logística */}
          <div className="flex flex-col gap-3.5 pb-2 border-b border-white/5">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
              <Languages className="w-4 h-4 text-blue-400" />
              <span>Logística</span>
            </div>

            {/* Rango de edad */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-zinc-400 font-medium">Rango de edad</span>
                <span className="text-blue-400 font-semibold">{ageRange}</span>
              </div>
              <input
                type="range"
                min="18"
                max="50"
                defaultValue="26"
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            {/* Distancia máxima */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-zinc-400 font-medium">Distancia máxima</span>
                <span className="text-blue-400 font-semibold">{maxDistance}</span>
              </div>
              <input
                type="range"
                min="5"
                max="150"
                defaultValue="40"
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            {/* Idiomas */}
            <div>
              <p className="text-[11px] text-zinc-400 font-medium mb-1.5">
                Idiomas
              </p>
              <div className="flex flex-wrap gap-2">
                {["Español", "Inglés", "Español e Inglés"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setLanguages(item)}
                    className={pillClass(languages === item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sección 4: Seguridad y Valores */}
          <div className="flex flex-col gap-3.5 pb-2 border-b border-white/5">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Seguridad y Valores</span>
            </div>

            {/* Valores principales */}
            <div>
              <p className="text-[11px] text-zinc-400 font-medium mb-1.5">
                Valores principales
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Fe, honestidad, servicio",
                  "Familia y lealtad",
                  "Crecimiento y humor",
                ].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCoreValues(item)}
                    className={pillClass(coreValues === item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Switches */}
            <div className="flex items-center justify-between py-1">
              <span className="text-xs text-zinc-300 font-medium">
                Solo perfiles verificados
              </span>
              <button
                type="button"
                onClick={() => setOnlyVerified(!onlyVerified)}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                  onlyVerified ? "bg-blue-600" : "bg-zinc-700"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    onlyVerified ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-xs text-zinc-300 font-medium">
                Activar &ldquo;Primera Cita Segura&rdquo;
              </span>
              <button
                type="button"
                onClick={() => setSafeFirstDate(!safeFirstDate)}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                  safeFirstDate ? "bg-blue-600" : "bg-zinc-700"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    safeFirstDate ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Sección 5: Afinidad */}
          <div className="flex flex-col gap-3.5 pb-2">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Afinidad</span>
            </div>

            {/* Intereses */}
            <div>
              <p className="text-[11px] text-zinc-400 font-medium mb-1.5">
                Intereses
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Templo, música, aire libre",
                  "Deportes y viajes",
                  "Arte y lectura",
                  "Fitness / Gym",
                ].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setInterests(item)}
                    className={pillClass(interests === item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Compatibilidad mínima */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-zinc-400 font-medium">
                  Nivel de compatibilidad mínimo
                </span>
                <span className="text-blue-400 font-semibold">{compatibilityMin}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                value={compatibilityMin}
                onChange={(e) => setCompatibilityMin(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>
          </div>
        </motion.div>

        {/* 3. Botón Continuar (Blanco Sólido) */}
        <div className="w-full z-10 pb-2 pt-2">
          <button
            onClick={handleSubmit}
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
