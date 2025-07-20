import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaChevronDown } from "react-icons/fa";
import Sidebar from "../../components/layout/Sidebar";

const Clientpayments = () => {
    const navigate = useNavigate();
    const [mainSidebarExpanded, setMainSidebarExpanded] = useState(true);
    const [paymentStatusFilter, setPaymentStatusFilter] = useState("All");
    const [caseTypeFilter, setCaseTypeFilter] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    // Mock user data
    const user = {
        name: 'Nishagi Jewantha',
        email: 'nishagijewantha@gmail.com',
        role: 'client',
    };

    // Mock payment data
    const paymentData = [
        {
            id: 1,
            caseTitle: "Land Case",
            seniorLawyer: "Nadun Hasalanka",
            acceptedFee: "Rs 25,000/-",
            paidAmount: "Rs 10,000/-",
            remainingPayment: "Rs 15,000/-",
            status: "Pending",
            caseType: "Land"
        },
        {
            id: 2,
            caseTitle: "House Case",
            seniorLawyer: "Dappula De Livera",
            acceptedFee: "Rs 35,000/-",
            paidAmount: "Rs 35,000/-",
            remainingPayment: "No",
            status: "Paid",
            caseType: "Property"
        }
    ];

    // Filter payment data based on search and filters
    const filteredPayments = paymentData.filter(payment => {
        const matchesSearch = payment.caseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            payment.seniorLawyer.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = paymentStatusFilter === "All" || payment.status === paymentStatusFilter;
        const matchesType = caseTypeFilter === "All" || payment.caseType === caseTypeFilter;
        
        return matchesSearch && matchesStatus && matchesType;
    });

    // Get status badge styling
    const getStatusBadge = (status) => {
        switch (status) {
            case "Paid":
                return "bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium";
            case "Pending":
                return "bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium";
            default:
                return "bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium";
        }
    };

    // Get payment button styling
    const getPaymentButton = (status, remainingPayment) => {
        if (status === "Paid" || remainingPayment === "No") {
            return (
                <button 
                    className="bg-gray-400 text-white px-6 py-2 rounded-lg cursor-not-allowed"
                    disabled
                >
                    Paid
                </button>
            );
        }
        return (
            <button 
                className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                onClick={() => handlePayment()}
            >
                Pay
            </button>
        );
    };

    const handlePayment = () => {
        // Handle payment logic here
        console.log("Processing payment...");
    };

    return (
        <div className="h-screen bg-gray-100 flex">
            {/* Main Navigation Sidebar */}
            <Sidebar 
                user={user} 
                defaultExpanded={mainSidebarExpanded}
                onToggle={setMainSidebarExpanded}
            />
            
            {/* Main Content */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${mainSidebarExpanded ? 'ml-64' : 'ml-20'}`}>
                {/* Header */}
                <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-6">
                    <h1 className="text-3xl font-bold text-gray-800">Payments</h1>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-6 overflow-y-auto">
                    {/* Search and Filters */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                        <div className="flex flex-col md:flex-row gap-4 items-center">
                            {/* Search Bar */}
                            <div className="relative flex-1 max-w-md">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search cases..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Payment Status Filter */}
                            <div className="relative">
                                <select
                                    value={paymentStatusFilter}
                                    onChange={(e) => setPaymentStatusFilter(e.target.value)}
                                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="All">Payment Status</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Paid">Paid</option>
                                </select>
                                <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={12} />
                            </div>

                            {/* Case Type Filter */}
                            <div className="relative">
                                <select
                                    value={caseTypeFilter}
                                    onChange={(e) => setCaseTypeFilter(e.target.value)}
                                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="All">Case Type</option>
                                    <option value="Land">Land</option>
                                    <option value="Property">Property</option>
                                    <option value="Contract">Contract</option>
                                    <option value="Family">Family</option>
                                </select>
                                <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={12} />
                            </div>
                        </div>
                    </div>

                    {/* Payment Cards */}
                    <div className="space-y-4">
                        {filteredPayments.map((payment) => (
                            <div key={payment.id} className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                                {/* Case Title and Status */}
                                <div className="flex justify-between items-start mb-4">
                                    <h2 className="text-xl font-bold text-gray-800">{payment.caseTitle}</h2>
                                    <span className={getStatusBadge(payment.status)}>
                                        {payment.status}
                                    </span>
                                </div>

                                {/* Payment Details - Vertical List */}
                                <div className="space-y-3 mb-6">
                                    <div className="flex left-between items-center py-2  border-gray-200">
                                        <span className="text-sm font-medium text-gray-600">Senior Lawyer :</span>
                                        <span className="text-gray-800 font-medium">{payment.seniorLawyer}</span>
                                    </div>
                                    <div className="flex left-between items-center py-2 border-gray-200">
                                        <span className="text-sm font-medium text-gray-600">Accepted Fee :</span>
                                        <span className="text-gray-800 font-medium">{payment.acceptedFee}</span>
                                    </div>
                                    <div className="flex left-between items-center py-2 border-gray-200">
                                        <span className="text-sm font-medium text-gray-600">Paid :</span>
                                        <span className="text-gray-800 font-medium">{payment.paidAmount}</span>
                                    </div>
                                    <div className="flex left-between items-center py-2">
                                        <span className="text-sm font-medium text-gray-600">Remaining Payment :</span>
                                        <span className="text-gray-800 font-medium">{payment.remainingPayment}</span>
                                    </div>
                                </div>

                                {/* Payment Button */}
                                <div className="flex justify-end">
                                    {getPaymentButton(payment.status, payment.remainingPayment)}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* No Results Message */}
                    {filteredPayments.length === 0 && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                            <div className="text-gray-400 mb-4">
                                <FaSearch size={48} className="mx-auto" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
                            <p className="text-gray-500">Try adjusting your search criteria or filters.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Clientpayments;
