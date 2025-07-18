import React, { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';
import Input1 from '../../components/UI/Input1';
import Button1 from '../../components/UI/Button1';
import PageHeader from '../../components/layout/PageHeader';


const user = {
  name: 'Nishagi Jewantha',
  email: 'jewanthadheerath@gmail.com',
};

const ScheduleMeeting = () => {

  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [notificationCount, setNotificationCount] = useState(1);

  const handleNotificationClick = () => {

  };


  return (
    <div className="flex h-screen bg-gray-100">
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

        {/* Main content area */}
        <div className="p-6">
          <div className='mb-8'>
            <PageHeader
              user={user}
              notificationCount={notificationCount}
              onNotificationClick={handleNotificationClick}
            />
          </div>

          {/* Page Title */}
          <div className="flex flex-col items-center w-full">
            <h1 className="text-2xl font-bold text-gray-800">Schedule Client Meeting</h1>
          </div>

          {/* Centered Form */}
          <main className="flex-1 flex flex-col items-center overflow-y-auto">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl mt-4 mb-6">
              <h2 className="text-xl font-semibold text-center mb-8">Request a Meeting</h2>
              <form>
                <div className="mb-4">
                  <Input1
                    name="clientName"
                    placeholder="e.g., Anura De Mel"
                    label="Client Name"
                    variant="outlined"
                    className="mb-4"
                  />
                </div>
                <div className="mb-4">
                  <Input1
                    name="meetingTitle"
                    placeholder="e.g., Case Review Discussion"
                    label="Meeting Title/Subject"
                    variant="outlined"
                    className="mb-4"
                  />
                </div>
                <div className="flex gap-4 mb-4">
                  <Input1
                    name="date"
                    type="date"
                    label="Date"
                    variant="outlined"
                    className="mb-4"
                  />
                  <Input1
                    name="time"
                    type="time"
                    label="Time"
                    variant="outlined"
                    className="mb-4"
                  />
                </div>
                <div className="mb-4">
                  <Input1
                    name="duration"
                    placeholder=""
                    label="Duration"
                    variant="outlined"
                    className="mb-4"
                  />
                </div>
                <div className="mb-8">
                  <Input1
                    name="agenda"
                    placeholder=""
                    label="Agenda/Notes"
                    multiline
                    rows={4}
                    variant="outlined"
                    className="mb-4"
                  />
                </div>
                <div className="flex justify-center">
                  <Button1 text="Send Meeting Request" className="w-60" />
                </div>
              </form>
            </div>

            {/* Scheduled Meetings */}
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl mb-8">
              <h2 className="text-xl font-semibold text-center mb-4">Scheduled Meetings</h2>
              <p className="text-center text-gray-500">No meetings scheduled yet.</p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ScheduleMeeting;