import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDm1k-O434tJKWm8FbDl_h4Fg2NTsNDYzY",
  authDomain: "attorney-45862.firebaseapp.com",
  projectId: "attorney-45862",
  storageBucket: "attorney-45862.firebasestorage.app",
  messagingSenderId: "998062170158",
  appId: "1:998062170158:web:8e67880023d3cd21f8bfbf"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword };