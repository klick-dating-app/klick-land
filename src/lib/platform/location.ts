import { isNative } from '@/lib/platform';

export interface Coords { lat: number; lng: number }

/** Ubicación aproximada del dispositivo (el servidor la redondea a ~1 km). */
export async function getApproxLocation(): Promise<Coords> {
  if (isNative()) {
    const { Geolocation } = await import('@capacitor/geolocation');
    const p = await Geolocation.getCurrentPosition({ enableHighAccuracy: false, timeout: 10000 });
    return { lat: p.coords.latitude, lng: p.coords.longitude };
  }
  return new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(
      (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
      reject,
      { enableHighAccuracy: false, timeout: 10000 },
    ),
  );
}
