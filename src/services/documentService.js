import { authenticatedFetch } from './authService';
import { auth } from './firebase';

/**
 * Document Service for backend integration
 * Handles file uploads and downloads for tasks
 */

/**
 * Uploads a document to a specific task
 * @param {string} taskId - The ID of the task
 * @param {File} file - The file to upload
 */
export const uploadDocumentToTask = async (taskId, file) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("No authenticated user found. Please log in again.");
    }

    console.log('Current user:', user.email);
    console.log('Uploading file:', file.name, 'to task:', taskId);
    
    const idToken = await user.getIdToken();
    console.log('Got ID token, length:', idToken.length);
    
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`http://localhost:8080/api/documents/upload/task/${taskId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${idToken}`
        // Don't set Content-Type for FormData - browser will set it with boundary
      },
      body: formData
    });

    console.log('Upload response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('Upload error response:', errorData);
      throw new Error(`Upload failed: ${response.status} - ${errorData}`);
    }

    const result = await response.json();
    console.log('Upload successful:', result);
    return result;
  } catch (error) {
    console.error('Error uploading document:', error);
    throw error;
  }
};

/**
 * Gets all documents for a specific task
 * @param {string} taskId - The ID of the task
 */
export const getTaskDocuments = async (taskId) => {
  try {
    const response = await authenticatedFetch(`/api/tasks/${taskId}/documents`);
    return response;
  } catch (error) {
    console.error('Error fetching task documents:', error);
    throw error;
  }
};

/**
 * Downloads a document by its ID and triggers browser download
 * @param {string} documentId - The ID of the document
 * @param {string} fileName - The original file name for download
 */
export const downloadDocument = async (documentId, fileName = 'document') => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("No authenticated user found. Please log in again.");
    }

    console.log('Downloading document:', documentId, 'as:', fileName);
    const idToken = await user.getIdToken();
    
    const response = await fetch(`http://localhost:8080/api/documents/${documentId}/download`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${idToken}`
      }
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Download error:', errorData);
      throw new Error(`Download failed: ${response.status} - ${errorData}`);
    }

    // Get the blob and create download link
    const blob = await response.blob();
    
    // Create a temporary URL for the blob
    const url = window.URL.createObjectURL(blob);
    
    // Create a temporary anchor element and trigger download
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = fileName;
    
    // Append to body, click, and remove
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    console.log('Download completed successfully');
    return true;
  } catch (error) {
    console.error('Error downloading document:', error);
    throw error;
  }
};

/**
 * Uploads multiple documents to a task
 * @param {string} taskId - The ID of the task
 * @param {File[]} files - Array of files to upload
 */
export const uploadMultipleDocumentsToTask = async (taskId, files) => {
  try {
    const uploadPromises = files.map(file => uploadDocumentToTask(taskId, file));
    const results = await Promise.allSettled(uploadPromises);
    
    const successful = [];
    const failed = [];
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        successful.push({
          file: files[index],
          result: result.value
        });
      } else {
        failed.push({
          file: files[index],
          error: result.reason
        });
      }
    });
    
    return { successful, failed };
  } catch (error) {
    console.error('Error uploading multiple documents:', error);
    throw error;
  }
};
