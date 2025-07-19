import { useState, useEffect } from "react";
import Sidebar from "../../components/layout/Sidebar";
import PageLayout from "../../components/layout/PageLayout";
import Button1 from "../../components/UI/Button1";
import Button2 from "../../components/UI/Button2";
import SendRemindersModal from "./SendRemindersModal";
import EditPaymentActions from "./EditPaymentActions";

const DuePayments = () => {
    // Updated user data with correct role format
    const user = {
        name: 'Nishagi Jewantha',
        email: 'jeewanthadeherath@gmail.com',
        role: 'lawyer' // Changed from 'Lawyer' to 'lawyer' for consistency
    };

    const [notificationCount, setNotificationCount] = useState(1);
    const [sidebarExpanded, setSidebarExpanded] = useState(true);
    const [showRemindersModal, setShowRemindersModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    
    // Handle notification click
    const handleNotificationClick = () => {
        console.log('Notifications clicked from Due Payments page');
    };

    // Handle sidebar toggle
    const handleSidebarToggle = (expanded) => {
        setSidebarExpanded(expanded);
    };

    // Enhanced sample payment due data with court and case number
    const [duePayments, setDuePayments] = useState([
        {
            id: 1,
            client: {
                initials: "AD",
                name: "Anura De Mel",
                color: "bg-green-100 text-green-800"
            },
            caseNumber: "CIV-2025-0142",
            court: "Colombo District Court",
            dueDate: "2025-07-01",
            amount: 2500.00,
            status: "Outstanding"
        },
        {
            id: 2,
            client: {
                initials: "SF",
                name: "S. Fernando",
                color: "bg-blue-100 text-blue-800"
            },
            caseNumber: "CIV-2025-0189",
            court: "High Court of Kandy",
            dueDate: "2025-08-12",
            amount: 3500.00,
            status: "Overdue"
        },
        {
            id: 3,
            client: {
                initials: "KJ",
                name: "Kamal J.",
                color: "bg-indigo-100 text-indigo-800"
            },
            caseNumber: "CRIM-2025-0076",
            court: "Colombo Magistrate's Court",
            dueDate: "2025-07-21",
            amount: 2180.00,
            status: "Outstanding"
        },
        {
            id: 4,
            client: {
                initials: "RP",
                name: "Ruwan Perera",
                color: "bg-purple-100 text-purple-800"
            },
            caseNumber: "FAM-2025-0058",
            court: "Family Court of Gampaha",
            dueDate: "2025-08-01",
            amount: 1150.00,
            status: "Overdue"
        }
    ]);

    // Format date for display
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    // Format currency for display
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    // Handle payment action
    const handlePaymentAction = (id, action) => {
        if (action === 'mark-paid') {
            // Update payment status to Paid
            setDuePayments(prevPayments => 
                prevPayments.map(payment => 
                    payment.id === id ? { ...payment, status: 'Paid' } : payment
                )
            );
        } else if (action === 'edit') {
            // Find the payment to edit
            const paymentToEdit = duePayments.find(p => p.id === id);
            if (paymentToEdit) {
                setSelectedPayment(paymentToEdit);
                setShowEditModal(true);
            }
        }
    };

    // Handle updated payment from edit modal
    const handlePaymentUpdate = (updatedPayment) => {
        if (!updatedPayment) {
            setShowEditModal(false);
            return;
        }
        
        // Update the payment in state
        setDuePayments(prevPayments => 
            prevPayments.map(payment => 
                payment.id === updatedPayment.id ? updatedPayment : payment
            )
        );
        
        setShowEditModal(false);
    };

    // Handle sort
    const handleSort = (column) => {
        console.log(`Sorting by ${column}`);
        // Implement sorting logic
    };

    return (
        <PageLayout user={user}>
            <div className="p-6">
                {/* Due Payments Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold">Due Payments</h1>
                    <div className="flex items-center gap-2">
                        <Button2 text="Print" className="text-sm py-1 px-4" />
                    </div>
                </div>

                {/* Due Payments Table */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th 
                                        className="px-6 py-4 text-left text-sm font-medium text-gray-600 cursor-pointer"
                                        onClick={() => handleSort('client')}
                                    >
                                        CLIENT NAME
                                    </th>
                                    <th 
                                        className="px-6 py-4 text-left text-sm font-medium text-gray-600 cursor-pointer"
                                        onClick={() => handleSort('caseNumber')}
                                    >
                                        CASE NUMBER
                                    </th>
                                    <th 
                                        className="px-6 py-4 text-left text-sm font-medium text-gray-600 cursor-pointer"
                                        onClick={() => handleSort('court')}
                                    >
                                        COURT
                                    </th>
                                    <th 
                                        className="px-6 py-4 text-left text-sm font-medium text-gray-600 cursor-pointer"
                                        onClick={() => handleSort('dueDate')}
                                    >
                                        DUE DATE
                                    </th>
                                    <th 
                                        className="px-6 py-4 text-right text-sm font-medium text-gray-600 cursor-pointer"
                                        onClick={() => handleSort('amount')}
                                    >
                                        AMOUNT DUE
                                    </th>
                                    <th 
                                        className="px-6 py-4 text-center text-sm font-medium text-gray-600 cursor-pointer"
                                        onClick={() => handleSort('status')}
                                    >
                                        STATUS
                                    </th>
                                    <th className="px-6 py-4"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {duePayments.map((payment) => (
                                    <tr 
                                        key={payment.id} 
                                        className="border-b last:border-b-0 hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className={`w-8 h-8 rounded-full ${payment.client.color} flex items-center justify-center mr-3 text-xs font-medium`}>
                                                    {payment.client.initials}
                                                </div>
                                                <span>{payment.client.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium">
                                            {payment.caseNumber}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {payment.court}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {formatDate(payment.dueDate)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {formatCurrency(payment.amount)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium inline-block
                                                    ${payment.status === 'Outstanding' ? 'bg-gray-100 text-gray-800' : ''}
                                                    ${payment.status === 'Overdue' ? 'bg-red-100 text-red-800' : ''}
                                                    ${payment.status === 'Paid' ? 'bg-green-100 text-green-800' : ''}
                                                    ${payment.status === 'Partial' ? 'bg-yellow-100 text-yellow-800' : ''}
                                                `}>
                                                    {payment.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2">
                                                {payment.status !== 'Paid' && (
                                                    <>
                                                        <Button1 
                                                            text="Mark Paid" 
                                                            className="text-white text-xs py-1 px-2"
                                                            onClick={() => handlePaymentAction(payment.id, 'mark-paid')}
                                                        />
                                                        <button
                                                            className="text-gray-400 hover:text-orange-500"
                                                            onClick={() => handlePaymentAction(payment.id, 'edit')}
                                                            title="Edit"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination or Additional Info */}
                <div className="mt-6 text-center text-sm text-gray-600">
                    <div className="flex justify-between items-center">
                        <div>Showing {duePayments.length} items</div>
                        <div className="flex items-center gap-2">
                            <Button2 text="Previous" className="text-xs py-1 px-2" />
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-500 text-white">1</span>
                            <Button2 text="Next" className="text-xs py-1 px-2" />
                        </div>
                    </div>
                </div>

                {/* Total Due */}
                <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-medium">Total Due Payments</h2>
                        <div className="text-2xl font-bold text-orange-600">
                            {formatCurrency(duePayments
                                .filter(p => p.status !== 'Paid')
                                .reduce((sum, payment) => sum + payment.amount, 0))}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-8 flex justify-end gap-4">
                    <Button2 
                        text="Send Reminders" 
                        className="py-2 px-4"
                        onClick={() => setShowRemindersModal(true)}
                    />
                    <Button1 
                        text="Edit Actions" 
                        onClick={() => {
                            // You can pre-select the first unpaid payment here if you want
                            const firstUnpaid = duePayments.find(p => p.status !== 'Paid');
                            if (firstUnpaid) {
                                setSelectedPayment(firstUnpaid);
                                setShowEditModal(true);
                            } else {
                                alert('No payments to edit');
                            }
                        }}
                    />
                </div>

                {/* Send Reminders Modal */}
                <SendRemindersModal 
                    isOpen={showRemindersModal}
                    onClose={() => setShowRemindersModal(false)}
                    allPayments={duePayments.filter(p => p.status !== 'Paid')}
                />

                {/* Edit Payment Actions Modal */}
                <EditPaymentActions 
                    isOpen={showEditModal}
                    onClose={handlePaymentUpdate}
                    payment={selectedPayment}
                />
            </div>
        </PageLayout>
    );
};

export default DuePayments;