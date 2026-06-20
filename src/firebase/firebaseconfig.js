// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBR1uwJkSrj620qy6zRXP0t_3cv8qUX54E",
  authDomain: "hemetvalleytools.firebaseapp.com",
  projectId: "hemetvalleytools",
  storageBucket: "hemetvalleytools.firebasestorage.app",
  messagingSenderId: "643260224273",
  appId: "1:643260224273:web:c2b16e156564d90c3572b0",
  measurementId: "G-0W6SNF2MB8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);