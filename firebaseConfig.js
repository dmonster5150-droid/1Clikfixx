
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAHLombrAwRIJXwG11vgTq8X7EdqFInBUA",
  authDomain: "clikfix-418b4.firebaseapp.com",
  projectId: "clikfix-418b4",
  storageBucket: "clikfix-418b4.appspot.com",
  messagingSenderId: "557392194925",
  appId: "1:557392194925:web:a99893be3ba48e3a1d7e64",
  measurementId: "G-NDF4W0ZBT4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, provider, db, storage };
