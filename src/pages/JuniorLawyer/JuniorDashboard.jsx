import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/layout/PageHeader";
import PageLayout from "../../components/layout/PageLayout";
import { juniorCaseService } from "../../services/juniorCaseService";

const JuniorDashboard = () => {
    const navigate = useNavigate();
    const [notificationCount, setNotificationCount] = useState(2);
    
    // State for assigned cases
    const [assignedCases, setAssignedCases] = useState([]);
    const [isLoadingCases, setIsLoadingCases] = useState(true);
    const [casesError, setCasesError] = useState(null);

    const user = {
        name: 'Sujan Darshana',
        email: 'sujan@example.com',
        role: 'junior_lawyer'
    };

    // Load assigned cases from backend
    useEffect(() => {
        const loadAssignedCases = async () => {
            try {
                setIsLoadingCases(true);
                setCasesError(null);
                
                const casesData = await juniorCaseService.getAssignedCases();
                
                // Format cases for display
                const formattedCases = casesData.map(caseData => 
                    juniorCaseService.formatCaseForDisplay(caseData)
                );
                
                setAssignedCases(formattedCases);
            } catch (error) {
                console.error('Error loading assigned cases:', error);
                setCasesError('Failed to load assigned cases. Please try again later.');
            } finally {
                setIsLoadingCases(false);
            }
        };

        loadAssignedCases();
    }, []);

    const handleNotificationClick = () => {
        // Custom notification logic
    };

    const handleStatCardClick = (title) => {
        if (title === "Assigned Cases") {
            navigate("/junior/cases");
        } else if (title === "Upcoming Hearings") {
            navigate("/junior/hearings");
        } else if (title === "Tasks") {
            navigate("/junior/tasks");
        }
    };

    const stats = [
        {
            title: "Assigned Cases",
            value: isLoadingCases ? "..." : assignedCases.length.toString(),
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
            iconBg: "bg-blue-100",
            textColor: "text-blue-800"
        },
        {
            title: "Upcoming Hearings",
            value: isLoadingCases ? "..." : assignedCases.filter(c => c.nextHearing && new Date(c.nextHearing) > new Date()).length.toString(),
            icon: (
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
            iconBg: "bg-green-100",
            textColor: "text-green-800"
        },
        {
            title: "Tasks",
            value: "5",
            icon: (
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
            ),
            iconBg: "bg-yellow-100",
            textColor: "text-yellow-800"
        }
    ];

    // Mock data for tasks - TODO: Replace with real backend data when tasks endpoint is available
    const tasks = [
        { id: 1, title: "Draft Affidavit", due: "2024-07-11", status: "Pending" },
        { id: 2, title: "Prepare Evidence", due: "2024-07-13", status: "In Progress" }
    ];

    return (
        <PageLayout user={user}>
            <div className='mb-8'>
                <PageHeader
                    user={user}
                    notificationCount={notificationCount}
                    onNotificationClick={handleNotificationClick}
                />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="p-6 rounded-lg bg-white border border-gray-300 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                        onClick={() => handleStatCardClick(stat.title)}
                    >
                        <div className="flex flex-col items-center">
                            <div className={`w-14 h-14 flex items-center justify-center mb-3 rounded-full ${stat.iconBg}`}>
                                {stat.icon}
                            </div>
                            <div className="text-sm text-gray-600 font-medium">{stat.title}</div>
                            <div className={`text-xl font-bold mt-1 ${stat.textColor}`}>{stat.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Assigned Cases Section */}
            <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Your Assigned Cases</h2>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {isLoadingCases ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading assigned cases...</p>
                        </div>
                    ) : casesError ? (
                        <div className="p-8 text-center">
                            <div className="text-red-500 mb-4">⚠️</div>
                            <p className="text-red-600 mb-4">{casesError}</p>
                            <button 
                                onClick={() => window.location.reload()}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
                            >
                                Retry
                            </button>
                        </div>
                    ) : assignedCases.length === 0 ? (
                        <div className="p-8 text-center">
                            <div className="text-gray-400 text-4xl mb-4">📋</div>
                            <p className="text-gray-600 mb-2">No cases assigned yet</p>
                            <p className="text-gray-500 text-sm">Assigned cases will appear here</p>
                        </div>
                    ) : (
                        assignedCases.slice(0, 5).map((assignedCase, index) => (
                            <div key={assignedCase.id || index} className="flex justify-between items-center p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors duration-200">
                                <div className="flex-1">
                                    <div className="font-medium text-lg text-gray-900">{assignedCase.name}</div>
                                    <div className="text-sm text-gray-600 mt-1">
                                        <span className="font-medium">Client:</span> {assignedCase.client}
                                    </div>
                                    <div className="text-sm text-gray-500 mt-1">
                                        <span className="font-medium">Case #:</span> {assignedCase.caseId} | 
                                        <span className="ml-2 font-medium">Court:</span> {assignedCase.court}
                                    </div>
                                    {assignedCase.nextHearing && (
                                        <div className="text-xs text-blue-600 mt-2 font-medium">
                                            🗓️ Next Hearing: {assignedCase.displayNextHearing}
                                        </div>
                                    )}
                                    {assignedCase.caseType && (
                                        <div className="text-xs text-gray-400 mt-1">
                                            Type: {assignedCase.caseType}
                                        </div>
                                    )}
                                </div>
                                <div className="ml-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        assignedCase.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                                        assignedCase.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                        assignedCase.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                        {assignedCase.status || 'Active'}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                    {assignedCases.length > 5 && (
                        <div className="p-4 text-center border-t bg-gray-50">
                            <button 
                                onClick={() => navigate("/junior/cases")}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                                View All {assignedCases.length} Cases →
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Tasks Section */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Your Tasks</h2>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Mock Data</span>
                </div>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {tasks.map((task, index) => (
                        <div key={index} className="flex justify-between items-center p-4 border-b last:border-b-0">
                            <div>
                                <div className="font-medium">{task.title}</div>
                                <div className="text-xs text-gray-500">Due: {task.due}</div>
                            </div>
                            <div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium
                                    ${task.status === "Pending" ? "bg-yellow-100 text-yellow-800" : ""}
                                    ${task.status === "In Progress" ? "bg-green-100 text-green-800" : ""}
                                `}>
                                    {task.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </PageLayout>
    );
};

export default JuniorDashboard;
