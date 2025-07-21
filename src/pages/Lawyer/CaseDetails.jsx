import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout';
import Button1 from '../../components/UI/Button1';
import Button2 from '../../components/UI/Button2';
import AddNextHearingModal from './AddNextHearingDate'; // Your modal component import
import { useAuth } from '../../context/AuthContext';
import { getCaseById, getHearingsForCase, createHearing } from '../../services/caseService';
import AddClientModal from './AddNewClientModel';
import EditHearingModal from './EditHearingModal'; // Import the new modal
import { updateHearing, deleteHearing } from '../../services/caseService'; // Import the new functions
// Placeholder user object. This should come from an Auth Context in a real app.


// Static data for the documents section, as you requested.
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
    const [selectedHearing, setSelectedHearing] = useState(null);
    
    const [caseData, setCaseData] = useState(null); 
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const { currentUser, loading: authLoading } = useAuth();

    const user = {
        name: currentUser.fullName,
        email: currentUser.email,
        role:  currentUser.role.toLowerCase()
    };

    // const user = {
    //     name: "nishagi jewantha",
    //     email: "jewanthadheerath@gmail.com",
    //     role:  "lawyer"
    // }

    // console.log("Current User:", currentUser);
    // console.log("User Role:", currentUser.role);

    // This state is for managing the modal's visibility
    const [showHearingModal, setShowHearingModal] = useState(false);
    
    // This state will now manage the list of hearings, populated from the API
    const [hearings, setHearings] = useState([]);

    // Sample junior lawyers data - in a real app, this would come from an API
    const [availableJuniors] = useState([
        {
            id: 1,
            name: "Jane Smith",
            email: "jane.smith@example.com",
            specialization: "Corporate Law",
            experience: "2 years"
        },
        {
            id: 2,
            name: "Michael Johnson", 
            email: "michael.johnson@example.com",
            specialization: "Criminal Law",
            experience: "3 years"
        },
        {
            id: 3,
            name: "Sarah Williams",
            email: "sarah.williams@example.com", 
            specialization: "Family Law",
            experience: "1.5 years"
        },
        {
            id: 4,
            name: "Robert Chen",
            email: "robert.chen@example.com",
            specialization: "Estate Planning",
            experience: "4 years"
        }
    ]);

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
                // Use Promise.all to fetch both case data and hearings in parallel for efficiency.
                const [caseDetailsData, hearingsData] = await Promise.all([
                    getCaseById(caseId),
                    getHearingsForCase(caseId)
                ]);
                
                setCaseData(caseDetailsData);
                console.log("Case Details:", caseDetailsData);
                setHearings(hearingsData || caseDetailsData.hearings || []); // Use hearings from API or fallback to case data hearings
            } catch (err) {
                setError("Failed to fetch case details. You may not have permission to view this case.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllDetails();
    }, [caseId]);

    // --- MODAL AND HEARING LOGIC (LOCAL STATE ONLY) ---
    const handleAddHearing = async (newHearingData) => {
        // This function now calls the new createHearing service function.
        try {
            const savedHearing = await createHearing(caseId, newHearingData);
            
            // Add the newly saved hearing (returned from the backend) to our local state
            // for an immediate UI update, then re-sort the list.
            setHearings(prevHearings => 
                [...prevHearings, savedHearing].sort((a, b) => new Date(a.hearingDate) - new Date(b.hearingDate))
            );
            
            setShowHearingModal(false); // Close the modal on success
        } catch (err) {
            console.error("Failed to save new hearing:", err);
            // You can show an error message to the user here inside the modal
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
            // Update the hearing in our local state for an immediate UI refresh
            setHearings(prev => prev.map(h => (h.id === hearingId ? updatedHearing : h)));
            setShowEditHearingModal(false); // Close modal on success
        } catch (err) {
            console.error("Failed to update hearing:", err);
            alert("Error: Could not update the hearing.");
        }
    };

    const handleDeleteHearing = async (hearingId) => {
        try {
            await deleteHearing(hearingId);
            // Remove the hearing from our local state for an immediate UI refresh
            setHearings(prev => prev.filter(h => h.id !== hearingId));
            setShowEditHearingModal(false); // Close modal on success
        } catch (err) {
            console.error("Failed to delete hearing:", err);
            alert("Error: Could not delete the hearing.");
        }
    };

    // Handle junior lawyer assignment
    const handleAssignJunior = async (juniorId) => {
        try {
            // In a real app, you would call an API to assign the junior to the case
            // await assignJuniorToCase(caseId, juniorId);
            
            // For now, we'll just update the local state
            const selectedJunior = availableJuniors.find(junior => junior.id === juniorId);
            if (selectedJunior) {
                setCaseData(prev => ({
                    ...prev,
                    junior: selectedJunior.name
                }));
                setShowJuniorModal(false);
                alert(`Successfully assigned ${selectedJunior.name} to this case.`);
            }
        } catch (err) {
            console.error("Failed to assign junior lawyer:", err);
            alert("Error: Could not assign junior lawyer to case.");
        }
    };

    // --- DYNAMIC TIMELINE GENERATION ---
    // This now uses the 'hearings' state variable
    const timelineEvents = hearings
        .sort((a, b) => new Date(a.hearingDate) - new Date(b.hearingDate))
        .map(hearing => ({
            date: new Date(hearing.hearingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            // Use the hearing's title for the timeline label
            label: hearing.title || "Key Date"
        }));

    // --- RENDER LOGIC ---
    if (isLoading) return <PageLayout user={user}><div>Loading...</div></PageLayout>;
    if (error) return <PageLayout user={user}><div className="text-red-500 p-8">{error}</div></PageLayout>;
    if (!caseData) return <PageLayout user={user}><div>Case not found.</div></PageLayout>;

    return (
        <PageLayout user={user}>
            <div className="flex items-center justify-between mb-6">
                {/* Left side: The "Back" button */}
                <Button1 
                    text="← Back" 
                    onClick={() => navigate('/lawyer/caseprofile')} 
                    // Let's assume Button2 is for secondary actions.
                    variant="secondary" // Assuming your Button component has variants
                />

                {/* Right side: The "Edit Case" button, conditionally rendered */}
                {currentUser && currentUser.role === 'LAWYER' && (
                    <Button1
                        text="Edit Case →" // Added the arrow as requested
                        // className="text-sm py-2 px-4" // Adjusted padding for a better feel
                        onClick={() => navigate(`/lawyer/case/${caseId}/edit`)}
                    />
                )}
            </div>
            <h1 className="text-2xl font-bold mb-6">Case No : {caseData.caseNumber}</h1>

            {/* Case Overview */}
            <section className="bg-white rounded-lg p-8 mb-6 shadow-md">
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
            
            {/* Financials - Note: DTO doesn't have totalExpenses or invoice, so they are removed */}
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
                    {/* We map over the sorted hearings array */}
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
            <section className="bg-white rounded-lg p-8 mb-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-6">Documents</h2>
                <ul className="list-disc pl-6 mb-4 text-blue-700">
                    {staticDocuments.map((doc, idx) => (
                        <li key={idx}><a href={doc.url} className="hover:underline">{doc.name}</a></li>
                    ))}
                </ul>
                <Button1 text="Add Documents" className="mt-2" />
            </section>

            {showClientModal && (
                <AddClientModal
                    isOpen={showClientModal}
                    onClose={() => setShowClientModal(false)}
                    caseId={caseId}
                    // Pass the existing client data from caseData to the modal
                    existingClient={{
                        clientName: caseData.clientName,
                        clientEmail: caseData.clientEmail,
                        clientPhone: caseData.clientPhone
                    }}
                />
            )}

            {/* Add Next Hearing Modal */}
            {showHearingModal && (
                <AddNextHearingModal 
                    isOpen={showHearingModal}
                    onClose={() => setShowHearingModal(false)}
                    caseNumber={caseData.caseNumber}
                    courtName={caseData.courtName} // Pass court name as default location
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

            {/* Junior Lawyer Selection Modal */}
            {showJuniorModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg mx-4">
                        <h2 className="text-xl font-bold mb-4">
                            Associate Junior Lawyer
                        </h2>
                        
                        <p className="text-sm text-gray-600 mb-4">
                            Select a junior lawyer to associate with this case:
                        </p>
                        
                        <div className="space-y-3 max-h-96 overflow-y-auto mb-6">
                            {availableJuniors.map((junior) => (
                                <div 
                                    key={junior.id}
                                    className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                                    onClick={() => handleAssignJunior(junior.id)}
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
                                                    {junior.experience} experience
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
                            ))}
                        </div>
                        
                        <div className="flex justify-end space-x-3">
                            <Button2
                                text="Cancel"
                                onClick={() => setShowJuniorModal(false)}
                            />
                        </div>
                    </div>
                </div>
            )}
        </PageLayout>
    );
};

export default CaseDetails;