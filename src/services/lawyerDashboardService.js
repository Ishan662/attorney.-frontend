import { authenticatedFetch, getFullSession } from './authService';

class LawyerDashboardService {
    /**
     * Get today's hearings for the current lawyer
     * @returns {Promise<Array>} Array of today's hearings
     */
    async getTodaysHearings() {
        try {
            // Get the user session to get the backend lawyer UUID
            const userSession = await getFullSession();
            if (!userSession || !userSession.id) {
                throw new Error('User session not found or missing lawyer ID');
            }

            const response = await authenticatedFetch(
                `/api/lawyers/hearings/today?lawyerId=${userSession.id}`,
                {
                    method: 'GET',
                }
            );

            console.log('Today\'s hearings fetched successfully:', response);
            return response;
        } catch (error) {
            console.error('Error fetching today\'s hearings:', error);
            throw error;
        }
    }

    /**
     * Get income chart data for the current lawyer
     * @returns {Promise<Array>} Array of income data by case
     */
    async getIncomeChart() {
        try {
            // Get the user session to get the backend lawyer UUID
            const userSession = await getFullSession();
            if (!userSession || !userSession.id) {
                throw new Error('User session not found or missing lawyer ID');
            }

            const response = await authenticatedFetch(
                `/api/lawyers/hearings/income-chart?lawyerId=${userSession.id}`,
                {
                    method: 'GET',
                }
            );

            console.log('Income chart data fetched successfully:', response);
            return response;
        } catch (error) {
            console.error('Error fetching income chart data:', error);
            throw error;
        }
    }

    /**
     * Get pending meeting requests for the current lawyer
     * @returns {Promise<Array>} Array of pending meeting requests only
     */
    async getMeetingRequests() {
        try {
            // Use the same API endpoint as MeetingRequest.jsx
            const response = await authenticatedFetch('/api/meetings', {
                method: 'GET',
            });

            // Filter to show only pending meeting requests for the dashboard
            const pendingMeetings = response.filter(meeting => 
                meeting.status === 'PENDING'
            );

            console.log('Pending meeting requests fetched successfully:', pendingMeetings);
            return pendingMeetings;
        } catch (error) {
            console.error('Error fetching meeting requests:', error);
            throw error;
        }
    }

    /**
     * Format hearing data for display in the dashboard
     * @param {Object} hearing - The hearing object from the API
     * @returns {Object} Formatted hearing object
     */
    formatHearingForDisplay(hearing) {
        if (!hearing) {
            return null;
        }

        // Map backend fields to frontend expected fields
        return {
            id: hearing.id || 'N/A',
            caseName: hearing.caseTitle || hearing.title || 'Unknown Case', // Use caseTitle if available, fallback to title
            clientName: hearing.clientName || 'Unknown Client',
            hearingDate: hearing.hearingDate,
            hearingTime: this.formatTimeFromStartEnd(hearing.startTime, hearing.endTime), // Combine start and end time
            court: hearing.location || 'Unknown Court', // location from backend maps to court
            status: hearing.status || 'Scheduled',
            type: hearing.type || 'Hearing',
            description: hearing.note || '', // note from backend maps to description
            
            // Format display text - prioritize case name over client name
            displayName: hearing.caseTitle || hearing.title || hearing.clientName || 'Unknown Case'
        };
    }

    /**
     * Format meeting request data for display in the dashboard
     * @param {Object} meetingRequest - The meeting request object from the API (same structure as MeetingRequest.jsx)
     * @returns {Object} Formatted meeting request object
     */
    formatMeetingRequestForDisplay(meetingRequest) {
        if (!meetingRequest) {
            return null;
        }

        try {
            // Based on actual API data structure:
            // aCase: {id, caseTitle, caseNumber}
            // client: {id, firstName, lastName}
            // id, title, meetingDate, startTime, endTime, note, status, etc.
            
            const clientName = meetingRequest.client ? 
                `${meetingRequest.client.firstName || ''} ${meetingRequest.client.lastName || ''}`.trim() : 'Unknown Client';
            const caseNumber = meetingRequest.aCase ? (meetingRequest.aCase.caseNumber || 'N/A') : 'N/A';
            const caseTitle = meetingRequest.aCase ? (meetingRequest.aCase.caseTitle || 'Unknown Case') : 'Unknown Case';
            
            // Use rescheduled date/time if available, otherwise use original
            const meetingDate = meetingRequest.rescheduledDate || meetingRequest.meetingDate || new Date().toISOString().split('T')[0];
            const startTime = meetingRequest.rescheduledStartTime || meetingRequest.startTime || '09:00:00';
            const endTime = meetingRequest.rescheduledEndTime || meetingRequest.endTime || '10:00:00';
            
            // Create a meaningful title if it's empty or just "Case "
            let displayTitle = meetingRequest.title;
            if (!displayTitle || displayTitle.trim() === 'Case' || displayTitle.trim() === 'Case ') {
                displayTitle = `Meeting: ${caseTitle}`;
            }
            
            return {
                id: meetingRequest.id || 'N/A',
                title: displayTitle || 'Meeting Request',
                date: meetingDate, // Keep in YYYY-MM-DD format for formatMeetingDate in Dashboard
                time: this.formatTimeFromStartEnd(startTime, endTime),
                note: meetingRequest.note || '',
                caseId: caseNumber,
                clientName: clientName,
                caseTitle: caseTitle,
                status: meetingRequest.status || 'PENDING'
            };
        } catch (error) {
            console.error('Error formatting meeting request for display:', error);
            // Return safe fallback
            return {
                id: meetingRequest.id || 'ERROR',
                title: 'Error Loading Meeting',
                date: new Date().toISOString().split('T')[0],
                time: 'Time TBD',
                note: 'Error loading meeting details',
                caseId: 'ERROR',
                clientName: 'Error Loading Client',
                caseTitle: 'Error Loading Case',
                status: 'PENDING'
            };
        }
    }

    /**
     * Format start and end time for display
     * @param {string} startTime - Start time in HH:MM format
     * @param {string} endTime - End time in HH:MM format
     * @returns {string} Formatted time range
     */
    formatTimeFromStartEnd(startTime, endTime) {
        if (!startTime && !endTime) {
            return 'Time TBD';
        }

        if (startTime && endTime) {
            return `${this.formatTime(startTime)} - ${this.formatTime(endTime)}`;
        } else if (startTime) {
            return this.formatTime(startTime);
        } else {
            return this.formatTime(endTime);
        }
    }

    /**
     * Format time for display
     * @param {string} timeString - Time in HH:MM format or ISO string
     * @returns {string} Formatted time
     */
    formatTime(timeString) {
        if (!timeString) {
            return 'Time TBD';
        }

        try {
            // If it's already in HH:MM format, return as is
            if (/^\d{2}:\d{2}$/.test(timeString)) {
                return timeString;
            }

            // If it's an ISO string or other format, parse and format
            const date = new Date(timeString);
            return date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
        } catch (error) {
            console.error('Error formatting time:', error);
            return timeString || 'Time TBD';
        }
    }

    /**
     * Format date for display
     * @param {string} dateString - Date string
     * @returns {string} Formatted date
     */
    formatDate(dateString) {
        if (!dateString) {
            return 'Date TBD';
        }

        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            console.error('Error formatting date:', error);
            return dateString || 'Date TBD';
        }
    }
}

export const lawyerDashboardService = new LawyerDashboardService();
export default lawyerDashboardService;