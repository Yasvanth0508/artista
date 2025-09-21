// src/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBY4rSjiq1p_hD5SdOzDxkguiGueG7caYc",
  authDomain: "artista-auth.firebaseapp.com",
  projectId: "artista-auth",
  storageBucket: "artista-auth.firebasestorage.app",
  messagingSenderId: "795151021566",
  appId: "1:795151021566:web:8883a3cc7d2fff19e23caf",
  measurementId: "G-X81K60JNVF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);