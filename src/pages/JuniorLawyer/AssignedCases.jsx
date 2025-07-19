import React, { useState } from "react";
import PageHeader from "../../components/layout/PageHeader";
import PageLayout from "../../components/layout/PageLayout";
import Button1 from "../../components/UI/Button1"; // Make sure this exists in your components

const assignedCases = [
    {
        id: "C-1001",
        name: "Estate of Smith",
        des: "A case regarding estate inheritance for the Smith family.",
        nextHearing: "2024-07-10",
    },
    {
        id: "C-1002",
        name: "Guardianship of Lee",
        des: "Legal guardianship dispute involving minor Lee.",
        nextHearing: "2024-07-12",
    },
    {
        id: "C-1003",
        name: "Property Dispute",
        des: "Boundary issue between neighbors.",
        nextHearing: "-",
    },
];

const user = {
    name: "Sujan Darshana",
    email: "sujan@gmail.com",
    role: "junior_lawyer",
};

const AssignedCases = () => {
    const [notificationCount, setNotificationCount] = useState(1);
    const [selectedCase, setSelectedCase] = useState(null);
    const [cases] = useState(assignedCases);

    const handleNotificationClick = () => {
        // Add notification logic if needed
    };

    const handleRowClick = (caseItem) => {
        setSelectedCase(caseItem);
    };

    const closeModal = () => {
        setSelectedCase(null);
    };

    return (
        <PageLayout user={user}>
            <div className="mb-8">
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
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Case Description</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Hearing</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {cases.map((caseItem) => (
                            <tr
                                key={caseItem.id}
                                onClick={() => handleRowClick(caseItem)}
                                className="cursor-pointer hover:bg-gray-100"
                            >
                                <td className="px-6 py-4 whitespace-nowrap">{caseItem.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{caseItem.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{caseItem.des}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{caseItem.nextHearing}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal for Case Details */}
            {selectedCase && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl h-[80vh] overflow-y-auto relative">
                        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Case Details</h2>

                        <div className="mb-4 space-y-2 text-sm">
                            <p><strong>Case ID:</strong> {selectedCase.id}</p>
                            <p><strong>Case Name:</strong> {selectedCase.name}</p>
                            <p><strong>Description:</strong> {selectedCase.des}</p>
                            <p><strong>Next Hearing:</strong> {selectedCase.nextHearing}</p>
                        </div>

                        <div className="mt-6 text-right">
                            <Button1
                                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-900"
                                onClick={closeModal}
                            >
                                Close
                            </Button1>
                        </div>
                    </div>
                </div>
            )}
        </PageLayout>
    );
};

export default AssignedCases;
