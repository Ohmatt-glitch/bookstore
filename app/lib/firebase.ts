// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Check if all required config values are present
const isFirebaseConfigured = () => {
  return !!(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID
  );
};

// Lazy initialization to prevent build errors when env vars are missing
let app: any = null;
let auth: any = null;
let db: any = null;
let storage: any = null;
let analytics: any = null;

const initializeFirebase = () => {
  if (!isFirebaseConfigured()) {
    console.warn("Firebase configuration missing. Set environment variables.");
    return false;
  }
  
  if (!app) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    
    if (typeof window !== "undefined") {
      analytics = getAnalytics(app);
    }
  }
  return true;
};

// Export getters for lazy initialization
export const getFirebaseAuth = () => {
  initializeFirebase();
  return auth;
};

export const getFirebaseDb = () => {
  initializeFirebase();
  return db;
};

export const getFirebaseStorage = () => {
  initializeFirebase();
  return storage;
};

export const getFirebaseAnalytics = () => {
  initializeFirebase();
  return analytics;
};

export const isConfigured = isFirebaseConfigured;
