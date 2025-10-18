import React, { useState, useEffect } from 'react';
import PageLayout from '../../components/layout/PageLayout';
import PageHeader from '../../components/layout/PageHeader';
import Button1 from '../../components/UI/Button1';
import Button2 from '../../components/UI/Button2';
import { Link, useNavigate } from 'react-router-dom';
import adminDashboardService from '../../services/adminDashboardService';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [notificationCount, setNotificationCount] = useState(3);
    
    // API Data State
    const [dashboardStats, setDashboardStats] = useState(null);
    const [userTypeDistribution, setUserTypeDistribution] = useState({
        senior_lawyers: 0,
        junior_lawyers: 0,
        clients: 0,
        researchers: 0
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Admin user data
    const user = {
        name: 'Admin',
        email: 'admin@lawyermanagement.com',
        role: 'admin' 
    };

    // Pending message requests (dummy data - no API endpoint available)
    const messageRequests = [
        {
            id: 'MSG-001',
            from: 'Nimal Perera',
            role: 'lawyer',
            subject: 'System access issue',
            message: 'I am unable to access the case files section. Could you please check my permissions?',
            date: '2025-06-29',
            priority: 'high',
            avatar: 'NP'
        },
        {
            id: 'MSG-002',
            from: 'Amali Silva',
            role: 'junior_lawyer',
            subject: 'Account verification',
            message: 'My account is still showing as pending verification after 2 days. Can you expedite?',
            date: '2025-06-28',
            priority: 'medium',
            avatar: 'AS'
        },
        {
            id: 'MSG-003',
            from: 'Rohan Gunawardena',
            role: 'lawyer',
            subject: 'Client assignment',
            message: 'I need to assign a new client to my profile but the option is not available.',
            date: '2025-06-28',
            priority: 'medium',
            avatar: 'RG'
        },
        {
            id: 'MSG-004',
            from: 'Dilshan Fonseka',
            role: 'lawyer',
            subject: 'Payment gateway error',
            message: 'The payment gateway is showing errors when clients try to make payments.',
            date: '2025-06-27',
            priority: 'high',
            avatar: 'DF'
        }
    ];

    // Generate system stats from API data
    const generateSystemStats = () => {
        if (!dashboardStats) {
            // Return placeholder data while loading
            return [
                {
                    title: "Total Users",
                    value: "Loading...",
                    icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    ),
                    iconBg: "bg-blue-100 text-blue-600",
                    textColor: "text-blue-600"
                },
                {
                    title: "New Signups This Month",
                    value: "Loading...",
                    icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    ),
                    iconBg: "bg-green-100 text-green-600",
                    textColor: "text-green-600"
                },
                {
                    title: "Message Requests",
                    value: messageRequests.length.toString(),
                    icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                    ),
                    iconBg: "bg-yellow-100 text-yellow-600",
                    textColor: "text-yellow-600"
                },
                {
                    title: "Active Lawyers",
                    value: "Loading...",
                    icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    ),
                    iconBg: "bg-purple-100 text-purple-600",
                    textColor: "text-purple-600"
                }
            ];
        }
        
        const totalUsers = dashboardStats.totalLawyers + dashboardStats.totalJuniors + 
                          dashboardStats.totalClients + (dashboardStats.totalResearchers || 0);
        
        return [
            {
                title: "Total Users",
                value: totalUsers.toString(),
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                ),
                iconBg: "bg-blue-100 text-blue-600",
                textColor: "text-blue-600"
            },
            {
                title: "New Signups This Month",
                value: dashboardStats.newSignupsThisMonth?.toString() || "0",
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                ),
                iconBg: "bg-green-100 text-green-600",
                textColor: "text-green-600"
            },
            {
                title: "Message Requests",
                value: messageRequests.length.toString(),
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                ),
                iconBg: "bg-yellow-100 text-yellow-600",
                textColor: "text-yellow-600"
            },
            {
                title: "Active Lawyers",
                value: (dashboardStats.activeLawyers + dashboardStats.activeJuniors).toString(),
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    ),
                    iconBg: "bg-purple-100 text-purple-600",
                    textColor: "text-purple-600"
                }
            ];
        };

    const systemStats = generateSystemStats();

    // User type distribution data - now loaded from API

    // Recent user signups
    const recentSignups = [
        {
            id: 'USR-001',
            name: 'Kumara Rajapaksa',
            email: 'kumara.r@example.com',
            role: 'client',
            date: '2025-06-29',
            status: 'pending_verification',
            avatar: 'KR'
        },
        {
            id: 'USR-002',
            name: 'Manoj Fernando',
            email: 'manoj.f@example.com',
            role: 'lawyer',
            date: '2025-06-29',
            status: 'pending_approval',
            avatar: 'MF'
        },
        {
            id: 'USR-003',
            name: 'Thilini Silva',
            email: 'thilini@example.com',
            role: 'junior_lawyer',
            date: '2025-06-28',
            status: 'active',
            avatar: 'TS'
        },
        {
            id: 'USR-004',
            name: 'Deepika Perera',
            email: 'deepika@example.com',
            role: 'client',
            date: '2025-06-28',
            status: 'active',
            avatar: 'DP'
        },
        {
            id: 'USR-005',
            name: 'Samantha Liyanage',
            email: 'samantha@example.com',
            role: 'client',
            date: '2025-06-28',
            status: 'pending_verification',
            avatar: 'SL'
        }
    ];

    // Recent system activities
    const systemActivities = [
        {
            id: 'ACT-001',
            action: 'User approved',
            description: 'Senior lawyer account was approved',
            user: 'Admin',
            timestamp: '2025-06-29 14:25:30'
        },
        {
            id: 'ACT-002',
            action: 'Payment processed',
            description: 'Payment of $2,500 processed for case #CR-4231',
            user: 'System',
            timestamp: '2025-06-29 13:10:45'
        },
        {
            id: 'ACT-003',
            action: 'System update',
            description: 'Document management system updated to v2.3',
            user: 'Admin',
            timestamp: '2025-06-29 10:45:12'
        },
        {
            id: 'ACT-004',
            action: 'User blocked',
            description: 'Account USR-125 was temporarily blocked due to suspicious activity',
            user: 'System',
            timestamp: '2025-06-28 22:15:40'
        },
        {
            id: 'ACT-005',
            action: 'New case created',
            description: 'New case #CR-4245 was created by lawyer ID LWY-042',
            user: 'Nimal Perera',
            timestamp: '2025-06-28 16:30:22'
        }
    ];

    // Load dashboard data from API
    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                setIsLoading(true);
                setError('');
                
                // Load dashboard statistics and user distribution in parallel
                const [stats, distribution] = await Promise.all([
                    adminDashboardService.getDashboardStats(),
                    adminDashboardService.getUserTypeDistribution()
                ]);
                
                setDashboardStats(stats);
                setUserTypeDistribution(distribution);
                
            } catch (err) {
                setError(`Failed to load dashboard data: ${err.message}`);
                console.error('Error loading dashboard data:', err);
            } finally {
                setIsLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    const handleNotificationClick = () => {
        console.log('Admin notifications clicked');
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleUserAction = (action, userId) => {
        console.log(`Action ${action} for user ${userId}`);
        // Here you would implement the actual logic to approve/reject/verify users
    };

    const handleMessageAction = (action, msgId) => {
        console.log(`Message action ${action} for message ${msgId}`);
        // Here you would implement the actual logic to respond to messages
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

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    <div className="flex items-center">
                        <span className="mr-2">⚠️</span>
                        {error}
                    </div>
                    <p className="text-sm mt-2">Some data may be unavailable. Dummy data is shown where API data failed to load.</p>
                </div>
            )}

            {/* Loading State */}
            {isLoading && (
                <div className="mb-6 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded">
                    <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700 mr-2"></div>
                        Loading dashboard data...
                    </div>
                </div>
            )}

            {/* Page Title */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                    <p className="text-gray-600">System overview and management</p>
                </div>

            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {systemStats.map((stat, index) => (
                    <div 
                        key={index} 
                        className="p-6 rounded-lg bg-white border border-gray-300 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                    >
                        <div className="flex flex-col items-center">
                            <div className={`w-14 h-14 flex items-center justify-center text-2xl mb-3 rounded-full ${stat.iconBg}`}>
                                {stat.icon}
                            </div>
                            <div className="text-sm text-gray-600 font-medium">{stat.title}</div>
                            <div className={`text-xl font-bold mt-1 ${stat.textColor}`}>{stat.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Two column layout for user distribution chart and recent activities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* User Distribution Chart */}
                <div>
                    <h2 className="text-xl font-black mb-4">User Distribution</h2>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center">
                                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                                    <span className="text-sm">Senior Lawyers</span>
                                </div>
                                <span className="text-sm font-semibold">{userTypeDistribution.senior_lawyers}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${(userTypeDistribution.senior_lawyers / 256) * 100}%` }}></div>
                            </div>
                        </div>
                        
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center">
                                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                                    <span className="text-sm">Junior Lawyers</span>
                                </div>
                                <span className="text-sm font-semibold">{userTypeDistribution.junior_lawyers}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${(userTypeDistribution.junior_lawyers / 256) * 100}%` }}></div>
                            </div>
                        </div>
                        
                        <div className="mb-4">
                            <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center">
                                    <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                                    <span className="text-sm">Clients</span>
                                </div>
                                <span className="text-sm font-semibold">{userTypeDistribution.clients}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: `${(userTypeDistribution.clients / 256) * 100}%` }}></div>
                            </div>
                        </div>
                        
                        <div className="text-center mt-6">
                            <p className="text-lg font-semibold">Total Users: 256</p>
                        </div>
                    </div>
                </div>

                {/* Recent System Activities */}
                <div>
                    <h2 className="text-xl font-black mb-4">Recent Activities</h2>
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        {systemActivities.map((activity, index) => (
                            <div key={activity.id} className="p-4 border-b last:border-b-0 hover:bg-gray-50">
                                <div className="flex items-start">
                                    <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 mr-3"></div>
                                    <div className="flex-1">
                                        <div className="flex flex-col sm:flex-row sm:justify-between">
                                            <span className="font-medium">{activity.action}</span>
                                            <span className="text-xs text-gray-500">{activity.timestamp}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                                        <p className="text-xs text-gray-500 mt-1">By: {activity.user}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="bg-gray-50 p-3 text-center">
                            <Button2
                                text="View All Activities"
                                onClick={() => navigate("/admin/activities")}
                                className="text-sm"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent User Signups */}
            <div className="mb-8">
                <h2 className="text-xl font-black mb-4">Recent User Signups</h2>
                <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {recentSignups.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                                                    {user.avatar}
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                <div className="text-sm text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {user.role === 'lawyer' ? 'Senior Lawyer' : 
                                             user.role === 'junior_lawyer' ? 'Junior Lawyer' : 'Client'}
                                        </div>
                                        <div className="text-xs text-gray-500">ID: {user.id}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(user.date)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${user.status === 'active' ? 'bg-green-100 text-green-800' : 
                                              user.status === 'pending_verification' ? 'bg-yellow-100 text-yellow-800' :
                                              'bg-blue-100 text-blue-800'}`}>
                                            {user.status === 'active' ? 'Active' : 
                                             user.status === 'pending_verification' ? 'Pending Verification' :
                                             'Pending Approval'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end space-x-2">
                                            {user.status !== 'active' && (
                                                <button 
                                                    onClick={() => handleUserAction('approve', user.id)}
                                                    className="text-green-600 hover:text-green-900"
                                                >
                                                    Approve
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => navigate(`/admin/users/${user.id}`)}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                View
                                            </button>
                                            {user.status !== 'active' && (
                                                <button 
                                                    onClick={() => handleUserAction('reject', user.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Reject
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="bg-gray-50 px-6 py-3 flex justify-between items-center">
                        <span className="text-sm text-gray-700">
                            Showing <span className="font-medium">5</span> of <span className="font-medium">25</span> new users
                        </span>
                        <Button2
                            text="View All Users"
                            onClick={() => navigate("/admin/users")}
                            className="text-sm py-1 px-4"
                        />
                    </div>
                </div>
            </div>

            {/* Pending Message Requests */}
            <div className="mb-8">
                <h2 className="text-xl font-black mb-4">Message Requests from Lawyers</h2>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {messageRequests.map((message, index) => (
                        <div key={message.id} className="border-b last:border-b-0 hover:bg-gray-50">
                            <div className="p-4">
                                <div className="flex items-start">
                                    <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-white
                                        ${message.priority === 'high' ? 'bg-red-500' : 
                                          message.priority === 'medium' ? 'bg-orange-500' : 'bg-green-500'}`}>
                                        {message.avatar}
                                    </div>
                                    <div className="ml-4 flex-1">
                                        <div className="flex flex-col sm:flex-row sm:justify-between mb-1">
                                            <div>
                                                <span className="font-medium">{message.from}</span>
                                                <span className="text-xs text-gray-500 ml-2">({message.role === 'lawyer' ? 'Senior Lawyer' : 'Junior Lawyer'})</span>
                                            </div>
                                            <span className="text-xs text-gray-500">{formatDate(message.date)}</span>
                                        </div>
                                        <div className="mb-1 font-medium text-sm">{message.subject}</div>
                                        <p className="text-sm text-gray-600">{message.message}</p>
                                    </div>
                                </div>
                                <div className="mt-3 flex justify-end space-x-2">
                                    <Button2
                                        text="View Details"
                                        onClick={() => handleMessageAction('view', message.id)}
                                        className="text-xs py-1 px-3"
                                    />
                                    <Button1
                                        text="Respond"
                                        onClick={() => handleMessageAction('respond', message.id)}
                                        className="text-xs py-1 px-3"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="bg-gray-50 p-3 text-center">
                        <Button2
                            text="View All Messages"
                            onClick={() => navigate("/admin/messages")}
                            className="text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* System Health */}
            <div className="mb-8">
                <h2 className="text-xl font-black mb-4">System Health</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold">Server Status</h3>
                            <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">Operational</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: '76%' }}></div>
                            </div>
                            <span className="text-sm font-medium">76%</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">CPU utilization</p>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold">Database</h3>
                            <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">Healthy</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '42%' }}></div>
                            </div>
                            <span className="text-sm font-medium">42%</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Storage usage</p>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold">API Services</h3>
                            <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">All Operational</span>
                        </div>
                        <div className="text-3xl font-bold text-center">100%</div>
                        <p className="text-xs text-gray-500 mt-2 text-center">Uptime in last 30 days</p>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default AdminDashboard;