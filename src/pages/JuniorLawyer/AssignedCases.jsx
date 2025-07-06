import React, { useState } from "react";
import JuniorSidebar from "../../components/layout/JuniorSidebar";
import PageHeader from "../../components/layout/PageHeader";

const assignedCases = [
    { id: "C-1001", name: "Estate of Smith", status: "Open", nextHearing: "2024-07-10" },
    { id: "C-1002", name: "Guardianship of Lee", status: "In Progress", nextHearing: "2024-07-12" },
    { id: "C-1003", name: "Property Dispute", status: "Closed", nextHearing: "-" },
];

const user = {
  name: 'Sujan Darshana',
  email: 'sujan@gmail.com',
};


const AssignedCases = () => {

const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [notificationCount, setNotificationCount] = useState(1);

  const handleNotificationClick = () => {

  };



    return (
        <div className="flex min-h-screen bg-white-50">
            <JuniorSidebar
                user={user}
                onToggle={setSidebarExpanded}
            />
            <div
                className="flex-grow overflow-y-auto transition-all duration-300"
                style={{
                    marginLeft: sidebarExpanded ? '16rem' : '5rem'
                }}
            >

                <div className="p-6">
                    <div className='mb-8'>
                        <PageHeader
                            user={user}
                            notificationCount={notificationCount}
                            onNotificationClick={handleNotificationClick}
                        />
                    </div>


                    <h1 className="text-2xl font-bold mb-6">Assigned Cases</h1>
                    <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Case ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Case Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Hearing</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {assignedCases.map((c) => (
                                    <tr key={c.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">{c.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{c.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{c.status}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{c.nextHearing}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssignedCases;
