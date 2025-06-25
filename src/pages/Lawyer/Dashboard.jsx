<<<<<<< HEAD
import { useState, useEffect } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Button1 from "../../components/UI/Button1";
import Button2 from "../../components/UI/Button2";
import Input1 from "../../components/UI/Input1";
import { title } from "framer-motion/client";
// You'll need to import chart libraries for the analytics
// import { Chart } from "some-chart-library";

const Dashboard = () => {

    

    const [notificationCount, setNotificationCount] = useState(3);
=======
import React, { useState } from "react";
import Sidebar from "../../components/layout/Sidebar";

const Dashboard = () => {
    const [sidebarExpanded, setSidebarExpanded] = useState(true);
>>>>>>> dev

    const user = {
        name: 'Thusitha',
        email: 'jeewanthadeherath@gmail.com',
    };

    // Dynamic date handling
    const [currentDate, setCurrentDate] = useState("");
    
    useEffect(() => {
        const today = new Date();
        const formattedDate = today.toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric'
        });
        setCurrentDate(formattedDate);
    }, []);

    // Mock data for the dashboard
    const stats = [
        { 
            title: "Due Payments", 
            value: "$2,500", 
            icon: "💰", 
            bgColor: "bg-blue-100", 
            iconBg: "bg-blue-200",
            textColor: "text-blue-800"
        },
        { 
            title: "Timeline", 
            value: "12 Items", 
            icon: "⏱️", 
            bgColor: "bg-green-100",
            iconBg: "bg-green-200", 
            textColor: "text-green-800"
        },
        { 
            title: "Incomes", 
            value: "$8,750", 
            icon: "📈", 
            bgColor: "bg-purple-100",
            iconBg: "bg-purple-200", 
            textColor: "text-purple-800"
        },
        { 
            title: "Day Summary", 
            value: "5 Activities", 
            icon: "📋", 
            bgColor: "bg-red-100",
            iconBg: "bg-red-200", 
            textColor: "text-red-800"
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
<<<<<<< HEAD
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar user={user} />
            <div className="flex-grow p-6 overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold">Hello {user.name}, Welcome</h1>
                    <div className="flex items-center gap-4">
                        <div className="text-gray-500">Today is: {currentDate}</div>
                        <div className="relative cursor-pointer">
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="h-6 w-6 text-gray-600 hover:text-gray-900 transition-colors" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
                                />
                            </svg>
                            {notificationCount > 0 && (
                                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                                    {notificationCount}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {stats.map((stat, index) => (
                        <div key={index} className={`p-6 rounded-lg ${stat.bgColor} shadow-md hover:shadow-lg transition-shadow duration-300`}>
                            <div className="flex flex-col items-center">
                                <div className={`w-14 h-14 flex items-center justify-center text-2xl mb-3 rounded-full ${stat.iconBg}`}>
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
                    <h2 className="text-xl font-bold mb-4 ">Hearings to attend today</h2>
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
                            />
                        </div>
                    </div>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Monthly Income Section */}
                    <div>
                        <h2 className="text-xl font-medium mb-4">Monthly Income</h2>
                        <div className="bg-white rounded-lg shadow-md p-4">
                            <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center text-gray-500">
                                Monthly Income Chart
                            </div>
                            <div className="text-2xl font-bold mt-4 text-green-700">{monthlyIncome}</div>
                        </div>
                    </div>

                    {/* Meeting Requests Section */}
                    <div>
                        <h2 className="text-xl font-medium mb-4">Meeting Requests</h2>
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
                    <h2 className="text-xl font-medium mb-4">Overall Analytics</h2>
                    <div className="bg-white rounded-lg shadow-md p-4">
                        <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center text-gray-500">
                            Overall Analytics Chart
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
=======
        <div className="flex">
            <Sidebar
                user={user}
                defaultExpanded={sidebarExpanded}
                onToggle={(expanded) => setSidebarExpanded(expanded)}
            />
            <main className={`flex-1 ${sidebarExpanded ? 'ml-64' : 'ml-20'} p-6 transition-all duration-300`}>
                {/* Your page content */}
                <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
                <div className="bg-white p-6 rounded-lg shadow">
                    <p>Welcome, {user.name}!</p>
                    {/* Add your dashboard content here */}
                </div>
            </main>
        </div>
    );
};
>>>>>>> dev

export default Dashboard;