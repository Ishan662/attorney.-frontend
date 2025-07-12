import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/layout/PageLayout";
import PageHeader from "../../components/layout/PageHeader";
import Button1 from "../../components/UI/Button1";
import Button2 from "../../components/UI/Button2";

const ClientDashboard = () => {
    const navigate = useNavigate();
    const [notificationCount, setNotificationCount] = useState(2);

    const user = {
        name: 'Nethsilu Marasinghe',
        email: 'kasuntharamarasinghe.com',
    };

    const handleNotificationClick = () => {
        console.log('Notifications clicked');
        // Navigate to notifications page or open notification panel
    };

    // Sidebar navigation items for client
    const sidebarItems = [
        { title: "Dashboard", path: "/client/dashboard" },
        { title: "Case Profiles", path: "/client/caseprofiles" },
        { title: "Calendar", path: "/client/calendar" },
        { title: "Meeting Request", path: "/client/meetingrequest" },
        { title: "Payments", path: "/client/payments" },
    ];

    // Mock data for due payments
    const duePayments = [
        { id: 1, caseName: "Case A", amount: "$1,200", dueDate: "2023-07-10" },
        { id: 2, caseName: "Case B", amount: "$850", dueDate: "2023-07-15" },
    ];

    // Mock data for upcoming meetings
    const upcomingMeetings = [
        { id: 1, lawyerName: "Nishagi Jewantha", date: "2023-07-12", status: "Confirmed" },
        { id: 2, lawyerName: "John Doe", date: "2023-07-18", status: "Pending" },
    ];

    // Format date helper
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <PageLayout user={user} sidebarItems={sidebarItems}>
            {/* Header */}
            <div className="mb-8">
                <PageHeader 
                    user={user} 
                    notificationCount={notificationCount} 
                    onNotificationClick={handleNotificationClick}
                />
            </div>

            {/* Dashboard Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Due Payments Box */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">Due Payments</h2>
                    {duePayments.length === 0 ? (
                        <p className="text-gray-500">No due payments.</p>
                    ) : (
                        <ul>
                            {duePayments.map(payment => (
                                <li key={payment.id} className="border-b last:border-b-0 py-3 flex justify-between items-center">
                                    <div>
                                        <div className="font-medium">{payment.caseName}</div>
                                        <div className="text-sm text-gray-500">Due: {formatDate(payment.dueDate)}</div>
                                    </div>
                                    <div className="text-red-600 font-semibold">{payment.amount}</div>
                                </li>
                            ))}
                        </ul>
                    )}
                    <div className="mt-4">
                        <Button1 
                            text="View All Payments"
                            onClick={() => navigate("/client/payments")}
                        />
                    </div>
                </div>

                {/* Upcoming Meetings Box */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">Upcoming Meetings</h2>
                    {upcomingMeetings.length === 0 ? (
                        <p className="text-gray-500">No upcoming meetings.</p>
                    ) : (
                        <ul>
                            {upcomingMeetings.map(meeting => (
                                <li key={meeting.id} className="border-b last:border-b-0 py-3 flex justify-between items-center">
                                    <div>
                                        <div className="font-medium">Lawyer: {meeting.lawyerName}</div>
                                        <div className="text-sm text-gray-500">{formatDate(meeting.date)}</div>
                                    </div>
                                    <div>
                                        <span className={`
                                            px-3 py-1 rounded-full text-xs font-medium
                                            ${meeting.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                                            ${meeting.status === 'Confirmed' ? 'bg-green-100 text-green-800' : ''}
                                            ${meeting.status === 'Rescheduled' ? 'bg-red-100 text-red-800' : ''}
                                        `}>
                                            {meeting.status}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                    <div className="mt-4">
                        <Button1 
                            text="Request Meeting"
                            onClick={() => navigate("/client/meetingrequest")}
                        />
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default ClientDashboard;
