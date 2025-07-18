import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/layout/PageLayout";
import Button1 from "../../components/UI/Button1";
import Button2 from "../../components/UI/Button2";
import { ro } from "date-fns/locale";

const Messages = () => {
    const navigate = useNavigate();
    const [notificationCount, setNotificationCount] = useState(1);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    
    const user = {
        name: 'Thusitha',
        email: 'jeewanthadeherath@gmail.com',
        role: 'lawyer'
    };
    
    // Handle notification click
    const handleNotificationClick = () => {
        console.log('Notifications clicked from Messages page');
    };

    const handleFilterChange = (status) => {
        setFilterStatus(status);
    };
    
    // Sample messages data with additional fields
    const allMessages = [
        {
            id: 1,
            location: "Galle",
            client: "Kumara Jayasuriya",
            description: "Need to discuss about the case #H5432 hearing schedules and required documents.",
            status: "unread",
            date: "2025-06-25",
            time: "09:45 AM",
            priority: "high",
            avatar: "KJ"
        },
        {
            id: 2,
            location: "Colombo",
            client: "Nimal Fernando",
            description: "Requesting clarification on the paperwork required for the property case filing next week.",
            status: "unread",
            date: "2025-06-25",
            time: "11:20 AM",
            priority: "medium",
            avatar: "NF"
        },
        {
            id: 3,
            location: "Kandy",
            client: "Sunil Perera",
            description: "I've uploaded the requested documents for review. Please confirm if you need anything else.",
            status: "read",
            date: "2025-06-24",
            time: "03:15 PM",
            priority: "low",
            avatar: "SP"
        },
        {
            id: 4,
            location: "Galle",
            client: "Amal Silva",
            description: "Need to reschedule our meeting from tomorrow to Friday if possible.",
            status: "read",
            date: "2025-06-24",
            time: "02:10 PM",
            priority: "medium",
            avatar: "AS"
        },
        {
            id: 5,
            location: "Matara",
            client: "Kamal Gunaratne",
            description: "Have questions about the legal fees structure for my ongoing litigation case.",
            status: "unread",
            date: "2025-06-23",
            time: "10:05 AM",
            priority: "high",
            avatar: "KG"
        },
        {
            id: 6,
            location: "Colombo",
            client: "Lakshman Jayawardena",
            description: "The opposing party has requested a settlement meeting. Please advise on how to proceed.",
            status: "read",
            date: "2025-06-22",
            time: "04:30 PM",
            priority: "high",
            avatar: "LJ"
        },
        {
            id: 7,
            location: "Negombo",
            client: "Dilshan Perera",
            description: "Thank you for representing me in court yesterday. When can we discuss next steps?",
            status: "read",
            date: "2025-06-21",
            time: "09:15 AM",
            priority: "medium",
            avatar: "DP"
        },
        {
            id: 8,
            location: "Jaffna",
            client: "Priya Nadarajah",
            description: "I've received a counter-offer from the plaintiff. Need your advice urgently.",
            status: "unread",
            date: "2025-06-20",
            time: "11:40 AM",
            priority: "high",
            avatar: "PN"
        }
    ];
    
    // Filter messages based on status and search query
    const filteredMessages = allMessages.filter(message => {
        const matchesStatus = filterStatus === 'all' || message.status === filterStatus;
        const matchesSearch = 
            message.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
            message.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
            message.description.toLowerCase().includes(searchQuery.toLowerCase());
        
        return matchesStatus && matchesSearch;
    });
    
    // Group messages by date
    const groupedMessages = filteredMessages.reduce((groups, message) => {
        const date = message.date;
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(message);
        return groups;
    }, {});
    
    // Format date for display (YYYY-MM-DD to "Month Day, Year")
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };
    
    // Mark a message as read
    const handleMarkAsRead = (id) => {
        // In a real app, this would update the backend
        console.log(`Marked message ${id} as read`);
    };
    
    // Reply to a message
    const handleReply = (id) => {
        // In a real app, this would open a reply form or modal
        console.log(`Replying to message ${id}`);
    };
    
    // Navigate back to day summary
    const handleBackToDaySummary = () => {
        navigate('/lawyer/day-summary');
    };
    
    return (
        <PageLayout user={user}>
            

            {/* Messages specific header */}
            <div className="flex justify-between items-center mb-8">
            
                <div>
                    <div className="mb-2">
                        <Button1 text="Back" to="/lawyer/day-summary" className="mb-4 underline"  />
                    </div>
                    <h1 className="text-2xl font-bold">All Messages</h1>
                    <p className="text-gray-600">Manage all your client communications</p>
                </div>
            </div>
            
            {/* Filters and search */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                        {/* Use Button1 for active state, Button2 for inactive state */}
                        {filterStatus === 'all' ? (
                            <Button1 
                                text="All Messages" 
                                onClick={() => handleFilterChange('all')}
                                className="text-sm py-1 px-4"
                            />
                        ) : (
                            <Button2 
                                text="All Messages" 
                                onClick={() => handleFilterChange('all')}
                                className="text-sm py-1 px-4"
                            />
                        )}
                        
                        {filterStatus === 'unread' ? (
                            <Button1 
                                text="Unread" 
                                onClick={() => handleFilterChange('unread')}
                                className="text-sm py-1 px-4"
                            />
                        ) : (
                            <Button2 
                                text="Unread" 
                                onClick={() => handleFilterChange('unread')}
                                className="text-sm py-1 px-4"
                            />
                        )}
                        
                        {filterStatus === 'read' ? (
                            <Button1 
                                text="Read" 
                                onClick={() => handleFilterChange('read')}
                                className="text-sm py-1 px-4"
                            />
                        ) : (
                            <Button2 
                                text="Read" 
                                onClick={() => handleFilterChange('read')}
                                className="text-sm py-1 px-4"
                            />
                        )}
                    </div>
                    
                    <div className="relative w-full md:w-auto">
                        <input
                            type="text"
                            placeholder="Search messages..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <svg
                            className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                </div>
            </div>
            
            {/* Message list grouped by date */}
            {Object.keys(groupedMessages).length > 0 ? (
                <div className="space-y-8 mb-8">
                    {Object.entries(groupedMessages)
                        .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA)) // Sort dates newest first
                        .map(([date, messages]) => (
                            <div key={date} className="bg-white rounded-lg shadow-sm overflow-hidden">
                                <div className="bg-gray-50 px-6 py-3">
                                    <h3 className="font-bold">{formatDate(date)}</h3>
                                </div>
                                <div>
                                    {messages.map((message) => (
                                        <div 
                                            key={message.id} 
                                            className={`border-t border-gray-100 px-6 py-4 hover:bg-gray-50 transition-colors ${
                                                message.status === 'unread' ? 'bg-blue-50' : ''
                                            }`}
                                        >
                                            <div className="flex flex-col md:flex-row gap-4">
                                                {/* Avatar and basic info */}
                                                <div className="flex items-start gap-4">
                                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-medium ${
                                                        message.priority === 'high' ? 'bg-red-500' : 
                                                        message.priority === 'medium' ? 'bg-orange-500' : 'bg-green-500'
                                                    }`}>
                                                        {message.avatar}
                                                    </div>
                                                    <div className="flex-grow">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <h4 className="font-bold">{message.client}</h4>
                                                                <div className="text-sm text-gray-600 mb-1">
                                                                    <span>{message.location}</span>
                                                                    <span className="mx-2">•</span>
                                                                    <span>{message.time}</span>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                {message.status === 'unread' && (
                                                                    <span className="inline-block w-3 h-3 bg-blue-500 rounded-full"></span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {/* Message content and actions */}
                                                <div className="flex-grow">
                                                    <p className="text-gray-800 mb-3">{message.description}</p>
                                                    <div className="flex gap-2 justify-end">
                                                        {message.status === 'unread' && (
                                                            <button 
                                                                onClick={() => handleMarkAsRead(message.id)}
                                                                className="text-xs font-medium text-gray-600 hover:text-blue-600 transition-colors"
                                                            >
                                                                Mark as read
                                                            </button>
                                                        )}
                                                        <Button1 
                                                            onClick={() => handleReply(message.id)}
                                                            
                                                            className="text-xs font-medium text-black-600 hover:text-white-800 transition-colors"
                                                        >
                                                            Reply
                                                        </Button1>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <div className="text-gray-400 mb-3">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-800">No messages found</h3>
                    <p className="text-gray-600 mt-1">Try adjusting your search or filter criteria</p>
                </div>
            )}
            
            {/* Pagination (if needed) */}
            {filteredMessages.length > 0 && (
                <div className="flex justify-center my-8">
                    <nav className="relative z-0 inline-flex shadow-sm -space-x-px" aria-label="Pagination">
                        <a
                            href="#"
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                            <span className="sr-only">Previous</span>
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </a>
                        <a
                            href="#"
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            1
                        </a>
                        <a
                            href="#"
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600 hover:bg-blue-50"
                        >
                            2
                        </a>
                        <a
                            href="#"
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            3
                        </a>
                        <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                            ...
                        </span>
                        <a
                            href="#"
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            8
                        </a>
                        <a
                            href="#"
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            9
                        </a>
                        <a
                            href="#"
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            10
                        </a>
                        <a
                            href="#"
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                            <span className="sr-only">Next</span>
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        </a>
                    </nav>
                </div>
            )}
        </PageLayout>
    );
};

export default Messages;