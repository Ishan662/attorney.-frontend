import React, { useState } from 'react';
import Button1 from '../../components/UI/Button1';
import Button2 from '../../components/UI/Button2';

const EditPaymentActions = ({ isOpen, onClose, payment }) => {
    const [updatedPayment, setUpdatedPayment] = useState(payment || {});
    const [isSaving, setIsSaving] = useState(false);
    
    // If not open or no payment provided, don't render
    if (!isOpen || !payment) return null;
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedPayment(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    const handleAmountChange = (e) => {
        const value = parseFloat(e.target.value) || 0;
        setUpdatedPayment(prev => ({
            ...prev,
            amount: value
        }));
    };
    
    const handleSave = () => {
        setIsSaving(true);
        
        // Simulate saving
        setTimeout(() => {
            setIsSaving(false);
            onClose(updatedPayment); // Pass the updated payment back to parent
            // You would implement actual saving logic here
        }, 1000);
    };
    
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
                <div className="border-b px-6 py-4 flex justify-between items-center">
                    <h3 className="text-lg font-medium">Edit Payment Details</h3>
                    <button 
                        className="text-gray-400 hover:text-gray-500" 
                        onClick={() => onClose()}
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <div className="px-6 py-4">
                    <div className="mb-4">
                        <div className="flex items-center">
                            <div className={`w-8 h-8 rounded-full ${updatedPayment?.client?.color} flex items-center justify-center mr-3 text-xs font-medium`}>
                                {updatedPayment?.client?.initials}
                            </div>
                            <span className="font-medium">{updatedPayment?.client?.name}</span>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Case Number
                            </label>
                            <input
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                                name="caseNumber"
                                value={updatedPayment.caseNumber || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Court
                            </label>
                            <input
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                                name="court"
                                value={updatedPayment.court || ''}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Due Date
                            </label>
                            <input
                                type="date"
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                                name="dueDate"
                                value={updatedPayment.dueDate || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Amount Due
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                                value={updatedPayment.amount || 0}
                                onChange={handleAmountChange}
                            />
                        </div>
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Status
                        </label>
                        <select
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                            name="status"
                            value={updatedPayment.status || ''}
                            onChange={handleChange}
                        >
                            <option value="Outstanding">Outstanding</option>
                            <option value="Overdue">Overdue</option>
                            <option value="Paid">Paid</option>
                            <option value="Partial">Partial Payment</option>
                        </select>
                    </div>
                    
                    <div className="flex justify-end space-x-3 pt-4">
                        <Button2
                            text="Cancel"
                            onClick={() => onClose()}
                            disabled={isSaving}
                        />
                        <Button1
                            text={isSaving ? "Saving..." : "Save Changes"}
                            onClick={handleSave}
                            disabled={isSaving}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditPaymentActions;