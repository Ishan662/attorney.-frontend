import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input1 from '../../components/UI/Input1';
import Button1 from '../../components/UI/Button1';
import AuthHeader from '../../components/layout/AuthHeader';
import { Navigate } from 'react-router-dom';
import { signupNewLawyer, signupNewResearcher, loginWithGoogle } from '../../services/authService'; // Adjust path


const UserSignUp = () => {
    const navigate = useNavigate();
    const [userType, setUserType] = useState('lawyer'); // 'lawyer' or 'researcher'
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
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    const handleUserTypeChange = (type) => {
        setUserType(type);
        // Clear any form errors when switching
        setErrors({});
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
            setErrors({});
            try {
                const profileData = {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phoneNumber: `+94${formData.phoneNumber.slice(-9)}`,
                };

                // Add user type specific data
                if (userType === 'lawyer') {
                    await signupNewLawyer(formData.email, formData.password, profileData);
                } else {
                    await signupNewResearcher(formData.email, formData.password, profileData);
                }

                alert(`${userType === 'lawyer' ? 'Lawyer' : 'Researcher'} account created! A verification link has been sent to your email. Please verify your email, then log in to continue.`);
                navigate('/user/login');

            } catch (error) {
                console.error('Registration error:', error);
                setErrors({ form: error.message || 'Registration failed. Please try again.' });
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    // >> In UserSignUp.jsx
    const handleGoogleSignup = async () => {
        setIsSubmitting(true);
        setErrors({});
        try {
            const userDto = await loginWithGoogle(); 
            alert(`Welcome, ${userDto.fullName}!`);
            navigate('/dashboard');
        } catch (error) {
            console.error('Google registration error:', error);
            setErrors({ form: error.message || 'Google sign-up failed.' });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50  px-4 sm:px-6 lg:px-8 pt-20 pb-10">
            <AuthHeader />
            <div className="max-w-md w-full mt-8 space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-2">Sign up</h1>
                    <p className="text-gray-600">
                        Create your account to get started
                    </p>
                </div>

                {/* User Type Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                        type="button"
                        onClick={() => handleUserTypeChange('lawyer')}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                            userType === 'lawyer'
                                ? 'bg-white text-black shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Lawyer
                    </button>
                    <button
                        type="button"
                        onClick={() => handleUserTypeChange('researcher')}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                            userType === 'researcher'
                                ? 'bg-white text-black shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Researcher
                    </button>
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

                        <div className="relative">
                            <Input1
                                type={showPassword ? "text" : "password"}
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
                                error={errors.confirmPassword}
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

                    {errors.form && (
                        <div className="text-red-600 text-center">
                            {errors.form}
                        </div>
                    )}

                    <div>
                        <Button1
                            type="submit"
                            text={isSubmitting ? `Signing up as ${userType}...` : `Sign up as ${userType === 'lawyer' ? 'Lawyer' : 'Researcher'}`}
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