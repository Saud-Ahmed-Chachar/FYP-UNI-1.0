// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Only import once

const firebaseConfig = {
  apiKey: "AIzaSyAPLc2U6xDs2MtXEdBWc8GwEytaXE8bt9o",
  authDomain: "project-crud-32cfe.firebaseapp.com",
  projectId: "project-crud-32cfe",
  storageBucket: "project-crud-32cfe.appspot.com",
  messagingSenderId: "878433091616",
  appId: "1:878433091616:web:492a34d5154b938d29fc45"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);