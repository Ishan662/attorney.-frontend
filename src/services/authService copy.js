import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from 'firebase/auth';
import { auth } from './firebase'; // Adjust this path to your firebase.js file

// The key function to communicate with our Spring Boot backend
const processFirebaseLogin = async (userCredential) => {
  try {
    const idToken = await userCredential.user.getIdToken();

    // The CORRECT way to call your backend
    const response = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: {
        // The token MUST be in the Authorization header
        Authorization: `Bearer ${idToken}`,
      },
      // The body is not needed as the token in the header contains all info
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Backend verification failed: ${errorData}`);
    }

    const backendUser = await response.json();

    // SUCCESS! Now, save the user data and token for future use
    localStorage.setItem('user', JSON.stringify(backendUser));
    localStorage.setItem('idToken', idToken); // We can save the token too if needed for other services

    return backendUser;
  } catch (error) {
    console.error('Error processing login with backend:', error);
    // Re-throw the error so the UI component can display it
    throw error;
  }
};

// --- Exportable Functions for your UI components to use ---

export const signupWithEmail = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  return await processFirebaseLogin(userCredential);
};

export const loginWithEmail = async (email, password) => {
  // CORRECTLY using signInWithEmailAndPassword
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return await processFirebaseLogin(userCredential);
};

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  return await processFirebaseLogin(userCredential);
};

export const logout = async () => {
  await signOut(auth);
  // Clear user data from local storage
  localStorage.removeItem('user');
  localStorage.removeItem('idToken');
  // Optional: redirect to login page
  window.location.href = '/login';
};

export const getCurrentUser = () => {
  const userJson = localStorage.getItem('user');
  return userJson ? JSON.parse(userJson) : null;
};