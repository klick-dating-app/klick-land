import { test } from 'node:test';
import assert from 'node:assert/strict';
import { compatibility, type Subject } from './compat';

const base = (over: Partial<Subject['profile']> = {}, q: Partial<Subject['q']> = {}): Subject => ({
  profile: {
    name: 'X', age: 28, gender: 'female', interestedIn: 'male', city: 'Provo', state: 'UT',
    lat: 40.23, lng: -111.66, photos: ['p'], bio: '', verified: true, safetyStatus: 'verified', onboarded: true, ...over,
  },
  q: {
    faith: 'LDS', faithImportance: 'Important', templeRecommend: 'Sí', templeMarriageRequirement: 'Preferred',
    servedMission: '', maritalStatus: 'Soltero/a', seekingMarriage: true, marriageTimeline: '1-2 años',
    marriageIndispensable: false, hasChildren: false, wantsChildren: 'Sí', acceptsPartnerWithChildren: 'Flexible',
    familyIndispensable: false, languages: ['English'], lifestyleRoutine: ['Activo'], occupation: '',
    communicationStyle: 'Directo', hobbies: ['Hiking'], sports: ['Running'], preferredDateTypes: ['Café'],
    minAge: 21, maxAge: 40, maxDistanceMiles: 50, ...q,
  },
});

test('perfiles muy afines superan el umbral del 60 %', () => {
  const r = compatibility(base(), base({ gender: 'male', interestedIn: 'female' }));
  assert.equal(r.eligible, true);
  assert.ok(r.score >= 60 && r.score <= 100);
  assert.ok(r.commonGround.length >= 3 && r.commonGround.length <= 7);
});

test('un perfil restringido o bloqueado se excluye', () => {
  for (const safetyStatus of ['restricted', 'blocked'] as const) {
    const r = compatibility(base(), base({ safetyStatus }));
    assert.equal(r.eligible, false);
    assert.equal(r.excluded, 'safety');
  }
});

test('la distancia máxima se respeta (antes no excluía por debajo de 100 mi)', () => {
  const far = base({ lat: 39.0, lng: -111.66 }); // ~85 mi
  const r = compatibility(base({}, { maxDistanceMiles: 50 }), far);
  assert.equal(r.eligible, false);
  assert.equal(r.excluded, 'distance');
});

test('los requisitos indispensables aplican en ambos sentidos', () => {
  const picky = base({}, { templeMarriageRequirement: 'Indispensable' });
  const noTemple = base({}, { templeRecommend: 'No' });
  assert.equal(compatibility(picky, noTemple).excluded, 'temple');
  assert.equal(compatibility(noTemple, picky).excluded, 'temple');
});

test('el rango de edad de cualquiera de los dos excluye', () => {
  const r = compatibility(base({}, { minAge: 30, maxAge: 40 }), base({ age: 25 }));
  assert.equal(r.excluded, 'age');
});

test('el puntaje es simétrico', () => {
  const a = base({}, { hobbies: ['Hiking', 'Cine'] });
  const b = base({ gender: 'male' }, { hobbies: ['Cine'], wantsChildren: 'No' });
  assert.equal(compatibility(a, b).score, compatibility(b, a).score);
});
