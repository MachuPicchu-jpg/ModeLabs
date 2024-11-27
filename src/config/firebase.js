// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// Remove analytics if you're not using it
// import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBpXUq1P1pZJaPh4t_eDL3v2BuQagCJ2oM",
  authDomain: "modelabs-a04f7.firebaseapp.com",
  projectId: "modelabs-a04f7",
  storageBucket: "modelabs-a04f7.firebasestorage.app",
  messagingSenderId: "418192407049",
  appId: "1:418192407049:web:904f30e1ca6ca9d0e5d6d8",
  measurementId: "G-RCT286G22Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Remove analytics if you're not using it
// const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;