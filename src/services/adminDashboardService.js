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

// Default export
const adminDashboardService = {
    getUserCounts,
    getDashboardStats,
    transformDashboardData,
    getUserTypeDistribution
};

export default adminDashboardService;
