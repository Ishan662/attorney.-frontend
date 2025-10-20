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
    const [supportRequests, setSupportRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Admin user data
    const user = {
        name: 'Admin',
        email: 'admin@lawyermanagement.com',
        role: 'admin' 
    };



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
                    title: "Support Requests",
                    value: "Loading...",
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
                title: "Support Requests",
                value: supportRequests.length.toString(),
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

    // User type distribution data - now loaded from API

    const systemStats = generateSystemStats();

    // Load dashboard data from API
    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                setIsLoading(true);
                setError('');
                
                // Load dashboard statistics, user distribution, and support requests in parallel
                const [stats, distribution, requests] = await Promise.all([
                    adminDashboardService.getDashboardStats(),
                    adminDashboardService.getUserTypeDistribution(),
                    adminDashboardService.getLawyerSupportRequests()
                ]);
                
                setDashboardStats(stats);
                setUserTypeDistribution(distribution);
                
                // Format support requests for display
                const formattedRequests = requests.map(request => 
                    adminDashboardService.formatSupportRequestForDisplay(request)
                );
                setSupportRequests(formattedRequests);
                
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

    const handleMessageAction = (action, requestId) => {
        console.log(`Support request action ${action} for request ${requestId}`);
        // Here you would implement the actual logic to handle support requests
        // For now, navigate to a detailed view or show a modal
        if (action === 'respond') {
            navigate(`/admin/support-requests/${requestId}`);
        }
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

            {/* Two column layout for user distribution chart and message requests */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* User Distribution Chart */}
                <div>
                    <h2 className="text-xl font-black mb-4">Law Firm User Distribution</h2>
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
                        
                    </div>
                </div>

                {/* Support Requests from Lawyers */}
                <div>
                    <h2 className="text-xl font-black mb-4">Support Requests from Lawyers</h2>
                    <div className="bg-white rounded-lg shadow-md overflow-hidden max-h-96 overflow-y-auto">
                        {supportRequests.length === 0 ? (
                            <div className="p-6 text-center text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                                <p>No support requests at the moment</p>
                            </div>
                        ) : (
                            supportRequests.slice(0, 4).map((request, index) => (
                                <div key={request.id} className="border-b last:border-b-0 hover:bg-gray-50">
                                    <div className="p-4">
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                                                {request.lawyerName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                                            </div>
                                            <div className="ml-3 flex-1">
                                                <div className="flex flex-col sm:flex-row sm:justify-between mb-1">
                                                    <div>
                                                        <span className="font-medium text-sm">{request.lawyerName}</span>
                                                        <span className="text-xs text-gray-500 ml-1">({request.lawyerEmail})</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <span className={`text-xs px-2 py-1 rounded-full ${request.statusColor}`}>
                                                            {request.status}
                                                        </span>
                                                        <span className="text-xs text-gray-500">{request.createdAt}</span>
                                                    </div>
                                                </div>
                                                <div className="mb-1 font-medium text-xs">{request.subject}</div>
                                                <div className="mt-2 flex justify-end space-x-1">
                                                    <button
                                                        onClick={() => handleMessageAction('respond', request.id)}
                                                        className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                                    >
                                                        View Details
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                        {supportRequests.length > 0 && (
                            <div className="bg-gray-50 p-3 text-center">
                                <Button2
                                    text="View All Support Requests"
                                    onClick={() => navigate("/admin/support-requests")}
                                    className="text-sm"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default AdminDashboard;