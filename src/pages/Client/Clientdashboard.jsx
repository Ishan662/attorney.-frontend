import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/layout/PageLayout";
import PageHeader from "../../components/layout/PageHeader";
import Button1 from "../../components/UI/Button1";
import Button2 from "../../components/UI/Button2";
import { clientDashboardService } from "../../services/clientDashboardService";

const ClientDashboard = () => {
    const navigate = useNavigate();
    const [notificationCount, setNotificationCount] = useState(2);
    const [upcomingHearings, setUpcomingHearings] = useState([]);
    const [upcomingMeetings, setUpcomingMeetings] = useState([]);
    const [duePayments, setDuePayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleNotificationClick = () => {
        console.log('Notifications clicked');
        // Navigate to notifications page or open notification panel
    };

    // Fetch dashboard data on component mount
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Fetch hearings data
                const hearingsData = await clientDashboardService.getUpcomingHearings();
                
                // Format and set hearings data
                const formattedHearings = hearingsData.map(hearing => 
                    clientDashboardService.formatHearingForDisplay(hearing)
                );
                setUpcomingHearings(formattedHearings);
                
                // Fetch meetings data
                const meetingsData = await clientDashboardService.getUpcomingMeetings();
                const formattedMeetings = meetingsData.map(meeting => 
                    clientDashboardService.formatMeetingForDisplay(meeting)
                );
                setUpcomingMeetings(formattedMeetings);
                
                // For now, set due payments to empty array (until endpoint is implemented)
                setDuePayments([]);
                
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
                setError(error.message);
                // Fallback to empty arrays if fetch fails
                setUpcomingHearings([]);
                setUpcomingMeetings([]);
                setDuePayments([]);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Sidebar navigation items for client
    const sidebarItems = [
        { title: "Dashboard", path: "/client/dashboard" },
        { title: "Case Profiles", path: "/client/caseprofiles" },
        { title: "Calendar", path: "/client/calendar" },
        { title: "Meeting Request", path: "/client/meetingrequest" },
        { title: "Payments", path: "/client/payments" },
    ];

    // Format date helper
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const user = {
        name: "Nethsilu Marasinghe",
        email: "kasuntharamarasinghe@gmail.com",
        role: "client",
    };

    if (loading) {
        return (
            <PageLayout user={user} sidebarItems={sidebarItems}>
                <div className="text-center mt-20 text-gray-600">Loading dashboard data...</div>
            </PageLayout>
        );
    }

    if (error) {
        return (
            <PageLayout user={user} sidebarItems={sidebarItems}>
                <div className="text-center mt-20 text-red-600">{error}</div>
            </PageLayout>
        );
    }

    return (
        <PageLayout user={user} sidebarItems={sidebarItems}>
            {/* Header */}
            <div className="mb-8">
                <PageHeader
                    user={user}
                    notificationCount={notificationCount}
                    onNotificationClick={() => console.log("Notifications clicked")}
                />
            </div>

            <div className="grid grid-cols-1 gap-6">
                {/* Upcoming Meetings */}
                <div className="bg-white rounded-lg shadow-md p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Upcoming Meetings</h2>
                        <button
                            onClick={() => navigate("/client/meetingrequest")}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                            Request Meeting →
                        </button>
                    </div>
                    {loading ? (
                        <div className="p-6 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                            <p className="mt-2 text-gray-500">Loading upcoming meetings...</p>
                        </div>
                    ) : error ? (
                        <div className="p-6 text-center">
                            <div className="text-red-500 mb-2">⚠️</div>
                            <p className="text-red-600 font-medium">Failed to load meetings</p>
                            <p className="text-gray-500 text-sm mt-1">{error}</p>
                            <button 
                                onClick={() => window.location.reload()}
                                className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                                Retry
                            </button>
                        </div>
                    ) : upcomingMeetings.length === 0 ? (
                        <div className="p-6 text-center">
                            <div className="text-gray-400 text-4xl mb-3">🗓️</div>
                            <p className="text-gray-500 font-medium">No upcoming meetings</p>
                            <p className="text-gray-400 text-sm mt-1">Your meeting schedule is clear</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {upcomingMeetings.slice(0, 3).map((meeting) => (
                                <div
                                    key={meeting.id}
                                    className="bg-gray-50 rounded-lg border border-gray-200 p-4 hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <div className="font-medium text-gray-800">{meeting.title}</div>
                                            <div className="text-sm text-gray-600 mt-1">Case: {meeting.caseTitle}</div>
                                        </div>
                                        <span className={`
                                            px-3 py-1 rounded-full text-xs font-medium
                                            ${meeting.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : ''}
                                            ${meeting.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : ''}
                                            ${meeting.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : ''}
                                            ${meeting.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' : ''}
                                            ${meeting.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' : ''}
                                        `}>
                                            {meeting.status}
                                        </span>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                            </svg>
                                            {meeting.displayDate} {meeting.time && `• ${meeting.time}`}
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            {meeting.isVirtual ? (
                                                <>
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                                                    </svg>
                                                    Virtual Meeting
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                    </svg>
                                                    {meeting.location}
                                                </>
                                            )}
                                        </div>
                                        {meeting.caseId && (
                                            <div className="text-xs text-gray-400 mt-1">Case ID: {meeting.caseId}</div>
                                        )}
                                        {meeting.note && (
                                            <div className="text-sm text-gray-500 mt-2 p-2 bg-blue-50 rounded border-l-4 border-blue-200">
                                                <span className="font-medium">Note:</span> {meeting.note}
                                            </div>
                                        )}
                                        {meeting.googleMeetLink && (
                                            <div className="mt-2">
                                                <a
                                                    href={meeting.googleMeetLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
                                                >
                                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                                                    </svg>
                                                    Join Meeting
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {upcomingMeetings.length > 3 && (
                                <div className="text-center pt-2">
                                    <button
                                        onClick={() => navigate("/client/meetingrequest")}
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                    >
                                        View {upcomingMeetings.length - 3} more meetings →
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                    

                </div>

                {/* Upcoming Hearings */}
                <div className="bg-white rounded-lg shadow-md p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Upcoming Hearings</h2>
                        <button
                            onClick={() => navigate("/client/clientcalendar")}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                            View Calendar →
                        </button>
                    </div>
                    {loading ? (
                        <div className="p-6 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                            <p className="mt-2 text-gray-500">Loading upcoming hearings...</p>
                        </div>
                    ) : error ? (
                        <div className="p-6 text-center">
                            <div className="text-red-500 mb-2">⚠️</div>
                            <p className="text-red-600 font-medium">Failed to load hearings</p>
                            <p className="text-gray-500 text-sm mt-1">{error}</p>
                            <button 
                                onClick={() => window.location.reload()}
                                className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                                Retry
                            </button>
                        </div>
                    ) : upcomingHearings.length === 0 ? (
                        <div className="p-6 text-center">
                            <div className="text-gray-400 text-4xl mb-3">⚖️</div>
                            <p className="text-gray-500 font-medium">No upcoming hearings</p>
                            <p className="text-gray-400 text-sm mt-1">No court dates scheduled</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {upcomingHearings.slice(0, 3).map((hearing) => (
                                <div
                                    key={hearing.id}
                                    className="bg-gray-50 rounded-lg border border-gray-200 p-4 hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <div className="font-medium text-gray-800">{hearing.caseTitle}</div>
                                            {hearing.title && hearing.title !== hearing.caseTitle && (
                                                <div className="text-sm text-gray-600 mt-1">{hearing.title}</div>
                                            )}
                                        </div>
                                        <span className={`
                                            px-3 py-1 rounded-full text-xs font-medium
                                            ${hearing.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' : ''}
                                            ${hearing.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : ''}
                                            ${hearing.status === 'POSTPONED' ? 'bg-yellow-100 text-yellow-800' : ''}
                                            ${hearing.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : ''}
                                            ${hearing.status === 'COMPLETED' ? 'bg-gray-100 text-gray-800' : ''}
                                        `}>
                                            {hearing.status}
                                        </span>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                            </svg>
                                            {hearing.court}
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                            </svg>
                                            {hearing.displayDate} {hearing.time && `• ${hearing.time}`}
                                        </div>
                                        {hearing.caseId && (
                                            <div className="text-xs text-gray-400 mt-1">Case ID: {hearing.caseId}</div>
                                        )}
                                        {hearing.note && (
                                            <div className="text-sm text-gray-500 mt-2 p-2 bg-blue-50 rounded border-l-4 border-blue-200">
                                                <span className="font-medium">Note:</span> {hearing.note}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {upcomingHearings.length > 3 && (
                                <div className="text-center pt-2">
                                    <button
                                        onClick={() => navigate("/client/clientcalendar")}
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                    >
                                        View {upcomingHearings.length - 3} more hearings →
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </PageLayout>
    );
};

export default ClientDashboard;
