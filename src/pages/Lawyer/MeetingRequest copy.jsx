import React, { useState } from 'react';
import PageLayout from '../../components/layout/PageLayout';
import Button1 from '../../components/UI/Button1';
import Button2 from '../../components/UI/Button2';
import Input1 from '../../components/UI/Input1';

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

// const user = {
//   name: 'Nishagi Jewantha',
//   email: 'jewanthadheerath@gmail.com',
// };

const Meetings = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter meetings based on search term
  const getFilteredMeetings = () => {
    if (!searchTerm) return meetingRequests;
    
    return meetingRequests.filter(meeting => 
      meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.requestedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.notes.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <PageLayout>
      <div className="p-0">
        {/* Meeting Requests Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Meeting Requests</h1>
        </div>

        {/* Search Section */}
        <div className="mb-6 flex items-center justify-between">
          <div className="relative w-1/3">
            <Input1
              type="text"
              placeholder="Search by title, client name, or notes..."
              value={searchTerm}
              variant="outlined"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Meeting Requests Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {getFilteredMeetings().length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                      MEETING TITLE
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                      REQUESTED BY
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                      DATE & TIME
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                      DURATION
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                      NOTES
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                      MEETING LINK
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-600">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredMeetings().map((meeting, idx) => (
                    <tr key={idx} className="border-b last:border-b-0 hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{meeting.title}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{meeting.requestedBy}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{meeting.date}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{meeting.duration}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700 max-w-xs truncate" title={meeting.notes}>
                          {meeting.notes}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Input1
                          name={`meeting-link-${idx}`}
                          placeholder="Enter meeting link or location"
                          variant="outlined"
                          className="w-full max-w-xs"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <Button1 
                            text="Accept" 
                            className="text-white text-xs py-1 px-3"
                          />
                          <Button2 
                            text="Decline" 
                            className="text-xs py-1 px-3"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? 
                "No meeting requests match your search criteria." : 
                "No meeting requests available."}
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="text-sm text-gray-500 mb-1">Total Requests</div>
            <div className="text-xl font-bold">{meetingRequests.length}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="text-sm text-gray-500 mb-1">Pending Review</div>
            <div className="text-xl font-bold text-orange-600">{meetingRequests.length}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="text-sm text-gray-500 mb-1">This Week</div>
            <div className="text-xl font-bold text-blue-600">
              {meetingRequests.filter(req => {
                const reqDate = new Date(req.date.split(' at ')[0]);
                const today = new Date();
                const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
                return reqDate >= today && reqDate <= nextWeek;
              }).length}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Meetings;