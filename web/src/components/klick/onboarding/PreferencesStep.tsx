"use client";

import React, { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import KlickLogo from "@/components/ui/KlickLogo";
import { Group, MultiSelectRow, PrimaryButton, SelectRow, SliderRow, TextRow, ToggleRow } from "@/components/klick/ui/apple";
import {
  CHILDREN_STATUS,
  CHURCH_IMPORTANCE,
  CORE_VALUES,
  CULTURES,
  EDUCATION_LEVELS,
  IMPORTANCE_LEVELS,
  LANGUAGE_IMPORTANCE,
  PARTNER_LANGUAGES,
  RELATIONSHIP_GOALS,
  SPIRITUAL_EXPECTATIONS,
  VALUE_KEYS,
  VALUE_PRIORITY,
  VERIFIED_ONLY,
  YES_NO_MAYBE,
  type ValueKey,
  type ValuePriority,
} from "@/lib/types";

interface PreferencesStepProps {
  onBack: () => void;
  onContinue: (prefs: Record<string, unknown>) => void;
}

/** Opciones propias de la UI (las que se traducen al cuestionario en `save-profile.ts`). */
export const PREFERENCE_OPTIONS = {
  templeRecommend: ["Active", "In progress", "Not right now", "Prefer not to say"],
  churchAttendance: ["Every week", "Almost every week", "A few times a month", "Occasionally", "Returning"],
  servedMission: ["Yes", "No", "Planning"],
  marriageTimeline: ["< 1 year", "1 – 2 years", "2 – 3 years", "No set timeline", "When I find the right person"],
  wantsChildren: ["Yes", "No", "Maybe", "Not sure yet"],
  acceptsPartnerChildren: ["Yes", "No", "Depends"],
  maxDistance: ["10 mi", "25 mi", "50 mi", "100 mi", "Anywhere"],
  maritalStatus: ["Single", "Divorced", "Widowed"],
  lifestyle: ["Active", "Peaceful", "Family-oriented", "Social", "Homebody", "Adventurous"],
  communication: ["Direct", "Calm", "Social", "Reserved"],
  interests: [
    "Temple service", "Music", "Outdoors", "Hiking", "Nature", "Travel", "Pickleball", "Fitness / Gym",
    "Sports", "Reading", "Art", "Cooking", "Movies", "Photography", "Dancing", "Family history",
    "Volunteering", "Board games",
  ],
  dateTypes: ["Coffee", "Park stroll", "Public restaurant", "Ice cream", "Museum", "Ward activity"],
} as const;

export default function PreferencesStep({ onBack, onContinue }: PreferencesStepProps) {
  // ⛪ Fe LDS
  const [templeRecommend, setTempleRecommend] = useState("Active");
  const [templeImportance, setTempleImportance] = useState<string>("Very important");
  const [churchImportance, setChurchImportance] = useState<string>("Very important");
  const [churchAttendance, setChurchAttendance] = useState("Every week");
  const [servedMission, setServedMission] = useState("Yes");
  const [spiritualExpectations, setSpiritualExpectations] = useState<string[]>(["Similar faith", "Temple marriage"]);

  // 💍 Relación y matrimonio
  const [relationshipGoals, setRelationshipGoals] = useState<string[]>(["Serious relationship", "Marriage"]);
  const [marriageTimeline, setMarriageTimeline] = useState("1 – 2 years");

  // 👨‍👩‍👧 Familia
  const [childrenStatus, setChildrenStatus] = useState<string>("No");
  const [wantsChildren, setWantsChildren] = useState("Yes");
  const [acceptsPartnerChildren, setAcceptsPartnerChildren] = useState("Depends");

  // 📍 Edad y distancia
  const [minAge, setMinAge] = useState(21);
  const [maxAge, setMaxAge] = useState(32);
  const [maxDistance, setMaxDistance] = useState("50 mi");
  const [longDistance, setLongDistance] = useState("Maybe");

  // 🌎 Idioma y cultura
  const [languages, setLanguages] = useState<string[]>(["English"]);
  const [partnerLanguages, setPartnerLanguages] = useState<string[]>(["English"]);
  const [languageImportance, setLanguageImportance] = useState<string>("Preferred");
  const [culturalBackground, setCulturalBackground] = useState("");
  const [culturePreferences, setCulturePreferences] = useState<string[]>(["No preference"]);

  // ❤️ Valores
  const [coreValues, setCoreValues] = useState<string[]>(["Faith", "Family", "Honesty"]);
  const [valuePriorities, setValuePriorities] = useState<Partial<Record<ValueKey, ValuePriority>>>({
    Faith: "Essential",
    Family: "Essential",
  });

  // 👤 Sobre ti
  const [maritalStatus, setMaritalStatus] = useState("Single");
  const [occupation, setOccupation] = useState("");
  const [education, setEducation] = useState("");
  const [lifestyle, setLifestyle] = useState<string[]>([]);
  const [communication, setCommunication] = useState("");

  // 🛡️ Seguridad
  const [onlyVerified, setOnlyVerified] = useState<string>("Yes");
  const [safeFirstDate, setSafeFirstDate] = useState(true);

  // ✨ Afinidad
  const [interests, setInterests] = useState<string[]>(["Temple service", "Music", "Outdoors"]);
  const [dateTypes, setDateTypes] = useState<string[]>(["Coffee"]);
  const [compatibilityMin, setCompatibilityMin] = useState(70);

  const handleSubmit = () => {
    onContinue({
      templeRecommend,
      templeImportance,
      churchImportance,
      churchAttendance,
      servedMission,
      spiritualExpectations,
      relationshipGoals,
      // Se mantiene la clave anterior para quien aún lea `relationshipGoal`.
      relationshipGoal: relationshipGoals.some((g) => g.includes("Marriage")) ? "Marriage" : relationshipGoals[0] ?? "Meeting people",
      marriageTimeline,
      childrenStatus,
      wantsChildren,
      acceptsPartnerChildren,
      ageRange: `${minAge} – ${maxAge} years`,
      minAge,
      maxAge,
      maxDistance,
      longDistance,
      languages,
      partnerLanguages,
      languageImportance,
      culturalBackground,
      culturePreferences,
      coreValues,
      valuePriorities,
      maritalStatus,
      occupation: occupation.trim(),
      education,
      lifestyle,
      communication,
      onlyVerified,
      safeFirstDate,
      interests,
      dateTypes,
      compatibilityMin,
    });
  };

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center overflow-hidden select-none">
      {/* Contenedor simulador móvil */}
      <div className="w-full max-w-[430px] h-[100dvh] bg-black text-white flex flex-col justify-between relative overflow-hidden md:border md:border-zinc-800/80 md:rounded-[40px] px-5 pt-12 pb-8">
        {/* Header con Botón Atrás (<), Barra de progreso y Logo */}
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

          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 shrink-0">
            <KlickLogo size={18} priority />
            <span className="text-[11px] font-semibold text-zinc-300">Klick</span>
          </div>
        </div>

        {/* Contenido desplazable: grupos estilo Ajustes de Apple */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex-1 flex flex-col justify-start z-10 mt-6 overflow-y-auto no-scrollbar gap-7 pb-6"
        >
          <div className="px-1">
            <span className="text-[11px] font-semibold tracking-widest text-zinc-500 uppercase">
              Step 6 · Preferences
            </span>
            <h1 className="text-[28px] font-bold tracking-tight text-white mt-1">Your Non-Negotiables</h1>
            <p className="text-[13px] text-zinc-500 mt-1">
              You can change these anytime. Private answers are never shown on your profile.
            </p>
          </div>

          <Group title="LDS Faith" footer="Only a verification badge is shown for your temple recommend, and only with your consent.">
            <SelectRow label="Temple recommend" value={templeRecommend} options={PREFERENCE_OPTIONS.templeRecommend} onChange={setTempleRecommend} allowEmpty={false} />
            <SelectRow label="Importance of the Church" value={churchImportance} options={CHURCH_IMPORTANCE} onChange={setChurchImportance} />
            <SelectRow label="Church attendance" value={churchAttendance} options={PREFERENCE_OPTIONS.churchAttendance} onChange={setChurchAttendance} />
            <SelectRow label="Served a mission" value={servedMission} options={PREFERENCE_OPTIONS.servedMission} onChange={setServedMission} />
          </Group>

          <Group title="In a Partner" footer="Private · used only to find compatible people.">
            <SelectRow label="Temple recommend" value={templeImportance} options={IMPORTANCE_LEVELS} onChange={setTempleImportance} />
            <MultiSelectRow label="Spiritual expectations" value={spiritualExpectations} options={SPIRITUAL_EXPECTATIONS} onChange={setSpiritualExpectations} emptyLabel="None" />
            <SelectRow label="Partner with children" value={acceptsPartnerChildren} options={PREFERENCE_OPTIONS.acceptsPartnerChildren} onChange={setAcceptsPartnerChildren} />
            <MultiSelectRow label="Languages" value={partnerLanguages} options={PARTNER_LANGUAGES} onChange={setPartnerLanguages} />
            <SelectRow label="Sharing a language" value={languageImportance} options={LANGUAGE_IMPORTANCE} onChange={setLanguageImportance} />
            <MultiSelectRow label="Culture" value={culturePreferences} options={CULTURES} onChange={setCulturePreferences} exclusive="No preference" />
          </Group>

          <Group title="Relationship & Marriage">
            <MultiSelectRow label="Looking for" value={relationshipGoals} options={RELATIONSHIP_GOALS} onChange={setRelationshipGoals} emptyLabel="Choose" />
            <SelectRow label="Marriage timeline" value={marriageTimeline} options={PREFERENCE_OPTIONS.marriageTimeline} onChange={setMarriageTimeline} />
          </Group>

          <Group title="Family">
            <SelectRow label="Children" value={childrenStatus} options={CHILDREN_STATUS} onChange={setChildrenStatus} />
            <SelectRow label="Want children" value={wantsChildren} options={PREFERENCE_OPTIONS.wantsChildren} onChange={setWantsChildren} />
          </Group>

          <Group title="Age & Distance" footer="Only your approximate location is used.">
            <SliderRow label="Minimum age" value={minAge} min={21} max={70} onChange={(v) => setMinAge(Math.min(v, maxAge - 1))} />
            <SliderRow label="Maximum age" value={maxAge} min={22} max={75} onChange={(v) => setMaxAge(Math.max(v, minAge + 1))} />
            <SelectRow label="Maximum distance" value={maxDistance} options={PREFERENCE_OPTIONS.maxDistance} onChange={setMaxDistance} allowEmpty={false} />
            <SelectRow label="Long-distance relationship" value={longDistance} options={YES_NO_MAYBE} onChange={setLongDistance} />
          </Group>

          <Group title="Language & Culture">
            <MultiSelectRow label="Languages I speak" value={languages} options={PARTNER_LANGUAGES} onChange={setLanguages} emptyLabel="Choose" />
            <SelectRow label="Cultural background" value={culturalBackground} options={CULTURES.filter((c) => c !== "No preference")} onChange={setCulturalBackground} />
          </Group>

          <Group title="Values" footer="How important is it that your partner shares each value?">
            <MultiSelectRow label="My core values" value={coreValues} options={CORE_VALUES} onChange={setCoreValues} emptyLabel="Choose" />
            {VALUE_KEYS.map((key) => (
              <SelectRow
                key={key}
                label={key}
                value={valuePriorities[key] ?? ""}
                options={VALUE_PRIORITY}
                onChange={(v) =>
                  setValuePriorities((prev) => {
                    const next = { ...prev };
                    if (v) next[key] = v as ValuePriority;
                    else delete next[key];
                    return next;
                  })
                }
              />
            ))}
          </Group>

          <Group title="About You">
            <SelectRow label="Marital status" value={maritalStatus} options={PREFERENCE_OPTIONS.maritalStatus} onChange={setMaritalStatus} allowEmpty={false} />
            <TextRow label="Occupation" value={occupation} onChange={setOccupation} placeholder="Optional" maxLength={80} />
            <SelectRow label="Education" value={education} options={EDUCATION_LEVELS} onChange={setEducation} />
            <MultiSelectRow label="Lifestyle" value={lifestyle} options={PREFERENCE_OPTIONS.lifestyle} onChange={setLifestyle} emptyLabel="None" />
            <SelectRow label="Communication style" value={communication} options={PREFERENCE_OPTIONS.communication} onChange={setCommunication} />
          </Group>

          <Group title="Safety">
            <SelectRow label="Only meet verified people" value={onlyVerified} options={VERIFIED_ONLY} onChange={setOnlyVerified} allowEmpty={false} />
            <ToggleRow label="Safe First Date" hint="Plan, trusted contact and check-in" checked={safeFirstDate} onChange={setSafeFirstDate} />
          </Group>

          <Group title="Affinities">
            <MultiSelectRow label="Interests" value={interests} options={PREFERENCE_OPTIONS.interests} onChange={setInterests} emptyLabel="None" />
            <MultiSelectRow label="Ideal first date" value={dateTypes} options={PREFERENCE_OPTIONS.dateTypes} onChange={setDateTypes} emptyLabel="None" />
            <SliderRow label="Minimum compatibility" value={compatibilityMin} min={50} max={95} onChange={setCompatibilityMin} format={(v) => `${v}%`} />
          </Group>
        </motion.div>

        <div className="w-full z-10 pt-2">
          <PrimaryButton onClick={handleSubmit}>Continue</PrimaryButton>
        </div>
      </div>
    </div>
  );
}
