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
    { id: 1, title: "Draft Affidavit", due: "2024-07-11", status: "Pending" },
    { id: 2, title: "Prepare Evidence", due: "2024-07-13", status: "In Progress" },
    { id: 3, title: "File Court Documents", due: "2024-07-15", status: "Completed" },
];

const Tasks = () => {
    const [notificationCount, setNotificationCount] = useState(1);
    const [tasks] = useState(initialTasks);

    const handleNotificationClick = () => { };

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
                                <td className="px-6 py-4 whitespace-nowrap"><Button1 text="Add Documents" className="mt-2" /></td> 
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </PageLayout>
    );
};

export default Tasks;