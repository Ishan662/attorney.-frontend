import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button1 from '../../components/UI/Button1';
import Button2 from '../../components/UI/Button2';
import Input1 from '../../components/UI/Input1';
import logo from '../../assets/images/black_logo.png';
import AuthHeader from '../../components/layout/AuthHeader';

const ClientInvitation = () => {
    const navigate = useNavigate();
    const { inviteToken } = useParams();
    const location = useLocation();
    const isPreview = location.search.includes('preview=true');
    
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
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

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
                            userType: isPreview && location.search.includes('type=junior') ? 'junior_lawyer' : 'client',
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

        // Always load mock data for preview mode, otherwise require token
        if (isPreview || inviteToken) {
            fetchInviteData();
        } else {
            setError('Invalid invitation link');
            setIsLoading(false);
        }
    }, [inviteToken, isPreview, location.search]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });

        // Clear error when user corrects input
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const validate = () => {
        const tempErrors = {};
        const phoneRegex = /^\+?[0-9]{10,15}$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

        if (!formData.phone) {
            tempErrors.phone = 'Phone number is required';
        } else if (!phoneRegex.test(formData.phone)) {
            tempErrors.phone = 'Please enter a valid phone number';
        }

        if (!formData.inviteCode) {
            tempErrors.inviteCode = 'Invitation code is required';
        } else if (formData.inviteCode !== inviteData?.inviteCode && !isPreview) {
            tempErrors.inviteCode = 'Invalid invitation code';
        }

        if (!formData.password) {
            tempErrors.password = 'Password is required';
        } else if (!passwordRegex.test(formData.password)) {
            tempErrors.password = 'Password must be at least 8 characters with uppercase, lowercase, and numbers';
        }

        if (formData.password !== formData.confirmPassword) {
            tempErrors.confirmPassword = 'Passwords do not match';
        }

        if (!formData.agreeToTerms) {
            tempErrors.agreeToTerms = 'You must agree to the terms and conditions';
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (validate()) {
            setIsSubmitting(true);
            
            // Simulate API call with timeout
            setTimeout(() => {
                // Mock successful signup
                toast.success("Account created successfully! You're now part of the case.");
                setIsSubmitting(false);
                
                // Redirect to appropriate dashboard
                const redirectPath = inviteData.userType === 'client' 
                    ? '/client/dashboard' 
                    : '/junior/dashboard';
                
                navigate(redirectPath);
            }, 1500);
        }
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

    if (error && !isPreview) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
                    <div className="text-center">
                        <img src={logo} alt="Attorney Management System" className="h-16 mx-auto mb-6" />
                        <h1 className="text-2xl font-bold text-red-600 mb-2">Invitation Error</h1>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <div className="space-y-3">
                            <Button2 
                                text="Go to Homepage" 
                                onClick={() => navigate('/')} 
                                className="w-full"
                            />
                            <Button2
                                text="View Demo Page" 
                                onClick={() => navigate('/invitation/demo?preview=true')} 
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const userTypeLabel = inviteData?.userType === 'client' ? 'Client' : 'Junior Lawyer';

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8 pt-10">
            <AuthHeader />
            
            <div className="max-w-md w-full mt-8 space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-2">{userTypeLabel} Invitation</h1>
                    <p className="text-gray-600">
                        Complete your account setup to join the case
                    </p>
                </div>

                {/* Case Information Card */}
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                    <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">Case Information</h2>
                            <p className="text-sm text-gray-500">{inviteData?.caseName}</p>
                        </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4 mt-4">
                        <div className="grid grid-cols-2 gap-4 mb-2">
                            <div>
                                <p className="text-xs text-gray-500">Case ID</p>
                                <p className="font-medium">{inviteData?.caseId}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Invited By</p>
                                <p className="font-medium">{inviteData?.invitedBy}</p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-gray-500">Invitation Code</p>
                                <p className="font-medium text-blue-600">{inviteData?.inviteCode}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Expires On</p>
                                <p className="font-medium">
                                    {inviteData?.expiresAt ? new Date(inviteData.expiresAt).toLocaleDateString() : '-'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                        
                        <div className="space-y-4">
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
                                disabled={true}
                                error={errors.email}
                                className="w-full"
                                helpText="This email was provided by the inviter and cannot be changed"
                            />

                            <Input1
                                type="tel"
                                name="phone"
                                id="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Phone number"
                                label="Phone number"
                                required={true}
                                variant="outlined"
                                error={errors.phone}
                                className="w-full"
                            />

                            <Input1
                                type="text"
                                name="inviteCode"
                                id="inviteCode"
                                value={formData.inviteCode}
                                onChange={handleChange}
                                placeholder="Invitation code"
                                label="Invitation code"
                                required={true}
                                variant="outlined"
                                error={errors.inviteCode}
                                className="w-full"
                                helpText="Use the code sent to you or shown above"
                            />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold mb-4">Create Password</h3>
                        
                        <div className="space-y-4">
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
                                className="w-full"
                                helpText="Must be at least 8 characters with uppercase, lowercase, and numbers"
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
                                className="w-full"
                            />

                            <div className="flex items-start mt-4">
                                <div className="flex items-center h-5">
                                    <input
                                        id="agreeToTerms"
                                        name="agreeToTerms"
                                        type="checkbox"
                                        checked={formData.agreeToTerms}
                                        onChange={handleChange}
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
                                    {errors.agreeToTerms && (
                                        <p className="mt-1 text-xs text-red-600">{errors.agreeToTerms}</p>
                                    )}
                                </div>
                            </div>
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
                            text={isSubmitting ? "Creating Account..." : "Accept Invitation & Join Case"}
                            className="w-full py-3"
                            disabled={isSubmitting}
                        />
                    </div>
                </form>

                <div className="text-center">
                    <p className="text-sm">
                        Already have an account?{" "}
                        <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                            Sign in
                        </a>
                    </p>
                </div>

                <div className="text-center">
                    <p className="text-xs text-gray-500">
                        By proceeding, you consent to join this case and allow communication related to this matter through the Attorney Management System.
                    </p>
                </div>
                
                {isPreview && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-center">
                        <p className="text-sm text-yellow-800">
                            <strong>Preview Mode:</strong> This is a demonstration of the invitation page.
                            <br />
                            <a href="/invitation/demo?preview=true&type=junior" className="text-blue-600 hover:underline">
                                View as Junior Lawyer
                            </a> | 
                            <a href="/invitation/demo?preview=true" className="text-blue-600 hover:underline ml-2">
                                View as Client
                            </a>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientInvitation;