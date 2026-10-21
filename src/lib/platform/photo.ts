import { isNative } from '@/lib/platform';

/** Devuelve un `Blob` JPEG desde la cámara/galería nativa o, en web, desde un `<input type=file>`. */
export async function pickPhoto(source: 'camera' | 'gallery' = 'gallery'): Promise<Blob | null> {
  if (isNative()) {
    const { Camera, CameraResultType, CameraSource } = await import('@capacitor/camera');
    const p = await Camera.getPhoto({
      quality: 80,
      width: 1600,
      resultType: CameraResultType.Uri,
      source: source === 'camera' ? CameraSource.Camera : CameraSource.Photos,
    });
    return p.webPath ? await (await fetch(p.webPath)).blob() : null;
  }
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    if (source === 'camera') input.setAttribute('capture', 'user');
    input.onchange = () => resolve(input.files?.[0] ?? null);
    input.click();
  });
}
