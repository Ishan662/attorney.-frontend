// >> In your existing file: pages/UserOTP.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button1 from '../../components/UI/Button1';
import AuthHeader from '../../components/layout/AuthHeader';
// --- ▼▼▼ IMPORT THE CORRECT TWILIO SERVICE FUNCTIONS ▼▼▼ ---
import { sendTwilioOtp, verifyTwilioOtpAndActivate } from '../../services/authService';
import Input1 from '../../components/UI/Input1'; // Assuming this is your custom input

const UserOTP = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // State is simpler now. We just need the code itself.
    const [otp, setOtp] = useState(''); 
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    
    const phoneNumber = location.state?.phoneNumber;

    // --- ▼▼▼ LOGIC TO SEND THE SMS VIA YOUR BACKEND ▼▼▼ ---
    useEffect(() => {
        if (!phoneNumber) {
            navigate('/user/login');
            return;
        }

        // This function now calls your backend's /api/otp/send endpoint.
        const triggerSms = async () => {
            try {
                await sendTwilioOtp();
                // No result to store. The backend and Twilio handle everything.
            } catch (err) {
                console.error("Failed to send OTP:", err);
                setError('Failed to send verification code. Please try logging in again.');
            }
        };

        triggerSms();
    }, [phoneNumber, navigate]);
    // --- ▲▲▲ LOGIC TO SEND THE SMS VIA YOUR BACKEND ▲▲▲ ---


    // --- ▼▼▼ NEW SUBMIT HANDLER FOR TWILIO FLOW ▼▼▼ ---
    const handleSubmit = async (e) => {
        e.preventDefault(); // Use the event to prevent form submission
        
        if (otp.length !== 6) {
            setError('Please enter a valid 6-digit code.');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            // This function now calls your backend's /api/otp/verify endpoint.
            await verifyTwilioOtpAndActivate(otp);
            
            // Success! The user's account is now active on the backend.
            navigate('/dashboard');

        } catch (err) {
            console.error("OTP Verification Error:", err);
            setError('The code you entered is invalid or has expired.');
        } finally {
            setIsSubmitting(false);
        }
    };
    // --- ▲▲▲ NEW SUBMIT HANDLER FOR TWILIO FLOW ▲▲▲ ---


    // Your JSX remains very similar, just simplified.
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 px-4 pt-20">
            {/* NO reCAPTCHA div is needed anymore! This can be removed. */}

            <AuthHeader />
            <div className="flex-1 flex flex-col items-center justify-center ">
                <div className="w-full max-w-md mx-auto flex flex-col items-center rounded-xl shadow-md py-16 px-8 bg-white">
                    <h2 className="text-3xl font-bold mb-6 text-center">Verify Your Phone Number</h2>
                    
                    <p className="mb-8 text-center text-lg text-black">
                        Enter the 6-digit code sent via SMS to <span className="font-bold">{phoneNumber || 'your phone'}</span>
                    </p>
                    
                    {/* The form now calls our new handleSubmit */}
                    <form className="w-full flex flex-col items-center" onSubmit={handleSubmit}>
                        <div className="mb-8 flex flex-col items-center">
                            <label className="mb-2 font-semibold text-black text-base">Verification Code</label>
                            
                            {/* Using a single input is often a better UX than 6 separate ones */}
                            <Input1
                                type="tel"
                                name="otp"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="123456"
                                required={true}
                                maxLength="6"
                                error={error ? " " : ""} // Pass a non-empty string to trigger error style
                                className="w-48 h-12 text-2xl text-center tracking-[.5em]"
                                inputMode="numeric"
                            />
                            
                            <button type="button" className="mt-2 text-xs text-blue-500 hover:underline" onClick={() => sendTwilioOtp()}>
                                Didn't receive a code? Resend
                            </button>
                        </div>
                        
                        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

                        <div className="flex justify-center w-full mt-10">
                            <Button1
                                type="submit" // The button should be type="submit" for the form
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