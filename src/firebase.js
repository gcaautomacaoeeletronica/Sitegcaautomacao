import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB6_R93plpO1Rz32zzxiXHh987Q2fbX6gE",
  authDomain: "gcaautomacao.firebaseapp.com",
  projectId: "gcaautomacao",
  storageBucket: "gcaautomacao.firebasestorage.app",
  messagingSenderId: "344757990886",
  appId: "1:344757990886:web:72740f449549bf30ffd227",
  measurementId: "G-KDBSC9BT6M"
};

// Initialize Firebase App Principal
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

// Initialize Firebase App Secundário (GAMBIARRA OFICIAL PARA CRIAR ADMINS SEM DESLOGAR)
const secondaryApp = initializeApp(firebaseConfig, "Secondary");
const secondaryAuth = getAuth(secondaryApp);

export { db, storage, auth, secondaryAuth };
export default app;
