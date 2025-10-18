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
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [replyContent, setReplyContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    
    // Admin user data
    const user = {
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin'
    };

    // Sample support requests data
    const [supportRequests, setSupportRequests] = useState([
        {
            id: 1,
            from: "Nishagi Jewantha",
            email: "nishagi@example.com",
            role: "lawyer",
            subject: "Package upgrade request",
            category: "Subscription",
            priority: "medium",
            message: "I would like to request an upgrade to the premium package for my account. I need access to the additional features for a complex case I'm working on.",
            date: "2025-07-05T10:30:00",
            status: "open",
            responded: false
        },
        {
            id: 2,
            from: "Jane Smith",
            email: "jane@example.com",
            role: "junior_lawyer",
            subject: "Access permission issue",
            category: "Technical",
            priority: "high",
            message: "I'm having trouble accessing case files shared by my senior lawyer. Could you please check the permissions on my account?",
            date: "2025-07-04T14:15:00",
            status: "resolved",
            responded: true
        },
        {
            id: 3,
            from: "Robert Chen",
            email: "robert@example.com",
            role: "client",
            subject: "Account verification",
            category: "Account",
            priority: "urgent",
            message: "I registered 2 days ago but my account is still pending verification. I need to communicate with my lawyer urgently regarding an upcoming hearing.",
            date: "2025-07-03T09:45:00",
            status: "open",
            responded: false
        },
        {
            id: 4,
            from: "Ramesh Kumar",
            email: "ramesh@example.com",
            role: "lawyer",
            subject: "Technical support needed",
            category: "Technical",
            priority: "medium",
            message: "The document upload feature is not working properly. I've tried multiple times but the files don't appear in my case folders after uploading.",
            date: "2025-07-02T16:20:00",
            status: "in_progress",
            responded: false
        },
        {
            id: 5,
            from: "Priya Patel",
            email: "priya@example.com",
            role: "client",
            subject: "Billing question",
            category: "Billing",
            priority: "low",
            message: "I noticed a discrepancy in my last invoice. There seems to be an additional charge that I don't understand. Could you please clarify?",
            date: "2025-07-01T11:05:00",
            status: "resolved",
            responded: true
        },
        {
            id: 6,
            from: "Michael Johnson",
            email: "michael@example.com",
            role: "junior_lawyer",
            subject: "Calendar sync issue",
            category: "Technical",
            priority: "high",
            message: "My hearing dates are not syncing properly with the main calendar. This has caused me to miss an important notification yesterday.",
            date: "2025-06-30T08:50:00",
            status: "open",
            responded: false
        },
        {
            id: 7,
            from: "David Lee",
            email: "david@example.com",
            role: "client",
            subject: "Password reset request",
            category: "Account",
            priority: "medium",
            message: "I'm unable to reset my password using the forgot password link. Could you please help me regain access to my account?",
            date: "2025-06-29T13:40:00",
            status: "resolved",
            responded: true
        }
    ]);

    // Get filtered requests based on active filter and search term
    const getFilteredRequests = () => {
        return supportRequests.filter(request => {
            // Filter by role
            if (activeFilter !== "all" && request.role !== activeFilter) return false;
            
            // Filter by search term
            if (searchTerm && !request.from.toLowerCase().includes(searchTerm.toLowerCase()) &&
                !request.subject.toLowerCase().includes(searchTerm.toLowerCase()) &&
                !request.message.toLowerCase().includes(searchTerm.toLowerCase()) &&
                !request.category.toLowerCase().includes(searchTerm.toLowerCase())) {
                return false;
            }
            
            return true;
        });
    };

    // Update request status
    const updateRequestStatus = (requestId, newStatus) => {
        setSupportRequests(prevRequests => 
            prevRequests.map(request => 
                request.id === requestId ? { ...request, status: newStatus } : request
            )
        );
    };

    // Handle request click
    const handleRequestClick = (request) => {
        setSelectedRequest(request);
        if (request.status === "open") {
            updateRequestStatus(request.id, "in_progress");
        }
    };

    // Handle reply
    const handleReply = (request) => {
        setSelectedRequest(request);
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
            setSupportRequests(prevRequests => 
                prevRequests.map(request => 
                    request.id === selectedRequest.id ? { 
                        ...request, 
                        responded: true, 
                        status: "resolved"
                    } : request
                )
            );
            
            setIsLoading(false);
            setShowReplyModal(false);
            
            // Show success message
            alert(`Support response sent to ${selectedRequest.from}`);
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

    // Get priority color class
    const getPriorityColorClass = (priority) => {
        switch (priority) {
            case 'urgent': return 'bg-red-100 text-red-800';
            case 'high': return 'bg-orange-100 text-orange-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'low': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Get status color class
    const getStatusColorClass = (status) => {
        switch (status) {
            case 'open': return 'bg-blue-100 text-blue-800';
            case 'in_progress': return 'bg-yellow-100 text-yellow-800';
            case 'resolved': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Get status display name
    const getStatusDisplayName = (status) => {
        switch (status) {
            case 'open': return 'Open';
            case 'in_progress': return 'In Progress';
            case 'resolved': return 'Resolved';
            default: return status;
        }
    };

    // Get count of open requests
    const getOpenCount = () => {
        return supportRequests.filter(request => request.status === "open").length;
    };

    // Get count of open requests by role
    const getOpenCountByRole = (role) => {
        return supportRequests.filter(request => request.status === "open" && request.role === role).length;
    };

    return (
        <PageLayout user={user}>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Support Request Center</h1>
                    <p className="text-gray-600">View and respond to support requests from users</p>
                </div>
                <div className="flex space-x-2">
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {getOpenCount()} Open Requests
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg p-4 shadow-md mb-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="w-full md:w-1/3">
                        <Input1
                            type="text"
                            placeholder="Search requests..."
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
                                {getOpenCountByRole("lawyer") > 0 && (
                                    <span className="ml-1 w-4 h-4 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center">
                                        {getOpenCountByRole("lawyer")}
                                    </span>
                                )}
                            </button>
                            <button 
                                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center ${activeFilter === "junior_lawyer" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                                onClick={() => setActiveFilter("junior_lawyer")}
                            >
                                Junior Lawyers
                                {getOpenCountByRole("junior_lawyer") > 0 && (
                                    <span className="ml-1 w-4 h-4 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center">
                                        {getOpenCountByRole("junior_lawyer")}
                                    </span>
                                )}
                            </button>
                            <button 
                                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center ${activeFilter === "client" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                                onClick={() => setActiveFilter("client")}
                            >
                                Clients
                                {getOpenCountByRole("client") > 0 && (
                                    <span className="ml-1 w-4 h-4 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center">
                                        {getOpenCountByRole("client")}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Support Requests */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Request List */}
                <div className="md:col-span-1">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden h-[calc(100vh-220px)]">
                        <div className="p-3 bg-gray-50 border-b border-gray-200">
                            <h2 className="font-semibold">
                                {getFilteredRequests().length} Support Requests
                            </h2>
                        </div>
                        <div className="overflow-y-auto h-[calc(100%-50px)]">
                            {getFilteredRequests().length > 0 ? (
                                getFilteredRequests().map(request => (
                                    <div 
                                        key={request.id} 
                                        className={`p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${selectedRequest?.id === request.id ? 'bg-blue-50' : ''} ${request.status === "open" ? "font-semibold" : ""}`}
                                        onClick={() => handleRequestClick(request)}
                                    >
                                        <div className="flex items-start space-x-3">
                                            <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium ${getAvatarColor(request.role)}`}>
                                                {getInitials(request.from)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between">
                                                    <p className="truncate">{request.from}</p>
                                                    <p className="text-xs text-gray-500">{new Date(request.date).toLocaleDateString()}</p>
                                                </div>
                                                <p className="text-sm truncate">{request.subject}</p>
                                                <div className="flex mt-1 space-x-2">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                        {request.category}
                                                    </span>
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColorClass(request.status)}`}>
                                                        {getStatusDisplayName(request.status)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-6 text-center text-gray-500">
                                    No support requests match your criteria
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                
                {/* Request Detail */}
                <div className="md:col-span-2">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden h-[calc(100vh-220px)]">
                        {selectedRequest ? (
                            <>
                                <div className="p-4 bg-gray-50 border-b border-gray-200">
                                    <div className="flex justify-between items-center">
                                        <h2 className="font-bold text-xl">{selectedRequest.subject}</h2>
                                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColorClass(selectedRequest.priority)}`}>
                                            {selectedRequest.priority.charAt(0).toUpperCase() + selectedRequest.priority.slice(1)} Priority
                                        </div>
                                    </div>
                                    <div className="flex mt-2 space-x-3">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColorClass(selectedRequest.status)}`}>
                                            {getStatusDisplayName(selectedRequest.status)}
                                        </span>
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                            {selectedRequest.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4 overflow-y-auto h-[calc(100%-180px)]">
                                    <div className="flex items-start space-x-4 mb-6">
                                        <div className={`flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center text-base font-medium ${getAvatarColor(selectedRequest.role)}`}>
                                            {getInitials(selectedRequest.from)}
                                        </div>
                                        <div>
                                            <div className="font-semibold">{selectedRequest.from}</div>
                                            <div className="text-sm text-gray-600">{selectedRequest.email}</div>
                                            <div className="text-sm text-gray-600">{getRoleDisplayName(selectedRequest.role)}</div>
                                            <div className="text-sm text-gray-500 mt-1">{formatDate(selectedRequest.date)}</div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                        <p className="whitespace-pre-line">{selectedRequest.message}</p>
                                    </div>
                                    {selectedRequest.responded && (
                                        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                                            <div className="text-sm font-semibold text-green-800 mb-2">
                                                ✓ This request has been resolved
                                            </div>
                                            <p className="text-sm text-green-700">
                                                A response has been sent to the user. If they need further assistance, they will need to submit a new request.
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 border-t border-gray-200 bg-gray-50">
                                    <div className="flex justify-end space-x-3">
                                        {selectedRequest.status !== "resolved" ? (
                                            <>
                                                <Button2
                                                    text="Mark as Resolved"
                                                    onClick={() => updateRequestStatus(selectedRequest.id, "resolved")}
                                                    className="text-sm px-3 py-1"
                                                />
                                                <Button1
                                                    text="Respond"
                                                    onClick={() => handleReply(selectedRequest)}
                                                    className="text-sm px-3 py-1"
                                                />
                                            </>
                                        ) : (
                                            <Button2
                                                text="Reopen Request"
                                                onClick={() => updateRequestStatus(selectedRequest.id, "open")}
                                                className="text-sm px-3 py-1"
                                            />
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="p-6 text-center text-gray-500 flex flex-col items-center justify-center h-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                <p className="text-lg">Select a support request to view details</p>
                                <p className="text-sm mt-2">You can filter requests by user type or search by keyword</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Reply Modal */}
            {showReplyModal && selectedRequest && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl mx-4">
                        <h2 className="text-xl font-bold mb-2">Respond to Support Request</h2>
                        
                        <div className="mb-4">
                            <div className="bg-gray-50 p-3 rounded-lg mb-2">
                                <div className="flex justify-between">
                                    <span className="font-medium">To: {selectedRequest.from}</span>
                                    <span className="text-sm text-gray-600">{selectedRequest.email}</span>
                                </div>
                                <div className="font-medium mt-2">Re: {selectedRequest.subject}</div>
                                <div className="text-sm text-gray-600 mt-1">
                                    Category: {selectedRequest.category} • Priority: {selectedRequest.priority}
                                </div>
                            </div>
                        </div>
                        
                        <form onSubmit={sendReply}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Your Response
                                </label>
                                <textarea
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    placeholder="Type your response here..."
                                    rows={6}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            
                            <div className="flex items-center mb-4">
                                <input
                                    type="checkbox"
                                    id="markResolved"
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    checked
                                    readOnly
                                />
                                <label htmlFor="markResolved" className="ml-2 block text-sm text-gray-700">
                                    Mark request as resolved after sending response
                                </label>
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
                                    text={isLoading ? "Sending..." : "Send Response"}
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