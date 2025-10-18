import { authenticatedFetch } from './authService';

/**
 * Task Service for backend integration
 * Maintains original UI while connecting to real APIs
 */

/**
 * Creates and assigns a new task to a junior lawyer
 */
export const createTask = async (taskData) => {
  try {
    const response = await authenticatedFetch('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData)
    });
    return response;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

/**
 * Gets all tasks for the lawyer's firm
 */
export const getAllFirmTasks = async () => {
  try {
    const response = await authenticatedFetch('/api/tasks');
    return response;
  } catch (error) {
    console.error('Error fetching firm tasks:', error);
    throw error;
  }
};

/**
 * Updates a task status
 */
export const updateTaskStatus = async (taskId, updateData) => {
  try {
    const response = await authenticatedFetch(`/api/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });
    return response;
  } catch (error) {
    console.error('Error updating task status:', error);
    throw error;
  }
};
