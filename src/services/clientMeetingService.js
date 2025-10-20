import { authenticatedFetch } from './authService';

/**
 * Client Meeting Service for handling client-side meeting operations
 * This service is specifically for clients creating and viewing meeting requests
 */

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
export const createClientMeetingRequest = async (meetingData) => {
  try {
    console.log('Creating meeting request:', meetingData);
    
    const response = await authenticatedFetch('/api/meetings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(meetingData)
    });
    
    console.log('Meeting request created:', response);
    return response;
  } catch (error) {
    console.error('Error creating meeting request:', error);
    throw error;
  }
};

/**
 * Gets all meeting requests for the current client
 * Returns only the client's own meeting requests
 */
export const getClientMeetingRequests = async () => {
  try {
    console.log('Fetching client meeting requests...');
    
    const response = await authenticatedFetch('/api/meetings');
    console.log('Client meeting requests:', response);
    
    return response || [];
  } catch (error) {
    console.error('Error fetching client meeting requests:', error);
    throw error;
  }
};

/**
 * Gets meeting request by ID for client
 * @param {string} meetingId - Meeting ID
 */
export const getClientMeetingById = async (meetingId) => {
  try {
    // Since there's no direct GET endpoint, we'll get all meetings and filter
    const allMeetings = await getClientMeetingRequests();
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
 * Transform meeting data for client calendar display
 * @param {Array} meetings - Array of meeting requests from API
 */
export const transformMeetingsForClientCalendar = (meetings) => {
  if (!meetings || !Array.isArray(meetings)) {
    console.warn('transformMeetingsForClientCalendar: No meetings data provided or not an array', meetings);
    return [];
  }

  return meetings.map(meeting => {
    try {
      // Use rescheduled time if available, otherwise use original time
      const date = meeting.rescheduledDate || meeting.meetingDate;
      const startTime = meeting.rescheduledStartTime || meeting.startTime;
      const endTime = meeting.rescheduledEndTime || meeting.endTime;

      // Create proper datetime strings for calendar
      const startDateTime = new Date(`${date}T${startTime}`);
      const endDateTime = new Date(`${date}T${endTime}`);

      // Extract client and lawyer names with safe fallbacks
      const clientName = meeting.client ? 
        `${meeting.client.firstName || ''} ${meeting.client.lastName || ''}`.trim() : 'Client';
      const lawyerName = meeting.lawyer ? 
        `${meeting.lawyer.firstName || ''} ${meeting.lawyer.lastName || ''}`.trim() : 'Lawyer';
      const caseTitle = meeting.aCase ? (meeting.aCase.caseTitle || 'Case') : 'Case';
      const caseNumber = meeting.aCase ? (meeting.aCase.caseNumber || '') : '';

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
          createdAt: meeting.createdAt,
          id: meeting.id
        },
        backgroundColor: getClientMeetingStatusColor(meeting.status),
        borderColor: getClientMeetingStatusColor(meeting.status),
        textColor: '#ffffff'
      };
    } catch (error) {
      console.error('Error transforming meeting for calendar:', meeting, error);
      return null;
    }
  }).filter(Boolean); // Remove any null entries from transformation errors
};

/**
 * Gets calendar color based on meeting status for client view
 * @param {string} status - Meeting status
 */
const getClientMeetingStatusColor = (status) => {
  switch (status?.toUpperCase()) {
    case 'PENDING':
      return '#f59e0b'; // yellow/orange - waiting for lawyer response
    case 'ACCEPTED':
      return '#10b981'; // green - confirmed meeting
    case 'RESCHEDULED':
      return '#3b82f6'; // blue - new time proposed
    case 'REJECTED':
      return '#ef4444'; // red - meeting declined
    default:
      return '#6b7280'; // gray - unknown status
  }
};

/**
 * Gets all calendar events for the client (meetings only)
 * This function combines meetings for calendar display
 */
export const getClientCalendarEvents = async () => {
  try {
    console.log('Loading client calendar events...');
    
    const meetings = await getClientMeetingRequests();
    console.log('Raw client meetings:', meetings);
    
    // Transform meetings for calendar display
    const calendarEvents = transformMeetingsForClientCalendar(meetings);
    console.log('Transformed calendar events:', calendarEvents);
    
    return calendarEvents;
  } catch (error) {
    console.error('Error loading client calendar events:', error);
    throw error;
  }
};

/**
 * Gets events for a specific date
 * @param {Date} date - Date to get events for
 * @param {Array} events - Array of calendar events
 */
export const getEventsForDate = (date, events) => {
  if (!events || !Array.isArray(events)) return [];
  
  return events.filter(event => {
    const eventDate = new Date(event.start);
    return eventDate.toDateString() === date.toDateString();
  });
};

/**
 * Formats meeting data for client display
 * @param {Array} meetings - Array of meeting requests
 */
export const formatMeetingsForClientDisplay = (meetings) => {
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
      statusBadgeClass: getClientStatusBadgeClass(meeting.status),
      lawyerName: meeting.lawyer ? 
        `${meeting.lawyer.firstName || ''} ${meeting.lawyer.lastName || ''}`.trim() : 'Lawyer',
      caseTitle: meeting.aCase?.caseTitle || 'Case',
      caseNumber: meeting.aCase?.caseNumber || ''
    };
  });
};

/**
 * Formats time for display
 * @param {string} time - Time string (HH:mm:ss)
 */
const formatTime = (time) => {
  if (!time) return '';
  try {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  } catch (e) {
    console.warn('Error formatting time:', time, e);
    return time;
  }
};

/**
 * Gets CSS classes for status badges in client view
 * @param {string} status - Meeting status
 */
const getClientStatusBadgeClass = (status) => {
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

/**
 * Gets client meeting statistics
 * @param {Array} meetings - Array of client meetings
 */
export const getClientMeetingStats = (meetings) => {
  if (!meetings || !Array.isArray(meetings)) {
    return {
      total: 0,
      pending: 0,
      accepted: 0,
      rejected: 0,
      rescheduled: 0,
      thisWeek: 0
    };
  }

  const stats = {
    total: meetings.length,
    pending: meetings.filter(m => m.status === 'PENDING').length,
    accepted: meetings.filter(m => m.status === 'ACCEPTED').length,
    rejected: meetings.filter(m => m.status === 'REJECTED').length,
    rescheduled: meetings.filter(m => m.status === 'RESCHEDULED').length,
    thisWeek: 0
  };

  // Calculate this week's meetings
  const today = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  stats.thisWeek = meetings.filter(meeting => {
    const meetingDate = new Date(meeting.rescheduledDate || meeting.meetingDate);
    return meetingDate >= today && meetingDate <= nextWeek;
  }).length;

  return stats;
};

/**
 * Checks if client can create a meeting for the given time slot
 * @param {string} date - Date (YYYY-MM-DD)
 * @param {string} startTime - Start time (HH:mm:ss)
 * @param {string} endTime - End time (HH:mm:ss)
 * @param {Array} existingMeetings - Array of existing meetings
 */
export const checkClientTimeSlotAvailability = (date, startTime, endTime, existingMeetings) => {
  if (!existingMeetings || !Array.isArray(existingMeetings)) return true;

  const newStart = new Date(`${date}T${startTime}`);
  const newEnd = new Date(`${date}T${endTime}`);

  // Check for conflicts with non-rejected meetings
  const hasConflict = existingMeetings.some(meeting => {
    if (meeting.status === 'REJECTED') return false;

    const meetingDate = meeting.rescheduledDate || meeting.meetingDate;
    const meetingStartTime = meeting.rescheduledStartTime || meeting.startTime;
    const meetingEndTime = meeting.rescheduledEndTime || meeting.endTime;

    const existingStart = new Date(`${meetingDate}T${meetingStartTime}`);
    const existingEnd = new Date(`${meetingDate}T${meetingEndTime}`);

    return (newStart < existingEnd && newEnd > existingStart);
  });

  return !hasConflict;
};
