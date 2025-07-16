import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import PageHeader from '../../components/layout/PageHeader';
import Input1 from '../../components/UI/Input1';
import Button1 from '../../components/UI/Button1';
import Button2 from '../../components/UI/Button2';
import { useNavigate } from 'react-router-dom';
// Add these imports
import { createCase, getJuniorsForFirm } from '../../services/caseService';

const user = {
  name: 'Nishagi Jewantha',
  email: 'jewanthadheerath@gmail.com',
};

const initialState = {
  caseName: '',
  caseNumber: '',
  caseType: '',
  court: '',
  date: '',
  status: '',
  description: '',
  clientName: '',
  clientPhone: '',
  clientEmail: '',
  opposingParty: '',
  junior: '',
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

const NewCaseProfile = () => {
  const [form, setForm] = useState(initialState);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [notificationCount, setNotificationCount] = useState(1);
  const [showCaseTypeDropdown, setShowCaseTypeDropdown] = useState(false);
  const [showJuniorDropdown, setShowJuniorDropdown] = useState(false);
  // Add these new state variables
  const [juniorLawyerOptions, setJuniorLawyerOptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Load junior lawyers when component mounts
  useEffect(() => {
    const loadJuniorLawyers = async () => {
      try {
        const juniors = await getJuniorsForFirm();
        // Transform the API response to match your dropdown format
        const formattedJuniors = juniors.map(junior => ({
          value: junior.id, // Use the actual ID from backend
          label: `${junior.firstName} ${junior.lastName}` // Adjust based on your user model
        }));
        setJuniorLawyerOptions(formattedJuniors);
      } catch (error) {
        console.error('Failed to load junior lawyers:', error);
        // Fallback to empty array or show error message
        setJuniorLawyerOptions([]);
      }
    };

    loadJuniorLawyers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle dropdown selection for case type
  const handleCaseTypeSelect = (option) => {
    setForm({ ...form, caseType: option.value });
    setShowCaseTypeDropdown(false);
  };

  // Handle dropdown selection for junior lawyer
  const handleJuniorSelect = (option) => {
    setForm({ ...form, junior: option.value });
    setShowJuniorDropdown(false);
  };

  // For simplicity, hearings/timeline/documents are not dynamic in this starter
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Call the backend API
      const newCaseId = await createCase(form);
      
      // Show success message
      alert('Case profile created successfully!');
      
      // Navigate to the case details page or cases list
      navigate(`/lawyer/cases/${newCaseId}`); // or navigate('/lawyer/cases')
      
    } catch (error) {
      console.error('Failed to create case:', error);
      setError(error.message || 'Failed to create case. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Optional: handle notification click
  const handleNotificationClick = () => {
    // Notification handling
  };

  // Get the selected case type label
  const getSelectedCaseTypeLabel = () => {
    const selected = caseTypeOptions.find(option => option.value === form.caseType);
    return selected ? selected.label : "Select Case Type";
  };

  // Get the selected junior lawyer label
  const getSelectedJuniorLabel = () => {
    const selected = juniorLawyerOptions.find(option => option.value === form.junior);
    return selected ? selected.label : "Select Junior Lawyer";
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        user={user}
        onToggle={setSidebarExpanded}
      />
      <div
        className="flex-grow overflow-y-auto transition-all duration-300"
        style={{
          marginLeft: sidebarExpanded ? '16rem' : '5rem'
        }}
      >
        <div className="p-6">
          
          {/* Center content with flex and max-width */}
          <div className="flex flex-col items-center w-full">
            <h1 className="text-2xl font-semibold mb-6">Add New Case Profile</h1>
            
            {/* Add error display */}
            {error && (
              <div className="w-full max-w-4xl mx-auto mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-8 w-full max-w-4xl mx-auto">
              {/* Case Overview */}
              <section className="bg-white rounded-lg p-8 shadow-md">
                <h2 className="text-xl font-semibold mb-4">New Case</h2>
                <div className="grid md:grid-cols-2 gap-6">
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
                  
                  {/* Case Type Dropdown */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Case Type
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
                  <Input1
                    label="Court"
                    name="court"
                    value={form.court}
                    onChange={handleChange}
                    placeholder="Court"
                    className="mt-2"
                    variant="outlined"
                    required
                  />
                  <Input1
                    label="Hearing date"
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={handleChange}
                    placeholder="Hearing date"
                    className="mt-2"
                    variant="outlined"
                    required
                  />
                
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
                    required
                    className="w-full text-md py-3 px-4 rounded-lg bg-white border-2 border-gray-300 text-gray-800 placeholder-gray-500 focus:border-black transition-all duration-200 focus:outline-none resize-none"
                    rows={4}
                  />
                </div>
              </section>

              {/* Parties Involved */}
              <section className="bg-white rounded-lg p-8 shadow-md">
                <h2 className="text-xl font-semibold mb-4">Parties Involved</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <Input1
                    label="Client"
                    name="clientName"
                    value={form.clientName}
                    onChange={handleChange}
                    placeholder="Client Name"
                    className="mt-2"
                    variant="outlined"
                    required
                  />
                  <Input1
                    label="Opposing Party"
                    name="opposingParty"
                    value={form.opposingParty}
                    onChange={handleChange}
                    placeholder="Opposing Party Name"
                    className="mt-2"
                    variant="outlined"
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
                  
                  <Input1
                    label="Client Email"
                    name="clientEmail"
                    value={form.clientEmail}
                    onChange={handleChange}
                    placeholder="Client Email"
                    className="mt-2"
                    variant="outlined"
                  />
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
              <div className="flex justify-center mt-6">
                <Button1 
                  text={isSubmitting ? "Creating..." : "Create Case Profile"} 
                  type="submit" 
                  className="px-8"
                  disabled={isSubmitting}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewCaseProfile;