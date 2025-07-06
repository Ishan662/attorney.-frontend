import React from 'react';
import PageLayout from '../../components/layout/PageLayout';
import Button1 from '../../components/UI/Button1';
import Button2 from '../../components/UI/Button2';

const user = {
  name: 'Nishagi Jewantha',
  email: 'jewanthadheerath@gmail.com',
};

const caseData = {
  number: '#4323',
  name: 'The Estate of Eleanor Vance',
  caseNumber: '2023-PR-00123',
  type: 'Probate',
  status: 'Open',
  description: `This case involves the probate of the estate of Eleanor Vance, including the distribution of assets and resolution of any outstanding debts. The estate includes various properties and financial holdings requiring careful legal oversight.`,
  client: {
    name: 'Alice Johnson (Executor)',
    phone: '+65 345 7382 553',
  },
  opposingParty: 'N/A (Standard Probate)',
  junior: 'Jane Smith',
  financials: {
    agreedFee: '$5,000.00',
    totalExpenses: '$250.00',
    paymentStatus: 'Paid',
    invoice: '$5,250.00',
  },
  hearings: [
    {
      label: 'Initial Hearing',
      date: 'March 15, 2024',
      location: 'Superior Court',
      status: 'Completed',
      note: 'Decision on estate valuation',
    },
    {
      label: 'Next Hearing',
      date: 'July 20, 2024',
      location: 'Superior Court',
      status: 'Planned',
      note: 'Final distribution approval',
    },
    {
      label: 'Document Filing Deadline',
      date: 'June 30, 2024',
      note: 'Required: Final inventory and accounting',
    },
  ],
  timeline: [
    { date: 'Feb 01, 2024', label: "Client Briefing" },
    { date: 'Mar 15, 2024', label: "Initial Hearing" },
    { date: 'Apr 20, 2024', label: "Discovery Phase" },
    { date: 'Jul 20, 2024', label: "Next Hearing" },
  ],
  documents: [
    { name: 'Will of Eleanor Vance.pdf', url: '#' },
    { name: 'Estate Valuation Report.pdf', url: '#' },
    { name: 'Client Correspondence Log.pdf', url: '#' },
  ],
};

const CaseDetails = () => (
  <PageLayout user={user}>
    <div className="mb-2">
      <Button1 text="Back to Cases" to="/lawyer/caseprofile" className="mb-4 underline" inverted={false} />
    </div>
    <h1 className="text-2xl font-semibold mb-6">Case No. {caseData.number}</h1>

    {/* Case Overview */}
    <section className="bg-white rounded-lg p-8 mb-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-6">Case Overview</h2>
      <div className="flex flex-col md:flex-row md:justify-between md:items-start">
        <div className="flex-1">
          <div className="font-semibold">Case Name:</div>
          <div className="mb-2">{caseData.name}</div>
          <div className="font-semibold">Case Number:</div>
          <div className="mb-2">{caseData.caseNumber}</div>
          <div className="font-semibold">Description:</div>
          <div>{caseData.description}</div>
        </div>
        <div className="flex-1 md:ml-12 mt-8 md:mt-0">
          <div className="font-semibold">Case Type:</div>
          <div className="mb-2">{caseData.type}</div>
          <div className="font-semibold">Status:</div>
          <div>
            <span className="inline-block px-4 py-1 rounded-full bg-green-100 text-green-700 font-semibold text-sm">
              {caseData.status}
            </span>
          </div>
        </div>
      </div>
    </section>

    {/* Parties Involved */}
    <section className="bg-white rounded-lg p-8 mb-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-6">Parties Involved</h2>
      <div className="flex flex-col md:flex-row md:justify-between">
        <div className="flex-1 mb-6 md:mb-0">
          <div className="font-semibold">Client:</div>
          <div className="mb-2">{caseData.client.name}</div>
          <div className="font-semibold">Client Phone:</div>
          <div>{caseData.client.phone}</div>
        </div>
        <div className="flex-1 md:ml-12">
          <div className="font-semibold">Opposing Party:</div>
          <div className="mb-2">{caseData.opposingParty}</div>
          <div className="font-semibold">Junior Associated:</div>
          <div>{caseData.junior}</div>
        </div>
      </div>
    </section>

    {/* Financials */}
    <section className="bg-gray-100 rounded-lg p-8 mb-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-6">Financials</h2>
      <div className="flex flex-col md:flex-row md:justify-between">
        <div className="flex-1 mb-6 md:mb-0">
          <div className="font-semibold">Agreed Fee:</div>
          <div className="mb-2">{caseData.financials.agreedFee}</div>
          <div className="font-semibold">Total Expenses:</div>
          <div>{caseData.financials.totalExpenses}</div>
        </div>
        <div className="flex-1 md:ml-12">
          <div className="font-semibold">Payment Status:</div>
          <div className="mb-2">
            <span className="inline-block px-4 py-1 rounded-full bg-green-100 text-green-700 font-semibold text-sm">
              {caseData.financials.paymentStatus}
            </span>
          </div>
          <div className="font-semibold">Invoiced Amount:</div>
          <div>{caseData.financials.invoice}</div>
        </div>
      </div>
    </section>

    {/* Hearings & Key Dates */}
    <section className="bg-white rounded-lg p-8 mb-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-6">Hearings & Key Dates</h2>
      <div className="space-y-2 mb-4">
        {caseData.hearings.map((h, idx) => (
          <div key={idx} className="bg-gray-100 rounded px-3 py-2 text-sm">
            <div>
              <span className="font-medium">{h.label}:</span> {h.date}
              {h.location && <> ({h.location})</>}
            </div>
            {h.status && (
              <div className="text-xs text-gray-500">Status: {h.status}</div>
            )}
            {h.note && (
              <div className="text-xs text-gray-500">Purpose: {h.note}</div>
            )}
          </div>
        ))}
      </div>
      <Button1 text="Add next Hearing Date" className="mt-2" />
    </section>

    {/* Case Progress Timeline */}
    <section className="bg-white rounded-lg p-8 mb-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-6 text-center">Case Progress Timeline</h2>
      <div className="flex items-center justify-between">
        {caseData.timeline.map((t, idx) => (
          <React.Fragment key={idx}>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">{idx + 1}</div>
              <div className="text-xs mt-2 text-gray-700 text-center">{t.date}<br />{t.label}</div>
            </div>
            {idx < caseData.timeline.length - 1 && (
              <div className="flex-1 h-1 bg-orange-200 mx-2" />
            )}
          </React.Fragment>
        ))}
      </div>
    </section>

    {/* Documents */}
    <section className="bg-white rounded-lg p-8 mb-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-6">Documents</h2>
      <ul className="list-disc pl-6 mb-4 text-blue-700">
        {caseData.documents.map((doc, idx) => (
          <li key={idx}>
            <a href={doc.url} className="hover:underline" target="_blank" rel="noopener noreferrer">{doc.name}</a>
          </li>
        ))}
      </ul>
      <Button1 text="Add Documents" className="mt-2" inverted={false} />
    </section>
  </PageLayout>
);

export default CaseDetails;