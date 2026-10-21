import type { Candidate, Entitlement, Match, Message, SafeDate, UserProfile } from './types';

/**
 * Modo demo: `NEXT_PUBLIC_DEMO=1` omite el login y usa datos de ejemplo, sin Firebase.
 * Sirve solo para revisar el diseño; en producción esta variable NO debe definirse.
 */
export const DEMO = process.env.NEXT_PUBLIC_DEMO === '1';

const pic = (g: 'women' | 'men', n: number) => `https://randomuser.me/api/portraits/${g}/${n}.jpg`;

export const DEMO_UID = 'demo-me';

export const DEMO_PROFILE: UserProfile = {
  name: 'Daniel', age: 29, gender: 'male', interestedIn: 'female', city: 'Provo', state: 'UT',
  lat: 40.23, lng: -111.66, photos: [pic('men', 32), pic('men', 75)], bio: 'Ingeniero, senderista y amante del café.',
  verified: true, safetyStatus: 'verified', onboarded: true,
};

export const DEMO_ENTITLEMENT: Entitlement = { plan: 'premium', canChat: true, canViewDetails: true, status: 'active' };

export const DEMO_CANDIDATES: Candidate[] = [
  { uid: 'c1', name: 'Camila', age: 27, city: 'Orem', state: 'UT', distanceMiles: 6, photos: [pic('women', 44), pic('women', 65)], bio: 'Misionera retornada. Amo el senderismo, la cocina y las noches de juegos.', verified: true, score: 93, commonGround: ['Comparten la fe: LDS', 'Ambos buscan una relación seria con meta de matrimonio', 'Idioma compartido: English, Spanish', 'Intereses comunes: Hiking, Pickleball', 'Primera cita ideal: Caminata en parque'] },
  { uid: 'c2', name: 'Sofía', age: 25, city: 'Lehi', state: 'UT', distanceMiles: 14, photos: [pic('women', 68), pic('women', 12)], bio: 'Diseñadora y fan de la fotografía. Busco a alguien con quien reír.', verified: true, score: 86.5, commonGround: ['Misma prioridad de fe: Important', 'Mismo plazo de matrimonio (1-2 años)', 'Idioma compartido: Spanish', 'Primera cita ideal: Café'] },
  { uid: 'c3', name: 'Valentina', age: 28, city: 'Salt Lake City', state: 'UT', distanceMiles: 38, photos: [pic('women', 32)], bio: 'Enfermera. Domingos de familia, lunes de gimnasio.', verified: false, score: 74, commonGround: ['Comparten la fe: LDS', 'Mismo deseo de hijos: Sí', 'Comunicación Directo'] },
  { uid: 'c4', name: 'Isabella', age: 26, city: 'American Fork', state: 'UT', distanceMiles: 11, photos: [pic('women', 90)], bio: 'Maestra de primaria. Pickleball es mi pasión secreta.', verified: true, score: 81, commonGround: ['Comparten la fe: LDS', 'Intereses comunes: Pickleball, Lectura', 'Primera cita ideal: Helado'] },
];

export const DEMO_MATCHES: Match[] = [
  { id: 'm1', members: [DEMO_UID, 'c1'], profiles: { [DEMO_UID]: { name: 'Daniel', photo: pic('men', 32) }, c1: { name: 'Camila', photo: pic('women', 44) } }, score: 93, commonGround: ['Comparten la fe: LDS', 'Intereses comunes: Hiking, Pickleball', 'Idioma compartido: English, Spanish'], status: 'active', lastMessage: '¡Hicimos un Klick del 93 %! 😄', lastMessageAt: { toMillis: () => Date.now() } },
  { id: 'm2', members: [DEMO_UID, 'c2'], profiles: { [DEMO_UID]: { name: 'Daniel', photo: pic('men', 32) }, c2: { name: 'Sofía', photo: pic('women', 68) } }, score: 86.5, commonGround: ['Primera cita ideal: Café', 'Idioma compartido: Spanish'], status: 'active', lastMessage: null, lastMessageAt: { toMillis: () => Date.now() - 86_400_000 } },
];

export const DEMO_MESSAGES: Record<string, Message[]> = {
  m1: [
    { id: 'a', senderId: 'c1', text: '¡Hola Daniel! Vi que también te gusta el senderismo en Utah.', createdAt: { toMillis: () => Date.now() - 3_600_000 } },
    { id: 'b', senderId: DEMO_UID, text: '¡Hola Camila! Sí, Y Sundance es mi favorito. ¿Café este sábado?', createdAt: { toMillis: () => Date.now() - 3_000_000 } },
    { id: 'c', senderId: 'c1', text: '¡Hicimos un Klick del 93 %! 😄', createdAt: { toMillis: () => Date.now() - 2_400_000 } },
  ],
};

export const DEMO_DATES: SafeDate[] = [
  { id: 'd1', matchId: 'm1', participants: [DEMO_UID, 'c1'], createdBy: DEMO_UID, venueName: 'Café Rio — Center St', venueAddress: '123 Center St, Provo', dateTimeMs: Date.now() + 2 * 86_400_000, status: 'scheduled', checkins: {} },
];

/** Mini-store para que el chat de demo reaccione al enviar mensajes. */
const listeners = new Set<() => void>();
export const demoStore = {
  messages: Object.fromEntries(Object.entries(DEMO_MESSAGES).map(([k, v]) => [k, [...v]])) as Record<string, Message[]>,
  subscribe(fn: () => void) { listeners.add(fn); return () => void listeners.delete(fn); },
  send(matchId: string, text: string) {
    this.messages = { ...this.messages, [matchId]: [...(this.messages[matchId] ?? []), { id: String(Date.now()), senderId: DEMO_UID, text, createdAt: { toMillis: () => Date.now() } }] };
    listeners.forEach((l) => l());
  },
};
