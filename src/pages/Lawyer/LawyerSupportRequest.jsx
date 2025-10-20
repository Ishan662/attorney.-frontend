import { useState, useEffect } from "react";
import PageLayout from "../../components/layout/PageLayout";
import Button1 from "../../components/UI/Button1";
import Button2 from "../../components/UI/Button2";
import Input1 from "../../components/UI/Input1";
import PaymentGuideModal from "../../components/UI/PaymentGuideModal";
import Swal from 'sweetalert2';
import { 
    getMySupportCases, 
    getSupportCaseDetails, 
    createSupportCase, 
    addMessageToCase, 
    closeMySupportCase 
} from '../../services/lawyerSupportService';

const LawyerSupportRequest = () => {
    const user = { name: 'Lawyer User', email: 'lawyer@example.com', role: 'lawyer' };
    const [supportRequests, setSupportRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // 'create' or 'reply'
    const [isLoading, setIsLoading] = useState(false);
    const [requestsLoading, setRequestsLoading] = useState(true);
    const [showPaymentGuide, setShowPaymentGuide] = useState(false);
    
    // Form states
    const [subject, setSubject] = useState('');
    const [messageContent, setMessageContent] = useState('');

    useEffect(() => {
        loadMyCases();
    }, []);

    const loadMyCases = async () => {
        setRequestsLoading(true);
        try {
            const data = await getMySupportCases();
            setSupportRequests(data || []);
        } catch (err) {
            console.error('Failed loading my support cases:', err);
            setSupportRequests([]);
        } finally {
            setRequestsLoading(false);
        }
    };

    const handleCaseClick = async (caseItem) => {
        try {
            const details = await getSupportCaseDetails(caseItem.id);
            setSelectedRequest(details);
        } catch (err) {
            console.error('Failed to load case details:', err);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load case details',
                confirmButtonColor: '#EF4444'
            });
        }
    };

    const handleCreateNew = () => {
        setModalMode('create');
        setSubject('');
        setMessageContent('');
        setShowModal(true);
    };

    const handleCloseAllModals = () => {
        setShowModal(false);
        setShowPaymentGuide(false);
        setSubject('');
        setMessageContent('');
    };

    const handleReplyOpen = () => {
        setModalMode('reply');
        setMessageContent('');
        setShowModal(true);
    };

    const handleCloseCase = async () => {
        if (!selectedRequest) return;
        
        const result = await Swal.fire({
            title: 'Close Case?',
            text: 'Are you sure you want to close this case?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#F59E0B',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, close it'
        });
        
        if (!result.isConfirmed) return;
        
        try {
            setIsLoading(true);
            await closeMySupportCase(selectedRequest.id);
            // Update local state
            setSelectedRequest(prev => ({ ...prev, status: 'CLOSED' }));
            setSupportRequests(prev => prev.map(r => 
                r.id === selectedRequest.id ? { ...r, status: 'CLOSED' } : r
            ));
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Case closed successfully',
                confirmButtonColor: '#10B981'
            });
        } catch (err) {
            console.error('Failed to close case:', err);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to close case',
                confirmButtonColor: '#EF4444'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!messageContent.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'Missing Message',
                text: 'Please enter a message',
                confirmButtonColor: '#F59E0B'
            });
            return;
        }
        
        setIsLoading(true);
        try {
            if (modalMode === 'create') {
                if (!subject.trim()) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Missing Subject',
                        text: 'Please enter a subject',
                        confirmButtonColor: '#F59E0B'
                    });
                    setIsLoading(false);
                    return;
                }
                // Create new support case
                const newCase = await createSupportCase({
                    subject: subject.trim(),
                    firstMessage: messageContent.trim()
                });
                // Refresh the list
                await loadMyCases();
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Support case created successfully',
                    confirmButtonColor: '#10B981'
                });
                setShowModal(false);
            } else if (modalMode === 'reply' && selectedRequest) {
                // Add reply to existing case
                await addMessageToCase(selectedRequest.id, {
                    messageBody: messageContent.trim()
                });
                // Reload case details to show new message
                const updatedDetails = await getSupportCaseDetails(selectedRequest.id);
                setSelectedRequest(updatedDetails);
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Reply sent successfully',
                    confirmButtonColor: '#10B981'
                });
                setShowModal(false);
            }
        } catch (err) {
            console.error('Submit error:', err);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Failed to ${modalMode === 'create' ? 'create case' : 'send reply'}`,
                confirmButtonColor: '#EF4444'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const filtered = supportRequests.filter(s => {
        if (!searchTerm) return true;
        const q = searchTerm.toLowerCase();
        return (s.subject && s.subject.toLowerCase().includes(q)) || 
               (s.publicId && s.publicId.toLowerCase().includes(q)) ||
               (s.status && s.status.toLowerCase().includes(q));
    });

    // Helper functions
    const formatDate = (dateStr) => {
        if (!dateStr) return 'No Date';
        const date = new Date(dateStr);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        // Normalize status to show only OPEN or CLOSED
        const normalizedStatus = (status === 'CLOSED') ? 'CLOSED' : 'OPEN';
        
        switch (normalizedStatus) {
            case 'OPEN': 
                return 'bg-green-100 text-green-700 border border-green-200';
            case 'CLOSED': 
                return 'bg-gray-100 text-gray-700 border border-gray-200';
            default: 
                return 'bg-green-100 text-green-700 border border-green-200';
        }
    };

    const getDisplayStatus = (status) => {
        // Always show either OPEN or CLOSED
        return (status === 'CLOSED') ? 'CLOSED' : 'OPEN';
    };

    return (
        <PageLayout user={user}>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">My Support Cases</h1>
                    <p className="text-gray-600">Create and manage your support requests</p>
                </div>
                <div className="flex space-x-2">
                    <Button1 text="New Support Case" onClick={handleCreateNew} />
                </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-md mb-6">
                <div className="flex items-center gap-3">
                    <Input1 
                        placeholder="Search by subject, ID, or status..." 
                        value={searchTerm} 
                        onChange={e => setSearchTerm(e.target.value)} 
                        className="flex-1"
                    />
                    {searchTerm && (
                        <span className="text-sm text-gray-600">
                            {filtered.length} of {supportRequests.length} cases
                        </span>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-300px)]">
                <div className="md:col-span-1">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
                        <div className="p-3 bg-gray-50 border-b border-gray-200 flex-shrink-0">
                            <h2 className="font-semibold">{filtered.length} Support Cases</h2>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {requestsLoading ? (
                                <div className="p-6 text-center text-gray-500">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-500 mx-auto mb-2"></div>
                                    Loading cases...
                                </div>
                            ) : filtered.length > 0 ? (
                                filtered.map(caseItem => (
                                    <div 
                                        key={caseItem.id} 
                                        className={`p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${selectedRequest?.id === caseItem.id ? 'bg-blue-50' : ''}`} 
                                        onClick={() => handleCaseClick(caseItem)}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{caseItem.subject}</p>
                                                <p className="text-xs text-gray-500 mt-1">ID: {caseItem.publicId}</p>
                                            </div>
                                            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(caseItem.status)}`}>
                                                {getDisplayStatus(caseItem.status)}
                                            </span>
                                        </div>
                                        <div className="mt-2 text-xs text-gray-500">
                                            {formatDate(caseItem.createdAt)}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-6 text-center text-gray-500">
                                    {searchTerm ? (
                                        <div>
                                            <p className="font-medium">No cases found</p>
                                            <p className="text-sm mt-1">Try different search terms</p>
                                        </div>
                                    ) : (
                                        <div>
                                            <p className="font-medium">No support cases yet</p>
                                            <p className="text-sm mt-1">Click "New Support Case" to create your first case</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
                        {selectedRequest ? (
                            <>
                                <div className="p-4 bg-gray-50 border-b border-gray-200 flex-shrink-0">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-lg">{selectedRequest.subject}</h3>
                                            <div className="text-sm text-gray-500 mt-1">
                                                Case ID: {selectedRequest.publicId} • Created: {formatDate(selectedRequest.createdAt)}
                                            </div>
                                        </div>
                                        <span className={`inline-flex px-4 py-2 text-sm font-semibold rounded-full ${getStatusColor(selectedRequest.status)}`}>
                                            {getDisplayStatus(selectedRequest.status)}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="flex-1 p-4 overflow-y-auto">
                                    <div className="space-y-4">
                                        {selectedRequest.messages && selectedRequest.messages.length > 0 ? (
                                            selectedRequest.messages.map((msg, index) => {
                                                const isMe = msg.sentByUserRole !== 'ADMIN';
                                                return (
                                                    <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                        <div className={`max-w-xs md:max-w-md rounded-lg p-3 ${
                                                            isMe 
                                                                ? 'bg-blue-100 text-blue-900' 
                                                                : 'bg-gray-100 text-gray-900'
                                                        }`}>
                                                            <div className="font-semibold text-sm">
                                                                {msg.sentByUserName} 
                                                                <span className="font-normal text-xs ml-1">
                                                                    ({msg.sentByUserRole})
                                                                </span>
                                                            </div>
                                                            <div className="text-xs text-gray-500 mb-2">
                                                                {formatDate(msg.createdAt)}
                                                            </div>
                                                            <div className="text-sm whitespace-pre-wrap">
                                                                {msg.messageBody}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="text-center text-gray-500 py-8">
                                                <p>No messages in this case yet.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-gray-50">
                                    <div className="flex justify-end space-x-3">
                                        {getDisplayStatus(selectedRequest.status) === 'OPEN' ? (
                                            <>
                                                <Button2 
                                                    text="Add Reply" 
                                                    onClick={handleReplyOpen}
                                                    disabled={isLoading}
                                                />
                                                <Button1 
                                                    text="Close Case" 
                                                    onClick={handleCloseCase}
                                                    disabled={isLoading}
                                                />
                                            </>
                                        ) : (
                                            <div className="flex items-center">
                                                <svg className="w-4 h-4 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                <span className="text-sm text-gray-600">
                                                    This case has been closed
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full p-6 text-center text-gray-500">
                                <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                                <p className="text-lg font-medium">Select a support case</p>
                                <p className="text-sm mt-2">Choose a case from the list to view its details and messages</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal for Create/Reply */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">
                                {modalMode === 'create' ? 'Create New Support Case' : 'Add Reply'}
                            </h2>
                            <button
                                onClick={handleCloseAllModals}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>

                        {/* Payment Guide Link - Only show in create mode */}
                        {modalMode === 'create' && (
                            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="flex items-center space-x-2">
                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    <span className="text-sm text-blue-800">
                                        Need help with payments? 
                                        <button 
                                            type="button"
                                            onClick={() => setShowPaymentGuide(true)}
                                            className="ml-1 text-blue-600 hover:text-blue-800 underline font-medium"
                                        >
                                            Click here to see how to apply for payment options
                                        </button>
                                    </span>
                                </div>
                            </div>
                        )}
                        
                        <form onSubmit={handleSubmit}>
                            {modalMode === 'create' && (
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Subject *
                                    </label>
                                    <Input1
                                        type="text"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        placeholder="Brief description of your issue..."
                                        required
                                        className="w-full"
                                    />
                                </div>
                            )}
                            
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {modalMode === 'create' ? 'Message *' : 'Reply Message *'}
                                </label>
                                <textarea
                                    value={messageContent}
                                    onChange={(e) => setMessageContent(e.target.value)}
                                    placeholder={modalMode === 'create' 
                                        ? "Describe your question or issue in detail..."
                                        : "Type your follow-up message..."
                                    }
                                    rows={6}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            
                            <div className="flex justify-end space-x-3">
                                <Button2 
                                    text="Cancel" 
                                    onClick={handleCloseAllModals}
                                    disabled={isLoading}
                                />
                                <Button1 
                                    type="submit" 
                                    text={isLoading 
                                        ? (modalMode === 'create' ? 'Creating...' : 'Sending...') 
                                        : (modalMode === 'create' ? 'Create Case' : 'Send Reply')
                                    }
                                    disabled={isLoading}
                                />
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Payment Guide Modal */}
            <PaymentGuideModal 
                isOpen={showPaymentGuide} 
                onClose={handleCloseAllModals} 
            />
        </PageLayout>
    );
};

export default LawyerSupportRequest;
