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

/**
 * Fetches the subscription details for the currently logged-in user.
 * @returns {Promise<object>} The user's subscription data.
 */
export const getMySubscription = async () => {
  try {
    return await authenticatedFetch('/api/subscriptions/my-subscription');
  } catch (error) {
    console.error('Failed to fetch user subscription:', error.message);
    throw new Error('Could not load subscription details.');
  }
};

/**
 * Sends a request to the backend to cancel the current user's active subscription.
 * @returns {Promise<object>} The confirmation message from the server.
 */
export const cancelMySubscription = async () => {
  try {
    const response = await authenticatedFetch('/api/subscriptions/my-subscription', {
      method: 'DELETE',
    });
    return response;
  } catch (error) {
    console.error('Failed to cancel subscription:', error.message);
    throw new Error('Could not cancel your subscription. Please try again.');
  }
};
