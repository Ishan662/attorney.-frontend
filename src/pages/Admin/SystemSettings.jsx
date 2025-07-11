import React, { useState } from 'react';
import PageLayout from '../../components/layout/PageLayout';
import PageHeader from '../../components/layout/PageHeader';
import Button1 from '../../components/UI/Button1';
import Button2 from '../../components/UI/Button2';
import Input1 from '../../components/UI/Input1';
import { useNavigate } from 'react-router-dom';

const SystemSettings = () => {
    const navigate = useNavigate();
    const [notificationCount, setNotificationCount] = useState(3);
    const [activeSection, setActiveSection] = useState('general');
    const [formData, setFormData] = useState({
        // General Settings
        companyName: 'Attorney Management System',
        supportEmail: 'support@lawyermanagement.com',
        timezone: 'Asia/Colombo',
        dateFormat: 'DD/MM/YYYY',
        currency: 'USD',
        
        // User Settings
        defaultUserRole: 'client',
        autoApproveUsers: false,
        allowSelfRegistration: true,
        userPasswordPolicy: 'strong',
        
        // Notification Settings
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        notifyOnNewUsers: true,
        notifyOnCaseUpdates: true,
        notifyOnPayments: true,
        
        // Security Settings
        twoFactorAuth: 'optional',
        sessionTimeout: '30',
        maxLoginAttempts: '5',
        passwordExpiryDays: '90',
        
        // Backup Settings
        automaticBackups: true,
        backupFrequency: 'daily',
        maxBackupCount: '7',
        backupLocation: 'cloud',
    });
    
    // Admin user data
    const user = {
        name: 'Admin',
        email: 'admin@lawyermanagement.com',
        role: 'admin'
    };

    const handleNotificationClick = () => {
        console.log('Admin notifications clicked');
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSaveSettings = (section) => {
        console.log(`Saving ${section} settings:`, formData);
        // Here you would implement the actual API call to save settings
        
        // Show success message
        alert(`${section.charAt(0).toUpperCase() + section.slice(1)} settings saved successfully!`);
    };

    const handleBackupNow = () => {
        console.log('Starting manual system backup');
        // Here you would implement the actual backup process
        alert('System backup started. This may take a few minutes.');
    };

    const handleRestoreSystem = () => {
        const confirmRestore = window.confirm('Are you sure you want to restore the system from a backup? This will replace all current data.');
        if (confirmRestore) {
            console.log('Initiating system restore process');
            // Here you would implement the actual restore process
        }
    };

    const handleClearCache = () => {
        console.log('Clearing system cache');
        // Here you would implement the cache clearing process
        alert('System cache cleared successfully!');
    };

    // Sidebar navigation for settings
    const settingsSections = [
        { id: 'general', label: 'General Settings', icon: 'settings' },
        { id: 'users', label: 'User Management', icon: 'people' },
        { id: 'notifications', label: 'Notification Settings', icon: 'notifications' },
        { id: 'security', label: 'Security & Privacy', icon: 'shield' },
    ];

    // SVG icons for the settings sidebar.
    const getIcon = (iconName) => {
        switch(iconName) {
            case 'settings':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                );
            case 'people':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                );
            case 'notifications':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                );
            case 'shield':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                );
            case 'build':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <PageLayout user={user}>
            {/* PageHeader component */}
            <div className="mb-8">
                <PageHeader 
                    user={user} 
                    notificationCount={notificationCount} 
                    onNotificationClick={handleNotificationClick}
                />
            </div>

            {/* Page Title and Back button */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold">System Settings</h1>
                    <p className="text-gray-600">Configure and manage system preferences</p>
                </div>
            </div>

            {/* Settings Layout with Sidebar */}
            <div className="flex flex-col md:flex-row gap-6">
                {/* Settings Navigation */}
                <div className="w-full md:w-64 bg-white rounded-lg shadow-md p-4">
                    <div className="text-sm font-medium text-gray-500 mb-4">SETTINGS</div>
                    <nav className="space-y-1">
                        {settingsSections.map((section) => (
                            <button
                                key={section.id}
                                className={`flex items-center px-3 py-2 w-full text-sm font-medium rounded-md ${
                                    activeSection === section.id
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                                onClick={() => setActiveSection(section.id)}
                            >
                                <span className="mr-3">{getIcon(section.icon)}</span>
                                {section.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Settings Content */}
                <div className="flex-1 bg-white rounded-lg shadow-md p-6">
                    {/* General Settings */}
                    {activeSection === 'general' && (
                        <div>
                            <h2 className="text-lg font-semibold mb-6">General Settings</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <Input1
                                    label="Company Name"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleInputChange}
                                />
                                <Input1
                                    label="Support Email"
                                    name="supportEmail"
                                    type="email"
                                    value={formData.supportEmail}
                                    onChange={handleInputChange}
                                />
                                
                                
                            </div>
                            
                            <div className="mt-8 flex justify-end">
                                <Button1
                                    text="Save General Settings"
                                    onClick={() => handleSaveSettings('general')}
                                    className="py-2 px-6"
                                />
                            </div>
                        </div>
                    )}

                    {/* User Management Settings */}
                    {activeSection === 'users' && (
                        <div>
                            <h2 className="text-lg font-semibold mb-6">User Management</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div>
                                    <label className="block font-medium mb-1">Default User Role</label>
                                    <select
                                        name="defaultUserRole"
                                        value={formData.defaultUserRole}
                                        onChange={handleInputChange}
                                        className="w-full text-md py-3 px-4 rounded-full bg-white border-2 border-gray-300 text-gray-800 placeholder-gray-500 focus:border-black transition-all duration-200 focus:outline-none"
                                    >
                                        <option value="client">Client</option>
                                        <option value="junior_lawyer">Junior Lawyer</option>
                                        <option value="lawyer">Senior Lawyer</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block font-medium mb-1">Password Policy</label>
                                    <select
                                        name="userPasswordPolicy"
                                        value={formData.userPasswordPolicy}
                                        onChange={handleInputChange}
                                        className="w-full text-md py-3 px-4 rounded-full bg-white border-2 border-gray-300 text-gray-800 placeholder-gray-500 focus:border-black transition-all duration-200 focus:outline-none"
                                    >
                                        <option value="basic">Basic (at least 6 characters)</option>
                                        <option value="medium">Medium (8+ chars, letters and numbers)</option>
                                        <option value="strong">Strong (8+ chars with uppercase, numbers, symbols)</option>
                                    </select>
                                </div>
                            </div>
                            
                            
                            
                            <div className="mt-8 flex justify-end">
                                <Button1
                                    text="Save User Settings"
                                    onClick={() => handleSaveSettings('users')}
                                    className="py-2 px-6"
                                />
                            </div>
                        </div>
                    )}

                    {/* Notification Settings */}
                    {activeSection === 'notifications' && (
                        <div>
                            <h2 className="text-lg font-semibold mb-6">Notification Settings</h2>
                            
                            <div className="mb-8">
                                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                    <h3 className="font-medium mb-3">Notification Channels</h3>
                                    
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-medium">Email Notifications</h4>
                                                <p className="text-sm text-gray-500">Send system notifications via email</p>
                                            </div>
                                            <div className="flex items-center">
                                                <label className="inline-flex relative items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        name="emailNotifications"
                                                        checked={formData.emailNotifications}
                                                        onChange={handleInputChange}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                </label>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-medium">SMS Notifications</h4>
                                                <p className="text-sm text-gray-500">Send important notifications via SMS</p>
                                            </div>
                                            <div className="flex items-center">
                                                <label className="inline-flex relative items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        name="smsNotifications"
                                                        checked={formData.smsNotifications}
                                                        onChange={handleInputChange}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                </label>
                                            </div>
                                        </div>
                                        
                                    </div>
                                </div>
                                
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="font-medium mb-3">Notification Events</h3>
                                    
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-medium">New User Registrations</h4>
                                                <p className="text-sm text-gray-500">Notify administrators about new users</p>
                                            </div>
                                            <div className="flex items-center">
                                                <label className="inline-flex relative items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        name="notifyOnNewUsers"
                                                        checked={formData.notifyOnNewUsers}
                                                        onChange={handleInputChange}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                </label>
                                            </div>
                                        </div>
                                        

                                        
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-medium">Payment Events</h4>
                                                <p className="text-sm text-gray-500">Notifications about payments received or due</p>
                                            </div>
                                            <div className="flex items-center">
                                                <label className="inline-flex relative items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        name="notifyOnPayments"
                                                        checked={formData.notifyOnPayments}
                                                        onChange={handleInputChange}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-8 flex justify-end">
                                <Button1
                                    text="Save Notification Settings"
                                    onClick={() => handleSaveSettings('notifications')}
                                    className="py-2 px-6"
                                />
                            </div>
                        </div>
                    )}

                    {/* Security Settings */}
                    {activeSection === 'security' && (
                        <div>
                            <h2 className="text-lg font-semibold mb-6">Security & Privacy</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"> 
                                
                                <div>
                                    <label className="block font-medium mb-1">Session Timeout (minutes)</label>
                                    <input
                                        type="number"
                                        name="sessionTimeout"
                                        value={formData.sessionTimeout}
                                        onChange={handleInputChange}
                                        min="5"
                                        max="240"
                                        className="w-full text-md py-3 px-4 rounded-full bg-white border-2 border-gray-300 text-gray-800 placeholder-gray-500 focus:border-black transition-all duration-200 focus:outline-none"
                                    />
                                </div>
                                

                            </div>
                            
                            <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 mb-8">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="font-medium text-yellow-800">Security Recommendations</h3>
                                        <div className="mt-2 text-sm text-yellow-700">
                                            <ul className="list-disc pl-5 space-y-1">
                                                <li>Enable two-factor authentication for all administrators</li>
                                                <li>Set reasonable session timeouts to prevent unauthorized access</li>
                                                <li>Enforce strong password policies for all users</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-8 flex justify-end">
                                <Button1
                                    text="Save Security Settings"
                                    onClick={() => handleSaveSettings('security')}
                                    className="py-2 px-6"
                                />
                            </div>
                        </div>
                    )}

                    
                </div>
            </div>
        </PageLayout>
    );
};

export default SystemSettings;