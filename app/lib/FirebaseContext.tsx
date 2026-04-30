"use client";

import { createContext, useContext, ReactNode } from "react";
import { getFirebaseAuth, getFirebaseDb, getFirebaseStorage, isConfigured } from "./firebase";
import { Auth } from "firebase/auth";
import { Firestore } from "firebase/firestore";
import { FirebaseStorage } from "firebase/storage";

interface FirebaseContextType {
  auth: Auth;
  db: Firestore;
  storage: FirebaseStorage;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export function FirebaseProvider({ children }: { children: ReactNode }) {
  // Only initialize Firebase services if configured
  if (!isConfigured()) {
    console.warn("Firebase not configured. Set environment variables.");
    return (
      <FirebaseContext.Provider value={{ auth: null as any, db: null as any, storage: null as any }}>
        {children}
      </FirebaseContext.Provider>
    );
  }

  const auth = getFirebaseAuth();
  const db = getFirebaseDb();
  const storage = getFirebaseStorage();

  return (
    <FirebaseContext.Provider value={{ auth, db, storage }}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error("useFirebase must be used within a FirebaseProvider");
  }
  return context;
}
