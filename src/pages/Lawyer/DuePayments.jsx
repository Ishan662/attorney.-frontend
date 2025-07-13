import { useState, useEffect } from "react";
import Sidebar from "../../components/layout/Sidebar";
import PageHeader from "../../components/layout/PageHeader";
import Button1 from "../../components/UI/Button1";
import Button2 from "../../components/UI/Button2";

const DuePayments = () => {
    const user = {
        name: 'Nishagi Jewantha',
        email: 'jeewanthadeherath@gmail.com',
    };

    const [notificationCount, setNotificationCount] = useState(1);
    const [sidebarExpanded, setSidebarExpanded] = useState(true);
    
    // Handle notification click
    const handleNotificationClick = () => {
        console.log('Notifications clicked from Due Payments page');
    };

    // Handle sidebar toggle
    const handleSidebarToggle = (expanded) => {
        setSidebarExpanded(expanded);
    };

    // Sample payment due data
    const duePayments = [
        {
            id: 1,
            client: {
                initials: "AD",
                name: "Anura De Mel",
                color: "bg-green-100 text-green-800"
            },
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
            dueDate: "2025-08-01",
            amount: 1150.00,
            status: "Overdue"
        }
    ];

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
        console.log(`${action} payment ${id}`);
        // In a real app, you'd implement the appropriate action
    };

    // Handle sort
    const handleSort = (column) => {
        console.log(`Sorting by ${column}`);
        // Implement sorting logic
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar 
                user={user}
                onToggle={handleSidebarToggle}
            />
            <div 
                className="flex-grow overflow-y-auto transition-all duration-300"
                style={{ 
                    marginLeft: sidebarExpanded ? '16rem' : '5rem'
                }}
            >
                <div className="p-6">
                    {/* PageHeader component */}
                    <div className="mb-8">
                        <PageHeader 
                            user={user} 
                            notificationCount={notificationCount}
                            onNotificationClick={handleNotificationClick}
                        />
                    </div>
                    
                    {/* Due Payments Header */}
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-2xl font-bold">Due Payments</h1>
                        <div className="flex items-center gap-2">
                            <Button2 text="Export"  />
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
                                                    `}>
                                                        {payment.status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-end gap-2">
                                                    <Button1 
                                                        text="Mark Paid" 
                                                        className=" text-white text-xs py-1 px-2"
                                                        onClick={() => handlePaymentAction(payment.id, 'mark-paid')}
                                                    />
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
                                {formatCurrency(duePayments.reduce((sum, payment) => sum + payment.amount, 0))}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-8 flex justify-end gap-4">
                        <Button2 
                            text="Send Reminders" 
                            className="py-2 px-4"
                        />
                        <Button1 
                            text="Create New Payment" 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DuePayments;