import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

//nadun's config. uncomment this if any issues happen

// const firebaseConfig = {
//   apiKey: "AIzaSyDm1k-O434tJKWm8FbDl_h4Fg2NTsNDYzY",
//   authDomain: "attorney-45862.firebaseapp.com",
//   projectId: "attorney-45862",
//   storageBucket: "attorney-45862.firebasestorage.app",
//   messagingSenderId: "998062170158",
//   appId: "1:998062170158:web:8e67880023d3cd21f8bfbf"
// };

const firebaseConfig = {

  apiKey: 'AIzaSyBw8oe5sjveuolOqmHTp-II4OOlvz7KAgU',
  authDomain: 'attorney-chat.firebaseapp.com',
  projectId: 'attorney-chat',
  storageBucket: 'attorney-chat.firebasestorage.app',
  messagingSenderId: '264944478076',
  appId: '1:264944478076:web:edd998b84405657296a6f9',
  measurementId: 'G-3Z2RPYWYHS',
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, db };