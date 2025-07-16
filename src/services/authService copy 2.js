import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth } from './firebase'; // Adjust path if necessary

const processFirebaseLogin = async (userCredential, additionalData = {}) => {
  try {
    const idToken = await userCredential.user.getIdToken();

    const response = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // This header is now required
        Authorization: `Bearer ${idToken}`,
      },
      // We send the additional data in the body
      body: JSON.stringify(additionalData),
    });

    if (!response.ok) {
      const errorData = await response.text();
      try {
        const parsedError = JSON.parse(errorData);
        throw new Error(parsedError.message || `Backend Error: ${response.status}`);
      } catch (e) {
        throw new Error(errorData || `Backend Error: ${response.status}`);
      }
    }

    const backendUser = await response.json();

    localStorage.setItem('user', JSON.stringify(backendUser));
    localStorage.setItem('idToken', idToken);

    return backendUser;
  } catch (error) {
    console.error('Error processing login with backend:', error);
    throw error;
  }
};


// UPDATED: This function now accepts the 'profileData' from your form
export const signupWithEmail = async (email, password, profileData) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
  // Optional but recommended: Update Firebase profile with the name
  await updateProfile(userCredential.user, {
    displayName: `${profileData.firstName} ${profileData.lastName}`,
  });

  // Pass the profileData along to the backend processing function
  return await processFirebaseLogin(userCredential, profileData);
};


// --- The rest of the functions remain the same ---

export const loginWithEmail = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return await processFirebaseLogin(userCredential); // No profile data needed on login
};

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  return await processFirebaseLogin(userCredential); // No profile data needed
};

export const logout = async () => {
  await signOut(auth);
  localStorage.removeItem('user');
  localStorage.removeItem('idToken');
  window.location.href = '/login';
};

export const getCurrentUser = () => {
  const userJson = localStorage.getItem('user');
  return userJson ? JSON.parse(userJson) : null;
};