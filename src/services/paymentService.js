import { authenticatedFetch } from './authService';

/**
 * Initiates a Stripe payment session.
 * @param {object} paymentData - The data for the payment request.
 * @param {number} paymentData.amount - The amount to pay in cents.
 * @param {string} paymentData.currency - The currency code (e.g., 'usd').
 * @param {string} paymentData.description - A description for the payment.
 * @param {string} paymentData.customerEmail - The email of the customer.
 * @param {string} paymentData.caseId - The UUID of the case.
 * @returns {Promise<object>} The response data from the server, including the checkoutUrl.
 */
export const initiateStripePayment = async paymentData => {
  try {
    const response = await authenticatedFetch('/api/payments/initiate', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
    return response; // This should contain { sessionId, checkoutUrl }
  } catch (error) {
    // Log the error and re-throw it to be handled by the component
    console.error('Error initiating payment:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to start payment session.');
  }
};

/**
 * Fetches the total successfully paid amount for a specific case.
 * @param {string} caseId - The UUID of the case.
 * @returns {Promise<object>} An object containing the total paid amount in cents, e.g., { totalPaidAmount: 50000 }.
 */
export const getTotalPaidForCase = async caseId => {
  try {
    // Ensure caseId is provided to prevent calling a malformed URL
    if (!caseId) {
      throw new Error('A case ID is required to fetch the total paid amount.');
    }
    // Make an authenticated GET request to the new endpoint
    const response = await authenticatedFetch(`/api/payments/total-paid/${caseId}`);
    return response;
  } catch (error) {
    console.error(`Error fetching total paid amount for case ${caseId}:`, error.message);
    // Throw a more generic error for the UI to handle
    throw new Error('Failed to fetch payment summary for the case.');
  }
};
