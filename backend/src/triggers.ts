import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { db, pushTo } from './lib/common';

/** Nuevo mensaje: actualiza la vista previa del match y notifica a la otra persona. */
export const onMessageCreated = onDocumentCreated('matches/{matchId}/messages/{messageId}', async (event) => {
  const msg = event.data?.data();
  if (!msg) return;
  const matchRef = db().doc(`matches/${event.params.matchId}`);
  const match = (await matchRef.get()).data();
  if (!match) return;
  await matchRef.update({ lastMessage: String(msg.text).slice(0, 120), lastMessageAt: msg.createdAt, lastSenderId: msg.senderId });
  const recipient = (match.members as string[]).find((m) => m !== msg.senderId);
  if (recipient) {
    const sender = match.profiles?.[msg.senderId]?.name ?? 'Tu match';
    await pushTo(recipient, sender, String(msg.text).slice(0, 100), { matchId: event.params.matchId });
  }
});

/** Safe First Date: recordatorio 1 h antes y alerta si no hay check-in 30 min después. */
export const safeDateReminders = onSchedule('every 15 minutes', async () => {
  const now = Date.now();
  const snap = await db().collection('safeDates').where('status', '==', 'scheduled').get();
  for (const doc of snap.docs) {
    const d = doc.data();
    const start = d.dateTimeMs as number;
    const checkedIn = Boolean(d.checkins?.[d.createdBy]);
    if (!d.reminded1h && start - now <= 3_600_000 && start > now) {
      await Promise.all(
        (d.participants as string[]).map((p) =>
          pushTo(p, 'Tu primera cita es en 1 hora', `${d.venueName}. Recuerda compartir tu plan con tu contacto de confianza.`, { safeDateId: doc.id }),
        ),
      );
      await doc.ref.update({ reminded1h: true });
    }
    if (!d.alertSent && !checkedIn && now - start >= 1_800_000) {
      await pushTo(d.createdBy, '¿Todo bien?', 'Confirma tu check-in de la cita o usa el botón de ayuda.', { safeDateId: doc.id });
      await doc.ref.update({ alertSent: true });
    }
  }
});
