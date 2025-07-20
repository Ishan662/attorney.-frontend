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

// Court type options
const courtTypeOptions = [
  { value: 'Supreme Court', label: 'Supreme Court' },
  { value: 'Court of Appeal', label: 'Court of Appeal' },
  { value: 'High Court', label: 'High Court' },
  { value: 'District Court', label: 'District Court' },
  { value: 'Magistrate Court', label: 'Magistrate Court' },
  { value: 'Commercial High Court', label: 'Commercial High Court' },
  { value: 'Family Court', label: 'Family Court' },
  { value: 'Labor Tribunal', label: 'Labor Tribunal' },
  { value: 'Primary Court', label: 'Primary Court' },
  { value: 'Special High Court', label: 'Special High Court' },
];

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
        courtName: '',
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
                    courtName: data.courtName || '',
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
        setFormData({ ...formData, courtType: option.value });
        setShowCourtTypeDropdown(false);
    };

    const handleStatusSelect = (option) => {
        setFormData({ ...formData, status: option.value });
        setShowStatusDropdown(false);
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

                                    {/* Court Name Input */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Court Name</label>
                                        <input
                                            name="courtName"
                                            value={formData.courtName}
                                            onChange={handleChange}
                                            placeholder="Court Name"
                                            className="w-full text-md py-3 px-4 rounded-full bg-white border-2 border-gray-300 focus:border-black transition-all duration-200 focus:outline-none"
                                        />
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