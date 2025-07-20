// >> In your existing file: pages/UserOTP.jsx

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Import the new auth hook

// Import the specific Twilio service functions
import { sendTwilioOtp, verifyTwilioOtpAndActivate } from '../../services/authService';

// Import your UI components
import Button1 from '../../components/UI/Button1';
import AuthHeader from '../../components/layout/AuthHeader';
import Input1 from '../../components/UI/Input1';

const UserOTP = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser } = useAuth(); // Get the currently logged-in user from context

    const [otp, setOtp] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Get the phone number passed from the login page's navigation state
    const phoneNumber = location.state?.phoneNumber;

    // This function handles sending the initial SMS and the "Resend" functionality
    const handleSendOtp = async () => {
        setError(''); // Clear previous errors
        try {
            await sendTwilioOtp();
            // Optionally, you can show a success message to the user
            // alert('A new verification code has been sent.');
        } catch (err) {
            console.error("Failed to send OTP:", err);
            setError('Failed to send verification code. Please try again later.');
        }
    };

    // This useEffect hook triggers the very first OTP send when the page loads
    useEffect(() => {
        // If we land on this page without a phone number or a logged-in user, something is wrong.
        // Redirect back to login to be safe.
        if (!phoneNumber || !currentUser) {
            navigate('/user/login');
            return;
        }

        handleSendOtp(); // Send the initial OTP
    }, []); // The empty dependency array ensures this runs only once on mount

    // This function handles the final verification and activation
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (otp.length !== 6) {
            setError('Please enter a valid 6-digit code.');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            // This function calls our backend to verify the code with Twilio
            // and activate the user's account.
            await verifyTwilioOtpAndActivate(otp);
            
            // Success! The user is now fully active.
            // The AuthProvider will automatically pick up the new "ACTIVE" status on the next
            // session check or page reload. For an immediate effect, we just navigate.
            const rolePaths = {
                LAWYER: '/lawyer/dashboard',
                JUNIOR: '/junior/cases',
                CLIENT: '/client/caseprofiles',
                ADMIN: '/admin/systemsettings',
                RESEARCHER: '/researcher/chatbot',
            };

            const path = rolePaths[currentUser.role] || '/';
            navigate(path);

        } catch (err) {
            console.error("OTP Verification Error:", err);
            setError('The code you entered is invalid or has expired.');
        } finally {
            setIsSubmitting(false);
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
                                error={error ? " " : ""}
                                className="w-48 h-12 text-2xl text-center tracking-[.5em]"
                                inputMode="numeric"
                            />
                            
                            <button type="button" className="mt-2 text-xs text-blue-500 hover:underline" onClick={handleSendOtp}>
                                Didn't receive a code? Resend
                            </button>
                        </div>
                        
                        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

                        <div className="flex justify-center w-full mt-10">
                            <Button1
                                type="submit"
                                text={isSubmitting ? "Verifying..." : "Verify & Continue"}
                                className="w-full max-w-xs h-12 flex items-center justify-center text-base"
                                disabled={isSubmitting}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserOTP;