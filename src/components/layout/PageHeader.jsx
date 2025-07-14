import { useState, useEffect, useRef } from "react";

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
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationRef = useRef(null);
    
    // Sample notifications data
    const notifications = [
        {
            id: 1,
            message: "New message from John Doe",
            time: "10 minutes ago",
            read: false
        },
        {
            id: 2,
            message: "Upcoming hearing for Case #4323",
            time: "1 hour ago",
            read: false
        },
        {
            id: 3,
            message: "Payment received from Alice Johnson",
            time: "3 hours ago",
            read: true
        },
        {
            id: 4,
            message: "Document uploaded for review",
            time: "Yesterday",
            read: true
        }
    ];
    
    useEffect(() => {
        const today = new Date();
        const formattedDate = today.toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric'
        });
        setCurrentDate(formattedDate);
    }, []);
    
    // Close notifications when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        }
        
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [notificationRef]);
    
    // Handle notification bell click
    const handleNotificationClick = () => {
        setShowNotifications(!showNotifications);
        onNotificationClick();
    };
    
    // Mark all notifications as read
    const markAllAsRead = () => {
        console.log("Marked all notifications as read");
        // In a real app, you would update your state/backend here
    };

    return (
        <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-bold">Hello {user?.name || 'User'}, Welcome</h1>
            <div className="flex items-center gap-4">
                <div className="text-gray-500">Today is: {currentDate}</div>
                <div 
                    className="relative cursor-pointer"
                    onClick={handleNotificationClick}
                    ref={notificationRef}
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
                    
                    {/* Notification Dropdown */}
                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50 overflow-hidden">
                            <div className="py-2 px-4 bg-gray-100 flex justify-between items-center">
                                <h3 className="text-sm font-semibold text-gray-700">Notifications</h3>
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        markAllAsRead();
                                    }} 
                                    className="text-xs text-blue-600 hover:text-blue-800"
                                >
                                    Mark all as read
                                </button>
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                {notifications.length > 0 ? (
                                    <div>
                                        {notifications.map(notification => (
                                            <div 
                                                key={notification.id} 
                                                className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <p className={`text-sm ${!notification.read ? 'font-medium' : ''}`}>{notification.message}</p>
                                                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                                                    </div>
                                                    {!notification.read && (
                                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="px-4 py-6 text-center text-gray-500">
                                        No notifications
                                    </div>
                                )}
                            </div>
                            <div className="py-2 px-4 bg-gray-100 text-center">
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PageHeader;