/**
 * Team Management Service for AccountUsers.jsx
 * Handles all API calls related to junior lawyers and clients management
 * Based on the backend endpoints from the test file
 */

import { authenticatedFetch } from './authService';

// ==============================================================================
// JUNIOR LAWYERS MANAGEMENT
// ==============================================================================

/**
 * Get overview of all junior lawyers with salary information
 * Endpoint: GET /api/team/juniors-overview
 */
export const getJuniorsOverview = async () => {
    try {
        const response = await authenticatedFetch('/api/team/juniors-overview', {
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.error('Error fetching juniors overview:', error);
        throw error;
    }
};

/**
 * Get detailed information for a specific junior lawyer including assigned cases
 * Endpoint: GET /api/team/users/{id}/details
 */
export const getJuniorDetails = async (juniorId) => {
    try {
        const response = await authenticatedFetch(`/api/team/users/${juniorId}/details`, {
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.error('Error fetching junior details:', error);
        throw error;
    }
};

/**
 * Update junior lawyer's status (ACTIVE/INACTIVE)
 * Endpoint: PUT /api/team/users/{id}/status
 */
export const updateJuniorStatus = async (juniorId, newStatus) => {
    try {
        const response = await authenticatedFetch(`/api/team/users/${juniorId}/status`, {
            method: 'PUT',
            body: JSON.stringify({
                newStatus: newStatus // "ACTIVE" or "INACTIVE"
            })
        });
        return response;
    } catch (error) {
        console.error('Error updating junior status:', error);
        throw error;
    }
};

/**
 * Set or update junior lawyer's monthly salary
 * Endpoint: PUT /api/team/juniors/{id}/salary
 */
export const updateJuniorSalary = async (juniorId, newMonthlySalary) => {
    try {
        const response = await authenticatedFetch(`/api/team/juniors/${juniorId}/salary`, {
            method: 'PUT',
            body: JSON.stringify({
                newMonthlySalary: parseFloat(newMonthlySalary)
            })
        });
        return response;
    } catch (error) {
        console.error('Error updating junior salary:', error);
        throw error;
    }
};

/**
 * Record a salary payment for a junior lawyer
 * Endpoint: POST /api/team/juniors/{id}/payments
 */
export const recordSalaryPayment = async (juniorId, paymentData) => {
    try {
        const response = await authenticatedFetch(`/api/team/juniors/${juniorId}/payments`, {
            method: 'POST',
            body: JSON.stringify({
                amountPaid: parseFloat(paymentData.amountPaid),
                paymentDate: paymentData.paymentDate, // YYYY-MM-DD format
                notes: paymentData.notes || ''
            })
        });
        return response;
    } catch (error) {
        console.error('Error recording salary payment:', error);
        throw error;
    }
};

// ==============================================================================
// CLIENTS MANAGEMENT
// ==============================================================================

/**
 * Get overview of all clients with case count information
 * Endpoint: GET /api/team/clients-overview
 */
export const getClientsOverview = async () => {
    try {
        const response = await authenticatedFetch('/api/team/clients-overview', {
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.error('Error fetching clients overview:', error);
        throw error;
    }
};

/**
 * Get detailed information for a specific client including assigned cases
 * Endpoint: GET /api/team/users/{id}/details
 */
export const getClientDetails = async (clientId) => {
    try {
        const response = await authenticatedFetch(`/api/team/users/${clientId}/details`, {
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.error('Error fetching client details:', error);
        throw error;
    }
};

/**
 * Update client's status (ACTIVE/INACTIVE)
 * Endpoint: PUT /api/team/users/{id}/status
 */
export const updateClientStatus = async (clientId, newStatus) => {
    try {
        const response = await authenticatedFetch(`/api/team/users/${clientId}/status`, {
            method: 'PUT',
            body: JSON.stringify({
                newStatus: newStatus // "ACTIVE" or "INACTIVE"
            })
        });
        return response;
    } catch (error) {
        console.error('Error updating client status:', error);
        throw error;
    }
};

// ==============================================================================
// UTILITY FUNCTIONS
// ==============================================================================

/**
 * Get user details (works for both juniors and clients)
 * Endpoint: GET /api/team/users/{id}/details
 */
export const getUserDetails = async (userId) => {
    try {
        const response = await authenticatedFetch(`/api/team/users/${userId}/details`, {
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.error('Error fetching user details:', error);
        throw error;
    }
};

/**
 * Update user status (works for both juniors and clients)
 * Endpoint: PUT /api/team/users/{id}/status
 */
export const updateUserStatus = async (userId, newStatus) => {
    try {
        const response = await authenticatedFetch(`/api/team/users/${userId}/status`, {
            method: 'PUT',
            body: JSON.stringify({
                newStatus: newStatus // "ACTIVE" or "INACTIVE"
            })
        });
        return response;
    } catch (error) {
        console.error('Error updating user status:', error);
        throw error;
    }
};

// ==============================================================================
// DATA TRANSFORMATION HELPERS
// ==============================================================================

/**
 * Transform backend junior data to frontend format
 */
export const transformJuniorData = (backendJunior) => {
    return {
        id: backendJunior.id,
        firstName: backendJunior.firstName,
        lastName: backendJunior.lastName,
        name: backendJunior.fullName || backendJunior.name || `${backendJunior.firstName || ''} ${backendJunior.lastName || ''}`.trim(),
        email: backendJunior.email,
        phone: backendJunior.phoneNumber || backendJunior.phone,
        status: backendJunior.status || 'ACTIVE',
        dateAdded: backendJunior.dateAdded || backendJunior.createdAt,
        casesAssigned: backendJunior.casesAssigned || 0,
        assignedCasesCount: backendJunior.assignedCasesCount || backendJunior.casesAssigned || 0,
        court: backendJunior.court || 'N/A',
        location: backendJunior.location || 'N/A',
        avatar: backendJunior.avatar || null,
        salary: {
            amount: backendJunior.monthlySalary || 0,
            lastPaid: backendJunior.lastPaymentDate,
            nextPayment: backendJunior.nextPaymentDate
        }
    };
};

/**
 * Transform backend client data to frontend format
 */
export const transformClientData = (backendClient) => {
    return {
        id: backendClient.id,
        firstName: backendClient.firstName,
        lastName: backendClient.lastName,
        name: backendClient.fullName || backendClient.name || `${backendClient.firstName || ''} ${backendClient.lastName || ''}`.trim(),
        email: backendClient.email,
        phone: backendClient.phoneNumber || backendClient.phone,
        status: backendClient.status || 'ACTIVE',
        dateAdded: backendClient.dateAdded || backendClient.createdAt,
        casesAssigned: backendClient.casesAssigned || 0,
        assignedCasesCount: backendClient.assignedCasesCount || backendClient.casesAssigned || 0,
        court: backendClient.court || 'N/A',
        location: backendClient.location || 'N/A',
        avatar: backendClient.avatar || null
    };
};

/**
 * Format date for payment records (YYYY-MM-DD)
 */
export const formatPaymentDate = (date = new Date()) => {
    if (typeof date === 'string') {
        date = new Date(date);
    }
    return date.toISOString().split('T')[0];
};

/**
 * Generate payment notes based on current date
 */
export const generatePaymentNotes = (month = null, year = null) => {
    const now = new Date();
    const targetMonth = month || now.toLocaleString('default', { month: 'long' });
    const targetYear = year || now.getFullYear();
    return `${targetMonth} ${targetYear} salary payment.`;
};
