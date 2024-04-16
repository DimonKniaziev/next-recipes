import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB1gXZuyvk4Q3CwYyoXrLLI52QAKI4Urik",
  authDomain: "next-recipes-a18da.firebaseapp.com",
  projectId: "next-recipes-a18da",
  storageBucket: "next-recipes-a18da.appspot.com",
  messagingSenderId: "445720128815",
  appId: "1:445720128815:web:930f6a3340009031fb85da"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)