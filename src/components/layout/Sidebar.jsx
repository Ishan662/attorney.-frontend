import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/images/white_logo.png';
import miniLogo from '../../assets/images/mini_logo_white.png';
import UserProfileDropdown from './UserProfileDropdown';

/**
 * Reusable sidebar component
 * @param {Array} menuItems - Array of menu items to display
 * @param {Object} user - User information to display at the bottom
 * @param {boolean} defaultExpanded - Whether the sidebar is expanded by default
 * @param {string} className - Additional CSS classes
 */
const Sidebar = ({
    menuItems = defaultMenuItems,
    user = null,
    defaultExpanded = true,
    className = '',
}) => {
    const [expanded, setExpanded] = useState(defaultExpanded);
    const location = useLocation();

    // Toggle sidebar expanded state
    const toggleSidebar = () => {
        setExpanded(!expanded);
    };

    return (
        <div className="relative">
            <aside
                className={`
                    flex flex-col h-screen bg-black text-white transition-all duration-300
                    ${expanded ? 'w-64' : 'w-20'} 
                    ${className}
                `}
            >
                {/* Logo only */}
                <div className="p-5">
                    <Link to="/dashboard" className="flex items-center">
                        {expanded ? (
                            <img src={logo} alt="attorney." className="h-8" />
                        ) : (
                            <img src={miniLogo} alt="a." className="h-6" />
                        )}
                    </Link>
                </div>

                {/* Menu items */}
                <nav className="mt-5 flex-grow">
                    <ul>
                        {menuItems.map((item, index) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <li key={index} className="px-3 py-2">
                                    <Link
                                        to={item.path}
                                        className={`
                                            flex items-center p-3 rounded-lg transition-colors
                                            ${isActive ? 'bg-gray-100 text-black' : 'text-white hover:bg-gray-800'}
                                        `}
                                    >
                                        <span className="text-xl">{item.icon}</span>
                                        {expanded && <span className="ml-3 text-sm font-bold">{item.label}</span>}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* User profile dropdown */}
                {user && (
                    <div className="mt-auto">
                        <UserProfileDropdown user={user} expanded={expanded} />
                    </div>
                )}
            </aside>

            {/* Toggle button positioned at the edge of the sidebar */}
            <button
                onClick={toggleSidebar}
                className="absolute top-5 -right-3 p-1 w-6 h-6 bg-black rounded-full 
                         hover:bg-gray-800 text-white shadow-md flex items-center justify-center"
            >
                {expanded ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                )}
            </button>
        </div>
    );
};


// Default menu items with SVG icons instead of emojis
const defaultMenuItems = [
    {
        label: 'Dashboard',
        path: '/dashboard',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
        ),
    },
    {
        label: 'Case profiles',
        path: '/case-profiles',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        ),
    },
    {
        label: 'Calendar',
        path: '/calendar',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        ),
    },
    {
        label: 'Case Details',
        path: '/case-details',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
    },
    {
        label: 'Payments',
        path: '/payments',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
        ),
    },
    {
        label: 'Account Users',
        path: '/account-users',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
        ),
    },
];

export default Sidebar;