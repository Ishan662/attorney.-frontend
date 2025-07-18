// We need the authenticatedFetch helper. A good way to share it is to export it
// from authService and import it here.
import { authenticatedFetch } from './authService';

/**
 * Sends an invitation to a new user (Junior or Client).
 * This is called by a logged-in Lawyer.
 * @param {object} invitationData - { email, fullName, role, caseId }
 */
export const sendInvitation = async (invitationData) => {
  return await authenticatedFetch('/api/invitations/create-invitation', {
    method: 'POST',
    body: JSON.stringify(invitationData),
  });
};

export const finalizeInvitation = async (email, password, invitationToken, profileData) => {
  const { createUserWithEmailAndPassword } = await import('firebase/auth');
  const { auth } = await import('./firebase');

  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const firebaseIdToken = await userCredential.user.getIdToken();

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
    console.error('Finalize invitation backend error:', errorText);
    throw new Error(errorText || 'Failed to finalize invitation.');
  }

  // Fetch the session using the ID token directly, not authenticatedFetch.
  const sessionResponse = await fetch('http://localhost:8080/api/auth/session', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${firebaseIdToken}`,
    },
  });
  if (!sessionResponse.ok) throw new Error(await sessionResponse.text());
  return sessionResponse.json();
};

export const getInvitationDetails = async (invitationToken) => {
    // This would be a new public endpoint on your backend, e.g., GET /api/invitations/details?token=...
    const response = await fetch(`http://localhost:8080/api/invitations/details?token=${invitationToken}`);
    if (!response.ok) {
        throw new Error("Invalid or expired invitation token.");
    }
    return response.json();
};