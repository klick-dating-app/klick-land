// Concede el rol de administrador (claim `admin`) a un usuario de Firebase Auth.
// Uso:  cd functions && GOOGLE_APPLICATION_CREDENTIALS=sa.json node scripts/set-admin.mjs <uid>
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const uid = process.argv[2];
if (!uid) {
  console.error('Uso: node scripts/set-admin.mjs <uid>');
  process.exit(1);
}
initializeApp({ credential: applicationDefault() });
await getAuth().setCustomUserClaims(uid, { admin: true });
console.log(`✓ ${uid} ahora es administrador (debe volver a iniciar sesión).`);
