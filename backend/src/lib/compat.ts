import { distanceMiles } from './geo';
import { CHURCH_ATTENDANCE, type PublicProfile, type Questionnaire } from './types';

export interface Subject {
  profile: PublicProfile;
  q: Questionnaire;
}

/** Pesos de la hoja "Compatibilidad" de SafeMeet.Ut (suman 100). */
export const FACTOR_WEIGHTS = {
  faith: 25,
  goal: 20,
  family: 15,
  languageCulture: 10,
  distance: 10,
  values: 10,
  lifestyle: 10,
} as const;

export type Factor = keyof typeof FACTOR_WEIGHTS;

export interface CompatResult {
  score: number;
  eligible: boolean;
  excluded?: string;
  commonGround: string[];
  /** 0–100 por factor, para explicar "¿por qué hacemos buena pareja?". */
  factors: Record<Factor, number>;
}

const shared = (a: string[] = [], b: string[] = []) => a.filter((x) => b.includes(x));
const avg = (...xs: number[]) => xs.reduce((s, n) => s + n, 0) / xs.length;
const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

const hasChildren = (q: Questionnaire) => (q.childrenStatus ? q.childrenStatus !== 'No' : q.hasChildren);

/** Metas de relación; los perfiles anteriores solo tienen `seekingMarriage`. */
const goalsOf = (q: Questionnaire) =>
  q.relationshipGoals?.length ? q.relationshipGoals : q.seekingMarriage ? ['Marriage'] : ['Meeting people'];

/** ¿Pide recomendación del templo en su pareja? (campo nuevo o el anterior). */
const templeDemand = (q: Questionnaire): 'hard' | 'soft' | 'none' => {
  if (q.partnerTempleImportance === 'Essential' || q.templeMarriageRequirement === 'Indispensable') return 'hard';
  if (q.partnerTempleImportance === 'Very important' || q.partnerTempleImportance === 'Preferred') return 'soft';
  if (!q.partnerTempleImportance && q.templeMarriageRequirement === 'Preferred') return 'soft';
  return 'none';
};
const hasRecommend = (q: Questionnaire) => q.templeRecommend === 'Sí' || q.templeRecommend === 'En proceso';

/** Puertas duras evaluadas desde el punto de vista de `me` hacia `other`. */
function hardGate(me: Subject, other: Subject, miles: number): string | undefined {
  if (other.profile.safetyStatus === 'restricted' || other.profile.safetyStatus === 'blocked') {
    return 'safety';
  }
  if (other.profile.age < me.q.minAge || other.profile.age > me.q.maxAge) return 'age';
  if (miles > me.q.maxDistanceMiles && me.q.openToLongDistance !== 'Yes') return 'distance';
  if (templeDemand(me.q) === 'hard' && !hasRecommend(other.q)) return 'temple';
  if (me.q.marriageIndispensable && !other.q.seekingMarriage) return 'marriage';
  if (me.q.familyIndispensable && me.q.acceptsPartnerWithChildren === 'No' && hasChildren(other.q)) {
    return 'children';
  }
  if (me.q.verifiedOnly === 'Yes' && !other.profile.verified) return 'verification';
  if (
    me.q.languageImportance === 'Essential' &&
    me.q.partnerLanguages?.length &&
    !shared(me.q.partnerLanguages, other.q.languages).length
  ) {
    return 'language';
  }
  return undefined;
}

/** Cuánto satisface `other` lo que `me` pide en idioma (1 = todo). */
const languageFit = (me: Questionnaire, other: Questionnaire) =>
  !me.partnerLanguages?.length || shared(me.partnerLanguages, other.languages).length ? 1 : 0.3;

const cultureFit = (me: Questionnaire, other: Questionnaire) => {
  const prefs = me.culturePreferences ?? [];
  if (!prefs.length || prefs.includes('No preference')) return 1;
  return other.culturalBackground && prefs.includes(other.culturalBackground) ? 1 : 0.4;
};

const templeFit = (me: Questionnaire, other: Questionnaire) => {
  const d = templeDemand(me);
  if (d === 'none') return 1;
  if (other.templeRecommend === 'Sí') return 1;
  if (other.templeRecommend === 'En proceso') return 0.6;
  return d === 'soft' ? 0.3 : 0;
};

const childrenFit = (me: Questionnaire, other: Questionnaire) => {
  if (!hasChildren(other)) return 1;
  return me.acceptsPartnerWithChildren === 'Sí' ? 1 : me.acceptsPartnerWithChildren === 'Flexible' ? 0.6 : 0.1;
};

const UNSURE = new Set(['Tal vez', 'No seguro']);
const wantsChildrenFit = (a: Questionnaire, b: Questionnaire) => {
  if (a.wantsChildren === b.wantsChildren) return 1;
  if (UNSURE.has(a.wantsChildren) || UNSURE.has(b.wantsChildren)) return 0.5;
  return 0;
};

const PRIORITY_RANK = { Essential: 3, Important: 2, 'Nice to have': 1, 'Not important': 0 } as const;

/**
 * Motor de Conexión Klick (0–100, determinista).
 * Las puertas duras se aplican en ambos sentidos; el puntaje es simétrico.
 * Cada factor vale 0–1 y se multiplica por su peso de `FACTOR_WEIGHTS`.
 */
export function compatibility(a: Subject, b: Subject): CompatResult {
  const miles = distanceMiles(a.profile.lat, a.profile.lng, b.profile.lat, b.profile.lng);
  const empty = { faith: 0, goal: 0, family: 0, languageCulture: 0, distance: 0, values: 0, lifestyle: 0 };

  const fail = hardGate(a, b, miles) ?? hardGate(b, a, miles);
  if (fail) return { score: 0, eligible: false, excluded: fail, commonGround: [], factors: empty };

  const cg: string[] = [];
  const A = a.q;
  const B = b.q;

  // ⛪ Fe LDS: recomendación del templo, asistencia e importancia de la Iglesia.
  const sameFaith = A.faith === B.faith;
  if (sameFaith) cg.push(`Comparten la fe: ${B.faith}`);
  const sameImportance = A.churchImportance && B.churchImportance
    ? A.churchImportance === B.churchImportance
    : A.faithImportance === B.faithImportance;
  if (sameImportance) cg.push(`Misma prioridad de fe: ${B.churchImportance ?? B.faithImportance}`);
  let attendance = 0.5;
  if (A.churchAttendance && B.churchAttendance) {
    const gap = Math.abs(CHURCH_ATTENDANCE.indexOf(A.churchAttendance) - CHURCH_ATTENDANCE.indexOf(B.churchAttendance));
    attendance = 1 - gap / 3;
    if (gap === 0) cg.push(`Misma asistencia a la Iglesia: ${B.churchAttendance}`);
  }
  const bothRecommend = A.templeRecommend === 'Sí' && B.templeRecommend === 'Sí';
  if (bothRecommend) cg.push('Ambos tienen recomendación para el templo');
  const faith =
    (sameFaith ? 0.3 : 0) + (sameImportance ? 0.15 : 0) + attendance * 0.25 + (bothRecommend ? 0.15 : 0) +
    avg(templeFit(A, B), templeFit(B, A)) * 0.15;

  // 💍 Meta de relación.
  const goals = shared(goalsOf(A), goalsOf(B));
  let goal = goals.length ? 0.6 : 0.15;
  if (goals.length) cg.push(`Buscan lo mismo: ${goals.slice(0, 2).join(', ')}`);
  if (A.seekingMarriage && B.seekingMarriage) {
    goal += 0.2;
    cg.push('Ambos buscan una relación seria con meta de matrimonio');
  }
  if (A.marriageTimeline === B.marriageTimeline) {
    goal += 0.2;
    cg.push(`Mismo plazo de matrimonio (${B.marriageTimeline})`);
  } else goal += 0.1;

  // 👨‍👩‍👧 Familia: hijos, deseo de hijos y aceptación de hijos.
  const wants = wantsChildrenFit(A, B);
  if (wants === 1) cg.push(`Mismo deseo de hijos: ${B.wantsChildren}`);
  const family = wants * 0.5 + avg(childrenFit(A, B), childrenFit(B, A)) * 0.5;

  // 🌎 Idioma y cultura.
  const langs = shared(A.languages, B.languages);
  if (langs.length) cg.push(`Idioma compartido: ${langs.join(', ')}`);
  const languageCulture =
    (langs.length ? 0.6 : 0.15) + avg(languageFit(A, B), languageFit(B, A)) * 0.2 + avg(cultureFit(A, B), cultureFit(B, A)) * 0.2;

  // 📍 Distancia y disposición a relación a distancia.
  let distance = miles <= 15 ? 1 : miles <= 35 ? 0.8 : miles <= 60 ? 0.6 : 0.4;
  if (miles > 60 && A.openToLongDistance === 'Yes' && B.openToLongDistance === 'Yes') distance = 0.6;

  // ❤️ Valores: valores principales + prioridad de cada valor.
  const parts: number[] = [];
  const core = shared(A.coreValues, B.coreValues);
  if (A.coreValues?.length && B.coreValues?.length) parts.push(Math.min(1, 0.4 + core.length * 0.2));
  if (core.length) cg.push(`Valores en común: ${core.slice(0, 3).join(', ')}`);
  const pa = A.valuePriorities ?? {};
  const pb = B.valuePriorities ?? {};
  const rated = (Object.keys(pa) as Array<keyof typeof pa>).filter((k) => pa[k] && pb[k]);
  if (rated.length) {
    parts.push(avg(...rated.map((k) => 1 - Math.abs(PRIORITY_RANK[pa[k]!] - PRIORITY_RANK[pb[k]!]) / 3)));
  }
  const values = parts.length ? avg(...parts) : 0.5;

  // 🏃 Estilo de vida: rutina, intereses, comunicación, cita ideal y verificación.
  const life = shared(A.lifestyleRoutine, B.lifestyleRoutine);
  if (life.length) cg.push(`Estilo de vida afín: ${life.join(', ')}`);
  const interests = [...shared(A.hobbies, B.hobbies), ...shared(A.sports, B.sports)];
  if (interests.length) cg.push(`Intereses comunes: ${interests.slice(0, 3).join(', ')}`);
  const sameComm = A.communicationStyle === B.communicationStyle;
  if (sameComm) cg.push(`Comunicación ${B.communicationStyle}`);
  const dates = shared(A.preferredDateTypes, B.preferredDateTypes);
  if (dates.length) cg.push(`Primera cita ideal: ${dates[0]}`);
  const lifestyle =
    Math.min(1, 0.5 + life.length * 0.25) * 0.25 +
    Math.min(1, 0.3 + interests.length * 0.25) * 0.3 +
    (sameComm ? 1 : 0.5) * 0.15 +
    (dates.length ? 1 : 0.5) * 0.15 +
    avg(a.profile.verified ? 1 : 0.5, b.profile.verified ? 1 : 0.5) * 0.15;

  const raw: Record<Factor, number> = { faith, goal, family, languageCulture, distance, values, lifestyle };
  const factors = { ...empty };
  let total = 0;
  for (const k of Object.keys(FACTOR_WEIGHTS) as Factor[]) {
    const v = clamp01(raw[k]);
    factors[k] = Math.round(v * 100);
    total += v * FACTOR_WEIGHTS[k];
  }
  const score = Math.round(total * 10) / 10;
  const threshold = Math.max(60, A.minCompatibility ?? 0, B.minCompatibility ?? 0);
  const eligible = score >= threshold;
  return {
    score,
    eligible,
    excluded: eligible ? undefined : 'threshold',
    commonGround: cg.slice(0, 7),
    factors,
  };
}
