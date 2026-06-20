import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "demo-hemetvalleytools",
  authDomain: "hemetvalleytools.firebaseapp.com",
  projectId: "hemetvalleytools",
  storageBucket: "hemetvalleytools.appspot.com",
  messagingSenderId: "demo-12345678",
  appId: "demo-12345678",
  databaseURL: "https://hemetvalleytools-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app, 'hemetvalleytools');
const auth = getAuth(app);
const storage = getStorage(app);
const database = getDatabase(app);
const functions = getFunctions(app, 'us-central1');

console.log("Connecting frontend to live production Firebase services...");

export { db, database, storage, functions, auth, app };
