// We need the authenticatedFetch helper. A good way to share it is to export it
// from authService and import it here.
import { authenticatedFetch } from './authService';

/**
 * Sends an invitation to a new user (Junior or Client).
 * This is called by a logged-in Lawyer.
 * @param {object} invitationData - { email, fullName, role, caseId }
 */
export const sendInvitation = async (invitationData) => {
  // This uses the authenticatedFetch helper, ensuring only a logged-in
  // user can call this. The backend will verify they have the 'LAWYER' role.
  return await authenticatedFetch('/api/invitations', {
    method: 'POST',
    body: JSON.stringify(invitationData),
  });
};

/**
 * Finalizes the invitation process for an invited user.
 * This links their new Firebase account to the pre-provisioned user record.
 * @param {string} email
 * @param {string} password
 * @param {string} invitationToken
 * @param {object} profileData - { firstName, lastName }
 */
export const finalizeInvitation = async (email, password, invitationToken, profileData) => {
  // We need to re-import the necessary Firebase functions here
  const { createUserWithEmailAndPassword } = await import('firebase/auth');
  const { auth } = await import('./firebase');

  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const firebaseIdToken = await userCredential.user.getIdToken();

  // This is a special, PUBLIC API call to link the accounts.
  // It does not use authenticatedFetch.
  const response = await fetch('http://localhost:8080/api/invitations/finalize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      invitationToken,
      firebaseIdToken,
      firstName: profileData.firstName,
      lastName: profileData.lastName,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to finalize invitation.');
  }

  // After finalizing, we must log the user in properly by fetching their session info.
  // We can call the authenticatedFetch directly for this final step.
  const backendUser = await authenticatedFetch('/api/auth/session');
  
  // You would typically update your global state here.
  // For now, we just return the user profile.
  return backendUser;
};

/**
 * Optional: A function to get details about a pending invitation.
 * This can be used by the AcceptInvitationPage to pre-fill the email and name.
 * @param {string} invitationToken
 */
export const getInvitationDetails = async (invitationToken) => {
    // This would be a new public endpoint on your backend, e.g., GET /api/invitations/details?token=...
    const response = await fetch(`http://localhost:8080/api/invitations/details?token=${invitationToken}`);
    if (!response.ok) {
        throw new Error("Invalid or expired invitation token.");
    }
    return response.json();
};