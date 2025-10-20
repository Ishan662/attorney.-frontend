import { authenticatedFetch, getFullSession } from './authService';

class ClientDashboardService {
    /**
     * Get upcoming hearings for the current client
     * @returns {Promise<Array>} Array of upcoming hearings
     */
    async getUpcomingHearings() {
        try {
            // Get the user session to get the backend client UUID
            const userSession = await getFullSession();
            if (!userSession || !userSession.id) {
                throw new Error('User session not found or missing client ID');
            }

            const response = await authenticatedFetch(
                `/api/clients/hearings/upcoming?clientId=${userSession.id}`,
                {
                    method: 'GET',
                }
            );

            console.log('Upcoming hearings fetched successfully:', response);
            return response;
        } catch (error) {
            console.error('Error fetching upcoming hearings:', error);
            throw error;
        }
    }

    /**
     * Get upcoming meetings for the current client
     * @returns {Promise<Array>} Array of upcoming meetings
     */
    async getUpcomingMeetings() {
        try {
            const userSession = await getFullSession();
            if (!userSession || !userSession.id) {
                throw new Error('User session not found or missing client ID');
            }

            const response = await authenticatedFetch(
                `/api/clients/meetings/upcoming?clientId=${userSession.id}`,
                {
                    method: 'GET',
                }
            );

            console.log('Upcoming meetings fetched successfully:', response);
            return response;
        } catch (error) {
            console.error('Error fetching upcoming meetings:', error);
            throw error;
        }
    }

    /**
     * Get due payments for the current client
     * @returns {Promise<Array>} Array of due payments
     */
    async getDuePayments() {
        try {
            const userSession = await getFullSession();
            if (!userSession || !userSession.id) {
                throw new Error('User session not found or missing client ID');
            }

            const response = await authenticatedFetch(
                `/api/clients/payments/due?clientId=${userSession.id}`,
                {
                    method: 'GET',
                }
            );

            console.log('Due payments fetched successfully:', response);
            return response;
        } catch (error) {
            console.error('Error fetching due payments:', error);
            throw error;
        }
    }

    /**
     * Format hearing data for display
     * @param {Object} hearing - Hearing object from backend
     * @returns {Object} Formatted hearing object
     */
    formatHearingForDisplay(hearing) {
        return {
            id: hearing.id,
            caseTitle: hearing.title,
            court: hearing.location,
            date: hearing.hearingDate,
            time: this.formatTime(hearing.startTime),
            status: hearing.status,
            displayDate: this.formatDate(hearing.hearingDate),
            note: hearing.note
        };
    }

    /**
     * Format meeting data for display
     * @param {Object} meeting - Meeting object from backend
     * @returns {Object} Formatted meeting object
     */
    formatMeetingForDisplay(meeting) {
        return {
            id: meeting.id,
            lawyerName: meeting.lawyerName || 'Unknown Lawyer',
            date: meeting.meetingDate,
            status: meeting.status,
            displayDate: this.formatDate(meeting.meetingDate),
            time: this.formatTime(meeting.startTime),
            note: meeting.note
        };
    }

    /**
     * Format payment data for display
     * @param {Object} payment - Payment object from backend
     * @returns {Object} Formatted payment object
     */
    formatPaymentForDisplay(payment) {
        return {
            id: payment.id,
            caseName: payment.caseName || payment.description,
            amount: `$${payment.amount}`,
            dueDate: payment.dueDate,
            displayDate: this.formatDate(payment.dueDate),
            status: payment.status
        };
    }

    /**
     * Format time for display
     * @param {string} time - Time string
     * @returns {string} Formatted time
     */
    formatTime(time) {
        if (!time) return '';
        try {
            const [hours, minutes] = time.split(':');
            const date = new Date();
            date.setHours(parseInt(hours), parseInt(minutes));
            return date.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
        } catch (error) {
            console.error('Error formatting time:', error);
            return time;
        }
    }

    /**
     * Format date for display
     * @param {string} date - Date string
     * @returns {string} Formatted date
     */
    formatDate(date) {
        if (!date) return '';
        try {
            return new Date(date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        } catch (error) {
            console.error('Error formatting date:', error);
            return date;
        }
    }
}

export const clientDashboardService = new ClientDashboardService();
export default clientDashboardService;