import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { validatePhoneNumber } from '../../services/authService';

// Import your UI components
import Button1 from '../../components/UI/Button1';
import AuthHeader from '../../components/layout/AuthHeader';
import Input1 from '../../components/UI/Input1';

const UserOTP = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser } = useAuth();

    const [otp, setOtp] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isChecking, setIsChecking] = useState(false);

    // Get the phone number passed from the login page's navigation state
    const phoneNumber = location.state?.phoneNumber;

    // Navigate user by role helper function
    const navigateUserByRole = (user) => {
        const rolePaths = {
            LAWYER: '/lawyer/dashboard',
            JUNIOR: '/junior/cases',
            CLIENT: '/client/caseprofiles',
            ADMIN: '/admin/dashboard',
            RESEARCHER: '/researcher/chatbot',
        };

        const path = rolePaths[user.role] || '/';
        navigate(path);
    };

    // Phone number validation function that calls the backend
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (otp.length !== 6) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Call the backend to validate phone number and activate user
            const activatedUser = await validatePhoneNumber(phoneNumber);
            
            // Show checking state for a brief moment
            setIsSubmitting(false);
            setIsChecking(true);
            
            // Wait for 1.5 seconds before navigating
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log("Activated user:", activatedUser);
            
            // Navigate based on the activated user's role
            navigateUserByRole(activatedUser);

        } catch (err) {
            console.error("Phone validation error:", err);
            // On error, still navigate based on current user or default
            if (currentUser) {
                navigateUserByRole(currentUser);
            } else {
                navigate('/lawyer/dashboard'); // Default fallback
            }
        } finally {
            setIsSubmitting(false);
            setIsChecking(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 px-4 pt-20">
            <AuthHeader />
            <div className="flex-1 flex flex-col items-center justify-center ">
                <div className="w-full max-w-md mx-auto flex flex-col items-center rounded-xl shadow-md py-16 px-8 bg-white">
                    <h2 className="text-3xl font-bold mb-6 text-center">Verify Your Phone Number</h2>
                    
                    <p className="mb-8 text-center text-lg text-black">
                        Enter the 6-digit code sent via SMS to <span className="font-bold">{phoneNumber || 'your phone'}</span>
                    </p>
                    
                    <form className="w-full flex flex-col items-center" onSubmit={handleSubmit}>
                        <div className="mb-8 flex flex-col items-center">
                            <label className="mb-2 font-semibold text-black text-base">Verification Code</label>
                            
                            <Input1
                                type="tel"
                                name="otp"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="123456"
                                required={true}
                                maxLength="6"
                                className="w-48 h-12 text-2xl text-center tracking-[.5em]"
                                inputMode="numeric"
                            />
                        </div>
                        
                        <div className="flex justify-center w-full mt-10">
                            <Button1
                                type="submit"
                                text={isChecking ? "Checking..." : (isSubmitting ? "Verifying..." : "Verify & Continue")}
                                className="w-full max-w-xs h-12 flex items-center justify-center text-base"
                                disabled={isSubmitting || isChecking}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserOTP;