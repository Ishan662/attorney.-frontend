// >> In your existing file: components/modals/EditHearingModal.jsx

import React, { useState, useEffect } from 'react';
import Button1 from '../../components/UI/Button1';
import Button2 from '../../components/UI/Button2';
import Input1 from '../../components/UI/Input1';

const EditHearingModal = ({ isOpen, onClose, hearing, caseNumber, onSave, onDelete }) => {
    // `hearing` is the object of the hearing being edited
    const [formData, setFormData] = useState({
        label: '',
        date: '',
        time: '',
        location: '',
        note: '',
        status: 'PLANNED'
    });
    
    // We bring back the error state to match the Add modal
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // This useEffect hook populates the form when the `hearing` prop changes.
    useEffect(() => {
        if (hearing) {
            const hearingDate = new Date(hearing.hearingDate);
            // This logic correctly separates the date and time for the form fields
            const datePart = hearingDate.toISOString().split('T')[0]; // YYYY-MM-DD
            const timePart = hearingDate.toTimeString().split(' ')[0].substring(0, 5); // HH:MM

            setFormData({
                label: hearing.title || '',
                date: datePart,
                time: timePart,
                location: hearing.location || '',
                note: hearing.note || '',
                status: hearing.status || 'PLANNED'
            });
        }
    }, [hearing]); // This effect runs whenever the selected hearing changes

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when field is modified
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // We use the same validation logic as the Add modal
    const validate = () => {
        const tempErrors = {};
        if (!formData.label.trim()) tempErrors.label = 'Hearing label is required';
        if (!formData.date) tempErrors.date = 'Date is required';
        if (!formData.location.trim()) tempErrors.location = 'Location is required';
        
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (validate()) {
            setIsSubmitting(true);
            try {
                // The parent (CaseDetails) will handle the API call and closing the modal
                await onSave(hearing.id, formData);
            } catch (error) {
                console.error("Update failed:", error);
                // The parent component will show an alert
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this hearing? This action cannot be undone.")) {
            setIsSubmitting(true);
            try {
                // The parent (CaseDetails) will handle the API call and closing the modal
                await onDelete(hearing.id);
            } catch (error) {
                console.error("Delete failed:", error);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
                <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    {/* The title is now "Edit Hearing" */}
                    <h2 className="text-lg font-semibold text-gray-800">Edit Hearing</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500 focus:outline-none">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="px-6 py-4">
                    <p className="text-sm text-gray-600 mb-4">
                        Editing hearing for Case: <span className="font-medium">{caseNumber}</span>
                    </p>

                    {/* The form structure is now identical to your Add modal */}
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <Input1
                            type="text" name="label" label="Hearing Label" placeholder="e.g. Final Hearing"
                            required value={formData.label} onChange={handleChange} error={errors.label}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <Input1 type="date" name="date" label="Date" required value={formData.date} onChange={handleChange} error={errors.date} />
                            <Input1 type="time" name="time" label="Time (optional)" value={formData.time} onChange={handleChange} />
                        </div>
                        <Input1
                            type="text" name="location" label="Location" placeholder="Court name or address"
                            required value={formData.location} onChange={handleChange} error={errors.location}
                        />
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select name="status" value={formData.status} onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                                <option value="PLANNED">Planned</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="POSTPONED">Postponed</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                            <textarea name="note" rows={3} value={formData.note} onChange={handleChange}
                                placeholder="Any important details about this hearing"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        
                        {/* The buttons are now at the bottom, including the new Delete button */}
                        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                            <div className="space-x-3">
                                <Button2 text="Delete" onClick={handleDelete} className="bg-red-100 text-red-700 hover:bg-red-200" disabled={isSubmitting} />
                                <Button2 text="Cancel" onClick={onClose} disabled={isSubmitting} />
                                <Button1 type="Submit" text={isSubmitting ? "Saving..." : "Save Changes"} disabled={isSubmitting} />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditHearingModal;