import { authenticatedFetch } from './authService'; // adjust if different

/**
 * Create a new meeting request
 * @param {Object} meetingData - The meeting data from the form
 */
export const createMeeting = async (meetingData) => {
  try {
    const response = await authenticatedFetch('/api/meetings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(meetingData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create meeting: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating meeting:', error);
    throw error;
  }
};

/**
 * Get all meetings
 */
export const getAllMeetings = async () => {
  const response = await authenticatedFetch(BASE_URL);
  if (!response.ok) throw new Error('Failed to fetch meetings');
  return response.json();
};

/**
 * Get meetings by date
 */
export const getMeetingsByDate = async (date) => {
  const response = await authenticatedFetch(`${BASE_URL}/by-date?date=${date}`);
  if (!response.ok) throw new Error('Failed to fetch meetings by date');
  return response.json();
};
