import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/layout/PageLayout";
import PageHeader from "../../components/layout/PageHeader";
import Button1 from "../../components/UI/Button1";
import Button2 from "../../components/UI/Button2";
import PricingPopupV2 from "../../components/pricing/PricingPopupV2";
import { getMySubscription, cancelMySubscription } from "../../services/subscriptionService";

const Dashboard = () => {
    const navigate = useNavigate();
    const [notificationCount] = useState(3);
    const [isPricingPopupOpen, setIsPricingPopupOpen] = useState(false);
    const [subscription, setSubscription] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // --- ▼▼▼ ADDED STATE FOR CANCELLATION PROCESS ▼▼▼ ---
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [isCanceling, setIsCanceling] = useState(false);

    const [user, setUser] = useState({
        name: 'Nishagi Jewantha',
        email: 'jeewanthadeherath@gmail.com',
        role: 'LAWYER',
    });

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

    // --- Mock Data ---
    const stats = [ { title: "Due Payments", value: "$2,500", icon: "💰" }, { title: "Timeline", value: "12 Items", icon: "⏱️" }, { title: "Incomes", value: "$8,750", icon: "📈" }, { title: "Day Summary", value: "5 Activities", icon: "📋" }];
    const hearings = [ { id: "332844", name: "H.M.N.J. Deerasinha", action: "Magistrate" }, { id: "332445", name: "Jaman Perera", action: "Videos" }, { id: "332446", name: "Kumala Silva", action: "Details" }];
    const formatMeetingDate = (dateStr) => { const date = new Date(dateStr); return { formattedDate: date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }), day: date.toLocaleDateString('en-US', { weekday: 'long' }) }; };
    const meetings = [ { name: "H.M.N.J. Deerasinha", date: "2023-06-17", status: "Pending", caseId: null }, { name: "Nimal Bandara", date: "2023-06-17", status: "Confirmed", caseId: "332447" }, { name: "Priya Fernando", date: "2023-06-10", status: "Rescheduled", caseId: null }];
    const monthlyIncome = "$7,500";
    // --- End Mock Data ---

    if (isLoading) {
        return <PageLayout user={user}><div className="p-6">Loading dashboard...</div></PageLayout>;
    }

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
                    {hearings.map((hearing, index) => (
                        <div key={index} className="flex justify-between items-center p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors duration-200">
                            <div>
                                <div className="text-sm text-gray-500">Case # {hearing.id}</div>
                                <div className="font-medium">{hearing.name}</div>
                            </div>
                            <Button2 text={hearing.action} className="text-sm py-1 px-4" />
                        </div>
                    ))}
                    <div className="p-4">
                        <Button1 text="Add a case" onClick={() => navigate("/lawyer/newcaseprofile")} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div>
                    <h2 className="text-xl font-bold mb-4">Monthly Income</h2>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg h-64 flex items-center justify-center text-gray-500">
                            <div className="text-center"><div className="text-4xl mb-2">📊</div><div>Monthly Income Chart</div></div>
                        </div>
                        <div className="text-3xl font-bold mt-6 text-green-600">{monthlyIncome}</div>
                        <div className="text-sm text-gray-500 mt-1">Total earnings this month</div>
                    </div>
                </div>
                <div>
                    <h2 className="text-xl font-bold mb-4">Meeting Requests</h2>
                    <div className="bg-white rounded-lg shadow-md">
                        {meetings.map((meeting, index) => {
                            const { formattedDate, day } = formatMeetingDate(meeting.date);
                            return (
                                <div key={index} className="border-b last:border-b-0 p-4 hover:bg-gray-50 transition-colors duration-200">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="font-medium text-gray-900">{meeting.name}</div>
                                            <div className="text-sm text-gray-500 mt-1">
                                                {formattedDate} • {day}
                                                {meeting.caseId && (<div className="mt-1">Case # {meeting.caseId}</div>)}
                                            </div>
                                        </div>
                                        <div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${meeting.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : meeting.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{meeting.status}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div>
                <h2 className="text-xl font-bold mb-4">Overall Analytics</h2>
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg h-64 flex items-center justify-center text-gray-500">
                        <div className="text-center"><div className="text-4xl mb-2">📈</div><div>Overall Analytics Chart</div></div>
                    </div>
                </div>
            </div>

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