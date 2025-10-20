import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/layout/PageLayout";
import PageHeader from "../../components/layout/PageHeader";
import Button1 from "../../components/UI/Button1";
import PricingPopupV2 from "../../components/pricing/PricingPopupV2";
import { getMySubscription, cancelMySubscription } from "../../services/subscriptionService";
import IncomeChart from "../../components/charts/IncomeChart";
import { lawyerDashboardService } from "../../services/lawyerDashboardService";

const Dashboard = () => {
    const navigate = useNavigate();
    const [notificationCount] = useState(3);
    const [isPricingPopupOpen, setIsPricingPopupOpen] = useState(false);
    const [subscription, setSubscription] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // --- ▼▼▼ ADDED STATE FOR CANCELLATION PROCESS ▼▼▼ ---
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [isCanceling, setIsCanceling] = useState(false);
    const [hearings, setHearings] = useState([]);
    const [isLoadingHearings, setIsLoadingHearings] = useState(true);
    const [hearingsError, setHearingsError] = useState(null);
    
    // Income chart state
    const [incomeData, setIncomeData] = useState([]);
    const [isLoadingIncome, setIsLoadingIncome] = useState(true);
    const [incomeError, setIncomeError] = useState(null);

    const [user, setUser] = useState({
        name: 'Nishagi Jewantha',
        email: 'jeewanthadeherath@gmail.com',
        role: 'LAWYER',
    });

    // Load dashboard data from backend
    useEffect(() => {
        const loadDashboardData = async () => {
            // Load today's hearings
            try {
                setIsLoadingHearings(true);
                setHearingsError(null);
                
                const hearingsData = await lawyerDashboardService.getTodaysHearings();
                
                // Format hearings for display
                const formattedHearings = hearingsData.map(hearing => 
                    lawyerDashboardService.formatHearingForDisplay(hearing)
                );
                
                setHearings(formattedHearings);
            } catch (error) {
                console.error('Error loading today\'s hearings:', error);
                setHearingsError('Failed to load today\'s hearings. Please try again later.');
            } finally {
                setIsLoadingHearings(false);
            }

            // Load income chart data
            try {
                setIsLoadingIncome(true);
                setIncomeError(null);
                
                const incomeChartData = await lawyerDashboardService.getIncomeChart();
                setIncomeData(incomeChartData);
            } catch (error) {
                console.error('Error loading income chart data:', error);
                setIncomeError('Failed to load income data. Please try again later.');
            } finally {
                setIsLoadingIncome(false);
            }
        };

        loadDashboardData();
    }, []);



    useEffect(() => {
        const fetchSubscription = async () => {
            try {
                const subData = await getMySubscription();
                setSubscription(subData);
            } catch (error) {
                console.error("Dashboard error:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSubscription();
    }, []);

    const calculateDaysLeft = (endDateStr) => {
        if (!endDateStr) return 0;
        const endDate = new Date(endDateStr);
        const now = new Date();
        const diffTime = endDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return 28 > 0 ? 28 : diffDays;
    };
    
    // --- ▼▼▼ ADDED HANDLER FOR SUBSCRIPTION CANCELLATION ▼▼▼ ---
    const handleCancelSubscription = async () => {
        setIsCanceling(true);
        try {
            await cancelMySubscription();
            setIsCancelModalOpen(false);
            // Reload the page to get the updated subscription status
            window.location.reload();
        } catch (error) {
            alert(error.message || "Failed to cancel subscription.");
        } finally {
            setIsCanceling(false);
        }
    };

    const handleNotificationClick = () => {};
    const handleStatCardClick = (title) => {
        if (title === "Timeline") navigate("/lawyer/timeline");
        else if (title === "Incomes") navigate("/lawyer/incomes");
        else if (title === "Day Summary") navigate("/lawyer/day-summary");
        else if (title === "Due Payments") navigate("/lawyer/duepayments");
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

    // Remove the static hearings array - now using state from backend

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

    return (
        <PageLayout user={user}>
            <div className="mb-8">
                <PageHeader
                    user={user}
                    notificationCount={notificationCount}
                    onNotificationClick={handleNotificationClick}
                    subscription={subscription}
                    onCancelSubscription={() => setIsCancelModalOpen(true)}
                />
            </div>

            {subscription &&  (subscription.status === 'TRIAL' || subscription.status === 'CANCELLED') && (
                <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl shadow-md">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-4 animate-pulse"></div>
                            <div>
                                <div className="flex items-center mb-1">
                                    <span className="text-yellow-800 font-semibold text-lg">Free Trial Active</span>
                                    <span className="ml-2 bg-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
                                        {calculateDaysLeft(subscription.endDate)} days left
                                    </span>
                                </div>
                                <p className="text-yellow-700 text-sm">
                                    Upgrade now to unlock premium features and continue your legal practice without interruptions
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsPricingPopupOpen(true)}
                            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                        >
                            Upgrade Now
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="p-6 rounded-lg bg-white border border-gray-300 hover:shadow-lg transition-shadow duration-300 cursor-pointer transform hover:scale-105"
                        onClick={() => handleStatCardClick(stat.title)}
                    >
                        <div className="flex flex-col items-center">
                            <div className="w-14 h-14 flex items-center bg-gray-50 justify-center text-2xl mb-3 rounded-full shadow-sm">{stat.icon}</div>
                            <div className="text-sm text-gray-600 font-medium text-center">{stat.title}</div>
                            <div className="text-xl font-bold mt-1 text-black-800">{stat.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Hearings to attend today</h2>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {isLoadingHearings ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading today's hearings...</p>
                        </div>
                    ) : hearingsError ? (
                        <div className="p-8 text-center">
                            <div className="text-red-500 mb-4">⚠️</div>
                            <p className="text-red-600 mb-4">{hearingsError}</p>
                            <button 
                                onClick={() => window.location.reload()}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
                            >
                                Retry
                            </button>
                        </div>
                    ) : hearings.length === 0 ? (
                        <div className="p-8 text-center">
                            <div className="text-gray-400 text-4xl mb-4">📅</div>
                            <p className="text-gray-600 mb-2">No hearings scheduled for today</p>
                            <p className="text-gray-500 text-sm">Enjoy a lighter day!</p>
                        </div>
                    ) : (
                        hearings.map((hearing, index) => (
                            <div key={hearing.id || index} className="flex justify-between items-center p-4 
                                                           border-b last:border-b-0 hover:bg-gray-50 
                                                           transition-colors duration-200">
                                <div>
                                    <div className="font-medium">{hearing.displayName}</div>
                                    {hearing.hearingTime && (
                                        <div className="text-sm text-gray-500 mt-1">
                                            🕐 {hearing.hearingTime}
                                        </div>
                                    )}
                                    {hearing.court && (
                                        <div className="text-xs text-gray-400 mt-1">
                                            📍 {hearing.court}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Income Chart and Meeting Requests - Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Income Chart - Takes 2/3 of the width */}
                <div className="lg:col-span-2">
                    <IncomeChart 
                        data={incomeData} 
                        loading={isLoadingIncome} 
                        error={incomeError} 
                    />
                </div>

                {/* Meeting Requests - Takes 1/3 of the width */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-lg p-6 h-full">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Meeting Requests</h3>
                        {meetings.length === 0 ? (
                            <div className="flex items-center justify-center h-32 text-gray-500">
                                <div className="text-center">
                                    <div className="text-3xl mb-2">📅</div>
                                    <p className="text-sm">No meeting requests</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-80 overflow-y-auto">
                                {meetings.map((meeting, index) => {
                                    const { formattedDate, day } = formatMeetingDate(meeting.date);
                                    return (
                                        <div key={index} className="border border-gray-200 rounded-lg p-3 
                                                                   hover:bg-gray-50 transition-colors duration-200">
                                            <div className="flex flex-col space-y-2">
                                                <div className="font-medium text-gray-900 text-sm">{meeting.name}</div>
                                                <div className="text-xs text-gray-500">
                                                    {formattedDate} • {day}
                                                    {meeting.caseId && (
                                                        <div className="mt-1">Case # {meeting.caseId}</div>
                                                    )}
                                                </div>
                                                <div className="flex justify-end">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${meeting.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
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
                        )}
                    </div>
                </div>
            </div>



            {/* Pricing Popup */}
            <PricingPopupV2
                isOpen={isPricingPopupOpen}
                onClose={() => setIsPricingPopupOpen(false)}
                showSkipButton={true}
            />

            {isCancelModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-8 shadow-2xl w-full max-w-md text-center">
                        <h2 className="text-xl font-bold mb-4">Are you sure?</h2>
                        <p className="text-gray-600 mb-6">
                            Your subscription will be canceled. You will lose access to premium features at the end of your current billing period.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Button1
                                text="Never Mind"
                                onClick={() => setIsCancelModalOpen(false)}
                                className="bg-gray-200 hover:bg-gray-300"
                                disabled={isCanceling}
                            />
                            <Button1
                                text={isCanceling ? "Canceling..." : "Yes, Cancel"}
                                onClick={handleCancelSubscription}
                                className="bg-red-600 hover:bg-red-700 text-white"
                                disabled={isCanceling}
                            />
                        </div>
                    </div>
                </div>
            )}
        </PageLayout>
    );
}

export default Dashboard;