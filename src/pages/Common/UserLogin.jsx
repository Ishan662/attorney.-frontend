import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input1 from '../../components/UI/Input1';
import Button1 from '../../components/UI/Button1';
import AuthHeader from '../../components/layout/AuthHeader';
import { loginWithEmail, loginWithGoogle, getFullSession } from '../../services/authService';
import { useAuth } from '../../context/AuthContext'; 

const UserLogin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { currentUser } = useAuth();
    const navigateUserByRole = (currentUser) => {
        // if (!currentUser || !currentUser.role) {
        //     throw new Error("Login succeeded but user profile is incomplete.");
        // }

        if (currentUser.status === "PENDING_PHONE_VERIFICATION") {
            navigate('/user/otp', { state: { phoneNumber: currentUser.phoneNumber } });
            return;
        }

        const rolePaths = {
            LAWYER: '/lawyer/dashboard',
            JUNIOR: '/junior/cases',
            CLIENT: '/client/caseprofiles',
            ADMIN: '/admin/systemsettings',
            RESEARCHER: '/researcher/chatbot',
        };

        const path = rolePaths[currentUser.role] || '/';
        navigate(path);
    };


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

        // Validate email
        if (!formData.email) {
            tempErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            tempErrors.email = 'Email address is invalid';
        }

        // Validate password
        if (!formData.password) {
            tempErrors.password = 'Password is required';
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
                
                await loginWithEmail(formData.email, formData.password);
                const userProfile = await getFullSession();
                navigateUserByRole(userProfile);

            } catch (error) {
                setErrors({ form: error.message });
            } finally {
                setIsSubmitting(false);
            }
        }
    };


    // The handleGoogleLogin function does not need to change.
    const handleGoogleLogin = async () => {
        setIsSubmitting(true);
        setErrors({});
        try {
            // It calls the exact same function. The backend handles the difference.
            const userDto = await loginWithGoogle(); 
            alert(`Welcome back, ${userDto.fullName}!`);
            navigate('lawyer/dashboard');
        } catch (error) {
            console.error('Google login error:', error);
            setErrors({ form: error.message || 'Google login failed.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAppleLogin = () => {
        // Implement Apple login
        // console.log('Apple login clicked');
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8 pt-20">
            <AuthHeader />
            <div className="max-w-md w-full mt-8 space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-2">Log in</h1>
                    <p className="text-gray-600">
                        Welcome back
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md space-y-4">
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
                    </div>

                    <div className="flex items-center justify-between">

                        <div className="text-sm">
                            <Link to="/forgot-password" className="font-medium text-black hover:text-gray-800">
                                Forgot your password?
                            </Link>
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
                            text={isSubmitting ? "Logging in..." : "Continue"}
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
                            onClick={handleGoogleLogin}
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

                        <button
                            type="button"
                            onClick={handleAppleLogin}
                            className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.44-1.07-.46-2.07-.48-3.24 0-1.45.62-2.21.44-3.1-.44C2.18 15.89 2.85 7.03 8.68 6.56c1.84-.05 2.88.82 3.73.82.87 0 2.37-1.03 3.96-.87 3 .15 5.27 3.67 5.23 3.71-.14.12-2.46 1.44-2.43 4.31.03 3.37 2.96 4.55 2.98 4.57-.03.07-.44 1.55-1.46 3.02-.87 1.28-1.83 2.38-3.64 2.17zm-3.59-17.1c-1.97 0-3.57 1.42-3.34 3.09 1.43 0 2.74-1.38 3.34-3.09z" />
                            </svg>
                            Continue with Apple
                        </button>
                    </div>

                    <div className="flex items-center my-4">
                        <div className="flex-grow h-px bg-gray-300"></div>
                        <div className="mx-4 text-gray-500">or</div>
                        <div className="flex-grow h-px bg-gray-300"></div>
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

                <div className="text-center mt-4">
                    <p className="text-sm">
                        Don't have an account?{" "}
                        <Link to="/user/signup" className="font-medium text-black hover:text-gray-800">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UserLogin;