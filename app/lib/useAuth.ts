"use client";

import { useEffect, useState } from "react";
import { useFirebase } from "./FirebaseContext";
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

const ADMIN_USERNAME = process.env.NEXT_PUBLIC_ADMIN_USERNAME || "admin123";
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "123456a";

export function useAuth() {
  const { auth } = useFirebase();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listen to auth state changes
  useEffect(() => {
    // Skip if auth is not available (Firebase not configured)
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAdmin(false);
      setLoading(false);
    });

    return unsubscribe;
  }, [auth]);

  // Sign up with email and password
  const signup = async (email: string, password: string) => {
    if (!auth) {
      throw new Error("Firebase not configured");
    }
    try {
      setError(null);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  // Sign in with email and password or admin credentials
  const signin = async (emailOrUsername: string, password: string) => {
    if (!auth) {
      throw new Error("Firebase not configured");
    }
    try {
      setError(null);

      if (emailOrUsername === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        setIsAdmin(true);
        setUser(null);
        return null;
      }

      const result = await signInWithEmailAndPassword(auth, emailOrUsername, password);
      return result.user;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    if (!auth) {
      throw new Error("Firebase not configured");
    }
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  // Sign out
  const logout = async () => {
    try {
      setError(null);
      if (isAdmin) {
        setIsAdmin(false);
        setUser(null);
        return;
      }
      if (!auth) {
        throw new Error("Firebase not configured");
      }
      await signOut(auth);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    user,
    isAdmin,
    loading,
    error,
    signup,
    signin,
    signInWithGoogle,
    logout,
  };
}
