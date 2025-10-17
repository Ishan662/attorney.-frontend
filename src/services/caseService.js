// >> services/caseService.js

import { authenticatedFetch } from './authService';

// Helper to convert "9 AM" / "10:30 PM" to "HH:mm:ss"
const parseTimeTo24h = (timeStr) => {
  if (!timeStr) return '00:00:00';
  const [time, modifier] = timeStr.split(' ');
  let [hours, minutes] = time.split(':');
  if (!minutes) minutes = '00';
  if (modifier === 'PM' && hours !== '12') hours = String(+hours + 12);
  if (modifier === 'AM' && hours === '12') hours = '00';
  hours = hours.padStart(2, '0');
  return `${hours}:${minutes}:00`;
};

/**
 * Creates a new case in the backend.
 */
export const createCase = async (caseFormData) => {
  const mapPaymentStatus = (status) => {
    switch (status) {
      case 'Paid': return 'PAID_IN_FULL';
      case 'Partially Paid': return 'PARTIALLY_PAID';
      case 'Not Paid': return 'NOT_INVOICED';
      default: return 'NOT_INVOICED';
    }
  };

  const createCaseRequest = {
    clientName: caseFormData.clientName,
    clientPhone: caseFormData.clientPhone,
    clientEmail: caseFormData.clientEmail,
    opposingPartyName: caseFormData.opposingParty,
    associatedJuniorId: caseFormData.junior || null,
    caseNumber: caseFormData.caseNumber,
    court: caseFormData.court,
    courtType: caseFormData.courtType,
    initialHearingDate: caseFormData.date,
    description: caseFormData.description,
    caseType: caseFormData.caseType,
    agreedFee: parseFloat(caseFormData.agreedFee) || 0,
    paymentStatus: mapPaymentStatus(caseFormData.paymentStatus),
  };

  const response = await authenticatedFetch('/api/cases', {
    method: 'POST',
    body: JSON.stringify(createCaseRequest),
  });

  return response.id || response.caseId;
};

export const getJuniorsForFirm = async () => {
  return await authenticatedFetch('/api/team/juniors');
};

export const getMyCases = async () => {
  return await authenticatedFetch('/api/cases');
};

export const getCaseById = async (caseId) => {
  return await authenticatedFetch(`/api/cases/${caseId}`);
};

export const getHearingsForCase = async (caseId) => {
  return await authenticatedFetch(`/api/hearings/by-case/${caseId}`);
};

/**
 * Fetches all hearings for the current lawyer (for calendar display)
 */
export const getAllHearingsForCalendar = async () => {
  return await authenticatedFetch('/api/hearings/my-hearings');
};

export const updateCase = async (caseId, caseData) => {
  return await authenticatedFetch(`/api/cases/${caseId}`, {
    method: 'PUT',
    body: JSON.stringify(caseData),
  });
};

/**
 * Creates a new hearing for a specific case.
 */
export const createHearing = async (caseId, hearingFormData) => {
  const startISO = new Date(`${hearingFormData.date}T${parseTimeTo24h(hearingFormData.startTime)}`).toISOString();
  const endISO = new Date(`${hearingFormData.date}T${parseTimeTo24h(hearingFormData.endTime)}`).toISOString();

  const payload = {
    title: hearingFormData.label,
    hearingDate: startISO,
    startTime: startISO,
    endTime: endISO,
    location: hearingFormData.court || hearingFormData.location,
    participants: hearingFormData.participants || hearingFormData.guests || null,
    note: hearingFormData.specialNote || hearingFormData.note || null,
  };

  return await authenticatedFetch(`/api/hearings/for-case/${caseId}`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

/**
 * Updates an existing hearing.
 */
export const updateHearing = async (hearingId, hearingFormData) => {
  const startISO = new Date(`${hearingFormData.date}T${parseTimeTo24h(hearingFormData.startTime)}`).toISOString();
  const endISO = new Date(`${hearingFormData.date}T${parseTimeTo24h(hearingFormData.endTime)}`).toISOString();

  const payload = {
    title: hearingFormData.label,
    hearingDate: startISO,
    startTime: startISO,
    endTime: endISO,
    location: hearingFormData.court || hearingFormData.location,
    participants: hearingFormData.participants || hearingFormData.guests || null,
    note: hearingFormData.specialNote || hearingFormData.note || null,
    status: hearingFormData.status || null,
  };

  return await authenticatedFetch(`/api/hearings/${hearingId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
};

// Add this function to your existing caseService.js file

/**
 * Fetches cases formatted for calendar dropdown selection
 * @returns {Promise<Array<object>>} Array of cases with calendar-specific formatting
 */
export const getCasesForCalendar = async () => {
    try {
        const cases = await getMyCases(); // Use your existing function
        
        // Transform the data to match your calendar dropdown format
        return cases.map(caseData => ({
            id: caseData.id,
            caseName: caseData.caseTitle || caseData.caseName,
            caseNumber: caseData.caseNumber,
            court: caseData.court,
            courtType: determineCourtType(caseData.court) // Helper function
        }));
    } catch (error) {
        console.error('Error fetching cases for calendar:', error);
        throw error;
    }
};

// Helper function to determine court type from court name
const determineCourtType = (courtName) => {
    if (!courtName) return 'Unknown';
    
    const courtLower = courtName.toLowerCase();
    if (courtLower.includes('high court')) return 'High Court';
    if (courtLower.includes('district court')) return 'District Court';
    if (courtLower.includes('magistrate')) return 'Magistrates Court';
    if (courtLower.includes('supreme court')) return 'Supreme Court';
    
    return 'Other';
};

export const deleteHearing = async (hearingId) => {
  return await authenticatedFetch(`/api/hearings/${hearingId}`, {
    method: 'DELETE',
  });
};
