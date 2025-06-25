
import { useState, useEffect } from "react";

/**
 * Reusable page header component with welcome message, date and notifications
 * @param {object} user - User object with name and other properties
 * @param {number} notificationCount - Number of unread notifications
 * @param {function} onNotificationClick - Handler for notification bell click
 */
const PageHeader = ({ 
    user, 
    notificationCount = 0,
    onNotificationClick = () => console.log("Notification clicked")
}) => {
    const [currentDate, setCurrentDate] = useState("");
    
    useEffect(() => {
        const today = new Date();
        const formattedDate = today.toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric'
        });
        setCurrentDate(formattedDate);
    }, []);

    return (
        <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-bold">Hello {user?.name || 'User'}, Welcome</h1>
            <div className="flex items-center gap-4">
                <div className="text-gray-500">Today is: {currentDate}</div>
                <div 
                    className="relative cursor-pointer"
                    onClick={onNotificationClick}
                >
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-6 w-6 text-gray-600 hover:text-gray-900 transition-colors" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
                        />
                    </svg>
                    {notificationCount > 0 && (
                        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                            {notificationCount}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PageHeader;