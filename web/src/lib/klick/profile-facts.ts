import type { KlickUserProfile } from '@/lib/klick/compatibility-engine';

export interface Fact {
  label: string;
  value: string;
}

const yes = (v?: string) => v === 'Yes' || v === 'Sí';

/**
 * Datos públicos de un perfil como filas "etiqueta · valor", agrupados como se leen en la tarjeta.
 * Las preferencias de pareja (privadas según la hoja "Seguridad") nunca entran aquí.
 */
export function profileFactGroups(p: KlickUserProfile): { title: string; facts: Fact[] }[] {
  const mission = String(p.servedMission ?? '');
  const groups = [
    {
      title: 'Faith',
      facts: [
        { label: 'Temple recommend', value: yes(p.templeRecommend) ? 'Active' : p.templeRecommend },
        { label: 'Church', value: p.churchImportance ?? '' },
        { label: 'Attendance', value: p.churchAttendance ?? '' },
        { label: 'Mission', value: mission.startsWith('Sí') ? mission.replace('Sí', 'Yes') : mission },
      ],
    },
    {
      title: 'Relationship & Family',
      facts: [
        { label: 'Looking for', value: p.relationshipGoals?.join(', ') ?? '' },
        { label: 'Marriage timeline', value: p.marriageTimeline ?? '' },
        { label: 'Status', value: p.maritalStatus ?? '' },
        { label: 'Children', value: p.childrenStatus ?? (p.hasChildren ? 'Yes' : '') },
        { label: 'Wants children', value: yes(p.wantsChildren) ? 'Yes' : p.wantsChildren ?? '' },
      ],
    },
    {
      title: 'About',
      facts: [
        { label: 'Work', value: p.occupation ?? '' },
        { label: 'Education', value: p.education ?? '' },
        { label: 'Languages', value: p.languages?.join(', ') ?? '' },
        { label: 'Culture', value: p.culturalBackground ?? '' },
        { label: 'Long distance', value: p.openToLongDistance ?? '' },
        { label: 'Values', value: p.coreValues?.join(', ') ?? '' },
        { label: 'Interests', value: [...(p.hobbies ?? []), ...(p.sports ?? [])].join(', ') },
      ],
    },
  ];
  return groups
    .map((g) => ({ ...g, facts: g.facts.filter((f) => f.value) }))
    .filter((g) => g.facts.length > 0);
}

/** Lo más importante en pocas filas (chat, panel lateral). */
export function keyFacts(p: KlickUserProfile): Fact[] {
  const all = profileFactGroups(p).flatMap((g) => g.facts);
  const order = ['Temple recommend', 'Attendance', 'Looking for', 'Children', 'Wants children', 'Languages', 'Culture', 'Values'];
  return order.map((l) => all.find((f) => f.label === l)).filter(Boolean) as Fact[];
}
