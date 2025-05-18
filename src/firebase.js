import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyC7cXlOMK1ujnIRRP6bVsu5Gu-8YHgFZQQ",
  authDomain: "ssocieyt.firebaseapp.com",
  projectId: "ssocieyt",
  storageBucket: "ssocieyt.firebasestorage.app",
  messagingSenderId: "297468867662",
  appId: "1:297468867662:web:0612082fa22106b9ff3f1f",
  measurementId: "G-LXT498ZMWC"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
export default app;