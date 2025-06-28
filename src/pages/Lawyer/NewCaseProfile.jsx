import React, { useState } from 'react';
import PageLayout from '../../components/layout/PageLayout';
import Input1 from '../../components/UI/Input1';
import Button1 from '../../components/UI/Button1';
import Button2 from '../../components/UI/Button2';

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // For simplicity, hearings/timeline/documents are not dynamic in this starter
  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit logic here
    alert('Case profile submitted!');
  };

  return (
    <PageLayout user={user}>
      <h1 className="text-2xl font-semibold mb-6">Add New Case Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">

        {/* Case Overview */}
        <section className="bg-white rounded-lg p-8 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">New Case</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Input1
              label="Case Name"
              name="caseName"
              value={form.caseName}
              onChange={handleChange}
              required
            />
            <Input1
              label="Case Type"
              name="caseType"
              value={form.caseType}
              onChange={handleChange}
              required
            />
            <Input1
              label="Case Number"
              name="caseNumber"
              value={form.caseNumber}
              onChange={handleChange}
              required
            />
            <Input1
              label="Status"
              name="status"
              value={form.status}
              onChange={handleChange}
              required
            />
          </div>
          <Input1
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
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
              required
            />
            <Input1
              label="Opposing Party"
              name="opposingParty"
              value={form.opposingParty}
              onChange={handleChange}
            />
            <Input1
              label="Client Phone"
              name="clientPhone"
              value={form.clientPhone}
              onChange={handleChange}
              required
            />
            <Input1
              label="Junior Associated"
              name="junior"
              value={form.junior}
              onChange={handleChange}
            />
          </div>
          <div className="flex justify-between mt-4 gap-4">
            <Button1 text="Add New Client" type="button" />
            <Button1 text="Add New Junior Lawyer" type="button" />
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
              required
            />
            <div>
              <label className="block font-semibold mb-1">Payment Status</label>
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
            />
            <Input1
              label="Invoiced Amount"
              name="invoice"
              value={form.invoice}
              onChange={handleChange}
            />
          </div>
        </section>

        {/* Submit Button */}
        <div className="flex justify-end mt-4">
          <Button1 text="Create Case Profile" type="submit" inverted={false} />
        </div>
      </form>
    </PageLayout>
  );
};

export default NewCaseProfile;