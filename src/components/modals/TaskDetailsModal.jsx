import React, { useState, useEffect } from 'react';
import { FaTimes, FaDownload, FaEye, FaFileAlt, FaCalendarAlt, FaUser, FaClock, FaTag } from 'react-icons/fa';
import Button1 from '../UI/Button1';
import Button2 from '../UI/Button2';
import { getTaskDocuments, downloadDocument } from '../../services/documentService';
import { updateTaskStatus } from '../../services/taskService';
import Swal from 'sweetalert2';

const TaskDetailsModal = ({ isOpen, onClose, task, onTaskUpdate, userRole = 'LAWYER' }) => {
    const [documents, setDocuments] = useState([]);
    const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const [showFullDescription, setShowFullDescription] = useState(false);

    useEffect(() => {
        if (isOpen && task) {
            loadTaskDocuments();
        }
    }, [isOpen, task]);

    const loadTaskDocuments = async () => {
        if (!task?.id) return;
        
        setIsLoadingDocuments(true);
        try {
            const taskDocuments = await getTaskDocuments(task.id);
            setDocuments(taskDocuments || []);
        } catch (error) {
            console.error('Error loading task documents:', error);
            // Don't show error popup for this - just log it
            setDocuments([]);
        } finally {
            setIsLoadingDocuments(false);
        }
    };

    const handleDownloadDocument = async (document) => {
        try {
            const fileName = document.originalName || document.fileName || `document_${document.id}`;
            await downloadDocument(document.id, fileName);
            
            Swal.fire({
                icon: 'success',
                title: 'Download Started',
                text: `${fileName} download has started`,
                timer: 2000,
                showConfirmButton: false,
                toast: true,
                position: 'top-end'
            });
        } catch (error) {
            console.error('Error downloading document:', error);
            Swal.fire({
                icon: 'error',
                title: 'Download Failed',
                text: 'Unable to download the document. Please try again.',
                confirmButtonColor: '#EF4444'
            });
        }
    };

    const handleStatusUpdate = async (newStatus) => {
        if (!task?.id) return;
        
        setIsUpdatingStatus(true);
        try {
            const updatedTask = await updateTaskStatus(task.id, { status: newStatus });
            
            // Update the task in parent component
            if (onTaskUpdate) {
                onTaskUpdate(updatedTask);
            }
            
            Swal.fire({
                icon: 'success',
                title: 'Status Updated',
                text: `Task status updated to ${newStatus.replace('_', ' ').toLowerCase()}`,
                timer: 2000,
                showConfirmButton: false,
                toast: true,
                position: 'top-end'
            });
        } catch (error) {
            console.error('Error updating task status:', error);
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: 'Unable to update task status. Please try again.',
                confirmButtonColor: '#EF4444'
            });
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
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
        switch (status?.toLowerCase()) {
            case 'pending':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'in-progress':
            case 'in_progress':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'completed':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'cancelled':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getPriorityBadgeClass = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'urgent':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'high':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'low':
                return 'bg-green-100 text-green-800 border-green-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getFileIcon = (fileName) => {
        const extension = fileName?.split('.').pop()?.toLowerCase();
        switch (extension) {
            case 'pdf':
                return <div className="w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center text-xs font-bold">PDF</div>;
            case 'doc':
            case 'docx':
                return <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-xs font-bold">DOC</div>;
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return <div className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center text-xs font-bold">IMG</div>;
            default:
                return <FaFileAlt className="w-6 h-6 text-gray-500" />;
        }
    };

    const canUpdateStatus = () => {
        // Only juniors can update status, and only if they're assigned to the task
        return userRole === 'JUNIOR_LAWYER' || userRole === 'JUNIOR';
    };

    if (!isOpen || !task) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-gray-800 to-black px-6 py-4 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold">{task.title}</h2>
                            <p className="text-gray-300 text-sm mt-1">Task Details & Documents</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:text-gray-300 transition-colors"
                        >
                            <FaTimes size={20} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
                    <div className="p-6 space-y-6">
                        {/* Task Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left Column */}
                            <div className="space-y-4">
                                {/* Status and Priority */}
                                <div className="flex flex-wrap gap-3">
                                    <div className="flex items-center gap-2">
                                        <FaTag className="text-gray-400" />
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeClass(task.status || task.originalStatus)}`}>
                                            {(task.originalStatus || task.status)?.replace('_', ' ').replace('-', ' ').toUpperCase() || 'PENDING'}
                                        </span>
                                    </div>
                                    {task.priority && (
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityBadgeClass(task.priority)}`}>
                                            {task.priority.toUpperCase()} PRIORITY
                                        </span>
                                    )}
                                </div>

                                {/* Assigned To */}
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <FaUser className="text-gray-400" />
                                        <span className="text-sm font-medium">Assigned to:</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-medium">
                                            {task.assignedTo?.avatar || task.assignedTo?.name?.charAt(0) || 'U'}
                                        </div>
                                        <span className="font-medium">{task.assignedTo?.name || 'Unassigned'}</span>
                                    </div>
                                </div>

                                {/* Task Type */}
                                {task.type && (
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <FaFileAlt className="text-gray-400" />
                                        <span className="text-sm">Type: <span className="font-medium">{task.type.replace('_', ' ')}</span></span>
                                    </div>
                                )}

                                {/* Case ID */}
                                {task.caseId && (
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <FaFileAlt className="text-gray-400" />
                                        <span className="text-sm">Case ID: <span className="font-medium font-mono">{task.caseId}</span></span>
                                    </div>
                                )}

                                {/* Assigned By */}
                                {task.assignedBy && (
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <FaUser className="text-gray-400" />
                                        <span className="text-sm">Assigned by: <span className="font-medium">{task.assignedBy.name}</span></span>
                                    </div>
                                )}
                            </div>

                            {/* Right Column */}
                            <div className="space-y-4">
                                {/* Dates */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <FaCalendarAlt className="text-gray-400" />
                                        <span className="text-sm">Created: <span className="font-medium">{formatDate(task.createdAt)}</span></span>
                                    </div>
                                    {task.dueDate && (
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <FaClock className="text-gray-400" />
                                            <span className="text-sm">Due: <span className="font-medium text-red-600">{formatDate(task.dueDate)}</span></span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="text-lg font-semibold mb-3">Description</h3>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-gray-700 leading-relaxed">
                                    {showFullDescription || (task.description?.length || 0) <= 200
                                        ? task.description || 'No description provided'
                                        : `${task.description?.substring(0, 200)}...`}
                                </p>
                                {(task.description?.length || 0) > 200 && (
                                    <button
                                        onClick={() => setShowFullDescription(!showFullDescription)}
                                        className="text-blue-600 hover:text-blue-800 text-sm mt-2 font-medium"
                                    >
                                        {showFullDescription ? 'Show Less' : 'Show More'}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Status Update Section (Only for Juniors) */}
                        {canUpdateStatus() && (task.originalStatus || task.status)?.toLowerCase() !== 'completed' && (
                            <div>
                                <h3 className="text-lg font-semibold mb-3">Update Status</h3>
                                <div className="flex flex-wrap gap-2">
                                    {((task.originalStatus || task.status)?.toLowerCase() === 'pending') && (
                                        <Button1
                                            text="Start Working"
                                            onClick={() => handleStatusUpdate('IN_PROGRESS')}
                                            disabled={isUpdatingStatus}
                                            className="text-sm px-4 py-2"
                                        />
                                    )}
                                    {((task.originalStatus || task.status)?.toLowerCase() === 'in-progress' || 
                                      (task.originalStatus || task.status)?.toLowerCase() === 'in_progress') && (
                                        <Button1
                                            text="Mark Complete"
                                            onClick={() => handleStatusUpdate('COMPLETED')}
                                            disabled={isUpdatingStatus}
                                            className="text-sm px-4 py-2"
                                        />
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Documents Section */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">Attached Documents</h3>
                                <Button2
                                    text="Refresh"
                                    onClick={loadTaskDocuments}
                                    disabled={isLoadingDocuments}
                                    className="text-sm px-3 py-1"
                                />
                            </div>

                            {isLoadingDocuments ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    <span className="ml-3 text-gray-600">Loading documents...</span>
                                </div>
                            ) : documents.length > 0 ? (
                                <div className="space-y-3">
                                    {documents.map((doc, index) => (
                                        <div key={doc.id || index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors">
                                            <div className="flex items-center gap-3">
                                                {getFileIcon(doc.originalName || doc.fileName)}
                                                <div>
                                                    <h4 className="font-medium text-gray-900">
                                                        {doc.originalName || doc.fileName || `Document ${index + 1}`}
                                                    </h4>
                                                    <p className="text-sm text-gray-500">
                                                        {doc.fileSize && `${(doc.fileSize / 1024).toFixed(1)} KB • `}
                                                        Uploaded {formatDate(doc.uploadedAt || doc.createdAt)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button2
                                                    text={<FaEye />}
                                                    onClick={() => handleDownloadDocument(doc)}
                                                    className="text-sm px-3 py-2"
                                                    title="View/Download"
                                                />
                                                <Button1
                                                    text={<FaDownload />}
                                                    onClick={() => handleDownloadDocument(doc)}
                                                    className="text-sm px-3 py-2"
                                                    title="Download"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <FaFileAlt className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                                    <p>No documents attached to this task yet.</p>
                                    {userRole === 'JUNIOR' && (
                                        <p className="text-sm mt-2">Upload documents through the task management interface.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t px-6 py-4 bg-gray-50">
                    <div className="flex justify-end">
                        <Button2
                            text="Close"
                            onClick={onClose}
                            className="px-6 py-2"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetailsModal;
