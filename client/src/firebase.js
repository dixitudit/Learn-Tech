// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "learn-tech-ef5c2.firebaseapp.com",
  projectId: "learn-tech-ef5c2",
  storageBucket: "learn-tech-ef5c2.appspot.com",
  messagingSenderId: "1085222919198",
  appId: "1:1085222919198:web:3f78fb1c08776e1314620f"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

