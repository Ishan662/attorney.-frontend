// >> In a new file: pages/EditCasePage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar'; // Reusing your layout components
import Button1 from '../../components/UI/Button1';
import { getCaseById, updateCase } from '../../services/caseService'; // Ensure updateCase exists
import { useAuth } from '../../context/AuthContext'; // Using auth context for user info
import PageLayout from '../../components/layout/PageLayout';
import Swal from 'sweetalert2';

// Your case type options, same as in the NewCaseProfile page
const caseTypeOptions = [
  { value: 'MR/DMR', label: 'MR/DMR - Money Recovery' },
  { value: 'DR/DDR', label: 'DR/DDR - Debt Recovery' },
  { value: 'L/DLM', label: 'L/DLM - Land' },
  { value: 'SPL/X', label: 'SPL/X - Special' },
  { value: 'P/DPA', label: 'P/DPA - Partition' },
  { value: 'D/DDV', label: 'D/DDV - Divorce' },
  { value: 'MS', label: 'MS - Money Summary (Summary Procedure on Liquid Claims)' },
  { value: 'ARB', label: 'ARB - Arbitration' },
  { value: 'IP', label: 'IP - Intellectual Property' },
  { value: 'CO', label: 'CO - Company' },
  { value: 'TAX', label: 'TAX - Tax' },
  { value: 'HP/DHP', label: 'HP/DHP - Hire Purchase' },
];

// Status options for the case
const statusOptions = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'CLOSED', label: 'Closed' },
    { value: 'ON_HOLD', label: 'On Hold' },
];

// Court type options based on Sri Lankan judicial system
const courtTypeOptions = [
  { value: 'Supreme Court', label: 'Supreme Court' },
  { value: 'Court of Appeal', label: 'Court of Appeal' },
  { value: 'High Court', label: 'High Court' },
  { value: 'District Court', label: 'District Court' },
  { value: 'Magistrates Court', label: 'Magistrates\' Court' },
  { value: 'Primary Court', label: 'Primary Court' },
  { value: 'Labor Tribunal', label: 'Labor Tribunal' },
  { value: 'Agrarian Tribunal', label: 'Agrarian Tribunal' },
  { value: 'Small Claims Court', label: 'Small Claims Court' },
];

// Court locations based on court type
const courtLocations = {
  'Supreme Court': [
    { value: 'Supreme Court of Sri Lanka', label: 'Supreme Court of Sri Lanka' }
  ],
  'Court of Appeal': [
    { value: 'Court of Appeal of Sri Lanka', label: 'Court of Appeal of Sri Lanka' }
  ],
  'High Court': [
    { value: 'High Court of Colombo', label: 'High Court of Colombo' },
    { value: 'High Court of Kandy', label: 'High Court of Kandy' },
    { value: 'High Court of Galle', label: 'High Court of Galle' },
    { value: 'High Court of Kurunegala', label: 'High Court of Kurunegala' },
    { value: 'High Court of Anuradhapura', label: 'High Court of Anuradhapura' },
    { value: 'High Court of Ratnapura', label: 'High Court of Ratnapura' },
    { value: 'High Court of Batticaloa', label: 'High Court of Batticaloa' },
    { value: 'High Court of Jaffna', label: 'High Court of Jaffna' },
    { value: 'High Court of Trincomalee', label: 'High Court of Trincomalee' },
    { value: 'Commercial High Court of Colombo', label: 'Commercial High Court of Colombo' }
  ],
  'District Court': [
    { value: 'District Court of Colombo', label: 'District Court of Colombo' },
    { value: 'District Court of Gampaha', label: 'District Court of Gampaha' },
    { value: 'District Court of Kalutara', label: 'District Court of Kalutara' },
    { value: 'District Court of Kandy', label: 'District Court of Kandy' },
    { value: 'District Court of Matale', label: 'District Court of Matale' },
    { value: 'District Court of Nuwara Eliya', label: 'District Court of Nuwara Eliya' },
    { value: 'District Court of Galle', label: 'District Court of Galle' },
    { value: 'District Court of Matara', label: 'District Court of Matara' },
    { value: 'District Court of Hambantota', label: 'District Court of Hambantota' },
    { value: 'District Court of Jaffna', label: 'District Court of Jaffna' },
    { value: 'District Court of Kilinochchi', label: 'District Court of Kilinochchi' },
    { value: 'District Court of Mannar', label: 'District Court of Mannar' },
    { value: 'District Court of Vavuniya', label: 'District Court of Vavuniya' },
    { value: 'District Court of Mullaitivu', label: 'District Court of Mullaitivu' },
    { value: 'District Court of Batticaloa', label: 'District Court of Batticaloa' },
    { value: 'District Court of Ampara', label: 'District Court of Ampara' },
    { value: 'District Court of Trincomalee', label: 'District Court of Trincomalee' },
    { value: 'District Court of Kurunegala', label: 'District Court of Kurunegala' },
    { value: 'District Court of Puttalam', label: 'District Court of Puttalam' },
    { value: 'District Court of Anuradhapura', label: 'District Court of Anuradhapura' },
    { value: 'District Court of Polonnaruwa', label: 'District Court of Polonnaruwa' },
    { value: 'District Court of Badulla', label: 'District Court of Badulla' },
    { value: 'District Court of Moneragala', label: 'District Court of Moneragala' },
    { value: 'District Court of Ratnapura', label: 'District Court of Ratnapura' },
    { value: 'District Court of Kegalle', label: 'District Court of Kegalle' }
  ],
  'Magistrates Court': [
    { value: 'Magistrate\'s Court of Colombo', label: 'Magistrate\'s Court of Colombo' },
    { value: 'Magistrate\'s Court of Kandy', label: 'Magistrate\'s Court of Kandy' },
    { value: 'Magistrate\'s Court of Galle', label: 'Magistrate\'s Court of Galle' },
    { value: 'Magistrate\'s Court of Gampaha', label: 'Magistrate\'s Court of Gampaha' },
    { value: 'Magistrate\'s Court of Kalutara', label: 'Magistrate\'s Court of Kalutara' },
    { value: 'Magistrate\'s Court of Matale', label: 'Magistrate\'s Court of Matale' },
    { value: 'Magistrate\'s Court of Nuwara Eliya', label: 'Magistrate\'s Court of Nuwara Eliya' },
    { value: 'Magistrate\'s Court of Matara', label: 'Magistrate\'s Court of Matara' },
    { value: 'Magistrate\'s Court of Hambantota', label: 'Magistrate\'s Court of Hambantota' },
    { value: 'Magistrate\'s Court of Jaffna', label: 'Magistrate\'s Court of Jaffna' },
    { value: 'Magistrate\'s Court of Kilinochchi', label: 'Magistrate\'s Court of Kilinochchi' },
    { value: 'Magistrate\'s Court of Mannar', label: 'Magistrate\'s Court of Mannar' },
    { value: 'Magistrate\'s Court of Vavuniya', label: 'Magistrate\'s Court of Vavuniya' },
    { value: 'Magistrate\'s Court of Mullaitivu', label: 'Magistrate\'s Court of Mullaitivu' },
    { value: 'Magistrate\'s Court of Batticaloa', label: 'Magistrate\'s Court of Batticaloa' },
    { value: 'Magistrate\'s Court of Ampara', label: 'Magistrate\'s Court of Ampara' },
    { value: 'Magistrate\'s Court of Trincomalee', label: 'Magistrate\'s Court of Trincomalee' },
    { value: 'Magistrate\'s Court of Kurunegala', label: 'Magistrate\'s Court of Kurunegala' },
    { value: 'Magistrate\'s Court of Puttalam', label: 'Magistrate\'s Court of Puttalam' },
    { value: 'Magistrate\'s Court of Anuradhapura', label: 'Magistrate\'s Court of Anuradhapura' },
    { value: 'Magistrate\'s Court of Polonnaruwa', label: 'Magistrate\'s Court of Polonnaruwa' },
    { value: 'Magistrate\'s Court of Badulla', label: 'Magistrate\'s Court of Badulla' },
    { value: 'Magistrate\'s Court of Moneragala', label: 'Magistrate\'s Court of Moneragala' },
    { value: 'Magistrate\'s Court of Ratnapura', label: 'Magistrate\'s Court of Ratnapura' },
    { value: 'Magistrate\'s Court of Kegalle', label: 'Magistrate\'s Court of Kegalle' }
  ],
  'Primary Court': [
    { value: 'Primary Court of Anamaduwa', label: 'Primary Court of Anamaduwa' },
    { value: 'Primary Court of Angunukolapelessa', label: 'Primary Court of Angunukolapelessa' },
    { value: 'Primary Court of Kandy', label: 'Primary Court of Kandy' },
    { value: 'Primary Court of Mallakam', label: 'Primary Court of Mallakam' },
    { value: 'Primary Court of Pilessa', label: 'Primary Court of Pilessa' },
    { value: 'Primary Court of Wellawaya', label: 'Primary Court of Wellawaya' },
    { value: 'Primary Court of Wennappuwa', label: 'Primary Court of Wennappuwa' }
  ],
  'Labor Tribunal': [
    { value: 'Labor Tribunal of Colombo', label: 'Labor Tribunal of Colombo' },
    { value: 'Labor Tribunal of Kandy', label: 'Labor Tribunal of Kandy' },
    { value: 'Labor Tribunal of Galle', label: 'Labor Tribunal of Galle' },
    { value: 'Labor Tribunal of Kurunegala', label: 'Labor Tribunal of Kurunegala' },
    { value: 'Labor Tribunal of Anuradhapura', label: 'Labor Tribunal of Anuradhapura' },
    { value: 'Labor Tribunal of Ratnapura', label: 'Labor Tribunal of Ratnapura' },
    { value: 'Labor Tribunal of Batticaloa', label: 'Labor Tribunal of Batticaloa' },
    { value: 'Labor Tribunal of Jaffna', label: 'Labor Tribunal of Jaffna' }
  ],
  'Agrarian Tribunal': [
    { value: 'Agrarian Tribunal of Colombo', label: 'Agrarian Tribunal of Colombo' },
    { value: 'Agrarian Tribunal of Kandy', label: 'Agrarian Tribunal of Kandy' },
    { value: 'Agrarian Tribunal of Galle', label: 'Agrarian Tribunal of Galle' },
    { value: 'Agrarian Tribunal of Kurunegala', label: 'Agrarian Tribunal of Kurunegala' },
    { value: 'Agrarian Tribunal of Anuradhapura', label: 'Agrarian Tribunal of Anuradhapura' },
    { value: 'Agrarian Tribunal of Polonnaruwa', label: 'Agrarian Tribunal of Polonnaruwa' },
    { value: 'Agrarian Tribunal of Badulla', label: 'Agrarian Tribunal of Badulla' },
    { value: 'Agrarian Tribunal of Hambantota', label: 'Agrarian Tribunal of Hambantota' }
  ],
  'Small Claims Court': [
    { value: 'Small Claims Court of Colombo', label: 'Small Claims Court of Colombo' },
    { value: 'Small Claims Court of Kandy', label: 'Small Claims Court of Kandy' },
    { value: 'Small Claims Court of Galle', label: 'Small Claims Court of Galle' },
    { value: 'Small Claims Court of Gampaha', label: 'Small Claims Court of Gampaha' },
    { value: 'Small Claims Court of Kurunegala', label: 'Small Claims Court of Kurunegala' },
    { value: 'Small Claims Court of Anuradhapura', label: 'Small Claims Court of Anuradhapura' },
    { value: 'Small Claims Court of Ratnapura', label: 'Small Claims Court of Ratnapura' },
    { value: 'Small Claims Court of Jaffna', label: 'Small Claims Court of Jaffna' }
  ]
};

const EditCasePage = () => {
    const { caseId } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth(); // Get user from context

    // Add user object like in CaseDetails.jsx
    const user = {
        name: "nishagi jewantha",
        email: "jewanthadheerath@gmail.com",
        role: "lawyer"
    };

    // State for form data, focused only on the editable fields
    const [formData, setFormData] = useState({
        caseTitle: '',
        caseType: '',
        caseNumber: '',
        courtType: '',
        court: '', // Changed from courtName to court to match NewCaseProfile
        description: '',
        status: '',
    });

    // State for UI control
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [originalCaseNumber, setOriginalCaseNumber] = useState('');

    // State for custom dropdowns
    const [showCaseTypeDropdown, setShowCaseTypeDropdown] = useState(false);
    const [showCourtTypeDropdown, setShowCourtTypeDropdown] = useState(false);
    const [showCourtDropdown, setShowCourtDropdown] = useState(false);
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);

    // Fetch existing case data to pre-fill the form
    useEffect(() => {
        if (!caseId) {
            navigate('/lawyer/caseprofile');
            return;
        }

        const fetchCaseData = async () => {
            try {
                const data = await getCaseById(caseId);
                console.log("Fetched:", data);
                setFormData({
                    caseTitle: data.caseTitle || '',
                    caseNumber: data.caseNumber || '', // Added field
                    caseType: data.caseType || '',
                    courtType: data.courtType || '',
                    court: data.court || data.courtName || '', // Handle both court and courtName
                    description: data.description || '',
                    status: data.status || '',
                });
                setOriginalCaseNumber(data.caseNumber || ''); // For display in the header
            } catch (err) {
                setError('Failed to load case data. You may not have permission.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCaseData();
    }, [caseId, navigate]);

    // Generic handler for input and textarea changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handlers for custom dropdown selections
    const handleCaseTypeSelect = (option) => {
        setFormData({ ...formData, caseType: option.value });
        setShowCaseTypeDropdown(false);
    };

    const handleCourtTypeSelect = (option) => {
        setFormData({ ...formData, courtType: option.value, court: '' }); // Reset court when court type changes
        setShowCourtTypeDropdown(false);
    };

    const handleCourtSelect = (option) => {
        setFormData({ ...formData, court: option.value });
        setShowCourtDropdown(false);
    };

    const handleStatusSelect = (option) => {
        setFormData({ ...formData, status: option.value });
        setShowStatusDropdown(false);
    };

    // Helper functions for court system
    const getAvailableCourts = () => {
        return courtLocations[formData.courtType] || [];
    };

    const getSelectedCourtLabel = () => {
        const availableCourts = getAvailableCourts();
        const selected = availableCourts.find(option => option.value === formData.court);
        return selected ? selected.label : "Select Court";
    };

    // Form submission logic
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        try {
            // The `updateCase` service function will send the formData to the backend
            await updateCase(caseId, formData);
            
            // Show success alert with consistent styling
            await Swal.fire({
                title: 'Case Updated Successfully!',
                text: 'Your case profile has been updated and saved to the system.',
                confirmButtonText: 'View Case Details',
                confirmButtonColor: '#000000',
                background: '#ffffff',
                width: '500px',
                customClass: {
                    popup: 'rounded-lg',
                    title: 'text-gray-800 text-xl',
                    content: 'text-gray-600 text-xs'
                }
            });
            
            navigate(`/lawyer/case/${caseId}`); // Go back to the details page
            
        } catch (err) {
            setError(err.message || 'Failed to update case. Please try again.');
            
            // Show error alert with consistent styling
            await Swal.fire({
                title: 'Error Updating Case',
                text: err.message || 'Failed to update case. Please try again.',
                confirmButtonText: 'Try Again',
                confirmButtonColor: '#000000',
                background: '#ffffff',
                width: '500px',
                customClass: {
                    popup: 'rounded-lg',
                    title: 'text-gray-800 text-xl',
                    content: 'text-gray-600 text-xs'
                }
            });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // Helper to get the display label for the selected dropdown option
    const getSelectedLabel = (options, value) => {
        const selected = options.find(option => option.value === value);
        return selected ? selected.label : `Select...`;
    };

    if (isLoading) {
        return <PageLayout user={user}><div className="flex justify-center items-center h-screen">Loading...</div></PageLayout>;
    }

    return (
        <PageLayout user={user}>
            <div className="flex items-center justify-between mb-6">
                <Button1 text="← Back to Case Details" onClick={() => navigate(`/lawyer/case/${caseId}`)} className="mb-6" />
            </div>
            
            <h1 className="text-2xl font-semibold mb-6">
                Edit Case Profile ({originalCaseNumber})
            </h1>
            
            {error && (
                <div className="w-full mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-8 w-full">
                <section className="bg-white rounded-lg p-8 shadow-md">
                                <h2 className="text-xl font-semibold mb-6">Case Details</h2>
                                <div className="grid md:grid-cols-2 gap-8">

                                    {/* Case Name (Title) Input */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Case Name</label>
                                        <input
                                            name="caseTitle"
                                            value={formData.caseTitle}
                                            onChange={handleChange}
                                            className="w-full text-md py-3 px-4 rounded-full bg-white border-2 border-gray-300 focus:border-black transition-all duration-200 focus:outline-none"
                                            required
                                        />
                                    </div>

                                    {/* Case Number Input */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Case Number</label>
                                        <input
                                            name="caseNumber"
                                            value={formData.caseNumber}
                                            onChange={handleChange}
                                            className="w-full text-md py-3 px-4 rounded-full bg-white border-2 border-gray-300 focus:border-black transition-all duration-200 focus:outline-none"
                                        />
                                    </div>

                                    {/* Case Type Dropdown */}
                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Case Type</label>
                                        <div onClick={() => setShowCaseTypeDropdown(!showCaseTypeDropdown)} className="w-full mt-1 text-md py-3 px-4 rounded-full bg-white border-2 border-gray-300 flex justify-between items-center cursor-pointer">
                                            <span>{getSelectedLabel(caseTypeOptions, formData.caseType)}</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${showCaseTypeDropdown ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        {showCaseTypeDropdown && (
                                            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 overflow-auto">
                                                {caseTypeOptions.map(option => (
                                                    <div key={option.value} onClick={() => handleCaseTypeSelect(option)} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">{option.label}</div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Court Type Dropdown */}
                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Court Type</label>
                                        <div onClick={() => setShowCourtTypeDropdown(!showCourtTypeDropdown)} className="w-full mt-1 text-md py-3 px-4 rounded-full bg-white border-2 border-gray-300 flex justify-between items-center cursor-pointer">
                                            <span>{getSelectedLabel(courtTypeOptions, formData.courtType)}</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${showCourtTypeDropdown ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        {showCourtTypeDropdown && (
                                            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 overflow-auto">
                                                {courtTypeOptions.map(option => (
                                                    <div key={option.value} onClick={() => handleCourtTypeSelect(option)} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">{option.label}</div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Court Dropdown */}
                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Court</label>
                                        <div 
                                            onClick={() => formData.courtType && setShowCourtDropdown(!showCourtDropdown)} 
                                            className={`w-full mt-1 text-md py-3 px-4 rounded-full bg-white border-2 border-gray-300 flex justify-between items-center ${
                                                formData.courtType ? 'cursor-pointer' : 'cursor-not-allowed bg-gray-100'
                                            }`}
                                        >
                                            <span className={formData.court ? "" : "text-gray-500"}>
                                                {formData.courtType ? getSelectedCourtLabel() : "Select Court Type first"}
                                            </span>
                                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${showCourtDropdown ? 'transform rotate-180' : ''} ${!formData.courtType ? 'text-gray-400' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        {showCourtDropdown && formData.courtType && (
                                            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 overflow-auto">
                                                {getAvailableCourts().map(option => (
                                                    <div key={option.value} onClick={() => handleCourtSelect(option)} className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm">
                                                        <div className="font-medium">{option.label}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Status Dropdown */}
                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                        <div onClick={() => setShowStatusDropdown(!showStatusDropdown)} className="w-full mt-1 text-md py-3 px-4 rounded-full bg-white border-2 border-gray-300 flex justify-between items-center cursor-pointer">
                                            <span>{getSelectedLabel(statusOptions, formData.status)}</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${showStatusDropdown ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        {showStatusDropdown && (
                                            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 overflow-auto">
                                                {statusOptions.map(option => (
                                                    <div key={option.value} onClick={() => handleStatusSelect(option)} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">{option.label}</div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Description Textarea */}
                                <div className="mt-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={5}
                                        className="w-full text-md py-3 px-4 rounded-lg bg-white border-2 border-gray-300 focus:border-black transition-all duration-200 focus:outline-none resize-none"
                                    />
                                </div>
                            </section>

                            <div className="flex justify-end mt-6">
                                <Button1 
                                    text={isSubmitting ? "Saving..." : "Save Changes"} 
                                    type="submit" 
                                    className="px-8"
                                    disabled={isSubmitting}
                                />
                            </div>
                        </form>
        </PageLayout>
    );
};

export default EditCasePage;