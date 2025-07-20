import React, { useState } from "react";
import PageHeader from "../../components/layout/PageHeader";
import PageLayout from "../../components/layout/PageLayout";
import Button1 from "../../components/UI/Button1";

const assignedCases = [
    {
        id: "C-1001",
        name: "Estate of Smith",
        des: "A case regarding estate inheritance for the Smith family.",
        nextHearing: "2024-07-10",
        client: "John Smith",
        status: "Ongoing",
        court: "Colombo District Court",
        lawyer: "Nadun Hasalanka",
        createdAt: "2024-06-01",
        priority: "High",
    },
    {
        id: "C-1002",
        name: "Guardianship of Lee",
        des: "Legal guardianship dispute involving minor Lee.",
        nextHearing: "2024-07-12",
        client: "Sarah Lee",
        status: "Pending",
        court: "Gampaha Magistrate Court",
        lawyer: "Sujan Darshana",
        createdAt: "2024-06-05",
        priority: "Medium",
    },
    {
        id: "C-1003",
        name: "Property Dispute",
        des: "Boundary issue between neighbors.",
        nextHearing: "-",
        client: "Nimal Perera",
        status: "Review",
        court: "Kandy High Court",
        lawyer: "Nishagi Jeewantha",
        createdAt: "2024-06-08",
        priority: "Low",
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

    const handleNotificationClick = () => { };

    const handleRowClick = (caseItem) => {
        setSelectedCase(caseItem);
    };

    const closeModal = () => {
        setSelectedCase(null);
    };

    // Dummy financials and other data since assignedCases don't have them
    const dummyFinancials = {
        agreedFee: "Rs. 50,000.00",
        totalExpenses: "Rs. 10,000.00",
        paymentStatus: "Paid",
        invoicedAmount: "Rs. 60,000.00",
    };

    const dummyHearings = [
        {
            label: "1st Hearing",
            date: "March 15, 2024",
            location: "Superior Court",
            status: "Completed",
            note: "Decision on estate valuation",
        },
        {
            label: "2nd Hearing",
            date: "July 20, 2024",
            location: "Superior Court",
            status: "Planned",
            note: "Final distribution approval",
        },
        {
            label: "Document Filing Deadline",
            date: "June 30, 2024",
            note: "Required: Final inventory and accounting",
        },
    ];

    const dummyTimeline = [
        { date: "Feb 01, 2024", label: "Client Briefing" },
        { date: "Mar 15, 2024", label: "Initial Hearing" },
        { date: "Apr 20, 2024", label: "Discovery Phase" },
        { date: "Jul 20, 2024", label: "Next Hearing" },
    ];

    const dummyDocuments = [
        { name: "Will Document.pdf", url: "#" },
        { name: "Estate Valuation.pdf", url: "#" },
        { name: "Correspondence Log.pdf", url: "#" },
    ];

    return (
        <PageLayout user={user}>
            {/* <div className="mb-8">
                <PageHeader
                    user={user}
                    notificationCount={notificationCount}
                    onNotificationClick={handleNotificationClick}
                />
            </div> */}

            {/* Page Title and Navigation */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Assigned Cases</h1>
                    <p className="text-gray-600 mt-1">Manage your Cases</p>
                </div>

            </div>
            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Case ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Case Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Case Description
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Next Hearing
                            </th>
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
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40 px-4"
                    onClick={closeModal}>

                    <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative border border-gray-200"
                        onClick={(e) => e.stopPropagation()} >
                            
                        <h2 className="text-3xl font-semibold mb-6 border-b pb-4 text-gray-800">
                            Case Details - {selectedCase.id}
                        </h2>

                        {/* Case Overview */}
                        <section className="mb-6">
                            <h3 className="text-xl font-semibold mb-4">Case Overview</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700 text-sm">
                                <div>
                                    <p>
                                        <strong>Case Name:</strong> {selectedCase.name}
                                    </p>
                                    <p>
                                        <strong>Description:</strong> {selectedCase.des}
                                    </p>
                                    <p>
                                        <strong>Next Hearing:</strong> {selectedCase.nextHearing}
                                    </p>
                                </div>
                                <div>
                                    <p>
                                        <strong>Status:</strong>{" "}
                                        <span
                                            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${selectedCase.status === "Ongoing"
                                                ? "bg-green-100 text-green-700"
                                                : selectedCase.status === "Pending"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : selectedCase.status === "Review"
                                                        ? "bg-gray-100 text-gray-700"
                                                        : "bg-gray-200 text-gray-600"
                                                }`}
                                        >
                                            {selectedCase.status}
                                        </span>
                                    </p>
                                    <p>
                                        <strong>Court:</strong> {selectedCase.court}
                                    </p>
                                    <p>
                                        <strong>Priority:</strong> {selectedCase.priority}
                                    </p>
                                    <p>
                                        <strong>Created At:</strong> {selectedCase.createdAt}
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Parties Involved */}
                        <section className="mb-6 border-t pt-6">
                            <h3 className="text-xl font-semibold mb-4">Parties Involved</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700 text-sm">
                                <div>
                                    <p>
                                        <strong>Client:</strong> {selectedCase.client}
                                    </p>
                                    {/* Add client phone or more if you have */}
                                </div>
                                <div>
                                    <p>
                                        <strong>Assigned Lawyer:</strong> {selectedCase.lawyer}
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Financials */}
                        <section className="mb-6 border-t pt-6">
                            <h3 className="text-xl font-semibold mb-4">Financials</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700 text-sm">
                                <div>
                                    <p>
                                        <strong>Agreed Fee:</strong> {dummyFinancials.agreedFee}
                                    </p>
                                    <p>
                                        <strong>Total Expenses:</strong> {dummyFinancials.totalExpenses}
                                    </p>
                                </div>
                                <div>
                                    <p>
                                        <strong>Payment Status:</strong>{" "}
                                        <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
                                            {dummyFinancials.paymentStatus}
                                        </span>
                                    </p>
                                    <p>
                                        <strong>Invoiced Amount:</strong> {dummyFinancials.invoicedAmount}
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Hearings & Key Dates */}
                        <section className="mb-6 border-t pt-6">
                            <h3 className="text-xl font-semibold mb-4">Hearings & Key Dates</h3>

                            {/* First two items in two columns */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                {dummyHearings.length > 0 && (
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <div>
                                            <strong>{dummyHearings[0].label}:</strong> {dummyHearings[0].date}
                                        </div>
                                        {dummyHearings[0].location && (
                                            <div className="text-gray-600 text-sm">Location: {dummyHearings[0].location}</div>
                                        )}
                                        {dummyHearings[0].status && (
                                            <span
                                                className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${dummyHearings[0].status === 'Completed'
                                                    ? 'bg-green-100 text-green-700'
                                                    : dummyHearings[0].status === 'Planned'
                                                        ? 'bg-blue-100 text-blue-700'
                                                        : 'bg-gray-100 text-gray-700'
                                                    }`}
                                            >
                                                {dummyHearings[0].status}
                                            </span>
                                        )}
                                        {dummyHearings[0].note && (
                                            <div className="mt-1 text-gray-600 text-xs">
                                                <strong>Note:</strong> {dummyHearings[0].note}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {dummyHearings.length > 1 && (
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <div>
                                            <strong>{dummyHearings[1].label}:</strong> {dummyHearings[1].date}
                                        </div>
                                        {dummyHearings[1].location && (
                                            <div className="text-gray-600 text-sm">Location: {dummyHearings[1].location}</div>
                                        )}
                                        {dummyHearings[1].status && (
                                            <span
                                                className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${dummyHearings[1].status === 'Completed'
                                                    ? 'bg-green-100 text-green-700'
                                                    : dummyHearings[1].status === 'Planned'
                                                        ? 'bg-blue-100 text-blue-700'
                                                        : 'bg-gray-100 text-gray-700'
                                                    }`}
                                            >
                                                {dummyHearings[1].status}
                                            </span>
                                        )}
                                        {dummyHearings[1].note && (
                                            <div className="mt-1 text-gray-600 text-xs">
                                                <strong>Note:</strong> {dummyHearings[1].note}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Remaining items in list */}
                            {dummyHearings.length > 2 && (
                                <ul className="list-disc list-inside text-sm text-gray-700 space-y-2 max-h-40 overflow-y-auto">
                                    {dummyHearings.slice(2).map((h, i) => (
                                        <li key={i + 2}>
                                            <strong>{h.label}:</strong> {h.date}
                                            {h.location && <> at <span className="text-gray-900">{h.location}</span></>}

                                            {h.status && (
                                                <span
                                                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ml-2 ${h.status === "Completed"
                                                        ? "bg-green-100 text-green-700"
                                                        : h.status === "Planned"
                                                            ? "bg-blue-100 text-blue-700"
                                                            : "bg-gray-100 text-gray-700"
                                                        }`}
                                                >
                                                    {h.status}
                                                </span>
                                            )}

                                            {h.note && (
                                                <div className="ml-4 mt-1 text-gray-600 text-xs">
                                                    <strong>Note:</strong> {h.note}
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>

                        {/* Timeline */}
                        <section className="mb-6 border-t pt-6">
                            <h3 className="text-xl font-semibold mb-4 text-center">Case Progress Timeline</h3>
                            <div className="flex items-center justify-between space-x-2 overflow-x-auto px-4">
                                {dummyTimeline.map((t, idx) => (
                                    <React.Fragment key={idx}>
                                        <div className="flex flex-col items-center min-w-[80px]">
                                            <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">
                                                {idx + 1}
                                            </div>
                                            <div className="text-xs mt-2 text-gray-700 text-center whitespace-normal">
                                                {t.date}
                                                <br />
                                                {t.label}
                                            </div>
                                        </div>
                                        {idx < dummyTimeline.length - 1 && <div className="flex-1 h-1 bg-orange-200 mx-2 my-auto" />}
                                    </React.Fragment>
                                ))}
                            </div>
                        </section>

                        {/* Documents */}
                        <section className="border-t pt-6">
                            <h3 className="text-xl font-semibold mb-4">Documents</h3>
                            <ul className="list-disc pl-6 mb-4 text-blue-700 max-h-32 overflow-y-auto">
                                {dummyDocuments.map((doc, idx) => (
                                    <li key={idx}>
                                        <a href={doc.url} className="hover:underline" target="_blank" rel="noopener noreferrer">
                                            {doc.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>

                            <Button1
                                className="mt-4"
                            >
                                Add Documents
                            </Button1>
                        </section>

                        {/* Close button */}
                        <div className="mt-8 text-right">
                            <Button1
                                className="mt-4"
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
