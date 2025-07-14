import { useState, useEffect } from "react";
import PageLayout from "../../components/layout/PageLayout";
import PageHeader from "../../components/layout/PageHeader";
import Button1 from "../../components/UI/Button1";
import Button2 from "../../components/UI/Button2";
// Import Recharts components
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

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
    const years = [2022, 2023, 2024, 2025];
    
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

    // Handle filter submit
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

    // Generate dummy daily income data for the selected month
    const generateDailyIncomeData = () => {
        const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
        const data = [];
        
        // Generate random data for each day of the month
        for (let i = 1; i <= daysInMonth; i++) {
            // Higher values for weekdays (Mon-Fri), lower for weekends
            const date = new Date(selectedYear, selectedMonth, i);
            const day = date.getDay(); // 0 = Sunday, 6 = Saturday
            
            let amount;
            if (day === 0 || day === 6) {
                // Weekend
                amount = Math.floor(Math.random() * 800) + 200; // 200-1000
            } else {
                // Weekday
                amount = Math.floor(Math.random() * 1500) + 500; // 500-2000
            }
            
            // Add some additional data points for the chart
            let expenses = Math.floor(amount * 0.4); // 40% of income as expenses
            let profit = amount - expenses;
            
            data.push({
                day: i,
                date: date,
                income: amount,
                expenses: expenses,
                profit: profit,
                // Format the date for display in the chart
                name: `${i}/${selectedMonth + 1}` 
            });
        }
        return data;
    };

    // Daily income data
    const dailyIncomeData = generateDailyIncomeData();
    
    // Find maximum amount for chart scaling (weekly)
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

    // Custom tooltip for the Recharts component
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            const date = new Date(selectedYear, selectedMonth, parseInt(label.split('/')[0]));
            const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
            
            return (
                <div className="bg-white p-2 sm:p-3 border border-gray-200 shadow-md rounded-md text-xs sm:text-sm max-w-[200px] sm:max-w-none">
                    <p className="font-medium text-gray-800">{dayName}, {months[selectedMonth].label} {data.day}</p>
                    <p className="text-green-600 mt-1">
                        <span className="font-medium">Income: </span>
                        {formatCurrency(data.income)}
                    </p>
                </div>
            );
        }
        return null;
    };

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

    return (
        <PageLayout user={user}>
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

            {/* Income Charts */}
            <div className="mb-8">
                <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">                    
                    {/* Daily income line chart using Recharts */}
                    <div>
                        <h3 className="text-lg font-black mb-4">Daily Income for {months[selectedMonth].label} {selectedYear}</h3>
                        
                        {/* Responsive chart container */}
                        <div className="h-60 sm:h-72 md:h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={dailyIncomeData}
                                    margin={{ 
                                        top: 10, 
                                        right: 10, 
                                        left: 0, 
                                        bottom: 20 
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis 
                                        dataKey="name" 
                                        tick={{ fontSize: 10 }}
                                        tickMargin={10}
                                        // Display fewer ticks on small screens
                                        interval="preserveStartEnd"
                                        tickFormatter={(value, index) => {
                                            // Show only every 5th day on small screens, except first and last
                                            const day = parseInt(value.split('/')[0]);
                                            const daysInMonth = dailyIncomeData.length;
                                            
                                            // Always show 1st and last day
                                            if (day === 1 || day === daysInMonth) return value;
                                            
                                            // On smaller screens, show fewer labels
                                            const screenWidth = window.innerWidth;
                                            if (screenWidth < 768) {
                                                return day % 5 === 0 ? day : '';
                                            }
                                            return value;
                                        }}
                                    />
                                    <YAxis 
                                        tickFormatter={(value) => `$${value}`}
                                        tick={{ fontSize: 10 }}
                                        width={45}
                                        // Add domain to ensure y-axis starts from 0
                                        domain={[0, 'auto']}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend 
                                        verticalAlign="top" 
                                        height={36}
                                        wrapperStyle={{
                                            paddingBottom: '10px',
                                            fontSize: '12px'
                                        }}
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="income" 
                                        name="Income" 
                                        stroke="#4f46e5" 
                                        strokeWidth={2} 
                                        dot={{ r: 2 }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        
                        {/* Mobile-friendly summary */}
                        <div className="mt-4 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500 border-t border-gray-200 pt-4">
                            <div className="mb-2 sm:mb-0">
                                <span className="inline-block w-3 h-3 bg-blue-500 rounded-sm mr-1 align-middle"></span>
                                <span>Daily Income</span>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Customers Lists */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Paid Customers */}
                <div className="p-6 rounded-lg bg-white border border-gray-300 hover:shadow-lg transition-shadow duration-300 ">
                    <h2 className="text-xl font-black mb-4">Paid Customers</h2>
                    
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
                <div className="p-6 rounded-lg bg-white border border-gray-300 hover:shadow-lg transition-shadow duration-300 ">
                    <h2 className="text-xl font-black mb-4">Unpaid Customers</h2>
                    
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
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <h2 className="text-xl font-medium mb-2 md:mb-0">Total Income for {months[selectedMonth].label} {selectedYear}</h2>
                    <div className="text-2xl font-bold text-black-600">
                        {formatCurrency(dailyIncomeData.reduce((sum, day) => sum + day.income, 0))}
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default Incomes;