import React, {useState} from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';
import Button1 from '../../components/UI/Button1';
import Button2 from '../../components/UI/Button2';
import Input1 from '../../components/UI/Input1';
import PageHeader from '../../components/layout/PageHeader';
import {useNavigate} from 'react-router-dom';

const AddJunior = () => {

  const user = {
    name: 'Nishagi Jewantha',
    email: 'jewanthadheerath@gmail.com',
    role: 'lawyer'
  };

  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [notificationCount, setNotificationCount] = useState(1);

  const handleNotificationClick = () => {

  };

  const navigate = useNavigate();

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
            <h1 className="text-2xl font-bold text-gray-800">Add New Junior</h1>
          </div>

          {/* Centered Form */}
          <main className="flex-1 flex items-start justify-center overflow-y-auto">
            <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-xl">
              <h2 className="text-3xl font-semibold text-center mb-8">Enter Junior Lawyer Details</h2>
              <form
              onSubmit={e => {
                e.preventDefault();
                // Handle form submission logic here
                navigate('/lawyer/newcaseprofile');
              }}>
                <div className="mb-5">
                  <label className="block text-gray-700 mb-2 font-medium">Junior Lawyer Name</label>
                  <Input1
                    type="text"
                    placeholder="e.g., John Doe"
                    variant="outlined"
                    className="mb-4"
                  />
                </div>
                <div className="mb-5">
                  <label className="block text-gray-700 mb-2 font-medium">Phone Number</label>
                  <Input1
                    type="text"
                    placeholder="e.g., +1234567890"
                    variant="outlined"
                    className="mb-4"
                  />
                </div>
                <div className="mb-5">
                  <label className="block text-gray-700 mb-2 font-medium">Email Address</label>
                  <Input1
                    type="email"
                    placeholder="e.g., john.doe@example.com"
                    variant="outlined"
                    className="mb-4"
                  />
                </div>

                <Button1
                  type="submit"
                  className="mt-2"
                >
                  Save New Junior Lawyer
                </Button1>
              </form>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AddJunior;