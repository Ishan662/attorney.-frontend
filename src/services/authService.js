import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendEmailVerification,
  signOut,
} from 'firebase/auth';
import { auth } from './firebase'; // Your firebase config file
import { Navigate } from 'react-router-dom';

// This helper function is the core of your API communication. It's self-contained and robust.
export const authenticatedFetch = async (endpoint, options = {}) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("No authenticated user found. Please log in again.");
  }

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
    let errorMessage = `API Error: ${response.status}`;
    try {
        const parsedError = JSON.parse(errorBody);
        errorMessage = parsedError.message || errorBody;
    } catch (e) {
        errorMessage = errorBody || errorMessage;
    }
    throw new Error(errorMessage);
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }
  return null;
};


// ========================================================================
// --- CORE AUTHENTICATION JOURNEYS ---
// ========================================================================

/**
 * Signs up a new lawyer. This involves creating their Firebase account,
 * sending a verification email, registering them on the backend, and logging them out.
 */
export const signupNewLawyer = async (email, password, profileData) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
  // We need the token from the newly created user to make the backend call.
  const idToken = await userCredential.user.getIdToken();
  await fetch('http://localhost:8080/api/auth/register-lawyer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${idToken}` },
      body: JSON.stringify(profileData),
  });
  
  // Send verification email and force logout so they must verify before continuing.
  await sendEmailVerification(userCredential.user);
  await signOut(auth);
};

/**
 * Logs in a user with email/password. This is the first step that checks email verification
 * and gets the user's application status from the backend.
 * @returns {Promise<object>} A lightweight object like { status, phoneNumber, fullName }
 */
export const loginWithEmail = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  const userStatus = await authenticatedFetch('/api/auth/status');

  const requiresVerification = userStatus?.role === 'LAWYER';

  if (!user.emailVerified && requiresVerification) {
    await sendEmailVerification(user);
    await signOut(auth);
    throw new Error("Your email is not verified. Please check your inbox for the verification link.");
  }

  return userStatus;
};

/**
 * Handles Google Sign-in for new or existing users.
 * The backend's '/google-sync' endpoint handles the logic to either find or create the user.
 */
export const loginWithGoogle = async () => {
    await signInWithPopup(auth, new GoogleAuthProvider());
    // This endpoint handles the full logic for Google users.
    return await authenticatedFetch('/api/auth/google-sync', { method: 'POST' });
};

/**
 * Logs out the user from Firebase.
 */
export const logout = async () => {
  await signOut(auth);
  // Redirecting here ensures a clean state on logout.
  window.location.href = '/user/login';
};


// ========================================================================
// --- TWILIO PHONE VERIFICATION JOURNEYS ---
// ========================================================================

/**
 * Asks our backend to send an OTP to the currently logged-in user's phone.
 */
export const sendTwilioOtp = async () => {
  return await authenticatedFetch('/api/otp/send', { method: 'POST' });
};

/**
 * Sends the user-entered OTP to our backend for verification and account activation.
 * @param {string} otpCode The 6-digit code from the user.
 * @returns {Promise<object>} The fully activated user profile DTO.
 */
export const verifyTwilioOtpAndActivate = async (otpCode) => {
  return await authenticatedFetch('/api/otp/verify', {
    method: 'POST',
    body: JSON.stringify({ otpCode })
  });
};


// ========================================================================
// --- INVITATION JOURNEYS ---
// ========================================================================

/**
 * Allows a lawyer to invite a new user (Junior/Client) to their firm.
 */
export const sendInvitation = async (invitationData) => {
  return await authenticatedFetch('/api/invitations', {
    method: 'POST',
    body: JSON.stringify(invitationData)
  });
};

/**
 * Allows an invited user to finalize their registration.
 */
export const finalizeInvitation = async (email, password, invitationToken, profileData) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const firebaseIdToken = await userCredential.user.getIdToken();

  const response = await fetch('http://localhost:8080/api/invitations/finalize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      invitationToken,
      firebaseIdToken,
      firstName: profileData.firstName,
      lastName: profileData.lastName,
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(errorBody || 'Failed to finalize invitation.');
  }

  // Fetch the session using the ID token directly, not authenticatedFetch.
  const sessionResponse = await fetch('http://localhost:8080/api/auth/session', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${firebaseIdToken}`,
    },
  });
  if (!sessionResponse.ok) throw new Error(await sessionResponse.text());
  return sessionResponse.json();
};


// ========================================================================
// --- SESSION MANAGEMENT ---
// ========================================================================

/**
 * Fetches the full, detailed user profile from our backend.
 * This should be called ONLY after a user is confirmed to be ACTIVE.
 */
export const getFullSession = async () => {
    return await authenticatedFetch('/api/auth/session');
};

// Wait for auth.currentUser to be set (simple polling)
export const waitForAuthUser = () =>
  new Promise((resolve, reject) => {
    let attempts = 0;
    const check = () => {
      if (auth.currentUser) return resolve(auth.currentUser);
      if (++attempts > 50) return reject(new Error("User not set in time"));
      setTimeout(check, 100);
    };
    check();
  });
