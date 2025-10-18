import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/layout/PageHeader";
import PageLayout from "../../components/layout/PageLayout";

const JuniorDashboard = () => {
    const navigate = useNavigate();
    const [notificationCount, setNotificationCount] = useState(2);

    const user = {
        name: 'Sujan Darshana',
        email: 'sujan@example.com',
        role: 'junior_lawyer'
    };

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
            value: "8",
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
            value: "1",
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

    const hearings = [
        { id: "1001", name: "Estate of Smith", date: "2024-07-10", court: "Colombo", status: "Today" },
        { id: "1002", name: "Guardianship of Lee", date: "2024-07-12", court: "Kandy", status: "Upcoming" }
    ];

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

            {/* Hearings Section */}
            <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Your Upcoming Cases</h2>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {hearings.map((hearing, index) => (
                        <div key={index} className="flex justify-between items-center p-4 border-b last:border-b-0">
                            <div>
                                <div className="text-sm text-gray-500">Case # {hearing.id}</div>
                                <div>{hearing.name}</div>
                                <div className="text-xs text-gray-400">{hearing.court}</div>
                            </div>
                            <div>
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {hearing.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tasks Section */}
            <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Your Tasks</h2>
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
