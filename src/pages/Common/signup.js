import { auth, createUserWithEmailAndPassword } from './firebase';

async function signup(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken();

    // Send to Spring Boot backend
    const res = await fetch('http://localhost:8080/api/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken })
    });

    console.log(await res.json());
  } catch (error) {
    console.error("Error:", error.message);
  }
}

import { auth, createUserWithEmailAndPassword } from './firebase';

async function login(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken();

    // Send to Spring Boot backend
    const res = await fetch('http://localhost:8080/api/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken })
    });

    console.log(await res.json());
  } catch (error) {
    console.error("Error:", error.message);
  }
}