import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAUxHLacItMK11_Et0_pgNxlpCoqYDhzZE",
  authDomain: "expense-tracker-81866.firebaseapp.com",
  projectId: "expense-tracker-81866",
  storageBucket: "expense-tracker-81866.firebasestorage.app",
  messagingSenderId: "452701651858",
  appId: "1:452701651858:web:da9404ad3135399eb4f74b",
  measurementId: "G-2LB50MG0GN"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
