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
     * Get today's closed cases for the current lawyer (using your new endpoint)
     * @returns {Promise<Array>} Array of closed cases for today
     */
    async getDaySummaryClosedCases() {
        try {
            // Get the user session to get the backend lawyer UUID
            const userSession = await getFullSession();
            if (!userSession || !userSession.id) {
                throw new Error('User session not found or missing lawyer ID');
            }

            const url = `/api/lawyers/day-summary/closed-cases?lawyerId=${userSession.id}`;
            console.log('Fetching closed cases from URL:', url);
            
            const response = await authenticatedFetch(
                url,
                {
                    method: 'GET',
                }
            );

            console.log('Day summary closed cases fetched successfully:', response);
            return response;
        } catch (error) {
            console.error('Error fetching day summary closed cases:', error);
            throw error;
        }
    }

    /**
     * Get today's open cases for the current lawyer (using your new endpoint)
     * @returns {Promise<Array>} Array of open cases for today
     */
    async getDaySummaryOpenCases() {
        try {
            // Get the user session to get the backend lawyer UUID
            const userSession = await getFullSession();
            if (!userSession || !userSession.id) {
                throw new Error('User session not found or missing lawyer ID');
            }

            const url = `/api/lawyers/day-summary/open-cases?lawyerId=${userSession.id}`;
            console.log('Fetching open cases from URL:', url);
            
            const response = await authenticatedFetch(
                url,
                {
                    method: 'GET',
                }
            );

            console.log('Day summary open cases fetched successfully:', response);
            return response;
        } catch (error) {
            console.error('Error fetching day summary open cases:', error);
            throw error;
        }
    }

    /**
     * Get today's payments for the current firm
     * @returns {Promise<Array>} Array of today's payments
     */
    async getTodaysPayments() {
        try {
            // Get the user session to get the firm ID
            const userSession = await getFullSession();
            if (!userSession) {
                throw new Error('User session not found');
            }

            // Use firmId from session, fallback to id if firmId not available
            const firmId = userSession.firmId || userSession.firm || userSession.id;
            if (!firmId) {
                throw new Error('Firm ID not found in user session');
            }

            const url = `/api/lawyers/day-summary/todays-payments?firmId=${firmId}`;
            console.log('Fetching today\'s payments from URL:', url);
            
            const response = await authenticatedFetch(
                url,
                {
                    method: 'GET',
                }
            );

            console.log('Today\'s payments fetched successfully:', response);
            return response;
        } catch (error) {
            console.error('Error fetching today\'s payments:', error);
            throw error;
        }
    }

    /**
     * Get today's closed cases for the current lawyer
     * @returns {Promise<Array>} Array of closed cases for today
     */
    async getTodaysClosedCases() {
        try {
            // Get the user session to get the backend lawyer UUID
            const userSession = await getFullSession();
            if (!userSession || !userSession.id) {
                throw new Error('User session not found or missing lawyer ID');
            }

            const response = await authenticatedFetch(
                `/api/lawyers/cases/closed-today?lawyerId=${userSession.id}`,
                {
                    method: 'GET',
                }
            );

            console.log('Today\'s closed cases fetched successfully:', response);
            return response;
        } catch (error) {
            console.error('Error fetching today\'s closed cases:', error);
            throw error;
        }
    }

    /**
     * Get today's new cases for the current lawyer
     * @returns {Promise<Array>} Array of new cases for today
     */
    async getTodaysNewCases() {
        try {
            // Get the user session to get the backend lawyer UUID
            const userSession = await getFullSession();
            if (!userSession || !userSession.id) {
                throw new Error('User session not found or missing lawyer ID');
            }

            const response = await authenticatedFetch(
                `/api/lawyers/day-summary/open-cases?lawyerId=${userSession.id}`,
                {
                    method: 'GET',
                }
            );

            console.log('Today\'s new cases fetched successfully:', response);
            return response;
        } catch (error) {
            console.error('Error fetching today\'s new cases:', error);
            throw error;
        }
    }

    /**
     * Get today's income for the current lawyer
     * @returns {Promise<Object>} Object containing today's income data
     */
    // async getTodaysIncome() {
    //     try {
    //         // Get the user session to get the backend lawyer UUID
    //         const userSession = await getFullSession();
    //         if (!userSession || !userSession.id) {
    //             throw new Error('User session not found or missing lawyer ID');
    //         }

    //         const response = await authenticatedFetch(
    //             `/api/lawyers/income/today?lawyerId=${userSession.id}`,
    //             {
    //                 method: 'GET',
    //             }
    //         );

    //         console.log('Today\'s income fetched successfully:', response);
    //         return response;
    //     } catch (error) {
    //         console.error('Error fetching today\'s income:', error);
    //         throw error;
    //     }
    // }

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
     * Format case data for display based on the Case entity structure
     * @param {Object} caseData - The case object from the API
     * @returns {Object} Formatted case object
     */
    formatCaseForDisplay(caseData) {
        if (!caseData) {
            return null;
        }

        return {
            id: caseData.id || 'N/A',
            caseTitle: caseData.caseTitle || 'Unknown Case',
            caseNumber: caseData.caseNumber || 'N/A',
            caseType: caseData.caseType || 'General',
            clientName: caseData.clientName || 'Unknown Client',
            clientPhone: caseData.clientPhone || 'N/A',
            clientEmail: caseData.clientEmail || 'N/A',
            status: caseData.status || 'OPEN',
            description: caseData.description || '',
            courtName: caseData.courtName || 'Unknown Court',
            courtType: caseData.courtType || 'N/A',
            opposingPartyName: caseData.opposingPartyName || 'N/A',
            agreedFee: caseData.agreedFee || 0,
            paymentStatus: caseData.paymentStatus || 'NOT_INVOICED',
            createdAt: this.formatDateTime(caseData.createdAt),
            updatedAt: this.formatDateTime(caseData.updatedAt),
            displayName: caseData.caseTitle || caseData.clientName || 'Unknown Case',
            // Format status for display
            statusDisplay: this.formatCaseStatus(caseData.status),
            paymentStatusDisplay: this.formatPaymentStatus(caseData.paymentStatus)
        };
    }

    /**
     * Format payment DTO for display
     * @param {Object} payment - Payment DTO from backend (id, amount, createdAt, caseNumber, clientName)
     * @returns {Object} Formatted payment object
     */
    formatPaymentForDisplay(payment) {
        if (!payment) {
            return null;
        }

        return {
            id: payment.id || 'N/A',
            amount: payment.amount ? Number(payment.amount) : 0,
            createdAt: this.formatDateTime(payment.createdAt),
            caseNumber: payment.caseNumber || 'N/A',
            clientName: payment.clientName || 'Unknown Client',
            // Formatted display values
            amountDisplay: payment.amount ? `$${Number(payment.amount).toLocaleString()}` : '$0',
            timeDisplay: payment.createdAt ? this.formatTime(payment.createdAt) : 'Unknown time'
        };
    }

    /**
     * Format case status for display
     * @param {string} status - Case status from backend
     * @returns {string} Formatted status
     */
    formatCaseStatus(status) {
        if (!status) return 'Unknown';
        
        switch (status.toUpperCase()) {
            case 'OPEN': return 'Active';
            case 'CLOSED': return 'Closed';
            case 'PENDING': return 'Pending';
            case 'ARCHIVED': return 'Archived';
            default: return status;
        }
    }

    /**
     * Format payment status for display
     * @param {string} paymentStatus - Payment status from backend
     * @returns {string} Formatted payment status
     */
    formatPaymentStatus(paymentStatus) {
        if (!paymentStatus) return 'Unknown';
        
        switch (paymentStatus.toUpperCase()) {
            case 'NOT_INVOICED': return 'Not Invoiced';
            case 'INVOICED': return 'Invoiced';
            case 'PARTIALLY_PAID': return 'Partially Paid';
            case 'FULLY_PAID': return 'Fully Paid';
            case 'OVERDUE': return 'Overdue';
            default: return paymentStatus;
        }
    }

    /**
     * Format datetime for display
     * @param {string} dateTimeString - ISO datetime string
     * @returns {string} Formatted datetime
     */
    formatDateTime(dateTimeString) {
        if (!dateTimeString) {
            return 'N/A';
        }

        try {
            const date = new Date(dateTimeString);
            return date.toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            console.error('Error formatting datetime:', error);
            return dateTimeString || 'N/A';
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