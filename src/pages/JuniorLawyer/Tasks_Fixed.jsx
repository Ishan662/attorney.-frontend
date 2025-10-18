import React, { useState, useEffect } from "react";
import PageHeader from "../../components/layout/PageHeader";
import PageLayout from "../../components/layout/PageLayout";
import Button1 from "../../components/UI/Button1";
import Button2 from "../../components/UI/Button2";
import { useAuth } from '../../context/AuthContext';
import { getAllFirmTasks, updateTaskStatus } from '../../services/taskService';
import { uploadMultipleDocumentsToTask, getTaskDocuments } from '../../services/documentService';
import { FaSyncAlt, FaEye } from 'react-icons/fa';

const Tasks = () => {
    const { user } = useAuth(); // Use real auth context
    const [notificationCount, setNotificationCount] = useState(1);
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState(null);
    const [uploadFiles, setUploadFiles] = useState([]);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const [taskDocuments, setTaskDocuments] = useState([]);
    const [isUploadingFiles, setIsUploadingFiles] = useState(false);

    useEffect(() => {
        // Load tasks assigned to this junior lawyer
        loadMyTasks();
    }, []);

    const loadMyTasks = async () => {
        setIsLoading(true);
        try {
            // Get tasks assigned to this junior lawyer
            const tasksResponse = await getAllFirmTasks();
            
            // Transform backend tasks to match UI expectations
            const transformedTasks = tasksResponse.map(task => ({
                id: task.id,
                title: task.title,
                due: formatDateForDisplay(task.dueDate),
                dueDate: task.dueDate, // Keep original for comparisons
                des: task.description,
                description: task.description, // Keep full description
                case: task.caseId ? task.caseId.substring(0, 8) : 'N/A', // Show first 8 chars of caseId
                caseId: task.caseId,
                status: task.status,
                type: task.type,
                createdAt: task.createdAt,
                assignedBy: task.assignedBy ? `${task.assignedBy.firstName} ${task.assignedBy.lastName}` : 'Unknown'
            }));

            setTasks(transformedTasks);
        } catch (error) {
            console.error('Error loading tasks:', error);
            alert('Unable to load tasks. Please check your connection and try again.');
            setTasks([]);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDateForDisplay = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'PENDING':
                return 'bg-blue-100 text-blue-800';
            case 'IN_PROGRESS':
                return 'bg-yellow-100 text-yellow-800';
            case 'COMPLETED':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'PENDING':
                return '⏸️';
            case 'IN_PROGRESS':
                return '▶️';
            case 'COMPLETED':
                return '✅';
            default:
                return '⏸️';
        }
    };

    const handleStatusUpdate = async (newStatus) => {
        if (!selectedTask) return;
        
        setIsUpdatingStatus(true);
        try {
            await updateTaskStatus(selectedTask.id, { status: newStatus });
            
            // Update local state
            const updatedTasks = tasks.map(task => 
                task.id === selectedTask.id 
                    ? { ...task, status: newStatus }
                    : task
            );
            setTasks(updatedTasks);
            setSelectedTask({ ...selectedTask, status: newStatus });
            
            alert(`Task status updated to ${newStatus.toLowerCase().replace('_', ' ')}`);
        } catch (error) {
            console.error('Error updating task status:', error);
            alert('Failed to update task status. Please try again.');
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    const handleFileUpload = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setUploadFiles([...uploadFiles, ...selectedFiles]);
    };

    const removeUploadFile = (index) => {
        const updatedFiles = [...uploadFiles];
        updatedFiles.splice(index, 1);
        setUploadFiles(updatedFiles);
    };

    const uploadDocuments = async () => {
        if (uploadFiles.length === 0) {
            alert('Please select files to upload');
            return;
        }

        setIsUploadingFiles(true);
        try {
            const result = await uploadMultipleDocumentsToTask(selectedTask.id, uploadFiles);
            
            if (result.successful.length > 0) {
                alert(`Successfully uploaded ${result.successful.length} file(s)`);
                setUploadFiles([]);
                // Refresh task documents
                await loadTaskDocuments(selectedTask.id);
            }
            
            if (result.failed.length > 0) {
                console.error('Failed uploads:', result.failed);
                alert(`${result.failed.length} file(s) failed to upload. Please try again.`);
            }
        } catch (error) {
            console.error('Error uploading documents:', error);
            alert('Failed to upload documents. Please try again.');
        } finally {
            setIsUploadingFiles(false);
        }
    };

    const loadTaskDocuments = async (taskId) => {
        try {
            const documents = await getTaskDocuments(taskId);
            setTaskDocuments(documents);
        } catch (error) {
            console.error('Error loading task documents:', error);
            // Don't show error alert for documents, as this is optional functionality
            setTaskDocuments([]);
        }
    };

    const handleRowClick = async (task) => {
        setSelectedTask(task);
        // Load documents for this task
        await loadTaskDocuments(task.id);
    };

    const closeModal = () => {
        setSelectedTask(null);
        setUploadFiles([]);
        setTaskDocuments([]);
    };

    const handleNotificationClick = () => {
        // Handle notification click
    };

    return (
        <PageLayout user={user}>
            {/* Page Title and Navigation */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Your Tasks</h1>
                    <p className="text-gray-600 mt-1">Manage your assigned tasks</p>
                </div>
                <div className="flex gap-2">
                    <Button2
                        text="Refresh"
                        onClick={loadMyTasks}
                        className="flex items-center gap-2"
                    >
                        <FaSyncAlt size={14} />
                    </Button2>
                </div>
            </div>

            {isLoading ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-gray-600">Loading your tasks...</p>
                </div>
            ) : (
                <>
                    {/* Task Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white rounded-lg shadow-md p-4">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                                    <div className="w-6 h-6 flex items-center justify-center font-bold">P</div>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {tasks.filter(task => task.status === 'PENDING').length}
                                    </p>
                                    <p className="text-gray-600">Pending Tasks</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-4">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                                    <div className="w-6 h-6 flex items-center justify-center font-bold">W</div>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {tasks.filter(task => task.status === 'IN_PROGRESS').length}
                                    </p>
                                    <p className="text-gray-600">In Progress</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-4">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                                    <div className="w-6 h-6 flex items-center justify-center font-bold">✓</div>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {tasks.filter(task => task.status === 'COMPLETED').length}
                                    </p>
                                    <p className="text-gray-600">Completed</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tasks Table */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">Your Assigned Tasks</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Case No.</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {tasks.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                                No tasks assigned to you yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        tasks.map((task) => (
                                            <tr
                                                key={task.id}
                                                className="cursor-pointer hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {task.title}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        Type: {task.type?.replace('_', ' ')}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {task.due}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900 max-w-xs truncate">
                                                        {task.des}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {task.case}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(task.status)}`}>
                                                        {getStatusIcon(task.status)}
                                                        <span className="ml-1">{task.status.replace('_', ' ')}</span>
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <Button2
                                                        text="View"
                                                        onClick={() => handleRowClick(task)}
                                                        className="flex items-center gap-1 text-xs px-2 py-1"
                                                    >
                                                        <FaEye size={12} />
                                                    </Button2>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {/* Enhanced Task Details Modal */}
            {selectedTask && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40"
                    onClick={closeModal}>
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl h-[90vh] overflow-y-auto relative"
                        onClick={(e) => e.stopPropagation()}>

                        <div className="flex items-center justify-between mb-6 border-b pb-4">
                            <h2 className="text-2xl font-semibold">Task Details</h2>
                            <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(selectedTask.status)}`}>
                                    {getStatusIcon(selectedTask.status)}
                                    <span className="ml-1">{selectedTask.status.replace('_', ' ')}</span>
                                </span>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-400 hover:text-gray-600 p-1"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Left Column - Task Info */}
                            <div className="space-y-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-lg mb-3">Task Information</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <span className="font-medium text-gray-700">Title:</span>
                                            <p className="text-gray-900 mt-1">{selectedTask.title}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-700">Type:</span>
                                            <p className="text-gray-900 mt-1">{selectedTask.type?.replace('_', ' ')}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-700">Due Date:</span>
                                            <p className="text-gray-900 mt-1">{formatDateTime(selectedTask.dueDate)}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-700">Assigned Date:</span>
                                            <p className="text-gray-900 mt-1">{formatDateTime(selectedTask.createdAt)}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-700">Assigned By:</span>
                                            <p className="text-gray-900 mt-1">{selectedTask.assignedBy}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-700">Case ID:</span>
                                            <p className="text-gray-900 mt-1">{selectedTask.caseId || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-700">Description:</span>
                                            <p className="text-gray-900 mt-1 whitespace-pre-wrap">{selectedTask.description}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Status Update Section */}
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-lg mb-3">Update Status</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedTask.status !== 'IN_PROGRESS' && (
                                            <Button1
                                                text={isUpdatingStatus ? "Updating..." : "Start Working"}
                                                onClick={() => handleStatusUpdate('IN_PROGRESS')}
                                                disabled={isUpdatingStatus}
                                                className="text-sm px-3 py-2"
                                            />
                                        )}
                                        {selectedTask.status !== 'COMPLETED' && selectedTask.status === 'IN_PROGRESS' && (
                                            <Button1
                                                text={isUpdatingStatus ? "Updating..." : "Mark Complete"}
                                                onClick={() => handleStatusUpdate('COMPLETED')}
                                                disabled={isUpdatingStatus}
                                                className="text-sm px-3 py-2 bg-green-600 hover:bg-green-700"
                                            />
                                        )}
                                        {selectedTask.status === 'IN_PROGRESS' && (
                                            <Button2
                                                text={isUpdatingStatus ? "Updating..." : "Pause"}
                                                onClick={() => handleStatusUpdate('PENDING')}
                                                disabled={isUpdatingStatus}
                                                className="text-sm px-3 py-2"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Documents */}
                            <div className="space-y-4">
                                {/* Document Upload Section */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-lg mb-3">Upload Documents</h3>
                                    
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 mb-4">
                                        <div className="text-center">
                                            <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-2">
                                                📎
                                            </div>
                                            <label className="cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                                                <span>Choose files to upload</span>
                                                <input
                                                    type="file"
                                                    multiple
                                                    onChange={handleFileUpload}
                                                    className="sr-only"
                                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                />
                                            </label>
                                            <p className="text-xs text-gray-500 mt-1">
                                                PDF, DOC, DOCX, JPG, PNG up to 10MB each
                                            </p>
                                        </div>
                                    </div>

                                    {uploadFiles.length > 0 && (
                                        <div className="space-y-2 mb-4">
                                            <h4 className="font-medium text-sm">Files to upload:</h4>
                                            {uploadFiles.map((file, index) => (
                                                <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                                                    <span className="text-sm truncate">{file.name}</span>
                                                    <button
                                                        onClick={() => removeUploadFile(index)}
                                                        className="text-red-600 hover:text-red-800 ml-2"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ))}
                                            <Button1
                                                text={isUploadingFiles ? "Uploading..." : "Upload All Files"}
                                                onClick={uploadDocuments}
                                                disabled={isUploadingFiles}
                                                className="w-full mt-2"
                                            />
                                        </div>
                                    )}

                                    {/* Existing Attachments */}
                                    <div>
                                        <h4 className="font-medium text-sm mb-2">Current Attachments:</h4>
                                        <div className="bg-white border rounded p-3">
                                            {taskDocuments.length === 0 ? (
                                                <div className="text-sm text-gray-600">
                                                    <em>No documents uploaded yet</em>
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    {taskDocuments.map((doc, index) => (
                                                        <div key={index} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                                                            <span className="flex items-center">
                                                                📄 {doc.fileName || `Document ${index + 1}`}
                                                            </span>
                                                            <button 
                                                                className="text-blue-600 hover:text-blue-800"
                                                                onClick={() => {
                                                                    // TODO: Implement document download
                                                                    alert('Document download will be implemented');
                                                                }}
                                                            >
                                                                ⬇️
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Close Button */}
                        <div className="mt-6 flex justify-end border-t pt-4">
                            <Button2
                                text="Close"
                                onClick={closeModal}
                                className="px-6 py-2"
                            />
                        </div>
                    </div>
                </div>
            )}

        </PageLayout>
    );
};

export default Tasks;
