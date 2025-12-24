
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA9QO25ZNyb4e6vmslmBv6W7-tbrb0dXFQ",
  authDomain: "merrychristmas-cf68b.firebaseapp.com",
  projectId: "merrychristmas-cf68b",
  storageBucket: "merrychristmas-cf68b.firebasestorage.app",
  messagingSenderId: "408248616550",
  appId: "1:408248616550:web:b1b388ea87392b57570fa7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
