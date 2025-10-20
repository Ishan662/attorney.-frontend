// >> In your new file: pages/ClientCaseDetails.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout'; // Assuming clients use the same layout
import Button1 from '../../components/UI/Button1';
import { useAuth } from '../../context/AuthContext';
import { getCaseById, getHearingsForCase } from '../../services/caseService';

// Static documents can remain for display purposes.
const staticDocuments = [
    { name: 'Will of Eleanor Vance.pdf', url: '#' },
    { name: 'Estate Valuation Report.pdf', url: '#' },
];

const ClientCaseDetails = () => {
    const { caseId } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth(); // Get the logged-in client's info

    // State for fetching and displaying data
    const [caseData, setCaseData] = useState(null);
    const [hearings, setHearings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [showChatModal, setShowChatModal] = useState(false);
    const [chatMessage, setChatMessage] = useState('');
    const [chatMessages, setChatMessages] = useState([
        {
            id: 1,
            sender: 'System',
            message: 'Welcome to the case team chat. You can discuss case details and coordinate with your lawyer here.',
            timestamp: '14/07/2025, 19:35:16',
            isSystem: true
        },
        {
            id: 2,
            sender: 'Lawyer',
            message: 'Thank you for your preference. We have a 2018 BMW M2 Coupe available. It\'s a petrol car with an automatic transmission and has done 61,465km. The price is $49,990. Would you like more information about this car?',
            timestamp: '14/07/2025, 19:35:16',
            isSystem: false,
            isLawyer: true
        },
        {
            id: 3,
            sender: 'Client',
            message: 'yes',
            timestamp: '14/07/2025, 19:36:27',
            isSystem: false,
            isLawyer: false
        },
        {
            id: 4,
            sender: 'Lawyer',
            message: 'Absolutely! This 2018 BMW M2 Coupe is a New Zealand new car with low mileage. It has a 2993cc twin-turbo DOHC inline-six petrol engine that produces 272kW and 465Nm of torque. It can go from 0 to 100kph in 4 seconds. The car is in Snapper Rocks blue metallic color and has a 7-Speed DCT transmission. Would you like to know about its interior features?',
            timestamp: '14/07/2025, 19:36:38',
            isSystem: false,
            isLawyer: true
        }
    ]);

    // --- DATA FETCHING ---
    // This logic remains the same. The backend's security ensures a client
    // can only fetch cases they are a member of.
    useEffect(() => {
        if (!caseId) {
            setError("Case ID not found.");
            setIsLoading(false);
            return;
        }

        const fetchAllDetails = async () => {
            setIsLoading(true);
            try {
                const [caseDetailsData, hearingsData] = await Promise.all([
                    getCaseById(caseId),
                    getHearingsForCase(caseId)
                ]);
                
                setCaseData(caseDetailsData);
                setHearings(hearingsData || []);
            } catch (err) {
                setError("Failed to fetch case details. You may not have permission to view this case.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllDetails();
    }, [caseId]);

    // Handle chat functionality
    const handleSendMessage = () => {
        if (chatMessage.trim()) {
            const newMessage = {
                id: chatMessages.length + 1,
                sender: 'Client',
                message: chatMessage,
                timestamp: new Date().toLocaleString('en-GB', {
                    day: '2-digit',
                    month: '2-digit', 
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                }),
                isSystem: false,
                isLawyer: false
            };
            setChatMessages(prev => [...prev, newMessage]);
            setChatMessage('');
        }
    };

    // --- DYNAMIC TIMELINE GENERATION (REMAINS THE SAME) ---
    const timelineEvents = hearings
        .sort((a, b) => new Date(a.hearingDate) - new Date(b.hearingDate))
        .map(hearing => ({
            date: new Date(hearing.hearingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            label: hearing.title || "Key Date"
        }));

    // --- RENDER LOGIC ---
    // The user object passed to PageLayout now uses the real authenticated user.
    if (isLoading || !currentUser) return <PageLayout user={currentUser}><div>Loading...</div></PageLayout>;
    if (error) return <PageLayout user={currentUser}><div className="text-red-500 p-8">{error}</div></PageLayout>;
    if (!caseData) return <PageLayout user={currentUser}><div>Case not found.</div></PageLayout>;

    return (
        <PageLayout user={currentUser}> 
            {/* Chat Button - Fixed position */}
            <div className="fixed bottom-6 right-6 z-40">
                <button
                    onClick={() => setShowChatModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-colors duration-200"
                    title="Team Chat"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-4.126-.98L3 20l1.02-5.874A8.955 8.955 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                    </svg>
                </button>
            </div>

            <div className="mb-2">
                {/* The back button for a client might go to their main dashboard where they see all their cases */}
                <Button1 text="← Back to My Cases" onClick={() => navigate('/client/caseprofiles')} className="mb-4" />
            </div>
            <h1 className="text-2xl font-bold mb-6">Case Details: {caseData.caseNumber}</h1>

            {/* Case Progress Timeline - View Only */}
            <section className="bg-white rounded-lg p-8 mb-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-6 text-center">Case Progress Timeline</h2>
                <div className="flex items-center justify-between">
                    {timelineEvents.map((t, idx) => (
                        <React.Fragment key={idx}>
                            <div className="flex flex-col items-center text-center">
                                <div className={`w-8 h-8 rounded-full ${new Date(t.date) > new Date() ? 'bg-gray-300' : 'bg-orange-500'} text-white flex items-center justify-center font-bold`}>{idx + 1}</div>
                                <div className="text-xs mt-2 text-gray-700">{t.date}<br />{t.label}</div>
                            </div>
                            {idx < timelineEvents.length - 1 && <div className="flex-1 h-1 bg-gray-200 mx-2" />}
                        </React.Fragment>
                    ))}
                </div>
            </section>

            {/* Hearings & Key Dates - View Only */}
            <section className="bg-white rounded-lg p-8 mb-6 shadow-md">
                <h2 className="text-xl font-semibold mb-6">Hearings & Key Dates</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                    {hearings.map(hearing => (
                        // --- REMOVED: The onClick handler is gone, so the hearing is not clickable ---
                        <div key={hearing.id} className="p-4 border rounded-lg">
                            <div className="font-bold text-gray-800 text-base">{hearing.title}</div>
                            <div className="text-gray-600 mb-2">{new Date(hearing.hearingDate).toLocaleString('en-US', { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric', 
                                hour: 'numeric', 
                                minute: '2-digit', 
                                hour12: true 
                            })}</div>
                            {hearing.location && <p className=""><span className="font-semibold">Location:</span> {hearing.location}</p>}
                            {hearing.note && <p className="mt-1"><span className="font-semibold">Note:</span> {hearing.note}</p>}
                            <div className="mt-2">
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${hearing.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {hearing.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Meeting Requests Section
            <section className="bg-white rounded-lg p-8 mb-6 shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Meetings & Calendar</h2>
                    <Button1 
                        text="Go to Calendar"
                        onClick={() => navigate('/client/calendar')}
                        className="flex items-center"
                    />
                </div>
                
                <div className="text-center py-8 text-gray-500">
                    <p>Manage your meetings and schedule consultations with your lawyer.</p>
                    <p className="text-sm mt-2">Click "Go to Calendar" to view your schedule and request new meetings.</p>
                </div>
            </section> */}

            {/* Case Overview & Parties Involved - Combined Section */}
            <section className="bg-white rounded-lg p-8 mb-6 shadow-md">
                <h2 className="text-xl font-semibold mb-6">Case Overview & Parties Involved</h2>
                
                {/* Case Overview */}
                <div className="mb-8">
                    <h3 className="text-lg font-medium mb-4 text-gray-800">Case Information</h3>
                    <div className="flex flex-col md:flex-row">
                        <div className="flex-1">
                            <div className="font-semibold">Case Name:</div>
                            <p className="mb-2">{caseData.caseTitle}</p>
                            <div className="font-semibold">Description:</div>
                            <p>{caseData.description || 'N/A'}</p>
                        </div>
                        <div className="flex-1 md:ml-12 mt-8 md:mt-0">
                            <div className="font-semibold">Court Name:</div>
                            <p className="mb-2">{caseData.courtName || 'N/A'}</p>
                            <div className="font-semibold">Status:</div>
                            <div><span className="inline-block px-4 py-1 rounded-full bg-green-100 text-green-700 font-semibold text-sm">{caseData.status}</span></div>
                        </div>
                    </div>
                </div>

                {/* Parties Involved */}
                <div className="border-t pt-6">
                    <h3 className="text-lg font-medium mb-4 text-gray-800">Parties Involved</h3>
                    <div className="flex flex-col md:flex-row">
                        <div className="flex-1 mb-6 md:mb-0">
                            <div className="font-semibold">Your Lawyer:</div>
                            <p className="mb-2">{caseData.ownerLawyerName || 'N/A'}</p> 
                            <div className="font-semibold">Law Firm:</div>
                            <p>{caseData.firmName || 'N/A'}</p>
                        </div>
                        <div className="flex-1 md:ml-12">
                            <div className="font-semibold">Opposing Party:</div>
                            <p>{caseData.opposingPartyName || 'N/A'}</p>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Financials - View Only */}
            <section className="bg-white rounded-lg p-8 mb-6 shadow-md">
              <h2 className="text-xl font-semibold mb-6">Financials</h2>
              <div className="flex flex-col md:flex-row md:justify-between">
                <div className="flex-1 mb-6 md:mb-0">
                  <div className="font-semibold">Agreed Fee:</div>
                  <p className="mb-2">${caseData.agreedFee ? caseData.agreedFee.toFixed(2) : '0.00'}</p>
                </div>
                <div className="flex-1 md:ml-12">
                  <div className="font-semibold">Payment Status:</div>
                  <div className="mb-2">
                    <span className="inline-block px-4 py-1 rounded-full bg-yellow-100 text-yellow-800 font-semibold text-sm">
                      {caseData.paymentStatus ? caseData.paymentStatus.replace('_', ' ') : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Documents - View Only */}
            <section className="bg-white rounded-lg p-8 mb-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-6">Documents</h2>
                <ul className="list-disc pl-6 mb-4 text-blue-700">
                    {staticDocuments.map((doc, idx) => (
                        <li key={idx}><a href={doc.url} className="hover:underline">{doc.name}</a></li>
                    ))}
                </ul>
                {/* --- REMOVED: The "Add Documents" button is gone --- */}
            </section>

            {/* Team Chat Modal */}
            {showChatModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-end z-50" onClick={() => setShowChatModal(false)}>
                    <div className="bg-white rounded-lg shadow-lg w-96 mx-4 mt-4 h-[calc(100vh-2rem)] flex flex-col" onClick={(e) => e.stopPropagation()}>
                        {/* Chat Header */}
                        <div className="border-b px-4 py-3 flex justify-between items-center">
                            <div>
                                <h3 className="text-base font-semibold">Chat Box</h3>
                                <p className="text-xs text-gray-600">Case: {caseData.caseNumber}</p>
                            </div>
                            <button 
                                className="text-gray-400 hover:text-gray-500" 
                                onClick={() => setShowChatModal(false)}
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Chat Messages Area */}
                        <div className="flex-1 overflow-y-auto p-3 bg-gray-50">
                            <div className="space-y-3">
                                {chatMessages.map((msg) => (
                                    <div key={msg.id} className={`flex ${msg.isSystem ? 'justify-center' : msg.isLawyer ? 'justify-start' : 'justify-end'}`}>
                                        <div className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                                            msg.isSystem 
                                                ? 'bg-yellow-100 text-yellow-800 text-center text-xs px-2 py-1'
                                                : msg.isLawyer
                                                    ? 'bg-white text-gray-800 rounded-bl-none border' 
                                                    : 'bg-gray-400 bg-opacity-60 text-gray-800 rounded-br-none'
                                        }`}>
                                            {!msg.isSystem && (
                                                <div className="text-xs font-medium mb-1 opacity-70">
                                                    {msg.isLawyer ? 'Lawyer' : 'You'}
                                                </div>
                                            )}
                                            <div>{msg.message}</div>
                                            <div className={`text-xs mt-1 ${
                                                msg.isSystem 
                                                    ? 'text-yellow-600' 
                                                    : 'text-gray-500'
                                            }`}>
                                                {msg.timestamp}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Chat Input Area */}
                        <div className="border-t p-3 bg-white">
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={chatMessage}
                                    onChange={(e) => setChatMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Type your message..."
                                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2 transition-colors duration-200 flex items-center justify-center"
                                >
                                    <span className="text-sm font-medium">Send</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}



        </PageLayout>
    );
};

export default ClientCaseDetails;