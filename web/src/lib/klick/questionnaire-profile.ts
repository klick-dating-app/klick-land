import type { KlickUserProfile } from '@/lib/klick/compatibility-engine';
import type { Questionnaire } from '@/lib/types';

/**
 * Pasa el cuestionario guardado en Firestore a los campos del perfil de la UI.
 * Solo devuelve lo que el usuario respondió, para no pisar con vacíos los valores del molde.
 */
export function profileFromQuestionnaire(q: Questionnaire): Partial<KlickUserProfile> {
  const out: Partial<KlickUserProfile> = {
    faith: q.faith,
    faithImportance: q.faithImportance,
    templeRecommend: q.templeRecommend === 'Prefiero no indicar' ? 'Prefer not to say' : q.templeRecommend,
    templeMarriageRequirement: q.templeMarriageRequirement,
    maritalStatus: q.maritalStatus as KlickUserProfile['maritalStatus'],
    seekingMarriage: q.seekingMarriage,
    marriageTimeline: q.marriageTimeline as KlickUserProfile['marriageTimeline'],
    marriageIndispensable: q.marriageIndispensable,
    hasChildren: q.hasChildren,
    wantsChildren: q.wantsChildren as KlickUserProfile['wantsChildren'],
    acceptsPartnerWithChildren: q.acceptsPartnerWithChildren,
    familyIndispensable: q.familyIndispensable,
    languages: q.languages,
    lifestyleRoutine: q.lifestyleRoutine,
    communicationStyle: q.communicationStyle,
    hobbies: q.hobbies,
    sports: q.sports,
    preferredDateTypes: q.preferredDateTypes,
    preferences: { minAge: q.minAge, maxAge: q.maxAge, maxDistanceMiles: q.maxDistanceMiles },
    churchImportance: q.churchImportance,
    churchAttendance: q.churchAttendance,
    relationshipGoals: q.relationshipGoals,
    childrenStatus: q.childrenStatus,
    culturalBackground: q.culturalBackground,
    openToLongDistance: q.openToLongDistance,
    coreValues: q.coreValues,
    education: q.education,
    heightCm: q.heightCm,
    partnerTempleImportance: q.partnerTempleImportance,
    spiritualExpectations: q.spiritualExpectations,
    partnerLanguages: q.partnerLanguages,
    desiredLanguages: q.partnerLanguages,
    languageImportance: q.languageImportance,
    culturePreferences: q.culturePreferences,
    valuePriorities: q.valuePriorities,
    verifiedOnly: q.verifiedOnly,
  };
  if (q.occupation) out.occupation = q.occupation;
  if (q.servedMission) out.servedMission = q.servedMission as KlickUserProfile['servedMission'];
  return Object.fromEntries(Object.entries(out).filter(([, v]) => v !== undefined && v !== '')) as Partial<KlickUserProfile>;
}
