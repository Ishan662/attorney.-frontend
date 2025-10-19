/**
 * Custom Hook for Managing Case Additional Details
 * Provides a clean interface for components to interact with specialized case details
 */

import { useState, useCallback } from 'react';
import specializedCaseService from '../services/specializedCaseService';

export const useCaseAdditionalDetails = (caseData) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Updates the additional details for the current case
   * @param {object} newAdditionalDetails - The updated additional details object
   * @returns {Promise<object>} The updated case data
   */
  const updateAdditionalDetails = useCallback(async (newAdditionalDetails) => {
    // Extract caseId from caseData object or use it directly if it's a string
    const caseId = typeof caseData === 'string' ? caseData : caseData?.id;
    
    if (!caseId) {
      throw new Error('Case ID is required to update additional details');
    }

    setIsLoading(true);
    setError(null);

    try {
      // Validate the data before sending
      specializedCaseService.validateAdditionalDetails(newAdditionalDetails);
      
      // Send the update request
      const updatedCase = await specializedCaseService.updateCaseAdditionalDetails(
        caseId, 
        newAdditionalDetails
      );

      setIsLoading(false);
      return updatedCase;
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  }, [caseData]);

  /**
   * Clears any error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    updateAdditionalDetails,
    isLoading,
    error,
    clearError
  };
};

export default useCaseAdditionalDetails;
