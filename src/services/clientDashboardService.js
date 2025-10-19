import { authenticatedFetch } from './authService';

/**
 * Client Dashboard Service
 * Handles fetching upcoming hearings and meetings for a client
 */

/**
 * Fetch all upcoming hearings (cases) for a client
 * @param {string} userId - UUID of the client
 * @returns {Promise<Array>} - List of upcoming hearings
 */
export const getUpcomingHearings = async (userId) => {
  try {
    const response = await authenticatedFetch(`/api/client-dashboard/upcoming-cases/${userId}`);
    return response;
  } catch (error) {
    console.error('Error fetching upcoming hearings:', error);
    throw error;
  }
};

/**
 * Fetch all upcoming meetings for a client
 * @param {string} userId - UUID of the client
 * @returns {Promise<Array>} - List of upcoming meetings
 */
export const getUpcomingMeetings = async (userId) => {
  try {
    const response = await authenticatedFetch(`/api/client-dashboard/upcoming-meetings/${userId}`);
    return response;
  } catch (error) {
    console.error('Error fetching upcoming meetings:', error);
    throw error;
  }
};

/**
 * Fetch both hearings and meetings for client dashboard
 * @param {string} userId - UUID of the client
 * @returns {Promise<{hearings: Array, meetings: Array}>}
 */
export const getDashboardData = async (userId) => {
  try {
    const [hearings, meetings] = await Promise.all([
      getUpcomingHearings(userId),
      getUpcomingMeetings(userId),
    ]);

    return { hearings, meetings };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};

/**
 * Optional: fetch a single upcoming hearing by caseId
 * @param {string} userId 
 * @param {string} caseId 
 * @returns {Promise<Object>}
 */
export const getHearingByCaseId = async (userId, caseId) => {
  try {
    const response = await authenticatedFetch(`/api/client-dashboard/upcoming-cases/${userId}`);
    const hearings = response || [];
    return hearings.find(h => h.caseId === caseId) || null;
  } catch (error) {
    console.error('Error fetching hearing by case ID:', error);
    throw error;
  }
};

/**
 * Optional: fetch a single upcoming meeting by meetingId
 * @param {string} userId 
 * @param {string} meetingId 
 * @returns {Promise<Object>}
 */
export const getMeetingById = async (userId, meetingId) => {
  try {
    const response = await authenticatedFetch(`/api/client-dashboard/upcoming-meetings/${userId}`);
    const meetings = response || [];
    return meetings.find(m => m.id === meetingId) || null;
  } catch (error) {
    console.error('Error fetching meeting by ID:', error);
    throw error;
  }
};
