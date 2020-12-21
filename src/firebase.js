import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

//firebase install 했음!
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

var firebaseConfig = {
  apiKey: "AIzaSyARDpYnz_th7DD-lBB2mOmg9g5-pAWPwwo",
  authDomain: "kwangchat-779ec.firebaseapp.com",
  projectId: "kwangchat-779ec",
  storageBucket: "kwangchat-779ec.appspot.com",
  messagingSenderId: "361972483736",
  appId: "1:361972483736:web:d56e9849977dd7dd5472ed",
  measurementId: "G-507EBGCYED",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();

export default firebase;
