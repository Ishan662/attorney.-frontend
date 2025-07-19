import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout';
import PageHeader from '../../components/layout/PageHeader';
import Button1 from '../../components/UI/Button1';
import Button2 from '../../components/UI/Button2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title } from 'chart.js';
import { Pie, Line, Bar } from 'react-chartjs-2';
import ReportGenerator from './GenarateReport';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title);

const AdminAnalytics = () => {
    const navigate = useNavigate();
    const [notificationCount, setNotificationCount] = useState(3);
    const [timeRange, setTimeRange] = useState('month'); // 'week', 'month', 'year'
    const [chartType, setChartType] = useState('users'); // 'users', 'cases', 'revenue'
    const [showReportGenerator, setShowReportGenerator] = useState(false);

    // Admin user data
    const user = {
        name: 'Admin',
        email: 'admin@lawyermanagement.com',
        role: 'admin' 
    };

    // Sample data for analytics
    const analyticsData = {
        // User statistics
        userStats: {
            totalUsers: 256,
            activeUsers: 198,
            inactiveUsers: 58,
            growthRate: '+12%',
            newUsersThisMonth: 24
        },
        
        // Case statistics
        caseStats: {
            totalCases: 412,
            activeCases: 93,
            closedCases: 319,
            winRate: '74%',
            newCasesThisMonth: 18
        },
        
        // Revenue statistics
        revenueStats: {
            totalRevenue: '$247,500',
            currentMonthRevenue: '$32,450',
            revenueGrowth: '+8%',
            pendingPayments: '$15,680',
            averageCaseValue: '$2,660'
        }
    };

    // Data for User Distribution pie chart
    const userDistributionData = {
        labels: ['Senior Lawyers', 'Junior Lawyers', 'Clients'],
        datasets: [
            {
                data: [35, 48, 173],
                backgroundColor: ['#3B82F6', '#10B981', '#8B5CF6'],
                borderColor: ['#2563EB', '#059669', '#7C3AED'],
                borderWidth: 1,
            },
        ],
    };

    // Data for monthly trends line chart
    const getMonthlyTrendsData = () => {
        const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];

        switch(chartType) {
            case 'users':
                return {
                    labels,
                    datasets: [
                        {
                            label: 'New Users',
                            data: [12, 19, 15, 21, 22, 27, 24],
                            borderColor: '#3B82F6',
                            backgroundColor: 'rgba(59, 130, 246, 0.5)',
                            tension: 0.3
                        }
                    ]
                };
            case 'cases':
                return {
                    labels,
                    datasets: [
                        {
                            label: 'New Cases',
                            data: [8, 11, 14, 9, 16, 12, 18],
                            borderColor: '#10B981',
                            backgroundColor: 'rgba(16, 185, 129, 0.5)',
                            tension: 0.3
                        }
                    ]
                };
            case 'revenue':
                return {
                    labels,
                    datasets: [
                        {
                            label: 'Revenue ($K)',
                            data: [25, 31, 26, 34, 29, 38, 32],
                            borderColor: '#8B5CF6',
                            backgroundColor: 'rgba(139, 92, 246, 0.5)',
                            tension: 0.3
                        }
                    ]
                };
            default:
                return {
                    labels,
                    datasets: []
                };
        }
    };

    // Data for case types bar chart
    const caseTypesData = {
        labels: ['Civil', 'Criminal', 'Corporate', 'Family', 'Property', 'Other'],
        datasets: [
            {
                label: 'Active Cases by Type',
                data: [25, 18, 12, 22, 10, 6],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                    'rgba(255, 159, 64, 0.5)'
                ],
                borderColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 206, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(153, 102, 255)',
                    'rgb(255, 159, 64)'
                ],
                borderWidth: 1
            }
        ]
    };

    // Regional distribution data
    const regionalData = [
        { region: 'Colombo', users: 85, cases: 43, revenue: '$87,200' },
        { region: 'Kandy', users: 42, cases: 19, revenue: '$41,500' },
        { region: 'Galle', users: 37, cases: 12, revenue: '$33,200' },
        { region: 'Jaffna', users: 29, cases: 8, revenue: '$24,600' },
        { region: 'Negombo', users: 21, cases: 6, revenue: '$17,800' },
        { region: 'Other', users: 42, cases: 5, revenue: '$43,200' }
    ];

    // Performance metrics by lawyer type
    const performanceData = [
        { metric: 'Cases Handled', senior: 215, junior: 197 },
        { metric: 'Win Rate', senior: '81%', junior: '67%' },
        { metric: 'Client Satisfaction', senior: '4.8/5', junior: '4.2/5' },
        { metric: 'Avg. Resolution Time', senior: '68 days', junior: '92 days' },
        { metric: 'Revenue Generated', senior: '$178K', junior: '$69.5K' }
    ];

    // Handle notification click
    const handleNotificationClick = () => {
        console.log('Admin notifications clicked');
    };

    // Time range toggle handler
    const handleTimeRangeChange = (range) => {
        setTimeRange(range);
    };

    // Chart type toggle handler
    const handleChartTypeChange = (type) => {
        setChartType(type);
    };

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

            {/* Page Title */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
                    <p className="text-gray-600">System performance and trends analysis</p>
                </div>
                <Button1 
                    text="Generate Report" 
                    onClick={() => setShowReportGenerator(true)}
                    className="px-4"
                />
            </div>

            {/* Stats Cards Based on Active Tab */}
            <div className="mb-8">
                <div className="flex mb-6 border-b">
                    <button 
                        className={`py-2 px-4 font-medium ${chartType === 'users' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => handleChartTypeChange('users')}
                    >
                        Users
                    </button>
                    <button 
                        className={`py-2 px-4 font-medium ${chartType === 'cases' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => handleChartTypeChange('cases')}
                    >
                        Cases
                    </button>
                    <button 
                        className={`py-2 px-4 font-medium ${chartType === 'revenue' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => handleChartTypeChange('revenue')}
                    >
                        Revenue
                    </button>
                </div>

                {/* Dynamic stat cards based on selected tab */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {chartType === 'users' && (
                        <>
                            <div className="p-6 rounded-lg bg-white border border-gray-300 hover:shadow-lg transition-shadow duration-300">
                                <div className="flex flex-col items-center">
                                    <div className="w-14 h-14 flex items-center justify-center text-2xl mb-3 rounded-full bg-blue-100 text-blue-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    </div>
                                    <div className="text-sm text-gray-600 font-medium">Total Users</div>
                                    <div className="text-xl font-bold mt-1 text-blue-600">{analyticsData.userStats.totalUsers}</div>
                                </div>
                            </div>
                            
                            <div className="p-6 rounded-lg bg-white border border-gray-300 hover:shadow-lg transition-shadow duration-300">
                                <div className="flex flex-col items-center">
                                    <div className="w-14 h-14 flex items-center justify-center text-2xl mb-3 rounded-full bg-green-100 text-green-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div className="text-sm text-gray-600 font-medium">Active Users</div>
                                    <div className="text-xl font-bold mt-1 text-green-600">{analyticsData.userStats.activeUsers}</div>
                                </div>
                            </div>
                            
                            <div className="p-6 rounded-lg bg-white border border-gray-300 hover:shadow-lg transition-shadow duration-300">
                                <div className="flex flex-col items-center">
                                    <div className="w-14 h-14 flex items-center justify-center text-2xl mb-3 rounded-full bg-gray-100 text-gray-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                        </svg>
                                    </div>
                                    <div className="text-sm text-gray-600 font-medium">Inactive Users</div>
                                    <div className="text-xl font-bold mt-1 text-gray-600">{analyticsData.userStats.inactiveUsers}</div>
                                </div>
                            </div>
                            
                            <div className="p-6 rounded-lg bg-white border border-gray-300 hover:shadow-lg transition-shadow duration-300">
                                <div className="flex flex-col items-center">
                                    <div className="w-14 h-14 flex items-center justify-center text-2xl mb-3 rounded-full bg-purple-100 text-purple-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                        </svg>
                                    </div>
                                    <div className="text-sm text-gray-600 font-medium">Growth Rate</div>
                                    <div className="text-xl font-bold mt-1 text-purple-600">{analyticsData.userStats.growthRate}</div>
                                </div>
                            </div>
                            
                            <div className="p-6 rounded-lg bg-white border border-gray-300 hover:shadow-lg transition-shadow duration-300">
                                <div className="flex flex-col items-center">
                                    <div className="w-14 h-14 flex items-center justify-center text-2xl mb-3 rounded-full bg-yellow-100 text-yellow-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="text-sm text-gray-600 font-medium">New This Month</div>
                                    <div className="text-xl font-bold mt-1 text-yellow-600">{analyticsData.userStats.newUsersThisMonth}</div>
                                </div>
                            </div>
                        </>
                    )}

                    {chartType === 'cases' && (
                        <>
                            <div className="p-6 rounded-lg bg-white border border-gray-300 hover:shadow-lg transition-shadow duration-300">
                                <div className="flex flex-col items-center">
                                    <div className="w-14 h-14 flex items-center justify-center text-2xl mb-3 rounded-full bg-blue-100 text-blue-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div className="text-sm text-gray-600 font-medium">Total Cases</div>
                                    <div className="text-xl font-bold mt-1 text-blue-600">{analyticsData.caseStats.totalCases}</div>
                                </div>
                            </div>
                            
                            <div className="p-6 rounded-lg bg-white border border-gray-300 hover:shadow-lg transition-shadow duration-300">
                                <div className="flex flex-col items-center">
                                    <div className="w-14 h-14 flex items-center justify-center text-2xl mb-3 rounded-full bg-green-100 text-green-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                        </svg>
                                    </div>
                                    <div className="text-sm text-gray-600 font-medium">Active Cases</div>
                                    <div className="text-xl font-bold mt-1 text-green-600">{analyticsData.caseStats.activeCases}</div>
                                </div>
                            </div>
                            
                            <div className="p-6 rounded-lg bg-white border border-gray-300 hover:shadow-lg transition-shadow duration-300">
                                <div className="flex flex-col items-center">
                                    <div className="w-14 h-14 flex items-center justify-center text-2xl mb-3 rounded-full bg-gray-100 text-gray-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div className="text-sm text-gray-600 font-medium">Closed Cases</div>
                                    <div className="text-xl font-bold mt-1 text-gray-600">{analyticsData.caseStats.closedCases}</div>
                                </div>
                            </div>
                            
                            <div className="p-6 rounded-lg bg-white border border-gray-300 hover:shadow-lg transition-shadow duration-300">
                                <div className="flex flex-col items-center">
                                    <div className="w-14 h-14 flex items-center justify-center text-2xl mb-3 rounded-full bg-purple-100 text-purple-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    </div>
                                    <div className="text-sm text-gray-600 font-medium">Win Rate</div>
                                    <div className="text-xl font-bold mt-1 text-purple-600">{analyticsData.caseStats.winRate}</div>
                                </div>
                            </div>
                            
                            <div className="p-6 rounded-lg bg-white border border-gray-300 hover:shadow-lg transition-shadow duration-300">
                                <div className="flex flex-col items-center">
                                    <div className="w-14 h-14 flex items-center justify-center text-2xl mb-3 rounded-full bg-yellow-100 text-yellow-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="text-sm text-gray-600 font-medium">New This Month</div>
                                    <div className="text-xl font-bold mt-1 text-yellow-600">{analyticsData.caseStats.newCasesThisMonth}</div>
                                </div>
                            </div>
                        </>
                    )}

                    {chartType === 'revenue' && (
                        <>
                            <div className="p-6 rounded-lg bg-white border border-gray-300 hover:shadow-lg transition-shadow duration-300">
                                <div className="flex flex-col items-center">
                                    <div className="w-14 h-14 flex items-center justify-center text-2xl mb-3 rounded-full bg-blue-100 text-blue-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="text-sm text-gray-600 font-medium">Total Revenue</div>
                                    <div className="text-xl font-bold mt-1 text-blue-600">{analyticsData.revenueStats.totalRevenue}</div>
                                </div>
                            </div>
                            
                            <div className="p-6 rounded-lg bg-white border border-gray-300 hover:shadow-lg transition-shadow duration-300">
                                <div className="flex flex-col items-center">
                                    <div className="w-14 h-14 flex items-center justify-center text-2xl mb-3 rounded-full bg-green-100 text-green-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                                        </svg>
                                    </div>
                                    <div className="text-sm text-gray-600 font-medium">This Month</div>
                                    <div className="text-xl font-bold mt-1 text-green-600">{analyticsData.revenueStats.currentMonthRevenue}</div>
                                </div>
                            </div>
                            
                            <div className="p-6 rounded-lg bg-white border border-gray-300 hover:shadow-lg transition-shadow duration-300">
                                <div className="flex flex-col items-center">
                                    <div className="w-14 h-14 flex items-center justify-center text-2xl mb-3 rounded-full bg-purple-100 text-purple-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                        </svg>
                                    </div>
                                    <div className="text-sm text-gray-600 font-medium">Growth</div>
                                    <div className="text-xl font-bold mt-1 text-purple-600">{analyticsData.revenueStats.revenueGrowth}</div>
                                </div>
                            </div>
                            
                            <div className="p-6 rounded-lg bg-white border border-gray-300 hover:shadow-lg transition-shadow duration-300">
                                <div className="flex flex-col items-center">
                                    <div className="w-14 h-14 flex items-center justify-center text-2xl mb-3 rounded-full bg-yellow-100 text-yellow-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="text-sm text-gray-600 font-medium">Pending</div>
                                    <div className="text-xl font-bold mt-1 text-yellow-600">{analyticsData.revenueStats.pendingPayments}</div>
                                </div>
                            </div>
                            
                            <div className="p-6 rounded-lg bg-white border border-gray-300 hover:shadow-lg transition-shadow duration-300">
                                <div className="flex flex-col items-center">
                                    <div className="w-14 h-14 flex items-center justify-center text-2xl mb-3 rounded-full bg-red-100 text-red-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                    <div className="text-sm text-gray-600 font-medium">Avg Case Value</div>
                                    <div className="text-xl font-bold mt-1 text-red-600">{analyticsData.revenueStats.averageCaseValue}</div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* User Distribution Pie Chart */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-black">User Distribution</h2>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="h-64">
                            <Pie 
                                data={userDistributionData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            position: 'bottom'
                                        }
                                    }
                                }}
                            />
                        </div>
                        <div className="text-center mt-4">
                            <p className="text-sm text-gray-500">Distribution of users by role</p>
                        </div>
                    </div>
                </div>

                {/* Monthly Trends Line Chart */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-black">Monthly Trends</h2>
                        <div className="flex space-x-2">
                            <button 
                                className={`px-3 py-1 text-xs font-medium rounded-full ${timeRange === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                                onClick={() => handleTimeRangeChange('week')}
                            >
                                Week
                            </button>
                            <button 
                                className={`px-3 py-1 text-xs font-medium rounded-full ${timeRange === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                                onClick={() => handleTimeRangeChange('month')}
                            >
                                Month
                            </button>
                            <button 
                                className={`px-3 py-1 text-xs font-medium rounded-full ${timeRange === 'year' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                                onClick={() => handleTimeRangeChange('year')}
                            >
                                Year
                            </button>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="h-64">
                            <Line 
                                data={getMonthlyTrendsData()}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    scales: {
                                        y: {
                                            beginAtZero: true
                                        }
                                    },
                                    plugins: {
                                        legend: {
                                            display: true,
                                            position: 'top'
                                        },
                                        title: {
                                            display: false
                                        }
                                    }
                                }}
                            />
                        </div>
                        <div className="text-center mt-4">
                            <p className="text-sm text-gray-500">
                                {chartType === 'users' ? 'New user registrations by month' :
                                 chartType === 'cases' ? 'New cases opened by month' :
                                 'Monthly revenue trend'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bar Chart Row */}
            <div className="mb-8">
                <h2 className="text-xl font-black mb-4">Case Distribution by Type</h2>
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="h-80">
                        <Bar 
                            data={caseTypesData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                scales: {
                                    y: {
                                        beginAtZero: true
                                    }
                                },
                                plugins: {
                                    legend: {
                                        display: false
                                    }
                                }
                            }}
                        />
                    </div>
                    <div className="text-center mt-4">
                        <p className="text-sm text-gray-500">Distribution of active cases by legal category</p>
                    </div>
                </div>
            </div>

            {/* Tables Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Regional Distribution Table */}
                <div>
                    <h2 className="text-xl font-black mb-4">Regional Statistics</h2>
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Region
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Users
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Cases
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Revenue
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {regionalData.map((region, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {region.region}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {region.users}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {region.cases}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {region.revenue}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Performance Comparison */}
                <div>
                    <h2 className="text-xl font-black mb-4">Lawyer Performance</h2>
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Metric
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Senior Lawyers
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Junior Lawyers
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {performanceData.map((item, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {item.metric}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {item.senior}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {item.junior}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Export and Download Buttons */}
            <div className="flex justify-end space-x-4 mb-8">
                <Button2
                    text="Export as PDF"
                    onClick={() => console.log('Export as PDF')}
                    className="px-4 py-2"
                />
                <Button2
                    text="Download CSV"
                    onClick={() => console.log('Download CSV')}
                    className="px-4 py-2"
                />
                <Button2
                    text="Print Report"
                    onClick={() => console.log('Print Report')}
                    className="px-4 py-2"
                />
            </div>
            <ReportGenerator
                isOpen={showReportGenerator}
                onClose={() => setShowReportGenerator(false)}
                analyticsData={analyticsData}
                chartType={chartType}
                timeRange={timeRange}
            />
        </PageLayout>
    );
};

export default AdminAnalytics;