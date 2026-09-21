import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAMMW3nqpbmNUK-jfI2Pw1Lsk5yjPBfv64",
  authDomain: "lifeguide-97d32.firebaseapp.com",
  projectId: "lifeguide-97d32",
  storageBucket: "lifeguide-97d32.firebasestorage.app",
  messagingSenderId: "396852503728",
  appId: "1:396852503728:web:a21b30c580b5edc1238775",
  measurementId: "G-GEWXG8P14Z"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;