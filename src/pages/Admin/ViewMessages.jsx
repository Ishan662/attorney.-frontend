import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/layout/PageLayout";
import Button1 from "../../components/UI/Button1";
import Button2 from "../../components/UI/Button2";
import Input1 from "../../components/UI/Input1";

const ViewMessages = () => {
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [showReplyModal, setShowReplyModal] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [replyContent, setReplyContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    
    // Admin user data
    const user = {
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin'
    };

    // Sample messages data
    const [messages, setMessages] = useState([
        {
            id: 1,
            from: "Nishagi Jewantha",
            email: "nishagi@example.com",
            role: "lawyer",
            subject: "Package upgrade request",
            message: "I would like to request an upgrade to the premium package for my account. I need access to the additional features for a complex case I'm working on.",
            date: "2025-07-05T10:30:00",
            status: "unread",
            replied: false
        },
        {
            id: 2,
            from: "Jane Smith",
            email: "jane@example.com",
            role: "junior_lawyer",
            subject: "Access permission issue",
            message: "I'm having trouble accessing case files shared by my senior lawyer. Could you please check the permissions on my account?",
            date: "2025-07-04T14:15:00",
            status: "read",
            replied: true
        },
        {
            id: 3,
            from: "Robert Chen",
            email: "robert@example.com",
            role: "client",
            subject: "Account verification",
            message: "I registered 2 days ago but my account is still pending verification. I need to communicate with my lawyer urgently regarding an upcoming hearing.",
            date: "2025-07-03T09:45:00",
            status: "unread",
            replied: false
        },
        {
            id: 4,
            from: "Ramesh Kumar",
            email: "ramesh@example.com",
            role: "lawyer",
            subject: "Technical support needed",
            message: "The document upload feature is not working properly. I've tried multiple times but the files don't appear in my case folders after uploading.",
            date: "2025-07-02T16:20:00",
            status: "read",
            replied: false
        },
        {
            id: 5,
            from: "Priya Patel",
            email: "priya@example.com",
            role: "client",
            subject: "Billing question",
            message: "I noticed a discrepancy in my last invoice. There seems to be an additional charge that I don't understand. Could you please clarify?",
            date: "2025-07-01T11:05:00",
            status: "read",
            replied: true
        },
        {
            id: 6,
            from: "Michael Johnson",
            email: "michael@example.com",
            role: "junior_lawyer",
            subject: "Calendar sync issue",
            message: "My hearing dates are not syncing properly with the main calendar. This has caused me to miss an important notification yesterday.",
            date: "2025-06-30T08:50:00",
            status: "unread",
            replied: false
        },
        {
            id: 7,
            from: "David Lee",
            email: "david@example.com",
            role: "client",
            subject: "Password reset request",
            message: "I'm unable to reset my password using the forgot password link. Could you please help me regain access to my account?",
            date: "2025-06-29T13:40:00",
            status: "read",
            replied: true
        }
    ]);

    // Get filtered messages based on active filter and search term
    const getFilteredMessages = () => {
        return messages.filter(message => {
            // Filter by role
            if (activeFilter !== "all" && message.role !== activeFilter) return false;
            
            // Filter by search term
            if (searchTerm && !message.from.toLowerCase().includes(searchTerm.toLowerCase()) &&
                !message.subject.toLowerCase().includes(searchTerm.toLowerCase()) &&
                !message.message.toLowerCase().includes(searchTerm.toLowerCase())) {
                return false;
            }
            
            return true;
        });
    };

    // Mark message as read
    const markAsRead = (messageId) => {
        setMessages(prevMessages => 
            prevMessages.map(message => 
                message.id === messageId ? { ...message, status: "read" } : message
            )
        );
    };

    // Handle message click
    const handleMessageClick = (message) => {
        setSelectedMessage(message);
        if (message.status === "unread") {
            markAsRead(message.id);
        }
    };

    // Handle reply
    const handleReply = (message) => {
        setSelectedMessage(message);
        setReplyContent("");
        setShowReplyModal(true);
    };

    // Send reply
    const sendReply = (e) => {
        e.preventDefault();
        
        if (!replyContent.trim()) {
            alert("Please enter a reply message");
            return;
        }
        
        setIsLoading(true);
        
        // Simulate API call with timeout
        setTimeout(() => {
            setMessages(prevMessages => 
                prevMessages.map(message => 
                    message.id === selectedMessage.id ? { ...message, replied: true } : message
                )
            );
            
            setIsLoading(false);
            setShowReplyModal(false);
            
            // Show success message
            alert(`Reply sent to ${selectedMessage.from}`);
        }, 800);
    };

    // Format date for display
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Get role display name
    const getRoleDisplayName = (role) => {
        switch (role) {
            case 'lawyer': return 'Senior Lawyer';
            case 'junior_lawyer': return 'Junior Lawyer';
            case 'client': return 'Client';
            default: return role;
        }
    };

    // Get initials from name
    const getInitials = (name) => {
        return name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    // Get color for avatar based on role
    const getAvatarColor = (role) => {
        switch (role) {
            case 'lawyer': return 'bg-blue-100 text-blue-800';
            case 'junior_lawyer': return 'bg-purple-100 text-purple-800';
            case 'client': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Get count of unread messages
    const getUnreadCount = () => {
        return messages.filter(message => message.status === "unread").length;
    };

    // Get count of unread messages by role
    const getUnreadCountByRole = (role) => {
        return messages.filter(message => message.status === "unread" && message.role === role).length;
    };

    return (
        <PageLayout user={user}>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Message Center</h1>
                    <p className="text-gray-600">View and respond to messages from users</p>
                </div>
                <div className="flex space-x-2">
                    <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                        {getUnreadCount()} Unread
                    </div>
                    <Button1
                        text="Dashboard"
                        onClick={() => navigate('/admin/dashboard')}
                        className="px-4"
                    />
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg p-4 shadow-md mb-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="w-full md:w-1/3">
                        <Input1
                            type="text"
                            placeholder="Search messages..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            variant="outlined"
                            className="w-full"
                        />
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm text-gray-600">Filter by:</span>
                        <div className="flex space-x-2">
                            <button 
                                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${activeFilter === "all" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                                onClick={() => setActiveFilter("all")}
                            >
                                All
                            </button>
                            <button 
                                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center ${activeFilter === "lawyer" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                                onClick={() => setActiveFilter("lawyer")}
                            >
                                Senior Lawyers
                                {getUnreadCountByRole("lawyer") > 0 && (
                                    <span className="ml-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                                        {getUnreadCountByRole("lawyer")}
                                    </span>
                                )}
                            </button>
                            <button 
                                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center ${activeFilter === "junior_lawyer" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                                onClick={() => setActiveFilter("junior_lawyer")}
                            >
                                Junior Lawyers
                                {getUnreadCountByRole("junior_lawyer") > 0 && (
                                    <span className="ml-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                                        {getUnreadCountByRole("junior_lawyer")}
                                    </span>
                                )}
                            </button>
                            <button 
                                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center ${activeFilter === "client" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                                onClick={() => setActiveFilter("client")}
                            >
                                Clients
                                {getUnreadCountByRole("client") > 0 && (
                                    <span className="ml-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                                        {getUnreadCountByRole("client")}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Message List */}
                <div className="md:col-span-1">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden h-[calc(100vh-220px)]">
                        <div className="p-3 bg-gray-50 border-b border-gray-200">
                            <h2 className="font-semibold">
                                {getFilteredMessages().length} Messages
                            </h2>
                        </div>
                        <div className="overflow-y-auto h-[calc(100%-50px)]">
                            {getFilteredMessages().length > 0 ? (
                                getFilteredMessages().map(message => (
                                    <div 
                                        key={message.id} 
                                        className={`p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${selectedMessage?.id === message.id ? 'bg-blue-50' : ''} ${message.status === "unread" ? "font-semibold" : ""}`}
                                        onClick={() => handleMessageClick(message)}
                                    >
                                        <div className="flex items-start space-x-3">
                                            <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium ${getAvatarColor(message.role)}`}>
                                                {getInitials(message.from)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between">
                                                    <p className="truncate">{message.from}</p>
                                                    <p className="text-xs text-gray-500">{new Date(message.date).toLocaleDateString()}</p>
                                                </div>
                                                <p className="text-sm truncate">{message.subject}</p>
                                                <div className="flex mt-1 space-x-2">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                        {getRoleDisplayName(message.role)}
                                                    </span>
                                                    {message.status === "unread" && (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                            New
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-6 text-center text-gray-500">
                                    No messages match your criteria
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                
                {/* Message Detail */}
                <div className="md:col-span-2">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden h-[calc(100vh-220px)]">
                        {selectedMessage ? (
                            <>
                                <div className="p-4 bg-gray-50 border-b border-gray-200">
                                    <div className="flex justify-between items-start">
                                        <h2 className="font-bold text-xl">{selectedMessage.subject}</h2>
                                    </div>
                                </div>
                                <div className="p-4 overflow-y-auto h-[calc(100%-180px)]">
                                    <div className="flex items-start space-x-4 mb-6">
                                        <div className={`flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center text-base font-medium ${getAvatarColor(selectedMessage.role)}`}>
                                            {getInitials(selectedMessage.from)}
                                        </div>
                                        <div>
                                            <div className="font-semibold">{selectedMessage.from}</div>
                                            <div className="text-sm text-gray-600">{selectedMessage.email}</div>
                                            <div className="text-sm text-gray-600">{getRoleDisplayName(selectedMessage.role)}</div>
                                            <div className="text-sm text-gray-500 mt-1">{formatDate(selectedMessage.date)}</div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                        <p className="whitespace-pre-line">{selectedMessage.message}</p>
                                    </div>
                                    {selectedMessage.replied && (
                                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                            <div className="text-sm font-semibold text-blue-800 mb-2">
                                                ✓ You have responded to this message
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 border-t border-gray-200 bg-gray-50">
                                    <div className="flex justify-end space-x-3">
                                        <Button2
                                            text="Mark as Unread"
                                            onClick={() => {
                                                setMessages(prevMessages => 
                                                    prevMessages.map(message => 
                                                        message.id === selectedMessage.id ? { ...message, status: "unread" } : message
                                                    )
                                                );
                                            }}
                                            className="text-sm px-3 py-1"
                                        />
                                        <Button1
                                            text="Reply"
                                            onClick={() => handleReply(selectedMessage)}
                                            className="text-sm px-3 py-1"
                                        />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="p-6 text-center text-gray-500 flex flex-col items-center justify-center h-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <p className="text-lg">Select a message to view details</p>
                                <p className="text-sm mt-2">You can filter messages by user type</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Reply Modal */}
            {showReplyModal && selectedMessage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl mx-4">
                        <h2 className="text-xl font-bold mb-2">Reply to Message</h2>
                        
                        <div className="mb-4">
                            <div className="bg-gray-50 p-3 rounded-lg mb-2">
                                <div className="flex justify-between">
                                    <span className="font-medium">To: {selectedMessage.from}</span>
                                    <span className="text-sm text-gray-600">{selectedMessage.email}</span>
                                </div>
                                <div className="font-medium mt-2">Re: {selectedMessage.subject}</div>
                            </div>
                        </div>
                        
                        <form onSubmit={sendReply}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Your Reply
                                </label>
                                <textarea
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    placeholder="Type your reply here..."
                                    rows={6}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            
                            <div className="flex justify-end space-x-3">
                                <Button2
                                    text="Cancel"
                                    onClick={() => {
                                        setShowReplyModal(false);
                                        setReplyContent("");
                                    }}
                                    className="px-4 py-2"
                                />
                                <Button1
                                    type="submit"
                                    text={isLoading ? "Sending..." : "Send Reply"}
                                    disabled={isLoading}
                                    className="px-4 py-2"
                                />
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </PageLayout>
    );
};

export default ViewMessages;