import { initializeApp } from 'firebase-admin/app';
import { setGlobalOptions } from 'firebase-functions/v2';

initializeApp();
setGlobalOptions({ region: 'us-central1', maxInstances: 20 });

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
