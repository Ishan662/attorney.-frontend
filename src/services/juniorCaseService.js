import { authenticatedFetch, getFullSession } from './authService';

class JuniorCaseService {
    /**
     * Get assigned cases for the current junior lawyer
     * @returns {Promise<Array>} Array of assigned cases
     */
    async getAssignedCases() {
        try {
            // Get the user session to get the backend junior lawyer UUID
            const userSession = await getFullSession();
            if (!userSession || !userSession.id) {
                throw new Error('User session not found or missing junior lawyer ID');
            }

            const response = await authenticatedFetch(
                `/api/junior-lawyer/assigned-cases?userId=${userSession.id}`,
                {
                    method: 'GET',
                }
            );

            console.log('Assigned cases fetched successfully:', response);
            return response;
        } catch (error) {
            console.error('Error fetching assigned cases:', error);
            throw error;
        }
    }

    /**
     * Format case data for display
     * @param {Object} caseData - Case object from backend (AssignedCaseDTO)
     * @returns {Object} Formatted case object
     */
    formatCaseForDisplay(caseData) {
        return {
            id: caseData.id,
            // Use caseNumber for display instead of UUID, fallback to a short version of ID
            caseId: caseData.caseNumber || caseData.caseId || `CASE-${String(caseData.id).slice(-8)}`,
            name: caseData.caseTitle || caseData.title || caseData.name || 'Unknown Case',
            description: caseData.description || caseData.des || '',
            nextHearing: caseData.nextHearingDate || caseData.nextHearing,
            client: caseData.clientName || caseData.client || 'Unknown Client',
            status: caseData.status || 'ACTIVE',
            court: caseData.courtName || caseData.court || caseData.location || 'Unknown Court',
            lawyer: caseData.lawyerName || caseData.lawyer || caseData.assignedLawyer || 'Unknown Lawyer',
            createdAt: caseData.createdAt || caseData.createdDate,
            priority: caseData.priority || 'Medium',
            caseType: caseData.caseType || caseData.type || 'General',
            displayNextHearing: this.formatDate(caseData.nextHearingDate || caseData.nextHearing),
            displayCreatedAt: this.formatDate(caseData.createdAt || caseData.createdDate)
        };
    }

    /**
     * Format date for display
     * @param {string} date - Date string
     * @returns {string} Formatted date
     */
    formatDate(date) {
        if (!date) return '-';
        try {
            return new Date(date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        } catch (error) {
            console.error('Error formatting date:', error);
            return date || '-';
        }
    }

    /**
     * Get status color class for case status
     * @param {string} status - Case status
     * @returns {string} CSS class for status color
     */
    getStatusColorClass(status) {
        if (!status) return 'bg-gray-100 text-gray-700';
        
        const statusLower = status.toLowerCase();
        switch (statusLower) {
            case 'ongoing':
            case 'active':
                return 'bg-gray-100 text-gray-700';
            case 'pending':
                return 'bg-gray-100 text-gray-700';
            case 'review':
            case 'under_review':
                return 'bg-gray-100 text-gray-700';
            case 'completed':
            case 'closed':
                return 'bg-gray-100 text-gray-700';
            case 'cancelled':
                return 'bg-gray-100 text-gray-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    }

    /**
     * Get priority color class
     * @param {string} priority - Case priority
     * @returns {string} CSS class for priority color
     */
    getPriorityColorClass(priority) {
        if (!priority) return 'bg-gray-100 text-gray-700';
        
        const priorityLower = priority.toLowerCase();
        switch (priorityLower) {
            case 'high':
                return 'bg-gray-100 text-gray-700';
            case 'medium':
                return 'bg-gray-100 text-gray-700';
            case 'low':
                return 'bg-gray-100 text-gray-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    }

    /**
     * Get hearings for assigned cases of the current junior lawyer
     * @returns {Promise<Array>} Array of hearings for assigned cases
     */
    async getAssignedCaseHearings() {
        try {
            // Get the user session to get the backend junior lawyer UUID
            const userSession = await getFullSession();
            if (!userSession || !userSession.id) {
                throw new Error('User session not found or missing junior lawyer ID');
            }

            const response = await authenticatedFetch(
                `/api/junior-lawyer/assigned-case-hearings?userId=${userSession.id}`,
                {
                    method: 'GET',
                }
            );

            console.log('Assigned case hearings fetched successfully:', response);
            return response;
        } catch (error) {
            console.error('Error fetching assigned case hearings:', error);
            throw error;
        }
    }

    /**
     * Format hearing data for display
     * @param {Object} hearingData - Hearing object from backend (HearingDTO)
     * @returns {Object} Formatted hearing object
     */
    formatHearingForDisplay(hearingData) {
        const formatTime = (timeStr) => {
            if (!timeStr || timeStr === 'null' || timeStr === 'undefined') return null;
            try {
                // Handle different time formats
                let time;
                if (timeStr.includes('T')) {
                    time = new Date(timeStr);
                } else if (timeStr.includes(':')) {
                    time = new Date(`1970-01-01T${timeStr}`);
                } else {
                    return null;
                }
                
                if (isNaN(time.getTime())) return null;
                
                return time.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                });
            } catch (error) {
                console.error('Error formatting time:', error);
                return null;
            }
        };

        // Clean up the title - avoid undefined/null values
        const cleanTitle = hearingData.title && hearingData.title !== 'null' && hearingData.title !== 'undefined' 
            ? hearingData.title 
            : null;

        const cleanCaseTitle = hearingData.caseTitle && hearingData.caseTitle !== 'null' && hearingData.caseTitle !== 'undefined'
            ? hearingData.caseTitle
            : null;

        // Create a proper display label
        let displayLabel;
        if (cleanTitle) {
            displayLabel = cleanTitle;
        } else if (cleanCaseTitle) {
            displayLabel = `${cleanCaseTitle} Hearing`;
        } else {
            displayLabel = 'Case Hearing';
        }

        const startTime = formatTime(hearingData.startTime);
        const endTime = formatTime(hearingData.endTime);

        return {
            id: hearingData.id,
            title: cleanTitle || 'Hearing',
            date: this.formatDate(hearingData.hearingDate),
            hearingDate: hearingData.hearingDate,
            startTime: startTime,
            endTime: endTime,
            location: hearingData.location || 'Location TBD',
            note: hearingData.note || '',
            status: hearingData.status || 'SCHEDULED',
            caseId: hearingData.caseId,
            caseTitle: cleanCaseTitle || 'Unknown Case',
            // Create a display label
            label: displayLabel,
            // Format for timeline display - only show if times are valid
            displayTime: startTime && endTime 
                ? `${startTime} - ${endTime}`
                : startTime 
                    ? startTime
                    : 'Time TBD'
        };
    }

    /**
     * Get status color class for hearing status
     * @param {string} status - Hearing status
     * @returns {string} CSS class for status color
     */
    getHearingStatusColorClass(status) {
        if (!status) return 'bg-gray-100 text-gray-800';
        
        const statusLower = status.toLowerCase();
        switch (statusLower) {
            case 'completed':
                return 'bg-green-100 text-green-700';
            case 'scheduled':
            case 'planned':
                return 'bg-blue-100 text-blue-700';
            case 'cancelled':
                return 'bg-red-100 text-red-700';
            case 'postponed':
                return 'bg-yellow-100 text-yellow-700';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }

    /**
     * Filter hearings by case ID
     * @param {Array} hearings - Array of hearings
     * @param {string} caseId - Case ID to filter by
     * @returns {Array} Filtered hearings for the specific case
     */
    filterHearingsByCase(hearings, caseId) {
        if (!hearings || !caseId) return [];
        return hearings.filter(hearing => hearing.caseId === caseId);
    }

    /**
     * Search and filter cases
     * @param {Array} cases - Array of cases
     * @param {string} searchTerm - Search term
     * @param {string} statusFilter - Status filter
     * @param {string} priorityFilter - Priority filter
     * @returns {Array} Filtered cases
     */
    filterCases(cases, searchTerm = '', statusFilter = '', priorityFilter = '') {
        return cases.filter(caseItem => {
            const matchesSearch = !searchTerm || 
                caseItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                caseItem.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                caseItem.caseId.toLowerCase().includes(searchTerm.toLowerCase());
                
            const matchesStatus = !statusFilter || caseItem.status.toLowerCase() === statusFilter.toLowerCase();
            const matchesPriority = !priorityFilter || caseItem.priority.toLowerCase() === priorityFilter.toLowerCase();
            
            return matchesSearch && matchesStatus && matchesPriority;
        });
    }
}

export const juniorCaseService = new JuniorCaseService();
export default juniorCaseService;