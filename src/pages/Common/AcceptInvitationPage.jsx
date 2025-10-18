import React, { useState, useEffect } from 'react';
// import { useSearchParams, useNavigate } from 'react-router-dom';
import { useParams, useNavigate } from 'react-router-dom';
import Input1 from '../../components/UI/Input1';
import Button1 from '../../components/UI/Button1';
import AuthHeader from '../../components/layout/AuthHeader';
import { finalizeInvitation, getInvitationDetails } from '../../services/invitationService';
import { getFullSession, waitForAuthUser, logout, loginWithEmail } from '../../services/authService';
import Swal from 'sweetalert2';

const AcceptInvitationPage = () => {
    const navigate = useNavigate();
     const { token: invitationToken } = useParams();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '', // Add phoneNumber to initial state
    });

    // State for the email, which is fetched from the backend and is not editable
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    
    // State for handling errors
    const [pageError, setPageError] = useState(''); // For critical errors loading the page
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        // This effect runs once when the component loads to fetch the invitation details.
        if (!invitationToken) {
            navigate('/login', { state: { error: 'Invalid invitation link.' } });
            return;
        }

        const fetchInvitationDetails = async () => {
            try {
                // Call the service function to get the details from the backend
                const details = await getInvitationDetails(invitationToken);
                setEmail(details.email);
                setPhoneNumber(details.phoneNumber || ''); // Set phone number if available
                
                // Pre-fill the name fields from the details fetched
                const nameParts = details.fullName ? details.fullName.trim().split(/\s+/) : ["", ""];
                console.log("Fetched invitation details:", details);
                setFormData(prev => ({
                    ...prev,
                    firstName: nameParts[0] || '',
                    lastName: nameParts.slice(1).join(' ') || '',
                    phoneNumber: details.phoneNumber || '' // Add phone number to formData
                }));
            } catch (error) {
                console.error("Failed to fetch invitation details:", error);
                setPageError(error.message || "This invitation link is invalid, has been used, or has expired.");
            }
        };

        fetchInvitationDetails();
    }, [invitationToken, navigate]);

    const validate = () => {
        const errors = {};
        
        // Validate first name
        if (!formData.firstName.trim()) {
            errors.firstName = 'First name is required';
        }
        
        // Validate last name
        if (!formData.lastName.trim()) {
            errors.lastName = 'Last name is required';
        }
        
        // Validate phone number - basic validation
        if (!formData.phoneNumber) {
            errors.phoneNumber = 'Phone number is required';
        } else if (!/^\d{10}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
            errors.phoneNumber = 'Phone number is invalid';
        }
        
        // Validate password
        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            errors.password = 'Password must be at least 8 characters';
        }
        
        // Validate confirm password
        if (!formData.confirmPassword) {
            errors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Clear specific error when user starts typing
        if (formErrors[name]) {
            setFormErrors({
                ...formErrors,
                [name]: ''
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate() && email) { // Also ensure email was fetched successfully
            setIsSubmitting(true);
            setFormErrors({});
            try {
                // Call the finalization function with all the necessary data
                await finalizeInvitation(
                    email, // The email fetched from the backend (not from the form)
                    formData.password,
                    invitationToken,
                    { firstName: formData.firstName, lastName: formData.lastName }
                );

                await loginWithEmail(email, formData.password);
                const userProfile = await getFullSession();

                if (userProfile.status === "PENDING_PHONE_VERIFICATION") {
                    navigate('/user/otp', { state: { phoneNumber: userProfile.phoneNumber } });
                    return;
                }
                
                // Show success alert with SweetAlert2
                await Swal.fire({
                    title: 'Account Created Successfully!',
                    text: 'Welcome to the team! Your account has been activated and you are now logged in.',
                    confirmButtonText: 'Continue',
                    confirmButtonColor: '#000000',
                    background: '#ffffff',
                    width: '500px',
                    customClass: {
                        popup: 'rounded-lg',
                        title: 'text-gray-800 text-xl',
                        content: 'text-gray-600 text-xs'
                    }
                });
                
                // Navigate to OTP page with phone number
                navigate('/user/otp', { state: { phoneNumber: formData.phoneNumber } });

            } catch (error) {
                console.error("Invitation finalization error:", error);
                setFormErrors({ form: error.message || 'Failed to activate account. Please try again.' });
                
                // Show error alert with SweetAlert2
                await Swal.fire({
                    title: 'Account Creation Failed',
                    text: error.message || 'Failed to activate account. Please try again.',
                    confirmButtonText: 'Try Again',
                    confirmButtonColor: '#000000',
                    background: '#ffffff',
                    width: '500px',
                    customClass: {
                        popup: 'rounded-lg',
                        title: 'text-gray-800 text-xl',
                        content: 'text-gray-600 text-xs'
                    }
                });
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    // If there was a critical error fetching the invitation details, show an error page.
    if (pageError) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Invitation Error</h1>
                <p className="text-gray-700">{pageError}</p>
            </div>
        );
    }
    
    // Don't render the form until the email has been fetched to avoid confusion.
    if (!email) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Verifying invitation...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8 pt-20 pb-10">
            <AuthHeader />
            <div className="max-w-md w-full mt-8 space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-2">Accept Your Invitation</h1>
                    <p className="text-gray-600">
                        Create your account to join the team
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md space-y-4">
                        {/* Email field - pre-filled and disabled */}
                        <Input1
                            type="email"
                            name="email"
                            id="email"
                            value={email}
                            placeholder="Email address"
                            label="Email address"
                            disabled={true}
                            variant="outlined"
                            className="rounded-md bg-gray-100"
                        />

                        {/* Name fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <Input1
                                type="text"
                                name="firstName"
                                id="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="First name"
                                label="First name"
                                required={true}
                                variant="outlined"
                                error={formErrors.firstName}
                                className="rounded-md"
                            />
                            <Input1
                                type="text"
                                name="lastName"
                                id="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Last name"
                                label="Last name"
                                required={true}
                                variant="outlined"
                                error={formErrors.lastName}
                                className="rounded-md"
                            />
                        </div>

                        {/* Phone number field */}
                        <Input1
                            type="tel"
                            name="phoneNumber"
                            id="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            placeholder="Phone number"
                            label="Phone number"
                            required={true}
                            variant="outlined"
                            error={formErrors.phoneNumber}
                            className="rounded-md"
                        />

                        {/* Password fields with toggle visibility */}
                        <div className="relative">
                            <Input1
                                type={showPassword ? "text" : "password"}
                                name="password"
                                id="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Create password"
                                label="Create password"
                                required={true}
                                variant="outlined"
                                error={formErrors.password}
                                className="rounded-md"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? (
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                    </svg>
                                ) : (
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>

                        <div className="relative">
                            <Input1
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                id="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm password"
                                label="Confirm password"
                                required={true}
                                variant="outlined"
                                error={formErrors.confirmPassword}
                                className="rounded-md"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showConfirmPassword ? (
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                    </svg>
                                ) : (
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {formErrors.form && (
                        <div className="text-red-600 text-center">
                            {formErrors.form}
                        </div>
                    )}

                    <div>
                        <Button1
                            type="submit"
                            text={isSubmitting ? "Creating Account..." : "Create Account & Join"}
                            className="w-full"
                            disabled={isSubmitting}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AcceptInvitationPage;