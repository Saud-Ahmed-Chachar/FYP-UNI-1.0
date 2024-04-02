import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// more code here
const firebaseConfig = {
  apiKey: "AIzaSyDiOe_9TmZXravlUMhRi0HbQH6fqP7uPQw",
  authDomain: "uni-select-main.firebaseapp.com",
  projectId: "uni-select-main",
  storageBucket: "uni-select-main.appspot.com",
  messagingSenderId: "312805977977",
  appId: "1:312805977977:web:d8e7fefe8013b047f309a8"
};


export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
export const storage = getStorage(app);