import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore, serverTimestamp } from 'firebase/firestore';

// Initialize Firebase only on client side
let app = null;
let auth = null;
let db = null;

const getFirebaseConfig = () => {
  // Only access env vars on client side
  if (typeof window === 'undefined') {
    return null;
  }

  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
};

const initializeFirebase = () => {
  // Only run on client side
  if (typeof window === 'undefined') {
    return;
  }

  // Check if Firebase is already initialized
  if (getApps().length > 0) {
    app = getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
    return;
  }

  const firebaseConfig = getFirebaseConfig();
  
  if (!firebaseConfig) {
    console.warn('Firebase config not available');
    return;
  }

  // Validate all required fields are present
  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
  const missingFields = requiredFields.filter(field => !firebaseConfig[field]);
  
  if (missingFields.length > 0) {
    console.error('❌ Missing Firebase config fields:', missingFields.join(', '));
    return;
  }

  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log('✅ Firebase initialized successfully');
  } catch (error) {
    console.error('❌ Firebase initialization error:', error);
    console.error('Error details:', error.message);
  }
};

// Initialize immediately if on client side
if (typeof window !== 'undefined') {
  initializeFirebase();
}

// Helper function to sign in anonymously
export const signInAnonymous = async () => {
  // Ensure Firebase is initialized
  if (typeof window !== 'undefined' && !auth) {
    initializeFirebase();
  }
  
  if (!auth) {
    throw new Error(
      'Firebase is not configured. Please add your Firebase credentials to .env.local'
    );
  }
  try {
    const userCredential = await signInAnonymously(auth);
    return userCredential.user;
  } catch (error) {
    console.error('Error signing in anonymously:', error);
    throw error;
  }
};

// Export serverTimestamp for use in Firestore
export { serverTimestamp };

// Export getters that initialize if needed
export const getAuthInstance = () => {
  if (typeof window !== 'undefined' && !auth) {
    initializeFirebase();
  }
  return auth;
};

export const getDbInstance = () => {
  if (typeof window !== 'undefined' && !db) {
    initializeFirebase();
  }
  return db;
};

// For backward compatibility, export auth and db
// But they'll be null on server side
export { auth, db };
