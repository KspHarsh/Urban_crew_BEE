5// Firebase Configuration
// IMPORTANT: Replace these values with your actual Firebase project credentials
// Get these from: Firebase Console > Project Settings > General > Your apps > Web app

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// TODO: Replace with your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDxljUBrXQXAmzAgfFCR6mXfjvF4ATPMJQ",
  authDomain: "urbancrew-05.firebaseapp.com",
  projectId: "urbancrew-05",
  storageBucket: "urbancrew-05.firebasestorage.app",
  messagingSenderId: "71054030200",
  appId: "1:71054030200:web:a9db28dce4c624d973048d",
  measurementId: "G-JF3S36L402"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
