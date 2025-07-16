// >> In services/authService.js (REPLACE THE ENTIRE FILE)

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendEmailVerification,
  getAuth,
  RecaptchaVerifier,
  PhoneAuthProvider,
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
  // await createUserWithEmailAndPassword(auth, email, password);
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  // After Firebase account is created, we register them on our backend.

  try {
    await sendEmailVerification(userCredential.user);
  } catch (emailError) {
    console.error("Could not send verification email:", emailError);
    // You can decide to alert the user here if you want
  }

  const backendUser = await authenticatedFetch('/api/auth/register-lawyer', {
    method: 'POST',
    body: JSON.stringify(profileData)
  });  
  
  // CRITICAL - Log the user out immediately.
  // This forces them to go to their email and verify before they can log in.
  await signOut(auth);
  return;
};


/**
 * JOURNEY 2: Any existing user logs in.
 * This calls the new endpoint to fetch the user's session data.
 */
export const loginWithEmail = async (email, password) => {
  return await checkLoginStatus(email, password); // This is just for clarity, keeping the old name.
};

export const checkLoginStatus = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  if (!userCredential.user.emailVerified) {
    await signOut(auth);
    throw new Error("Your email is not verified. Please check your inbox.");
  }
  // Call the lightweight status endpoint
  return await authenticatedFetch('/api/auth/status');
};

export const fetchAndStoreSession = async () => {
  if (!auth.currentUser) {
    throw new Error("No user is logged in to fetch a session for.");
  }
  // Call the main session endpoint that returns all the details.
  const fullProfile = await authenticatedFetch('/api/auth/session');
  // Store it globally for the rest of the app to use.
  currentUserProfile = fullProfile;
  return fullProfile;
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

// >> Add these new functions inside services/authService.js

/**
 * JOURNEY 4: Sends the SMS OTP to the user's phone.
 * This is called from the OTP page after a user has successfully logged in.
 * @param {string} phoneNumber - The user's phone number.
 * @param {string} recaptchaContainerId - The ID of the DOM element for the reCAPTCHA.
 * @returns {Promise<object>} The Firebase confirmationResult object.
 */
// >> In your existing file: services/authService.js

// >> In your existing file: services/authService.js

/**
 * Sends a verification SMS to the user's phone number.
 * This function correctly initializes the invisible reCAPTCHA and lets the Firebase SDK
 * handle the logic for bypassing it with test numbers.
 * @param {string} phoneNumber - The phone number in E.164 format (e.g., '+94767501542').
 * @param {string} recaptchaContainerId - The ID of the DOM element to host the reCAPTCHA widget.
 * @returns {Promise<object>} The Firebase confirmationResult object.
 */
  export const sendPhoneVerificationSms = async (phoneNumber, recaptchaContainerId) => {
    // Get the auth instance from Firebase.
    const auth = getAuth();

    // 1. Initialize the RecaptchaVerifier.
    // We attach it to the global 'window' object. This is a common practice to ensure that
    // the reCAPTCHA widget, which can be slow to load, is only created once per page load,
    // even if this function is called multiple times.
    if (!window.recaptchaVerifier) {
      console.log("Initializing new RecaptchaVerifier...");
      window.recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaContainerId, {
        'size': 'invisible',
        'callback': (response) => {
          // This callback is executed when the reCAPTCHA is successfully solved (usually invisibly).
          // We don't need to do anything here for the phone auth flow, but it's required.
          console.log("reCAPTCHA solved:", response);
        },
        'expired-callback': () => {
          // This is called if the user doesn't solve the reCAPTCHA in time.
          console.log("reCAPTCHA expired. Please try again.");
        }
      });
    }

    // Assign the initialized verifier to a local variable.
    const appVerifier = window.recaptchaVerifier;

    // 2. Call the verifyPhoneNumber function.
    // You ALWAYS pass the appVerifier. The Firebase SDK is responsible for checking
    // if the `phoneNumber` is a test number from your console.
    //   - If it IS a test number, the SDK will ignore the reCAPTCHA and immediately resolve.
    //   - If it is NOT a test number, the SDK will execute the invisible reCAPTCHA flow.
    const phoneProvider = new PhoneAuthProvider(auth);
    
    try {
      console.log(`Attempting to verify phone number: ${phoneNumber}`);
      const confirmationResult = await phoneProvider.verifyPhoneNumber(phoneNumber, appVerifier);
      console.log("Firebase has sent the code and returned a confirmation result.");
      return confirmationResult;
    } catch (error) {
      // This will catch errors like invalid phone number format, network issues, or
      // if the reCAPTCHA fails to load or is blocked.
      console.error("Error during verifyPhoneNumber:", error);
      // Re-throw the error so the component calling this function can handle it.
      throw error;
    }
  };

/**
 * JOURNEY 5: Verifies the OTP code and activates the user's account on the backend.
 * @param {object} confirmationResult - The object from the previous step.
 * @param {string} otpCode - The 6-digit code entered by the user.
 * @returns {Promise<object>} The now fully active user profile from the backend.
 */
export const verifyPhoneAndActivateAccount = async (confirmationResult, otpCode) => {
  // 1. Confirm the code with Firebase. This proves phone ownership.
  await confirmationResult.confirm(otpCode);

  // 2. Now that the phone is verified, tell our backend to update the user's status.
  const backendUser = await authenticatedFetch('/api/auth/activate-account', {
    method: 'POST'
  });
  
  // 3. Update the local state and return the fully active profile.
  currentUserProfile = backendUser;
  return backendUser;
};



// ... (The rest of your existing exported functions like logout, getCurrentUserProfile, etc. follow here)

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

