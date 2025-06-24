import { useState, useEffect } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Button1 from "../../components/UI/Button1";
import Button2 from "../../components/UI/Button2";
import Input1 from "../../components/UI/Input1";

const Timeline = () => {
    const user = {
        name: 'Thusitha',
        email: 'jeewanthadeherath@gmail.com',
    };

    // State for filters
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedCase, setSelectedCase] = useState(null);
    
    // Available years and months for filters
    const years = [2023, 2024, 2025];
    const months = [
        { value: 0, label: "January" },
        { value: 1, label: "February" },
        { value: 2, label: "March" },
        { value: 3, label: "April" },
        { value: 4, label: "May" },
        { value: 5, label: "June" },
        { value: 6, label: "July" },
        { value: 7, label: "August" },
        { value: 8, label: "September" },
        { value: 9, label: "October" },
        { value: 10, label: "November" },
        { value: 11, label: "December" }
    ];

    // Sample timeline data
    const timelineEvents = [
        {
            id: 1,
            caseId: "C12345",
            caseName: "Smith vs. Jones",
            date: new Date(2024, 2, 19),
            title: "Initial Hearing",
            status: "completed",
            description: "Initial court hearing to establish case parameters."
        },
        {
            id: 2,
            caseId: "C12345",
            caseName: "Smith vs. Jones",
            date: new Date(2024, 2, 31),
            title: "Document Filing",
            status: "completed",
            description: "All required documents filed with the court."
        },
        {
            id: 3,
            caseId: "C12345",
            caseName: "Smith vs. Jones",
            date: new Date(2024, 3, 20),
            title: "Hearing Phase",
            status: "active",
            description: "Presentation of evidence and witness testimonies."
        },
        {
            id: 4,
            caseId: "C12345",
            caseName: "Smith vs. Jones",
            date: new Date(2024, 6, 15),
            title: "Final Decision",
            status: "pending",
            description: "Court's final decision on the case."
        },
    ];

    // Filter events based on selected year and month
    const filteredEvents = timelineEvents.filter(event => {
        return event.date.getFullYear() === selectedYear && 
               event.date.getMonth() === selectedMonth;
    });

    // Format date for display
    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Handle filter submit
    const handleFilterSubmit = () => {
        console.log(`Filtering for ${months[selectedMonth].label} ${selectedYear}`);
        // In a real app, you'd fetch data based on these filters
    };

    // Handle case click
    const handleCaseClick = (event) => {
        setSelectedCase(event);
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar user={user} />
            <div className="flex-grow p-6 overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold">Time Line</h1>
                    <div className="flex items-center gap-2">
                        <Button2 text="Print" className="text-sm py-1 px-4" />
                        <Button2 text="Share" className="text-sm py-1 px-4" />
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4 mb-8">
                    <div className="flex items-center">
                        <span className="mr-2 text-sm font-medium">Year:</span>
                        <select 
                            className="bg-white border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                        >
                            {years.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center">
                        <span className="mr-2 text-sm font-medium">Month:</span>
                        <select 
                            className="bg-white border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                        >
                            {months.map(month => (
                                <option key={month.value} value={month.value}>{month.label}</option>
                            ))}
                        </select>
                    </div>
                    <Button1 
                        text="Submit" 
                        inverted={false}
                        className="bg-orange-500 hover:bg-orange-600 text-white py-2" 
                        onClick={handleFilterSubmit}
                    />
                </div>

                {/* Timeline */}
                <div className="mb-8">
                    <h2 className="text-xl font-medium mb-4">Case Progress Timeline</h2>
                    <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-0 right-0 h-1 bg-orange-500 top-1/2 transform -translate-y-1/2"></div>
                        
                        {/* Timeline events */}
                        <div className="relative flex justify-between py-10">
                            {filteredEvents.length > 0 ? (
                                filteredEvents.map((event, index) => (
                                    <div 
                                        key={event.id} 
                                        className="flex flex-col items-center cursor-pointer"
                                        onClick={() => handleCaseClick(event)}
                                    >
                                        <div className="text-sm text-gray-600 mb-2">{formatDate(event.date)}</div>
                                        <div 
                                            className={`w-6 h-6 rounded-full z-10 flex items-center justify-center
                                                ${event.status === 'completed' ? 'bg-orange-500' : ''}
                                                ${event.status === 'active' ? 'bg-orange-500' : ''}
                                                ${event.status === 'pending' ? 'bg-gray-300' : ''}
                                            `}
                                        >
                                            {event.status === 'completed' && (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </div>
                                        <div className="text-sm font-medium mt-2">{event.title}</div>
                                    </div>
                                ))
                            ) : (
                                <div className="w-full text-center py-4 text-gray-500">No events found for the selected month.</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Selected Case Details */}
                {selectedCase && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h2 className="text-xl font-bold mb-4">{selectedCase.caseName}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <div className="text-sm text-gray-500">Case ID</div>
                                <div className="font-medium">{selectedCase.caseId}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Date</div>
                                <div className="font-medium">{formatDate(selectedCase.date)}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Event</div>
                                <div className="font-medium">{selectedCase.title}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Status</div>
                                <div className="font-medium capitalize">{selectedCase.status}</div>
                            </div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">Description</div>
                            <div className="mt-1">{selectedCase.description}</div>
                        </div>
                    </div>
                )}

                {/* Notes or additional information */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-medium mb-4">Notes</h3>
                    <textarea 
                        placeholder="Add case notes here..."
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        rows={3}
                    ></textarea>
                    <div className="mt-4 flex justify-end">
                        <Button1 
                            text="Save Notes"
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Timeline;