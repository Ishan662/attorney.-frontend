/**
 * DivorceDetails Component
 * Displays and allows editing of specialized divorce case information including grounds, 
 * marriage details, children involved, and document checklist
 */

import React, { useState, useEffect } from 'react';
import caseDetailsService from '../../services/caseDetailsService';
import Button1 from '../UI/Button1';

const DivorceDetails = ({ caseData, onSave, isEditable = true }) => {
    // Initialize local state with the additional details
    const [localDivorceData, setLocalDivorceData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    // Initialize state when caseData changes
    useEffect(() => {
        if (caseData?.additionalDetails) {
            const transformedData = caseDetailsService.transformDivorceDataFromAPI(caseData.additionalDetails);
            setLocalDivorceData(transformedData);
        }
    }, [caseData]);

    // Transform the additional details for display
    const divorceData = localDivorceData;
    
    // Handle document status changes
    const handleDocumentStatusChange = (documentName, newStatus) => {
        if (!isEditing) return;
        
        setLocalDivorceData(prev => ({
            ...prev,
            documentChecklist: {
                ...prev.documentChecklist,
                [documentName]: newStatus
            }
        }));
        setHasChanges(true);
    };

    // Handle marriage date change
    const handleMarriageDateChange = (newDate) => {
        if (!isEditing) return;
        
        setLocalDivorceData(prev => ({
            ...prev,
            marriageDate: newDate
        }));
        setHasChanges(true);
    };

    // Handle grounds change
    const handleGroundsChange = (newGrounds) => {
        if (!isEditing) return;
        
        setLocalDivorceData(prev => ({
            ...prev,
            grounds: newGrounds,
            groundsLabel: caseDetailsService.DIVORCE_GROUNDS[newGrounds] || newGrounds
        }));
        setHasChanges(true);
    };

    // Handle co-respondent name change
    const handleCoRespondentChange = (newName) => {
        if (!isEditing) return;
        
        setLocalDivorceData(prev => ({
            ...prev,
            coRespondentName: newName
        }));
        setHasChanges(true);
    };

    // Save changes
    const handleSave = async () => {
        if (!hasChanges || !onSave) return;
        
        setIsSaving(true);
        try {
            // Transform back to API format before saving
            const apiData = caseDetailsService.transformDivorceDataForAPI(localDivorceData);
            await onSave(apiData);
            setIsEditing(false);
            setHasChanges(false);
        } catch (error) {
            console.error('Failed to save divorce details:', error);
            // You might want to show an error message to the user here
        } finally {
            setIsSaving(false);
        }
    };

    // Cancel editing
    const handleCancel = () => {
        // Reset to original data
        if (caseData?.additionalDetails) {
            const transformedData = caseDetailsService.transformDivorceDataFromAPI(caseData.additionalDetails);
            setLocalDivorceData(transformedData);
        }
        setIsEditing(false);
        setHasChanges(false);
    };

    // Document status options - only Pending and Submitted
    const documentStatusOptions = [
        { value: 'PENDING', label: 'Pending' },
        { value: 'SUBMITTED', label: 'Submitted' }
    ];

    // Grounds options
    const groundsOptions = Object.entries(caseDetailsService.DIVORCE_GROUNDS || {}).map(([key, label]) => ({
        value: key,
        label: label
    }));
    
    if (!divorceData) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="text-center text-gray-500">
                    <p>No divorce-specific details available for this case.</p>
                </div>
            </div>
        );
    }
    
    const documentSummary = caseDetailsService.getDocumentStatusSummary(divorceData.documentChecklist);
    
    return (
        <div className="space-y-6">
            {/* Case Information Section */}
            <section className="bg-white rounded-lg p-8 mb-6 shadow-md border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Divorce Case Details</h2>
                    {isEditable && (
                        <div className="flex items-center space-x-2">
                            {hasChanges && (
                                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                                    Unsaved Changes
                                </span>
                            )}
                            {!isEditing ? (
                                <Button1
                                    text="Edit Details →"
                                    onClick={() => setIsEditing(true)}
                                />
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <Button1
                                        text="Cancel"
                                        onClick={handleCancel}
                                        inverted={false}
                                        disabled={isSaving}
                                        className="disabled:opacity-50"
                                    />
                                    <Button1
                                        text={isSaving ? 'Saving...' : 'Save Changes'}
                                        onClick={handleSave}
                                        disabled={!hasChanges || isSaving}
                                        className="disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Grounds for Divorce */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Grounds for Divorce
                        </label>
                        {isEditing ? (
                            <select
                                value={divorceData.grounds || ''}
                                onChange={(e) => handleGroundsChange(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Select grounds...</option>
                                {groundsOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <div className="p-3 bg-gray-50 rounded-md border">
                                <span className="text-sm font-medium text-gray-900">
                                    {divorceData.groundsLabel}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Marriage Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Marriage Date
                        </label>
                        {isEditing ? (
                            <input
                                type="date"
                                value={divorceData.marriageDate || ''}
                                onChange={(e) => handleMarriageDateChange(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        ) : (
                            <div className="p-3 bg-gray-50 rounded-md border">
                                <span className="text-sm text-gray-900">
                                    {caseDetailsService.formatDateForDisplay(divorceData.marriageDate)}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Co-Respondent (if applicable) */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Co-Respondent Name (Optional)
                        </label>
                        {isEditing ? (
                            <input
                                type="text"
                                value={divorceData.coRespondentName || ''}
                                onChange={(e) => handleCoRespondentChange(e.target.value)}
                                placeholder="Enter co-respondent name if applicable"
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        ) : divorceData.coRespondentName ? (
                            <div className="p-3 bg-gray-50 rounded-md border">
                                <span className="text-sm text-gray-900">
                                    {divorceData.coRespondentName}
                                </span>
                            </div>
                        ) : (
                            <div className="p-3 bg-gray-50 rounded-md border">
                                <span className="text-sm text-gray-500 italic">
                                    No co-respondent specified
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </section>            {/* Children Involved Section */}
            <section className="bg-white rounded-lg p-8 mb-6 shadow-md border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Children Involved
                    <span className="ml-2 bg-gray-100 text-gray-700 text-sm px-2 py-1 rounded-full">
                        {divorceData.children.length} {divorceData.children.length === 1 ? 'child' : 'children'}
                    </span>
                </h2>
                
                {divorceData.children.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <p>No children involved in this case</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {divorceData.children.map((child, index) => {
                            const age = caseDetailsService.calculateAge(child.dateOfBirth);
                            return (
                                <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900 mb-2">
                                                {child.fullName}
                                            </h4>
                                            <div className="text-sm text-gray-600 space-y-1">
                                                <p>
                                                    <span className="font-medium">Date of Birth:</span> {' '}
                                                    {caseDetailsService.formatDateForDisplay(child.dateOfBirth)}
                                                </p>
                                                {age !== null && (
                                                    <p>
                                                        <span className="font-medium">Age:</span> {' '}
                                                        {age} years old
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                                Child {index + 1}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>
            
            {/* Document Checklist Section */}
            <section className="bg-white rounded-lg p-8 mb-6 shadow-md border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Document Checklist</h2>
                
                {/* Document List */}
                <div className="space-y-3">
                    {Object.entries(divorceData.documentChecklist).map(([documentName, status]) => {
                        const statusClass = caseDetailsService.getDocumentStatusClass(status);
                        const statusLabel = caseDetailsService.DOCUMENT_STATUS[status] || status;
                        
                        return (
                            <div key={documentName} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="flex items-center space-x-3">
                                    <div className="flex-shrink-0">
                                        {status === 'SUBMITTED' ? (
                                            <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </div>
                                    <span className="font-medium text-gray-900">{documentName}</span>
                                </div>
                                {isEditing ? (
                                    <select
                                        value={status}
                                        onChange={(e) => handleDocumentStatusChange(documentName, e.target.value)}
                                        className="ml-4 text-xs px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        {documentStatusOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusClass}`}>
                                        {statusLabel}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
                
                {/* Note */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                        <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <div>
                            <p className="text-sm font-medium text-blue-800">Document Checklist Reference</p>
                            <p className="text-sm text-blue-700 mt-1">
                                This checklist shows typical documents required for divorce proceedings. 
                                Use this as a reference when requesting documents from your client.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default DivorceDetails;
