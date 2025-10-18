import React from 'react';
import Button1 from '../UI/Button1';
import Button2 from '../UI/Button2';

const PaymentGuideModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">How to Request Payment Options</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Payment Request Process */}
                    <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                        <h3 className="font-semibold text-blue-900 mb-2">📋 Payment Request Process</h3>
                        <p className="text-blue-800 text-sm">
                            Follow these steps to request payment options for your clients or cases.
                        </p>
                    </div>

                    {/* Step by Step Guide */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg text-gray-800">Step-by-Step Guide:</h3>
                            
                            <div className="space-y-3">
                                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">Navigate to Payment Section</h4>
                                        <p className="text-sm text-gray-600">Go to your lawyer dashboard and click on "Payment" in the sidebar menu.</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">Select Client Case</h4>
                                        <p className="text-sm text-gray-600">Choose the specific client and case for which you want to request payment.</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">Fill Payment Details</h4>
                                        <p className="text-sm text-gray-600">Enter the payment amount, description, and any additional notes.</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">Submit Request</h4>
                                        <p className="text-sm text-gray-600">Review your request and submit it for admin approval.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg text-gray-800">Required Information:</h3>
                            
                            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                                <h4 className="font-medium text-yellow-800 mb-2">📝 What You Need:</h4>
                                <ul className="text-sm text-yellow-700 space-y-1">
                                    <li>• Client information and case ID</li>
                                    <li>• Payment amount (in USD)</li>
                                    <li>• Service description</li>
                                    <li>• Payment method preference</li>
                                    <li>• Supporting documents (if required)</li>
                                </ul>
                            </div>

                            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                <h4 className="font-medium text-green-800 mb-2">✅ Payment Methods Available:</h4>
                                <ul className="text-sm text-green-700 space-y-1">
                                    <li>• Credit/Debit Card</li>
                                    <li>• Bank Transfer</li>
                                    <li>• PayPal</li>
                                    <li>• Check Payment</li>
                                    <li>• Wire Transfer</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Important Notes */}
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                        <h3 className="font-semibold text-red-800 mb-2">⚠️ Important Notes:</h3>
                        <ul className="text-sm text-red-700 space-y-1">
                            <li>• All payment requests require admin approval</li>
                            <li>• Processing time is typically 2-3 business days</li>
                            <li>• Ensure all client information is accurate</li>
                            <li>• Keep records of all payment transactions</li>
                            <li>• Contact support if you encounter any issues</li>
                        </ul>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-800 mb-2">📞 Need Help?</h3>
                        <p className="text-sm text-gray-600 mb-2">
                            If you have questions about payment requests, you can:
                        </p>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Create a support ticket through this system</li>
                            <li>• Contact the admin team directly</li>
                            <li>• Check the FAQ section in your dashboard</li>
                        </ul>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                    <Button2 text="Close" onClick={onClose} />
                    <Button1 text="Go to Payments" onClick={() => {
                        // Navigate to payments section
                        window.location.href = '/lawyer/duepayments';
                    }} />
                </div>
            </div>
        </div>
    );
};

export default PaymentGuideModal;
