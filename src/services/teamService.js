import { authenticatedFetch } from './authService';

/**
 * Team Service for managing junior lawyers
 */

/**
 * Gets all junior lawyers in the firm
 */
export const getJuniorsForFirm = async () => {
  try {
    const response = await authenticatedFetch('/api/team/juniors');
    return response;
  } catch (error) {
    console.error('Error fetching junior lawyers:', error);
    throw error;
  }
};
