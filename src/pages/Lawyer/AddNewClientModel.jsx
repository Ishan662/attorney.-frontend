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
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // --- ▼▼▼ YOUR EXISTING, WORKING SUBMIT LOGIC ▼▼▼ ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.fullName || !formData.email) {
            setFormError('Client name and email are required.');
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
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
                <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800">Add or Invite Client to Case</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500 focus:outline-none">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="px-6 py-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input1
                            type="text"
                            name="fullName"
                            label="Client Name"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />
                        <Input1
                            type="email"
                            name="email"
                            label="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <Input1
                            type="tel"
                            name="phoneNumber"
                            label="Phone Number"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                        />
                        
                        {formError && <p className="text-red-500 text-center text-sm">{formError}</p>}
                        {successMessage && <p className="text-green-500 text-center text-sm">{successMessage}</p>}

                        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                            <Button2 text="Cancel" onClick={onClose} disabled={isSubmitting} />
                            <Button1
                                type="submit"
                                text={isSubmitting ? "Sending..." : "Send Invitation"}
                                disabled={isSubmitting}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddClientModal;