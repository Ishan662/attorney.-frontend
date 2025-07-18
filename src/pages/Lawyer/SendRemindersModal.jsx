import React, { useState } from 'react';
import Button1 from '../../components/UI/Button1';
import Button2 from '../../components/UI/Button2';

const SendRemindersModal = ({ isOpen, onClose, selectedPayments = [], allPayments = [] }) => {
    const [reminderMessage, setReminderMessage] = useState(
        "This is a friendly reminder that you have an outstanding payment due. Please arrange payment at your earliest convenience."
    );
    
    const [sendingReminders, setSendingReminders] = useState(false);
    
    // If not open, don't render
    if (!isOpen) return null;
    
    // If no specific payments are selected, use all overdue payments
    const paymentsToRemind = selectedPayments.length > 0 
        ? selectedPayments 
        : allPayments.filter(payment => payment.status === 'Overdue');
    
    const handleSendReminders = () => {
        setSendingReminders(true);
        
        // Simulate sending reminders
        setTimeout(() => {
            setSendingReminders(false);
            onClose();
            // You would implement actual reminder sending logic here
            alert(`Reminders sent to ${paymentsToRemind.length} clients`);
        }, 1500);
    };
    
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
                <div className="border-b px-6 py-4 flex justify-between items-center">
                    <h3 className="text-lg font-medium">Send Payment Reminders</h3>
                    <button 
                        className="text-gray-400 hover:text-gray-500" 
                        onClick={onClose}
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <div className="px-6 py-4">
                    <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">
                            Sending reminders to {paymentsToRemind.length} client(s):
                        </p>
                        <div className="bg-gray-50 p-3 rounded-md max-h-32 overflow-y-auto mb-4">
                            {paymentsToRemind.map(payment => (
                                <div key={payment.id} className="flex justify-between mb-1 text-sm">
                                    <span>{payment.client.name}</span>
                                    <span className="text-gray-600">{payment.caseNumber}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Reminder Message
                        </label>
                        <textarea
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                            rows={4}
                            value={reminderMessage}
                            onChange={(e) => setReminderMessage(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex justify-end space-x-3 pt-4">
                        <Button2
                            text="Cancel"
                            onClick={onClose}
                            disabled={sendingReminders}
                        />
                        <Button1
                            text={sendingReminders ? "Sending..." : "Send Reminders"}
                            onClick={handleSendReminders}
                            disabled={sendingReminders || paymentsToRemind.length === 0}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SendRemindersModal;