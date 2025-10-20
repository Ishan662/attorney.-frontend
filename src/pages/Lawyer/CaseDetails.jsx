import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout';
import Button1 from '../../components/UI/Button1';
import Button2 from '../../components/UI/Button2';
import AddNextHearingModal from './AddNextHearingDate';
import { useAuth } from '../../context/AuthContext';
import { getCaseById, getHearingsForCase, createHearing, getJuniorsForSelection, addCaseMember } from '../../services/caseService';
import AddClientModal from './AddNewClientModel';
import EditHearingModal from './EditHearingModal';
import { updateHearing, deleteHearing } from '../../services/caseService';
import DivorceDetails from '../../components/specialized/DivorceDetails';
import caseDetailsService from '../../services/caseDetailsService';
import useCaseAdditionalDetails from '../../hooks/useCaseAdditionalDetails';
import Swal from 'sweetalert2';
import PrintService from '../../services/printService';

// Static data for the documents section
const staticDocuments = [
    { name: 'Will of Eleanor Vance.pdf', url: '#' },
    { name: 'Estate Valuation Report.pdf', url: '#' },
    { name: 'Client Correspondence Log.pdf', url: '#' },
];

const CaseDetails = () => {
    const { caseId } = useParams();
    const navigate = useNavigate();
    const [showClientModal, setShowClientModal] = useState(false);
    const [showEditHearingModal, setShowEditHearingModal] = useState(false);
    const [showJuniorModal, setShowJuniorModal] = useState(false);
    const [showChatModal, setShowChatModal] = useState(false);
    const [selectedHearing, setSelectedHearing] = useState(null);
    const [activeTab, setActiveTab] = useState('general');
    const [chatMessage, setChatMessage] = useState('');
    const [chatMessages, setChatMessages] = useState([
        {
            id: 1,
            sender: 'System',
            message: 'Welcome to the case team chat. You can discuss case details and coordinate with your team here.',
            timestamp: '14/07/2025, 19:35:16',
            isSystem: true
        },
        {
            id: 2,
            sender: 'Client',
            message: 'Thank you for your preference. We have a 2018 BMW M2 Coupe available. It\'s a petrol car with an automatic transmission and has done 61,465km. The price is $49,990. Would you like more information about this car?',
            timestamp: '14/07/2025, 19:35:16',
            isSystem: false,
            isClient: true
        },
        {
            id: 3,
            sender: 'Lawyer',
            message: 'yes',
            timestamp: '14/07/2025, 19:36:27',
            isSystem: false,
            isClient: false
        },
        {
            id: 4,
            sender: 'Client',
            message: 'Absolutely! This 2018 BMW M2 Coupe is a New Zealand new car with low mileage. It has a 2993cc twin-turbo DOHC inline-six petrol engine that produces 272kW and 465Nm of torque. It can go from 0 to 100kph in 4 seconds. The car is in Snapper Rocks blue metallic color and has a 7-Speed DCT transmission. Would you like to know about its interior features?',
            timestamp: '14/07/2025, 19:36:38',
            isSystem: false,
            isClient: true
        }
    ]);
    
    const [caseData, setCaseData] = useState(null); 
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const { currentUser, loading: authLoading } = useAuth();

    const user = {
        name: currentUser.fullName,
        email: currentUser.email,
        role:  currentUser.role.toLowerCase()
    };

    const [showHearingModal, setShowHearingModal] = useState(false);
    const [hearings, setHearings] = useState([]);
    const [availableJuniors, setAvailableJuniors] = useState([]);
    const [isLoadingJuniors, setIsLoadingJuniors] = useState(false);

    // Hook for managing additional details
    const { updateAdditionalDetails, isLoading: isUpdatingDetails, error: updateError, clearError } = useCaseAdditionalDetails({ id: caseId });

    // --- DATA FETCHING ---
    useEffect(() => {
        if (!caseId) {
            setError("Case ID not found.");
            setIsLoading(false);
            return;
        }

        const fetchAllDetails = async () => {
            setIsLoading(true);
            try {
                const [caseDetailsData, hearingsData, juniorsData] = await Promise.all([
                    getCaseById(caseId),
                    getHearingsForCase(caseId),
                    getJuniorsForSelection()
                ]);
                
                setCaseData(caseDetailsData);
                console.log("Case Details:", caseDetailsData);
                setHearings(hearingsData || caseDetailsData.hearings || []);
                
                const formattedJuniors = juniorsData.map(junior => ({
                    id: junior.id,
                    name: `${junior.firstName} ${junior.lastName}`,
                    email: junior.email,
                    specialization: junior.specialization || "General Practice",
                    experience: junior.experience || "N/A"
                }));
                setAvailableJuniors(formattedJuniors);
            } catch (err) {
                setError("Failed to fetch case details. You may not have permission to view this case.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllDetails();
    }, [caseId]);

    // --- EVENT HANDLERS ---
    const handleAddHearing = async (newHearingData) => {
        try {
            const savedHearing = await createHearing(caseId, newHearingData);
            setHearings(prevHearings => 
                [...prevHearings, savedHearing].sort((a, b) => new Date(a.hearingDate) - new Date(b.hearingDate))
            );
            setShowHearingModal(false);
        } catch (err) {
            console.error("Failed to save new hearing:", err);
            alert("Error: Could not save the new hearing.");
        }
    };

    const handleOpenEditModal = (hearing) => {
        setSelectedHearing(hearing);
        setShowEditHearingModal(true);
    };

    const handleUpdateHearing = async (hearingId, formData) => {
        try {
            const updatedHearing = await updateHearing(hearingId, formData);
            setHearings(prev => prev.map(h => (h.id === hearingId ? updatedHearing : h)));
            setShowEditHearingModal(false);
        } catch (err) {
            console.error("Failed to update hearing:", err);
            alert("Error: Could not update the hearing.");
        }
    };

    const handleDeleteHearing = async (hearingId) => {
        try {
            await deleteHearing(hearingId);
            setHearings(prev => prev.filter(h => h.id !== hearingId));
            setShowEditHearingModal(false);
        } catch (err) {
            console.error("Failed to delete hearing:", err);
            alert("Error: Could not delete the hearing.");
        }
    };

    const handleAssignJunior = async (juniorId) => {
        if (!juniorId) {
            Swal.fire({
                icon: 'warning',
                title: 'No Selection',
                text: 'Please select a junior lawyer to assign',
                confirmButtonColor: '#000000',
                background: '#ffffff',
                width: '500px',
                customClass: {
                    popup: 'rounded-lg'
                }
            });
            return;
        }

        setIsLoadingJuniors(true);
        try {
            const selectedJunior = availableJuniors.find(junior => junior.id === juniorId);
            if (!selectedJunior) {
                throw new Error('Selected junior lawyer not found');
            }

            await addCaseMember(caseId, {
                userId: juniorId,
                role: 'JUNIOR_LAWYER'
            });

            setCaseData(prev => ({
                ...prev,
                junior: selectedJunior.name
            }));
            
            setShowJuniorModal(false);
            
            Swal.fire({
                icon: 'success',
                title: 'Junior Assigned!',
                text: `${selectedJunior.name} has been successfully assigned to this case`,
                confirmButtonColor: '#000000',
                background: '#ffffff',
                width: '500px',
                customClass: {
                    popup: 'rounded-lg'
                }
            });
        } catch (err) {
            console.error("Failed to assign junior lawyer:", err);
            
            Swal.fire({
                icon: 'error',
                title: 'Assignment Failed',
                text: 'Failed to assign junior lawyer. Please try again.',
                confirmButtonColor: '#000000',
                background: '#ffffff',
                width: '500px',
                customClass: {
                    popup: 'rounded-lg'
                }
            });
        } finally {
            setIsLoadingJuniors(false);
        }
    };

    const handleSendMessage = () => {
        if (chatMessage.trim()) {
            const newMessage = {
                id: chatMessages.length + 1,
                sender: user.name,
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
                isClient: false
            };
            setChatMessages(prev => [...prev, newMessage]);
            setChatMessage('');
        }
    };

    const handleSaveAdditionalDetails = async (newAdditionalDetails) => {
        try {
            clearError();
            const updatedCase = await updateAdditionalDetails(newAdditionalDetails);
            setCaseData(updatedCase);
            
            Swal.fire({
                icon: 'success',
                title: 'Details Updated',
                text: 'The case details have been successfully updated.',
                confirmButtonColor: '#10B981',
                background: '#ffffff',
                width: '500px',
                customClass: {
                    popup: 'rounded-lg'
                }
            });
            
        } catch (err) {
            console.error("Failed to update additional details:", err);
            
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: err.message || 'Failed to update case details. Please try again.',
                confirmButtonColor: '#EF4444',
                background: '#ffffff',
                width: '500px',
                customClass: {
                    popup: 'rounded-lg'
                }
            });
        }
    };

    // Handle print functionality using PrintService
    const handlePrint = (tabToPrint = 'all') => {
        PrintService.printCaseDetails(caseData, hearings, timelineEvents, tabToPrint);
    };

    // --- DYNAMIC TIMELINE GENERATION ---
    const timelineEvents = hearings
        .sort((a, b) => new Date(a.hearingDate) - new Date(b.hearingDate))
        .map(hearing => ({
            date: new Date(hearing.hearingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            label: hearing.title || "Key Date"
        }));

    // --- RENDER LOGIC ---
    if (isLoading) return <PageLayout user={user}><div>Loading...</div></PageLayout>;
    if (error) return <PageLayout user={user}><div className="text-red-500 p-8">{error}</div></PageLayout>;
    if (!caseData) return <PageLayout user={user}><div>Case not found.</div></PageLayout>;

    return (
        <PageLayout user={user}>
            {/* Chat Button - Fixed position */}
            <div className="fixed bottom-6 right-6 z-40">
                {/* <button
                    onClick={() => setShowChatModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-colors duration-200"
                    title="Team Chat"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-4.126-.98L3 20l1.02-5.874A8.955 8.955 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                    </svg>
                </button> */}
            </div>

            <div className="flex items-center justify-between mb-6">
                <Button1 
                    text="← Back" 
                    onClick={() => navigate('/lawyer/caseprofile')} 
                    variant="secondary"
                />

                <div className="flex gap-3">
                    <Button1
                        text="🖨️ Print Case Details"
                        onClick={() => handlePrint('all')}
                        inverted={false}
                    />
                    
                    {currentUser && currentUser.role === 'LAWYER' && (
                        <Button1
                            text="Edit Case →"
                            onClick={() => navigate(`/lawyer/case/${caseId}/edit`)}
                        />
                    )}
                </div>
            </div>

            <h1 className="text-2xl font-bold mb-6">Case No : {caseData.caseNumber}</h1>

            {/* Tab Navigation */}
            <div className="bg-white rounded-t-lg shadow-sm border border-gray-200 mb-0">
                <div className="flex justify-between items-center border-b border-gray-200">
                    <div className="flex">
                        <button
                            onClick={() => setActiveTab('general')}
                            className={`px-6 py-3 text-sm font-medium transition-colors ${
                                activeTab === 'general'
                                    ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            General Details
                        </button>
                        
                        {caseDetailsService.isDivorceCase(caseData.caseType) && (
                            <button
                                onClick={() => setActiveTab('divorce')}
                                className={`px-6 py-3 text-sm font-medium transition-colors ${
                                    activeTab === 'divorce'
                                        ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                Divorce Details
                            </button>
                        )}
                    </div>
                    
                    <div className="px-4 py-2">
                        <button
                            onClick={() => handlePrint(activeTab)}
                            className="text-gray-600 hover:text-gray-800 text-sm flex items-center gap-1 transition-colors"
                            title={`Print ${activeTab === 'general' ? 'General' : 'Divorce'} Details`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                            Print Tab
                        </button>
                    </div>
                </div>
            </div>

            {/* Divorce Details Tab Content */}
            {activeTab === 'divorce' && caseDetailsService.isDivorceCase(caseData.caseType) && (
                <div className="bg-white rounded-b-lg shadow-sm border-x border-b border-gray-200 p-6 mb-6">
                    <DivorceDetails 
                        caseData={caseData} 
                        onSave={handleSaveAdditionalDetails}
                        isEditable={user.role === 'lawyer' || user.role === 'junior'}
                    />
                    {updateError && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-red-600 text-sm">{updateError}</p>
                        </div>
                    )}
                    {isUpdatingDetails && (
                        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                            <p className="text-blue-600 text-sm">Saving changes...</p>
                        </div>
                    )}
                </div>
            )}

            {/* General Tab Content */}
            {activeTab === 'general' && (
                <>
                    {/* Case Overview */}
                    <section className="bg-white rounded-b-lg p-8 mb-6 shadow-md border-x border-b border-gray-200">
                        <h2 className="text-xl font-semibold mb-6">Case Overview</h2>
                        <div className="flex flex-col md:flex-row">
                            <div className="flex-1">
                                <div className="font-semibold">Case Name:</div>
                                <p className="mb-2">{caseData.caseTitle}</p>
                                <div className="font-semibold">Description:</div>
                                <p className="mb-2">{caseData.description || 'N/A'}</p>
                                <div className="font-semibold">Court Type:</div>
                                <p>{caseData.courtType || 'N/A'}</p>
                            </div>
                            <div className="flex-1 md:ml-12 mt-8 md:mt-0">
                                <div className="font-semibold">Case Type:</div>
                                <p className="mb-2">{caseData.caseType || 'N/A'}</p>
                                <div className="font-semibold">Court Name:</div>
                                <p className="mb-2">{caseData.courtName || 'N/A'}</p>
                                <div className="font-semibold">Status:</div>
                                <div><span className="inline-block px-4 py-1 rounded-full bg-green-100 text-green-700 font-semibold text-sm">{caseData.status}</span></div>
                            </div>
                        </div>
                    </section>

                    {/* Parties Involved */}
                    <section className="bg-white rounded-lg p-8 mb-6 shadow-md">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold">Parties Involved</h2>
                            <div className="flex gap-2">
                                <Button1 
                                    text="Add / Invite Client" 
                                    className="text-sm py-1 px-4" 
                                    onClick={() => setShowClientModal(true)} 
                                />
                                <Button1 
                                    text="Associate Junior" 
                                    className="text-sm py-1 px-4" 
                                    onClick={() => setShowJuniorModal(true)} 
                                />
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row">
                            <div className="flex-1 mb-6 md:mb-0">
                                <div className="font-semibold">Client:</div>
                                <p className="mb-2">{caseData.clientName || 'Not yet assigned'}</p>
                                <div className="font-semibold ">Client Phone:</div>
                                <p className='mb-2'>{caseData.clientPhone || 'N/A'}</p>
                                <div className="font-semibold ">Client Email:</div>
                                <p>{caseData.clientEmail || 'N/A'}</p>
                            </div>
                            <div className="flex-1 md:ml-12">
                                <div className="font-semibold">Opposing Party:</div>
                                <p className="mb-2">{caseData.opposingPartyName || 'N/A'}</p>
                                <div className="font-semibold">Junior Associated:</div>
                                <p>{caseData.junior || 'Not Assigned'}</p>
                            </div>
                        </div>
                    </section>
                    
                    {/* Financials */}
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
                                    <span className="inline-block px-4 py-1 rounded-full bg-green-100 text-green-700 font-semibold text-sm">
                                        {caseData.paymentStatus ? caseData.paymentStatus.replace('_', ' ') : 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Hearings & Key Dates */}
                    <section className="bg-white rounded-lg p-8 mb-6 shadow-md">
                        <h2 className="text-xl font-semibold mb-6">Hearings & Key Dates</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                            {hearings.map(hearing => (
                                <div 
                                    key={hearing.id} 
                                    className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors" 
                                    onClick={() => handleOpenEditModal(hearing)}
                                >
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
                        <div className="flex justify-center mt-6 pt-4 border-t">
                            <Button1 text="Add New Hearing Date" className="mt-2" onClick={() => setShowHearingModal(true)} />
                        </div>
                    </section>

                    {/* Case Progress Timeline */}
                    <section className="bg-white rounded-lg p-8 mb-6 shadow-sm">
                        <h2 className="text-xl font-semibold mb-6 text-center">Case Progress Timeline</h2>
                        <div className="flex items-center justify-between">
                            {timelineEvents.map((t, idx) => (
                                <React.Fragment key={idx}>
                                    <div className="flex flex-col items-center text-center">
                                        <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">{idx + 1}</div>
                                        <div className="text-xs mt-2 text-gray-700">{t.date}<br />{t.label}</div>
                                    </div>
                                    {idx < timelineEvents.length - 1 && <div className="flex-1 h-1 bg-orange-200 mx-2" />}
                                </React.Fragment>
                            ))}
                        </div>
                    </section>

                    {/* Documents */}
                    {/* <section className="bg-white rounded-lg p-8 mb-6 shadow-sm">
                        <h2 className="text-xl font-semibold mb-6">Documents</h2>
                        <ul className="list-disc pl-6 mb-4 text-blue-700">
                            {staticDocuments.map((doc, idx) => (
                                <li key={idx}><a href={doc.url} className="hover:underline">{doc.name}</a></li>
                            ))}
                        </ul>
                        <Button1 text="Add Documents" className="mt-2" />
                    </section> */}
                </>
            )}

            {/* Modals */}
            {showClientModal && (
                <AddClientModal
                    isOpen={showClientModal}
                    onClose={() => setShowClientModal(false)}
                    caseId={caseId}
                    existingClient={{
                        clientName: caseData.clientName,
                        clientEmail: caseData.clientEmail,
                        clientPhone: caseData.clientPhone
                    }}
                />
            )}

            {showHearingModal && (
                <AddNextHearingModal 
                    isOpen={showHearingModal}
                    onClose={() => setShowHearingModal(false)}
                    caseNumber={caseData.caseNumber}
                    courtName={caseData.courtName}
                    onSave={handleAddHearing}
                />
            )}

            {showEditHearingModal && (
                <EditHearingModal
                    isOpen={showEditHearingModal}
                    onClose={() => setShowEditHearingModal(false)}
                    hearing={selectedHearing}
                    onSave={handleUpdateHearing}
                    onDelete={handleDeleteHearing}
                />
            )}

            {showJuniorModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg mx-4">
                        <h2 className="text-xl font-bold mb-4">Associate Junior Lawyer</h2>
                        <p className="text-sm text-gray-600 mb-4">Select a junior lawyer to associate with this case:</p>
                        
                        <div className="space-y-3 max-h-96 overflow-y-auto mb-6">
                            {isLoadingJuniors ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="text-gray-500">Assigning junior lawyer...</div>
                                </div>
                            ) : availableJuniors.length > 0 ? (
                                availableJuniors.map((junior) => (
                                    <div 
                                        key={junior.id}
                                        className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                                        onClick={() => !isLoadingJuniors && handleAssignJunior(junior.id)}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900">{junior.name}</h4>
                                                <p className="text-sm text-gray-600">{junior.email}</p>
                                                <div className="mt-2 flex items-center space-x-4">
                                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                        {junior.specialization}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {junior.experience}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500">No junior lawyers available</div>
                            )}
                        </div>
                        
                        <div className="flex justify-end space-x-3">
                            <Button2
                                text="Cancel"
                                onClick={() => !isLoadingJuniors && setShowJuniorModal(false)}
                                disabled={isLoadingJuniors}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* {showChatModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-end z-50" onClick={() => setShowChatModal(false)}>
                    <div className="bg-white rounded-lg shadow-lg w-96 mx-4 mt-4 h-[calc(100vh-2rem)] flex flex-col" onClick={(e) => e.stopPropagation()}>
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

                        <div className="flex-1 overflow-y-auto p-3 bg-gray-50">
                            <div className="space-y-3">
                                {chatMessages.map((msg) => (
                                    <div key={msg.id} className={`flex ${msg.isSystem ? 'justify-center' : msg.isClient ? 'justify-start' : 'justify-end'}`}>
                                        <div className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                                            msg.isSystem 
                                                ? 'bg-yellow-100 text-yellow-800 text-center text-xs px-2 py-1'
                                                : msg.isClient
                                                    ? 'bg-white text-gray-800 rounded-bl-none border' 
                                                    : 'bg-gray-400 bg-opacity-60 text-gray-800 rounded-br-none'
                                        }`}>
                                            {!msg.isSystem && (
                                                <div className="text-xs font-medium mb-1 opacity-70">
                                                    {msg.isClient ? 'Client' : msg.sender}
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
            )} */}
        </PageLayout>
    );
};

export default CaseDetails;
