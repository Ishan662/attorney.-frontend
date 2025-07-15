import React, { useState } from "react";
import PageHeader from "../../components/layout/PageHeader";
import PageLayout from "../../components/layout/PageLayout";
import Button1 from "../../components/UI/Button1";

const user = {
    name: 'Sujan Darshana',
    email: 'sujan@gmail.com',
    role: 'junior_lawyer'
};

const initialTasks = [
    { id: 1, title: "Draft Affidavit", due: "2024-07-11", status: "Pending", documents: [] },
    { id: 2, title: "Prepare Evidence", due: "2024-07-13", status: "In Progress", documents: [] },
    { id: 3, title: "File Court Documents", due: "2024-07-15", status: "Completed", documents: [] },
];

const Tasks = () => {
    const [notificationCount, setNotificationCount] = useState(1);
    const [tasks, setTasks] = useState(initialTasks);

    const handleNotificationClick = () => { };

    const handleAddDocument = (taskId) => {
        // Create a file input element
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.multiple = true;
        fileInput.accept = '.pdf,.doc,.docx,.txt,.jpg,.jpeg,.png';
        
        fileInput.onchange = (event) => {
            const files = Array.from(event.target.files);
            if (files.length > 0) {
                setTasks(prevTasks => 
                    prevTasks.map(task => 
                        task.id === taskId 
                            ? { 
                                ...task, 
                                documents: [...task.documents, ...files.map(file => ({
                                    id: Date.now() + Math.random(),
                                    name: file.name,
                                    size: file.size,
                                    type: file.type,
                                    file: file
                                }))]
                              }
                            : task
                    )
                );
            }
        };
        
        fileInput.click();
    };

    const handleRemoveDocument = (taskId, documentId) => {
        setTasks(prevTasks => 
            prevTasks.map(task => 
                task.id === taskId 
                    ? { 
                        ...task, 
                        documents: task.documents.filter(doc => doc.id !== documentId)
                      }
                    : task
            )
        );
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <PageLayout user={user}>
            <div className='mb-8'>
                <PageHeader
                    user={user}
                    notificationCount={notificationCount}
                    onNotificationClick={handleNotificationClick}
                />
            </div>
            <h1 className="text-2xl font-bold mb-6">Your Tasks</h1>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documents</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {tasks.map((task) => (
                            <tr key={task.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{task.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{task.due}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium
                        ${task.status === "Pending" ? "bg-yellow-100 text-yellow-800" : ""}
                        ${task.status === "In Progress" ? "bg-green-100 text-green-800" : ""}
                        ${task.status === "Completed" ? "bg-gray-200 text-gray-700" : ""}
                      `}>
                                        {task.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="space-y-2">
                                        <Button1
                                            onClick={() => handleAddDocument(task.id)}
                                            text="Add Document"
                                            className="text-sm py-1 px-4"
                                            
                                            Add Document
                                       />
                                        
                                        {task.documents.length > 0 && (
                                            <div className="mt-2 space-y-1">
                                                {task.documents.map((doc) => (
                                                    <div key={doc.id} className="flex items-center justify-between bg-gray-50 px-2 py-1 rounded text-xs">
                                                        <div className="flex items-center space-x-2">
                                                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                            <span className="truncate max-w-32" title={doc.name}>
                                                                {doc.name}
                                                            </span>
                                                            <span className="text-gray-400">
                                                                ({formatFileSize(doc.size)})
                                                            </span>
                                                        </div>
                                                        <button
                                                            onClick={() => handleRemoveDocument(task.id, doc.id)}
                                                            className="text-red-500 hover:text-red-700 ml-2"
                                                            title="Remove document"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </PageLayout>
    );
};

export default Tasks;
