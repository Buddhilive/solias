// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXTJS_PUBLIC_API_KEY,
  authDomain: process.env.NEXTJS_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXTJS_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXTJS_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXTJS_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXTJS_PUBLIC_APP_ID,
  measurementId: process.env.NEXTJS_PUBLIC_MEASUREMENT_ID
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);

export { app, auth };