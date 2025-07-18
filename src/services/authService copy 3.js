// >> In services/authService.js (REPLACE THE ENTIRE FILE)

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import { auth } from './firebase'; // Your firebase config file

// --- STATE MANAGEMENT ---
// This simple variable will hold the rich user profile object from our backend.
// In a larger application, this would be managed by a state library like Redux/Zustand.
let currentUserProfile = null;

/**
 * A helper function to make authenticated API calls to your backend.
 * It automatically gets a fresh token from Firebase for every request.
 * @param {string} endpoint - The backend API endpoint (e.g., '/api/cases')
 * @param {object} options - The standard Fetch API options (method, body, etc.)
 * @returns {Promise<any>} The JSON response from the backend.
 */
export const authenticatedFetch = async (endpoint, options = {}) => {
  const user = auth.currentUser;
  if (!user) throw new Error("Authentication Error: No user is signed in.");

  const idToken = await user.getIdToken();

  const response = await fetch(`http://localhost:8080${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
      'Authorization': `Bearer ${idToken}`,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(errorBody || `API Error: ${response.status}`);
  }

  // Handle responses that might not have a JSON body (e.g., HTTP 204)
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }
  return null;
};



// --- USER JOURNEY FUNCTIONS ---

/**
 * JOURNEY 1: A brand new user signs up publicly as a LAWYER.
 * This calls the new, specific backend endpoint for lawyer registration.
 */
export const signupNewLawyer = async (email, password, profileData) => {
  await createUserWithEmailAndPassword(auth, email, password);
  // After Firebase account is created, we register them on our backend.
  const backendUser = await authenticatedFetch('/api/auth/register-lawyer', {
    method: 'POST',
    body: JSON.stringify(profileData)
  });
  currentUserProfile = backendUser;
  return backendUser;
};


/**
 * JOURNEY 2: Any existing user logs in.
 * This calls the new endpoint to fetch the user's session data.
 */
export const loginWithEmail = async (email, password) => {
  await signInWithEmailAndPassword(auth, email, password);
  // After successful Firebase login, get the user's full profile from our backend.
  const backendUser = await authenticatedFetch('/api/auth/session');
  currentUserProfile = backendUser;
  return backendUser;
};


/**
 * JOURNEY 3: An invited user (Junior/Client) finalizes their sign-up.
 * This calls the dedicated invitation finalization endpoint.
 */
export const finalizeInvitation = async (email, password, invitationToken, profileData) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const firebaseIdToken = await userCredential.user.getIdToken();

  // This is a special, unauthenticated call to link the accounts.
  await fetch('http://localhost:8080/api/invitations/finalize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      invitationToken,
      firebaseIdToken,
      firstName: profileData.firstName,
      lastName: profileData.lastName,
    })
  });

  // After finalizing, we log them in properly by fetching their new session info.
  const backendUser = await authenticatedFetch('/api/auth/session');
  currentUserProfile = backendUser;
  return backendUser;
};

/**
 * Handles Google Sign-in for both new lawyers and existing users.
 * You will need a new backend endpoint to handle this "login or register" logic.
 */
export const loginWithGoogle = async () => {
    await signInWithPopup(auth, new GoogleAuthProvider());
    // This new endpoint will check if the user exists. If not, it will register them
    // as a lawyer. If they do exist, it will just return their session info.
    const backendUser = await authenticatedFetch('/api/auth/google-sync', { method: 'POST' });
    currentUserProfile = backendUser;
    console.log(backendUser);
    return backendUser;
};


/**
 * Logs out the user from Firebase and clears the local profile.
 */
export const logout = async () => {
  await signOut(auth);
  currentUserProfile = null;
  // Redirect to login page to ensure a clean state
  window.location.href = '/login';
};


/**
 * A listener to keep the app's state in sync with Firebase's auth state.
 * This should be called once when your entire application first loads (e.g., in App.js).
 * @param {function} onLogin - A callback function to run when a user is logged in.
 * @param {function} onLogout - A callback function to run when a user is logged out.
 */
export const initializeAuthListener = (onLogin, onLogout) => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      // User is signed into Firebase. Fetch their profile from our backend.
      try {
        const profile = await authenticatedFetch('/api/auth/session');
        currentUserProfile = profile;
        if (onLogin) onLogin(profile);
      } catch (error) {
        console.error("Session restoration failed. Logging out.", error);
        await logout();
      }
    } else {
      // User is not signed into Firebase.
      currentUserProfile = null;
      if (onLogout) onLogout();
    }
  });
};

// ▼▼▼ ADD THIS NEW EXPORTED FUNCTION ▼▼▼
/**
 * JOURNEY 6: A lawyer invites a new user.
 * @param {object} invitationData - { email, fullName, role, caseId }
 */
export const sendInvitation = async (invitationData) => {
  // This uses our authenticatedFetch helper, ensuring only a logged-in
  // user (who we assume is a lawyer based on backend rules) can call this.
  return await authenticatedFetch('/api/invitations', {
    method: 'POST',
    body: JSON.stringify(invitationData)
  });
};
// ▲▲▲ ADD THIS NEW EXPORTED FUNCTION ▲▲▲

/**
 * Gets the current user's profile data.
 * @returns {object|null} The current user's profile or null if not logged in.
 */
export const getCurrentUserProfile = () => currentUserProfile;

/**
 * Checks if a user is currently logged in.
 * @returns {boolean} True if user is logged in, false otherwise.
 */
export const isLoggedIn = () => currentUserProfile !== null;

/**
 * Gets the current user's role.
 * @returns {string|null} The user's role (LAWYER, JUNIOR_LAWYER, CLIENT) or null.
 */
export const getCurrentUserRole = () => currentUserProfile?.role || null;

