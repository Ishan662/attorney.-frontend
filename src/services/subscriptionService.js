import { authenticatedFetch } from './authService'; // Or your central API client

/**
 * Creates a Stripe checkout session for a subscription plan.
 * @param {number} planId The ID of the plan from your database.
 * @returns {Promise<object>} The response containing the checkout URL.
 */
export const createSubscriptionSession = async planId => {
  try {
    // This calls the POST /api/subscriptions/create-checkout-session endpoint
    const response = await authenticatedFetch('/api/subscriptions/create-checkout-session', {
      method: 'POST',
      body: JSON.stringify({ planId }),
    });
    return response; // Should be { checkoutUrl: "..." }
  } catch (error) {
    console.error('Error creating subscription session:', error.message);
    throw new Error('Could not initiate the subscription process. Please try again.');
  }
};
