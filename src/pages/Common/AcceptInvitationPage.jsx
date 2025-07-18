import React, { useState, useEffect } from 'react';
// import { useSearchParams, useNavigate } from 'react-router-dom';
import { useParams, useNavigate } from 'react-router-dom';
import Input1 from '../../components/UI/Input1';
import Button1 from '../../components/UI/Button1';
import AuthHeader from '../../components/layout/AuthHeader';
// --- THIS IS THE CORRECTED IMPORT ---
// We now import from the dedicated invitationService.
import { finalizeInvitation, getInvitationDetails } from '../../services/invitationService';
import { getFullSession, waitForAuthUser, logout } from '../../services/authService';

const AcceptInvitationPage = () => {
    const navigate = useNavigate();
     const { token: invitationToken } = useParams();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        password: '',
        confirmPassword: '',
    });

    // State for the email, which is fetched from the backend and is not editable
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    
    // State for handling errors
    const [pageError, setPageError] = useState(''); // For critical errors loading the page
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

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
                    lastName: nameParts.slice(1).join(' ') || ''

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
        if (!formData.firstName.trim()) errors.firstName = 'First name is required';
        if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            errors.password = 'Password must be at least 8 characters';
        }
        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
                
                    // await waitForAuthUser();

                    // const user = await getFullSession();

                    // if (user.role === 'CLIENT') {
                    //     navigate('/client/caseprofiles');
                    // } else if (user.role === 'JUNIOR') {
                    //     navigate('/junior/cases');
                    // } else if (user.role === 'LAWYER') {
                    //     navigate('/lawyer/dashboard');
                    // } else if (user.role === 'ADMIN') {
                    //     navigate('/admin/systemsettings');
                    // } else if (user.role === 'RESEARCHER') {
                    //     navigate('/researcher/chatbot');
                    // } else {
                    //     navigate('/dashboard');
                    // }

                    logout()

            } catch (error) {
                console.error("Invitation finalization error:", error);
                setFormErrors({ form: error.message || 'Failed to activate account. Please try again.' });
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
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
            <AuthHeader />
            <div className="max-w-md w-full mt-8 space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-2">Accept Your Invitation</h1>
                    <p className="text-gray-600">Create your account to join the team.</p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {/* The email input is pre-filled and disabled, ensuring the user signs up with the correct email. */}
                    <Input1 label="Email Address" name="email" value={email} disabled={true} />
                    
                    <div className="grid grid-cols-2 gap-4">
                        <Input1 name="firstName" label="First Name" value={formData.firstName} onChange={handleChange} required error={formErrors.firstName} />
                        <Input1 name="lastName" label="Last Name" value={formData.lastName} onChange={handleChange} required error={formErrors.lastName} />
                    </div>

                    <Input1 name="Phone" label="Phone Number" value={formData.phoneNumber} onChange={handleChange} required error={formErrors.phoneNumber} />
                    
                    <Input1 type="password" name="password" label="Create Password" value={formData.password} onChange={handleChange} required error={formErrors.password} />
                    <Input1 type="password" name="confirmPassword" label="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required error={formErrors.confirmPassword} />

                    {formErrors.form && <div className="text-red-600 text-center text-sm">{formErrors.form}</div>}
                    
                    <Button1 type="submit" text={isSubmitting ? "Activating..." : "Create Account & Join"} className="w-full" disabled={isSubmitting} />
                </form>
            </div>
        </div>
    );
};

export default AcceptInvitationPage;