import { distanceMiles } from './geo';
import type { PublicProfile, Questionnaire } from './types';

export interface Subject {
  profile: PublicProfile;
  q: Questionnaire;
}

export interface CompatResult {
  score: number;
  eligible: boolean;
  excluded?: string;
  commonGround: string[];
}

const MAX_POINTS = 43;
const shared = (a: string[], b: string[]) => a.filter((x) => b.includes(x));

/** Puertas duras evaluadas desde el punto de vista de `me` hacia `other`. */
function hardGate(me: Subject, other: Subject, miles: number): string | undefined {
  if (other.profile.safetyStatus === 'restricted' || other.profile.safetyStatus === 'blocked') {
    return 'safety';
  }
  if (other.profile.age < me.q.minAge || other.profile.age > me.q.maxAge) return 'age';
  if (miles > me.q.maxDistanceMiles) return 'distance';
  if (
    me.q.templeMarriageRequirement === 'Indispensable' &&
    other.q.templeRecommend !== 'Sí' &&
    other.q.templeRecommend !== 'En proceso'
  ) {
    return 'temple';
  }
  if (me.q.marriageIndispensable && !other.q.seekingMarriage) return 'marriage';
  if (me.q.familyIndispensable && me.q.acceptsPartnerWithChildren === 'No' && other.q.hasChildren) {
    return 'children';
  }
  return undefined;
}

/**
 * Motor de Conexión Klick (0–100, determinista).
 * Las puertas duras se aplican en ambos sentidos; el puntaje es simétrico.
 */
export function compatibility(a: Subject, b: Subject): CompatResult {
  const miles = distanceMiles(a.profile.lat, a.profile.lng, b.profile.lat, b.profile.lng);

  const fail = hardGate(a, b, miles) ?? hardGate(b, a, miles);
  if (fail) return { score: 0, eligible: false, excluded: fail, commonGround: [] };

  const cg: string[] = [];
  const pts = { safety: 0, faith: 0, marriage: 0, family: 0, languages: 0, distance: 0, lifestyle: 0, personality: 0, hobbies: 0, date: 0 };

  // Seguridad (máx. 6): 3 puntos por cada perfil verificado, 1.5 si está pendiente.
  pts.safety = (a.profile.verified ? 3 : 1.5) + (b.profile.verified ? 3 : 1.5);

  pts.distance = miles <= 15 ? 4 : miles <= 35 ? 3.2 : miles <= 60 ? 2.4 : 1.5;

  let faith = 0;
  if (a.q.faith === b.q.faith) {
    faith += 2.5;
    cg.push(`Comparten la fe: ${b.q.faith}`);
  }
  if (a.q.faithImportance === b.q.faithImportance) {
    faith += 1.5;
    cg.push(`Misma prioridad de fe: ${b.q.faithImportance}`);
  }
  if (b.q.templeRecommend === 'Sí' && a.q.templeRecommend === 'Sí') faith += 1;
  pts.faith = Math.min(5, faith);

  let marriage = 0;
  if (a.q.seekingMarriage && b.q.seekingMarriage) {
    marriage += 3;
    cg.push('Ambos buscan una relación seria con meta de matrimonio');
  }
  if (a.q.marriageTimeline === b.q.marriageTimeline) {
    marriage += 2;
    cg.push(`Mismo plazo de matrimonio (${b.q.marriageTimeline})`);
  } else marriage += 1;
  pts.marriage = Math.min(5, marriage);

  let family = 0;
  if (a.q.wantsChildren === b.q.wantsChildren) {
    family += 3;
    cg.push(`Mismo deseo de hijos: ${b.q.wantsChildren}`);
  }
  family += a.q.acceptsPartnerWithChildren === b.q.acceptsPartnerWithChildren ? 2 : 1;
  pts.family = Math.min(5, family);

  const langs = shared(a.q.languages, b.q.languages);
  pts.languages = langs.length ? 4 : 1.5;
  if (langs.length) cg.push(`Idioma compartido: ${langs.join(', ')}`);

  const life = shared(a.q.lifestyleRoutine, b.q.lifestyleRoutine);
  pts.lifestyle = Math.min(4, 2 + life.length);
  if (life.length) cg.push(`Estilo de vida afín: ${life.join(', ')}`);

  pts.personality = 2.5;
  if (a.q.communicationStyle === b.q.communicationStyle) {
    pts.personality += 1.5;
    cg.push(`Comunicación ${b.q.communicationStyle}`);
  }

  const interests = [...shared(a.q.hobbies, b.q.hobbies), ...shared(a.q.sports, b.q.sports)];
  pts.hobbies = Math.min(3, 1 + interests.length * 0.7);
  if (interests.length) cg.push(`Intereses comunes: ${interests.slice(0, 3).join(', ')}`);

  const dates = shared(a.q.preferredDateTypes, b.q.preferredDateTypes);
  pts.date = dates.length ? 3 : 1.5;
  if (dates.length) cg.push(`Primera cita ideal: ${dates[0]}`);

  const total = Object.values(pts).reduce((s, n) => s + n, 0);
  const score = Math.round((total / MAX_POINTS) * 1000) / 10;
  const eligible = score >= 60;
  return {
    score,
    eligible,
    excluded: eligible ? undefined : 'threshold',
    commonGround: cg.slice(0, 7),
  };
}
