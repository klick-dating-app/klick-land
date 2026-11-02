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
  bio: 'Love hiking the Utah Wasatch range, acoustic music, and community service. Looking for someone genuine to build an eternal marriage and a value-centered family with.',
  verifiedKYC: true,
  safetyStatus: 'verified',

  faith: 'LDS',
  faithImportance: 'Very important',
  templeRecommend: 'Yes',
  templeMarriageRequirement: 'Indispensable',
  servedMission: 'Yes (International)',

  maritalStatus: 'Single',
  seekingMarriage: true,
  marriageTimeline: '1-2 years',
  marriageIndispensable: true,

  hasChildren: false,
  wantsChildren: 'Yes',
  acceptsPartnerWithChildren: 'Flexible',
  familyIndispensable: true,

  languages: ['English', 'Spanish'],
  desiredLanguages: ['English', 'Spanish'],

  lifestyleRoutine: ['Active', 'Peaceful', 'Family-oriented'],
  occupation: 'Graphic Designer & Marketing',
  isStudent: false,

  communicationStyle: 'Direct',
  shortTermGoals: ['Career advancement', 'Ward choir service', 'Run half marathon'],
  longTermGoals: ['Temple marriage', 'Raise a loving family', 'Travel and serve'],

  hobbies: ['Hiking', 'Reading', 'Cooking', 'Photography'],
  sports: ['Pickleball', 'Running', 'Bouldering'],

  preferredDateTypes: ['Coffee/Boba', 'Park stroll', 'Artisan ice cream'],
  safetyPreferences: ['Public venue', 'Daytime hours', 'Active check-in'],

  preferences: {
    minAge: 23,
    maxAge: 32,
    maxDistanceMiles: 45,
    requiredFaith: 'LDS',
    mustHaveTempleRecommend: true,
    mustWantMarriage: true,
  }
};

export const CURRENT_MALE_MOCK_USER: KlickUserProfile = {
  id: 'user_male_01',
  name: 'Juan Carlos Morales',
  age: 24,
  gender: 'male',
  city: 'Salt Lake City',
  state: 'Utah',
  distanceMiles: 0,
  photos: [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop',
  ],
  bio: 'Software engineer passionate about piano, hiking in the Wasatch mountains, and meaningful conversations. Looking for someone genuine to build an eternal marriage and family with.',
  verifiedKYC: true,
  safetyStatus: 'verified',

  faith: 'LDS',
  faithImportance: 'Very important',
  templeRecommend: 'Yes',
  templeMarriageRequirement: 'Indispensable',
  servedMission: 'Yes (International)',

  maritalStatus: 'Single',
  seekingMarriage: true,
  marriageTimeline: '1-2 years',
  marriageIndispensable: true,

  hasChildren: false,
  wantsChildren: 'Yes',
  acceptsPartnerWithChildren: 'Flexible',
  familyIndispensable: true,

  languages: ['English', 'Spanish'],
  desiredLanguages: ['English', 'Spanish'],

  lifestyleRoutine: ['Active', 'Peaceful', 'Family-oriented'],
  occupation: 'Software Engineer',
  isStudent: false,

  communicationStyle: 'Direct',
  shortTermGoals: ['Career growth', 'Community service', 'Half marathon'],
  longTermGoals: ['Temple marriage', 'Raise a loving family', 'Travel and serve'],

  hobbies: ['Hiking', 'Piano', 'Cooking', 'Photography'],
  sports: ['Pickleball', 'Running', 'Skiing'],

  preferredDateTypes: ['Coffee/Boba', 'Park stroll', 'Artisan ice cream'],
  safetyPreferences: ['Public venue', 'Daytime hours', 'Active check-in'],

  preferences: {
    minAge: 21,
    maxAge: 30,
    maxDistanceMiles: 45,
    requiredFaith: 'LDS',
    mustHaveTempleRecommend: true,
    mustWantMarriage: true,
  }
};

export const MOCK_FEMALE_CANDIDATE_PROFILES: KlickUserProfile[] = [
  {
    id: 'fem_01',
    name: 'Camila Valencia',
    age: 24,
    gender: 'female',
    city: 'Provo',
    state: 'Utah',
    distanceMiles: 4,
    photos: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800&auto=format&fit=crop',
    ],
    bio: 'Designer and acoustic music lover. Served a mission in Madrid, Spain. Love learning new things, cooking on Sundays, and spending time with people who have clear life goals.',
    verifiedKYC: true,
    safetyStatus: 'verified',

    faith: 'LDS',
    faithImportance: 'Very important',
    templeRecommend: 'Yes',
    templeMarriageRequirement: 'Indispensable',
    servedMission: 'Yes (International)',

    maritalStatus: 'Single',
    seekingMarriage: true,
    marriageTimeline: '1-2 years',
    marriageIndispensable: true,

    hasChildren: false,
    wantsChildren: 'Yes',
    acceptsPartnerWithChildren: 'Yes',
    familyIndispensable: true,

    languages: ['English', 'Spanish'],
    desiredLanguages: ['English', 'Spanish'],

    lifestyleRoutine: ['Active', 'Peaceful', 'Family-oriented'],
    occupation: 'Graphic Designer & Marketing',
    isStudent: false,

    communicationStyle: 'Direct',
    shortTermGoals: ['Creative studio growth', 'Ward choir service'],
    longTermGoals: ['Temple marriage', 'Raise a loving family'],

    hobbies: ['Hiking', 'Cooking', 'Music', 'Photography'],
    sports: ['Pickleball', 'Running'],

    preferredDateTypes: ['Coffee/Boba', 'Park stroll', 'Artisan ice cream'],
    safetyPreferences: ['Public venue', 'Daytime hours', 'Active check-in'],
  },
  {
    id: 'fem_02',
    name: 'Sofía Martínez',
    age: 23,
    gender: 'female',
    city: 'Salt Lake City',
    state: 'Utah',
    distanceMiles: 8,
    photos: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=800&auto=format&fit=crop',
    ],
    bio: 'Communications student & violinist. Served in Santiago, Chile. Fan of museums, spontaneous road trips, and sunsets in the mountains.',
    verifiedKYC: true,
    safetyStatus: 'verified',

    faith: 'LDS',
    faithImportance: 'Very important',
    templeRecommend: 'Yes',
    templeMarriageRequirement: 'Indispensable',
    servedMission: 'Yes (International)',

    maritalStatus: 'Single',
    seekingMarriage: true,
    marriageTimeline: '1-2 years',
    marriageIndispensable: true,

    hasChildren: false,
    wantsChildren: 'Yes',
    acceptsPartnerWithChildren: 'Flexible',
    familyIndispensable: true,

    languages: ['English', 'Spanish'],
    desiredLanguages: ['English', 'Spanish'],

    lifestyleRoutine: ['Active', 'Social', 'Family-oriented'],
    occupation: 'Communications Specialist',
    isStudent: true,

    communicationStyle: 'Calm & Thoughtful',
    shortTermGoals: ['Finish degree', 'Serve in Young Women'],
    longTermGoals: ['Temple sealing & family', 'Cultural exchange'],

    hobbies: ['Violin', 'Reading', 'Art Museums', 'Hiking'],
    sports: ['Running', 'Pickleball'],

    preferredDateTypes: ['Park stroll', 'Coffee/Boba', 'Public bistro'],
    safetyPreferences: ['Public venue', 'Active check-in'],
  },
  {
    id: 'fem_03',
    name: 'Valentina Mendoza',
    age: 25,
    gender: 'female',
    city: 'Orem',
    state: 'Utah',
    distanceMiles: 14,
    photos: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop',
    ],
    bio: 'Architect passionate about sustainable design, fitness, and cooking for friends. Served in Mexico City.',
    verifiedKYC: true,
    safetyStatus: 'verified',

    faith: 'LDS',
    faithImportance: 'Important',
    templeRecommend: 'Yes',
    templeMarriageRequirement: 'Preferred',
    servedMission: 'Yes (International)',

    maritalStatus: 'Single',
    seekingMarriage: true,
    marriageTimeline: '1-2 years',
    marriageIndispensable: false,

    hasChildren: false,
    wantsChildren: 'Yes',
    acceptsPartnerWithChildren: 'Yes',
    familyIndispensable: false,

    languages: ['Spanish', 'English'],
    desiredLanguages: ['Spanish', 'English'],

    lifestyleRoutine: ['Active', 'Peaceful', 'Family-oriented'],
    occupation: 'Architect',
    isStudent: false,

    communicationStyle: 'Direct',
    shortTermGoals: ['Sustainable housing project', 'Community volunteering'],
    longTermGoals: ['Architecture studio & temple marriage'],

    hobbies: ['Architecture', 'Cooking', 'Hiking', 'Painting'],
    sports: ['Cycling', 'Pickleball'],

    preferredDateTypes: ['Artisan ice cream', 'Coffee/Boba'],
    safetyPreferences: ['Public venue', 'Daytime hours'],
  },
  {
    id: 'fem_04',
    name: 'Isabella Torres',
    age: 22,
    gender: 'female',
    city: 'Draper',
    state: 'Utah',
    distanceMiles: 11,
    photos: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
    ],
    bio: 'Pediatric nurse who loves early morning runs, baking cinnamon rolls on weekends, and spontaneous canyon drives. Looking for a kind, faith-centered partner.',
    verifiedKYC: true,
    safetyStatus: 'verified',

    faith: 'LDS',
    faithImportance: 'Very important',
    templeRecommend: 'Yes',
    templeMarriageRequirement: 'Indispensable',
    servedMission: 'Yes (Domestic)',

    maritalStatus: 'Single',
    seekingMarriage: true,
    marriageTimeline: '1-2 years',
    marriageIndispensable: true,

    hasChildren: false,
    wantsChildren: 'Yes',
    acceptsPartnerWithChildren: 'Yes',
    familyIndispensable: true,

    languages: ['English', 'Spanish'],
    desiredLanguages: ['English', 'Spanish'],

    lifestyleRoutine: ['Active', 'Peaceful', 'Family-oriented'],
    occupation: 'Pediatric Nurse (RN)',
    isStudent: false,

    communicationStyle: 'Calm & Thoughtful',
    shortTermGoals: ['Pediatric specialty certification', 'Temple service'],
    longTermGoals: ['Temple marriage', 'Build a warm home & family'],

    hobbies: ['Baking', 'Hiking', 'Piano', 'Travel'],
    sports: ['Running', 'Pickleball', 'Tennis'],

    preferredDateTypes: ['Coffee/Boba', 'Artisan ice cream', 'Park stroll'],
    safetyPreferences: ['Public venue', 'Daytime hours', 'Active check-in'],
  },
  {
    id: 'fem_05',
    name: 'Daniela Ríos',
    age: 26,
    gender: 'female',
    city: 'Lehi',
    state: 'Utah',
    distanceMiles: 19,
    photos: [
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop',
    ],
    bio: 'UX Product Designer in Silicon Slopes. Returned missionary from Brazil. Passionate about photography, acoustic concerts, and family Sunday dinners.',
    verifiedKYC: true,
    safetyStatus: 'verified',

    faith: 'LDS',
    faithImportance: 'Very important',
    templeRecommend: 'Yes',
    templeMarriageRequirement: 'Indispensable',
    servedMission: 'Yes (International)',

    maritalStatus: 'Single',
    seekingMarriage: true,
    marriageTimeline: '<1 year',
    marriageIndispensable: true,

    hasChildren: false,
    wantsChildren: 'Yes',
    acceptsPartnerWithChildren: 'Flexible',
    familyIndispensable: true,

    languages: ['English', 'Spanish', 'Portuguese'],
    desiredLanguages: ['English', 'Spanish'],

    lifestyleRoutine: ['Active', 'Social', 'Family-oriented'],
    occupation: 'UX Product Designer',
    isStudent: false,

    communicationStyle: 'Direct',
    shortTermGoals: ['Lead design team', 'Half marathon in Provo'],
    longTermGoals: ['Eternal marriage', 'Raise a bilingual family'],

    hobbies: ['Photography', 'Guitar', 'Cooking', 'Reading'],
    sports: ['Pickleball', 'Skiing', 'Hiking'],

    preferredDateTypes: ['Coffee/Boba', 'Public bistro', 'Park stroll'],
    safetyPreferences: ['Public venue', 'Active check-in'],
  },
  {
    id: 'fem_06',
    name: 'Mariana Salazar',
    age: 24,
    gender: 'female',
    city: 'Sandy',
    state: 'Utah',
    distanceMiles: 9,
    photos: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
    ],
    bio: 'Elementary school teacher who loves kids, watercolor painting, and summer evenings at the park. Looking for my best friend and eternal companion.',
    verifiedKYC: true,
    safetyStatus: 'verified',

    faith: 'LDS',
    faithImportance: 'Very important',
    templeRecommend: 'Yes',
    templeMarriageRequirement: 'Indispensable',
    servedMission: 'Yes (International)',

    maritalStatus: 'Single',
    seekingMarriage: true,
    marriageTimeline: '1-2 years',
    marriageIndispensable: true,

    hasChildren: false,
    wantsChildren: 'Yes',
    acceptsPartnerWithChildren: 'Yes',
    familyIndispensable: true,

    languages: ['English', 'Spanish'],
    desiredLanguages: ['English', 'Spanish'],

    lifestyleRoutine: ['Peaceful', 'Family-oriented', 'Active'],
    occupation: 'Elementary Teacher',
    isStudent: false,

    communicationStyle: 'Calm & Thoughtful',
    shortTermGoals: ['Bilingual reading program', 'Primary music leader'],
    longTermGoals: ['Temple sealing', 'Large, joyful family'],

    hobbies: ['Watercolor', 'Reading', 'Baking', 'Gardening'],
    sports: ['Pickleball', 'Swimming'],

    preferredDateTypes: ['Artisan ice cream', 'Park stroll', 'Coffee/Boba'],
    safetyPreferences: ['Public venue', 'Daytime hours', 'Active check-in'],
  },
  {
    id: 'fem_07',
    name: 'Gabriela Paredes',
    age: 25,
    gender: 'female',
    city: 'Park City',
    state: 'Utah',
    distanceMiles: 24,
    photos: [
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800&auto=format&fit=crop',
    ],
    bio: 'Interior designer & mountain lover. Always up for skiing in the winter, paddleboarding at Deer Creek in the summer, and great conversations.',
    verifiedKYC: true,
    safetyStatus: 'verified',

    faith: 'LDS',
    faithImportance: 'Very important',
    templeRecommend: 'Yes',
    templeMarriageRequirement: 'Indispensable',
    servedMission: 'Yes (Domestic)',

    maritalStatus: 'Single',
    seekingMarriage: true,
    marriageTimeline: '1-2 years',
    marriageIndispensable: true,

    hasChildren: false,
    wantsChildren: 'Yes',
    acceptsPartnerWithChildren: 'Flexible',
    familyIndispensable: true,

    languages: ['English', 'Spanish'],
    desiredLanguages: ['English', 'Spanish'],

    lifestyleRoutine: ['Active', 'Social', 'Family-oriented'],
    occupation: 'Interior Designer',
    isStudent: false,

    communicationStyle: 'Direct',
    shortTermGoals: ['Launch home decor line', 'YSA stake activities'],
    longTermGoals: ['Temple marriage', 'Design our family home'],

    hobbies: ['Interior Design', 'Skiing', 'Cooking', 'Travel'],
    sports: ['Skiing', 'Pickleball', 'Hiking'],

    preferredDateTypes: ['Coffee/Boba', 'Public bistro', 'Park stroll'],
    safetyPreferences: ['Public venue', 'Active check-in'],
  },
  {
    id: 'fem_08',
    name: 'Natalia Vega',
    age: 23,
    gender: 'female',
    city: 'Provo',
    state: 'Utah',
    distanceMiles: 6,
    photos: [
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop',
    ],
    bio: 'Dental hygiene student at BYU. Served in Lima, Peru. Love salsa dancing, board game nights with family, and trying every sweet shop in Utah County.',
    verifiedKYC: true,
    safetyStatus: 'verified',

    faith: 'LDS',
    faithImportance: 'Very important',
    templeRecommend: 'Yes',
    templeMarriageRequirement: 'Indispensable',
    servedMission: 'Yes (International)',

    maritalStatus: 'Single',
    seekingMarriage: true,
    marriageTimeline: '1-2 years',
    marriageIndispensable: true,

    hasChildren: false,
    wantsChildren: 'Yes',
    acceptsPartnerWithChildren: 'Yes',
    familyIndispensable: true,

    languages: ['English', 'Spanish'],
    desiredLanguages: ['English', 'Spanish'],

    lifestyleRoutine: ['Active', 'Social', 'Family-oriented'],
    occupation: 'Dental Hygiene Student',
    isStudent: true,

    communicationStyle: 'Direct',
    shortTermGoals: ['Graduate with honors', 'Service mission trips'],
    longTermGoals: ['Eternal marriage in the temple', 'Happy family life'],

    hobbies: ['Dancing', 'Board Games', 'Baking', 'Music'],
    sports: ['Pickleball', 'Volleyball', 'Running'],

    preferredDateTypes: ['Artisan ice cream', 'Coffee/Boba', 'Park stroll'],
    safetyPreferences: ['Public venue', 'Daytime hours', 'Active check-in'],
  },
];

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
    bio: 'BYU Finance grad. Returned missionary from Mexico (fluent in Spanish). Enjoy pickleball, camping in the High Uintas, and cooking family dinners on Sundays.',
    verifiedKYC: true,
    safetyStatus: 'verified',

    faith: 'LDS',
    faithImportance: 'Very important',
    templeRecommend: 'Yes',
    templeMarriageRequirement: 'Indispensable',
    servedMission: 'Yes (International)',

    maritalStatus: 'Single',
    seekingMarriage: true,
    marriageTimeline: '1-2 years',
    marriageIndispensable: true,

    hasChildren: false,
    wantsChildren: 'Yes',
    acceptsPartnerWithChildren: 'Yes',
    familyIndispensable: true,

    languages: ['English', 'Spanish'],
    desiredLanguages: ['English', 'Spanish'],

    lifestyleRoutine: ['Active', 'Peaceful', 'Family-oriented'],
    occupation: 'Financial Analyst',
    isStudent: false,

    communicationStyle: 'Direct',
    shortTermGoals: ['Financial stability', 'Community youth mentoring'],
    longTermGoals: ['Temple marriage', 'Being an intentional, devoted father'],

    hobbies: ['Hiking', 'Cooking', 'Reading', 'Acoustic Guitar'],
    sports: ['Pickleball', 'Running', 'Skiing'],

    preferredDateTypes: ['Coffee/Boba', 'Park stroll', 'Artisan ice cream'],
    safetyPreferences: ['Public venue', 'Daytime hours', 'Active check-in'],
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
    bio: 'Software engineer in Silicon Slopes. Passionate about technology, sunset walks in Millcreek Canyon, and classical piano. Looking for a relationship with eternal purpose.',
    verifiedKYC: true,
    safetyStatus: 'verified',

    faith: 'LDS',
    faithImportance: 'Very important',
    templeRecommend: 'Yes',
    templeMarriageRequirement: 'Indispensable',
    servedMission: 'Yes (Domestic)',

    maritalStatus: 'Single',
    seekingMarriage: true,
    marriageTimeline: '1-2 years',
    marriageIndispensable: true,

    hasChildren: false,
    wantsChildren: 'Yes',
    acceptsPartnerWithChildren: 'Flexible',
    familyIndispensable: false,

    languages: ['English', 'Spanish'],
    desiredLanguages: ['English', 'Spanish'],

    lifestyleRoutine: ['Active', 'Social', 'Homebody'],
    occupation: 'Software Engineer',
    isStudent: false,

    communicationStyle: 'Calm & Thoughtful',
    shortTermGoals: ['Launch educational app', 'Serve in Primary'],
    longTermGoals: ['Family and temple sealing', 'Tech entrepreneurship'],

    hobbies: ['Hiking', 'Photography', 'Reading', 'Piano'],
    sports: ['Running', 'Gym', 'Pickleball'],

    preferredDateTypes: ['Park stroll', 'Coffee/Boba', 'Public bistro'],
    safetyPreferences: ['Public venue', 'Active check-in'],
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
    bio: 'Master’s student in Education. Mission in Chile. Love deep conversations over warm drinks, landscape painting, and spontaneous outdoor adventures.',
    verifiedKYC: true,
    safetyStatus: 'verified',

    faith: 'LDS',
    faithImportance: 'Important',
    templeRecommend: 'Yes',
    templeMarriageRequirement: 'Preferred',
    servedMission: 'Yes (International)',

    maritalStatus: 'Single',
    seekingMarriage: true,
    marriageTimeline: '1-2 years',
    marriageIndispensable: false,

    hasChildren: false,
    wantsChildren: 'Yes',
    acceptsPartnerWithChildren: 'Yes',
    familyIndispensable: false,

    languages: ['Spanish', 'English'],
    desiredLanguages: ['Spanish'],

    lifestyleRoutine: ['Peaceful', 'Family-oriented'],
    occupation: 'High School Teacher',
    isStudent: true,

    communicationStyle: 'Direct',
    shortTermGoals: ['Finish Master degree', 'Community volunteering'],
    longTermGoals: ['Education leadership & temple marriage'],

    hobbies: ['Reading', 'Cooking', 'Painting', 'Hiking'],
    sports: ['Cycling', 'Pickleball'],

    preferredDateTypes: ['Artisan ice cream', 'Coffee/Boba'],
    safetyPreferences: ['Public venue', 'Daytime hours'],
  },
  {
    id: 'cand_04',
    name: 'Lucas Wright',
    age: 28,
    gender: 'male',
    city: 'Draper',
    state: 'Utah',
    distanceMiles: 12,
    photos: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
    ],
    bio: 'Civil engineer and outdoor enthusiast. Returned missionary from Argentina. Looking for someone joyful, sincere, and ready to build a Christ-centered home.',
    verifiedKYC: true,
    safetyStatus: 'verified',

    faith: 'LDS',
    faithImportance: 'Very important',
    templeRecommend: 'Yes',
    templeMarriageRequirement: 'Indispensable',
    servedMission: 'Yes (International)',

    maritalStatus: 'Single',
    seekingMarriage: true,
    marriageTimeline: '1-2 years',
    marriageIndispensable: true,

    hasChildren: false,
    wantsChildren: 'Yes',
    acceptsPartnerWithChildren: 'Flexible',
    familyIndispensable: true,

    languages: ['English', 'Spanish'],
    desiredLanguages: ['English', 'Spanish'],

    lifestyleRoutine: ['Active', 'Family-oriented'],
    occupation: 'Civil Engineer',
    isStudent: false,

    communicationStyle: 'Direct',
    shortTermGoals: ['PE license', 'Sunday School teacher'],
    longTermGoals: ['Temple marriage', 'Build our family home in Utah'],

    hobbies: ['Rock Climbing', 'Camping', 'Live Music', 'Cooking'],
    sports: ['Bouldering', 'Skiing', 'Pickleball'],

    preferredDateTypes: ['Park stroll', 'Coffee/Boba'],
    safetyPreferences: ['Public venue', 'Active check-in'],
  },
  {
    id: 'cand_05',
    name: 'Daniel Morales',
    age: 26,
    gender: 'male',
    city: 'Salt Lake City',
    state: 'Utah',
    distanceMiles: 7,
    photos: [
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=800&auto=format&fit=crop',
    ],
    bio: 'Medical resident at University of Utah Hospital. Served in Madrid, Spain. Love trail running, cooking Italian food, and meaningful Sunday evenings.',
    verifiedKYC: true,
    safetyStatus: 'verified',

    faith: 'LDS',
    faithImportance: 'Very important',
    templeRecommend: 'Yes',
    templeMarriageRequirement: 'Indispensable',
    servedMission: 'Yes (International)',

    maritalStatus: 'Single',
    seekingMarriage: true,
    marriageTimeline: '1-2 years',
    marriageIndispensable: true,

    hasChildren: false,
    wantsChildren: 'Yes',
    acceptsPartnerWithChildren: 'Yes',
    familyIndispensable: true,

    languages: ['English', 'Spanish'],
    desiredLanguages: ['English', 'Spanish'],

    lifestyleRoutine: ['Active', 'Peaceful', 'Family-oriented'],
    occupation: 'Medical Resident (MD)',
    isStudent: false,

    communicationStyle: 'Calm & Thoughtful',
    shortTermGoals: ['Finish residency', 'Medical humanitarian trips'],
    longTermGoals: ['Eternal marriage', 'Devoted husband and father'],

    hobbies: ['Cooking', 'Trail Running', 'Piano', 'Reading'],
    sports: ['Running', 'Tennis', 'Skiing'],

    preferredDateTypes: ['Coffee/Boba', 'Public bistro', 'Park stroll'],
    safetyPreferences: ['Public venue', 'Active check-in'],
  },
  {
    id: 'cand_06',
    name: 'Sebastián Navarro',
    age: 25,
    gender: 'male',
    city: 'Lehi',
    state: 'Utah',
    distanceMiles: 16,
    photos: [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop',
    ],
    bio: 'Product Manager in tech & acoustic guitarist. Returned missionary from Colombia. Always up for pickleball, rooftop tacos, and temple trips.',
    verifiedKYC: true,
    safetyStatus: 'verified',

    faith: 'LDS',
    faithImportance: 'Very important',
    templeRecommend: 'Yes',
    templeMarriageRequirement: 'Indispensable',
    servedMission: 'Yes (International)',

    maritalStatus: 'Single',
    seekingMarriage: true,
    marriageTimeline: '<1 year',
    marriageIndispensable: true,

    hasChildren: false,
    wantsChildren: 'Yes',
    acceptsPartnerWithChildren: 'Flexible',
    familyIndispensable: true,

    languages: ['English', 'Spanish'],
    desiredLanguages: ['English', 'Spanish'],

    lifestyleRoutine: ['Active', 'Social', 'Family-oriented'],
    occupation: 'Tech Product Manager',
    isStudent: false,

    communicationStyle: 'Direct',
    shortTermGoals: ['Launch AI startup project', 'Ward mission leader'],
    longTermGoals: ['Temple sealing', 'Raise a close-knit family'],

    hobbies: ['Guitar', 'Hiking', 'Photography', 'Travel'],
    sports: ['Pickleball', 'Soccer', 'Snowboarding'],

    preferredDateTypes: ['Coffee/Boba', 'Artisan ice cream', 'Park stroll'],
    safetyPreferences: ['Public venue', 'Daytime hours', 'Active check-in'],
  },
  {
    id: 'cand_07',
    name: 'Ethan Walker',
    age: 27,
    gender: 'male',
    city: 'Sandy',
    state: 'Utah',
    distanceMiles: 10,
    photos: [
      'https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
    ],
    bio: 'Commercial architect & woodworker. Served in Peru. Love designing warm spaces, weekend camping in Moab, and making homemade ice cream.',
    verifiedKYC: true,
    safetyStatus: 'verified',

    faith: 'LDS',
    faithImportance: 'Very important',
    templeRecommend: 'Yes',
    templeMarriageRequirement: 'Indispensable',
    servedMission: 'Yes (International)',

    maritalStatus: 'Single',
    seekingMarriage: true,
    marriageTimeline: '1-2 years',
    marriageIndispensable: true,

    hasChildren: false,
    wantsChildren: 'Yes',
    acceptsPartnerWithChildren: 'Yes',
    familyIndispensable: true,

    languages: ['English', 'Spanish'],
    desiredLanguages: ['English', 'Spanish'],

    lifestyleRoutine: ['Peaceful', 'Active', 'Family-oriented'],
    occupation: 'Architect',
    isStudent: false,

    communicationStyle: 'Calm & Thoughtful',
    shortTermGoals: ['Design community center', 'Temple ordinance worker'],
    longTermGoals: ['Temple marriage', 'Build our dream home together'],

    hobbies: ['Woodworking', 'Architecture', 'Camping', 'Cooking'],
    sports: ['Mountain Biking', 'Pickleball', 'Skiing'],

    preferredDateTypes: ['Artisan ice cream', 'Park stroll', 'Coffee/Boba'],
    safetyPreferences: ['Public venue', 'Active check-in'],
  },
  {
    id: 'cand_08',
    name: 'Alejandro Castillo',
    age: 24,
    gender: 'male',
    city: 'Provo',
    state: 'Utah',
    distanceMiles: 5,
    photos: [
      'https://images.unsplash.com/photo-1504257432389-52343af06ae3?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop',
    ],
    bio: 'Business Law student at BYU. Served in Buenos Aires, Argentina. Passionate about tennis, grilling Argentine asado for friends, and building an eternal family.',
    verifiedKYC: true,
    safetyStatus: 'verified',

    faith: 'LDS',
    faithImportance: 'Very important',
    templeRecommend: 'Yes',
    templeMarriageRequirement: 'Indispensable',
    servedMission: 'Yes (International)',

    maritalStatus: 'Single',
    seekingMarriage: true,
    marriageTimeline: '1-2 years',
    marriageIndispensable: true,

    hasChildren: false,
    wantsChildren: 'Yes',
    acceptsPartnerWithChildren: 'Yes',
    familyIndispensable: true,

    languages: ['English', 'Spanish'],
    desiredLanguages: ['English', 'Spanish'],

    lifestyleRoutine: ['Active', 'Social', 'Family-oriented'],
    occupation: 'Law Student & Legal Clerk',
    isStudent: true,

    communicationStyle: 'Direct',
    shortTermGoals: ['Pass the Utah Bar', 'YSA Choir'],
    longTermGoals: ['Temple marriage', 'Family & community leadership'],

    hobbies: ['Cooking', 'Reading', 'Music', 'Travel'],
    sports: ['Tennis', 'Pickleball', 'Running'],

    preferredDateTypes: ['Coffee/Boba', 'Public bistro', 'Artisan ice cream'],
    safetyPreferences: ['Public venue', 'Daytime hours', 'Active check-in'],
  }
];

export interface UtahSafeVenue {
  id: string;
  name: string;
  category: 'Coffee & Drinks' | 'Shopping Promenade' | 'Public Park' | 'Ice Cream Parlor' | 'Cultural Plaza' | 'Cafetería' | 'Centro Comercial' | 'Parque Público' | 'Heladería' | 'Plaza Cultural';
  address: string;
  city: string;
  verifiedSafe: boolean;
  publicLightingScore: number;
}

export const UTAH_SAFE_FIRST_DATE_VENUES: UtahSafeVenue[] = [
  {
    id: 'venue_01',
    name: 'Sugar House Coffee',
    category: 'Coffee & Drinks',
    address: '2011 S 1100 E, Salt Lake City, UT 84105',
    city: 'Salt Lake City',
    verifiedSafe: true,
    publicLightingScore: 98,
  },
  {
    id: 'venue_02',
    name: 'City Creek Center Promenade',
    category: 'Shopping Promenade',
    address: '50 S Main St, Salt Lake City, UT 84101',
    city: 'Salt Lake City',
    verifiedSafe: true,
    publicLightingScore: 99,
  },
  {
    id: 'venue_03',
    name: 'The Shops at Riverwoods',
    category: 'Shopping Promenade',
    address: '4801 N University Ave, Provo, UT 84604',
    city: 'Provo',
    verifiedSafe: true,
    publicLightingScore: 97,
  },
  {
    id: 'venue_04',
    name: 'Cupla Coffee SLC',
    category: 'Coffee & Drinks',
    address: '175 W 200 S, Salt Lake City, UT 84101',
    city: 'Salt Lake City',
    verifiedSafe: true,
    publicLightingScore: 95,
  },
  {
    id: 'venue_05',
    name: 'Provo Towne Centre Plaza',
    category: 'Shopping Promenade',
    address: '1200 Towne Centre Blvd, Provo, UT 84601',
    city: 'Provo',
    verifiedSafe: true,
    publicLightingScore: 96,
  },
  {
    id: 'venue_06',
    name: 'St. George Historic Town Square',
    category: 'Cultural Plaza',
    address: '50 S Main St, St. George, UT 84770',
    city: 'St. George',
    verifiedSafe: true,
    publicLightingScore: 94,
  },
];
