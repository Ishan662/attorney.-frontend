import { authenticatedFetch } from './authService';

/**
 * Initiates a Stripe payment session.
 * @param {object} paymentData - The data for the payment request.
 * @returns {Promise<object>} The response data from the server, including the checkoutUrl.
 */
export const initiateStripePayment = async paymentData => {
  try {
    const response = await authenticatedFetch('/api/payments/initiate', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
    return response;
  } catch (error) {
    console.error('Error initiating payment:', error.message);
    throw new Error('Failed to start payment session.');
  }
};

/**
 * Fetches the total successfully paid amount for a specific case.
 * @param {string} caseId - The UUID of the case.
 * @returns {Promise<object>} An object containing the total paid amount in cents.
 */
export const getTotalPaidForCase = async caseId => {
  try {
    if (!caseId) {
      throw new Error('A case ID is required to fetch the total paid amount.');
    }
    const response = await authenticatedFetch(`/api/payments/total-paid/${caseId}`);
    return response;
  } catch (error) {
    console.error(`Error fetching total paid amount for case ${caseId}:`, error.message);
    throw new Error('Failed to fetch payment summary for the case.');
  }
};

/**
 * Fetches all payments received by the currently logged-in lawyer.
 * @returns {Promise<Array<object>>} A list of payment detail objects.
 */
export const getReceivedPayments = async () => {
  try {
    return await authenticatedFetch('/api/payments/my-received-payments');
  } catch (error) {
    console.error('Failed to fetch received payments:', error.message);
    throw new Error('Could not load payment records.');
  }
};

/**
 * Fetches only the overdue cases for the currently logged-in lawyer.
 * @returns {Promise<Array<object>>} A list of overdue case detail objects.
 */
export const getOverduePayments = async () => {
  try {
    return await authenticatedFetch('/api/payments/my-overdue-payments');
  } catch (error) {
    console.error('Failed to fetch overdue payments:', error.message);
    throw new Error('Could not load overdue payment records.');
  }
};


/**
 * Triggers the backend to send reminder emails for all overdue payments.
 * @returns {Promise<object>} A success message from the server.
 */
export const sendOverdueReminders = async () => {
    try {
        return await authenticatedFetch('/api/payments/send-overdue-reminders', {
            method: 'POST',
        });
    } catch (error) {
        console.error("Failed to send overdue reminders:", error.message);
        throw new Error("Could not send reminder emails.");
    }
};