// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from '@firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD8Y3r2LWGAEX8BRWUY847DqKjeUaRkWuM",
  authDomain: "hearing-test-mobile-app.firebaseapp.com",
  projectId: "hearing-test-mobile-app",
  storageBucket: "hearing-test-mobile-app.appspot.com",
  messagingSenderId: "129426794915",
  appId: "1:129426794915:web:7804ae15b00b8334351216",
  measurementId: "G-9JFJ37LV1B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db};