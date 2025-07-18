import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input1 from '../../components/UI/Input1';
import Button1 from '../../components/UI/Button1';
import AuthHeader from '../../components/layout/AuthHeader';
import { Navigate } from 'react-router-dom';
import { signupWithEmail, loginWithEmail, loginWithGoogle } from '../../services/authService'; // Adjust path


const UserSignUp = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Clear specific error when user starts typing
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const validate = () => {
        let tempErrors = {};

        // Validate first name
        if (!formData.firstName.trim()) {
            tempErrors.firstName = 'First name is required';
        }

        // Validate last name
        if (!formData.lastName.trim()) {
            tempErrors.lastName = 'Last name is required';
        }

        // Validate email
        if (!formData.email) {
            tempErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            tempErrors.email = 'Email address is invalid';
        }

        // Validate phone number - basic validation
        if (!formData.phoneNumber) {
            tempErrors.phoneNumber = 'Phone number is required';
        } else if (!/^\d{10}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
            tempErrors.phoneNumber = 'Phone number is invalid';
        }

        // Validate password
        if (!formData.password) {
            tempErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            tempErrors.password = 'Password must be at least 8 characters';
        }

        // Validate confirm password
        if (!formData.confirmPassword) {
            tempErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            tempErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };



    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validate()) {
            setIsSubmitting(true);
            setErrors({}); // Clear previous errors
            try {
                // 1. Create the profileData object from your form's state
                const profileData = {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phoneNumber: formData.phoneNumber, // This will be sent to the backend
                };

                // 2. Call the updated signup service function with all the required data
                const user = await signupWithEmail(formData.email, formData.password, profileData);

                console.log('Form submitted successfully', user);
                alert(`Welcome, ${user.firstName}! Your account has been created.`);

                // 3. Redirect to the dashboard
                navigate('/dashboard');

            } catch (error) {
                console.error('Registration error:', error);
                // Display the error message from Firebase or your backend
                setErrors({
                    form: error.message || 'Registration failed. Please try again.'
                });
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    // ▼▼▼ REPLACE THIS FUNCTION ▼▼▼
    const handleGoogleSignup = async () => {
        setIsSubmitting(true);
        setErrors({});
        try {
            // Call the existing Google login service
            const user = await loginWithGoogle();
            console.log('Google sign-up successful', user);
            alert(`Welcome, ${user.firstName}!`);
            navigate('/dashboard');
        } catch (error) {
            console.error('Google registration error:', error);
            setErrors({
                form: error.message || 'Google sign-up failed. Please try again.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };



    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50  px-4 sm:px-6 lg:px-8 pt-20">
            <AuthHeader />
            <div className="max-w-md w-full mt-8 space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-2">Sign up</h1>
                    <p className="text-gray-600">
                        Create your account to get started
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md space-y-4">
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
                                error={errors.firstName}
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
                                error={errors.lastName}
                                className="rounded-md"
                            />
                        </div>

                        <Input1
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email address"
                            label="Email address"
                            required={true}
                            variant="outlined"
                            error={errors.email}
                            className="rounded-md"
                        />

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
                            error={errors.phoneNumber}
                            className="rounded-md"
                        />

                        <Input1
                            type="password"
                            name="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password"
                            label="Password"
                            required={true}
                            variant="outlined"
                            error={errors.password}
                            className="rounded-md"
                        />

                        <Input1
                            type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm password"
                            label="Confirm password"
                            required={true}
                            variant="outlined"
                            error={errors.confirmPassword}
                            className="rounded-md"
                        />
                    </div>

                    {errors.form && (
                        <div className="text-red-600 text-center">
                            {errors.form}
                        </div>
                    )}

                    <div>
                        <Button1
                            type="submit"
                            text={isSubmitting ? "Signing up..." : "Continue"}
                            className="w-full"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="flex items-center my-4">
                        <div className="flex-grow h-px bg-gray-300"></div>
                        <div className="mx-4 text-gray-500">or</div>
                        <div className="flex-grow h-px bg-gray-300"></div>
                    </div>

                    <div className="space-y-3">
                        <button
                            type="button"
                            onClick={handleGoogleSignup}
                            className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Continue with Google
                        </button>
                    </div>

                    <div className="text-center">
                        <button
                            type="button"
                            className="flex items-center justify-center w-full py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                            </svg>
                            Log in with QR code
                        </button>
                    </div>
                </form>

                <div className="text-sm text-center mt-4">
                    <p className="text-xs text-gray-500 mt-6">
                        By proceeding, you consent to receiving calls, WhatsApp or SMS/RCS messages, including by automated means, from Uber and its affiliates to the number provided.
                    </p>
                </div>

                <div className="text-center mt-4">
                    <p className="text-sm">
                        Already have an account?{" "}
                        <Link to="/user/login" className="font-medium text-black hover:text-gray-800">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UserSignUp;