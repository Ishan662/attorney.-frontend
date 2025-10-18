import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Using useNavigate for buttons
import Sidebar from '../../components/layout/Sidebar';
import Input1 from '../../components/UI/Input1';
import Button1 from '../../components/UI/Button1';
// Button2 seems unused in your original JSX, so it can be removed if not needed.
// import Button2 from '../../components/UI/Button2'; 
import PageHeader from '../../components/layout/PageHeader';
import { getMyCases } from '../../services/caseService'; // Import the function to fetch data
import PageLayout from '../../components/layout/PageLayout';

// We will replace mockCases with a real data fetch.
// const mockCases = [ ... ];

const user = {
  name: 'Nishagi Jewantha',
  email: 'jewanthadheerath@gmail.com',
  role: 'lawyer',
};

const CaseProfiles = () => {
  const navigate = useNavigate();

  const [cases, setCases] = useState([]); // This will hold the data from the backend
  const [isLoading, setIsLoading] = useState(true); // To show a loading message
  const [error, setError] = useState(''); // To show any fetching errors
  const [search, setSearch] = useState('');
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [notificationCount, setNotificationCount] = useState(1); // Assuming this is dynamic later

  const handleNotificationClick = () => {
    // Notification click handler
  };

  // --- ▼▼▼ FETCHING DATA FROM THE BACKEND ▼▼▼ ---
  useEffect(() => {
    const fetchCases = async () => {
      try {
        setIsLoading(true);
        const fetchedCases = await getMyCases();
        setCases(fetchedCases);
      } catch (err) {
        setError('Failed to load your cases. Please try refreshing the page.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCases();
  }, []); // The empty array ensures this runs only once on component mount

  
  // --- ▼▼▼ DEFENSIVE FILTERING FOR REAL DATA ▼▼▼ ---
  const filteredCases = cases.filter(c =>
    (c.caseTitle?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (c.caseNumber?.toLowerCase() || '').includes(search.toLowerCase())
  );

  return (
      <PageLayout user={user}>

      <div className="flex min-h-screen bg-white-50">
          <div
            className="flex-grow overflow-y-auto transition-all duration-300"
          >
            <div className="p-6">
              {/* <div className='mb-8'>
                <PageHeader
                  user={user}
                  notificationCount={notificationCount}
                  onNotificationClick={handleNotificationClick}
                />
              </div> */}
              <main className="flex-1 p-0">
                <h1 className="text-2xl font-semibold mb-6">Case Profiles</h1>
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
                  {/* --- ▼▼▼ UPDATED JSX TO RENDER REAL DATA IN YOUR LAYOUT ▼▼▼ --- */}
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
                            <span className="font-bold">Lawyer:</span> {c.ownerLawyerName || 'N/A'}
                          </div>
                          <div>
                            <span className="font-bold">Case Type:</span> {c.caseType || 'N/A'}
                          </div>
                          <div>
                            <span className="font-bold">Next Hearing:</span>{' '}
                            {c.nextHearing ? new Date(c.nextHearing).toLocaleDateString() : 'Not Scheduled'}
                          </div>
                          <div>
                            <span className="font-bold">Junior Associate:</span> {c.junior || 'Not Assigned'}
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
                          <Button1
                            text={<span>View Details →</span>}
                            className="flex items-center"
                            onClick={() => navigate(`/client/case/${c.id}`)}
                          />
                        </div>
                      </div>
                    ))
                  )}
                  {/* If not loading and no cases, show a message */}
                  {!isLoading && !error && filteredCases.length === 0 && (
                    <p>No cases found.</p>
                  )}
                </div>
              </main>
            </div>
          </div>
      </div>
      </PageLayout>

  );
};

export default CaseProfiles;