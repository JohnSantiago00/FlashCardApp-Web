// lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCt4VGKIeL3Kn5RuORFIG6GXbAGmO1RYRI",
  authDomain: "flashcardapp-web.firebaseapp.com",
  projectId: "flashcardapp-web",
  storageBucket: "flashcardapp-web.appspot.com",
  messagingSenderId: "746093899805",
  appId: "1:746093899805:web:ea28b56bbf8b06719116f4",
  measurementId: "G-CBHBSLRWFV",
};

const app = initializeApp(firebaseConfig);

// ✅ Only export Firestore (no analytics)
export const db = getFirestore(app);
