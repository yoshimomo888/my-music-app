// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // ← Firestore用
// すでにある firebase.js にこれを追加
import { getAuth, GoogleAuthProvider } from "firebase/auth";

export const auth = getAuth();
export const provider = new GoogleAuthProvider();

const firebaseConfig = {
  apiKey: "AIzaSyB3x9sfrB-7i-T6xa4KbICsDGI7LZV6_2w",
  authDomain: "sa0621-8e2c4.firebaseapp.com",
  projectId: "sa0621-8e2c4",
  storageBucket: "sa0621-8e2c4.appspot.com",
  messagingSenderId: "123734755956",
  appId: "1:123734755956:web:755fa07a734032c7219f21",
  measurementId: "G-Z558H1YPNM"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

