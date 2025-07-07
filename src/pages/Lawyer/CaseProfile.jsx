import React, { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Input1 from '../../components/UI/Input1';
import Button1 from '../../components/UI/Button1';
import Button2 from '../../components/UI/Button2';
import PageHeader from '../../components/layout/PageHeader';

const mockCases = [
  {
    id: 1,
    caseNumber: '2023-PR-00123',
    title: 'The Estate of Eleanor Vance',
    owner: 'John Doe',
    type: 'Probate',
    nextHearing: '2024-03-15',
    junior: 'Jane Smith',
    fee: '$5,000',
    feeStatus: 'Paid',
  },
  {
    id: 2,
    caseNumber: '2023-GU-00456',
    title: "The Matter of the Guardianship of Finnigan O'Malley",
    owner: 'Sarah Lee',
    type: 'Guardianship',
    nextHearing: '2024-06-22',
    junior: 'David Chen',
    fee: '$3,500',
    feeStatus: 'Due',
  },
  {
    id: 3,
    caseNumber: '2023-ES-00789',
    title: 'The Case of the Disputed Will of Arthur Pendragon',
    owner: 'Michael Brown',
    type: 'Estate Litigation',
    nextHearing: '2024-05-10',
    junior: 'Emily White',
    fee: '$7,200',
    feeStatus: 'Paid',
  },
];

const user = {
  name: 'Nishagi Jewantha',
  email: 'jewanthadheerath@gmail.com',
  role: 'lawyer',
};

const CaseProfiles = () => {
  const [search, setSearch] = useState('');
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [notificationCount, setNotificationCount] = useState(1);

  const handleNotificationClick = () => {

  };


  const filteredCases = mockCases.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.caseNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-white-50">
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
          <div className='mb-8'>
            <PageHeader
              user={user}
              notificationCount={notificationCount}
              onNotificationClick={handleNotificationClick}
            />
          </div>
          <main className="flex-1 p-8">

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
              {filteredCases.map(c => (
                <div
                  key={c.id}
                  className="bg-gray-100 rounded-lg p-5 shadow-md border border-gray-200"
                >
                  <div className="font-semibold text-base mb-2">{c.title}</div>
                  <div className="text-sm text-gray-700 space-y-1 mb-4">
                    <div>
                      <span className="font-bold">Case Number:</span> {c.caseNumber}
                    </div>
                    <div>
                      <span className="font-bold">Case Owner:</span> {c.owner}
                    </div>
                    <div>
                      <span className="font-bold">Case Type:</span> {c.type}
                    </div>
                    <div>
                      <span className="font-bold">Next Hearing:</span> {c.nextHearing}
                    </div>
                    <div>
                      <span className="font-bold">Junior Associate:</span> {c.junior}
                    </div>
                    <div>
                      <span className="font-bold">Fee:</span> {c.fee}{' '}
                      <span className={c.feeStatus === 'Paid' ? 'text-green-600' : 'text-yellow-600'}>
                        ({c.feeStatus})
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button1 text="Close Case" />
                    <Button1 text="View Details" inverted={false} className="flex items-center" to="/lawyer/casedetails">
                      <span>View Details</span>
                      <span className="ml-2">&rarr;</span>
                    </Button1>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CaseProfiles;