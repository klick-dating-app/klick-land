/**
 * Rutas de la app de citas. Web y app comparten pantallas; solo cambia el prefijo
 * (`/web` = pantalla grande, `/app` = marco móvil / Capacitor).
 */
export type Surface = 'web' | 'app';
export type DemoGender = 'male' | 'female';

const PERFIL: Record<DemoGender, string> = { male: 'hombre', female: 'mujer' };

export const loginHref = (surface: Surface) => `/${surface}/login`;

/** Sin `gender` abre el feed del usuario; con `gender` abre el perfil de ejemplo. */
export const feedHref = (surface: Surface, gender?: DemoGender) =>
  gender ? `/${surface}/feed?perfil=${PERFIL[gender]}` : `/${surface}/feed`;

export const genderFromParam = (perfil: string | null): DemoGender => (perfil === 'mujer' ? 'female' : 'male');
