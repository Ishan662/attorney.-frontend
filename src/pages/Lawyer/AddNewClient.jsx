import React from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';
import Button1 from '../../components/UI/Button1';
import Button2 from '../../components/UI/Button2';
import Input1 from '../../components/UI/Input1';
import PageHeader from '../../components/layout/PageHeader';

const AddClient = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden pl-64">
        <PageHeader />
        {/* Page Title */}
        <div className="px-10 pt-8 pb-2">
          <h1 className="text-2xl font-bold text-gray-800">Add New Client</h1>
        </div>

        {/* Centered Form */}
        <main className="flex-1 flex items-start justify-center overflow-y-auto">
          <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-xl">
            <h2 className="text-3xl font-semibold text-center mb-8">Enter Client Details</h2>
            <form>
              <div className="mb-5">
                <label className="block text-gray-700 mb-2 font-medium">Client Name</label>
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
              <div className="mb-8">
                <label className="block text-gray-700 mb-2 font-medium">Case Details</label>
                <textarea
                  rows={4}
                  placeholder=""
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
                />
              </div>
              <Button1
                type="submit"
                className="mt-2"
              >
                Save New Client
              </Button1>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddClient;