// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDg03eCP2WmSPC-WLkcL7acobh068A8Y6o",
  authDomain: "expensetracker-74737.firebaseapp.com",
  projectId: "expensetracker-74737",
  storageBucket: "expensetracker-74737.appspot.com",
  messagingSenderId: "555412310535",
  appId: "1:555412310535:web:0840ae111068140696b8a2",
  measurementId: "G-DEK59Z9E6N",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
