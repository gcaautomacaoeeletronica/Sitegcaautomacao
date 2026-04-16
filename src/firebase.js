import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB6_R93plpO1Rz32zzxiXHh987Q2fbX6gE",
  authDomain: "gcaautomacao.firebaseapp.com",
  projectId: "gcaautomacao",
  storageBucket: "gcaautomacao.firebasestorage.app",
  messagingSenderId: "344757990886",
  appId: "1:344757990886:web:72740f449549bf30ffd227",
  measurementId: "G-KDBSC9BT6M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const db = getFirestore(app);

export { db };
export default app;
