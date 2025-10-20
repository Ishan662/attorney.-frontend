import React, { useState, useEffect, useRef } from 'react';
import { BellIcon } from '@heroicons/react/24/outline'; // Example icon library

const PageHeader = ({
    user,
    notificationCount = 0,
    onNotificationClick = () => {},
    subscription,
    onCancelSubscription = () => {}
}) => {
    const [currentDate, setCurrentDate] = useState("");
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationRef = useRef(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const today = new Date();
        const formattedDate = today.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
        setCurrentDate(formattedDate);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [notificationRef, dropdownRef]);

    const getPlanDisplayName = () => {
        if (!subscription) return '';

        if (subscription.status === 'ACTIVE') {
            return 'Pro Plan'; // Hardcoded as per your request
        }

        if (subscription.status === 'CANCELLED') {
            return 'Cancelled Plan'; // Hardcoded as per your request
        }
        
        if (subscription.planName) {
            return subscription.planName.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
        }

        return 'Free Plan';
    };

    const getPlanStyle = (status) => {
        switch (status) {
            case 'ACTIVE': return 'bg-green-100 text-green-800 hover:bg-green-200';
            case 'TRIAL': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
            case 'CANCELLED': return 'bg-red-100 text-red-800 hover:bg-red-200';
            default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
        }
    };

    return (
        <div className="flex justify-between items-center w-full">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Hello {user?.name?.split(' ')[0] || 'User'}, Welcome</h1>
                <p className="text-gray-500">{currentDate}</p>
            </div>
            <div className="flex items-center gap-6">
                
                {subscription && (
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-transform hover:scale-105 ${getPlanStyle(subscription.status)}`}
                        >
                            <span>{getPlanDisplayName()}</span>
                            <svg className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </button>
                        
                        {isDropdownOpen && subscription.status === 'ACTIVE' && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border z-10">
                                <button
                                    onClick={() => {
                                        onCancelSubscription();
                                        setIsDropdownOpen(false);
                                    }}
                                    className="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    Cancel Subscription
                                </button>
                            </div>
                        )}
                    </div>
                )}
                
                <div className="relative" ref={notificationRef}>
                    <button onClick={() => { onNotificationClick(); setShowNotifications(!showNotifications); }} className="relative p-2 rounded-full hover:bg-gray-100">
                        <BellIcon className="h-6 w-6 text-gray-600" />
                        {notificationCount > 0 && (
                            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                                {notificationCount}
                            </div>
                        )}
                    </button>
                    {/* You can add your notification dropdown panel here if needed */}
                </div>
            </div>
        </div>
    );
};

export default PageHeader;