/**
 * Specialized Case Service
 * Handles API calls for updating specialized case details (e.g., Divorce Details)
 * This service is isolated from the generic CaseService to maintain clean separation of concerns
 */

import { authenticatedFetch } from './authService';

/**
 * Updates the additional details for a specific case
 * @param {string} caseId - The ID of the case to update
 * @param {object} additionalDetails - The complete additionalDetails object to save
 * @returns {Promise<object>} The updated case details from the backend
 */
export const updateCaseAdditionalDetails = async (caseId, additionalDetails) => {
  if (!caseId) {
    throw new Error('Case ID is required');
  }
  
  if (!additionalDetails) {
    throw new Error('Additional details are required');
  }

  try {
    const response = await authenticatedFetch(`/api/cases/${caseId}/additional-details`, {
      method: 'PUT',
      body: JSON.stringify({
        additionalDetails: additionalDetails
      }),
    });

    return response;
  } catch (error) {
    console.error('Failed to update case additional details:', error);
    throw new Error(`Failed to update case details: ${error.message}`);
  }
};

/**
 * Validates the additional details structure before sending to backend
 * @param {object} additionalDetails - The additional details object to validate
 * @returns {boolean} True if valid, throws error if invalid
 */
export const validateAdditionalDetails = (additionalDetails) => {
  if (!additionalDetails || typeof additionalDetails !== 'object') {
    throw new Error('Additional details must be a valid object');
  }

  // Add specific validation rules based on case type if needed
  if (additionalDetails.grounds && additionalDetails.marriageDate) {
    // This appears to be divorce case data
    // Document checklist is optional, can be empty or default
    if (additionalDetails.documentChecklist !== undefined && typeof additionalDetails.documentChecklist !== 'object') {
      throw new Error('Document checklist must be a valid object if provided');
    }
  }

  return true;
};

export default {
  updateCaseAdditionalDetails,
  validateAdditionalDetails,
};
