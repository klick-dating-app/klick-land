/**
 * Rutas de la app de citas. Web y app comparten pantallas; solo cambia el prefijo
 * (`/web` = pantalla grande, `/app` = marco móvil / Capacitor).
 */
export type Surface = 'web' | 'app';

export const loginHref = (surface: Surface) => `/${surface}/login`;
export const onboardingHref = (surface: Surface) => `/${surface}/onboarding`;

export const feedHref = (surface: Surface) => `/${surface}/feed`;
