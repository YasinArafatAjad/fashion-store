import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

/**
 * Firebase configuration object
 * Using environment variables for security
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Validate that all required config values are present
const requiredConfigKeys = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
const missingKeys = requiredConfigKeys.filter(key => !firebaseConfig[key]);

if (missingKeys.length > 0) {
  console.warn('Missing Firebase configuration keys:', missingKeys);
  console.warn('Please check your .env.local file and ensure all NEXT_PUBLIC_FIREBASE_* variables are set');
  console.warn('The app will continue to run but Firebase features will not work properly');
}

/**
 * Initialize Firebase app only if it hasn't been initialized already
 * This prevents the 'duplicate-app' error in Next.js
 */
let app;
try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
} catch (error) {
  console.error('Firebase initialization error:', error);
  // Create a mock app for development if Firebase config is missing
  app = null;
}

/**
 * Firebase Authentication instance
 */
export const auth = app ? getAuth(app) : null;

/**
 * Firestore database instance
 */
export const db = app ? getFirestore(app) : null;

/**
 * Firebase Storage instance
 */
export const storage = app ? getStorage(app) : null;

export default app;