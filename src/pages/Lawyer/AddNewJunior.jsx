// >> In your existing file: AddJunior.jsx

import React, { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';
import Button1 from '../../components/UI/Button1';
import Button2 from '../../components/UI/Button2';
import Input1 from '../../components/UI/Input1';
import PageHeader from '../../components/layout/PageHeader';
import { useNavigate } from 'react-router-dom';
import { sendInvitation } from '../../services/invitationService'; // Adjust path if needed

const AddJunior = () => {

  const user = {
    name: 'Nishagi Jewantha',
    email: 'jewanthadheerath@gmail.com',
    role: 'lawyer'
  };

  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [notificationCount, setNotificationCount] = useState(1);

  const handleNotificationClick = () => {
    // Original function
  };

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) {
      setFormError('Full name and email are required.');
      return;
    }

    setIsSubmitting(true);
    setFormError('');
    setSuccessMessage('');

    try {
      const invitationData = {
        fullName: formData.fullName,
        email: formData.email,
        role: 'JUNIOR'
      };
      
      await sendInvitation(invitationData);

      setSuccessMessage(`Invitation sent successfully to ${formData.email}!`);
      setFormData({ fullName: '', email: '', phoneNumber: '' }); // Clear the form

    } catch (err) {
      console.error("Failed to send invitation:", err);
      setFormError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
              
              {/* --- ▼▼▼ UPDATE FORM TO BE CONTROLLED BY STATE ▼▼▼ --- */}
              <form onSubmit={handleSubmit}>
                <div className="mb-5">
                  <label className="block text-gray-700 mb-2 font-medium">Junior Lawyer Name</label>
                  <Input1
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g., John Doe"
                    variant="outlined"
                    className="mb-4"
                  />
                </div>
                <div className="mb-5">
                  <label className="block text-gray-700 mb-2 font-medium">Phone Number</label>
                  <Input1
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="e.g., +1234567890"
                    variant="outlined"
                    className="mb-4"
                  />
                </div>
                <div className="mb-5">
                  <label className="block text-gray-700 mb-2 font-medium">Email Address</label>
                  <Input1
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g., john.doe@example.com"
                    variant="outlined"
                    className="mb-4"
                  />
                </div>

                {formError && <p className="text-red-500 text-center my-2">{formError}</p>}
                {successMessage && <p className="text-green-500 text-center my-2">{successMessage}</p>}

                <Button1
                  type="submit"
                  className="mt-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Invitation'}
                </Button1>
              </form>
              {/* --- ▲▲▲ UPDATE FORM TO BE CONTROLLED BY STATE ▲▲▲ --- */}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AddJunior;