import React, { useState } from 'react';
import PageLayout from '../../components/layout/PageLayout';
import Button1 from '../../components/UI/Button1';
import Input1 from '../../components/UI/Input1';
import { useNavigate } from 'react-router-dom';

const AddClient = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    clientName: '',
    phone: '',
    email: '',
    caseDetails: ''
  });

  // For consistent layout with other pages
  const user = {
    name: 'Lawyer User',
    email: 'lawyer@example.com',
    role: 'lawyer'
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Client data submitted:', formData);
    // Here you would typically call an API to save the client
    // Then navigate back or show success message
    alert('Client added successfully!');
    navigate('/lawyer/clients');
  };

  return (
    <PageLayout user={user}>
      {/* Page Title */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Add New Client</h1>
        <Button1 
          text="Back to Clients" 
          onClick={() => navigate('/lawyer/clients')} 
          className="px-4"
        />
      </div>

      {/* Centered Form */}
      <div className="flex justify-center">
        <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-xl">
          <h2 className="text-3xl font-semibold text-center mb-8">Enter Client Details</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="block text-gray-700 mb-2 font-medium">Client Name</label>
              <Input1
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                placeholder="e.g., John Doe"
                variant="outlined"
                className="mb-4"
                required
              />
            </div>
            <div className="mb-5">
              <label className="block text-gray-700 mb-2 font-medium">Phone Number</label>
              <Input1
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g., +1234567890"
                variant="outlined"
                className="mb-4"
                required
              />
            </div>
            <div className="mb-5">
              <label className="block text-gray-700 mb-2 font-medium">Email Address</label>
              <Input1
                type="email" // this is the email
                name="email" //this is the name
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g., john.doe@example.com"
                variant="outlined"
                className="mb-4"
                required
              />
            </div>
            <div className="mb-8">
              <label className="block text-gray-700 mb-2 font-medium">Case Details</label>
              <textarea
                name="caseDetails"
                value={formData.caseDetails}
                onChange={handleChange}
                rows={4}
                placeholder="Brief description of client's case"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
              />
            </div>
            <div className="flex justify-center">
              <Button1
                text="Save New Client"
                type="submit"
                className="px-6"
              />
            </div>
          </form>
        </div>
      </div>
    </PageLayout>
  );
};

export default AddClient;