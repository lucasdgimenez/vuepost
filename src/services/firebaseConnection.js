 import firebase from "firebase/app"
 import "firebase/firestore"
 import "firebase/auth"
 
 // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  var firebaseConfig = {
    apiKey: "AIzaSyBMoVcRtPNPnbvSLns7rhTmNYRX4ixbOIw",
    authDomain: "vuepost-898aa.firebaseapp.com",
    projectId: "vuepost-898aa",
    storageBucket: "vuepost-898aa.appspot.com",
    messagingSenderId: "1000103417548",
    appId: "1:1000103417548:web:7483442c927116bf29d469",
    measurementId: "G-VXHTD0913H"
  };
  // Initialize Firebase
  if(!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  export default firebase;