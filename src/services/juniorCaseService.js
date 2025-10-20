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
                `/api/juniors/cases/assigned?juniorLawyerId=${userSession.id}`,
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
     * @param {Object} caseData - Case object from backend
     * @returns {Object} Formatted case object
     */
    formatCaseForDisplay(caseData) {
        return {
            id: caseData.id,
            caseId: caseData.caseId || caseData.id,
            name: caseData.title || caseData.name,
            description: caseData.description || caseData.des,
            nextHearing: caseData.nextHearingDate,
            client: caseData.clientName || caseData.client,
            status: caseData.status,
            court: caseData.court || caseData.location,
            lawyer: caseData.lawyerName || caseData.lawyer,
            createdAt: caseData.createdAt || caseData.createdDate,
            priority: caseData.priority || 'Medium',
            displayNextHearing: this.formatDate(caseData.nextHearingDate),
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
        if (!status) return 'bg-gray-100 text-gray-800';
        
        const statusLower = status.toLowerCase();
        switch (statusLower) {
            case 'ongoing':
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'review':
            case 'under_review':
                return 'bg-blue-100 text-blue-800';
            case 'completed':
            case 'closed':
                return 'bg-gray-100 text-gray-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }

    /**
     * Get priority color class
     * @param {string} priority - Case priority
     * @returns {string} CSS class for priority color
     */
    getPriorityColorClass(priority) {
        if (!priority) return 'bg-gray-100 text-gray-800';
        
        const priorityLower = priority.toLowerCase();
        switch (priorityLower) {
            case 'high':
                return 'bg-red-100 text-red-800';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'low':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
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