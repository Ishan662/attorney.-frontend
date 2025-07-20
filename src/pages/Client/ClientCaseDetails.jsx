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

        </PageLayout>
    );
};

export default ClientCaseDetails;