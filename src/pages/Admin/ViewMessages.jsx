import { useState, useEffect } from "react";
import {
    fetchSupportCases,
    fetchSupportCaseDetails,
    postAdminReply,
    closeSupportCase
} from "../../services/adminSupportService";
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

    // Support requests state (fetched from backend)
    const [supportRequests, setSupportRequests] = useState([]);
    // Loading and error state for requests
    const [requestsLoading, setRequestsLoading] = useState(true);
    const [requestsError, setRequestsError] = useState(null);

    // Fetch all support requests only once on mount
    useEffect(() => {
        setRequestsLoading(true);
        setRequestsError(null);
        fetchSupportCases()
            .then(data => {
                setSupportRequests(data);
                setRequestsLoading(false);
            })
            .catch(err => {
                setRequestsError("Failed to load support requests");
                setRequestsLoading(false);
            });
    }, []);

    // Get filtered requests based on search term (searches subject, publicId, from)
    const getFilteredRequests = () => {
        if (!searchTerm.trim()) {
            return supportRequests; // Return all requests if no search term
        }

        const search = searchTerm.toLowerCase();
        return supportRequests.filter(request => {
            const matchesName = request.from && request.from.toLowerCase().includes(search);
            const matchesSubject = request.subject && request.subject.toLowerCase().includes(search);
            const matchesPublicId = request.publicId && request.publicId.toLowerCase().includes(search);
            const matchesCategory = request.category && request.category.toLowerCase().includes(search);
            
            // Return true if any field matches the search term
            return matchesName || matchesSubject || matchesPublicId || matchesCategory;
        });
    };

    // Update request status
    const updateRequestStatus = async (requestId, newStatus) => {
        if (newStatus === "resolved") {
            try {
                await closeSupportCase(requestId);
                setSupportRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: "resolved" } : r));
                if (selectedRequest && selectedRequest.id === requestId) {
                    setSelectedRequest({ ...selectedRequest, status: "resolved" });
                }
            } catch (err) {
                alert("Failed to close support case");
            }
        } else if (newStatus === "open") {
            setSupportRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: "open" } : r));
            if (selectedRequest && selectedRequest.id === requestId) {
                setSelectedRequest({ ...selectedRequest, status: "open" });
            }
        }
    };

    // Handle request click
    const handleRequestClick = async (request) => {
        try {
            const details = await fetchSupportCaseDetails(request.id);
            if (!details) {
                setRequestsError("No details found for this request.");
                setSelectedRequest(null);
                return;
            }
            // Map backend fields to UI expected fields
            const latestMessage = details.messages && details.messages.length > 0
                ? details.messages[details.messages.length - 1]
                : null;
            setSelectedRequest({
                id: details.id,
                publicId: details.publicId,
                subject: details.subject,
                status: details.status ? details.status.toLowerCase() : '',
                date: details.createdAt,
                from: details.createdByUserName || (latestMessage ? latestMessage.sentByUserName : ''),
                email: '', // If you have email, map it here
                role: latestMessage ? latestMessage.sentByUserRole.toLowerCase() : '',
                category: details.category || '',
                priority: details.priority || '',
                message: latestMessage ? latestMessage.messageBody : '',
                responded: details.status && details.status.toLowerCase() === 'resolved',
                messages: details.messages || []
            });
            // Optionally update status to in_progress if open
            if (details.status && details.status.toLowerCase() === "open") {
                setSupportRequests(prev => prev.map(r => r.id === details.id ? { ...r, status: "in_progress" } : r));
            }
        } catch (err) {
            setRequestsError("Failed to load request details");
            setSelectedRequest(null);
            console.error("Error fetching request details:", err);
        }
    };

    // Handle reply
    const handleReply = (request) => {
        setSelectedRequest(request);
        setReplyContent("");
        setShowReplyModal(true);
    };

    const sendReply = async (e) => {
        e.preventDefault();
        if (!replyContent.trim()) {
            alert("Please enter a reply message");
            return;
        }
        setIsLoading(true);
        try {
            await postAdminReply(selectedRequest.id, { messageBody: replyContent });
            const updatedMessages = [...selectedRequest.messages, {
                messageBody: replyContent,
                sentByUserName: user.name, // Using the local admin user object
                sentByUserRole: user.role.toUpperCase(),
                createdAt: new Date().toISOString()
            }];

            const updatedRequest = { ...selectedRequest, messages: updatedMessages, status: 'pending_user_reply' };
            setSelectedRequest(updatedRequest);
            setSupportRequests(prev => prev.map(r => r.id === selectedRequest.id ? updatedRequest : r));
            
            setIsLoading(false);
            setShowReplyModal(false);
            alert(`Support response sent to ${selectedRequest.from}`);
        } catch (err) {
            setIsLoading(false);
            alert("Failed to send response");
            console.error("Reply Error:", err);
        }
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
            if (!name || typeof name !== 'string') return '';
            const parts = name.trim().split(' ');
            if (parts.length === 1) {
                return parts[0] && parts[0].charAt(0) ? parts[0].charAt(0).toUpperCase() : '';
            }
            const first = parts[0] && parts[0].charAt(0) ? parts[0].charAt(0).toUpperCase() : '';
            const last = parts[parts.length - 1] && parts[parts.length - 1].charAt(0) ? parts[parts.length - 1].charAt(0).toUpperCase() : '';
            return (first + last);
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

    // Get count of open requests (not closed)
    const getOpenCount = () => {
        return supportRequests.filter(request => request.status && request.status.toLowerCase() !== "closed").length;
    };

    // Get count of open requests by role (not closed)
    const getOpenCountByRole = (role) => {
        return supportRequests.filter(request => request.status && request.status.toLowerCase() !== "closed" && request.role === role).length;
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

            {/* Search Only */}
            <div className="bg-white rounded-lg p-4 shadow-md mb-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="w-full md:w-1/3 relative">
                        <Input1
                            type="text"
                            placeholder="Search by name, subject, ID, or category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            variant="outlined"
                            className="w-full"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        )}
                    </div>
                    {searchTerm && (
                        <div className="text-sm text-gray-600 flex items-center">
                            Showing {getFilteredRequests().length} of {supportRequests.length} requests
                        </div>
                    )}
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
                                        <div className="w-full">
                                            <div className="flex justify-between">
                                                <p className="truncate font-medium">{request.from}</p>
                                                {/* <p className="text-xs text-gray-500">{new Date(request.date).toLocaleDateString()}</p> */}
                                            </div>
                                            <p className="text-sm truncate font-semibold mt-1">{request.subject} <span className="text-blue-700">: {request.publicId}</span></p>
                                            <div className="flex mt-2 space-x-2">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                    {request.category}
                                                </span>
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${request.status && request.status.toLowerCase() === 'closed' ? 'bg-gray-200 text-gray-700' : 'bg-blue-100 text-blue-800'}`}>
                                                    {request.status && request.status.toLowerCase() === 'closed' ? 'Closed' : 'Open'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-6 text-center text-gray-500">
                                    {requestsLoading ? (
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-500 mr-2"></div>
                                            Loading support requests...
                                        </div>
                                    ) : searchTerm ? (
                                        <div>
                                            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                            </svg>
                                            <p className="font-medium">No requests found for "{searchTerm}"</p>
                                            <p className="text-sm mt-1">Try searching with different keywords</p>
                                        </div>
                                    ) : (
                                        <div>
                                            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0H4m16 0l-2-2m2 2l-2 2M4 13l2-2m-2 2l2 2"></path>
                                            </svg>
                                            <p className="font-medium">No support requests available</p>
                                            <p className="text-sm mt-1">Support requests will appear here when they are submitted</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                
                {/* Request Detail */}
                <div className="md:col-span-2">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden h-[calc(100vh-220px)]">
                        {requestsError && (
                            <div className="p-4 text-red-600 bg-red-50 border border-red-200 mb-2 rounded">
                                {requestsError}
                            </div>
                        )}
                        {selectedRequest ? (
                            <>
                                <div className="p-4 bg-gray-50 border-b border-gray-200">
                                    <div className="flex justify-between items-center">
                                        <h2 className="font-bold text-xl">
                                            {selectedRequest.subject}
                                            <span className="text-blue-700 font-normal"> : {selectedRequest.publicId}</span>
                                        </h2>
                                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColorClass(selectedRequest.priority)}`}>
                                            {selectedRequest.priority && typeof selectedRequest.priority === 'string' && selectedRequest.priority.length > 0
                                                ? selectedRequest.priority.charAt(0).toUpperCase() + selectedRequest.priority.slice(1)
                                                : ''} Priority
                                        </div>
                                    </div>
                                    <div className="flex mt-2 space-x-3">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${selectedRequest.status && selectedRequest.status.toLowerCase() === 'closed' ? 'bg-gray-200 text-gray-700' : 'bg-blue-100 text-blue-800'}`}>
                                            {selectedRequest.status && selectedRequest.status.toLowerCase() === 'closed' ? 'Closed' : 'Open'}
                                        </span>
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                            {selectedRequest.category}
                                        </span>
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200">
                                            {selectedRequest.date && !isNaN(new Date(selectedRequest.date))
                                                ? formatDate(selectedRequest.date)
                                                : 'No Date'}
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
                                            {/* <div className="text-sm text-gray-500 mt-1">{formatDate(selectedRequest.date)}</div> */}
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                        <div className="space-y-4">
                                            {selectedRequest.messages && selectedRequest.messages.length > 0 ? (
                                                selectedRequest.messages.map((msg) => {
                                                    const isAdmin = msg.sentByUserRole && msg.sentByUserRole.toLowerCase() === 'admin';
                                                    return (
                                                        <div
                                                            key={msg.id}
                                                            className={`flex items-start space-x-3 mb-2 ${isAdmin ? 'justify-end' : ''}`}
                                                        >
                                                            {!isAdmin && (
                                                                <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium ${getAvatarColor(msg.sentByUserRole && msg.sentByUserRole.toLowerCase())}`}>
                                                                    {getInitials(msg.sentByUserName)}
                                                                </div>
                                                            )}
                                                            <div className={`max-w-xs md:max-w-md rounded-lg p-3 ${isAdmin ? 'bg-blue-100 text-blue-900 ml-auto' : 'bg-gray-100 text-gray-900'}`}>
                                                                <div className="font-semibold text-sm">{msg.sentByUserName}</div>
                                                                <div className="text-xs text-gray-500">{formatDate(msg.createdAt)}</div>
                                                                <div className="mt-1 text-sm whitespace-pre-line">{msg.messageBody}</div>
                                                            </div>
                                                            {isAdmin && (
                                                                <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium ${getAvatarColor(msg.sentByUserRole && msg.sentByUserRole.toLowerCase())}`}>
                                                                    {getInitials(msg.sentByUserName)}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <p className="text-gray-500">No messages found for this request.</p>
                                            )}
                                        </div>
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
                                        {selectedRequest.status && selectedRequest.status.toLowerCase() !== "closed" ? (
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