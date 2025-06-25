import React, { useState } from "react";
import Sidebar from "../../components/layout/Sidebar";

const Dashboard = () => {
    const [sidebarExpanded, setSidebarExpanded] = useState(true);

    const user = {
        name: 'Nishagi Jewantha',
        email: 'jeewanthadeherath@gmail.com',
    };

    return (
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

export default Dashboard;