import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { isNative, getPlatform } from '@/lib/platform';

/** Pide permiso, registra el dispositivo en FCM y guarda el token en `users/{uid}/devices`. */
export async function registerPush(uid: string, onOpen?: (data: Record<string, string>) => void) {
  if (!isNative()) return;
  const { PushNotifications } = await import('@capacitor/push-notifications');
  let perm = await PushNotifications.checkPermissions();
  if (perm.receive === 'prompt') perm = await PushNotifications.requestPermissions();
  if (perm.receive !== 'granted') return;

  await PushNotifications.removeAllListeners();
  await PushNotifications.addListener('registration', ({ value }) => {
    void setDoc(doc(db, `users/${uid}/devices/${value}`), { platform: getPlatform(), updatedAt: serverTimestamp() });
  });
  await PushNotifications.addListener('pushNotificationActionPerformed', (a) => {
    onOpen?.((a.notification.data ?? {}) as Record<string, string>);
  });
  await PushNotifications.register();
}
