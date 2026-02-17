import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase Client Configuration
// TODO: Replace the placeholder values below with your actual Firebase config
// Get these from: Firebase Console > Project Settings > General > Your apps > Web app
const firebaseConfig = {
    apiKey: "AIzaSyCr1TxSRKLqjbKzxqvoKbpdM1UM_XyPC9E",
    authDomain: "for-you-7e8a2.firebaseapp.com",
    projectId: "for-you-7e8a2",
    storageBucket: "for-you-7e8a2.firebasestorage.app",
    messagingSenderId: "346279821187",
    appId: "1:346279821187:web:YOUR_APP_ID_HERE"
};

// Initialize Firebase (singleton pattern)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
