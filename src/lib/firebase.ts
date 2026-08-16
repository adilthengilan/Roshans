import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  Firestore,
  enableIndexedDbPersistence,
} from 'firebase/firestore';

// Default Firebase Configuration
// If environment variables or custom config are provided, they override these defaults.
// Users can also customize their Firebase project config dynamically in Settings.
const DEFAULT_FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDV-TX40p4dXOvxexH8MZr4f0xc2wTdxW0",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "roshans-demo.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "roshans-demo",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "roshans-demo.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "82761393543",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:82761393543:web:27aac22fa6588694a5df22",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-N6GB1WY851",
};

const FIREBASE_CONFIG_STORAGE_KEY = 'intokine_custom_firebase_config_v1';

export function getStoredFirebaseConfig() {
  try {
    const saved = localStorage.getItem(FIREBASE_CONFIG_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.projectId && parsed.apiKey) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse custom firebase config:', e);
  }
  return DEFAULT_FIREBASE_CONFIG;
}

export function saveStoredFirebaseConfig(config: typeof DEFAULT_FIREBASE_CONFIG) {
  try {
    localStorage.setItem(FIREBASE_CONFIG_STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save firebase config to localStorage:', e);
  }
}

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let isInitialized = false;

export function initializeFirebaseApp() {
  if (app && db) {
    return { app, db, isConnected: isInitialized };
  }

  try {
    const config = getStoredFirebaseConfig();
    if (!getApps().length) {
      app = initializeApp(config);
    } else {
      app = getApp();
    }

    db = getFirestore(app);
    isInitialized = true;
  } catch (error) {
    console.warn('Firebase initialization notice (offline mode available):', error);
    isInitialized = false;
  }

  return { app, db, isConnected: isInitialized };
}

export {
  app,
  db,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
};
