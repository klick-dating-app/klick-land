import type { KlickUserProfile } from '@/lib/klick/compatibility-engine';
import type { SocialNetwork, ValueKey, ValuePriority } from '@/lib/types';

/**
 * Datos SafeMeet.Ut que se editan desde "Mi perfil" (mismos nombres y valores que el onboarding).
 * Se guardan juntos en un solo estado para no multiplicar `useState` en `KlickMain`.
 */
export interface ProfileDetails {
  // Sobre mí (visibles en el perfil)
  maritalStatus: string;
  education: string;
  churchImportance: string;
  churchAttendance: string;
  relationshipGoals: string[];
  childrenStatus: string;
  wantsChildren: string;
  languages: string[];
  culturalBackground: string;
  openToLongDistance: string;
  coreValues: string[];
  interests: string[];
  // Preferencias de pareja (privadas)
  partnerTempleImportance: string;
  spiritualExpectations: string[];
  acceptsPartnerChildren: string;
  partnerLanguages: string[];
  languageImportance: string;
  culturePreferences: string[];
  valuePriorities: Partial<Record<ValueKey, ValuePriority>>;
  verifiedOnly: string;
  // Redes sociales (usuario o número de WhatsApp)
  socials: Partial<Record<SocialNetwork, string>>;
}

/** Los perfiles de ejemplo mezclan inglés y español ("Sí", "Soltero/a"). */
const EN: Record<string, string> = {
  Sí: 'Yes',
  'No seguro': 'Not sure yet',
  'Not sure': 'Not sure yet',
  'Tal vez': 'Maybe',
  Flexible: 'Depends',
  'Soltero/a': 'Single',
  'Divorciado/a': 'Divorced',
  'Viudo/a': 'Widowed',
};
const en = (v: string | undefined, fallback = '') => (v ? EN[v] ?? v : fallback);

export function detailsFromUser(u: KlickUserProfile): ProfileDetails {
  return {
    maritalStatus: en(u.maritalStatus, 'Single'),
    education: u.education ?? '',
    churchImportance: u.churchImportance ?? '',
    churchAttendance: u.churchAttendance ?? '',
    relationshipGoals: u.relationshipGoals ?? (u.seekingMarriage ? ['Marriage'] : []),
    childrenStatus: u.childrenStatus ?? (u.hasChildren ? '' : 'No'),
    wantsChildren: en(u.wantsChildren),
    languages: u.languages ?? [],
    culturalBackground: u.culturalBackground ?? '',
    openToLongDistance: u.openToLongDistance ?? '',
    coreValues: u.coreValues ?? [],
    interests: [...(u.hobbies ?? []), ...(u.sports ?? [])],
    partnerTempleImportance:
      u.partnerTempleImportance ??
      (u.templeMarriageRequirement === 'Indispensable' ? 'Essential' : u.templeMarriageRequirement === 'Preferred' ? 'Preferred' : ''),
    spiritualExpectations: u.spiritualExpectations ?? [],
    acceptsPartnerChildren: en(u.acceptsPartnerWithChildren),
    partnerLanguages: u.partnerLanguages ?? u.desiredLanguages ?? [],
    languageImportance: u.languageImportance ?? '',
    culturePreferences: u.culturePreferences ?? [],
    valuePriorities: (u.valuePriorities ?? {}) as ProfileDetails['valuePriorities'],
    verifiedOnly: u.verifiedOnly ?? '',
    socials: Object.fromEntries(Object.entries(u.socials ?? {}).filter(([, v]) => v && v !== 'demo')),
  };
}
