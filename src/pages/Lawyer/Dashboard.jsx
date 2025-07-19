import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/layout/PageLayout";
import PageHeader from "../../components/layout/PageHeader"; 
import Button1 from "../../components/UI/Button1";
import Button2 from "../../components/UI/Button2";
import Input1 from "../../components/UI/Input1";

const Dashboard = () => {
    const navigate = useNavigate();
    const [notificationCount, setNotificationCount] = useState(3);

    const user = {
        name: 'Nishagi Jewantha',
        email: 'jeewanthadeherath@gmail.com',
        role: 'LAWYER',
    };

    const handleNotificationClick = () => {
        console.log('Notifications clicked');
        // Here you could navigate to notifications page or open a notification panel
    };

    // Handle card click to navigate to specific pages
    const handleStatCardClick = (title) => {
        if (title === "Timeline") {
            navigate("/lawyer/timeline");
        }
        else if (title === "Incomes") {
            navigate("/lawyer/incomes");
        } 
        else if (title === "Day Summary")  {
            navigate("/lawyer/day-summary");
        }
        else if(title === "Due Payments") {
            navigate("/lawyer/duepayments");
        }
        // Add other navigation options as needed
    };

    // Mock data for the dashboard
    const stats = [
        { 
            title: "Due Payments", 
            value: "$2,500", 
            icon: "💰", 
            bgColor: "bg-white",
            iconBg: "bg-black-200",
            textColor: "text-black-800"
        },
        { 
            title: "Timeline", 
            value: "12 Items", 
            icon: "⏱️", 
            bgColor: "bg-black-100",
            iconBg: "bg-black-200", 
            textColor: "text-black-800"
        },
        { 
            title: "Incomes", 
            value: "$8,750", 
            icon: "📈", 
            bgColor: "bg-black-100",
            iconBg: "bg-black-200", 
            textColor: "text-black-800"
        },
        { 
            title: "Day Summary", 
            value: "5 Activities", 
            icon: "📋", 
            bgColor: "bg-black-100",
            iconBg: "bg-black-200", 
            textColor: "text-black-800"
        }
    ];

    const hearings = [
        { id: "332844", name: "H.M.N.J. Deerasinha", action: "Magistrate" },
        { id: "332445", name: "Jaman Perera", action: "Videos" },
        { id: "332446", name: "Kumala Silva", action: "Details" }
    ];

    // Dynamic date for meetings
    const formatMeetingDate = (dateStr) => {
        const date = new Date(dateStr);
        return {
            formattedDate: date.toLocaleDateString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric'
            }),
            day: date.toLocaleDateString('en-US', { weekday: 'long' })
        };
    };

    const meetings = [
        { 
            name: "H.M.N.J. Deerasinha", 
            date: "2023-06-17", 
            status: "Pending",
            caseId: null
        },
        { 
            name: "Nimal Bandara", 
            date: "2023-06-17", 
            status: "Confirmed",
            caseId: "332447"
        },
        { 
            name: "Priya Fernando", 
            date: "2023-06-10", 
            status: "Rescheduled",
            caseId: null
        }
    ];

    const monthlyIncome = "$7,500";

    return (
        <PageLayout user={user}>
            {/* Header */}
            <div className="mb-8">
                <PageHeader 
                    user={user} 
                    notificationCount={notificationCount} 
                    onNotificationClick={handleNotificationClick}
                />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, index) => (
                    <div 
                        key={index} 
                        className="p-6 rounded-lg bg-white border border-gray-300 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                        onClick={() => handleStatCardClick(stat.title)}
                    >
                        <div className="flex flex-col items-center">
                            <div className={`w-14 h-6 flex items-center bg-white justify-center text-2xl mb-3 rounded-full ${stat.iconBg}`}>
                                {stat.icon}
                            </div>
                            <div className="text-sm text-gray-600 font-medium">{stat.title}</div>
                            <div className={`text-xl font-bold mt-1 ${stat.textColor}`}>{stat.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Hearings Section */}
            <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Hearings to attend today</h2>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {hearings.map((hearing, index) => (
                        <div key={index} className="flex justify-between items-center p-4 border-b last:border-b-0">
                            <div>
                                <div className="text-sm text-gray-500">Case # {hearing.id}</div>
                                <div>{hearing.name}</div>
                            </div>
                            <Button2 
                                text={hearing.action} 
                                className="text-sm py-1 px-4"
                            />
                        </div>
                    ))}
                    <div className="p-2">
                        <Button1 
                            text="Add a case"
                            onClick={() => navigate("/lawyer/newcaseprofile")}

                        />
                    </div>
                </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Monthly Income Section */}
                <div>
                    <h2 className="text-xl font-black mb-4">Monthly Income</h2>
                    <div className="bg-white rounded-lg shadow-md p-4">
                        <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center text-gray-500">
                            Monthly Income Chart
                        </div>
                        <div className="text-2xl font-bold mt-4 text-green-700">{monthlyIncome}</div>
                    </div>
                </div>

                {/* Meeting Requests Section */}
                <div>
                    <h2 className="text-xl font-black mb-4">Meeting Requests</h2>
                    <div className="bg-white rounded-lg shadow-md">
                        {meetings.map((meeting, index) => {
                            const { formattedDate, day } = formatMeetingDate(meeting.date);
                            return (
                                <div key={index} className="border-b last:border-b-0 p-4">
                                    <div className="flex justify-between">
                                        <div>
                                            <div className="font-medium">{meeting.name}</div>
                                            <div className="text-sm text-gray-500">
                                                {formattedDate} • {day}
                                                {meeting.caseId && <div>Case # {meeting.caseId}</div>}
                                            </div>
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
                                    </div>
                                    {meeting.status === 'Rescheduled' && (
                                        <div className="mt-2 flex justify-center">
                                            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Overall Analytics Section */}
            <div>
                <h2 className="text-xl font-black mb-4">Overall Analytics</h2>
                <div className="bg-white rounded-lg shadow-md p-4">
                    <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center text-gray-500">
                        Overall Analytics Chart
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}

export default Dashboard;