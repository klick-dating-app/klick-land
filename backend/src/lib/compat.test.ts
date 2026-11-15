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

test('los pesos de la hoja Compatibilidad suman 100 y se reportan por factor', async () => {
  const { FACTOR_WEIGHTS } = await import('./compat');
  assert.equal(Object.values(FACTOR_WEIGHTS).reduce((s, n) => s + n, 0), 100);
  const r = compatibility(base(), base({ gender: 'male' }));
  for (const v of Object.values(r.factors)) assert.ok(v >= 0 && v <= 100);
  assert.equal(r.factors.distance, 100);
});

test('perfiles sin los campos nuevos siguen siendo compatibles (respaldo con los anteriores)', () => {
  const r = compatibility(base(), base({ gender: 'male' }));
  assert.equal(r.eligible, true);
});

test('"solo verificados" excluye perfiles sin verificar', () => {
  const r = compatibility(base({}, { verifiedOnly: 'Yes' }), base({ verified: false }));
  assert.equal(r.excluded, 'verification');
});

test('recomendación del templo "Essential" en la pareja es puerta dura', () => {
  const r = compatibility(base({}, { partnerTempleImportance: 'Essential' }), base({}, { templeRecommend: 'No' }));
  assert.equal(r.excluded, 'temple');
});

test('idioma indispensable sin idioma en común excluye', () => {
  const r = compatibility(
    base({}, { partnerLanguages: ['Spanish'], languageImportance: 'Essential' }),
    base({}, { languages: ['English'] }),
  );
  assert.equal(r.excluded, 'language');
});

test('quien acepta relación a distancia no queda fuera por millas', () => {
  const far = base({ lat: 39.0, lng: -111.66 }, { openToLongDistance: 'Yes' });
  const r = compatibility(base({}, { maxDistanceMiles: 50, openToLongDistance: 'Yes' }), far);
  assert.notEqual(r.excluded, 'distance');
});

test('misma asistencia y valores comunes suben el puntaje', () => {
  const plain = compatibility(base(), base({ gender: 'male' })).score;
  const rich = compatibility(
    base({}, { churchAttendance: 'Every week', coreValues: ['Faith', 'Family', 'Service'] }),
    base({ gender: 'male' }, { churchAttendance: 'Every week', coreValues: ['Faith', 'Family', 'Service'] }),
  ).score;
  assert.ok(rich > plain);
});

test('el umbral de compatibilidad mínima de cualquiera de los dos se respeta', () => {
  const r = compatibility(base({}, { minCompatibility: 100 }), base({ gender: 'male' }, { hobbies: [] }));
  assert.equal(r.eligible, false);
  assert.equal(r.excluded, 'threshold');
});
