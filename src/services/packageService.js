import { getAuth } from "firebase/auth";

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

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
 * Fetch all plans from the API
 */
export const fetchAllPlans = async () => {
    const headers = await getAuthHeader();

    const response = await fetch(`${API_BASE}/api/admin/plans`, {
        method: 'GET',
        headers: headers
    });

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Authentication failed. Please log in again.');
        } else if (response.status === 403) {
            throw new Error('Access denied. Admin privileges required.');
        }
        throw new Error(`Failed to fetch plans: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    // Transform backend data to frontend format for display
    if (Array.isArray(data)) {
        return data.map(plan => transformPlanToFrontendFormat(plan));
    } else {
        return transformPlanToFrontendFormat(data);
    }
};

/**
 * Fetch a single plan by ID
 */
export const fetchPlanById = async (planId) => {
    const headers = await getAuthHeader();

    const response = await fetch(`${API_BASE}/api/admin/plans/${planId}`, {
        method: 'GET',
        headers: headers
    });

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Authentication failed. Please log in again.');
        } else if (response.status === 403) {
            throw new Error('Access denied. Admin privileges required.');
        } else if (response.status === 404) {
            throw new Error('Plan not found.');
        }
        throw new Error(`Failed to fetch plan: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data; // Return raw backend data for internal use
};

/**
 * Create a new subscription plan
 */
export const createPlan = async (planData) => {
    const headers = await getAuthHeader();

    const response = await fetch(`${API_BASE}/api/admin/plans`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(planData)
    });

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Authentication failed. Please log in again.');
        } else if (response.status === 403) {
            throw new Error('Access denied. Admin privileges required.');
        } else if (response.status === 409) {
            throw new Error('A plan with this name already exists.');
        }
        throw new Error(`Failed to create plan: ${response.status} ${response.statusText}`);
    }

    return await response.json();
};

/**
 * Update an existing subscription plan
 */
export const updatePlan = async (planId, planData) => {
    const headers = await getAuthHeader();

    const response = await fetch(`${API_BASE}/api/admin/plans/${planId}`, {
        method: 'PUT',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(planData)
    });

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Authentication failed. Please log in again.');
        } else if (response.status === 403) {
            throw new Error('Access denied. Admin privileges required.');
        } else if (response.status === 404) {
            throw new Error('Plan not found.');
        } else if (response.status === 409) {
            throw new Error('A plan with this name already exists.');
        }
        throw new Error(`Failed to update plan: ${response.status} ${response.statusText}`);
    }

    return await response.json();
};

/**
 * Delete a subscription plan
 */
export const deletePlan = async (planId) => {
    const headers = await getAuthHeader();

    const response = await fetch(`${API_BASE}/api/admin/plans/${planId}`, {
        method: 'DELETE',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Authentication failed. Please log in again.');
        } else if (response.status === 403) {
            throw new Error('Access denied. Admin privileges required.');
        } else if (response.status === 404) {
            throw new Error('Plan not found.');
        }
        throw new Error(`Failed to delete plan: ${response.status} ${response.statusText}`);
    }

    return response.status === 204; // No content response
};

/**
 * Toggle plan active status
 */
export const togglePlanStatus = async (planId, isActive) => {
    const headers = await getAuthHeader();

    // First fetch the current plan data
    const currentPlan = await fetchPlanById(planId);
    
    // Update the plan with new active status
    const updatedPlan = {
        ...currentPlan,
        active: isActive  // Use 'active' field that matches backend
    };

    const response = await fetch(`${API_BASE}/api/admin/plans/${planId}`, {
        method: 'PUT',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedPlan)
    });

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Authentication failed. Please log in again.');
        } else if (response.status === 403) {
            throw new Error('Access denied. Admin privileges required.');
        } else if (response.status === 404) {
            throw new Error('Plan not found.');
        }
        throw new Error(`Failed to update plan status: ${response.status} ${response.statusText}`);
    }

    return await response.json();
};

// Helper function to transform frontend data to backend format
export const transformPlanToBackendFormat = (frontendPlan) => {
    return {
        planName: frontendPlan.name,
        priceMonthly: parseFloat(frontendPlan.price),
        features: {
            max_cases: frontendPlan.features?.maxCases || 0,
            max_juniors: frontendPlan.features?.maxJuniors || 0,
            ai_chatbot_access: frontendPlan.features?.unlimitedAI || false,
            custom_calendar: frontendPlan.features?.collaborationTools || false,
            document_analysis: frontendPlan.features?.advancedAnalytics || false
        },
        active: frontendPlan.active || false
    };
};

// Helper function to transform backend data to frontend format
export const transformPlanToFrontendFormat = (backendPlan) => {
    if (!backendPlan) {
        return null;
    }
    
    return {
        id: backendPlan.id,
        name: backendPlan.planName || 'Unnamed Plan',
        price: backendPlan.priceMonthly || 0,
        billingCycle: "monthly",
        description: getDescriptionForPlan(backendPlan.planName),
        userLimit: (backendPlan.features?.max_juniors || 1),
        active: backendPlan.active || false,
        features: {
            unlimitedAI: backendPlan.features?.ai_chatbot_access || false,
            premiumSupport: true, // Assume all plans have this
            customerCare: true, // Assume all plans have this
            collaborationTools: backendPlan.features?.custom_calendar || false,
            thirdPartyIntegrations: backendPlan.features?.document_analysis || false,
            advancedAnalytics: backendPlan.features?.document_analysis || false,
            teamPerformance: (backendPlan.features?.max_juniors || 0) > 1,
            topGradeSecurity: true, // Assume all plans have this
            customizableSolutions: (backendPlan.features?.max_cases || 0) > 100,
            customReports: backendPlan.features?.document_analysis || false,
            performanceUsage: backendPlan.features?.ai_chatbot_access || false,
            enterpriseSecurity: backendPlan.features?.document_analysis || false,
            seamlessIntegration: backendPlan.features?.document_analysis || false,
            dedicatedManager: (backendPlan.planName || '').toLowerCase().includes('enterprise'),
            maxCases: backendPlan.features?.max_cases || 0,
            maxJuniors: backendPlan.features?.max_juniors || 0
        }
    };
};

// Helper function to get description based on plan name
const getDescriptionForPlan = (planName) => {
    if (!planName || typeof planName !== 'string') {
        return "Professional law practice management";
    }
    
    switch (planName.toLowerCase()) {
        case 'trial':
            return "Everything in FREE plan";
        case 'lawyer pro':
            return "Everything in Pro plan";
        case 'legal researcher':
            return "Dedicated for Law students/researchers";
        case 'researcher_trial':
            return "Dedicated for Law students/researchers";
        default:
            return "Professional law practice management";
    }
};

// Default export
const packageService = {
    fetchAllPlans,
    fetchPlanById,
    createPlan,
    updatePlan,
    deletePlan,
    togglePlanStatus,
    transformPlanToBackendFormat,
    transformPlanToFrontendFormat
};

export default packageService;
