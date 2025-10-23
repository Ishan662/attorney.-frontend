import { getAuth } from "firebase/auth";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

/**
 * Helper to get auth token from Firebase
 */
async function getAuthHeader() {
    const user = getAuth().currentUser;
    if (!user) {
        throw new Error('No authenticated user found. Please log in.');
    }
    const token = await user.getIdToken();
    return { Authorization: `Bearer ${token}` };
}

/**
 * Get simple user counts by role
 * Endpoint: GET /api/admin/users/counts
 */
export const getUserCounts = async () => {
    const headers = await getAuthHeader();

    const response = await fetch(`${API_BASE}/api/admin/users/counts`, {
        method: 'GET',
        headers: headers
    });

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Authentication failed. Please log in again.');
        } else if (response.status === 403) {
            throw new Error('Access denied. Admin privileges required.');
        }
        throw new Error(`Failed to fetch user counts: ${response.status} ${response.statusText}`);
    }

    return await response.json();
};

/**
 * Get detailed dashboard statistics
 * Endpoint: GET /api/admin/users/dashboard-stats
 */
export const getDashboardStats = async () => {
    const headers = await getAuthHeader();

    const response = await fetch(`${API_BASE}/api/admin/users/dashboard-stats`, {
        method: 'GET',
        headers: headers
    });

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Authentication failed. Please log in again.');
        } else if (response.status === 403) {
            throw new Error('Access denied. Admin privileges required.');
        }
        throw new Error(`Failed to fetch dashboard statistics: ${response.status} ${response.statusText}`);
    }

    return await response.json();
};

/**
 * Transform API data to match UI requirements
 */
export const transformDashboardData = (dashboardStats) => {
    if (!dashboardStats) return null;

    return {
        totalUsers: (dashboardStats.totalLawyers || 0) + 
                   (dashboardStats.totalJuniors || 0) + 
                   (dashboardStats.totalClients || 0) + 
                   (dashboardStats.totalResearchers || 0),
        newSignupsToday: dashboardStats.newSignupsThisMonth || 0, // Using monthly data as daily isn't available
        activeLawyers: dashboardStats.activeLawyers || 0,
        activeJuniors: dashboardStats.activeJuniors || 0,
        activeClients: dashboardStats.activeClients || 0,
        inactiveLawyers: dashboardStats.inactiveLawyers || 0,
        totalLawyers: dashboardStats.totalLawyers || 0,
        totalJuniors: dashboardStats.totalJuniors || 0,
        totalClients: dashboardStats.totalClients || 0,
        totalResearchers: dashboardStats.totalResearchers || 0
    };
};

/**
 * Get user type distribution for charts/visualization
 */
export const getUserTypeDistribution = async () => {
    try {
        const counts = await getUserCounts();
        return {
            senior_lawyers: counts.lawyers || 0,
            junior_lawyers: counts.juniors || 0,
            clients: counts.clients || 0,
            researchers: counts.researchers || 0
        };
    } catch (error) {
        console.error('Error fetching user type distribution:', error);
        // Return default data if API fails
        return {
            senior_lawyers: 0,
            junior_lawyers: 0,
            clients: 0,
            researchers: 0
        };
    }
};

/**
 * Get lawyer support requests
 * Endpoint: GET /api/admin/support/lawyer-requests
 */
export const getLawyerSupportRequests = async () => {
    const headers = await getAuthHeader();

    const response = await fetch(`${API_BASE}/api/admin/support/lawyer-requests`, {
        method: 'GET',
        headers: headers
    });

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Authentication failed. Please log in again.');
        } else if (response.status === 403) {
            throw new Error('Access denied. Admin privileges required.');
        }
        throw new Error(`Failed to fetch lawyer support requests: ${response.status} ${response.statusText}`);
    }

    return await response.json();
};

/**
 * Format support request for display
 */
export const formatSupportRequestForDisplay = (request) => {
    return {
        id: request.id,
        subject: request.subject || 'No Subject',
        lawyerName: request.lawyerName || 'Unknown',
        lawyerEmail: request.lawyerEmail || '',
        createdAt: request.createdAt ? new Date(request.createdAt).toLocaleDateString() : 'Unknown',
        status: request.status || 'pending',
        statusColor: getStatusColor(request.status)
    };
};

/**
 * Get status color for support requests
 */
const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
        case 'open':
        case 'pending':
            return 'text-yellow-600 bg-yellow-100';
        case 'in_progress':
        case 'in-progress':
            return 'text-blue-600 bg-blue-100';
        case 'resolved':
        case 'closed':
            return 'text-green-600 bg-green-100';
        case 'rejected':
            return 'text-red-600 bg-red-100';
        default:
            return 'text-gray-600 bg-gray-100';
    }
};

// Default export
const adminDashboardService = {
    getUserCounts,
    getDashboardStats,
    transformDashboardData,
    getUserTypeDistribution,
    getLawyerSupportRequests,
    formatSupportRequestForDisplay
};

export default adminDashboardService;
