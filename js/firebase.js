// src/js/firebase.js (or wherever you placed your firebase.js)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCunlGvFYBnYAsm4eQ-1nneE2dr4L353rs",
  authDomain: "haris-suhail-portfolio.firebaseapp.com",
  projectId: "haris-suhail-portfolio",
  storageBucket: "haris-suhail-portfolio.firebasestorage.app",
  messagingSenderId: "565216951358",
  appId: "1:565216951358:web:fb77fa0daf4be0adb8256f"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);