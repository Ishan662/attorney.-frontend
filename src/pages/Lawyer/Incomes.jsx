import { useState, useEffect } from "react";
import Sidebar from "../../components/layout/Sidebar";
import PageHeader from "../../components/layout/PageHeader";
import Button1 from "../../components/UI/Button1";
import Button2 from "../../components/UI/Button2";

const Incomes = () => {
    const user = {
        name: 'Thusitha',
        email: 'jeewanthadeherath@gmail.com',
    };

    const [notificationCount, setNotificationCount] = useState(1);
    
    // State for filters
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    
    // Available years and months for filters
    const years = [2022, 2023, 2024, 2025]; // Add this array for years
    
    const months = [
        { value: 0, label: "January" },
        { value: 1, label: "February" },
        { value: 2, label: "March" },
        { value: 3, label: "April" },
        { value: 4, label: "May" },
        { value: 5, label: "June" },
        { value: 6, label: "July" },
        { value: 7, label: "August" },
        { value: 8, label: "September" },
        { value: 9, label: "October" },
        { value: 10, label: "November" },
        { value: 11, label: "December" }
    ];

    // Handle notification click
    const handleNotificationClick = () => {
        console.log('Notifications clicked from Incomes page');
    };

    // Handle filter submit - Add this function
    const handleFilterSubmit = () => {
        console.log(`Filtering for income data: ${months[selectedMonth].label} ${selectedYear}`);
        // In a real app, you'd fetch data based on these filters
    };

    // Sample weekly income data
    const weeklyIncomeData = [
        { label: "3 Weeks Ago", amount: 5200 },
        { label: "2 Weeks Ago", amount: 7500 },
        { label: "Last Week", amount: 9800 },
        { label: "This Week", amount: 5800 }
    ];


    // Sample customer data
    const paidCustomers = [
        { date: "2024-05-03", name: "Mr Kumara" },
        { date: "2024-05-03", name: "Mr Kumara" },
        { date: "2024-05-03", name: "Mr Edirimuni" },
        { date: "2024-05-06", name: "Mr Kumara" },
        { date: "2024-05-06", name: "Mr Kumara" },
        { date: "2024-05-06", name: "Mr Edirimuni" },
        { date: "2024-05-06", name: "Mr Kumara" },
        { date: "2024-05-06", name: "Mr Kumara" },
    ];

    const unpaidCustomers = [
        { date: "2024-05-03", name: "Mr Kumara" },
        { date: "2024-05-03", name: "Mr Kumara" },
        { date: "2024-05-03", name: "Mr Edirimuni" },
        { date: "2024-05-06", name: "Mr Kumara" },
        { date: "2024-05-06", name: "Mr Kumara" },
        { date: "2024-05-06", name: "Mr Edirimuni" },
        { date: "2024-05-08", name: "Mr Kumara" },
        { date: "2024-05-08", name: "Mr Kumara" },
    ];

    // Find maximum amount for chart scaling
    const maxAmount = Math.max(...weeklyIncomeData.map(week => week.amount));
    
    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar user={user} />
            <div className="flex-grow p-6 overflow-y-auto">
                {/* PageHeader component */}
                <div className="mb-8">
                    <PageHeader 
                        user={user} 
                        notificationCount={notificationCount}
                        onNotificationClick={handleNotificationClick}
                    />
                </div>
                
                {/* Incomes specific header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold">Incomes</h1>
                    <div className="flex items-center gap-2">
                        <Button2 text="Export" className="text-sm py-1 px-4" />
                        <Button2 text="Print" className="text-sm py-1 px-4" />
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4 mb-8">
                    <div className="flex items-center">
                        <span className="mr-2 text-sm font-medium">Year:</span>
                        <select 
                            className="bg-white border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                        >
                            {years.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center">
                        <span className="mr-2 text-sm font-medium">Month:</span>
                        <select 
                            className="bg-white border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                        >
                            {months.map(month => (
                                <option key={month.value} value={month.value}>{month.label}</option>
                            ))}
                        </select>
                    </div>
                    <Button1 
                        text="Submit" 
                        className="text-white py-1 px-4 text-sm"
                        onClick={handleFilterSubmit}
                    />
                </div>

                {/* Income Chart */}
                <div className="mb-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-medium mb-6">Incomes in this month</h2>
                        
                        <div className="flex items-end h-64 gap-8 mt-4">
                            {weeklyIncomeData.map((week, index) => {
                                // Calculate height percentage based on max amount
                                const heightPercentage = (week.amount / maxAmount) * 100;
                                
                                return (
                                    <div key={index} className="flex-1 flex flex-col items-center">
                                        <div className="w-full flex flex-col items-center">
                                            <div className="text-sm text-gray-600 mb-1">
                                                {formatCurrency(week.amount)}
                                            </div>
                                            <div 
                                                style={{ height: `${heightPercentage}%` }}
                                                className={`w-full bg-indigo-500 rounded-t-lg ${week.label === 'Last Week' ? 'bg-indigo-600' : ''}`}
                                            ></div>
                                            <div className="text-sm font-medium mt-2">
                                                {week.label}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Customers Lists */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Paid Customers */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-medium mb-4">Paid Customers</h2>
                        
                        <div className="space-y-4">
                            {paidCustomers.reduce((acc, customer, index) => {
                                // Group by date
                                const currentDate = customer.date;
                                
                                // Check if this is a new date or continuation
                                if (index === 0 || customer.date !== paidCustomers[index - 1].date) {
                                    // New date group
                                    acc.push(
                                        <div key={`section-${index}`} className="space-y-2">
                                            {/* Add customers with this date */}
                                            {paidCustomers
                                                .filter(c => c.date === currentDate)
                                                .map((c, i) => (
                                                    <div key={`customer-${index}-${i}`} className="flex items-center">
                                                        <div className="text-sm text-gray-600 mr-2">{c.date}</div>
                                                        <div className="text-sm font-medium">- {c.name}</div>
                                                    </div>
                                                ))
                                            }
                                            
                                            {/* Add separator if not the last group */}
                                            {index < paidCustomers.length - 1 && 
                                                paidCustomers[index + 1].date !== currentDate && (
                                                <div className="border-t border-gray-200 my-3"></div>
                                            )}
                                        </div>
                                    );
                                }
                                return acc;
                            }, [])}
                        </div>
                    </div>

                    {/* Unpaid Customers */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-medium mb-4">Unpaid Customers</h2>
                        
                        <div className="space-y-4">
                            {unpaidCustomers.reduce((acc, customer, index) => {
                                // Group by date
                                const currentDate = customer.date;
                                
                                // Check if this is a new date or continuation
                                if (index === 0 || customer.date !== unpaidCustomers[index - 1].date) {
                                    // New date group
                                    acc.push(
                                        <div key={`section-${index}`} className="space-y-2">
                                            {/* Add customers with this date */}
                                            {unpaidCustomers
                                                .filter(c => c.date === currentDate)
                                                .map((c, i) => (
                                                    <div key={`customer-${index}-${i}`} className="flex items-center">
                                                        <div className="text-sm text-gray-600 mr-2">{c.date}</div>
                                                        <div className="text-sm font-medium">- {c.name}</div>
                                                    </div>
                                                ))
                                            }
                                            
                                            {/* Add separator if not the last group */}
                                            {index < unpaidCustomers.length - 1 && 
                                                unpaidCustomers[index + 1].date !== currentDate && (
                                                <div className="border-t border-gray-200 my-3"></div>
                                            )}
                                        </div>
                                    );
                                }
                                return acc;
                            }, [])}
                        </div>
                    </div>
                </div>

                {/* Total Income Summary */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-medium">Total Income for {months[selectedMonth].label} {selectedYear}</h2>
                        <div className="text-2xl font-bold text-green-600">
                            {formatCurrency(weeklyIncomeData.reduce((sum, week) => sum + week.amount, 0))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Incomes;