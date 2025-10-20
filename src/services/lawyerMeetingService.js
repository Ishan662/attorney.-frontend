import { authenticatedFetch } from './authService';

/**
 * Lawyer Meeting Service for handling lawyer-side meeting operations
 * This service is specifically for lawyers managing incoming meeting requests
 */

/**
 * Get all meeting requests for the lawyer
 * Returns all meeting requests in the lawyer's firm
 */
export const getLawyerMeetingRequests = async () => {
  try {
    const response = await authenticatedFetch('/api/meetings');
    return response;
  } catch (error) {
    console.error('Error fetching lawyer meeting requests:', error);
    throw error;
  }
};

/**
 * Update a meeting request status (LAWYER only)
 * @param {string} meetingId - Meeting ID to update
 * @param {Object} updateData - Update data
 * @param {string} updateData.newStatus - New status (ACCEPTED, RESCHEDULED, REJECTED)
 * @param {string} updateData.rescheduledDate - New date if rescheduling (YYYY-MM-DD)
 * @param {string} updateData.rescheduledStartTime - New start time if rescheduling (HH:mm:ss)
 * @param {string} updateData.rescheduledEndTime - New end time if rescheduling (HH:mm:ss)
 * @param {string} updateData.note - Optional note
 */
export const updateMeetingRequestStatus = async (meetingId, updateData) => {
  try {
    const response = await authenticatedFetch(`/api/meetings/${meetingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData)
    });
    return response;
  } catch (error) {
    console.error('Error updating meeting request:', error);
    throw error;
  }
};

/**
 * Accept a meeting request
 * @param {string} meetingId - Meeting ID to accept
 * @param {string} meetingLink - Optional meeting link or location
 */
export const acceptMeetingRequest = async (meetingId, meetingLink = '') => {
  try {
    const updateData = {
      newStatus: 'ACCEPTED'
    };
    
    if (meetingLink) {
      updateData.note = `Meeting Link: ${meetingLink}`;
    }
    
    const response = await updateMeetingRequestStatus(meetingId, updateData);
    return response;
  } catch (error) {
    console.error('Error accepting meeting request:', error);
    throw error;
  }
};

/**
 * Reject a meeting request
 * @param {string} meetingId - Meeting ID to reject
 * @param {string} reason - Reason for rejection
 */
export const rejectMeetingRequest = async (meetingId, reason = '') => {
  try {
    const updateData = {
      newStatus: 'REJECTED',
      note: reason
    };
    
    const response = await updateMeetingRequestStatus(meetingId, updateData);
    return response;
  } catch (error) {
    console.error('Error rejecting meeting request:', error);
    throw error;
  }
};

/**
 * Reschedule a meeting request
 * @param {string} meetingId - Meeting ID to reschedule
 * @param {Object} rescheduleData - Reschedule data
 * @param {string} rescheduleData.date - New date (YYYY-MM-DD)
 * @param {string} rescheduleData.time - New time (HH:mm)
 * @param {string} rescheduleData.note - Optional note
 * @param {string} rescheduleData.duration - Duration in minutes (default: 60)
 */
export const rescheduleMeetingRequest = async (meetingId, rescheduleData) => {
  try {
    // Convert time to HH:mm:ss format and calculate end time
    const startTime = `${rescheduleData.time}:00`;
    const duration = rescheduleData.duration || 60; // Default 60 minutes
    
    // Calculate end time
    const [hours, minutes] = rescheduleData.time.split(':');
    const startDate = new Date();
    startDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    const endDate = new Date(startDate.getTime() + (duration * 60 * 1000));
    const endTime = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}:00`;
    
    const updateData = {
      newStatus: 'RESCHEDULED',
      rescheduledDate: rescheduleData.date,
      rescheduledStartTime: startTime,
      rescheduledEndTime: endTime,
      note: rescheduleData.note || 'Meeting has been rescheduled'
    };
    
    const response = await updateMeetingRequestStatus(meetingId, updateData);
    return response;
  } catch (error) {
    console.error('Error rescheduling meeting request:', error);
    throw error;
  }
};

/**
 * Transform meeting data for display in the lawyer interface
 * @param {Array} meetings - Array of meeting requests from API
 */
export const transformMeetingsForLawyerView = (meetings) => {
  if (!meetings || !Array.isArray(meetings)) {
    console.warn('transformMeetingsForLawyerView: No meetings data provided or not an array', meetings);
    return [];
  }

  return meetings.map(meeting => {
    try {
      // Extract client and case information with safe fallbacks
      const clientName = meeting.client ? 
        `${meeting.client.firstName || ''} ${meeting.client.lastName || ''}`.trim() : 'Unknown Client';
      const clientInitials = meeting.client ? 
        `${(meeting.client.firstName || 'U').charAt(0)}${(meeting.client.lastName || 'C').charAt(0)}` : 'UC';
      const caseNumber = meeting.aCase ? (meeting.aCase.caseNumber || 'N/A') : 'N/A';
      const caseTitle = meeting.aCase ? (meeting.aCase.caseTitle || 'Unknown Case') : 'Unknown Case';
      
      // Format date and time with safe fallbacks
      const meetingDate = meeting.rescheduledDate || meeting.meetingDate || new Date().toISOString().split('T')[0];
      const startTime = meeting.rescheduledStartTime || meeting.startTime || '09:00:00';
      const endTime = meeting.rescheduledEndTime || meeting.endTime || '10:00:00';
      
      // Format display date
      const displayDate = new Date(meetingDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      
      // Format display time
      const formatTime = (timeStr) => {
        if (!timeStr) return '';
        try {
          const [hours, minutes] = timeStr.split(':');
          const hour = parseInt(hours);
          const ampm = hour >= 12 ? 'PM' : 'AM';
          const displayHour = hour % 12 || 12;
          return `${displayHour}:${minutes} ${ampm}`;
        } catch (e) {
          console.warn('Error formatting time:', timeStr, e);
          return timeStr;
        }
      };
      
      const displayTime = `${formatTime(startTime)}`;
      const fullDateTime = `${displayDate} at ${displayTime}`;
      
      // Calculate duration safely
      let durationMinutes = 60; // Default to 60 minutes
      try {
        const startDateTime = new Date(`${meetingDate}T${startTime}`);
        const endDateTime = new Date(`${meetingDate}T${endTime}`);
        const durationMs = endDateTime - startDateTime;
        durationMinutes = Math.round(durationMs / (1000 * 60));
        if (durationMinutes <= 0) durationMinutes = 60; // Fallback
      } catch (e) {
        console.warn('Error calculating duration:', e);
      }
      
      // Generate client color based on initials
      const colors = [
        'bg-blue-100 text-blue-800',
        'bg-green-100 text-green-800',
        'bg-purple-100 text-purple-800',
        'bg-pink-100 text-pink-800',
        'bg-indigo-100 text-indigo-800',
        'bg-yellow-100 text-yellow-800'
      ];
      const colorIndex = clientInitials.charCodeAt(0) % colors.length;
      
      return {
        id: meeting.id || `temp-${Date.now()}`,
        client: {
          initials: clientInitials,
          name: clientName,
          color: colors[colorIndex]
        },
        title: meeting.title || 'Meeting Request',
        caseNumber: caseNumber,
        caseTitle: caseTitle,
        duration: `${durationMinutes} minutes`,
        notes: meeting.note || meeting.notes || 'No additional notes',
        date: fullDateTime,
        originalDate: meeting.meetingDate,
        originalStartTime: meeting.startTime,
        originalEndTime: meeting.endTime,
        rescheduledDate: meeting.rescheduledDate,
        rescheduledStartTime: meeting.rescheduledStartTime,
        rescheduledEndTime: meeting.rescheduledEndTime,
        status: meeting.status || 'PENDING',
        createdAt: meeting.createdAt,
        rawMeeting: meeting // Keep original data for reference
      };
    } catch (error) {
      console.error('Error transforming meeting:', meeting, error);
      // Return a safe fallback object
      return {
        id: meeting.id || `error-${Date.now()}`,
        client: {
          initials: 'ER',
          name: 'Error Loading Client',
          color: 'bg-red-100 text-red-800'
        },
        title: 'Error Loading Meeting',
        caseNumber: 'ERROR',
        caseTitle: 'Error Loading Case',
        duration: '60 minutes',
        notes: 'Error loading meeting details',
        date: 'Error loading date',
        originalDate: null,
        originalStartTime: null,
        originalEndTime: null,
        rescheduledDate: null,
        rescheduledStartTime: null,
        rescheduledEndTime: null,
        status: 'ERROR',
        createdAt: null,
        rawMeeting: meeting
      };
    }
  });
};

/**
 * Filter meetings by status
 * @param {Array} meetings - Array of transformed meetings
 * @param {string} status - Status to filter by
 */
export const filterMeetingsByStatus = (meetings, status) => {
  if (!status || status === 'ALL') return meetings;
  return meetings.filter(meeting => meeting.status.toUpperCase() === status.toUpperCase());
};

/**
 * Get meeting statistics
 * @param {Array} meetings - Array of transformed meetings
 */
export const getMeetingStatistics = (meetings) => {
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
    const meetingDate = new Date(meeting.rescheduledDate || meeting.originalDate);
    return meetingDate >= today && meetingDate <= nextWeek;
  }).length;

  return stats;
};

/**
 * Check if a time slot conflicts with existing meetings
 * @param {string} date - Date to check (YYYY-MM-DD)
 * @param {string} startTime - Start time (HH:mm:ss)
 * @param {string} endTime - End time (HH:mm:ss)
 * @param {Array} existingMeetings - Array of existing meetings
 * @param {string} excludeMeetingId - Meeting ID to exclude from conflict check
 */
export const checkTimeSlotConflict = (date, startTime, endTime, existingMeetings, excludeMeetingId = null) => {
  if (!existingMeetings || !Array.isArray(existingMeetings)) return false;

  const newStart = new Date(`${date}T${startTime}`);
  const newEnd = new Date(`${date}T${endTime}`);

  return existingMeetings.some(meeting => {
    // Skip the meeting we're rescheduling
    if (excludeMeetingId && meeting.id === excludeMeetingId) return false;
    
    // Skip rejected meetings
    if (meeting.status === 'REJECTED') return false;

    const meetingDate = meeting.rescheduledDate || meeting.originalDate;
    const meetingStartTime = meeting.rescheduledStartTime || meeting.originalStartTime;
    const meetingEndTime = meeting.rescheduledEndTime || meeting.originalEndTime;

    const existingStart = new Date(`${meetingDate}T${meetingStartTime}`);
    const existingEnd = new Date(`${meetingDate}T${meetingEndTime}`);

    // Check if the new meeting overlaps with existing meeting
    return (newStart < existingEnd && newEnd > existingStart);
  });
};
