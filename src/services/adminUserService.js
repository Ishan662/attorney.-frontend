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
 * Fetch all users from backend
 */
export const fetchUsers = async () => {
    const headers = await getAuthHeader();

    const response = await fetch(`${API_BASE}/api/admin/users`, {
        method: 'GET',
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
        }
        throw new Error(`Failed to fetch users: ${response.status} ${response.statusText}`);
    }

    return await response.json();
};

/**
 * Update user status
 */
export const updateUserStatus = async (userId, newStatus) => {
    const headers = await getAuthHeader();

    const response = await fetch(`${API_BASE}/api/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newStatus })
    });

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Authentication failed. Please log in again.');
        } else if (response.status === 403) {
            throw new Error('Access denied. Admin privileges required.');
        }
        throw new Error(`Failed to update user status: ${response.status} ${response.statusText}`);
    }

    return response.status === 204; // No content response
};

/**
 * Delete user
 */
export const deleteUser = async (userId) => {
    const headers = await getAuthHeader();

    const response = await fetch(`${API_BASE}/api/admin/users/${userId}`, {
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
        }
        throw new Error(`Failed to delete user: ${response.status} ${response.statusText}`);
    }

    return response.status === 204; // No content response
};

/**
 * Fetch user counts summary
 */
export const fetchUserCounts = async () => {
    const headers = await getAuthHeader();

    const response = await fetch(`${API_BASE}/api/admin/users/counts`, {
        method: 'GET',
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
        }
        throw new Error(`Failed to fetch user counts: ${response.status} ${response.statusText}`);
    }

    return await response.json();
};

// Default export
const adminUserService = {
    fetchUsers,
    updateUserStatus,
    deleteUser,
    fetchUserCounts
};

export default adminUserService;
