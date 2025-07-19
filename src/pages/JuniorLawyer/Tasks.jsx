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
    { id: 1, title: "Draft Affidavit", due: "2024-07-11", des: "adddd", case: "23E4" },
    { id: 2, title: "Prepare Evidence", due: "2024-07-13", des: "edwedbwe", case: "23E4" },
    { id: 3, title: "File Court Documents", due: "2024-07-15", des: "ghjhghjg", case: "23E4" },
];

const Tasks = () => {
    const [notificationCount, setNotificationCount] = useState(1);
    const [tasks] = useState(initialTasks);
    const [selectedTask, setSelectedTask] = useState(null); // For modal

    const handleNotificationClick = () => { };

    const handleRowClick = (task) => {
        setSelectedTask(task);
    };

    const closeModal = () => {
        setSelectedTask(null);
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
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Case No:</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {tasks.map((task) => (
                            <tr
                                key={task.id}
                                onClick={() => handleRowClick(task)}
                                className="cursor-pointer hover:bg-gray-100"
                            >
                                <td className="px-6 py-4 whitespace-nowrap">{task.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{task.due}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{task.des}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{task.case}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

           {selectedTask && (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl h-[80vh] overflow-y-auto relative">
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Task Details</h2>

            {/* Task Info */}
            <div className="mb-4 space-y-1">
                <p><strong>Title:</strong> {selectedTask.title}</p>
                <p><strong>Due Date:</strong> {selectedTask.due}</p>
                <p><strong>Description:</strong> {selectedTask.des}</p>
                <p><strong>Case No:</strong> {selectedTask.case}</p>    
            </div>

            {/* Document Upload */}
            <div className="border-t pt-4 mt-6">
                <h3 className="text-lg font-semibold mb-2">Upload Documents</h3>
                <input
                    type="file"
                    className="mb-2"
                    multiple
                />
                <Button1 className="mt-2">
                    Upload
                </Button1>

                {/* Uploaded Files Preview */}
                <div className="bg-gray-100 p-4 rounded mt-4">
                    <h4 className="font-semibold mb-2 text-sm text-gray-700">Attachments</h4>
                    <ul className="list-disc list-inside text-sm text-gray-800">
                        <li><a href="" download  className="text-blue-600 hover:underline">Affidavit_Draft.pdf</a></li>
                        <li><a href="" download  className="text-blue-600 hover:underline">Evidence_Photograph.jpg</a></li>
                    </ul>
                </div>
            </div>

            {/* Comment Section */}
            <div className="border-t pt-4 mt-6">
                <h3 className="text-lg font-semibold mb-2">Comments</h3>
                <textarea
                    rows="3"
                    placeholder="Leave a comment..."
                    className="w-full border rounded-lg p-2 mb-4 focus:outline-none focus:ring focus:ring-black-500"
                ></textarea>
                <Button1 className="mt-2">
                    Comment
                </Button1>
            </div>

            {/* Close Button */}
            <div className="mt-6 text-right">
                <Button1
                    className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-900"
                    onClick={closeModal}
                >
                    Close
                </Button1>
            </div>
        </div>
    </div>
)}


        </PageLayout>
    );
};

export default Tasks;
