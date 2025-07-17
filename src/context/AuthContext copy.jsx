import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../services/firebase'; // Adjust path
import { authenticatedFetch } from '../services/authService'; // We will clean this up next

// 1. Create the context
const AuthContext = createContext();

// 2. Create a custom hook to easily access the context
export const useAuth = () => {
    return useContext(AuthContext);
};

// 3. Create the Provider component that will wrap your app
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true); // To show a loading screen while we check auth status

    useEffect(() => {
        // This Firebase listener is the single source of truth for "is someone logged into Firebase?"
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user && user.emailVerified) {
                // User is logged into Firebase and their email is verified.
                // Now, get their full profile from OUR backend.
                try {
                    const profile = await authenticatedFetch('/api/auth/session');
                    setCurrentUser(profile);
                } catch (error) {
                    console.error("Failed to fetch user session:", error);
                    // If we can't get their profile, something is wrong. Log them out.
                    await signOut(auth);
                    setCurrentUser(null);
                }
            } else {
                // User is not logged in or their email isn't verified.
                setCurrentUser(null);
            }
            setLoading(false); // We're done checking.
        });

        // Cleanup the listener when the app unmounts
        return unsubscribe;
    }, []);

    // The value provided to all child components
    const value = {
        currentUser,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {/* Don't render the app until we know the auth status */}
            {!loading && children}
        </AuthContext.Provider>
    );
};