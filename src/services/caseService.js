// services/caseService.js

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

// --------------------- TASKS ---------------------

/**
 * Creates a new task in the backend.
 */
export const createTask = async (taskFormData) => {
  const startISO = new Date(`${taskFormData.date}T${parseTimeTo24h(taskFormData.startTime)}`).toISOString();
  const endISO = new Date(`${taskFormData.date}T${parseTimeTo24h(taskFormData.endTime)}`).toISOString();

  const payload = {
    title: taskFormData.title,
    description: taskFormData.note || taskFormData.description,
    startTime: startISO,
    endTime: endISO,
    location: taskFormData.location,
    status: 'PENDING', // Default status for new tasks
    priority: taskFormData.priority || 'MEDIUM'
  };

  return await authenticatedFetch('/api/calendar/tasks', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

/**
 * Fetches all tasks for the current user (for calendar display)
 */
export const getAllTasksForCalendar = async () => {
  return await authenticatedFetch('/api/calendar/tasks/my-tasks');
};

/**
 * Updates an existing task.
 */
export const updateTask = async (taskId, taskFormData) => {
  const startISO = new Date(`${taskFormData.date}T${parseTimeTo24h(taskFormData.startTime)}`).toISOString();
  const endISO = new Date(`${taskFormData.date}T${parseTimeTo24h(taskFormData.endTime)}`).toISOString();

  const payload = {
    title: taskFormData.title,
    description: taskFormData.note || taskFormData.description,
    startTime: startISO,
    endTime: endISO,
    location: taskFormData.location,
    status: taskFormData.status || 'PENDING',
    priority: taskFormData.priority || 'MEDIUM'
  };

  return await authenticatedFetch(`/api/calendar/tasks/${taskId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
};

/**
 * Deletes a task.
 */
export const deleteTask = async (taskId) => {
  return await authenticatedFetch(`/api/calendar/tasks/${taskId}`, {
    method: 'DELETE',
  });
};

// --------------------- HEARINGS ---------------------

/**
 * Creates a new hearing for a case.
 */
export const createHearing = async (caseId, hearingFormData) => {
  const startISO = new Date(`${hearingFormData.date}T${parseTimeTo24h(hearingFormData.startTime || hearingFormData.time)}`).toISOString();
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

  return await authenticatedFetch(`/api/hearings/for-case/${caseId}`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

/**
 * Updates an existing hearing.
 */
export const updateHearing = async (hearingId, hearingFormData) => {
  const startISO = new Date(`${hearingFormData.date}T${parseTimeTo24h(hearingFormData.startTime || hearingFormData.time)}`).toISOString();
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

/**
 * Deletes a hearing.
 */
export const deleteHearing = async (hearingId) => {
  return await authenticatedFetch(`/api/hearings/${hearingId}`, {
    method: 'DELETE',
  });
};

/**
 * Fetches all hearings for the current lawyer (for calendar display)
 * This function gets all cases first, then fetches hearings for each case
 */
export const getAllHearingsForCalendar = async () => {
  try {
    // First get all cases for the current user
    const cases = await getMyCases();
    
    // Then get hearings for each case
    const allHearingsPromises = cases.map(caseItem => 
      getHearingsForCase(caseItem.id).catch(error => {
        console.warn(`Failed to fetch hearings for case ${caseItem.id}:`, error);
        return []; // Return empty array if hearings fetch fails for a case
      })
    );
    
    const allHearingsArrays = await Promise.all(allHearingsPromises);
    
    // Flatten the array of arrays into a single array
    const allHearings = allHearingsArrays.flat();
    
    return allHearings;
  } catch (error) {
    console.error('Error fetching all hearings for calendar:', error);
    throw error;
  }
};

/**
 * Fetches cases formatted for calendar dropdown selection
 */
export const getCasesForCalendar = async () => {
  return await authenticatedFetch('/api/cases');
};

/**
 * Fetches all cases for the current user
 */
export const getMyCases = async () => {
  return await authenticatedFetch('/api/cases');
};

/**
 * Fetches a specific case by ID
 */
export const getCaseById = async (caseId) => {
  return await authenticatedFetch(`/api/cases/${caseId}`);
};

/**
 * Fetches hearings for a specific case
 */
export const getHearingsForCase = async (caseId) => {
  return await authenticatedFetch(`/api/hearings/by-case/${caseId}`);
};

/**
 * Creates a new case in the backend
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

  return await authenticatedFetch('/api/cases', {
    method: 'POST',
    body: JSON.stringify(createCaseRequest),
  });
};

/**
 * Updates an existing case
 */
export const updateCase = async (caseId, caseData) => {
  return await authenticatedFetch(`/api/cases/${caseId}`, {
    method: 'PUT',
    body: JSON.stringify(caseData),
  });
};

/**
 * Fetches junior lawyers for the firm
 */
export const getJuniorsForFirm = async () => {
  return await authenticatedFetch('/api/juniors/for-firm');
};

export const validateNewHearingTravel = async (newHearingData) => {
    return await authenticatedFetch('/api/calendar/validate-travel', {
        method: 'POST',
        body: JSON.stringify(newHearingData),
    });
};

// --------------------- CALENDAR VALIDATION ---------------------

/**
 * Validates a new hearing before creating it
 */
export const validateHearing = async (hearingFormData) => {
  const startISO = new Date(`${hearingFormData.date}T${parseTimeTo24h(hearingFormData.startTime || hearingFormData.time)}`).toISOString();
  const endISO = new Date(`${hearingFormData.date}T${parseTimeTo24h(hearingFormData.endTime)}`).toISOString();

  const payload = {
    startTime: startISO,
    endTime: endISO,
    location: hearingFormData.location || hearingFormData.court,
    title: hearingFormData.label || hearingFormData.title
  };

  return await authenticatedFetch('/api/calendar/validate/hearing', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

/**
 * Validates a new task before creating it
 */
export const validateTask = async (taskFormData) => {
  const startISO = new Date(`${taskFormData.date}T${parseTimeTo24h(taskFormData.startTime)}`).toISOString();
  const endISO = new Date(`${taskFormData.date}T${parseTimeTo24h(taskFormData.endTime)}`).toISOString();

  const payload = {
    title: taskFormData.title,
    description: taskFormData.note || taskFormData.description,
    startTime: startISO,
    endTime: endISO,
    location: taskFormData.location,
    priority: taskFormData.priority || 'MEDIUM'
  };

  return await authenticatedFetch('/api/calendar/validate/task', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};
