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

/**
 * Gets detailed information about a specific task
 * Since the backend doesn't support GET /api/tasks/{taskId}, we'll get all tasks and find the one we need
 */
export const getTaskById = async (taskId) => {
  try {
    const allTasks = await getAllFirmTasks();
    const task = allTasks.find(t => t.id === taskId);
    if (!task) {
      throw new Error('Task not found');
    }
    return task;
  } catch (error) {
    console.error('Error fetching task details:', error);
    throw error;
  }
};
