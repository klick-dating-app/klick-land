const R_MILES = 3958.8;

export function distanceMiles(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(lat2 - lat1);
  const dLng = rad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R_MILES * Math.asin(Math.sqrt(a)));
}

/** Redondea a 2 decimales (~1 km) para no almacenar la ubicación exacta. */
export const roundCoord = (n: number) => Math.round(n * 100) / 100;

export function ageFromDob(dob: string, now = new Date()): number {
  const d = new Date(dob);
  let age = now.getUTCFullYear() - d.getUTCFullYear();
  const m = now.getUTCMonth() - d.getUTCMonth();
  if (m < 0 || (m === 0 && now.getUTCDate() < d.getUTCDate())) age--;
  return age;
}
