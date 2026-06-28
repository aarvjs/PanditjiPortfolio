import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

let app = null;
let db = null;
let auth = null;
let storage = null;
let analytics = null;
let isFirebaseConfigured = false;

// Basic validation to check if variables are present
if (
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY && 
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);
    isFirebaseConfigured = true;

    // Load analytics dynamically on client side
    if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID) {
      import("firebase/analytics").then(({ getAnalytics }) => {
        analytics = getAnalytics(app);
      }).catch(err => {
        console.error("Firebase analytics load error:", err);
      });
    }
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
}

export { app, db, auth, storage, analytics, isFirebaseConfigured };
