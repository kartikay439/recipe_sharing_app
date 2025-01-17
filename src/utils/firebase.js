// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Import Firebase Storage

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDqoajetWZTwt9k2xXdxcSZqCSumgNeP4g",
    authDomain: "recipe-76527.firebaseapp.com",
    projectId: "recipe-76527",
    storageBucket: "recipe-76527.firebasestorage.app",
    messagingSenderId: "969061166306",
    appId: "1:969061166306:web:2158e82726f90b17a4c2bb",
    measurementId: "G-6RV5156LZH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app); // Firebase Authentication
export const db = getFirestore(app); // Firestore Database
export const storage = getStorage(app); // Firebase Storage

export default app;