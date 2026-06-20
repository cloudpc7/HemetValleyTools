/**
 * One-time script to grant Pro Portal admin access to a Firebase Auth user.
 *
 * Usage:
 *   node scripts/set-admin-claim.cjs team@hemetvalleytools.com
 *
 * Requires GOOGLE_APPLICATION_CREDENTIALS or Firebase CLI login with admin access.
 */
const admin = require('firebase-admin');

const email = process.argv[2];

if (!email) {
  console.error('Usage: node scripts/set-admin-claim.cjs <staff-email>');
  process.exit(1);
}

if (!admin.apps.length) {
  admin.initializeApp({
    projectId: 'hemetvalleytools',
    databaseURL: 'https://hemetvalleytools-default-rtdb.firebaseio.com',
  });
}

async function main() {
  const user = await admin.auth().getUserByEmail(email);
  await admin.auth().setCustomUserClaims(user.uid, { role: 'admin' });
  await admin.firestore().collection('staff_users').doc(user.uid).set({
    email,
    role: 'admin',
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });

  console.log(`Admin claim set for ${email} (uid: ${user.uid})`);
  console.log('User must sign out and sign back in for the claim to take effect.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});