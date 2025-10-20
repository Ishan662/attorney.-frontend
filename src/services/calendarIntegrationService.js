import { getAllMeetingRequests, transformMeetingsForCalendar } from './meetingRequestService';
import { getClientCalendarEvents as getClientMeetingEvents } from './clientMeetingService';
import { getHearingsForCase, getMyCases } from './caseService';

/**
 * Calendar Integration Service
 * Combines meetings and hearings for calendar display
 */

/**
 * Gets all calendar events for lawyers (meetings + hearings from all firm cases)
 */
export const getLawyerCalendarEvents = async () => {
  try {
    const [meetings, cases] = await Promise.all([
      getAllMeetingRequests(),
      getMyCases() // For lawyers, this returns all firm cases
    ]);

    // Get all hearings from all cases
    const hearingPromises = cases.map(async (caseItem) => {
      try {
        const hearings = await getHearingsForCase(caseItem.id);
        return hearings.map(hearing => ({
          ...hearing,
          caseTitle: caseItem.caseTitle,
          caseNumber: caseItem.caseNumber
        }));
      } catch (error) {
        console.warn(`Failed to load hearings for case ${caseItem.id}:`, error);
        return [];
      }
    });

    const allHearings = (await Promise.allSettled(hearingPromises))
      .filter(result => result.status === 'fulfilled')
      .flatMap(result => result.value);

    // Transform meetings for calendar
    const meetingEvents = transformMeetingsForCalendar(meetings || []);

    // Transform hearings for calendar
    const hearingEvents = transformHearingsForCalendar(allHearings || []);

    return [...meetingEvents, ...hearingEvents];
  } catch (error) {
    console.error('Error loading lawyer calendar events:', error);
    throw error;
  }
};

/**
 * Gets all calendar events for clients (meetings + hearings from their cases)
 */
export const getClientCalendarEvents = async () => {
  try {
    console.log('Loading client calendar events...');
    
    // Get meetings directly from the client service (which uses real API)
    const meetingEvents = await getClientMeetingEvents();
    console.log('Client meeting events:', meetingEvents);
    
    // Get hearings from cases (if available)
    let hearingEvents = [];
    try {
      const cases = await getMyCases();
      console.log('Client cases:', cases);
      
      if (cases && cases.length > 0) {
        const hearingPromises = cases.map(async (caseItem) => {
          try {
            const hearings = await getHearingsForCase(caseItem.id);
            return hearings.map(hearing => ({
              ...hearing,
              caseTitle: caseItem.caseTitle,
              caseNumber: caseItem.caseNumber
            }));
          } catch (error) {
            console.warn(`Failed to load hearings for case ${caseItem.id}:`, error);
            return [];
          }
        });

        const allHearings = (await Promise.allSettled(hearingPromises))
          .filter(result => result.status === 'fulfilled')
          .flatMap(result => result.value);

        hearingEvents = transformHearingsForCalendar(allHearings || []);
        console.log('Client hearing events:', hearingEvents);
      }
    } catch (error) {
      console.warn('Error loading client hearings:', error);
      // Continue without hearings if there's an error
    }

    const allEvents = [...meetingEvents, ...hearingEvents];
    console.log('All client calendar events:', allEvents);
    
    return allEvents;
  } catch (error) {
    console.error('Error loading client calendar events:', error);
    throw error;
  }
};

/**
 * Transforms hearing data for calendar display
 * @param {Array} hearings - Array of hearings
 */
export const transformHearingsForCalendar = (hearings) => {
  if (!hearings || !Array.isArray(hearings)) return [];

  return hearings.map(hearing => {
    const hearingDate = new Date(hearing.hearingDate);
    
    return {
      id: `hearing-${hearing.id}`,
      title: hearing.title || 'Court Hearing',
      start: hearingDate,
      end: new Date(hearingDate.getTime() + (2 * 60 * 60 * 1000)), // Default 2 hours
      allDay: false,
      extendedProps: {
        type: 'hearing',
        status: hearing.status || 'SCHEDULED',
        caseId: hearing.caseId,
        caseTitle: hearing.caseTitle,
        caseNumber: hearing.caseNumber,
        location: hearing.location,
        note: hearing.note,
        hearingType: hearing.hearingType
      },
      backgroundColor: getHearingColor(hearing.status),
      borderColor: getHearingColor(hearing.status),
      textColor: '#ffffff'
    };
  });
};

/**
 * Gets calendar color based on hearing status
 * @param {string} status - Hearing status
 */
const getHearingColor = (status) => {
  switch (status?.toUpperCase()) {
    case 'SCHEDULED':
    case 'PENDING':
      return '#8b5cf6'; // purple
    case 'COMPLETED':
      return '#059669'; // green
    case 'CANCELLED':
      return '#dc2626'; // red
    case 'POSTPONED':
      return '#d97706'; // orange
    default:
      return '#6366f1'; // indigo
  }
};

/**
 * Gets events for a specific date range
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {string} userRole - User role ('LAWYER' or 'CLIENT')
 */
export const getEventsForDateRange = async (startDate, endDate, userRole = 'LAWYER') => {
  try {
    let allEvents;
    
    if (userRole === 'LAWYER') {
      allEvents = await getLawyerCalendarEvents();
    } else {
      allEvents = await getClientCalendarEvents();
    }

    // Filter events within the date range
    return allEvents.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate >= startDate && eventDate <= endDate;
    });
  } catch (error) {
    console.error('Error loading events for date range:', error);
    throw error;
  }
};

/**
 * Gets events for today
 * @param {string} userRole - User role ('LAWYER' or 'CLIENT')
 */
export const getTodayEvents = async (userRole = 'LAWYER') => {
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

  return await getEventsForDateRange(startOfDay, endOfDay, userRole);
};

/**
 * Gets events for current week
 * @param {string} userRole - User role ('LAWYER' or 'CLIENT')
 */
export const getWeekEvents = async (userRole = 'LAWYER') => {
  const today = new Date();
  const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
  const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 6, 23, 59, 59);

  return await getEventsForDateRange(startOfWeek, endOfWeek, userRole);
};

/**
 * Gets events for current month
 * @param {string} userRole - User role ('LAWYER' or 'CLIENT')
 */
export const getMonthEvents = async (userRole = 'LAWYER') => {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);

  return await getEventsForDateRange(startOfMonth, endOfMonth, userRole);
};

/**
 * Formats events for list display
 * @param {Array} events - Array of calendar events
 */
export const formatEventsForList = (events) => {
  if (!events || !Array.isArray(events)) return [];

  return events.map(event => ({
    id: event.id,
    title: event.title,
    type: event.extendedProps.type,
    date: new Date(event.start).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }),
    time: new Date(event.start).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }),
    status: event.extendedProps.status,
    caseTitle: event.extendedProps.caseTitle,
    caseNumber: event.extendedProps.caseNumber,
    location: event.extendedProps.location,
    note: event.extendedProps.note,
    statusBadgeClass: getEventStatusBadgeClass(event.extendedProps.type, event.extendedProps.status),
    typeIcon: getEventTypeIcon(event.extendedProps.type),
    backgroundColor: event.backgroundColor
  }));
};

/**
 * Gets CSS classes for event status badges
 * @param {string} type - Event type ('meeting' or 'hearing')
 * @param {string} status - Event status
 */
const getEventStatusBadgeClass = (type, status) => {
  if (type === 'hearing') {
    switch (status?.toUpperCase()) {
      case 'SCHEDULED':
      case 'PENDING':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'POSTPONED':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    }
  } else {
    // Meeting request
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
  }
};

/**
 * Gets icon for event type
 * @param {string} type - Event type
 */
const getEventTypeIcon = (type) => {
  switch (type) {
    case 'hearing':
      return '⚖️';
    case 'meeting':
      return '📅';
    default:
      return '📌';
  }
};
