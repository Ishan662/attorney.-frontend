import React, { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';
import Button1 from '../../components/UI/Button1';
import Button2 from '../../components/UI/Button2';
import Input1 from '../../components/UI/Input1';
import PageHeader from '../../components/layout/PageHeader';

const meetingRequests = [
  {
    title: 'Billing Inquiry',
    requestedBy: 'Kamal J.',
    duration: '30 minutes',
    notes: 'Clarification on recent invoice.',
    date: '2025-06-28 at 11:00',
  },
  {
    title: 'Follow-up on Case #123',
    requestedBy: 'Kamal J.',
    duration: '60 minutes',
    notes: 'Discuss progress and next steps for the ongoing case.',
    date: '2025-07-01 at 10:00',
  },
  {
    title: 'Document Review for Civil Suit',
    requestedBy: 'Anura De Mel',
    duration: '90 minutes',
    notes: 'Review new documents and prepare for upcoming hearing.',
    date: '2025-07-03 at 09:00',
  },
  {
    title: 'New Case Inquiry',
    requestedBy: 'S. Fernando',
    duration: '30 minutes',
    notes: 'Initial discussion about a potential new legal matter.',
    date: '2025-07-05 at 14:30',
  },
];

const user = {
  name: 'Nishagi Jewantha',
  email: 'jewanthadheerath@gmail.com',
};

const Meetings = () => {



  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [notificationCount, setNotificationCount] = useState(1);

  const handleNotificationClick = () => {

  };

  return (

    <div className="flex h-screen bg-white-50">
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

        {/* Main content area */}
        <div className="p-6">
          <div className='mb-8'>
            <PageHeader
              user={user}
              notificationCount={notificationCount}
              onNotificationClick={handleNotificationClick}
            />
          </div>


          {/* Meeting Requests */}
          <main className="flex-1 flex items-start justify-center overflow-y-auto">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl mt-4">
              <h2 className="text-3xl font-semibold text-center mb-8">Incoming Client Requests</h2>
              <div className="space-y-6">
                {meetingRequests.map((req, idx) => (
                  <div key={idx} className="border rounded-lg p-5 bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-gray-800">{req.title}</span>
                      <span className="text-xs text-gray-500">{req.date}</span>
                    </div>
                    <div className="text-sm text-gray-700 mb-1">
                      <div><span className="font-semibold">Requested by:</span> {req.requestedBy}</div>
                      <div><span className="font-semibold">Preferred Duration:</span> {req.duration}</div>
                      <div><span className="font-semibold">Notes:</span> {req.notes}</div>
                    </div>
                    <Input1
                      name={`meeting-link-${idx}`}
                      placeholder="Meeting Link or Location"
                      variant="outlined"
                      className="mb-4"
                    />
                    <div className="flex gap-3 justify-end">
                      <Button1 text="Accept" className="w-24" />
                      <Button2 text="Decline" className="w-24" />
                    </div>
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

export default Meetings;