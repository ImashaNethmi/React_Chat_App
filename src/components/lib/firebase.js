import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "react-chat-app-43148.firebaseapp.com",
  projectId: "react-chat-app-43148",
  storageBucket: "react-chat-app-43148.firebasestorage.app",
  messagingSenderId: "43678290588",
  appId: "1:43678290588:web:66d24d6529a168f4ac5359",
  measurementId: "G-8SJE1MQNHC"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()
