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
  templeRecommend: 'Sí' | 'En proceso' | 'No' | 'Prefiero no indicar';
  templeMarriageRequirement: 'Indispensable' | 'Preferred' | 'Flexible';
  servedMission: 'Sí (Nacional)' | 'Sí (Internacional)' | 'No' | 'Servicio honorable';

  // 2. Matrimonio & Objetivos (Peso: 5)
  maritalStatus: 'Soltero/a' | 'Divorciado/a' | 'Viudo/a';
  seekingMarriage: boolean;
  marriageTimeline: '<1 año' | '1-2 años' | '2+ años' | 'Flexible';
  marriageIndispensable: boolean;

  // 3. Familia & Hijos (Peso: 5)
  hasChildren: boolean;
  wantsChildren: 'Sí' | 'No' | 'No seguro';
  acceptsPartnerWithChildren: 'Sí' | 'No' | 'Flexible';
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
  commonGround: string[];
  exclusionReason?: string;
  isEligibleForMatch: boolean;
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
      commonGround: [],
      exclusionReason: 'Candidato restringido o bloqueado por seguridad Trust & Safety.',
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
    if (candidate.templeRecommend !== 'Sí' && candidate.templeRecommend !== 'En proceso') {
      return {
        score: 0,
        passedSafetyGate: true,
        passedHardCompatibilityGate: false,
        passedThreshold60: false,
        categoryScores,
        commonGround: [],
        exclusionReason: 'Requisito Indispensable de Matrimonio en el Templo no satisfecho.',
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
      commonGround: [],
      exclusionReason: 'Requisito Indispensable de meta de matrimonio no satisfecho.',
      isEligibleForMatch: false,
    };
  }

  // Requisito 3: Hijos Indispensable
  if (userA.familyIndispensable && userA.acceptsPartnerWithChildren === 'No' && candidate.hasChildren) {
    return {
      score: 0,
      passedSafetyGate: true,
      passedHardCompatibilityGate: false,
      passedThreshold60: false,
      categoryScores,
      commonGround: [],
      exclusionReason: 'Preferencia familiar indispensable no coincide.',
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
      commonGround: [],
      exclusionReason: `Distancia (${candidate.distanceMiles} mi) excede el radio máximo (${maxDistance} mi).`,
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
    commonGround.push(`Ambos son miembros de la fe ${candidate.faith}`);
  }
  if (userA.faithImportance === candidate.faithImportance) {
    faithScore += 1.5;
    commonGround.push(`Prioridad de fe compartida: ${candidate.faithImportance}`);
  }
  if (candidate.templeRecommend === 'Sí') {
    faithScore += 1.0;
  }
  categoryScores.faith = Math.min(5, faithScore);

  // 2. Matrimonio & Metas (Peso 5)
  let marriageScore = 0;
  if (userA.seekingMarriage && candidate.seekingMarriage) {
    marriageScore += 3.0;
    commonGround.push('Ambos buscan una relación seria con meta de matrimonio');
  }
  if (userA.marriageTimeline === candidate.marriageTimeline) {
    marriageScore += 2.0;
    commonGround.push(`Plazo de matrimonio coincidente (${candidate.marriageTimeline})`);
  } else {
    marriageScore += 1.0;
  }
  categoryScores.marriage = Math.min(5, marriageScore);

  // 3. Familia & Hijos (Peso 5)
  let familyScore = 0;
  if (userA.wantsChildren === candidate.wantsChildren) {
    familyScore += 3.0;
    commonGround.push(`Deseo de hijos coincidente: ${candidate.wantsChildren}`);
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
    commonGround.push(`Idioma compartido: ${sharedLanguages.join(', ')}`);
  } else {
    langScore = 1.5;
  }
  categoryScores.languages = langScore;

  // 5. Estilo de Vida & Rutina (Peso 4)
  const sharedLifestyle = userA.lifestyleRoutine.filter(r => candidate.lifestyleRoutine.includes(r));
  let lifestyleScore = 2.0;
  if (sharedLifestyle.length > 0) {
    lifestyleScore += Math.min(2.0, sharedLifestyle.length * 1.0);
    commonGround.push(`Estilo de vida afin: ${sharedLifestyle.join(', ')}`);
  }
  categoryScores.lifestyle = Math.min(4, lifestyleScore);

  // 6. Personalidad & Metas (Peso 4)
  let personalityScore = 2.5;
  if (userA.communicationStyle === candidate.communicationStyle) {
    personalityScore += 1.5;
    commonGround.push(`Comunicación ${candidate.communicationStyle}`);
  }
  categoryScores.personality = Math.min(4, personalityScore);

  // 7. Hobbies e Intereses (Peso 3)
  const sharedHobbies = userA.hobbies.filter(h => candidate.hobbies.includes(h));
  const sharedSports = userA.sports.filter(s => candidate.sports.includes(s));
  const allSharedInterests = [...sharedHobbies, ...sharedSports];
  let hobbiesScore = 1.0;
  if (allSharedInterests.length > 0) {
    hobbiesScore += Math.min(2.0, allSharedInterests.length * 0.7);
    commonGround.push(`Intereses comunes: ${allSharedInterests.slice(0, 3).join(', ')}`);
  }
  categoryScores.hobbies = Math.min(3, hobbiesScore);

  // 8. Safe First Date (Peso 3)
  const sharedDateTypes = userA.preferredDateTypes.filter(d => candidate.preferredDateTypes.includes(d));
  let dateScore = 1.5;
  if (sharedDateTypes.length > 0) {
    dateScore += 1.5;
    commonGround.push(`Primera cita ideal: ${sharedDateTypes[0]}`);
  }
  categoryScores.safeFirstDate = Math.min(3, dateScore);

  // --- CÁLCULO DE SCORE NORMALIZADO (Total Peso: 43) ---
  const totalScoreObtained =
    categoryScores.safety +
    categoryScores.faith +
    categoryScores.marriage +
    categoryScores.family +
    categoryScores.languages +
    categoryScores.distance +
    categoryScores.lifestyle +
    categoryScores.personality +
    categoryScores.hobbies +
    categoryScores.safeFirstDate;

  const maxPossible = 43;
  const rawScore = (totalScoreObtained / maxPossible) * 100;
  const finalScore = Math.round(rawScore * 10) / 10; // 1 decimal

  // --- PUERTA 4: UMBRAL DEL 60% (M-006 / DEV-008 / AT-001..002) ---
  const passedThreshold60 = finalScore >= 60.0;

  // Limitar Common Ground a 3 - 7 elementos reales
  const finalCommonGround = commonGround.slice(0, 7);

  return {
    score: finalScore,
    passedSafetyGate: true,
    passedHardCompatibilityGate: true,
    passedThreshold60,
    categoryScores,
    commonGround: finalCommonGround,
    isEligibleForMatch: passedThreshold60,
    exclusionReason: !passedThreshold60 ? `El Score (${finalScore}%) está por debajo del umbral mínimo del 60.0%.` : undefined,
  };
}
