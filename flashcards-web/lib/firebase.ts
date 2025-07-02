// lib/firebase.ts

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Only import analytics in the browser
let analytics:
  | ReturnType<typeof import("firebase/analytics").getAnalytics>
  | undefined;

const firebaseConfig = {
  apiKey: "AIzaSyCt4VGKIeL3Kn5RuORFIG6GXbAGmO1RYRI",
  authDomain: "flashcardapp-web.firebaseapp.com",
  projectId: "flashcardapp-web",
  storageBucket: "flashcardapp-web.appspot.com",
  messagingSenderId: "746093899805",
  appId: "1:746093899805:web:ea28b56bbf8b06719116f4",
  measurementId: "G-CBHBSLRWFV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Only call getAnalytics in the browser
if (typeof window !== "undefined") {
  import("firebase/analytics").then(({ getAnalytics }) => {
    analytics = getAnalytics(app);
  });
}

// ✅ Export Firestore instance
export const db = getFirestore(app);
