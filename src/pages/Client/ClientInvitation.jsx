import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button1 from '../../components/UI/Button1';
import Button2 from '../../components/UI/Button2';
import Input1 from '../../components/UI/Input1';
import logo from '../../assets/images/black_logo.png';

const ClientInvitation = () => {
    const navigate = useNavigate();
    const { inviteToken } = useParams();
    
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [inviteData, setInviteData] = useState(null);
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        inviteCode: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false
    });
    const [formErrors, setFormErrors] = useState({});

    // Simulate fetching invitation data
    useEffect(() => {
        const fetchInviteData = async () => {
            try {
                setIsLoading(true);
                
                // Simulate API call with timeout
                setTimeout(() => {
                    // Mock response
                    const mockResponse = {
                        success: true,
                        data: {
                            caseId: 'CASE-2025-0721',
                            caseName: 'Smith vs. Johnson Property Dispute',
                            invitedBy: 'James Wilson',
                            inviterRole: 'Senior Lawyer',
                            inviterEmail: 'james.wilson@legalpractice.com',
                            userType: 'client', // or 'junior_lawyer'
                            userEmail: 'client@example.com',
                            inviteCode: 'INV-8572',
                            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
                        }
                    };

                    if (mockResponse.success) {
                        setInviteData(mockResponse.data);
                        setFormData(prev => ({
                            ...prev,
                            email: mockResponse.data.userEmail,
                            inviteCode: mockResponse.data.inviteCode
                        }));
                        setIsLoading(false);
                    } else {
                        setError('Invalid or expired invitation link');
                        setIsLoading(false);
                    }
                }, 1000);
            } catch (error) {
                setError('An error occurred while fetching invitation details');
                setIsLoading(false);
            }
        };

        if (inviteToken) {
            fetchInviteData();
        } else {
            setError('Invalid invitation link');
            setIsLoading(false);
        }
    }, [inviteToken]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });

        // Clear error when user corrects input
        if (formErrors[name]) {
            setFormErrors({
                ...formErrors,
                [name]: ''
            });
        }
    };

    const validateForm = () => {
        const errors = {};
        const phoneRegex = /^\+?[0-9]{10,15}$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

        if (!formData.phone) {
            errors.phone = 'Phone number is required';
        } else if (!phoneRegex.test(formData.phone)) {
            errors.phone = 'Please enter a valid phone number';
        }

        if (!formData.inviteCode) {
            errors.inviteCode = 'Invitation code is required';
        } else if (formData.inviteCode !== inviteData?.inviteCode) {
            errors.inviteCode = 'Invalid invitation code';
        }

        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (!passwordRegex.test(formData.password)) {
            errors.password = 'Password must be at least 8 characters with uppercase, lowercase, and numbers';
        }

        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        if (!formData.agreeToTerms) {
            errors.agreeToTerms = 'You must agree to the terms and conditions';
        }

        return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const errors = validateForm();
        
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setIsLoading(true);
        
        // Simulate API call with timeout
        setTimeout(() => {
            // Mock successful signup
            toast.success("Account created successfully! You're now part of the case.");
            setIsLoading(false);
            
            // Redirect to appropriate dashboard
            const redirectPath = inviteData.userType === 'client' 
                ? '/client/dashboard' 
                : '/junior/dashboard';
            
            navigate(redirectPath);
        }, 1500);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading invitation details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
                    <div className="text-center">
                        <img src={logo} alt="Attorney Management System" className="h-16 mx-auto mb-6" />
                        <h1 className="text-2xl font-bold text-red-600 mb-2">Invitation Error</h1>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <Button2 
                            text="Go to Homepage" 
                            onClick={() => navigate('/')} 
                            className="w-full"
                        />
                    </div>
                </div>
            </div>
        );
    }

    const userTypeLabel = inviteData.userType === 'client' ? 'Client' : 'Junior Lawyer';

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
                {/* Logo and Header */}
                <div className="text-center mb-8">
                    <img src={logo} alt="Attorney Management System" className="h-16 mx-auto" />
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        {userTypeLabel} Invitation
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Complete your account setup to join the case
                    </p>
                </div>

                {/* Invitation Card */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                    <div className="bg-blue-600 p-4 text-white">
                        <h3 className="font-bold text-lg">You've Been Invited!</h3>
                    </div>
                    <div className="p-6">
                        <div className="mb-6">
                            <p className="text-sm text-gray-600">Case Reference</p>
                            <p className="font-medium">{inviteData.caseId}</p>
                        </div>
                        <div className="mb-6">
                            <p className="text-sm text-gray-600">Case Name</p>
                            <p className="font-medium">{inviteData.caseName}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <p className="text-sm text-gray-600">Invited As</p>
                                <p className="font-medium">{userTypeLabel}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Expires On</p>
                                <p className="font-medium">{new Date(inviteData.expiresAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="mb-4">
                            <p className="text-sm text-gray-600">Invited By</p>
                            <p className="font-medium">{inviteData.invitedBy}</p>
                            <p className="text-sm text-gray-500">{inviteData.inviterRole} • {inviteData.inviterEmail}</p>
                        </div>
                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-yellow-800">
                                        Use the invitation code <span className="font-bold">{inviteData.inviteCode}</span> to complete your registration.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Registration Form */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Complete Your Account Setup</h3>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <Input1
                                    id="email"
                                    name="email"
                                    type="email"
                                    variant="outlined"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    disabled={true}
                                    className="w-full"
                                />
                                <p className="mt-1 text-xs text-gray-500">This email was provided by the inviter and cannot be changed</p>
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone Number
                                </label>
                                <Input1
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    variant="outlined"
                                    placeholder="Enter your phone number"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                                {formErrors.phone && (
                                    <p className="mt-1 text-xs text-red-600">{formErrors.phone}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="inviteCode" className="block text-sm font-medium text-gray-700 mb-1">
                                    Invitation Code
                                </label>
                                <Input1
                                    id="inviteCode"
                                    name="inviteCode"
                                    type="text"
                                    variant="outlined"
                                    placeholder="Enter invitation code"
                                    value={formData.inviteCode}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                                {formErrors.inviteCode && (
                                    <p className="mt-1 text-xs text-red-600">{formErrors.inviteCode}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Create Password
                                </label>
                                <Input1
                                    id="password"
                                    name="password"
                                    type="password"
                                    variant="outlined"
                                    placeholder="Create a secure password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                                {formErrors.password && (
                                    <p className="mt-1 text-xs text-red-600">{formErrors.password}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirm Password
                                </label>
                                <Input1
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    variant="outlined"
                                    placeholder="Confirm your password"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                                {formErrors.confirmPassword && (
                                    <p className="mt-1 text-xs text-red-600">{formErrors.confirmPassword}</p>
                                )}
                            </div>

                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input
                                        id="agreeToTerms"
                                        name="agreeToTerms"
                                        type="checkbox"
                                        checked={formData.agreeToTerms}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="agreeToTerms" className="font-medium text-gray-700">
                                        I agree to the{' '}
                                        <a href="/terms" className="text-blue-600 hover:text-blue-500">
                                            Terms of Service
                                        </a>{' '}
                                        and{' '}
                                        <a href="/privacy" className="text-blue-600 hover:text-blue-500">
                                            Privacy Policy
                                        </a>
                                    </label>
                                    {formErrors.agreeToTerms && (
                                        <p className="mt-1 text-xs text-red-600">{formErrors.agreeToTerms}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <Button1
                                    type="submit"
                                    text={isLoading ? 'Creating Account...' : 'Accept Invitation & Create Account'}
                                    disabled={isLoading}
                                    className="w-full"
                                />
                            </div>
                        </form>

                        <div className="mt-6">
                            <p className="text-center text-sm text-gray-600">
                                Already have an account?{' '}
                                <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                                    Sign in
                                </a>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Help Section */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600">
                        Having trouble with your invitation?{' '}
                        <a href="/contact" className="font-medium text-blue-600 hover:text-blue-500">
                            Contact support
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ClientInvitation;