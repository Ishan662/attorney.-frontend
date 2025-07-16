import React, { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';
import Button1 from '../../components/UI/Button1';
import PageHeader from '../../components/layout/PageHeader';

const clients = [
  {
    name: 'Anura De Mel',
    phone: '+94711234567',
    email: 'anura.d@example.com',
    case: 'Divorce settlement and child custody.',
    added: '2024-05-15',
  },
  {
    name: 'Gayani Silva',
    phone: '+94777654321',
    email: 'gayani.s@example.com',
    case: 'Immigration application.',
    added: '2024-03-01',
  },
  {
    name: 'Kamal J.',
    phone: '+94781234567',
    email: 'kamal.j@example.com',
    case: 'Contract review for small business.',
    added: '2023-12-10',
  },
  {
    name: 'Nimal Perera',
    phone: '+94701234567',
    email: 'nimal.p@example.com',
    case: 'Criminal defense.',
    added: '2024-01-20',
  },
  {
    name: 'S. Fernando',
    phone: '+94778901234',
    email: 's.fernando@example.com',
    case: 'Property dispute resolution.',
    added: '2024-02-02',
  },
];

const user = {
    name: 'Nishagi Jewantha',
    email: 'jewanthadheerath@gmail.com',
};


const handleNotificationClick = () => {

};


const Clients = () => {

  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [notificationCount, setNotificationCount] = useState(1);

  return (
    <div className="flex h-screen bg-white-50">
      {/* Sidebar */}
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


        {/* Main content */}
        <div className="p-6">
          <div className='mb-8'>
            <PageHeader
              user={user}
              notificationCount={notificationCount}
              onNotificationClick={handleNotificationClick}
            />
          </div>


          {/* Client Roster */}
          <main className="flex-1 flex items-start justify-center overflow-y-auto">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl mt-4 mb-8">
              <h2 className="text-xl font-semibold text-center mb-8">Your Clients</h2>
              <div className="space-y-4">
                {clients.map((client, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-5 border">
                    <div className="font-bold text-gray-800">{client.name}</div>
                    <div className="text-sm text-gray-700">Phone: {client.phone}</div>
                    <div className="text-sm text-gray-700">Email: {client.email}</div>
                    <div className="text-sm text-gray-700">Case: {client.case}</div>
                    <div className="text-xs text-gray-500 mt-2">Added: {client.added}</div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Clients;