import { initializeApp, getApps } from 'firebase-admin/app';

if (getApps().length === 0) initializeApp();

// Cloud Functions de Klick. Web y app las llaman vía `web/src/lib/api.ts`.
export { saveProfile } from './profile';
export { getCandidates, swipe } from './discovery';
export {
  blockUser,
  unblockUser,
  reportUser,
  requestVerification,
  adminReviewVerification,
  adminResolveReport,
  deleteAccount,
} from './safety';
export { createCheckoutSession, createPortalSession, stripeWebhook } from './billing';
export { onMessageCreated, safeDateReminders } from './triggers';
