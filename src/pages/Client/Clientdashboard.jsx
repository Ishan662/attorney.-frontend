import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/layout/PageLayout";
import PageHeader from "../../components/layout/PageHeader";
import Button1 from "../../components/UI/Button1";
import { getDashboardData } from "../../services/clientDashboardService"; // <-- import service

const ClientDashboard = () => {
    const navigate = useNavigate();
    const [notificationCount, setNotificationCount] = useState(2);
    const [upcomingMeetings, setUpcomingMeetings] = useState([]);
    const [upcomingHearings, setUpcomingHearings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Example logged-in user (replace with auth context if available)
    const user = {
        id: "0d9b1b4e-7a56-4a7f-b71d-9e3512d534c3", // Replace with actual logged-in userId
        name: "Nethsilu Marasinghe",
        email: "kasuntharamarasinghe.com",
        role: "client",
    };

    const sidebarItems = [
        { title: "Dashboard", path: "/client/dashboard" },
        { title: "Case Profiles", path: "/client/caseprofiles" },
        { title: "Calendar", path: "/client/calendar" },
        { title: "Meeting Request", path: "/client/meetingrequest" },
        { title: "Payments", path: "/client/payments" },
    ];

    // Format date
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    // Fetch upcoming hearings & meetings using service
    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                setLoading(true);
                const { hearings, meetings } = await getDashboardData(user.id); // <-- service call
                setUpcomingHearings(hearings);
                setUpcomingMeetings(meetings);
            } catch (err) {
                console.error(err);
                setError("Error loading dashboard data");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, [user.id]);

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
                    {upcomingMeetings.length === 0 ? (
                        <p className="text-gray-500">No upcoming meetings.</p>
                    ) : (
                        <div className="space-y-4">
                            {upcomingMeetings.map((meeting) => (
                                <div
                                    key={meeting.id}
                                    className="bg-gray-50 rounded-lg border border-gray-200 p-4"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="font-medium text-gray-800">
                                            Lawyer: {meeting.lawyerName || "Unknown"}
                                        </div>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium
                                            ${meeting.status === "Pending" ? "bg-yellow-100 text-yellow-800" : ""}
                                            ${meeting.status === "Confirmed" ? "bg-green-100 text-green-800" : ""}
                                            ${meeting.status === "Rescheduled" ? "bg-red-100 text-red-800" : ""}
                                        `}
                                        >
                                            {meeting.status || "Unknown"}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {formatDate(meeting.meetingDate)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
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
                    {upcomingHearings.length === 0 ? (
                        <p className="text-gray-500">No upcoming hearings.</p>
                    ) : (
                        <div className="space-y-4">
                            {upcomingHearings.map((hearing) => (
                                <div
                                    key={hearing.caseId}
                                    className="bg-gray-50 rounded-lg border border-gray-200 p-4"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="font-medium text-gray-800">
                                            {hearing.caseTitle || "Untitled Case"}
                                        </div>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium
                                            ${hearing.status === "Scheduled" ? "bg-blue-100 text-blue-800" : ""}
                                            ${hearing.status === "Confirmed" ? "bg-green-100 text-green-800" : ""}
                                            ${hearing.status === "Postponed" ? "bg-red-100 text-red-800" : ""}
                                        `}
                                        >
                                            {hearing.status || "Scheduled"}
                                        </span>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-sm text-gray-600">
                                            Court: {hearing.courtName || "Unknown"}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {formatDate(hearing.hearingDate)}{" "}
                                            {hearing.hearingTime && `at ${hearing.hearingTime}`}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="mt-4">
                        <Button1
                            text="View Calendar"
                            onClick={() => navigate("/client/calendar")}
                        />
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default ClientDashboard;
