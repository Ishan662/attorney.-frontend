// >> In a NEW file: src/components/layout/ProtectedRoute.jsx

import React from 'react';
import { useAuth } from '../../context/AuthContext'; // Import our auth hook
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { currentUser } = useAuth();
    const location = useLocation();

    // 1. Check if a user is logged in at all.
    if (!currentUser) {
        // If not, redirect them to the login page.
        // `state={{ from: location }}` is a nice UX touch to redirect them back after login.
        return <Navigate to="/user/login" state={{ from: location }} replace />;
    }

    // 2. The user IS logged in. Now, check their application status.
    // This is the crucial logic you were asking about.
    if (currentUser.status === 'PENDING_PHONE_VERIFICATION') {
        // If their status is pending, they cannot access the dashboard.
        // We MUST redirect them to the OTP page.
        
        // We also check to make sure we're not already on the OTP page to avoid an infinite loop.
        if (location.pathname !== '/user/otp') {
            return <Navigate to="/user/otp" state={{ phoneNumber: currentUser.phoneNumber }} replace />;
        }
    }

    if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // The user is logged in and active, but their role is not permitted for this route.
    // Send them to a generic "Unauthorized" or "Not Found" page.
        return <Navigate to="/unauthorized" replace />;
    }
    
    // 3. The user IS logged in AND their status is ACTIVE.
    // They are fully authorized. Render the requested child component (e.g., the Dashboard).
    return children;
};

export default ProtectedRoute;