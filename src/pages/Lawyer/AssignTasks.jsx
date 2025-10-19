// filepath: d:\attorney\attorney.-frontend\src\pages\Lawyer\AssignTasks.jsx
import React, { useState, useEffect } from 'react';
import PageLayout from '../../components/layout/PageLayout';
import Button1 from '../../components/UI/Button1';
import Button2 from '../../components/UI/Button2';
import Input1 from '../../components/UI/Input1';
import TaskDetailsModal from '../../components/modals/TaskDetailsModal';
import { FaPlus, FaTasks, FaFilePdf, FaUserTie, FaTimes, FaCalendarAlt, FaSearch, FaFilter, FaSortAmountDown, FaEye } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { createTask, getAllFirmTasks, getTaskById } from '../../services/taskService';
import { getJuniorsForFirm } from '../../services/teamService';

const AssignTasks = () => {
    const { user } = useAuth(); // Use real auth context
    const [juniorLawyers, setJuniorLawyers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [showTaskDetailsModal, setShowTaskDetailsModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [selectedTaskForDetails, setSelectedTaskForDetails] = useState(null);
    const [taskHistory, setTaskHistory] = useState([]);
    const [taskFormData, setTaskFormData] = useState({
        title: '',
        description: '',
        assignedToUserId: '', // Changed to match backend API
        dueDate: '',
        type: 'DOCUMENT_REVIEW', // Changed to match backend API
        priority: 'medium',
        taskType: 'research',
        files: []
    });

    useEffect(() => {
        // Load real data from backend
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            // Load junior lawyers and tasks from backend
            const [juniorsResponse, tasksResponse] = await Promise.all([
                getJuniorsForFirm(),
                getAllFirmTasks()
            ]);

            // Transform backend data to match UI expectations
            const transformedJuniors = juniorsResponse.map(junior => ({
                id: junior.id,
                name: `${junior.firstName} ${junior.lastName}`,
                avatar: `${junior.firstName.charAt(0)}${junior.lastName.charAt(0)}`,
                specialization: junior.specialization || 'General Practice',
                email: junior.email
            }));

            // Transform backend tasks to match UI expectations
            const transformedTasks = tasksResponse.map(task => ({
                id: task.id,
                title: task.title,
                description: task.description,
                type: task.type,
                assignedTo: {
                    id: task.assignedToUser.id,
                    name: `${task.assignedToUser.firstName} ${task.assignedToUser.lastName}`,
                    avatar: `${task.assignedToUser.firstName.charAt(0)}${task.assignedToUser.lastName.charAt(0)}`
                },
                assignedBy: {
                    id: task.assignedByUser.id,
                    name: `${task.assignedByUser.firstName} ${task.assignedByUser.lastName}`
                },
                createdAt: task.createdAt,
                dueDate: task.dueDate,
                caseId: task.caseId,
                status: task.status.toLowerCase().replace('_', '-'), // Convert PENDING to pending, IN_PROGRESS to in-progress
                originalStatus: task.status // Keep original for API calls
            }));

            setJuniorLawyers(transformedJuniors);
            setTaskHistory(transformedTasks);
        } catch (error) {
            console.error('Error loading data:', error);
            // Fallback to showing some sample data or empty state with error message
            alert('Unable to connect to server. Please check your connection and try again.');
            setJuniorLawyers([]);
            setTaskHistory([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNewTask = () => {
        setTaskFormData({
            title: '',
            description: '',
            assignedToUserId: '', // Updated to match backend
            dueDate: '',
            type: 'DOCUMENT_REVIEW', // Updated to match backend
            priority: 'medium',
            taskType: 'research',
            files: []
        });
        setSelectedTask(null);
        setShowTaskModal(true);
    };

    const handleTaskFormChange = (e) => {
        const { name, value } = e.target;
        setTaskFormData({
            ...taskFormData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setTaskFormData({
            ...taskFormData,
            files: [...taskFormData.files, ...selectedFiles]
        });
    };

    const removeFile = (index) => {
        const updatedFiles = [...taskFormData.files];
        updatedFiles.splice(index, 1);
        setTaskFormData({
            ...taskFormData,
            files: updatedFiles
        });
    };

    const handleSubmitTask = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            // Prepare task data for backend API
            const taskData = {
                title: taskFormData.title,
                description: taskFormData.description,
                type: mapTaskTypeToBackend(taskFormData.taskType), // Convert UI task type to backend enum
                assignedToUserId: taskFormData.assignedToUserId,
                dueDate: taskFormData.dueDate + 'T23:59:59' // Add time to date
            };

            // Create task via backend API
            const newTask = await createTask(taskData);
            
            // Transform the created task to match UI expectations
            const assignedLawyer = juniorLawyers.find(lawyer => lawyer.id === taskFormData.assignedToUserId);
            const transformedTask = {
                id: newTask.id,
                title: newTask.title,
                description: newTask.description,
                type: newTask.type,
                assignedTo: {
                    id: newTask.assignedToUser ? newTask.assignedToUser.id : assignedLawyer?.id,
                    name: newTask.assignedToUser 
                        ? `${newTask.assignedToUser.firstName} ${newTask.assignedToUser.lastName}` 
                        : assignedLawyer?.name,
                    avatar: newTask.assignedToUser 
                        ? `${newTask.assignedToUser.firstName.charAt(0)}${newTask.assignedToUser.lastName.charAt(0)}` 
                        : assignedLawyer?.avatar
                },
                assignedBy: newTask.assignedByUser ? {
                    id: newTask.assignedByUser.id,
                    name: `${newTask.assignedByUser.firstName} ${newTask.assignedByUser.lastName}`
                } : null,
                createdAt: newTask.createdAt,
                dueDate: newTask.dueDate,
                caseId: newTask.caseId,
                status: newTask.status?.toLowerCase().replace('_', '-') || 'pending',
                originalStatus: newTask.status || 'PENDING'
            };
            
            // Update local state
            setTaskHistory([transformedTask, ...taskHistory]);
            
            setShowTaskModal(false);
            alert('Task assigned successfully!');
        } catch (error) {
            console.error('Error creating task:', error);
            const errorMessage = error.message || 'Failed to assign task. Please try again.';
            alert(`Error: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    // Helper function to map UI task types to backend enums
    const mapTaskTypeToBackend = (uiTaskType) => {
        const mapping = {
            'research': 'RESEARCH',
            'document': 'DOCUMENT_REVIEW',
            'court': 'FILING',
            'other': 'CASE_PREPARATION'
        };
        return mapping[uiTaskType] || 'DOCUMENT_REVIEW';
    };

    const formatDate = (dateString) => {
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
            case 'pending':
                return 'bg-blue-100 text-blue-800';
            case 'in-progress':
                return 'bg-yellow-100 text-yellow-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Handle viewing task details
    const handleViewTaskDetails = async (task) => {
        try {
            setIsLoading(true);
            // Fetch full task details from backend
            const fullTaskDetails = await getTaskById(task.id);
            setSelectedTaskForDetails(fullTaskDetails);
            setShowTaskDetailsModal(true);
        } catch (error) {
            console.error('Error loading task details:', error);
            // Fallback to using the task data we have
            setSelectedTaskForDetails(task);
            setShowTaskDetailsModal(true);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle task update from modal
    const handleTaskUpdate = (updatedTask) => {
        setTaskHistory(prevTasks => 
            prevTasks.map(task => 
                task.id === updatedTask.id 
                    ? { 
                        ...task, 
                        status: updatedTask.status?.toLowerCase().replace('_', '-'),
                        originalStatus: updatedTask.status 
                      }
                    : task
            )
        );
        setSelectedTaskForDetails({
            ...updatedTask,
            status: updatedTask.status?.toLowerCase().replace('_', '-'),
            originalStatus: updatedTask.status
        });
    };

    return (
        <PageLayout user={user}>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold">Task Assignment</h1>
                    <p className="text-gray-600">Assign tasks to junior lawyers in your team</p>
                </div>
                <Button1
                    text="Assign New Task"
                    onClick={handleNewTask}
                    className="flex items-center gap-2"
                >
                    <FaPlus size={14} />
                </Button1>
            </div>

            {isLoading ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-gray-600">Loading data...</p>
                </div>
            ) : (
                <>
                    {/* Junior Lawyers Grid */}
                    <h2 className="text-lg font-semibold mb-4">Junior Lawyers</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {juniorLawyers.map(lawyer => (
                            <div 
                                key={lawyer.id} 
                                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
                                onClick={() => {
                                    setTaskFormData({...taskFormData, assignedToUserId: lawyer.id.toString()});
                                    setShowTaskModal(true);
                                }}
                            >
                                <div className="flex items-center mb-3">
                                    <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-medium text-xl mr-3">
                                        {lawyer.avatar}
                                    </div>
                                    <div>
                                        <h3 className="font-medium">{lawyer.name}</h3>
                                        <p className="text-sm text-gray-600">{lawyer.specialization}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Recent Task Assignments */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                        <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                            <div>
                                <h2 className="text-lg font-semibold">Recent Task Assignments</h2>
                                <p className="text-sm text-gray-600">Click on any task row to view details and documents</p>
                            </div>
                            <div className="flex gap-2">
                                <Button2
                                    text="Refresh"
                                    onClick={loadData}
                                    className="text-sm px-3 py-1"
                                />
                                <Button2
                                    text="View All Tasks"
                                    onClick={() => window.location.href = "/lawyer/taskmanagement"}
                                    className="text-sm px-3 py-1"
                                />
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Date</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {taskHistory.map(task => (
                                        <tr key={task.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleViewTaskDetails(task)}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {task.title}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div className="flex items-center">
                                                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-medium mr-2">
                                                        {task.assignedTo.avatar}
                                                    </div>
                                                    {task.assignedTo.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(task.createdAt)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(task.dueDate)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(task.status)}`}>
                                                    {task.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    {/* Quick Task Categories */}
                    <h2 className="text-lg font-semibold mb-4">Quick Task Templates</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div 
                            className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-blue-500"
                            onClick={() => {
                                setTaskFormData({
                                    ...taskFormData,
                                    title: "Research case precedents",
                                    description: "Research relevant case precedents for the specified legal matter. Focus on recent judgments and closely related scenarios.",
                                    taskType: "research"
                                });
                                setShowTaskModal(true);
                            }}
                        >
                            <div className="flex items-center mb-3">
                                <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center mr-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <h3 className="font-medium">Research Assignment</h3>
                            </div>
                            <p className="text-sm text-gray-600">Assign legal research tasks to junior lawyers</p>
                        </div>
                        
                        <div 
                            className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-red-500"
                            onClick={() => {
                                setTaskFormData({
                                    ...taskFormData,
                                    title: "Draft legal document",
                                    description: "Create a draft of the specified legal document following our firm's templates and guidelines. Ensure all necessary sections are completed.",
                                    taskType: "document"
                                });
                                setShowTaskModal(true);
                            }}
                        >
                            <div className="flex items-center mb-3">
                                <div className="h-10 w-10 rounded-full bg-red-100 text-red-800 flex items-center justify-center mr-3">
                                    <FaFilePdf className="h-5 w-5" />
                                </div>
                                <h3 className="font-medium">Document Drafting</h3>
                            </div>
                            <p className="text-sm text-gray-600">Assign document drafting or review tasks</p>
                        </div>
                        
                        <div 
                            className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-green-500"
                            onClick={() => {
                                setTaskFormData({
                                    ...taskFormData,
                                    title: "Court filing preparation",
                                    description: "Prepare all necessary documents for court filing. Ensure all forms are properly completed and formatted according to court requirements.",
                                    taskType: "court"
                                });
                                setShowTaskModal(true);
                            }}
                        >
                            <div className="flex items-center mb-3">
                                <div className="h-10 w-10 rounded-full bg-green-100 text-green-800 flex items-center justify-center mr-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <h3 className="font-medium">Court Filing</h3>
                            </div>
                            <p className="text-sm text-gray-600">Assign court filing or procedure tasks</p>
                        </div>
                    </div>
                </>
            )}

            {/* Task Assignment Modal */}
            {showTaskModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold">Assign New Task</h2>
                                <button
                                    onClick={() => setShowTaskModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <FaTimes size={18} />
                                </button>
                            </div>
                        </div>
                        
                        <form onSubmit={handleSubmitTask} className="p-6">
                            <div className="space-y-6">
                                {/* Task Type */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Task Type
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                        <label className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-all ${taskFormData.taskType === 'research' ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'}`}>
                                            <input
                                                type="radio"
                                                name="taskType"
                                                value="research"
                                                checked={taskFormData.taskType === 'research'}
                                                onChange={handleTaskFormChange}
                                                className="sr-only"
                                            />
                                            <div className="text-center">
                                                <div className="mx-auto w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div className="text-sm">Research</div>
                                            </div>
                                        </label>
                                        
                                        <label className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-all ${taskFormData.taskType === 'document' ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'}`}>
                                            <input
                                                type="radio"
                                                name="taskType"
                                                value="document"
                                                checked={taskFormData.taskType === 'document'}
                                                onChange={handleTaskFormChange}
                                                className="sr-only"
                                            />
                                            <div className="text-center">
                                                <div className="mx-auto w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-1">
                                                    <FaFilePdf className="h-5 w-5" />
                                                </div>
                                                <div className="text-sm">Document</div>
                                            </div>
                                        </label>
                                        
                                        <label className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-all ${taskFormData.taskType === 'court' ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'}`}>
                                            <input
                                                type="radio"
                                                name="taskType"
                                                value="court"
                                                checked={taskFormData.taskType === 'court'}
                                                onChange={handleTaskFormChange}
                                                className="sr-only"
                                            />
                                            <div className="text-center">
                                                <div className="mx-auto w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div className="text-sm">Court Filing</div>
                                            </div>
                                        </label>
                                        
                                        <label className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-all ${taskFormData.taskType === 'other' ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'}`}>
                                            <input
                                                type="radio"
                                                name="taskType"
                                                value="other"
                                                checked={taskFormData.taskType === 'other'}
                                                onChange={handleTaskFormChange}
                                                className="sr-only"
                                            />
                                            <div className="text-center">
                                                <div className="mx-auto w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                                    </svg>
                                                </div>
                                                <div className="text-sm">Other</div>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                {/* Junior Lawyer Selection */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Assign To
                                    </label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {juniorLawyers.map(lawyer => (
                                            <label
                                                key={lawyer.id}
                                                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                                                    taskFormData.assignedToUserId === lawyer.id.toString() 
                                                    ? 'bg-blue-50 border-blue-300' 
                                                    : 'hover:bg-gray-50'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="assignedToUserId"
                                                    value={lawyer.id}
                                                    checked={taskFormData.assignedToUserId === lawyer.id.toString()}
                                                    onChange={handleTaskFormChange}
                                                    className="sr-only"
                                                />
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-medium mr-3">
                                                        {lawyer.avatar}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">{lawyer.name}</div>
                                                        <div className="text-xs text-gray-500">{lawyer.specialization}</div>
                                                    </div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Task Title and Description */}
                                <div>
                                    <Input1
                                        label="Task Title"
                                        name="title"
                                        value={taskFormData.title}
                                        onChange={handleTaskFormChange}
                                        placeholder="Enter task title"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Task Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={taskFormData.description}
                                        onChange={handleTaskFormChange}
                                        placeholder="Provide detailed instructions for this task"
                                        rows={4}
                                        className="w-full text-md py-3 px-4 rounded-lg bg-white border-2 border-gray-300 text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-all"
                                        required
                                    ></textarea>
                                </div>

                                {/* Due Date and Priority */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Due Date
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FaCalendarAlt className="text-gray-400" />
                                            </div>
                                            <input
                                                type="date"
                                                name="dueDate"
                                                value={taskFormData.dueDate}
                                                onChange={handleTaskFormChange}
                                                className="w-full text-md py-3 pl-10 pr-4 rounded-lg bg-white border-2 border-gray-300 text-gray-800 focus:border-blue-500 focus:outline-none transition-all"
                                                min={new Date().toISOString().split('T')[0]}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Priority
                                        </label>
                                        <select
                                            name="priority"
                                            value={taskFormData.priority}
                                            onChange={handleTaskFormChange}
                                            className="w-full text-md py-3 px-4 rounded-lg bg-white border-2 border-gray-300 text-gray-800 focus:border-blue-500 focus:outline-none transition-all"
                                            required
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                            <option value="urgent">Urgent</option>
                                        </select>
                                    </div>
                                </div>

                                {/* File Attachments */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Attach Files
                                    </label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                                        <div className="space-y-1 text-center">
                                            <svg
                                                className="mx-auto h-12 w-12 text-gray-400"
                                                stroke="currentColor"
                                                fill="none"
                                                viewBox="0 0 48 48"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                    strokeWidth={2}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                            <div className="flex text-sm text-gray-600 justify-center">
                                                <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                                    <span>Upload files</span>
                                                    <input
                                                        type="file"
                                                        multiple
                                                        onChange={handleFileChange}
                                                        className="sr-only"
                                                    />
                                                </label>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                PDF, DOCX, JPG up to 10MB each
                                            </p>
                                        </div>

                                        {taskFormData.files.length > 0 && (
                                            <ul className="mt-4 border-t pt-4 space-y-2">
                                                {taskFormData.files.map((file, index) => (
                                                    <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                                                        <div className="flex items-center">
                                                            <FaFilePdf className="text-red-500 mr-2" />
                                                            <span className="text-sm truncate max-w-xs">{file.name}</span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeFile(index)}
                                                            className="text-red-600 hover:text-red-800"
                                                        >
                                                            <FaTimes />
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end space-x-3">
                                <Button2
                                    text="Cancel"
                                    onClick={() => setShowTaskModal(false)}
                                    className="px-4 py-2"
                                />
                                <Button1
                                    type="submit"
                                    text={isLoading ? "Assigning..." : "Assign Task"}
                                    disabled={isLoading || !taskFormData.assignedToUserId || !taskFormData.title || !taskFormData.description || !taskFormData.dueDate}
                                    className="px-4 py-2"
                                />
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Task Details Modal */}
            <TaskDetailsModal
                isOpen={showTaskDetailsModal}
                onClose={() => {
                    setShowTaskDetailsModal(false);
                    setSelectedTaskForDetails(null);
                }}
                task={selectedTaskForDetails}
                onTaskUpdate={handleTaskUpdate}
                userRole={user?.role || 'LAWYER'}
            />
        </PageLayout>
    );
};

export default AssignTasks;