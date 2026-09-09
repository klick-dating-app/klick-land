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

/** `true` solo dentro del contenedor nativo de Capacitor (Android/iOS). */
export function isNative(): boolean {
  if (!hasWindow) return false;
  try {
    return Capacitor.isNativePlatform();
  } catch {
    return false;
  }
}

/** `'web' | 'ios' | 'android'`. En servidor siempre `'web'`. */
export function getPlatform(): AppPlatform {
  if (!hasWindow) return 'web';
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

/** `true` en navegador normal (no contenedor nativo). */
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
