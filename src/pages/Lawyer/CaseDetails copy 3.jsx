import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import PageLayout from '../../components/layout/PageLayout';

import Button1 from '../../components/UI/Button1';
import Button2 from '../../components/UI/Button2';
import { getCaseById } from '../../services/caseService'; // Your service function

// Placeholder user object. This should come from an Auth Context in a real app.
const user = { name: 'Nishagi Jewantha', role: 'lawyer' };

// Static data for the documents section, as requested.
const staticDocuments = [    
    { name: 'Will of Eleanor Vance.pdf', url: '#' },
    { name: 'Estate Valuation Report.pdf', url: '#' },
    { name: 'Client Correspondence Log.pdf', url: '#' },
    ];

const CaseDetails = () => {
    const { caseId } = useParams();
    const navigate = useNavigate();

    const [caseData, setCaseData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

        useEffect(() => {
        if (!caseId) {
            setError("Case ID not found.");
            setIsLoading(false);
            return;
        }
                const fetchCaseDetails = async () => {
            try {
                const data = await getCaseById(caseId);
                setCaseData(data);
            } catch (err) {
                setError("Failed to fetch case details. You may not have permission to view this case.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
                fetchCaseDetails();
    }, [caseId]);

    if (isLoading) {
        return <PageLayout user={user}><div>Loading case details...</div></PageLayout>;
    }
    if (error) {
        return <PageLayout user={user}><div className="text-red-500 p-8">{error}</div></PageLayout>;
    }
    if (!caseData) {
        return <PageLayout user={user}><div>Case not found.</div></PageLayout>;
    }
        // --- ▼▼▼ DYNAMIC TIMELINE GENERATION ▼▼▼ ---
    // We create the timeline data dynamically from the fetched hearings data.
    const timelineEvents = caseData.hearings
        ? caseData.hearings
            .sort((a, b) => new Date(a.hearingDate) - new Date(b.hearingDate)) // Ensure they are in chronological order
            .map(hearing => ({
                date: new Date(hearing.hearingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                label: hearing.title || "Key Date"
            }))
        : [];
    // --- ▲▲▲ DYNAMIC TIMELINE GENERATION ▲▲▲ ---

    return (
        <PageLayout user={user}>
            <div className="mb-2">
                <Button1 text="← Back to Cases" onClick={() => navigate('/lawyer/caseprofile')} className="mb-4" />

                    </div>
                               <h1 className="text-2xl font-bold mb-6">Case No = {caseData.caseNumber}</h1>

            {/* Case Overview Section (Now Dynamic) */}
            <section className="bg-white rounded-lg p-8 mb-6 shadow-md">
                <h2 className="text-xl font-semibold mb-6">Case Overview</h2>
                <div className="flex flex-col md:flex-row">
                    <div className="flex-1">
                        <div className="font-semibold">Case Name:</div>
                        <p className="mb-4">{caseData.caseTitle}</p>
                        <div className="font-semibold">Description:</div>
                        <p>{caseData.description || 'No description provided.'}</p>
                    </div>
                    <div className="flex-1 md:ml-12 mt-8 md:mt-0">
                        <div className="font-semibold">Case Type:</div>
                        <p className="mb-4">{caseData.caseType || 'N/A'}</p>
                        <div className="font-semibold">Status:</div>
                        <div>
                            <span className="inline-block px-4 py-1 rounded-full bg-green-100 text-green-700 font-semibold text-sm">
                                {caseData.status}
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Parties Involved Section (Now Dynamic) */}
            <section className="bg-white rounded-lg p-8 mb-6 shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Parties Involved</h2>
                    <Button1 text="Add Client" className="text-sm py-1 px-4" onClick={() => navigate(`/case/${caseId}/add-client`)} />
                </div>
                <div className="flex flex-col md:flex-row">
                    <div className="flex-1 mb-6 md:mb-0">
                        <div className="font-semibold">Client:</div>
                        <p className="mb-2">{caseData.clientName}</p>
                        <div className="font-semibold">Client Phone:</div>
                        <p>{caseData.clientPhone}</p>
                    </div>
                    <div className="flex-1 md:ml-12">
                        <div className="font-semibold">Opposing Party:</div>
                        <p className="mb-2">{caseData.opposingPartyName || 'N/A'}</p>
                        <div className="font-semibold">Junior Associated:</div>
                        <p>{caseData.junior || 'Not Assigned'}</p>
                    </div>
                </div>
                </section>

                            {/* Financials Section (Now Dynamic) */}
            <section className="bg-white rounded-lg p-8 mb-6 shadow-md">
                <h2 className="text-xl font-semibold mb-6">Financials</h2>
                <div className="flex flex-col md:flex-row">
                    <div className="flex-1 mb-6 md:mb-0">
                        <div className="font-semibold">Agreed Fee:</div>
                        <p className="mb-2">${caseData.agreedFee ? caseData.agreedFee.toFixed(2) : '0.00'}</p>
                    </div>
                    <div className="flex-1 md:ml-12">
                        <div className="font-semibold">Payment Status:</div>
                        <div className="mb-2">
                             <span className="inline-block px-4 py-1 rounded-full font-semibold text-sm bg-green-100 text-green-700">
                                 {caseData.paymentStatus ? caseData.paymentStatus.replace('_', ' ') : 'N/A'}
                             </span>
                        </div>
                    </div>
                </div>
            </section>

                        {/* Hearings Section (Now Dynamic) */}
            <section className="bg-white rounded-lg p-8 mb-6 shadow-md">
                <h2 className="text-xl font-semibold mb-6">Hearings & Key Dates</h2>
                {caseData.hearings && caseData.hearings.length > 0 ? (
                    // This two-column layout is preserved
                    <div className="flex flex-col md:flex-row md:justify-between">
                        <div className="flex-1 mb-6 md:mb-0 md:pr-4">
                            {caseData.hearings.slice(0, Math.ceil(caseData.hearings.length / 2)).map(h => (
                                <div key={h.id} className="mb-4">
                                    <div className="font-semibold">{h.title || 'Key Date'}:</div>
                                    <div className="mb-1">{new Date(h.hearingDate).toLocaleDateString()}</div>
                                    {h.location && <><div className="font-semibold">Location:</div><div className="mb-1">{h.location}</div></>}
                                    {h.status && <><div className="font-semibold">Status:</div><div className="mb-1"><span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${h.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{h.status}</span></div></>}
                                    {h.note && <><div className="font-semibold">Note:</div><div>{h.note}</div></>}
                                </div>
                            ))}
                        </div>
                        <div className="flex-1 md:ml-12">
                             {caseData.hearings.slice(Math.ceil(caseData.hearings.length / 2)).map(h => (
                                <div key={h.id} className="mb-4">
                                    <div className="font-semibold">{h.title || 'Key Date'}:</div>
                                    <div className="mb-1">{new Date(h.hearingDate).toLocaleDateString()}</div>
                                    {h.location && <><div className="font-semibold">Location:</div><div className="mb-1">{h.location}</div></>}
                                    {h.status && <><div className="font-semibold">Status:</div><div className="mb-1"><span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${h.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{h.status}</span></div></>}
                                    {h.note && <><div className="font-semibold">Note:</div><div>{h.note}</div></>}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-500">No hearings have been scheduled.</p>
                )}
                <div className="flex justify-center mt-4">
                    <Button1 text="Add Next Hearing Date" className="mt-2" />
                </div>
            </section>

            {/* Case Progress Timeline Section (NOW DYNAMIC) */}
            <section className="bg-white rounded-lg p-8 mb-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-6 text-center">Case Progress Timeline</h2>
                {timelineEvents.length > 0 ? (
                    <div className="flex items-center justify-between">
                        {timelineEvents.map((t, idx) => (
                            <React.Fragment key={idx}>
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">{idx + 1}</div>
                                    <div className="text-xs mt-2 text-gray-700">{t.date}<br />{t.label}</div>
                                </div>
                                {idx < timelineEvents.length - 1 && (
                                    <div className="flex-1 h-1 bg-orange-200 mx-2" />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500">No events to display on timeline.</p>
                )}
            </section>

            {/* Documents Section (Using Static Data As Requested) */}
            <section className="bg-white rounded-lg p-8 mb-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-6">Documents</h2>
                <ul className="list-disc pl-6 mb-4 text-blue-700">
                    {staticDocuments.map((doc, idx) => (
                        <li key={idx}>
                            <a href={doc.url} className="hover:underline" target="_blank" rel="noopener noreferrer">{doc.name}</a>
                        </li>
                    ))}
                </ul>
                <Button1 text="Add Documents" className="mt-2" />
            </section>
        </PageLayout>
    );
};