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
                `/api/clients/hearings/upcoming-meetings?clientId=${userSession.id}`,
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
     * @param {Object} hearing - Hearing object from backend (HearingDTO)
     * @returns {Object} Formatted hearing object
     */
    formatHearingForDisplay(hearing) {
        return {
            id: hearing.id,
            caseId: hearing.caseId,
            caseTitle: hearing.caseTitle || hearing.title || 'Unknown Case',
            court: hearing.location || 'Location TBD',
            date: hearing.hearingDate,
            startTime: hearing.startTime,
            endTime: hearing.endTime,
            time: this.formatTimeRange(hearing.startTime, hearing.endTime),
            status: hearing.status || 'SCHEDULED',
            displayDate: this.formatDate(hearing.hearingDate),
            note: hearing.note || '',
            title: hearing.title || 'Hearing'
        };
    }

    /**
     * Format time range for display
     * @param {string} startTime - Start time string
     * @param {string} endTime - End time string
     * @returns {string} Formatted time range
     */
    formatTimeRange(startTime, endTime) {
        if (!startTime && !endTime) return 'Time TBD';
        
        const start = startTime ? this.formatTime(startTime) : '';
        const end = endTime ? this.formatTime(endTime) : '';
        
        if (start && end) {
            return `${start} - ${end}`;
        } else if (start) {
            return start;
        } else if (end) {
            return `Until ${end}`;
        }
        
        return 'Time TBD';
    }

    /**
     * Format meeting data for display
     * @param {Object} meeting - Meeting object from backend (MeetingRequestDTO)
     * @returns {Object} Formatted meeting object
     */
    formatMeetingForDisplay(meeting) {
        return {
            id: meeting.id,
            title: meeting.title || 'Meeting',
            caseTitle: meeting.caseTitle || 'Unknown Case',
            caseId: meeting.caseId,
            location: meeting.location || 'Location TBD',
            date: meeting.meetingDate,
            startTime: meeting.startTime,
            endTime: meeting.endTime,
            time: this.formatTimeRange(meeting.startTime, meeting.endTime),
            status: meeting.status || 'SCHEDULED',
            displayDate: this.formatDate(meeting.meetingDate),
            note: meeting.note || '',
            googleMeetLink: meeting.googleMeetLink,
            isVirtual: !!meeting.googleMeetLink
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