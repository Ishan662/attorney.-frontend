import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/layout/PageLayout";
import PageHeader from "../../components/layout/PageHeader";
import Button1 from "../../components/UI/Button1";
import Button2 from "../../components/UI/Button2";
import PricingPopupV2 from "../../components/pricing/PricingPopupV2";

const Dashboard = () => {
    const navigate = useNavigate();
    const [notificationCount] = useState(3);
    const [isPricingPopupOpen, setIsPricingPopupOpen] = useState(false);

    const user = {
        name: 'Nishagi Jewantha',
        email: 'jeewanthadeherath@gmail.com',
        role: 'LAWYER',
        plan: 'FREE_TRIAL', // This could come from your auth context or API
        trialDaysLeft: 28, // This could come from your backend
    };

    const handleNotificationClick = () => {
        // Handle notifications - navigate to notifications page or open panel
    };

    // Handle card click to navigate to specific pages
    const handleStatCardClick = (title) => {
        if (title === "Timeline") {
            navigate("/lawyer/timeline");
        }
        else if (title === "Incomes") {
            navigate("/lawyer/incomes");
        }
        else if (title === "Day Summary") {
            navigate("/lawyer/day-summary");
        }
        else if (title === "Due Payments") {
            navigate("/lawyer/duepayments");
        }
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

            {/* Free Trial Banner */}
            {user.plan === 'FREE_TRIAL' && (
                <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 
                              border border-yellow-200 rounded-xl shadow-md">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-4 animate-pulse"></div>
                            <div>
                                <div className="flex items-center mb-1">
                                    <span className="text-yellow-800 font-semibold text-lg">
                                        Free Trial Active
                                    </span>
                                    <span className="ml-2 bg-yellow-200 text-yellow-800 text-xs 
                                                   px-2 py-1 rounded-full font-medium">
                                        {user.trialDaysLeft} days left
                                    </span>
                                </div>
                                <p className="text-yellow-700 text-sm">
                                    Upgrade now to unlock premium features and continue your legal practice
                                    without interruptions
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsPricingPopupOpen(true)}
                            className="bg-gradient-to-r from-yellow-500 to-orange-500 
                                     hover:from-yellow-600 hover:to-orange-600 text-white px-6 py-3 
                                     rounded-lg font-semibold transition-all duration-200 shadow-md 
                                     hover:shadow-lg transform hover:scale-105"
                        >
                            Upgrade Now
                        </button>
                    </div>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="p-6 rounded-lg bg-white border border-gray-300 
                                  hover:shadow-lg transition-shadow duration-300 cursor-pointer
                                  transform hover:scale-105"
                        onClick={() => handleStatCardClick(stat.title)}
                    >
                        <div className="flex flex-col items-center">
                            <div className={`w-14 h-14 flex items-center bg-gray-50 justify-center 
                                           text-2xl mb-3 rounded-full ${stat.iconBg} shadow-sm`}>
                                {stat.icon}
                            </div>
                            <div className="text-sm text-gray-600 font-medium text-center">{stat.title}</div>
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
                        <div key={index} className="flex justify-between items-center p-4 
                                                   border-b last:border-b-0 hover:bg-gray-50 
                                                   transition-colors duration-200">
                            <div>
                                <div className="text-sm text-gray-500">Case # {hearing.id}</div>
                                <div className="font-medium">{hearing.name}</div>
                            </div>
                            <Button2
                                text={hearing.action}
                                className="text-sm py-1 px-4"
                            />
                        </div>
                    ))}
                    <div className="p-4">
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
                    <h2 className="text-xl font-bold mb-4">Monthly Income</h2>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg h-64 
                                      flex items-center justify-center text-gray-500">
                            <div className="text-center">
                                <div className="text-4xl mb-2">📊</div>
                                <div>Monthly Income Chart</div>
                            </div>
                        </div>
                        <div className="text-3xl font-bold mt-6 text-green-600">{monthlyIncome}</div>
                        <div className="text-sm text-gray-500 mt-1">Total earnings this month</div>
                    </div>
                </div>

                {/* Meeting Requests Section */}
                <div>
                    <h2 className="text-xl font-bold mb-4">Meeting Requests</h2>
                    <div className="bg-white rounded-lg shadow-md">
                        {meetings.map((meeting, index) => {
                            const { formattedDate, day } = formatMeetingDate(meeting.date);
                            return (
                                <div key={index} className="border-b last:border-b-0 p-4 
                                                           hover:bg-gray-50 transition-colors duration-200">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="font-medium text-gray-900">{meeting.name}</div>
                                            <div className="text-sm text-gray-500 mt-1">
                                                {formattedDate} • {day}
                                                {meeting.caseId && (
                                                    <div className="mt-1">Case # {meeting.caseId}</div>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${meeting.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    meeting.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                                                        'bg-red-100 text-red-800'
                                                }`}>
                                                {meeting.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Overall Analytics Section */}
            <div>
                <h2 className="text-xl font-bold mb-4">Overall Analytics</h2>
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg h-64 
                                  flex items-center justify-center text-gray-500">
                        <div className="text-center">
                            <div className="text-4xl mb-2">📈</div>
                            <div>Overall Analytics Chart</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pricing Popup */}
            <PricingPopupV2
                isOpen={isPricingPopupOpen}
                onClose={() => setIsPricingPopupOpen(false)}
                showSkipButton={true}
            />
        </PageLayout>
    );
}

export default Dashboard;
