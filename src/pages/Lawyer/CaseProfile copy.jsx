import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import Input1 from '../../components/UI/Input1';
import Button1 from '../../components/UI/Button1';
import PageHeader from '../../components/layout/PageHeader';
import { getMyCases, getJuniorsForSelection, addCaseMember } from '../../services/caseService';
import PageLayout from '../../components/layout/PageLayout';
import Swal from 'sweetalert2';

const user = {
  name: 'Nishagi Jewantha',
  email: 'jewanthadheerath@gmail.com',
  role: 'lawyer',
};

const CaseProfiles = () => {
  const navigate = useNavigate();

  const [cases, setCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [notificationCount, setNotificationCount] = useState(1);
  
  // Junior lawyer association states
  const [juniorLawyers, setJuniorLawyers] = useState([]);
  const [selectedCaseForJunior, setSelectedCaseForJunior] = useState(null);
  const [selectedJuniorId, setSelectedJuniorId] = useState('');
  const [showJuniorDropdown, setShowJuniorDropdown] = useState({});
  const [isAssigning, setIsAssigning] = useState(false);

  const handleNotificationClick = () => {
    // Handle notifications
  };

  // Handle junior lawyer assignment
  const handleAssignJunior = async (caseId, juniorId) => {
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

    setIsAssigning(true);
    try {
      // Find the selected junior's name for display
      const selectedJunior = juniorLawyers.find(j => j.id === juniorId);
      const juniorName = selectedJunior ? `${selectedJunior.firstName} ${selectedJunior.lastName}` : 'Unknown';

      // Add the junior as a case member
      await addCaseMember(caseId, {
        userId: juniorId,
        role: 'JUNIOR_LAWYER'
      });

      // Update the local cases state
      setCases(prevCases => 
        prevCases.map(case_ => 
          case_.id === caseId 
            ? { ...case_, junior: juniorName }
            : case_
        )
      );

      // Hide dropdown and reset selection
      setShowJuniorDropdown(prev => ({ ...prev, [caseId]: false }));
      setSelectedJuniorId('');

      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Junior Assigned!',
        text: `${juniorName} has been successfully assigned to this case`,
        confirmButtonColor: '#000000',
        background: '#ffffff',
        width: '500px',
        customClass: {
          popup: 'rounded-lg'
        }
      });

    } catch (error) {
      console.error('Error assigning junior lawyer:', error);
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
      setIsAssigning(false);
    }
  };

  // Toggle junior dropdown for specific case
  const toggleJuniorDropdown = (caseId) => {
    setShowJuniorDropdown(prev => ({
      ...prev,
      [caseId]: !prev[caseId]
    }));
  };

  // Handle junior selection
  const handleJuniorSelect = (caseId, juniorId) => {
    handleAssignJunior(caseId, juniorId);
  };

  // Close all dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.junior-dropdown-container')) {
        setShowJuniorDropdown({});
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch cases and junior lawyers in parallel
        const [fetchedCases, fetchedJuniors] = await Promise.all([
          getMyCases(),
          getJuniorsForSelection()
        ]);
        
        setCases(fetchedCases);
        setJuniorLawyers(fetchedJuniors);
      } catch (err) {
        setError('Failed to load data. Please try refreshing the page.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredCases = cases.filter(c =>
    (c.caseTitle?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (c.caseNumber?.toLowerCase() || '').includes(search.toLowerCase())
  );

  return (
    <PageLayout user={user}>
      <div className="flex-grow overflow-y-auto transition-all duration-300">
        <div className="p-0">
          <main className="flex-1 p-0">
            <div className="justify-between flex items-center mb-6">
              <h1 className="text-2xl font-semibold mb-6">Case Profiles</h1>
              <Button1
                text="Create New Case"
                onClick={() => navigate('/lawyer/newcaseprofile')}
              />
            </div>

            <div className="mb-6 max-w-md">
              <Input1
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by case name or case number..."
                className="bg-orange-50"
                variant="outlined"
              />
            </div>

            <div className="space-y-4">
              {isLoading ? (
                <p>Loading...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                filteredCases.map(c => (
                  <div
                    key={c.id}
                    className="bg-white rounded-lg p-5 shadow-md border border-gray-200"
                  >
                    {/* Title Section */}
                    <div className="bg-gray-100 font-semibold text-base mb-4 px-4 py-2 rounded-md">
                      {c.caseTitle}
                    </div>

                    {/* Case Details */}
                    <div className="text-sm text-gray-700 space-y-1 mb-4">
                      <div>
                        <span className="font-bold">Case Number:</span> {c.caseNumber}
                      </div>
                      <div>
                        <span className="font-bold">Case Owner:</span> {c.owner || 'N/A'}
                      </div>
                      <div>
                        <span className="font-bold">Case Type:</span> {c.caseType || 'N/A'}
                      </div>
                      <div>
                        <span className="font-bold">Next Hearing:</span>{' '}
                        {c.nextHearing ? new Date(c.nextHearing).toLocaleDateString() : 'Not Scheduled'}
                      </div>
                      
                      {/* Junior Associate Section with Assignment Functionality */}
                      <div className="flex items-center gap-2">
                        <span className="font-bold">Junior Associate:</span>
                        {c.junior && c.junior !== 'Not Assigned' ? (
                          <span className="text-green-600">{c.junior}</span>
                        ) : (
                          <div className="relative">
                            <button
                              onClick={() => toggleJuniorDropdown(c.id)}
                              className="text-blue-600 hover:text-blue-800 underline text-sm"
                              disabled={isAssigning}
                            >
                              {isAssigning ? 'Assigning...' : 'Assign Junior'}
                            </button>
                            
                            {/* Junior Lawyer Dropdown */}
                            {showJuniorDropdown[c.id] && (
                              <div className="absolute z-10 mt-1 w-64 bg-white shadow-lg rounded-md border border-gray-200 max-h-48 overflow-auto">
                                <div className="py-1">
                                  <div className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border-b">
                                    Select Junior Lawyer
                                  </div>
                                  {juniorLawyers.length > 0 ? (
                                    juniorLawyers.map((junior) => (
                                      <div
                                        key={junior.id}
                                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                        onClick={() => handleJuniorSelect(c.id, junior.id)}
                                      >
                                        <div className="font-medium text-gray-900">
                                          {junior.firstName} {junior.lastName}
                                        </div>
                                        <div className="text-sm text-gray-500">{junior.email}</div>
                                      </div>
                                    ))
                                  ) : (
                                    <div className="px-4 py-2 text-gray-500 text-sm">
                                      No junior lawyers available
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div>
                        <span className="font-bold">Fee:</span> ${c.agreedFee ? c.agreedFee.toFixed(2) : '0.00'}{' '}
                        <span className={c.paymentStatus === 'PAID IN FULL' ? 'text-green-600' : 'text-yellow-600'}>
                          ({c.paymentStatus.replace('_', ' ')})
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button1 text="Close Case" />
                      <Button1
                        text={<span>View Details →</span>}
                        className="flex items-center"
                        onClick={() => navigate(`/lawyer/case/${c.id}`)}
                      />
                    </div>
                  </div>
                ))
              )}

              {/* No result message */}
              {!isLoading && !error && filteredCases.length === 0 && (
                <p>No cases found.</p>
              )}
            </div>
          </main>
        </div>
      </div>
    </PageLayout>
  );
};

export default CaseProfiles;
