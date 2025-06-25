import React from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';
import Button1 from '../../components/UI/Button1';

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

const Clients = () => (
  <div className="flex h-screen bg-gray-100">
    {/* Sidebar */}
    <Sidebar />

    {/* Main content */}
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <Header />

      {/* Page Title and Add Button */}
      <div className="flex items-center justify-between px-10 pt-8 pb-2">
        <h1 className="text-3xl font-bold text-gray-800">Clients in System</h1>
        <Button1 text="+ Add New Client" className="w-60" to="/admin/addnewclient" />
      </div>

      {/* Client Roster */}
      <main className="flex-1 flex items-start justify-center overflow-y-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl mt-4 mb-8">
          <h2 className="text-xl font-semibold text-center mb-8">Your Client Roster</h2>
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
);

export default Clients;