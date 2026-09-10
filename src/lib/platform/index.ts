/**
 * Utilidad centralizada de detección de plataforma.
 *
 * Envuelve `@capacitor/core` de forma segura para SSR/build: todas las funciones
 * pueden llamarse en el servidor (devuelven valores "web") sin tocar `window`.
 *
 * Uso:
 *   import { isNative, getPlatform, isIOS, isAndroid } from '@/lib/platform';
 */
import { Capacitor } from '@capacitor/core';

export type AppPlatform = 'web' | 'ios' | 'android';

const hasWindow = typeof window !== 'undefined';

function isDevAppPreview(): boolean {
  if (!hasWindow) return false;
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get('app') === 'true' || params.get('mode') === 'app') return true;
    if (window.localStorage && window.localStorage.getItem('preview_app') === 'true') return true;
  } catch {
    // Ignore in case of iframe/storage restrictions
  }
  return false;
}

/** `true` dentro de Capacitor o en localhost con ?app=true */
export function isNative(): boolean {
  if (!hasWindow) return false;
  if (isDevAppPreview()) return true;
  try {
    return Capacitor.isNativePlatform();
  } catch {
    return false;
  }
}

/** `'web' | 'ios' | 'android'`. En servidor siempre `'web'`. */
export function getPlatform(): AppPlatform {
  if (!hasWindow) return 'web';
  if (isDevAppPreview()) return 'android';
  try {
    return Capacitor.getPlatform() as AppPlatform;
  } catch {
    return 'web';
  }
}

export function isIOS(): boolean {
  return getPlatform() === 'ios';
}

export function isAndroid(): boolean {
  return getPlatform() === 'android';
}

/** `true` en navegador normal (no contenedor nativo ni modo preview app). */
export function isWeb(): boolean {
  return getPlatform() === 'web';
}

/**
 * Comprueba si un plugin nativo concreto está disponible en la plataforma actual.
 * Útil antes de llamar a cámara, biometría, push, etc.
 */
export function isPluginAvailable(name: string): boolean {
  if (!hasWindow) return false;
  try {
    return Capacitor.isPluginAvailable(name);
  } catch {
    return false;
  }
}
