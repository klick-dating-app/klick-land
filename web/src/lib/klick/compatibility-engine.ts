export interface KlickUserProfile {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  city: string;
  state: string;
  distanceMiles: number;
  photos: string[];
  bio: string;
  verifiedKYC: boolean;
  safetyStatus: 'verified' | 'pending' | 'restricted' | 'blocked';

  // 1. Fe & Valores LDS (Peso: 5)
  faith: string; // 'LDS' | 'Christian' | 'Other'
  faithImportance: 'Very important' | 'Important' | 'Flexible';
  templeRecommend: 'Yes' | 'In progress' | 'No' | 'Prefer not to say' | 'Sí' | 'En proceso';
  templeMarriageRequirement: 'Indispensable' | 'Preferred' | 'Flexible';
  servedMission: 'Yes (Domestic)' | 'Yes (International)' | 'No' | 'Honorable service' | 'Sí (Nacional)' | 'Sí (Internacional)';

  // 2. Matrimonio & Objetivos (Peso: 5)
  maritalStatus: 'Single' | 'Divorced' | 'Widowed' | 'Soltero/a' | 'Divorciado/a' | 'Viudo/a';
  seekingMarriage: boolean;
  marriageTimeline: '<1 year' | '1-2 years' | '2+ years' | 'Flexible' | '<1 año' | '1-2 años' | '2+ años';
  marriageIndispensable: boolean;

  // 3. Familia & Hijos (Peso: 5)
  hasChildren: boolean;
  wantsChildren: 'Yes' | 'No' | 'Not sure' | 'Sí' | 'No seguro';
  acceptsPartnerWithChildren: 'Yes' | 'No' | 'Flexible' | 'Sí';
  familyIndispensable: boolean;

  // 4. Idiomas & Cultura (Peso: 4)
  languages: string[]; // ['English', 'Spanish']
  desiredLanguages: string[];

  // 5. Estilo de Vida & Rutina (Peso: 4)
  lifestyleRoutine: string[]; // ['Activo', 'Tranquilo', 'Hogareño', 'Social']
  occupation: string;
  isStudent: boolean;

  // 6. Compatibilidad & Personalidad (Peso: 4)
  communicationStyle: string; // 'Directo' | 'Tranquilo' | 'Social' | 'Reservado'
  shortTermGoals: string[];
  longTermGoals: string[];

  // 7. Hobbies e Intereses (Peso: 3)
  hobbies: string[]; // ['Hiking', 'Lectura', 'Cocina', 'Música']
  sports: string[]; // ['Pickleball', 'Running', 'Gym', 'Escalada']

  // 8. Safe First Date (Peso: 3)
  preferredDateTypes: string[]; // ['Café', 'Caminata en parque', 'Restaurante público', 'Helado']
  safetyPreferences: string[]; // ['Lugar público', 'Horario diurno', 'Check-in activo']

  // 9. Campos SafeMeet.Ut (mismos nombres que `Questionnaire`; opcionales)
  churchImportance?: string;
  churchAttendance?: string;
  relationshipGoals?: string[];
  childrenStatus?: string;
  culturalBackground?: string;
  openToLongDistance?: string;
  coreValues?: string[];
  education?: string;
  heightCm?: number;
  partnerTempleImportance?: string;
  spiritualExpectations?: string[];
  partnerLanguages?: string[];
  languageImportance?: string;
  culturePreferences?: string[];
  valuePriorities?: Partial<Record<string, string>>;
  verifiedOnly?: string;
  socials?: Partial<Record<'spotify' | 'facebook' | 'instagram' | 'whatsapp' | 'x' | 'youtube' | 'tiktok', string>>;

  // Datos Privados / Configuración de Búsqueda
  preferences?: {
    minAge?: number;
    maxAge?: number;
    maxDistanceMiles?: number;
    requiredFaith?: string;
    mustHaveTempleRecommend?: boolean;
    mustWantMarriage?: boolean;
  };
}

export interface CompatibilityResult {
  score: number; // 0 - 100
  passedSafetyGate: boolean;
  passedHardCompatibilityGate: boolean;
  passedThreshold60: boolean;
  categoryScores: {
    safety: number; // Max 6
    faith: number; // Max 5
    marriage: number; // Max 5
    family: number; // Max 5
    languages: number; // Max 4
    distance: number; // Max 4
    lifestyle: number; // Max 4
    personality: number; // Max 4
    hobbies: number; // Max 3
    safeFirstDate: number; // Max 3
  };
  /** 0–100 por factor de la hoja "Compatibilidad" (mismos nombres que el backend). */
  factors: Record<CompatFactor, number>;
  commonGround: string[];
  exclusionReason?: string;
  isEligibleForMatch: boolean;
}

/** Pesos de la hoja "Compatibilidad" de SafeMeet.Ut; copia de `backend/src/lib/compat.ts`. */
export const FACTOR_WEIGHTS = {
  faith: 25,
  goal: 20,
  family: 15,
  languageCulture: 10,
  distance: 10,
  values: 10,
  lifestyle: 10,
} as const;
export type CompatFactor = keyof typeof FACTOR_WEIGHTS;

export const FACTOR_LABELS: Record<CompatFactor, { label: string; emoji: string; compares: string }> = {
  faith: { label: 'LDS Faith', emoji: '⛪', compares: 'Temple recommend, attendance, importance of the Church' },
  goal: { label: 'Relationship Goal', emoji: '💍', compares: 'Friendship, serious relationship, marriage, temple' },
  family: { label: 'Family', emoji: '👨‍👩‍👧', compares: 'Children, wanting children, accepting children' },
  languageCulture: { label: 'Language & Culture', emoji: '🌎', compares: 'Languages and cultural preferences' },
  distance: { label: 'Distance', emoji: '📍', compares: 'Distance and openness to long distance' },
  values: { label: 'Values', emoji: '❤️', compares: 'Family, integrity, service, health…' },
  lifestyle: { label: 'Lifestyle', emoji: '🏃', compares: 'Interests and compatible habits' },
};

const NO_FACTORS: Record<CompatFactor, number> = { faith: 0, goal: 0, family: 0, languageCulture: 0, distance: 0, values: 0, lifestyle: 0 };

const ATTENDANCE = ['Every week', 'Almost every week', 'A few times a month', 'Occasionally'];
const YES = new Set(['Yes', 'Sí']);
const UNSURE = new Set(['Not sure', 'No seguro', 'Maybe', 'Tal vez', 'Not sure yet']);
const sharedOf = (a: string[] = [], b: string[] = []) => a.filter((x) => b.includes(x));
const mean = (...xs: number[]) => xs.reduce((s, n) => s + n, 0) / xs.length;
const kids = (p: KlickUserProfile) => (p.childrenStatus ? p.childrenStatus !== 'No' : p.hasChildren);
const goalsOf = (p: KlickUserProfile) => p.relationshipGoals?.length ? p.relationshipGoals : p.seekingMarriage ? ['Marriage'] : ['Meeting people'];
const templeFit = (me: KlickUserProfile, other: KlickUserProfile) => {
  const demand = me.partnerTempleImportance ?? (me.templeMarriageRequirement === 'Indispensable' ? 'Essential' : me.templeMarriageRequirement === 'Preferred' ? 'Preferred' : 'Not important');
  if (!['Essential', 'Very important', 'Preferred'].includes(demand)) return 1;
  if (YES.has(other.templeRecommend)) return 1;
  if (other.templeRecommend === 'In progress' || other.templeRecommend === 'En proceso') return 0.6;
  return demand === 'Essential' ? 0 : 0.3;
};
const childrenFit = (me: KlickUserProfile, other: KlickUserProfile) =>
  !kids(other) ? 1 : YES.has(me.acceptsPartnerWithChildren) ? 1 : me.acceptsPartnerWithChildren === 'Flexible' ? 0.6 : 0.1;
const cultureFit = (me: KlickUserProfile, other: KlickUserProfile) => {
  const prefs = me.culturePreferences ?? [];
  if (!prefs.length || prefs.includes('No preference')) return 1;
  return other.culturalBackground && prefs.includes(other.culturalBackground) ? 1 : 0.4;
};
const langFit = (me: KlickUserProfile, other: KlickUserProfile) =>
  !me.partnerLanguages?.length || sharedOf(me.partnerLanguages, other.languages).length ? 1 : 0.3;
const RANK: Record<string, number> = { Essential: 3, Important: 2, 'Nice to have': 1, 'Not important': 0 };

/** Los 7 factores (0–1) y el "common ground" que añaden los campos SafeMeet. */
function sheetFactors(a: KlickUserProfile, b: KlickUserProfile) {
  const extra: string[] = [];
  let attendance = 0.5;
  if (a.churchAttendance && b.churchAttendance) {
    const gap = Math.abs(ATTENDANCE.indexOf(a.churchAttendance) - ATTENDANCE.indexOf(b.churchAttendance));
    attendance = 1 - gap / 3;
    if (gap === 0) extra.push(`Same church attendance: ${b.churchAttendance}`);
  }
  const sameImportance = a.churchImportance && b.churchImportance ? a.churchImportance === b.churchImportance : a.faithImportance === b.faithImportance;
  const bothRecommend = YES.has(a.templeRecommend) && YES.has(b.templeRecommend);
  const faith = (a.faith === b.faith ? 0.3 : 0) + (sameImportance ? 0.15 : 0) + attendance * 0.25 + (bothRecommend ? 0.15 : 0) + mean(templeFit(a, b), templeFit(b, a)) * 0.15;

  const goals = sharedOf(goalsOf(a), goalsOf(b));
  if (goals.length && a.relationshipGoals?.length && b.relationshipGoals?.length) extra.push(`Both looking for: ${goals.slice(0, 2).join(', ')}`);
  const goal = (goals.length ? 0.6 : 0.15) + (a.seekingMarriage && b.seekingMarriage ? 0.2 : 0) + (a.marriageTimeline === b.marriageTimeline ? 0.2 : 0.1);

  const wants = a.wantsChildren === b.wantsChildren ? 1 : UNSURE.has(a.wantsChildren) || UNSURE.has(b.wantsChildren) ? 0.5 : 0;
  const family = wants * 0.5 + mean(childrenFit(a, b), childrenFit(b, a)) * 0.5;

  const langs = sharedOf(a.languages, b.languages);
  if (a.culturalBackground && a.culturalBackground === b.culturalBackground) extra.push(`Shared culture: ${b.culturalBackground}`);
  const languageCulture = (langs.length ? 0.6 : 0.15) + mean(langFit(a, b), langFit(b, a)) * 0.2 + mean(cultureFit(a, b), cultureFit(b, a)) * 0.2;

  const miles = b.distanceMiles;
  let distance = miles <= 15 ? 1 : miles <= 35 ? 0.8 : miles <= 60 ? 0.6 : 0.4;
  if (miles > 60 && a.openToLongDistance === 'Yes' && b.openToLongDistance === 'Yes') distance = 0.6;

  const parts: number[] = [];
  const core = sharedOf(a.coreValues, b.coreValues);
  if (a.coreValues?.length && b.coreValues?.length) parts.push(Math.min(1, 0.4 + core.length * 0.2));
  if (core.length) extra.push(`Shared values: ${core.slice(0, 3).join(', ')}`);
  const pa = a.valuePriorities ?? {};
  const pb = b.valuePriorities ?? {};
  const rated = Object.keys(pa).filter((k) => pa[k] && pb[k] && k in pb);
  if (rated.length) parts.push(mean(...rated.map((k) => 1 - Math.abs((RANK[pa[k]!] ?? 0) - (RANK[pb[k]!] ?? 0)) / 3)));
  const values = parts.length ? mean(...parts) : 0.5;

  const life = sharedOf(a.lifestyleRoutine, b.lifestyleRoutine);
  const interests = [...sharedOf(a.hobbies, b.hobbies), ...sharedOf(a.sports, b.sports)];
  const lifestyle =
    Math.min(1, 0.5 + life.length * 0.25) * 0.25 +
    Math.min(1, 0.3 + interests.length * 0.25) * 0.3 +
    (a.communicationStyle === b.communicationStyle ? 1 : 0.5) * 0.15 +
    (sharedOf(a.preferredDateTypes, b.preferredDateTypes).length ? 1 : 0.5) * 0.15 +
    mean(a.verifiedKYC ? 1 : 0.5, b.verifiedKYC ? 1 : 0.5) * 0.15;

  const raw: Record<CompatFactor, number> = { faith, goal, family, languageCulture, distance, values, lifestyle };
  const factors = { ...NO_FACTORS };
  let score = 0;
  for (const k of Object.keys(FACTOR_WEIGHTS) as CompatFactor[]) {
    const v = Math.max(0, Math.min(1, raw[k]));
    factors[k] = Math.round(v * 100);
    score += v * FACTOR_WEIGHTS[k];
  }
  return { factors, score: Math.round(score * 10) / 10, extra };
}

/**
 * Motor de Conexión KLICK! (Algoritmo 0-100% determinista)
 * Evaluación estricta de Safety Gates, Hard Filters Indispensables,
 * Score Ponderado (Total 43 pts normalizado a 100%) y Common Ground.
 */
export function calculateKlickCompatibility(
  userA: KlickUserProfile,
  candidate: KlickUserProfile
): CompatibilityResult {
  const commonGround: string[] = [];
  const categoryScores = {
    safety: 0,
    faith: 0,
    marriage: 0,
    family: 0,
    languages: 0,
    distance: 0,
    lifestyle: 0,
    personality: 0,
    hobbies: 0,
    safeFirstDate: 0,
  };

  // --- PUERTA 1: HARD SAFETY GATE (M-001 / SEC-01..04) ---
  if (candidate.safetyStatus === 'restricted' || candidate.safetyStatus === 'blocked') {
    return {
      score: 0,
      passedSafetyGate: false,
      passedHardCompatibilityGate: false,
      passedThreshold60: false,
      categoryScores,
      factors: NO_FACTORS,
      commonGround: [],
      exclusionReason: 'Candidate account restricted or blocked by Trust & Safety.',
      isEligibleForMatch: false,
    };
  }

  // Puntos de Seguridad (Peso 6)
  if (candidate.verifiedKYC) {
    categoryScores.safety = 6;
  } else {
    categoryScores.safety = 3;
  }

  // --- PUERTA 2: HARD COMPATIBILITY GATE (Requisitos Indispensables M-002) ---
  // Requisito 1: Matrimonio en el Templo Indispensable
  if (userA.templeMarriageRequirement === 'Indispensable') {
    const isTempleOk = candidate.templeRecommend === 'Yes' || candidate.templeRecommend === 'In progress' || candidate.templeRecommend === 'Sí' || candidate.templeRecommend === 'En proceso';
    if (!isTempleOk) {
      return {
        score: 0,
        passedSafetyGate: true,
        passedHardCompatibilityGate: false,
        passedThreshold60: false,
        categoryScores,
        factors: NO_FACTORS,
        commonGround: [],
        exclusionReason: 'Indispensable requirement for Temple Marriage not met.',
        isEligibleForMatch: false,
      };
    }
  }

  // Requisito 2: Búsqueda de Matrimonio Indispensable
  if (userA.marriageIndispensable && !candidate.seekingMarriage) {
    return {
      score: 0,
      passedSafetyGate: true,
      passedHardCompatibilityGate: false,
      passedThreshold60: false,
      categoryScores,
      factors: NO_FACTORS,
      commonGround: [],
      exclusionReason: 'Indispensable requirement for marriage goal not satisfied.',
      isEligibleForMatch: false,
    };
  }

  // Requisito 3: Hijos Indispensable
  if (userA.familyIndispensable && (userA.acceptsPartnerWithChildren === 'No') && candidate.hasChildren) {
    return {
      score: 0,
      passedSafetyGate: true,
      passedHardCompatibilityGate: false,
      passedThreshold60: false,
      categoryScores,
      factors: NO_FACTORS,
      commonGround: [],
      exclusionReason: 'Family preference for children does not align.',
      isEligibleForMatch: false,
    };
  }

  // --- PUERTA 3: DISTANCIA GEOGRÁFICA (Peso 4) ---
  const maxDistance = userA.preferences?.maxDistanceMiles || 50;
  if (candidate.distanceMiles > maxDistance && candidate.distanceMiles > 100) {
    return {
      score: 0,
      passedSafetyGate: true,
      passedHardCompatibilityGate: false,
      passedThreshold60: false,
      categoryScores,
      factors: NO_FACTORS,
      commonGround: [],
      exclusionReason: `Distance (${candidate.distanceMiles} mi) exceeds maximum radius (${maxDistance} mi).`,
      isEligibleForMatch: false,
    };
  }

  if (candidate.distanceMiles <= 15) {
    categoryScores.distance = 4;
  } else if (candidate.distanceMiles <= 35) {
    categoryScores.distance = 3.2;
  } else if (candidate.distanceMiles <= 60) {
    categoryScores.distance = 2.4;
  } else {
    categoryScores.distance = 1.5;
  }

  // --- PONDERACIÓN DE CATEGORÍAS ---

  // 1. Fe & Valores LDS (Peso 5)
  let faithScore = 0;
  if (userA.faith === candidate.faith) {
    faithScore += 2.5;
    commonGround.push(`Both are members of the ${candidate.faith} faith`);
  }
  if (userA.faithImportance === candidate.faithImportance) {
    faithScore += 1.5;
    commonGround.push(`Shared faith priority: ${candidate.faithImportance}`);
  }
  if (candidate.templeRecommend === 'Yes' || candidate.templeRecommend === 'Sí') {
    faithScore += 1.0;
  }
  categoryScores.faith = Math.min(5, faithScore);

  // 2. Matrimonio & Metas (Peso 5)
  let marriageScore = 0;
  if (userA.seekingMarriage && candidate.seekingMarriage) {
    marriageScore += 3.0;
    commonGround.push('Both seeking a serious relationship leading to marriage');
  }
  if (userA.marriageTimeline === candidate.marriageTimeline) {
    marriageScore += 2.0;
    commonGround.push(`Matching marriage timeline (${candidate.marriageTimeline})`);
  } else {
    marriageScore += 1.0;
  }
  categoryScores.marriage = Math.min(5, marriageScore);

  // 3. Familia & Hijos (Peso 5)
  let familyScore = 0;
  if (userA.wantsChildren === candidate.wantsChildren) {
    familyScore += 3.0;
    commonGround.push(`Matching desire for children: ${candidate.wantsChildren}`);
  }
  if (userA.acceptsPartnerWithChildren === candidate.acceptsPartnerWithChildren) {
    familyScore += 2.0;
  } else {
    familyScore += 1.0;
  }
  categoryScores.family = Math.min(5, familyScore);

  // 4. Idiomas & Comunicación (Peso 4)
  const sharedLanguages = userA.languages.filter(l => candidate.languages.includes(l));
  let langScore = 0;
  if (sharedLanguages.length > 0) {
    langScore = 4;
    commonGround.push(`Shared language: ${sharedLanguages.join(', ')}`);
  } else {
    langScore = 1.5;
  }
  categoryScores.languages = langScore;

  // 5. Estilo de Vida & Rutina (Peso 4)
  const sharedLifestyle = userA.lifestyleRoutine.filter(r => candidate.lifestyleRoutine.includes(r));
  let lifestyleScore = 2.0;
  if (sharedLifestyle.length > 0) {
    lifestyleScore += Math.min(2.0, sharedLifestyle.length * 1.0);
    commonGround.push(`Compatible lifestyle: ${sharedLifestyle.join(', ')}`);
  }
  categoryScores.lifestyle = Math.min(4, lifestyleScore);

  // 6. Personalidad & Metas (Peso 4)
  let personalityScore = 2.5;
  if (userA.communicationStyle === candidate.communicationStyle) {
    personalityScore += 1.5;
    commonGround.push(`${candidate.communicationStyle} communication`);
  }
  categoryScores.personality = Math.min(4, personalityScore);

  // 7. Hobbies e Intereses (Peso 3)
  const sharedHobbies = userA.hobbies.filter(h => candidate.hobbies.includes(h));
  const sharedSports = userA.sports.filter(s => candidate.sports.includes(s));
  const allSharedInterests = [...sharedHobbies, ...sharedSports];
  let hobbiesScore = 1.0;
  if (allSharedInterests.length > 0) {
    hobbiesScore += Math.min(2.0, allSharedInterests.length * 0.7);
    commonGround.push(`Shared interests: ${allSharedInterests.slice(0, 3).join(', ')}`);
  }
  categoryScores.hobbies = Math.min(3, hobbiesScore);

  // 8. Safe First Date (Peso 3)
  const sharedDateTypes = userA.preferredDateTypes.filter(d => candidate.preferredDateTypes.includes(d));
  let dateScore = 1.5;
  if (sharedDateTypes.length > 0) {
    dateScore += 1.5;
    commonGround.push(`Ideal first date: ${sharedDateTypes[0]}`);
  }
  categoryScores.safeFirstDate = Math.min(3, dateScore);

  // `categoryScores` se conserva para el desglose detallado; el porcentaje usa los 7 factores de la hoja.
  const sheet = sheetFactors(userA, candidate);
  const finalScore = sheet.score;

  // --- PUERTA 4: UMBRAL DEL 60% (M-006 / DEV-008 / AT-001..002) ---
  const passedThreshold60 = finalScore >= 60.0;

  // Limitar Common Ground a 3 - 7 elementos reales (primero los datos SafeMeet)
  const finalCommonGround = [...sheet.extra, ...commonGround].slice(0, 7);

  return {
    score: finalScore,
    passedSafetyGate: true,
    passedHardCompatibilityGate: true,
    passedThreshold60,
    categoryScores,
    factors: sheet.factors,
    commonGround: finalCommonGround,
    isEligibleForMatch: passedThreshold60,
    exclusionReason: !passedThreshold60 ? `Compatibility score (${finalScore}%) is below the minimum 60.0% threshold.` : undefined,
  };
}
