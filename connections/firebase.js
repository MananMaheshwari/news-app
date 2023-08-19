import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore"
const firebaseConfig = {
  apiKey: "AIzaSyAQbtWcCotVzxjKCAXDyFkVrbcdf9-GUOA",
  authDomain: "news-app-742fb.firebaseapp.com",
  projectId: "news-app-742fb",
  storageBucket: "news-app-742fb.appspot.com",
  messagingSenderId: "548273521123",
  appId: "1:548273521123:web:ca33ad184b19b85f74a0d6",
  measurementId: "G-LJBPHHZGY7"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)