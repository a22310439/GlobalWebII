// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD7MaOI0fn_Mm1augRwRAL5ftzgo7MA0bM",
  authDomain: "proyectoweb-776db.firebaseapp.com",
  projectId: "proyectoweb-776db",
  storageBucket: "proyectoweb-776db.appspot.com",
  messagingSenderId: "724617461487",
  appId: "1:724617461487:web:c5270b948cd05a05a0251a",
  measurementId: "G-VQTMN60GV0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };