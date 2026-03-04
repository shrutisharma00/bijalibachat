// Firebase configuration for optional anonymous sync
// NOTE: Replace the placeholder config with your actual Firebase project config.

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy
} from "firebase/firestore";

// Dummy default config – update via environment variables or direct values
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo.appspot.com",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "000000000000",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:000000000000:web:demo"
};

let app;
let db;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (e) {
  console.warn("Firebase init failed (using offline only):", e);
}

export async function syncBillsToCloud(bills) {
  if (!db) return { success: false, reason: "firebase_unavailable" };
  try {
    const colRef = collection(db, "bijli-bachat-bills");
    await addDoc(colRef, {
      bills,
      createdAt: new Date().toISOString()
    });
    return { success: true };
  } catch (e) {
    console.error("Failed to sync bills to Firestore", e);
    return { success: false, reason: "firestore_error" };
  }
}

export async function fetchRecentCloudBills(limit = 5) {
  if (!db) return [];
  try {
    const colRef = collection(db, "bijli-bachat-bills");
    const q = query(colRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    const items = [];
    snapshot.forEach((doc) => items.push(doc.data()));
    return items.slice(0, limit);
  } catch (e) {
    console.error("Failed to fetch Firestore bills", e);
    return [];
  }
}

