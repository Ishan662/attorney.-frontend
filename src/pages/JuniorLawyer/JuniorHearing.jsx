import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/layout/PageHeader";
import PageLayout from "../../components/layout/PageLayout";

const JuniorHearings = () => {
    const navigate = useNavigate();
    const [notificationCount, setNotificationCount] = useState(2);
    const [selectedFilter, setSelectedFilter] = useState("all");

    const user = {
        name: 'Sujan Darshana',
        email: 'sujan@example.com',
        role: 'junior_lawyer'
    };

    const handleNotificationClick = () => {
        // Custom notification logic
    };

    const handleBackToDashboard = () => {
        navigate("/junior/dashboard");
    };

    // Sample hearings data
    const hearings = [
        {
            id: "1001",
            caseName: "Estate of Smith",
            caseNumber: "EST/2024/001",
            date: "2024-07-10",
            time: "09:00 AM",
            court: "Colombo District Court",
            courtroom: "Court Room 3",
            judge: "Hon. Justice Perera",
            status: "Today",
            priority: "High",
            type: "Estate Hearing",
            description: "Final hearing for estate distribution",
            documents: ["Will Document", "Asset Valuation", "Beneficiary List"]
        },
        {
            id: "1002",
            caseName: "Guardianship of Lee",
            caseNumber: "GUA/2024/005",
            date: "2024-07-12",
            time: "02:30 PM",
            court: "Kandy District Court",
            courtroom: "Court Room 1",
            judge: "Hon. Justice Silva",
            status: "Upcoming",
            priority: "Medium",
            type: "Guardianship Hearing",
            description: "Review of guardianship arrangements",
            documents: ["Medical Reports", "Social Worker Report", "Financial Statement"]
        },
        {
            id: "1003",
            caseName: "Property Dispute - Fernando vs. Dias",
            caseNumber: "PRO/2024/012",
            date: "2024-07-15",
            time: "10:15 AM",
            court: "Galle District Court",
            courtroom: "Court Room 2",
            judge: "Hon. Justice Wickramasinghe",
            status: "This Week",
            priority: "High",
            type: "Property Dispute",
            description: "Boundary dispute resolution hearing",
            documents: ["Survey Report", "Title Deeds", "Witness Statements"]
        },
        {
            id: "1004",
            caseName: "Contract Breach - ABC Ltd vs. XYZ Corp",
            caseNumber: "COM/2024/008",
            date: "2024-07-18",
            time: "11:00 AM",
            court: "Colombo Commercial Court",
            courtroom: "Court Room 5",
            judge: "Hon. Justice Rajapaksa",
            status: "Next Week",
            priority: "Medium",
            type: "Commercial Dispute",
            description: "Contract breach damages assessment",
            documents: ["Contract Agreement", "Email Correspondence", "Financial Records"]
        }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case "Today":
                return "bg-red-100 text-red-800";
            case "Upcoming":
                return "bg-blue-100 text-blue-800";
            case "This Week":
                return "bg-yellow-100 text-yellow-800";
            case "Next Week":
                return "bg-green-100 text-green-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "High":
                return "bg-red-100 text-red-800";
            case "Medium":
                return "bg-yellow-100 text-yellow-800";
            case "Low":
                return "bg-green-100 text-green-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const filteredHearings = hearings.filter(hearing => {
        if (selectedFilter === "all") return true;
        if (selectedFilter === "today") return hearing.status === "Today";
        if (selectedFilter === "upcoming") return hearing.status === "Upcoming";
        if (selectedFilter === "thisweek") return hearing.status === "This Week";
        return true;
    });

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <PageLayout user={user}>
            <div className='mb-8'>
                <PageHeader
                    user={user}
                    notificationCount={notificationCount}
                    onNotificationClick={handleNotificationClick}
                />
            </div>

            {/* Page Title and Navigation */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Upcoming Hearings</h1>
                    <p className="text-gray-600 mt-1">Manage your scheduled court hearings</p>
                </div>
                
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2 mb-6">
                <button
                    onClick={() => setSelectedFilter("all")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedFilter === "all"
                            ? "bg-black-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                    All Hearings ({hearings.length})
                </button>
                <button
                    onClick={() => setSelectedFilter("today")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedFilter === "today"
                            ? "bg-black-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                    Today ({hearings.filter(h => h.status === "Today").length})
                </button>
                <button
                    onClick={() => setSelectedFilter("upcoming")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedFilter === "upcoming"
                            ? "bg-black-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                    Upcoming ({hearings.filter(h => h.status === "Upcoming").length})
                </button>
                <button
                    onClick={() => setSelectedFilter("thisweek")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedFilter === "thisweek"
                            ? "bg-black-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                    This Week ({hearings.filter(h => h.status === "This Week").length})
                </button>
            </div>

            {/* Hearings List */}
            <div className="space-y-4">
                {filteredHearings.map((hearing) => (
                    <div key={hearing.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                        <div className="p-6">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-semibold text-gray-900">{hearing.caseName}</h3>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(hearing.status)}`}>
                                            {hearing.status}
                                        </span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(hearing.priority)}`}>
                                            {hearing.priority} Priority
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600">Case #{hearing.caseNumber} • {hearing.type}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-semibold text-gray-900">{hearing.time}</div>
                                    <div className="text-sm text-gray-600">{formatDate(hearing.date)}</div>
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Court Details</h4>
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-600">📍 {hearing.court}</p>
                                        <p className="text-sm text-gray-600">🏛️ {hearing.courtroom}</p>
                                        <p className="text-sm text-gray-600">⚖️ {hearing.judge}</p>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Case Information</h4>
                                    <p className="text-sm text-gray-600">{hearing.description}</p>
                                </div>
                            </div>

                            {/* Documents */}
                            <div className="mb-4">
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Required Documents</h4>
                                <div className="flex flex-wrap gap-2">
                                    {hearing.documents.map((doc, index) => (
                                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                                            📄 {doc}
                                        </span>
                                    ))}
                                </div>
                                <Button1 text="Add Documents" className="mt-2" />
                            </div>

                            {/* Actions */}
                            {/* <div className="flex gap-2 pt-4 border-t border-gray-200">
                                <Button1 className="text-sm px-4 py-2">
                                    View Case Details
                                </Button1>
                                <Button2 className="text-sm px-4 py-2">
                                    Add to Calendar
                                </Button2>
                                <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                                    Set Reminder
                                </button>
                            </div> */}
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredHearings.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">📅</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No hearings found</h3>
                    <p className="text-gray-600">No hearings match your current filter selection.</p>
                </div>
            )}

            
        </PageLayout>
    );
};

export default JuniorHearings;
