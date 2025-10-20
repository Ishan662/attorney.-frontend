import React, { useState, useEffect } from 'react';
import PageLayout from '../../components/layout/PageLayout';
import Button1 from '../../components/UI/Button1';
import Button2 from '../../components/UI/Button2';
import Input1 from '../../components/UI/Input1';
import Swal from 'sweetalert2';
import {
  getLawyerMeetingRequests,
  acceptMeetingRequest,
  rejectMeetingRequest,
  rescheduleMeetingRequest,
  transformMeetingsForLawyerView,
  filterMeetingsByStatus,
  getMeetingStatistics,
  checkTimeSlotConflict
} from '../../services/lawyerMeetingService';


const Meetings = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showViewModal, setShowViewModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [actionLoading, setActionLoading] = useState(false);
  
  // Reschedule form states
  const [rescheduleData, setRescheduleData] = useState({
    date: '',
    time: '',
    note: ''
  });

  // Load meeting requests from API
  useEffect(() => {
    loadMeetingRequests();
  }, []);

  const loadMeetingRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading meeting requests...');
      
      const rawMeetings = await getLawyerMeetingRequests();
      console.log('Raw meetings from API:', rawMeetings);
      
      const transformedMeetings = transformMeetingsForLawyerView(rawMeetings);
      console.log('Transformed meetings:', transformedMeetings);
      
      setRequests(transformedMeetings);
    } catch (err) {
      console.error('Error loading meeting requests:', err);
      setError(err.message || 'Failed to load meeting requests');
      
      // Fallback to empty array to prevent crashes
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter meetings based on search term and status
  const getFilteredMeetings = () => {
    let filtered = requests;
    
    // Apply status filter first
    filtered = filterMeetingsByStatus(filtered, statusFilter);
    
    // Apply search term filter
    if (searchTerm) {
      filtered = filtered.filter(meeting => 
        meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meeting.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meeting.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meeting.caseNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  // Handle meeting actions with API calls
  const handleMeetingAction = async (id, action) => {
    if (actionLoading) return; // Prevent multiple simultaneous actions
    
    try {
      setActionLoading(true);
      if (action === 'accept') {
        const result = await Swal.fire({
          icon: 'question',
          title: 'Accept Meeting Request',
          text: 'Are you sure you want to accept this meeting request?',
          showCancelButton: true,
          confirmButtonText: 'Yes, Accept',
          cancelButtonText: 'Cancel',
          confirmButtonColor: '#10B981',
          cancelButtonColor: '#6B7280'
        });

        if (result.isConfirmed) {
          console.log('Accepting meeting:', id);
          await acceptMeetingRequest(id);
          
          // Update local state
          setRequests(prevRequests => 
            prevRequests.map(request => 
              request.id === id ? { ...request, status: 'ACCEPTED' } : request
            )
          );
          setShowViewModal(false);

          Swal.fire({
            icon: 'success',
            title: 'Meeting Accepted',
            text: 'The meeting has been accepted and added to your calendar.',
            timer: 2000,
            showConfirmButton: false
          });
        }
        
      } else if (action === 'decline') {
        const result = await Swal.fire({
          icon: 'warning',
          title: 'Decline Meeting Request',
          text: 'Are you sure you want to decline this meeting request?',
          input: 'textarea',
          inputLabel: 'Reason for declining (optional)',
          inputPlaceholder: 'Please provide a reason for declining this meeting...',
          showCancelButton: true,
          confirmButtonText: 'Yes, Decline',
          cancelButtonText: 'Cancel',
          confirmButtonColor: '#EF4444',
          cancelButtonColor: '#6B7280'
        });

        if (result.isConfirmed) {
          console.log('Rejecting meeting:', id, 'with reason:', result.value);
          
          await rejectMeetingRequest(id, result.value || 'Meeting declined');
          
          // Update local state
          setRequests(prevRequests => 
            prevRequests.map(request => 
              request.id === id ? { ...request, status: 'REJECTED' } : request
            )
          );
          setShowViewModal(false);

          Swal.fire({
            icon: 'success',
            title: 'Meeting Declined',
            text: 'The meeting request has been declined successfully.',
            timer: 2000,
            showConfirmButton: false
          });
        }
        
      } else if (action === 'view') {
        const meetingToView = requests.find(r => r.id === id);
        if (meetingToView) {
          setSelectedMeeting(meetingToView);
          setShowViewModal(true);
        }
        
      } else if (action === 'reschedule') {
        const meetingToReschedule = requests.find(r => r.id === id);
        if (meetingToReschedule) {
          setSelectedMeeting(meetingToReschedule);
          
          // Parse existing date and time for the form
          const originalDate = meetingToReschedule.rescheduledDate || meetingToReschedule.originalDate;
          const originalTime = meetingToReschedule.rescheduledStartTime || meetingToReschedule.originalStartTime;
          
          // Format for HTML inputs
          const formattedDate = originalDate; // Already in YYYY-MM-DD format
          const formattedTime = originalTime ? originalTime.substring(0, 5) : ''; // HH:mm from HH:mm:ss
          
          setRescheduleData({
            date: formattedDate,
            time: formattedTime,
            note: ''
          });
          setShowViewModal(false);
          setShowRescheduleModal(true);
        }
      }
    } catch (err) {
      console.error('Error handling meeting action:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message || 'An error occurred while processing your request.',
        confirmButtonColor: '#3B82F6'
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Handle reschedule form submission
  const handleRescheduleSubmit = async () => {
    if (!rescheduleData.date || !rescheduleData.time) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Information',
        text: 'Please select both date and time for the rescheduled meeting.',
        confirmButtonColor: '#3B82F6'
      });
      return;
    }

    try {
      console.log('Rescheduling meeting:', selectedMeeting.id, 'to:', rescheduleData);
      
      // Check for conflicts with existing meetings
      const hasConflict = checkTimeSlotConflict(
        rescheduleData.date,
        `${rescheduleData.time}:00`,
        `${rescheduleData.time}:00`, // We'll use the same time for now, backend will calculate end time
        requests,
        selectedMeeting.id
      );
      
      if (hasConflict) {
        const result = await Swal.fire({
          icon: 'warning',
          title: 'Schedule Conflict Detected',
          text: 'This time slot conflicts with another meeting. Do you want to proceed anyway?',
          showCancelButton: true,
          confirmButtonText: 'Yes, Proceed',
          cancelButtonText: 'Cancel',
          confirmButtonColor: '#F59E0B',
          cancelButtonColor: '#6B7280'
        });
        
        if (!result.isConfirmed) return;
      }
      
      await rescheduleMeetingRequest(selectedMeeting.id, rescheduleData);
      
      // Update local state
      const updatedDate = `${new Date(rescheduleData.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })} at ${rescheduleData.time}`;
      
      setRequests(prevRequests => 
        prevRequests.map(request => 
          request.id === selectedMeeting.id 
            ? { 
                ...request, 
                date: updatedDate,
                status: 'RESCHEDULED',
                rescheduledDate: rescheduleData.date,
                rescheduledStartTime: `${rescheduleData.time}:00`,
                rescheduleNote: rescheduleData.note
              } 
            : request
        )
      );
      
      setShowRescheduleModal(false);
      setRescheduleData({ date: '', time: '', note: '' });
      
      Swal.fire({
        icon: 'success',
        title: 'Meeting Rescheduled',
        text: 'The meeting has been successfully rescheduled.',
        timer: 2000,
        showConfirmButton: false
      });
      
    } catch (err) {
      console.error('Error rescheduling meeting:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error Rescheduling Meeting',
        text: err.message || 'An error occurred while rescheduling the meeting.',
        confirmButtonColor: '#3B82F6'
      });
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const [date, time] = dateString.split(' at ');
    return { date, time };
  };

  // Get meeting statistics
  const stats = getMeetingStatistics(requests);

  // Loading state
  if (loading) {
    return (
      <PageLayout>
        <div className="p-0">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Meeting Requests</h1>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading meeting requests...</p>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <PageLayout>
        <div className="p-0">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Meeting Requests</h1>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-800 mb-4">
              <svg className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L3.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h3 className="text-lg font-medium">Error Loading Meeting Requests</h3>
            </div>
            <p className="text-red-700 mb-4">{error}</p>
            <Button1
              text="Try Again"
              onClick={() => loadMeetingRequests()}
              className="text-white"
            />
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="p-0">
        {/* Meeting Requests Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Meeting Requests</h1>
        </div>

        {/* Search and Filter Section */}
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
          <div className="flex items-center space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="REJECTED">Rejected</option>
              <option value="RESCHEDULED">Rescheduled</option>
            </select>
            <Button1
              text="Refresh"
              onClick={() => loadMeetingRequests()}
              className="text-white text-sm py-2 px-4"
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
                              ${meeting.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : ''}
                              ${meeting.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' : ''}
                              ${meeting.status === 'REJECTED' ? 'bg-red-100 text-red-800' : ''}
                              ${meeting.status === 'RESCHEDULED' ? 'bg-blue-100 text-blue-800' : ''}
                            `}>
                              {meeting.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center">
                            <Button1 
                              text={
                                meeting.status === 'PENDING' ? 'Manage' :
                                meeting.status === 'RESCHEDULED' ? 'Review' : 'View'
                              }
                              className={`text-white text-xs py-1 px-3 ${
                                meeting.status === 'ACCEPTED' || meeting.status === 'REJECTED' 
                                  ? 'opacity-75' : ''
                              }`}
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="text-sm text-gray-500 mb-1">Total Requests</div>
            <div className="text-xl font-bold">{stats.total}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="text-sm text-gray-500 mb-1">Pending</div>
            <div className="text-xl font-bold text-yellow-600">{stats.pending}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="text-sm text-gray-500 mb-1">Accepted</div>
            <div className="text-xl font-bold text-green-600">{stats.accepted}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="text-sm text-gray-500 mb-1">Rejected</div>
            <div className="text-xl font-bold text-red-600">{stats.rejected}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="text-sm text-gray-500 mb-1">This Week</div>
            <div className="text-xl font-bold text-blue-600">{stats.thisWeek}</div>
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

                <div className="grid grid-cols-1 gap-4 mb-4">
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
                    Case Title
                  </label>
                  <div className="p-2 bg-gray-50 rounded-md text-sm">
                    {selectedMeeting.caseTitle}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <div className="p-2 bg-gray-50 rounded-md text-sm">
                    {selectedMeeting.notes}
                  </div>
                </div>

                {/* Status Display */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Status
                  </label>
                  <div className="flex items-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium
                      ${selectedMeeting.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${selectedMeeting.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' : ''}
                      ${selectedMeeting.status === 'REJECTED' ? 'bg-red-100 text-red-800' : ''}
                      ${selectedMeeting.status === 'RESCHEDULED' ? 'bg-blue-100 text-blue-800' : ''}
                    `}>
                      {selectedMeeting.status}
                    </span>
                    {selectedMeeting.status === 'ACCEPTED' && (
                      <span className="ml-3 text-sm text-gray-600">
                        ✓ This meeting has been accepted and cannot be modified
                      </span>
                    )}
                    {selectedMeeting.status === 'REJECTED' && (
                      <span className="ml-3 text-sm text-gray-600">
                        ✗ This meeting has been rejected and cannot be modified
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  {selectedMeeting.status === 'PENDING' ? (
                    // Show action buttons only for pending meetings
                    <>
                      <Button2
                        text={actionLoading ? "Processing..." : "Decline"}
                        onClick={() => handleMeetingAction(selectedMeeting.id, 'decline')}
                        disabled={actionLoading}
                      />
                      <Button1
                        text={actionLoading ? "Processing..." : "Reschedule"}
                        onClick={() => handleMeetingAction(selectedMeeting.id, 'reschedule')}
                        disabled={actionLoading}
                      />
                      <Button1
                        text={actionLoading ? "Processing..." : "Accept Meeting"}
                        onClick={() => handleMeetingAction(selectedMeeting.id, 'accept')}
                        disabled={actionLoading}
                      />
                    </>
                  ) : selectedMeeting.status === 'RESCHEDULED' ? (
                    // Show limited actions for rescheduled meetings
                    <>
                      <Button2
                        text={actionLoading ? "Processing..." : "Decline"}
                        onClick={() => handleMeetingAction(selectedMeeting.id, 'decline')}
                        disabled={actionLoading}
                      />
                      <Button1
                        text={actionLoading ? "Processing..." : "Accept Meeting"}
                        onClick={() => handleMeetingAction(selectedMeeting.id, 'accept')}
                        disabled={actionLoading}
                      />
                    </>
                  ) : (
                    // Show only close button for accepted/rejected meetings
                    <Button1
                      text="Close"
                      onClick={() => setShowViewModal(false)}
                    />
                  )}
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
                    <div className="flex-1">
                      <div className="font-medium">{selectedMeeting.client.name}</div>
                      <div className="text-sm text-gray-500">{selectedMeeting.title}</div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${selectedMeeting.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${selectedMeeting.status === 'RESCHEDULED' ? 'bg-blue-100 text-blue-800' : ''}
                    `}>
                      {selectedMeeting.status}
                    </span>
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