export const FAITHS = ['LDS', 'Christian', 'Other'];
export const LANGUAGES = ['English', 'Spanish', 'Portuguese', 'French', 'Other'];
export const LIFESTYLE = ['Activo', 'Tranquilo', 'Hogareño', 'Social'];
export const COMMUNICATION = ['Directo', 'Tranquilo', 'Social', 'Reservado'];
export const HOBBIES = ['Hiking', 'Lectura', 'Cocina', 'Música', 'Viajes', 'Fotografía', 'Arte', 'Cine'];
export const SPORTS = ['Pickleball', 'Running', 'Gym', 'Escalada', 'Ciclismo', 'Fútbol', 'Natación'];
export const DATE_TYPES = ['Café', 'Caminata en parque', 'Restaurante público', 'Helado', 'Museo'];

export const REPORT_CATEGORIES: Array<{ id: string; label: string }> = [
  { id: 'fake_profile', label: 'Perfil falso' },
  { id: 'harassment', label: 'Acoso' },
  { id: 'inappropriate_content', label: 'Contenido inapropiado' },
  { id: 'scam', label: 'Estafa' },
  { id: 'underage', label: 'Parece menor de edad' },
  { id: 'safety_threat', label: 'Amenaza a mi seguridad' },
  { id: 'other', label: 'Otro' },
];

export const PLANS = [
  { id: 'basic', name: 'Básico', price: '$19.99', period: 'mes', perks: ['Filtros completos', 'Common Ground ilimitado', 'Verificación KYC'] },
  { id: 'premium', name: 'Premium', price: '$39.99', period: 'mes', perks: ['Chats ilimitados', 'Fe y matrimonio detallados', 'Coordinación Safe First Date'], highlight: true },
  { id: 'vip', name: 'VIP', price: '$199', period: 'año', perks: ['Perfil destacado', '5 boosts al mes', 'Todo lo de Premium'] },
] as const;

export const SAFE_VENUES = ['Cafetería pública', 'Restaurante concurrido', 'Parque (de día)', 'Museo o centro cultural', 'Heladería'];
