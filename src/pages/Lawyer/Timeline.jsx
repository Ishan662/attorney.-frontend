import { useState, useEffect } from "react";
import PageLayout from "../../components/layout/PageLayout";
import Button1 from "../../components/UI/Button1";
import Button2 from "../../components/UI/Button2";
import PageHeader from "../../components/layout/PageHeader";
import Input1 from "../../components/UI/Input1";

const Timeline = () => {
    const user = {
        name: 'Thusitha',
        email: 'jeewanthadeherath@gmail.com',
    };

    const [notificationCount, setNotificationCount] = useState(2);
    
    // Handle notification click
    const handleNotificationClick = () => {
        console.log('Notifications clicked from Timeline page');
        // Notification handling specific to this page
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
        <PageLayout user={user}>
            {/* Header */}
            <div className="mb-8">
                <PageHeader 
                    user={user} 
                    notificationCount={notificationCount}
                    onNotificationClick={handleNotificationClick}
                />
            </div>
            
            {/* Timeline specific header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Time Line</h1>

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
                    className="text-white py-1 px-4 text-sm"
                    onClick={handleFilterSubmit}
                />
            </div>

            {/* Timeline */}
            <div className="mb-8">
                <h2 className="text-xl font-black shadow-sm mb-4">Case Progress Timeline</h2>
                <div className="bg-white rounded-lg  p-6">
                    {filteredEvents.length > 0 ? (
                        <div className="relative">
                            {/* Timeline line - only shown when there are events */}
                            <div className="absolute left-6 right-6 h-1 bg-orange-500 top-1/2 transform -translate-y-1/2"></div>
                            
                            {/* Timeline events */}
                            <div className="relative flex justify-between py-10">
                                {filteredEvents.map((event, index) => (
                                    <div 
                                        key={event.id} 
                                        className="flex flex-col items-center cursor-pointer transition-transform transform hover:scale-105"
                                        onClick={() => handleCaseClick(event)}
                                    >
                                        <div className="text-sm text-gray-600 mb-2">{formatDate(event.date)}</div>
                                        <div 
                                            className={`w-8 h-8 rounded-full z-10 flex items-center justify-center border-2 border-white shadow-md
                                                ${event.status === 'completed' ? 'bg-orange-500' : ''}
                                                ${event.status === 'active' ? 'bg-gray-500' : ''}
                                                ${event.status === 'pending' ? 'bg-black-300' : ''}
                                            `}
                                        >
                                            {event.status === 'completed' && (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </div>
                                        <div className="text-sm font-medium mt-2 max-w-[120px] text-center">{event.title}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="w-full text-center py-16 text-gray-500">
                            <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-lg font-medium">No cases recorded for {months[selectedMonth].label} {selectedYear}.</p>
                            <p className="text-sm mt-1">Try selecting a different month or year.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Selected Case Details */}
            {selectedCase && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-xl font-bold  mb-4">{selectedCase.caseName}</h2>
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
                            <div className={`font-medium capitalize px-2 py-1 rounded-full inline-block text-sm
                                ${selectedCase.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                                ${selectedCase.status === 'active' ? 'bg-blue-100 text-blue-800' : ''}
                                ${selectedCase.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                            `}>
                                {selectedCase.status}
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500 mb-1">Description</div>
                        <div className="p-3 bg-gray-50 rounded-lg">{selectedCase.description}</div>
                    </div>
                </div>
            )}

            {/* Notes or additional information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-black shadow-sm mb-4">Notes</h3>
                <textarea 
                    placeholder="Add case notes here..."
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    rows={3}
                ></textarea>
                <div className="mt-4 flex justify-end">
                    <Button1 
                        text="Save Notes"
                    />
                </div>
            </div>
        </PageLayout>
    );
};

export default Timeline;