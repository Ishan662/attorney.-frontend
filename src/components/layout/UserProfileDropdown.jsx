import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/authService';

const UserProfileDropdown = ({ user, expanded }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = () => {
        // Add your logout logic here
        logout();
        navigate('/user/login');
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Function to truncate email if needed
    const truncateEmail = (email, maxLength = 18) => {
        if (!email || email.length <= maxLength) return email;

        const atIndex = email.indexOf('@');
        if (atIndex <= 0) return email.substring(0, maxLength) + '...';

        // Keep the domain part visible if possible
        const username = email.substring(0, atIndex);
        const domain = email.substring(atIndex);

        // If username is very short, truncate the domain
        if (username.length <= 5) {
            const availableSpace = maxLength - username.length;
            if (availableSpace >= 5) { // Ensure we show at least a few chars of domain
                return username + domain.substring(0, availableSpace) + '...';
            }
        }

        // Otherwise truncate the username
        const availableSpace = maxLength - 3 - domain.length; // 3 for ellipsis
        if (availableSpace > 1) {
            return username.substring(0, availableSpace) + '...' + domain;
        }

        // Fallback: just truncate everything
        return email.substring(0, maxLength) + '...';
    };

    return (
        <div ref={dropdownRef} className="relative">
            {/* User profile button */}
            <div
                onClick={toggleDropdown}
                className="flex items-center cursor-pointer p-4 border-t border-gray-800 hover:bg-gray-900"
            >
                <div className="p-2 bg-gray-800 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="white">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                {expanded && (
                    <div className="ml-3 max-w-[150px]">
                        <p className="font-bold text-sm whitespace-nowrap overflow-hidden text-ellipsis" title={user.name}>
                            {user.name}
                        </p>
                        <p
                            className="text-xs text-gray-400 whitespace-nowrap overflow-hidden text-ellipsis"
                            title={user.email}
                        >
                            {truncateEmail(user.email)}
                        </p>
                    </div>
                )}
            </div>

            {/* Dropdown menu */}
            {isOpen && (
                <div
                    className={`absolute ${expanded ? 'right-4 bottom-16' : 'left-16 bottom-0'} 
                bg-white text-black shadow-lg rounded-lg w-48 py-2 z-10`}
                >
                    <div className="px-4 py-2 border-b border-gray-200">
                        <p className="font-bold" title={user.name}>{user.name}</p>
                        <p
                            className="text-xs text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis"
                            title={user.email}
                        >
                            {user.email}
                        </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 hover:bg-gray-100 text-left"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserProfileDropdown;