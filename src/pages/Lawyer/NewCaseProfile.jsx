import React, { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import PageHeader from '../../components/layout/PageHeader';
import Input1 from '../../components/UI/Input1';
import Button1 from '../../components/UI/Button1';
import Button2 from '../../components/UI/Button2';
import { useNavigate } from 'react-router-dom';

const user = {
  name: 'Nishagi Jewantha',
  email: 'jewanthadheerath@gmail.com',
};

const initialState = {
  caseName: '',
  caseNumber: '',
  caseType: '',
  status: '',
  description: '',
  clientName: '',
  clientPhone: '',
  opposingParty: '',
  junior: '',
  agreedFee: '',
  totalExpenses: '',
  paymentStatus: '',
  invoice: '',
  hearings: [
    { label: '', date: '', location: '', note: '' },
  ],
  timeline: [
    { date: '', label: '' },
  ],
  documents: [],
};

const NewCaseProfile = () => {
  const [form, setForm] = useState(initialState);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [notificationCount, setNotificationCount] = useState(1);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // For simplicity, hearings/timeline/documents are not dynamic in this starter
  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit logic here
    alert('Case profile submitted!');
  };

  // Optional: handle notification click
  const handleNotificationClick = () => {
    
  };

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
          <div className="mb-8">
            <PageHeader
              user={user}
              notificationCount={notificationCount}
              onNotificationClick={handleNotificationClick}
            />
          </div>
          {/* Center content with flex and max-width */}
          <div className="flex flex-col items-center w-full">
            <h1 className="text-2xl font-semibold mb-6">Add New Case Profile</h1>
            
            <form onSubmit={handleSubmit} className="space-y-8 w-full max-w-4xl mx-auto">
              {/* Case Overview */}
              <section className="bg-gray-50 rounded-lg p-8 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">New Case</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <Input1
                    label="Case Name"
                    name="caseName"
                    value={form.caseName}
                    onChange={handleChange}
                    placeholder="Case Name"
                    className="mt-2"
                    variant="outlined"
                    required
                  />
                  <Input1
                    label="Case Type"
                    name="caseType"
                    value={form.caseType}
                    onChange={handleChange}
                    placeholder="Type of Case"
                    className="mt-2"
                    variant="outlined"
                    required
                  />
                  <Input1
                    label="Case Number"
                    name="caseNumber"
                    value={form.caseNumber}
                    onChange={handleChange}
                    placeholder="Case Number"
                    className="mt-2"
                    variant="outlined"
                    required
                  />
                  <Input1
                    label="Status"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    placeholder="Case Status"
                    className="mt-2"
                    variant="outlined"
                    required
                  />
                </div>
                <Input1
                  label="Description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Brief description of the case"
                  required
                  className="mt-2"
                  variant="outlined"
                />
              </section>

              {/* Parties Involved */}
              <section className="bg-white rounded-lg p-8 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Parties Involved</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <Input1
                    label="Client"
                    name="clientName"
                    value={form.clientName}
                    onChange={handleChange}
                    placeholder="Client Name"
                    className="mt-2"
                    variant="outlined"
                    required
                  />
                  <Input1
                    label="Opposing Party"
                    name="opposingParty"
                    value={form.opposingParty}
                    onChange={handleChange}
                    placeholder="Opposing Party Name"
                    className="mt-2"
                    variant="outlined"
                  />
                  <Input1
                    label="Client Phone"
                    name="clientPhone"
                    value={form.clientPhone}
                    onChange={handleChange}
                    placeholder="Client Phone Number"
                    className="mt-2"
                    variant="outlined"
                    required
                  />
                  <Input1
                    label="Junior Associated"
                    name="junior"
                    value={form.junior}
                    onChange={handleChange}
                    placeholder="Junior Lawyer Name"
                    className="mt-2"
                    variant="outlined"
                  />
                </div>
                <div className="flex justify-center mt-6 gap-6">
                  <Button1 text="Add New Client" type="button" onClick={() => navigate('/lawyer/addnewclient')} />
                  <Button1 text="Add New Junior Lawyer" onClick={() => navigate('/lawyer/addnewjunior')} type="button" />
                </div>
              </section>

              {/* Financials */}
              <section className="bg-gray-100 rounded-lg p-8 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Financials</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <Input1
                    label="Agreed Fee"
                    name="agreedFee"
                    value={form.agreedFee}
                    onChange={handleChange}
                    placeholder="Agreed Fee Amount"
                    className="mt-2"
                    variant="outlined"
                    required
                  />
                  <div>
                    <label className="block text-sm mb-1">Payment Status</label>
                    <select
                      name="paymentStatus"
                      value={form.paymentStatus}
                      onChange={handleChange}
                      required
                      className="w-full text-md py-3 px-4 rounded-full bg-white border-2 border-gray-300 text-gray-800 placeholder-gray-500 focus:border-black transition-all duration-200 focus:outline-none"
                    >
                      <option value="">Select status</option>
                      <option value="Paid">Paid</option>
                      <option value="Partially Paid">Partially Paid</option>
                      <option value="Not Paid">Not Paid</option>
                    </select>
                  </div>
                  <Input1
                    label="Total Expenses"
                    name="totalExpenses"
                    value={form.totalExpenses}
                    onChange={handleChange}
                    placeholder="Total Expenses Incurred"
                    className="mt-2"
                    variant="outlined"
                  />
                  <Input1
                    label="Invoiced Amount"
                    name="invoice"
                    value={form.invoice}
                    onChange={handleChange}
                    placeholder="Invoice Amount"
                    className="mt-2"
                    variant="outlined"
                  />
                </div>
              </section>

              {/* Submit Button */}
              <div className="flex justify-center mt-6">
                <Button1 text="Create Case Profile" type="submit" className="px-8" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewCaseProfile;