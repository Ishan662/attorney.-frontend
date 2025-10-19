import React, { useState, useEffect } from 'react';
import PageLayout from '../../components/layout/PageLayout';
import Input1 from '../../components/UI/Input1';
import Button1 from '../../components/UI/Button1';
import Button2 from '../../components/UI/Button2';
import { useNavigate } from 'react-router-dom';
// Add these imports
import { createCase, getClientsForSelection, getJuniorsForSelection } from '../../services/caseService';
import Swal from 'sweetalert2';

const user = {
  name: 'Nishagi Jewantha',
  email: 'jewanthadheerath@gmail.com',
};

const initialState = {
  caseName: '',
  caseNumber: '',
  caseType: '',
  courtType: '',
  court: '',
  date: '',
  status: '',
  description: '',
  existingClientId: '', // For selecting existing client
  clientName: '',
  clientPhone: '',
  clientEmail: '',
  opposingParty: '',
  associatedJuniorId: '', // Updated field name to match backend
  agreedFee: '',
  totalExpenses: '',
  paymentStatus: '',
  invoice: '',
  hearings: [
    { label: '', date: '', location: '', note: '' },
  ],
  timeline: [
    { date: '', label: '' },
  ],
  documents: [],
};



// Case type options from the image
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

const NewCaseProfile = () => {
  const [form, setForm] = useState(initialState);
  const [showCaseTypeDropdown, setShowCaseTypeDropdown] = useState(false);
  const [showCourtTypeDropdown, setShowCourtTypeDropdown] = useState(false);
  const [showCourtDropdown, setShowCourtDropdown] = useState(false);
  const [showJuniorDropdown, setShowJuniorDropdown] = useState(false);
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [hasCaseNumber, setHasCaseNumber] = useState(true); // New state for toggle
  const [useExistingClient, setUseExistingClient] = useState(false); // New state for client selection mode
  // Add these new state variables
  const [juniorLawyerOptions, setJuniorLawyerOptions] = useState([]);
  const [clientOptions, setClientOptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Load junior lawyers and clients when component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load junior lawyers
        const juniors = await getJuniorsForSelection();
        const formattedJuniors = juniors.map(junior => ({
          value: junior.id,
          label: `${junior.firstName} ${junior.lastName}`,
          email: junior.email
        }));
        setJuniorLawyerOptions(formattedJuniors);

        // Load clients
        const clients = await getClientsForSelection();
        const formattedClients = clients.map(client => ({
          id: client.id,
          name: `${client.firstName} ${client.lastName}`,
          email: client.email
        }));
        setClientOptions(formattedClients);
      } catch (error) {
        console.error('Failed to load data:', error);
        // Fallback to empty arrays
        setJuniorLawyerOptions([]);
        setClientOptions([]);
      }
    };

    loadData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle dropdown selection for case type
  const handleCaseTypeSelect = (option) => {
    setForm({ ...form, caseType: option.value });
    setShowCaseTypeDropdown(false);
  };

  // Handle dropdown selection for court type
  const handleCourtTypeSelect = (option) => {
    setForm({ ...form, courtType: option.value, court: '' }); // Reset court when court type changes
    setShowCourtTypeDropdown(false);
  };

  // Handle dropdown selection for court
  const handleCourtSelect = (option) => {
    setForm({ ...form, court: option.value });
    setShowCourtDropdown(false);
  };

  // Handle dropdown selection for junior lawyer
  const handleJuniorSelect = (option) => {
    setForm({ ...form, associatedJuniorId: option.value });
    setShowJuniorDropdown(false);
  };

  // Handle client selection from existing clients
  const handleExistingClientSelect = (client) => {
    setForm({ 
      ...form, 
      existingClientId: client.id,
      clientName: client.name,
      clientEmail: client.email,
      clientPhone: '' // Will be populated from backend if available
    });
    setShowClientDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validate required dropdown fields
    if (!form.caseType) {
      setError('Please select a Case Type');
      setIsSubmitting(false);
      return;
    }

    if (!form.courtType) {
      setError('Please select a Court Type');
      setIsSubmitting(false);
      return;
    }

    // Validate client information based on mode
    if (useExistingClient && !form.existingClientId) {
      setError('Please select an existing client');
      setIsSubmitting(false);
      return;
    }

    if (!useExistingClient && (!form.clientName || !form.clientEmail)) {
      setError('Please fill in all required client information');
      setIsSubmitting(false);
      return;
    }

    try {
      // Call the backend API
      const newCaseId = await createCase(form);
      
      // Show success message with SweetAlert2
      await Swal.fire({
        title: 'Case Created Successfully!',
        text: 'Your new case profile has been created and saved to the system.',
        confirmButtonText: 'View Cases',
        confirmButtonColor: '#000000',
        background: '#ffffff',
        width: '500px',
        customClass: {
          popup: 'rounded-lg',
          title: 'text-gray-800 text-xl',
          content: 'text-gray-600 text-xs'
        }
      });
      
      // Navigate to the case details page or cases list
      navigate(`/lawyer/caseprofile`); 
      
    } catch (error) {
      console.error('Failed to create case:', error);
      
      // Show error message with SweetAlert2
      await Swal.fire({
        title: 'Error Creating Case',
        text: error.message || 'Failed to create case. Please try again.',
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
      
      setError(error.message || 'Failed to create case. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get the selected case type label
  const getSelectedCaseTypeLabel = () => {
    const selected = caseTypeOptions.find(option => option.value === form.caseType);
    return selected ? selected.label : "Select Case Type";
  };

  // Get the selected court type label
  const getSelectedCourtTypeLabel = () => {
    const selected = courtTypeOptions.find(option => option.value === form.courtType);
    return selected ? selected.label : "Select Court Type";
  };

  // Get the selected junior lawyer label
  const getSelectedJuniorLabel = () => {
    const selected = juniorLawyerOptions.find(option => option.value === form.associatedJuniorId);
    return selected ? selected.label : "Select Junior Lawyer";
  };

  // Get available courts based on selected court type
  const getAvailableCourts = () => {
    return courtLocations[form.courtType] || [];
  };

  // Get the selected court label
  const getSelectedCourtLabel = () => {
    const availableCourts = getAvailableCourts();
    const selected = availableCourts.find(option => option.value === form.court);
    return selected ? selected.label : "Select Court";
  };

  return (
    <PageLayout user={user}>
      {/* Center content with flex and max-width */}
      <div className="flex flex-col items-center w-full">
        <h1 className="text-2xl font-semibold mb-6">Add New Case Profile</h1>
        
        {/* Case Type Toggle */}
        <div className="w-full max-w-4xl mx-auto mb-6">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-medium mb-4">Case Registration Type</h3>
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => setHasCaseNumber(true)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                  hasCaseNumber
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Registered Case
              </button>
              <button
                type="button"
                onClick={() => setHasCaseNumber(false)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                  !hasCaseNumber
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pre-Registration Case
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-3">
              {hasCaseNumber 
                ? "For cases that already have an official case number assigned by the court."
                : "For cases in preparation stage. You can add the case number later when the case is officially registered."
              }
            </p>
          </div>
        </div>
        
        {/* Add error display */}
        {error && (
          <div className="w-full max-w-4xl mx-auto mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-8 w-full max-w-4xl mx-auto">
              {/* Case Overview */}
              <section className="bg-white rounded-lg p-8 shadow-md">
                <h2 className="text-xl font-semibold mb-4">
                  {hasCaseNumber ? "Registered Case Details" : "Pre-Registration Case Details"}
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Left Side */}
                  <Input1
                    label="Case Name"
                    name="caseName"
                    value={form.caseName}
                    onChange={handleChange}
                    placeholder="Case Name"
                    className="mt-2"
                    variant="outlined"
                    required
                  />
                  
                  {/* Right Side */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Court Type <span className="text-red-500">*</span>
                    </label>
                    <div 
                      className="w-full mt-2 text-md py-3 px-4 rounded-full bg-white border-2 border-gray-300 text-gray-800 flex justify-between items-center cursor-pointer"
                      onClick={() => setShowCourtTypeDropdown(!showCourtTypeDropdown)}
                    >
                      <span className={form.courtType ? "" : "text-gray-500"}>
                        {getSelectedCourtTypeLabel()}
                      </span>
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${showCourtTypeDropdown ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                    
                    {/* Dropdown Menu */}
                    {showCourtTypeDropdown && (
                      <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 overflow-auto">
                        {courtTypeOptions.map((option) => (
                          <div
                            key={option.value}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                            onClick={() => handleCourtTypeSelect(option)}
                          >
                            <div className="font-medium">{option.label}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Left Side */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Case Type <span className="text-red-500">*</span>
                    </label>
                    <div 
                      className="w-full mt-2 text-md py-3 px-4 rounded-full bg-white border-2 border-gray-300 text-gray-800 flex justify-between items-center cursor-pointer"
                      onClick={() => setShowCaseTypeDropdown(!showCaseTypeDropdown)}
                    >
                      <span className={form.caseType ? "" : "text-gray-500"}>
                        {getSelectedCaseTypeLabel()}
                      </span>
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${showCaseTypeDropdown ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                    
                    {/* Dropdown Menu */}
                    {showCaseTypeDropdown && (
                      <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 overflow-auto">
                        {caseTypeOptions.map((option) => (
                          <div
                            key={option.value}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                            onClick={() => handleCaseTypeSelect(option)}
                          >
                            <div className="font-medium">{option.value}</div>
                            <div className="text-xs text-gray-500">{option.label.split(' - ')[1]}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Right Side */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Court <span className="text-red-500">*</span>
                    </label>
                    <div 
                      className={`w-full mt-2 text-md py-3 px-4 rounded-full bg-white border-2 border-gray-300 text-gray-800 flex justify-between items-center ${
                        form.courtType ? 'cursor-pointer' : 'cursor-not-allowed bg-gray-100'
                      }`}
                      onClick={() => form.courtType && setShowCourtDropdown(!showCourtDropdown)}
                    >
                      <span className={form.court ? "" : "text-gray-500"}>
                        {form.courtType ? getSelectedCourtLabel() : "Select Court Type first"}
                      </span>
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${showCourtDropdown ? 'transform rotate-180' : ''} ${!form.courtType ? 'text-gray-400' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                    
                    {/* Court Dropdown Menu */}
                    {showCourtDropdown && form.courtType && (
                      <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 overflow-auto">
                        {getAvailableCourts().map((option) => (
                          <div
                            key={option.value}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                            onClick={() => handleCourtSelect(option)}
                          >
                            <div className="font-medium">{option.label}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Conditional Case Number Field */}
                  {hasCaseNumber ? (
                    <>
                      {/* Left Side - Case Number */}
                      <Input1
                        label="Case Number"
                        name="caseNumber"
                        value={form.caseNumber}
                        onChange={handleChange}
                        placeholder="Case Number"
                        className="mt-2"
                        variant="outlined"
                        required
                      />
                      
                      {/* Right Side - Initial Hearing Date */}
                      <Input1
                        label="Initial Hearing Date"
                        name="date"
                        type="date"
                        value={form.date}
                        onChange={handleChange}
                        placeholder="Hearing date"
                        className="mt-2"
                        variant="outlined"
                        required
                      />
                    </>
                  ) : (
                    <>
                      {/* Left Side - Pre-Registration Notice */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start">
                          <svg className="h-5 w-5 text-blue-400 mt-1 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                          <div>
                            <h4 className="text-sm font-medium text-blue-800">Pre-Registration Case</h4>
                            <p className="text-sm text-blue-700 mt-1">
                              This case is in preparation stage. You can add the official case number and hearing date later when the case is registered with the court.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Right Side - Expected Filing Date */}
                      <Input1
                        label="Expected Filing Date"
                        name="date"
                        type="date"
                        value={form.date}
                        onChange={handleChange}
                        placeholder="Expected filing date"
                        className="mt-2"
                        variant="outlined"
                      />
                    </>
                  )}
                
                </div>
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Brief description of the case"
                    className="w-full text-md py-3 px-4 rounded-lg bg-white border-2 border-gray-300 text-gray-800 placeholder-gray-500 focus:border-black transition-all duration-200 focus:outline-none resize-none"
                    rows={4}
                  />
                </div>
              </section>

              {/* Parties Involved */}
              <section className="bg-white rounded-lg p-8 shadow-md">
                <h2 className="text-xl font-semibold mb-4">Parties Involved</h2>
                
                {/* Client Information - Required */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4 text-gray-800">Client Information <span className="text-red-500">*</span></h3>
                  
                  {/* Client Selection Mode Toggle */}
                  <div className="mb-6">
                    <div className="flex items-center space-x-4">
                      <button
                        type="button"
                        onClick={() => setUseExistingClient(true)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                          useExistingClient
                            ? 'bg-black text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Select Existing Client
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setUseExistingClient(false);
                          setForm({ ...form, existingClientId: '', clientName: '', clientPhone: '', clientEmail: '' });
                        }}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                          !useExistingClient
                            ? 'bg-black text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Add New Client
                      </button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {useExistingClient ? (
                      <>
                        {/* Existing Client Dropdown */}
                        <div className="relative md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Select Existing Client <span className="text-red-500">*</span>
                          </label>
                          <div 
                            className="w-full mt-2 text-md py-3 px-4 rounded-full bg-white border-2 border-gray-300 text-gray-800 flex justify-between items-center cursor-pointer"
                            onClick={() => setShowClientDropdown(!showClientDropdown)}
                          >
                            <span className={form.existingClientId ? "" : "text-gray-500"}>
                              {form.existingClientId ? form.clientName : "Select from existing clients"}
                            </span>
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${showClientDropdown ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </div>
                          
                          {/* Client Dropdown Menu */}
                          {showClientDropdown && (
                            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-64 rounded-md border border-gray-200 overflow-auto">
                              <div className="py-1">
                                <div className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border-b">
                                  Select Client
                                </div>
                                {clientOptions.map((client) => (
                                  <div
                                    key={client.id}
                                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                    onClick={() => handleExistingClientSelect(client)}
                                  >
                                    <div className="font-medium text-gray-900">{client.name}</div>
                                    <div className="text-sm text-gray-500">{client.email}</div>
                                  </div>
                                ))}
                                {clientOptions.length === 0 && (
                                  <div className="px-4 py-3 text-gray-500 text-sm">
                                    No clients found. Add a new client instead.
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        {/* New Client Fields */}
                        <Input1
                          label="Client Name"
                          name="clientName"
                          value={form.clientName}
                          onChange={handleChange}
                          placeholder="Client Name"
                          className="mt-2"
                          variant="outlined"
                          required
                        />
                        
                        <Input1
                          label="Client Phone"
                          name="clientPhone"
                          value={form.clientPhone}
                          onChange={handleChange}
                          placeholder="Client Phone Number"
                          className="mt-2"
                          variant="outlined"
                          required
                        />
                        
                        <Input1
                          label="Client Email"
                          name="clientEmail"
                          value={form.clientEmail}
                          onChange={handleChange}
                          placeholder="Client Email"
                          className="mt-2"
                          variant="outlined"
                          required
                        />
                        
                        {/* Empty space for alignment */}
                        <div></div>
                      </>
                    )}
                  </div>
                </div>

                {/* Additional Parties - Optional */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium mb-4 text-gray-800">Additional Parties <span className="text-gray-500 text-sm font-normal">(Optional)</span></h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <Input1
                      label="Opposing Party"
                      name="opposingParty"
                      value={form.opposingParty}
                      onChange={handleChange}
                      placeholder="Opposing Party Name"
                      className="mt-2"
                      variant="outlined"
                    />
                    
                    {/* Junior Lawyer Dropdown */}
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Junior Associated
                      </label>
                      <div 
                        className="w-full mt-2 text-md py-3 px-4 rounded-full bg-white border-2 border-gray-300 text-gray-800 flex justify-between items-center cursor-pointer"
                        onClick={() => setShowJuniorDropdown(!showJuniorDropdown)}
                      >
                        <span className={form.junior ? "" : "text-gray-500"}>
                          {getSelectedJuniorLabel()}
                        </span>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${showJuniorDropdown ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                      
                      {/* Dropdown Menu */}
                      {showJuniorDropdown && (
                        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 overflow-auto">
                          {juniorLawyerOptions.map((option) => (
                            <div
                              key={option.value}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleJuniorSelect(option)}
                            >
                              {option.label}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* Financials */}
              <section className="bg-white rounded-lg p-8 shadow-md">
                <h2 className="text-xl font-semibold mb-4">Financials</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Agreed Fee</label>
                    <input
                      type="text"
                      name="agreedFee"
                      value={form.agreedFee}
                      onChange={handleChange}
                      placeholder="Agreed Fee Amount"
                      required
                      className="w-full text-md py-3 px-4 rounded-full bg-white border-2 border-gray-300 text-gray-800 placeholder-gray-500 focus:border-black transition-all duration-200 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                    <select
                      name="paymentStatus"
                      value={form.paymentStatus}
                      onChange={handleChange}
                      required
                      className="w-full text-md py-3 px-4 rounded-full bg-white border-2 border-gray-300 text-gray-800 placeholder-gray-500 focus:border-black transition-all duration-200 focus:outline-none"
                    >
                      <option value="">Select status</option>
                      <option value="Paid">Paid</option>
                      <option value="Partially Paid">Partially Paid</option>
                      <option value="Not Paid">Not Paid</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Submit Button */}

              {/* Submit Button */}
              <div className="flex justify-center mt-6">
                <Button1 
                  text={isSubmitting ? "Creating..." : hasCaseNumber ? "Create Case Profile" : "Create Pre-Registration Case"} 
                  type="submit" 
                  className="px-8"
                  disabled={isSubmitting}
                />
              </div>
            </form>
          </div>
    </PageLayout>
  );
};

export default NewCaseProfile;