import React, { useState, useEffect } from "react";
import PageHeader from "../../components/layout/PageHeader";
import PageLayout from "../../components/layout/PageLayout";
import Button1 from "../../components/UI/Button1";
import { juniorCaseService } from "../../services/juniorCaseService";

const user = {
    name: "Sujan Darshana",
    email: "sujan@gmail.com",
    role: "junior_lawyer",
};

const AssignedCases = () => {
    const [notificationCount, setNotificationCount] = useState(1);
    const [selectedCase, setSelectedCase] = useState(null);
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');
    
    // State for hearings
    const [allHearings, setAllHearings] = useState([]);
    const [hearingsLoading, setHearingsLoading] = useState(false);
    const [hearingsError, setHearingsError] = useState(null);
    const [caseHearings, setCaseHearings] = useState([]);

    // Fetch assigned cases on component mount
    useEffect(() => {
        const fetchAssignedCases = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const casesData = await juniorCaseService.getAssignedCases();
                const formattedCases = casesData.map(caseItem => 
                    juniorCaseService.formatCaseForDisplay(caseItem)
                );
                
                setCases(formattedCases);
            } catch (error) {
                console.error('Failed to fetch assigned cases:', error);
                setError(error.message);
                // Fallback to empty array if fetch fails
                setCases([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAssignedCases();
    }, []);

    // Fetch hearings for assigned cases
    useEffect(() => {
        const fetchHearings = async () => {
            try {
                setHearingsLoading(true);
                setHearingsError(null);
                
                const hearingsData = await juniorCaseService.getAssignedCaseHearings();
                const formattedHearings = hearingsData.map(hearing => 
                    juniorCaseService.formatHearingForDisplay(hearing)
                );
                
                setAllHearings(formattedHearings);
            } catch (error) {
                console.error('Failed to fetch assigned case hearings:', error);
                setHearingsError(error.message);
                setAllHearings([]);
            } finally {
                setHearingsLoading(false);
            }
        };

        fetchHearings();
    }, []);

    // Filter cases based on search and filters
    const filteredCases = juniorCaseService.filterCases(cases, searchTerm, statusFilter, priorityFilter);

    const handleNotificationClick = () => { };

    const handleRowClick = (caseItem) => {
        setSelectedCase(caseItem);
        
        // Filter hearings for this specific case
        const filteredHearings = juniorCaseService.filterHearingsByCase(allHearings, caseItem.id);
        setCaseHearings(filteredHearings);
        
        console.log('Selected case:', caseItem);
        console.log('Filtered hearings for case:', filteredHearings);
    };

    const closeModal = () => {
        setSelectedCase(null);
        setCaseHearings([]);
    };

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
                    <p className="text-gray-600 mt-1">Manage your assigned cases and track progress</p>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Search Cases</label>
                        <input
                            type="text"
                            placeholder="Search by case name, client, or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Statuses</option>
                            <option value="ongoing">Ongoing</option>
                            <option value="pending">Pending</option>
                            <option value="review">Review</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                        <select
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Priorities</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setStatusFilter('');
                                setPriorityFilter('');
                            }}
                            className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Cases Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-4 text-gray-500">Loading assigned cases...</p>
                    </div>
                ) : error ? (
                    <div className="p-8 text-center">
                        <div className="text-red-500 mb-4">⚠️</div>
                        <p className="text-red-600 font-medium mb-2">Failed to load assigned cases</p>
                        <p className="text-gray-500 text-sm mb-4">{error}</p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                ) : filteredCases.length === 0 ? (
                    <div className="p-8 text-center">
                        <div className="text-gray-400 text-4xl mb-4">📂</div>
                        <p className="text-gray-500 font-medium">
                            {cases.length === 0 ? 'No cases assigned yet' : 'No cases match your filters'}
                        </p>
                        <p className="text-gray-400 text-sm mt-1">
                            {cases.length === 0 ? 'Wait for your supervising lawyer to assign cases' : 'Try adjusting your search or filters'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Case Info
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Client & Court
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Next Hearing
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status & Priority
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredCases.map((caseItem) => (
                                    <tr
                                        key={caseItem.id}
                                        onClick={() => handleRowClick(caseItem)}
                                        className="cursor-pointer hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="font-medium text-gray-900">{caseItem.name}</div>
                                                <div className="text-sm text-gray-500">ID: {caseItem.caseId}</div>
                                                <div className="text-sm text-gray-600 mt-1 max-w-xs truncate">
                                                    {caseItem.description}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="font-medium text-gray-900">{caseItem.client}</div>
                                                <div className="text-sm text-gray-500">{caseItem.court}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">
                                                {caseItem.displayNextHearing}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col space-y-2">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${juniorCaseService.getStatusColorClass(caseItem.status)}`}>
                                                    {caseItem.status}
                                                </span>
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${juniorCaseService.getPriorityColorClass(caseItem.priority)}`}>
                                                    {caseItem.priority}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal for Case Details */}
            {selectedCase && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40 px-4"
                    onClick={closeModal}>

                    <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative border border-gray-200"
                        onClick={(e) => e.stopPropagation()} >
                            
                        <h2 className="text-3xl font-semibold mb-6 border-b pb-4 text-gray-800">
                            {selectedCase.name} - {selectedCase.caseId}
                        </h2>

                        {/* Case Overview */}
                        <section className="mb-6">
                            <h3 className="text-xl font-semibold mb-4">Case Overview</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700 text-sm">
                                <div className="space-y-3">
                                    <p>
                                        <strong className="text-gray-900">Case Name:</strong> {selectedCase.name}
                                    </p>
                                    <p>
                                        <strong className="text-gray-900">Description:</strong> {selectedCase.description}
                                    </p>
                                    <p>
                                        <strong className="text-gray-900">Next Hearing:</strong> {selectedCase.displayNextHearing}
                                    </p>
                                    <p>
                                        <strong className="text-gray-900">Client:</strong> {selectedCase.client}
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    <p className="flex items-center">
                                        <strong className="text-gray-900 mr-2">Status:</strong>
                                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${juniorCaseService.getStatusColorClass(selectedCase.status)}`}>
                                            {selectedCase.status}
                                        </span>
                                    </p>
                                    <p className="flex items-center">
                                        <strong className="text-gray-900 mr-2">Priority:</strong>
                                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${juniorCaseService.getPriorityColorClass(selectedCase.priority)}`}>
                                            {selectedCase.priority}
                                        </span>
                                    </p>
                                    <p>
                                        <strong className="text-gray-900">Court:</strong> {selectedCase.court}
                                    </p>
                                    <p>
                                        <strong className="text-gray-900">Supervising Lawyer:</strong> {selectedCase.lawyer}
                                    </p>
                                    <p>
                                        <strong className="text-gray-900">Created:</strong> {selectedCase.displayCreatedAt}
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Parties Involved */}
                        <section className="mb-6 border-t pt-6">
                            <h3 className="text-xl font-semibold mb-4">Parties Involved</h3>
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-6 text-gray-700 text-sm">
                                <div>
                                    <p>
                                        <strong>Client:</strong> {selectedCase.client}
                                    </p>
                                    {/* Add client phone or more if you have */}
                                </div>
                            </div>
                        </section>

                        {/* Hearings & Key Dates */}
                        <section className="mb-6 border-t pt-6">
                            <h3 className="text-xl font-semibold mb-4">Hearings & Key Dates</h3>

                            {hearingsLoading ? (
                                <div className="flex items-center justify-center h-32 text-gray-500">
                                    <div className="text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                                        <p className="text-sm">Loading hearings...</p>
                                    </div>
                                </div>
                            ) : hearingsError ? (
                                <div className="flex items-center justify-center h-32 text-red-500">
                                    <div className="text-center">
                                        <div className="text-3xl mb-2">⚠️</div>
                                        <p className="text-sm">{hearingsError}</p>
                                    </div>
                                </div>
                            ) : caseHearings.length === 0 ? (
                                <div className="flex items-center justify-center h-32 text-gray-500">
                                    <div className="text-center">
                                        <div className="text-3xl mb-2">📅</div>
                                        <p className="text-sm">No hearings scheduled for this case</p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {/* First two items in two columns */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        {caseHearings.length > 0 && (
                                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                                <div>
                                                    <strong>{caseHearings[0].label}:</strong> {caseHearings[0].date}
                                                </div>
                                                {caseHearings[0].displayTime && (
                                                    <div className="text-gray-600 text-sm">Time: {caseHearings[0].displayTime}</div>
                                                )}
                                                {caseHearings[0].location && (
                                                    <div className="text-gray-600 text-sm">Location: {caseHearings[0].location}</div>
                                                )}
                                                {caseHearings[0].status && (
                                                    <span
                                                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${juniorCaseService.getHearingStatusColorClass(caseHearings[0].status)}`}
                                                    >
                                                        {caseHearings[0].status}
                                                    </span>
                                                )}
                                                {caseHearings[0].note && (
                                                    <div className="mt-1 text-gray-600 text-xs">
                                                        <strong>Note:</strong> {caseHearings[0].note}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {caseHearings.length > 1 && (
                                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                                <div>
                                                    <strong>{caseHearings[1].label}:</strong> {caseHearings[1].date}
                                                </div>
                                                {caseHearings[1].displayTime && (
                                                    <div className="text-gray-600 text-sm">Time: {caseHearings[1].displayTime}</div>
                                                )}
                                                {caseHearings[1].location && (
                                                    <div className="text-gray-600 text-sm">Location: {caseHearings[1].location}</div>
                                                )}
                                                {caseHearings[1].status && (
                                                    <span
                                                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${juniorCaseService.getHearingStatusColorClass(caseHearings[1].status)}`}
                                                    >
                                                        {caseHearings[1].status}
                                                    </span>
                                                )}
                                                {caseHearings[1].note && (
                                                    <div className="mt-1 text-gray-600 text-xs">
                                                        <strong>Note:</strong> {caseHearings[1].note}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Remaining items in list */}
                                    {caseHearings.length > 2 && (
                                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-2 max-h-40 overflow-y-auto">
                                            {caseHearings.slice(2).map((hearing, i) => (
                                                <li key={hearing.id || (i + 2)}>
                                                    <strong>{hearing.label}:</strong> {hearing.date}
                                                    {hearing.displayTime && <> at <span className="text-gray-900">{hearing.displayTime}</span></>}
                                                    {hearing.location && <> in <span className="text-gray-900">{hearing.location}</span></>}

                                                    {hearing.status && (
                                                        <span
                                                            className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ml-2 ${juniorCaseService.getHearingStatusColorClass(hearing.status)}`}
                                                        >
                                                            {hearing.status}
                                                        </span>
                                                    )}

                                                    {hearing.note && (
                                                        <div className="ml-4 mt-1 text-gray-600 text-xs">
                                                            <strong>Note:</strong> {hearing.note}
                                                        </div>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </>
                            )}
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
