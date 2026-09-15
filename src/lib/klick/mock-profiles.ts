import type { KlickUserProfile } from './compatibility-engine';

export const CURRENT_MOCK_USER: KlickUserProfile = {
  id: 'user_current_01',
  name: 'Camila Morales',
  age: 24,
  gender: 'female',
  city: 'Salt Lake City',
  state: 'Utah',
  distanceMiles: 0,
  photos: [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800&auto=format&fit=crop'
  ],
  bio: 'Amo el senderismo en las montañas de Utah, la música acústica y el servicio en la Iglesia. Busco a alguien con quien construir un matrimonio eterno y una familia llena de valores.',
  verifiedKYC: true,
  safetyStatus: 'verified',

  faith: 'LDS',
  faithImportance: 'Very important',
  templeRecommend: 'Sí',
  templeMarriageRequirement: 'Indispensable',
  servedMission: 'Sí (Internacional)',

  maritalStatus: 'Soltero/a',
  seekingMarriage: true,
  marriageTimeline: '1-2 años',
  marriageIndispensable: true,

  hasChildren: false,
  wantsChildren: 'Sí',
  acceptsPartnerWithChildren: 'Flexible',
  familyIndispensable: true,

  languages: ['Spanish', 'English'],
  desiredLanguages: ['Spanish', 'English'],

  lifestyleRoutine: ['Activo', 'Tranquilo', 'Familiar'],
  occupation: 'Diseñadora Gráfica & Marketing',
  isStudent: false,

  communicationStyle: 'Directo',
  shortTermGoals: ['Avanzar profesionalmente', 'Servir en el barrio', 'Correr medio maratón'],
  longTermGoals: ['Matrimonio en el Templo', 'Formar una familia', 'Viajar y servir'],

  hobbies: ['Senderismo', 'Lectura', 'Cocina', 'Fotografía'],
  sports: ['Pickleball', 'Running', 'Escalada'],

  preferredDateTypes: ['Café', 'Caminata en parque', 'Helado artesanal'],
  safetyPreferences: ['Lugar público', 'Horario diurno', 'Check-in activo'],

  preferences: {
    minAge: 23,
    maxAge: 32,
    maxDistanceMiles: 45,
    requiredFaith: 'LDS',
    mustHaveTempleRecommend: true,
    mustWantMarriage: true,
  }
};

export const MOCK_CANDIDATE_PROFILES: KlickUserProfile[] = [
  {
    id: 'cand_01',
    name: 'Samuel Anderson',
    age: 26,
    gender: 'male',
    city: 'Provo',
    state: 'Utah',
    distanceMiles: 18,
    photos: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop',
    ],
    bio: 'Graduado de BYU en Finanzas. Regresé de mi misión en México (hablo español fluido). Disfruto el pickleball, acampar en Uintas y cocinar para la familia.',
    verifiedKYC: true,
    safetyStatus: 'verified',

    faith: 'LDS',
    faithImportance: 'Very important',
    templeRecommend: 'Sí',
    templeMarriageRequirement: 'Indispensable',
    servedMission: 'Sí (Internacional)',

    maritalStatus: 'Soltero/a',
    seekingMarriage: true,
    marriageTimeline: '1-2 años',
    marriageIndispensable: true,

    hasChildren: false,
    wantsChildren: 'Sí',
    acceptsPartnerWithChildren: 'Sí',
    familyIndispensable: true,

    languages: ['English', 'Spanish'],
    desiredLanguages: ['Spanish', 'English'],

    lifestyleRoutine: ['Activo', 'Tranquilo', 'Familiar'],
    occupation: 'Analista Financiero',
    isStudent: false,

    communicationStyle: 'Directo',
    shortTermGoals: ['Estabilidad financiera', 'Nuevos proyectos comunitarios'],
    longTermGoals: ['Matrimonio en el templo', 'Ser un padre dedicado'],

    hobbies: ['Senderismo', 'Cocina', 'Lectura', 'Guitarra'],
    sports: ['Pickleball', 'Running', 'Ski'],

    preferredDateTypes: ['Café', 'Caminata en parque', 'Helado artesanal'],
    safetyPreferences: ['Lugar público', 'Horario diurno', 'Check-in activo'],
  },
  {
    id: 'cand_02',
    name: 'David Taylor',
    age: 27,
    gender: 'male',
    city: 'Salt Lake City',
    state: 'Utah',
    distanceMiles: 5,
    photos: [
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop',
    ],
    bio: 'Ingeniero de Software en Silicon Slopes. Apasionado por la tecnología, las caminatas al atardecer en Millcreek y la música clásica. Busco una relación con propósito eterno.',
    verifiedKYC: true,
    safetyStatus: 'verified',

    faith: 'LDS',
    faithImportance: 'Very important',
    templeRecommend: 'Sí',
    templeMarriageRequirement: 'Indispensable',
    servedMission: 'Sí (Nacional)',

    maritalStatus: 'Soltero/a',
    seekingMarriage: true,
    marriageTimeline: '1-2 años',
    marriageIndispensable: true,

    hasChildren: false,
    wantsChildren: 'Sí',
    acceptsPartnerWithChildren: 'Flexible',
    familyIndispensable: false,

    languages: ['English', 'Spanish'],
    desiredLanguages: ['English', 'Spanish'],

    lifestyleRoutine: ['Activo', 'Social', 'Hogareño'],
    occupation: 'Software Engineer',
    isStudent: false,

    communicationStyle: 'Tranquilo',
    shortTermGoals: ['Lanzar app educativa', 'Servir en la Primaria'],
    longTermGoals: ['Familia y matrimonio en el templo', 'Emprendimiento'],

    hobbies: ['Senderismo', 'Fotografía', 'Lectura', 'Piano'],
    sports: ['Running', 'Gym', 'Pickleball'],

    preferredDateTypes: ['Caminata en parque', 'Café', 'Restaurante público'],
    safetyPreferences: ['Lugar público', 'Check-in activo'],
  },
  {
    id: 'cand_03',
    name: 'Mateo Henderson',
    age: 25,
    gender: 'male',
    city: 'Orem',
    state: 'Utah',
    distanceMiles: 22,
    photos: [
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800&auto=format&fit=crop',
    ],
    bio: 'Estudiante de maestría en Educación. Misión en Chile. Me encantan las conversaciones profundas, el arte y las actividades al aire libre.',
    verifiedKYC: true,
    safetyStatus: 'verified',

    faith: 'LDS',
    faithImportance: 'Important',
    templeRecommend: 'Sí',
    templeMarriageRequirement: 'Preferred',
    servedMission: 'Sí (Internacional)',

    maritalStatus: 'Soltero/a',
    seekingMarriage: true,
    marriageTimeline: '1-2 años',
    marriageIndispensable: false,

    hasChildren: false,
    wantsChildren: 'Sí',
    acceptsPartnerWithChildren: 'Sí',
    familyIndispensable: false,

    languages: ['Spanish', 'English'],
    desiredLanguages: ['Spanish'],

    lifestyleRoutine: ['Tranquilo', 'Familiar'],
    occupation: 'Profesor de Secundaria',
    isStudent: true,

    communicationStyle: 'Directo',
    shortTermGoals: ['Completar maestría', 'Voluntariado'],
    longTermGoals: ['Educación y matrimonio'],

    hobbies: ['Lectura', 'Cocina', 'Pintura', 'Senderismo'],
    sports: ['Ciclismo', 'Pickleball'],

    preferredDateTypes: ['Helado artesanal', 'Café'],
    safetyPreferences: ['Lugar público', 'Horario diurno'],
  },
  {
    id: 'cand_04',
    name: 'Lucas Wright',
    age: 28,
    gender: 'male',
    city: 'St. George',
    state: 'Utah',
    distanceMiles: 85,
    photos: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
    ],
    bio: 'Amante del desierto rojo, escalada en roca y fotografía de paisajes. Busco alguien alegre y honesta.',
    verifiedKYC: false,
    safetyStatus: 'pending',

    faith: 'Christian',
    faithImportance: 'Flexible',
    templeRecommend: 'No',
    templeMarriageRequirement: 'Flexible',
    servedMission: 'No',

    maritalStatus: 'Soltero/a',
    seekingMarriage: false,
    marriageTimeline: 'Flexible',
    marriageIndispensable: false,

    hasChildren: false,
    wantsChildren: 'No seguro',
    acceptsPartnerWithChildren: 'Flexible',
    familyIndispensable: false,

    languages: ['English'],
    desiredLanguages: ['English'],

    lifestyleRoutine: ['Activo'],
    occupation: 'Guía Turístico & Fotógrafo',
    isStudent: false,

    communicationStyle: 'Social',
    shortTermGoals: ['Viajar a Sudamérica'],
    longTermGoals: ['Vivir en la naturaleza'],

    hobbies: ['Escalada', 'Camping', 'Música'],
    sports: ['Escalada', 'Ski'],

    preferredDateTypes: ['Caminata en parque'],
    safetyPreferences: ['Lugar público'],
  }
];

export interface UtahSafeVenue {
  id: string;
  name: string;
  category: 'Cafetería' | 'Centro Comercial' | 'Parque Público' | 'Heladería' | 'Plaza Cultural';
  address: string;
  city: string;
  verifiedSafe: boolean;
  publicLightingScore: number;
}

export const UTAH_SAFE_FIRST_DATE_VENUES: UtahSafeVenue[] = [
  {
    id: 'venue_01',
    name: 'Sugar House Coffee',
    category: 'Cafetería',
    address: '2011 S 1100 E, Salt Lake City, UT 84105',
    city: 'Salt Lake City',
    verifiedSafe: true,
    publicLightingScore: 98,
  },
  {
    id: 'venue_02',
    name: 'City Creek Center Promenade',
    category: 'Centro Comercial',
    address: '50 S Main St, Salt Lake City, UT 84101',
    city: 'Salt Lake City',
    verifiedSafe: true,
    publicLightingScore: 99,
  },
  {
    id: 'venue_03',
    name: 'The Shops at Riverwoods',
    category: 'Centro Comercial',
    address: '4801 N University Ave, Provo, UT 84604',
    city: 'Provo',
    verifiedSafe: true,
    publicLightingScore: 97,
  },
  {
    id: 'venue_04',
    name: 'Cupla Coffee SLC',
    category: 'Cafetería',
    address: '175 W 200 S, Salt Lake City, UT 84101',
    city: 'Salt Lake City',
    verifiedSafe: true,
    publicLightingScore: 95,
  },
  {
    id: 'venue_05',
    name: 'Provo Towne Centre Plaza',
    category: 'Centro Comercial',
    address: '1200 Towne Centre Blvd, Provo, UT 84601',
    city: 'Provo',
    verifiedSafe: true,
    publicLightingScore: 96,
  },
  {
    id: 'venue_06',
    name: 'St. George Historic Town Square',
    category: 'Plaza Cultural',
    address: '50 S Main St, St. George, UT 84770',
    city: 'St. George',
    verifiedSafe: true,
    publicLightingScore: 94,
  },
];

