// >> In your new file: context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../services/firebase'; // Adjust path if needed

// --- Helper function now lives here or in its own utils file ---
const authenticatedFetch = async (endpoint, options = {}) => {
  const user = auth.currentUser;
  if (!user) throw new Error("No user is signed in to fetch.");
  const idToken = await user.getIdToken();
  const response = await fetch(`http://localhost:8080${endpoint}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers, 'Authorization': `Bearer ${idToken}`},
  });
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(errorBody || `API Error: ${response.status}`);
  }
  const contentType = response.headers.get("content-type");
  return (contentType && contentType.includes("application/json")) ? response.json() : null;
};
// -----------------------------------------------------------------

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user && user.emailVerified) {
                try {
                    // We only check for the session if we haven't already fetched it.
                    if (!currentUser) {
                        const profile = await authenticatedFetch('/api/auth/session');
                        setCurrentUser(profile);
                    }
                } catch (error) {
                    console.error("Failed to fetch user session:", error);
                    await signOut(auth);
                    setCurrentUser(null);
                }
            } else {
                setCurrentUser(null);
            }
            setLoading(false);
        });
        return unsubscribe;
    }, [currentUser]); // Added currentUser dependency

    const value = {
        currentUser,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};