import { authenticatedFetch } from './authService';
import { getMockMeetingRequests, createMockMeetingRequest, updateMockMeetingRequest } from './testMeetingData';

/**
 * Meeting Request Service for backend integration
 * Handles meeting requests workflow between clients and lawyers
 */

// Set to true to use mock data for development/testing
const USE_MOCK_DATA = false;

/**
 * Creates a new meeting request (CLIENT only)
 * @param {Object} meetingData - Meeting request data
 * @param {string} meetingData.caseId - Case ID for the meeting
 * @param {string} meetingData.title - Meeting title
 * @param {string} meetingData.meetingDate - Meeting date (YYYY-MM-DD)
 * @param {string} meetingData.startTime - Start time (HH:mm:ss)
 * @param {string} meetingData.endTime - End time (HH:mm:ss)
 * @param {string} meetingData.note - Optional note
 */
export const createMeetingRequest = async (meetingData) => {
  try {
    if (USE_MOCK_DATA) {
      return await createMockMeetingRequest(meetingData);
    }
    
    const response = await authenticatedFetch('/api/meetings', {
      method: 'POST',
      body: JSON.stringify(meetingData)
    });
    return response;
  } catch (error) {
    console.error('Error creating meeting request:', error);
    throw error;
  }
};

/**
 * Gets all meeting requests for the current user
 * - For LAWYERS: Returns all meeting requests in their firm
 * - For CLIENTS: Returns only their own meeting requests
 */
export const getAllMeetingRequests = async () => {
  try {
    if (USE_MOCK_DATA) {
      return await getMockMeetingRequests();
    }
    
    const response = await authenticatedFetch('/api/meetings');
    return response;
  } catch (error) {
    console.error('Error fetching meeting requests:', error);
    throw error;
  }
};

/**
 * Updates a meeting request status (LAWYER only)
 * @param {string} meetingId - Meeting ID to update
 * @param {Object} updateData - Update data
 * @param {string} updateData.newStatus - New status (ACCEPTED, RESCHEDULED, REJECTED)
 * @param {string} updateData.rescheduledDate - New date if rescheduling (YYYY-MM-DD)
 * @param {string} updateData.rescheduledStartTime - New start time if rescheduling (HH:mm:ss)
 * @param {string} updateData.rescheduledEndTime - New end time if rescheduling (HH:mm:ss)
 * @param {string} updateData.note - Optional note
 */
export const updateMeetingRequest = async (meetingId, updateData) => {
  try {
    if (USE_MOCK_DATA) {
      return await updateMockMeetingRequest(meetingId, updateData);
    }
    
    const response = await authenticatedFetch(`/api/meetings/${meetingId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });
    return response;
  } catch (error) {
    console.error('Error updating meeting request:', error);
    throw error;
  }
};

/**
 * Gets meeting request by ID
 * @param {string} meetingId - Meeting ID
 */
export const getMeetingRequestById = async (meetingId) => {
  try {
    // Since there's no direct GET endpoint, we'll get all meetings and filter
    const allMeetings = await getAllMeetingRequests();
    const meeting = allMeetings.find(m => m.id === meetingId);
    if (!meeting) {
      throw new Error('Meeting not found');
    }
    return meeting;
  } catch (error) {
    console.error('Error fetching meeting request:', error);
    throw error;
  }
};

/**
 * Accepts a meeting request (LAWYER only)
 * @param {string} meetingId - Meeting ID to accept
 */
export const acceptMeetingRequest = async (meetingId) => {
  try {
    const response = await updateMeetingRequest(meetingId, {
      newStatus: 'ACCEPTED'
    });
    return response;
  } catch (error) {
    console.error('Error accepting meeting request:', error);
    throw error;
  }
};

/**
 * Rejects a meeting request (LAWYER only)
 * @param {string} meetingId - Meeting ID to reject
 * @param {string} note - Optional rejection note
 */
export const rejectMeetingRequest = async (meetingId, note = '') => {
  try {
    const response = await updateMeetingRequest(meetingId, {
      newStatus: 'REJECTED',
      note
    });
    return response;
  } catch (error) {
    console.error('Error rejecting meeting request:', error);
    throw error;
  }
};

/**
 * Reschedules a meeting request (LAWYER only)
 * @param {string} meetingId - Meeting ID to reschedule
 * @param {Object} rescheduleData - Reschedule data
 * @param {string} rescheduleData.date - New date (YYYY-MM-DD)
 * @param {string} rescheduleData.startTime - New start time (HH:mm:ss)
 * @param {string} rescheduleData.endTime - New end time (HH:mm:ss)
 * @param {string} rescheduleData.note - Optional note
 */
export const rescheduleMeetingRequest = async (meetingId, rescheduleData) => {
  try {
    const response = await updateMeetingRequest(meetingId, {
      newStatus: 'RESCHEDULED',
      rescheduledDate: rescheduleData.date,
      rescheduledStartTime: rescheduleData.startTime,
      rescheduledEndTime: rescheduleData.endTime,
      note: rescheduleData.note || ''
    });
    return response;
  } catch (error) {
    console.error('Error rescheduling meeting request:', error);
    throw error;
  }
};

/**
 * Transforms meeting request data for calendar display
 * @param {Array} meetings - Array of meeting requests
 */
export const transformMeetingsForCalendar = (meetings) => {
  if (!meetings || !Array.isArray(meetings)) return [];

  return meetings.map(meeting => {
    // Use rescheduled time if available, otherwise use original time
    const date = meeting.rescheduledDate || meeting.meetingDate;
    const startTime = meeting.rescheduledStartTime || meeting.startTime;
    const endTime = meeting.rescheduledEndTime || meeting.endTime;

    // Create proper datetime strings for calendar
    const startDateTime = new Date(`${date}T${startTime}`);
    const endDateTime = new Date(`${date}T${endTime}`);

    // Extract client and lawyer names from the new API format
    const clientName = meeting.client ? `${meeting.client.firstName} ${meeting.client.lastName}` : meeting.clientName || 'Client';
    const lawyerName = meeting.lawyer ? `${meeting.lawyer.firstName} ${meeting.lawyer.lastName}` : meeting.lawyerName || 'Lawyer';
    const caseTitle = meeting.aCase ? meeting.aCase.caseTitle : meeting.caseTitle || 'Case';
    const caseNumber = meeting.aCase ? meeting.aCase.caseNumber : meeting.caseNumber || '';

    return {
      id: meeting.id,
      title: meeting.title || 'Meeting Request',
      start: startDateTime,
      end: endDateTime,
      allDay: false,
      type: 'meeting',
      extendedProps: {
        type: 'meeting',
        status: meeting.status || 'PENDING',
        caseId: meeting.aCase?.id || meeting.caseId,
        caseTitle: caseTitle,
        caseNumber: caseNumber,
        note: meeting.note,
        originalDate: meeting.meetingDate,
        originalStartTime: meeting.startTime,
        originalEndTime: meeting.endTime,
        rescheduledDate: meeting.rescheduledDate,
        rescheduledStartTime: meeting.rescheduledStartTime,
        rescheduledEndTime: meeting.rescheduledEndTime,
        clientName: clientName,
        lawyerName: lawyerName,
        createdAt: meeting.createdAt
      },
      backgroundColor: getStatusColor(meeting.status),
      borderColor: getStatusColor(meeting.status),
      textColor: '#ffffff'
    };
  });
};

/**
 * Gets calendar color based on meeting status
 * @param {string} status - Meeting status
 */
const getStatusColor = (status) => {
  switch (status?.toUpperCase()) {
    case 'PENDING':
      return '#f59e0b'; // yellow
    case 'ACCEPTED':
      return '#10b981'; // green
    case 'RESCHEDULED':
      return '#3b82f6'; // blue
    case 'REJECTED':
      return '#ef4444'; // red
    default:
      return '#6b7280'; // gray
  }
};

/**
 * Checks if a time slot conflicts with existing meetings
 * @param {string} date - Date to check (YYYY-MM-DD)
 * @param {string} startTime - Start time (HH:mm:ss)
 * @param {string} endTime - End time (HH:mm:ss)
 * @param {Array} existingMeetings - Array of existing meetings
 */
export const checkTimeSlotConflict = (date, startTime, endTime, existingMeetings) => {
  if (!existingMeetings || !Array.isArray(existingMeetings)) return false;

  const newStart = new Date(`${date}T${startTime}`);
  const newEnd = new Date(`${date}T${endTime}`);

  return existingMeetings.some(meeting => {
    if (meeting.status === 'REJECTED') return false; // Ignore rejected meetings

    const meetingDate = meeting.rescheduledDate || meeting.meetingDate;
    const meetingStartTime = meeting.rescheduledStartTime || meeting.startTime;
    const meetingEndTime = meeting.rescheduledEndTime || meeting.endTime;

    const existingStart = new Date(`${meetingDate}T${meetingStartTime}`);
    const existingEnd = new Date(`${meetingDate}T${meetingEndTime}`);

    // Check if the new meeting overlaps with existing meeting
    return (newStart < existingEnd && newEnd > existingStart);
  });
};

/**
 * Formats meeting data for display in lists/tables
 * @param {Array} meetings - Array of meeting requests
 */
export const formatMeetingsForDisplay = (meetings) => {
  if (!meetings || !Array.isArray(meetings)) return [];

  return meetings.map(meeting => {
    const date = meeting.rescheduledDate || meeting.meetingDate;
    const startTime = meeting.rescheduledStartTime || meeting.startTime;
    const endTime = meeting.rescheduledEndTime || meeting.endTime;

    return {
      ...meeting,
      displayDate: new Date(date).toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      displayTime: `${formatTime(startTime)} - ${formatTime(endTime)}`,
      isRescheduled: Boolean(meeting.rescheduledDate),
      statusBadgeClass: getStatusBadgeClass(meeting.status)
    };
  });
};

/**
 * Formats time for display
 * @param {string} time - Time string (HH:mm:ss)
 */
const formatTime = (time) => {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

/**
 * Gets CSS classes for status badges
 * @param {string} status - Meeting status
 */
const getStatusBadgeClass = (status) => {
  switch (status?.toUpperCase()) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'ACCEPTED':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'RESCHEDULED':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'REJECTED':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};
