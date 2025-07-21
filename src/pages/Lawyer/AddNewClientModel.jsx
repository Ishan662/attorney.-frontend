// >> In a new file, e.g., components/modals/AddClientModal.jsx

import React, { useState, useEffect } from 'react';
import Button1 from '../../components/UI/Button1';
import Button2 from '../../components/UI/Button2';
import Input1 from '../../components/UI/Input1';
import { sendInvitation } from '../../services/invitationService'; // Adjust path if needed

const AddClientModal = ({ isOpen, onClose, caseId, existingClient }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // This effect runs when the modal opens or the existingClient data changes.
    useEffect(() => {
        if (existingClient) {
            setFormData({
                fullName: existingClient.clientName || '',
                email: existingClient.clientEmail || '', 
                phoneNumber: existingClient.clientPhone || ''
            });
        }
    }, [isOpen, existingClient]);

    // If the modal isn't open, render nothing.
    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Special handling for phone number to allow only digits and limit to 10 characters
        if (name === 'phoneNumber') {
            // Remove any non-digit characters
            const numbersOnly = value.replace(/\D/g, '');
            // Limit to 10 digits
            const limitedValue = numbersOnly.slice(0, 10);
            setFormData(prev => ({ ...prev, [name]: limitedValue }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // --- ▼▼▼ YOUR EXISTING, WORKING SUBMIT LOGIC ▼▼▼ ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.fullName || !formData.email) {
            setFormError('Client name and email are required.');
            return;
        }
        if (!formData.phoneNumber) {
            setFormError('Phone number is required.');
            return;
        }
        
        // Validate phone number: exactly 10 digits starting with 0
        const phoneRegex = /^0\d{9}$/;
        if (!phoneRegex.test(formData.phoneNumber)) {
            setFormError('Phone number must be exactly 10 digits starting with 0 (e.g., 0765647672).');
            return;
        }
        
        if (!caseId) {
            setFormError('Error: Case ID not found.');
            return;
        }

        setIsSubmitting(true);
        setFormError('');
        setSuccessMessage('');

        try {
            const invitationData = {
                fullName: formData.fullName,
                email: formData.email,
                role: 'CLIENT',
                phoneNumber: formData.phoneNumber,
                caseId: caseId
            };
            await sendInvitation(invitationData);
            setSuccessMessage(`Invitation sent successfully to ${formData.email}!`);
            setTimeout(() => {
                onClose(); // Close modal after a short delay on success
            }, 2000);
        } catch (err) {
            console.error("Failed to send client invitation:", err);
            setFormError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg mx-4">
                <h2 className="text-xl font-bold mb-4">
                    Add or Invite Client to Case
                </h2>
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Client Name
                        </label>
                        <Input1
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Full name"
                            variant="outlined"
                            className="w-full"
                            required
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <Input1
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="email@example.com"
                            variant="outlined"
                            className="w-full"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            They will receive an invitation email to join the case
                        </p>
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number
                        </label>
                        <Input1
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            placeholder="0765647672"
                            variant="outlined"
                            className="w-full"
                            required
                            maxLength="10"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Must be exactly 10 digits starting with 0 (e.g., 0765647672)
                        </p>
                    </div>
                    
                    {formError && (
                        <p className="text-red-500 text-xs mt-1">{formError}</p>
                    )}
                    
                    {successMessage && (
                        <p className="text-green-500 text-xs mt-1">{successMessage}</p>
                    )}
                    
                    <div className="flex justify-end space-x-3">
                        <Button2
                            text="Cancel"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="px-4 py-2"
                        />
                        <Button1
                            type="submit"
                            text={isSubmitting ? "Sending..." : "Send Invitation"}
                            disabled={isSubmitting}
                            className="px-4 py-2"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddClientModal;