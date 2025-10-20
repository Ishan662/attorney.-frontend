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
                
                // Fetch hearings data (only available endpoint for now)
                const hearingsData = await clientDashboardService.getUpcomingHearings();
                
                // Format and set hearings data
                const formattedHearings = hearingsData.map(hearing => 
                    clientDashboardService.formatHearingForDisplay(hearing)
                );
                setUpcomingHearings(formattedHearings);
                
                // TODO: Uncomment when backend endpoints are implemented
                // const meetingsData = await clientDashboardService.getUpcomingMeetings();
                // const formattedMeetings = meetingsData.map(meeting => 
                //     clientDashboardService.formatMeetingForDisplay(meeting)
                // );
                // setUpcomingMeetings(formattedMeetings);
                
                // For now, set meetings to empty array
                setUpcomingMeetings([]);
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
                    <h2 className="text-xl font-bold mb-4">Upcoming Meetings</h2>
                    {/* TODO: Remove this when meetings endpoint is implemented */}
                    <div className="p-6 text-center">
                        <div className="text-gray-400 text-4xl mb-3">🚧</div>
                        <p className="text-gray-500 font-medium">Coming Soon</p>
                        <p className="text-gray-400 text-sm mt-1">Meetings feature will be available once the backend endpoint is implemented</p>
                    </div>
                    
                    {/* Uncomment this section when meetings endpoint is ready
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
                            {upcomingMeetings.map((meeting) => (
                                <div
                                    key={meeting.id}
                                    className="bg-gray-50 rounded-lg border border-gray-200 p-4"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="font-medium text-gray-800">Lawyer: {meeting.lawyerName}</div>
                                        <span className={`
                                            px-3 py-1 rounded-full text-xs font-medium
                                            ${meeting.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : ''}
                                            ${meeting.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : ''}
                                            ${meeting.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : ''}
                                            ${meeting.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' : ''}
                                        `}>
                                            {meeting.status}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {meeting.displayDate} {meeting.time && `at ${meeting.time}`}
                                    </div>
                                    {meeting.note && (
                                        <div className="text-sm text-gray-500 mt-1">{meeting.note}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                    */}
                    
                    <div className="mt-4">
                        <Button1
                            text="Request Meeting"
                            onClick={() => navigate("/client/meetingrequest")}
                        />
                    </div>
                </div>

                {/* Upcoming Hearings */}
                <div className="bg-white rounded-lg shadow-md p-4">
                    <h2 className="text-xl font-bold mb-4">Upcoming Hearings</h2>
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
                            {upcomingHearings.map((hearing) => (
                                <div
                                    key={hearing.caseId}
                                    className="bg-gray-50 rounded-lg border border-gray-200 p-4"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="font-medium text-gray-800">{hearing.caseTitle}</div>
                                        <span className={`
                                            px-3 py-1 rounded-full text-xs font-medium
                                            ${hearing.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' : ''}
                                            ${hearing.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : ''}
                                            ${hearing.status === 'POSTPONED' ? 'bg-red-100 text-red-800' : ''}
                                            ${hearing.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : ''}
                                            ${hearing.status === 'COMPLETED' ? 'bg-gray-100 text-gray-800' : ''}
                                        `}>
                                            {hearing.status}
                                        </span>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-sm text-gray-600">Court: {hearing.court}</div>
                                        <div className="text-sm text-gray-600">
                                            {hearing.displayDate} {hearing.time && `at ${hearing.time}`}
                                        </div>
                                        {hearing.note && (
                                            <div className="text-sm text-gray-500 mt-1">{hearing.note}</div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </PageLayout>
    );
};

export default ClientDashboard;
