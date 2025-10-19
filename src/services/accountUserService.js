import { authenticatedFetch } from './authService';

/**
 * Service specifically for AccountUsers.jsx operations
 * This handles junior lawyer invitations from the Account Users page
 */

/**
 * Sends an invitation to a junior lawyer from the Account Users page
 * @param {object} userData - { name, email, phone }
 */
export const sendJuniorLawyerInvitation = async (userData) => {
  // Match the exact InviteUserRequest DTO structure with correct AppRole enum
  const invitationData = {
    email: userData.email,              // String
    fullName: userData.name,            // String  
    role: "JUNIOR",                     // AppRole enum - correct value from backend
    phoneNumber: userData.phone,        // String (backend has this field!)
    caseId: null                       // UUID - null for junior lawyers
  };
  
  try {
    console.log('🚀 Sending junior lawyer invitation (correct JUNIOR role):', JSON.stringify(invitationData, null, 2));
    const response = await authenticatedFetch('/api/invitations/create-invitation', {
      method: 'POST',
      body: JSON.stringify(invitationData),
    });
    
    console.log('✅ Invitation sent successfully:', response);
    return response;
  } catch (error) {
    console.error('❌ Error sending junior lawyer invitation:', error);
    console.error('❌ Request data was:', JSON.stringify(invitationData, null, 2));
    throw error;
  }
};

/**
 * Alternative function - without phoneNumber in case it's causing issues
 * @param {object} userData - { name, email, phone }
 */
export const sendJuniorLawyerInvitationAlt = async (userData) => {
  // Try without phoneNumber in case it's causing validation issues
  const invitationData = {
    email: userData.email,
    fullName: userData.name,
    role: "JUNIOR",                     // Correct AppRole enum value
    caseId: null                       // null for junior lawyers
    // phoneNumber omitted
  };
  
  try {
    console.log('🔄 Trying without phoneNumber:', JSON.stringify(invitationData, null, 2));
    const response = await authenticatedFetch('/api/invitations/create-invitation', {
      method: 'POST',
      body: JSON.stringify(invitationData),
    });
    
    console.log('✅ SUCCESS without phoneNumber:', response);
    return response;
  } catch (error) {
    console.error('❌ Failed without phoneNumber:', error);
    throw error;
  }
};
