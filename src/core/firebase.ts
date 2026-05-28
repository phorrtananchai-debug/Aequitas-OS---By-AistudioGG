import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration placeholders
// These should be populated from environment variables in production
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AI_STUDIO_PLACEHOLDER_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "AI_STUDIO_PLACEHOLDER_DOMAIN",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "AI_STUDIO_PLACEHOLDER_PROJECT",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "AI_STUDIO_PLACEHOLDER_BUCKET",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "AI_STUDIO_PLACEHOLDER_SENDER",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "AI_STUDIO_PLACEHOLDER_APP"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
