import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../services/firebase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// 🛠️ Helper to fetch from your backend with auth token
const authenticatedFetch = async (endpoint, options = {}) => {
  const user = auth.currentUser;
  if (!user) throw new Error("No user is signed in to fetch.");
  const idToken = await user.getIdToken();
  const response = await fetch(`http://localhost:8080${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
      'Authorization': `Bearer ${idToken}`
    },
  });
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(errorBody || `API Error: ${response.status}`);
  }
  const contentType = response.headers.get("content-type");
  return (contentType && contentType.includes("application/json")) ? response.json() : null;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const requiresVerification = user?.emailVerified === false && currentUser?.role === 'LAWYER';
          
          // 👀 Block login if email not verified and verification is required
          if (requiresVerification) {
            await signOut(auth);
            setCurrentUser(null);
          } else {
            // ✅ Load user profile from backend
            const profile = await authenticatedFetch('/api/auth/session');
            setCurrentUser(profile);
          }

        } catch (err) {
          console.error("Error fetching user profile:", err.message);
          await signOut(auth); // Safety: sign out if error
          setCurrentUser(null);
          
        }
      } else {
        // ❌ Not logged in
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

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
