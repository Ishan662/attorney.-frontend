import React, { useState } from 'react';
import PageLayout from '../../components/layout/PageLayout';
import Button1 from '../../components/UI/Button1';
import Button2 from '../../components/UI/Button2';
import Input1 from '../../components/UI/Input1';

const meetingRequests = [
  {
    id: 1,
    client: {
      initials: "KJ",
      name: "Kamal J.",
      color: "bg-blue-100 text-blue-800"
    },
    title: 'Billing Inquiry',
    caseNumber: "CIV-2025-0142",
    duration: '30 minutes',
    notes: 'Clarification on recent invoice.',
    date: '2025-06-28 at 11:00',
    status: 'Pending'
  },
  {
    id: 2,
    client: {
      initials: "KJ",
      name: "Kamal J.",
      color: "bg-blue-100 text-blue-800"
    },
    title: 'Follow-up on Case #123',
    caseNumber: "CIV-2025-0143",
    duration: '60 minutes',
    notes: 'Discuss progress and next steps for the ongoing case.',
    date: '2025-07-01 at 10:00',
    status: 'Pending'
  },
  {
    id: 3,
    client: {
      initials: "AD",
      name: "Anura De Mel",
      color: "bg-green-100 text-green-800"
    },
    title: 'Document Review for Civil Suit',
    caseNumber: "CIV-2025-0189",
    duration: '90 minutes',
    notes: 'Review new documents and prepare for upcoming hearing.',
    date: '2025-07-03 at 09:00',
    status: 'Pending'
  },
  {
    id: 4,
    client: {
      initials: "SF",
      name: "S. Fernando",
      color: "bg-purple-100 text-purple-800"
    },
    title: 'New Case Inquiry',
    caseNumber: "CRIM-2025-0076",
    duration: '30 minutes',
    notes: 'Initial discussion about a potential new legal matter.',
    date: '2025-07-05 at 14:30',
    status: 'Pending'
  },
];


// const user = {
//   name: 'Nishagi Jewantha',
//   email: 'jewanthadheerath@gmail.com',
// };


const Meetings = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showViewModal, setShowViewModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [meetingLink, setMeetingLink] = useState("");
  const [requests, setRequests] = useState(meetingRequests);
  
  // Reschedule form states
  const [rescheduleData, setRescheduleData] = useState({
    date: '',
    time: '',
    note: ''
  });

  // Filter meetings based on search term
  const getFilteredMeetings = () => {
    if (!searchTerm) return requests;
    
    return requests.filter(meeting => 
      meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.caseNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Handle meeting actions
  const handleMeetingAction = (id, action) => {
    if (action === 'accept') {
      setRequests(prevRequests => 
        prevRequests.map(request => 
          request.id === id ? { ...request, status: 'Accepted' } : request
        )
      );
      setShowViewModal(false);
    } else if (action === 'decline') {
      setRequests(prevRequests => 
        prevRequests.map(request => 
          request.id === id ? { ...request, status: 'Declined' } : request
        )
      );
      setShowViewModal(false);
    } else if (action === 'view') {
      const meetingToView = requests.find(r => r.id === id);
      if (meetingToView) {
        setSelectedMeeting(meetingToView);
        setMeetingLink("");
        setShowViewModal(true);
      }
    } else if (action === 'reschedule') {
      const meetingToReschedule = requests.find(r => r.id === id);
      if (meetingToReschedule) {
        setSelectedMeeting(meetingToReschedule);
        // Parse existing date and time for the form
        const [date, time] = meetingToReschedule.date.split(' at ');
        const formattedDate = new Date(date).toISOString().split('T')[0];
        setRescheduleData({
          date: formattedDate,
          time: time,
          note: ''
        });
        setShowViewModal(false);
        setShowRescheduleModal(true);
      }
    }
  };

  // Handle reschedule form submission
  const handleRescheduleSubmit = () => {
    if (!rescheduleData.date || !rescheduleData.time) {
      alert('Please select both date and time for the rescheduled meeting.');
      return;
    }

    const updatedDate = `${rescheduleData.date} at ${rescheduleData.time}`;
    
    setRequests(prevRequests => 
      prevRequests.map(request => 
        request.id === selectedMeeting.id 
          ? { 
              ...request, 
              date: updatedDate,
              status: 'Rescheduled',
              rescheduleNote: rescheduleData.note
            } 
          : request
      )
    );
    
    setShowRescheduleModal(false);
    setRescheduleData({ date: '', time: '', note: '' });
    alert('Meeting has been successfully rescheduled.');
  };

  // Format date for display
  const formatDate = (dateString) => {
    const [date, time] = dateString.split(' at ');
    return { date, time };
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
              placeholder="Search by client name, title, case number, or notes..."
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
                      CLIENT NAME
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                      MEETING TITLE
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                      CASE NUMBER
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                      DATE & TIME
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-600">
                      STATUS
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-600">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredMeetings().map((meeting) => {
                    const { date, time } = formatDate(meeting.date);
                    return (
                      <tr key={meeting.id} className="border-b last:border-b-0 hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className={`w-8 h-8 rounded-full ${meeting.client.color} flex items-center justify-center mr-3 text-xs font-medium`}>
                              {meeting.client.initials}
                            </div>
                            <span>{meeting.client.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{meeting.title}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium">{meeting.caseNumber}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{date}</div>
                          <div className="text-xs text-gray-500">{time}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium inline-block
                              ${meeting.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                              ${meeting.status === 'Accepted' ? 'bg-green-100 text-green-800' : ''}
                              ${meeting.status === 'Declined' ? 'bg-red-100 text-red-800' : ''}
                              ${meeting.status === 'Rescheduled' ? 'bg-blue-100 text-blue-800' : ''}
                            `}>
                              {meeting.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center">
                            <Button1 
                              text="View" 
                              className="text-white text-xs py-1 px-3"
                              onClick={() => handleMeetingAction(meeting.id, 'view')}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
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
            <div className="text-xl font-bold">{requests.length}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="text-sm text-gray-500 mb-1">Pending</div>
            <div className="text-xl font-bold text-orange-600">
              {requests.filter(req => req.status === "Pending").length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="text-sm text-gray-500 mb-1">This Week</div>
            <div className="text-xl font-bold text-blue-600">
              {requests.filter(req => {
                const reqDate = new Date(req.date.split(' at ')[0]);
                const today = new Date();
                const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
                return reqDate >= today && reqDate <= nextWeek;
              }).length}
            </div>
          </div>
        </div>

        {/* Meeting Details Modal */}
        {showViewModal && selectedMeeting && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4">
              <div className="border-b px-6 py-4 flex justify-between items-center">
                <h3 className="text-lg font-medium">Meeting Request Details</h3>
                <button 
                  className="text-gray-400 hover:text-gray-500" 
                  onClick={() => setShowViewModal(false)}
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="px-6 py-4">
                {/* Client Information */}
                <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client Information
                  </label>
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full ${selectedMeeting.client.color} flex items-center justify-center mr-3 text-sm font-medium`}>
                      {selectedMeeting.client.initials}
                    </div>
                    <div>
                      <div className="font-medium text-lg">{selectedMeeting.client.name}</div>
                      <div className="text-sm text-gray-500">Client</div>
                    </div>
                  </div>
                </div>

                {/* Meeting Details */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meeting Title
                    </label>
                    <div className="p-2 bg-gray-50 rounded-md text-sm">
                      {selectedMeeting.title}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Case Number
                    </label>
                    <div className="p-2 bg-gray-50 rounded-md text-sm font-medium">
                      {selectedMeeting.caseNumber}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date & Time
                    </label>
                    <div className="p-2 bg-gray-50 rounded-md text-sm">
                      {selectedMeeting.date}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <div className="p-2 bg-gray-50 rounded-md text-sm">
                    {selectedMeeting.notes}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meeting Link or Location
                  </label>
                  <Input1
                    type="text"
                    placeholder="Enter meeting link or location"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    variant="outlined"
                    className="w-full"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Button2
                    text="Decline"
                    onClick={() => handleMeetingAction(selectedMeeting.id, 'decline')}
                  />
                  <Button1
                    text="Reschedule"
                    onClick={() => handleMeetingAction(selectedMeeting.id, 'reschedule')}
                  />
                  <Button1
                    text="Accept Meeting"
                    onClick={() => handleMeetingAction(selectedMeeting.id, 'accept')}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reschedule Meeting Modal */}
        {showRescheduleModal && selectedMeeting && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg mx-4">
              <div className="border-b px-6 py-4 flex justify-between items-center">
                <h3 className="text-lg font-medium">Reschedule Meeting</h3>
                <button 
                  className="text-gray-400 hover:text-gray-500" 
                  onClick={() => setShowRescheduleModal(false)}
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="px-6 py-4">
                {/* Meeting Info */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className={`w-8 h-8 rounded-full ${selectedMeeting.client.color} flex items-center justify-center mr-3 text-xs font-medium`}>
                      {selectedMeeting.client.initials}
                    </div>
                    <div>
                      <div className="font-medium">{selectedMeeting.client.name}</div>
                      <div className="text-sm text-gray-500">{selectedMeeting.title}</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Current Date:</strong> {selectedMeeting.date}
                  </div>
                </div>

                {/* New Date Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Date
                  </label>
                  <Input1
                    type="date"
                    value={rescheduleData.date}
                    onChange={(e) => setRescheduleData({...rescheduleData, date: e.target.value})}
                    variant="outlined"
                    className="w-full"
                    required
                  />
                </div>

                {/* New Time Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Time
                  </label>
                  <Input1
                    type="time"
                    value={rescheduleData.time}
                    onChange={(e) => setRescheduleData({...rescheduleData, time: e.target.value})}
                    variant="outlined"
                    className="w-full"
                    required
                  />
                </div>

                {/* Reschedule Note */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reschedule Note (Optional)
                  </label>
                  <textarea
                    value={rescheduleData.note}
                    onChange={(e) => setRescheduleData({...rescheduleData, note: e.target.value})}
                    placeholder="Add a note explaining the reason for rescheduling..."
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Button2
                    text="Cancel"
                    onClick={() => setShowRescheduleModal(false)}
                  />
                  <Button1
                    text="Confirm Reschedule"
                    onClick={handleRescheduleSubmit}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Meetings;