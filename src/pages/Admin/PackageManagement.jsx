import React, { useState, useEffect } from 'react';
import PageLayout from '../../components/layout/PageLayout';
import PageHeader from '../../components/layout/PageHeader';
import Button1 from '../../components/UI/Button1';
import Button2 from '../../components/UI/Button2';
import Input1 from '../../components/UI/Input1';
import { useNavigate } from 'react-router-dom';

const PackageManagement = () => {
    const navigate = useNavigate();
    const [notificationCount, setNotificationCount] = useState(3);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentPackage, setCurrentPackage] = useState(null);
    
    // Admin user data
    const user = {
        name: 'Admin',
        email: 'admin@lawyermanagement.com',
        role: 'admin'
    };

    // Initial packages
    const [packages, setPackages] = useState([
        {
            id: 1,
            name: "Basic",
            price: 29.99,
            billingCycle: "monthly",
            description: "Essential features for small practices",
            userLimit: 3,
            active: true,
            features: {
                caseManagement: true,
                clientManagement: true,
                documentStorage: true,
                calendar: false,
                billing: true,
                timeTracking: false,
                reports: false,
                messaging: true,
                notifications: true,
                timeline: false,
                multiUser: false,
                api: false
            }
        },
        {
            id: 2,
            name: "Professional",
            price: 59.99,
            billingCycle: "monthly",
            description: "Complete solution for growing law firms",
            userLimit: 10,
            active: true,
            features: {
                caseManagement: true,
                clientManagement: true,
                documentStorage: true,
                calendar: true,
                billing: true,
                timeTracking: true,
                reports: true,
                messaging: true,
                notifications: true,
                timeline: true,
                multiUser: true,
                api: false
            }
        },
        {
            id: 3,
            name: "Enterprise",
            price: 99.99,
            billingCycle: "monthly",
            description: "Advanced features for large legal practices",
            userLimit: 50,
            active: true,
            features: {
                caseManagement: true,
                clientManagement: true,
                documentStorage: true,
                calendar: true,
                billing: true,
                timeTracking: true,
                reports: true,
                messaging: true,
                notifications: true,
                timeline: true,
                multiUser: true,
                api: true
            }
        }
    ]);

    const [newPackage, setNewPackage] = useState({
        name: "",
        price: "",
        billingCycle: "monthly",
        description: "",
        userLimit: "",
        active: true,
        features: {
            caseManagement: true,
            clientManagement: true,
            documentStorage: true,
            calendar: false,
            billing: true,
            timeTracking: false,
            reports: false,
            messaging: true,
            notifications: true,
            timeline: false,
            multiUser: false,
            api: false
        }
    });

    const handleNotificationClick = () => {
        console.log('Admin notifications clicked');
    };

    const openAddModal = () => {
        setIsAddModalOpen(true);
    };

    const openEditModal = (pkg) => {
        setCurrentPackage(pkg);
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (pkg) => {
        setCurrentPackage(pkg);
        setIsDeleteModalOpen(true);
    };

    const closeAllModals = () => {
        setIsAddModalOpen(false);
        setIsEditModalOpen(false);
        setIsDeleteModalOpen(false);
        setCurrentPackage(null);
        resetNewPackageForm();
    };

    const resetNewPackageForm = () => {
        setNewPackage({
            name: "",
            price: "",
            billingCycle: "monthly",
            description: "",
            userLimit: "",
            active: true,
            features: {
                caseManagement: true,
                clientManagement: true,
                documentStorage: true,
                calendar: false,
                billing: true,
                timeTracking: false,
                reports: false,
                messaging: true,
                notifications: true,
                timeline: false,
                multiUser: false,
                api: false
            }
        });
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (name.startsWith('feature-')) {
            const featureName = name.replace('feature-', '');
            if (isEditModalOpen) {
                setCurrentPackage({
                    ...currentPackage,
                    features: {
                        ...currentPackage.features,
                        [featureName]: checked
                    }
                });
            } else {
                setNewPackage({
                    ...newPackage,
                    features: {
                        ...newPackage.features,
                        [featureName]: checked
                    }
                });
            }
        } else {
            if (isEditModalOpen) {
                setCurrentPackage({
                    ...currentPackage,
                    [name]: type === 'checkbox' ? checked : 
                           name === 'price' || name === 'userLimit' ? parseFloat(value) || '' : value
                });
            } else {
                setNewPackage({
                    ...newPackage,
                    [name]: type === 'checkbox' ? checked : 
                           name === 'price' || name === 'userLimit' ? parseFloat(value) || '' : value
                });
            }
        }
    };

    const handleAddPackage = () => {
        // Check if we already have 3 packages
        if (packages.length >= 3) {
            alert("Maximum of 3 packages allowed. Please delete one before adding a new package.");
            return;
        }
        
        const newId = Math.max(...packages.map(p => p.id)) + 1;
        
        setPackages([...packages, { 
            ...newPackage, 
            id: newId
        }]);
        
        closeAllModals();
    };

    const handleUpdatePackage = () => {
        const updatedPackages = packages.map(pkg => 
            pkg.id === currentPackage.id ? currentPackage : pkg
        );
        
        setPackages(updatedPackages);
        closeAllModals();
    };

    const handleDeletePackage = () => {
        const updatedPackages = packages.filter(pkg => pkg.id !== currentPackage.id);
        setPackages(updatedPackages);
        closeAllModals();
    };

    const togglePackageStatus = (id) => {
        const updatedPackages = packages.map(pkg => 
            pkg.id === id ? { ...pkg, active: !pkg.active } : pkg
        );
        
        setPackages(updatedPackages);
    };

    const renderFeatureRow = (featureName, label, description, state, isEditing) => {
        const packageObj = isEditing ? currentPackage : newPackage;
        
        return (
            <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div>
                    <h3 className="font-medium">{label}</h3>
                    <p className="text-sm text-gray-500">{description}</p>
                </div>
                <div className="flex items-center">
                    <label className="inline-flex relative items-center cursor-pointer">
                        <input
                            type="checkbox"
                            name={`feature-${featureName}`}
                            checked={packageObj.features[featureName]}
                            onChange={handleInputChange}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>
            </div>
        );
    };

    // Feature definitions for form rendering
    const featureDefinitions = [
        { name: "caseManagement", label: "Case Management", description: "Create and manage legal cases" },
        { name: "clientManagement", label: "Client Management", description: "Client database and contact management" },
        { name: "documentStorage", label: "Document Storage", description: "Store and organize legal documents" },
        { name: "calendar", label: "Calendar & Scheduling", description: "Calendar integration and appointment scheduling" },
        { name: "billing", label: "Billing & Invoicing", description: "Generate invoices and track payments" },
        { name: "timeTracking", label: "Time Tracking", description: "Track billable hours and activities" },
        { name: "reports", label: "Reports & Analytics", description: "Generate business insights and reports" },
        { name: "messaging", label: "Messaging", description: "Internal and client communication" },
        { name: "notifications", label: "Notifications", description: "System and case update alerts" },
        { name: "timeline", label: "Timeline View", description: "Visual timeline of case progress" },
        { name: "multiUser", label: "Multi-User Access", description: "Team collaboration and shared access" },
        { name: "api", label: "API Access", description: "Integration with other systems" }
    ];

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
                    <h1 className="text-2xl font-bold">Package Management</h1>
                    <p className="text-gray-600">Manage subscription packages and feature access</p>
                </div>
                <div className="flex space-x-3">
                    <Button1 
                        text="Add Package" 
                        onClick={openAddModal}
                        className="py-2 px-4"
                        disabled={packages.length >= 3}
                    />
                </div>
            </div>

            {/* Main Packages Display */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {packages.map((pkg) => (
                    <div key={pkg.id} className={`bg-white rounded-lg shadow-md overflow-hidden border-t-4 ${
                        pkg.active ? 'border-green-500' : 'border-gray-300'
                    }`}>
                        <div className="p-6">
                            <div className="flex justify-between items-start">
                                <h2 className="text-xl font-bold text-gray-800">{pkg.name}</h2>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    pkg.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                }`}>
                                    {pkg.active ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            
                            <div className="mt-2">
                                <span className="text-3xl font-bold">${pkg.price}</span>
                                <span className="text-gray-600">/{pkg.billingCycle}</span>
                            </div>
                            
                            <p className="mt-2 text-gray-600">{pkg.description}</p>
                            
                            <div className="mt-4">
                                <p className="text-sm"><span className="font-semibold">User Limit:</span> {pkg.userLimit} users</p>
                            </div>
                            
                            <div className="mt-6 space-y-3">
                                <h3 className="font-semibold text-gray-700">Features</h3>
                                <ul className="text-sm space-y-1">
                                    {featureDefinitions.map(feature => (
                                        pkg.features[feature.name] ? (
                                            <li key={feature.name} className="flex items-center text-gray-700">
                                                <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                </svg>
                                                {feature.label}
                                            </li>
                                        ) : (
                                            <li key={feature.name} className="flex items-center text-gray-400">
                                                <svg className="w-4 h-4 mr-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                                </svg>
                                                {feature.label}
                                            </li>
                                        )
                                    ))}
                                </ul>
                            </div>
                            
                            <div className="mt-6 flex justify-between">
                                <Button2 
                                    text={pkg.active ? "Deactivate" : "Activate"} 
                                    onClick={() => togglePackageStatus(pkg.id)} 
                                    className="py-1 px-3 text-sm"
                                />
                                <div className="space-x-2">
                                    <Button2 
                                        text="Edit" 
                                        onClick={() => openEditModal(pkg)} 
                                        className="py-1 px-3 text-sm"
                                    />
                                    <button 
                                        onClick={() => openDeleteModal(pkg)} 
                                        className="bg-white text-red-600 hover:bg-red-50 font-medium py-1 px-3 text-sm border border-red-300 rounded-md shadow-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                
                {packages.length < 3 && (
                    <div 
                        className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center p-10 cursor-pointer hover:border-blue-500 transition-colors"
                        onClick={openAddModal}
                    >
                        <div className="text-center">
                            <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <h3 className="font-medium text-gray-900">Add New Package</h3>
                            <p className="text-sm text-gray-500 mt-1">Create a new subscription package</p>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Add/Edit Package warning banner */}
            <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 mb-8">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="font-medium text-yellow-800">Package Management Notes</h3>
                        <div className="mt-2 text-sm text-yellow-700">
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Maximum of 3 packages can be configured in the system</li>
                                <li>Feature restrictions impact user experience and functionality</li>
                                <li>Package changes will affect subscribed users on their next billing cycle</li>
                                <li>Deactivating a package prevents new signups but doesn't affect current subscribers</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Package Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
                        <div className="p-6 border-b">
                            <h2 className="text-xl font-semibold">Add New Package</h2>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input1
                                    label="Package Name"
                                    name="name"
                                    value={newPackage.name}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Basic, Professional, Enterprise"
                                    required
                                />
                                
                                <Input1
                                    label="Price"
                                    name="price"
                                    type="number"
                                    step="0.01"
                                    value={newPackage.price}
                                    onChange={handleInputChange}
                                    placeholder="29.99"
                                    required
                                />
                                
                                <div>
                                    <label className="block font-medium mb-1">Billing Cycle</label>
                                    <select
                                        name="billingCycle"
                                        value={newPackage.billingCycle}
                                        onChange={handleInputChange}
                                        className="w-full text-md py-3 px-4 rounded-full bg-white border-2 border-gray-300 text-gray-800 placeholder-gray-500 focus:border-black transition-all duration-200 focus:outline-none"
                                    >
                                        <option value="monthly">Monthly</option>
                                        <option value="quarterly">Quarterly</option>
                                        <option value="annually">Annually</option>
                                    </select>
                                </div>
                                
                                <Input1
                                    label="User Limit"
                                    name="userLimit"
                                    type="number"
                                    value={newPackage.userLimit}
                                    onChange={handleInputChange}
                                    placeholder="10"
                                    required
                                />
                                
                                <div className="md:col-span-2">
                                    <label className="block font-medium mb-1">Package Description</label>
                                    <textarea
                                        name="description"
                                        value={newPackage.description}
                                        onChange={handleInputChange}
                                        rows="3"
                                        placeholder="Brief description of this package"
                                        className="w-full text-md py-3 px-4 rounded-lg bg-white border-2 border-gray-300 text-gray-800 placeholder-gray-500 focus:border-black transition-all duration-200 focus:outline-none"
                                    ></textarea>
                                </div>
                                
                                <div className="md:col-span-2 flex items-center">
                                    <input
                                        type="checkbox"
                                        id="active"
                                        name="active"
                                        checked={newPackage.active}
                                        onChange={handleInputChange}
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mr-2"
                                    />
                                    <label htmlFor="active" className="font-medium">Package Active</label>
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="font-semibold text-lg mb-4">Feature Access</h3>
                                <div className="bg-gray-50 rounded-lg p-4 space-y-0">
                                    {featureDefinitions.map(feature => 
                                        renderFeatureRow(
                                            feature.name, 
                                            feature.label, 
                                            feature.description, 
                                            newPackage, 
                                            false
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
                            <Button2 
                                text="Cancel" 
                                onClick={closeAllModals}
                                className="py-2 px-4"
                            />
                            <Button1 
                                text="Add Package" 
                                onClick={handleAddPackage}
                                className="py-2 px-4"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Package Modal */}
            {isEditModalOpen && currentPackage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
                        <div className="p-6 border-b">
                            <h2 className="text-xl font-semibold">Edit Package</h2>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input1
                                    label="Package Name"
                                    name="name"
                                    value={currentPackage.name}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Basic, Professional, Enterprise"
                                    required
                                />
                                
                                <Input1
                                    label="Price"
                                    name="price"
                                    type="number"
                                    step="0.01"
                                    value={currentPackage.price}
                                    onChange={handleInputChange}
                                    placeholder="29.99"
                                    required
                                />
                                
                                <div>
                                    <label className="block font-medium mb-1">Billing Cycle</label>
                                    <select
                                        name="billingCycle"
                                        value={currentPackage.billingCycle}
                                        onChange={handleInputChange}
                                        className="w-full text-md py-3 px-4 rounded-full bg-white border-2 border-gray-300 text-gray-800 placeholder-gray-500 focus:border-black transition-all duration-200 focus:outline-none"
                                    >
                                        <option value="monthly">Monthly</option>
                                        <option value="quarterly">Quarterly</option>
                                        <option value="annually">Annually</option>
                                    </select>
                                </div>
                                
                                <Input1
                                    label="User Limit"
                                    name="userLimit"
                                    type="number"
                                    value={currentPackage.userLimit}
                                    onChange={handleInputChange}
                                    placeholder="10"
                                    required
                                />
                                
                                <div className="md:col-span-2">
                                    <label className="block font-medium mb-1">Package Description</label>
                                    <textarea
                                        name="description"
                                        value={currentPackage.description}
                                        onChange={handleInputChange}
                                        rows="3"
                                        placeholder="Brief description of this package"
                                        className="w-full text-md py-3 px-4 rounded-lg bg-white border-2 border-gray-300 text-gray-800 placeholder-gray-500 focus:border-black transition-all duration-200 focus:outline-none"
                                    ></textarea>
                                </div>
                                
                                <div className="md:col-span-2 flex items-center">
                                    <input
                                        type="checkbox"
                                        id="edit-active"
                                        name="active"
                                        checked={currentPackage.active}
                                        onChange={handleInputChange}
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mr-2"
                                    />
                                    <label htmlFor="edit-active" className="font-medium">Package Active</label>
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="font-semibold text-lg mb-4">Feature Access</h3>
                                <div className="bg-gray-50 rounded-lg p-4 space-y-0">
                                    {featureDefinitions.map(feature => 
                                        renderFeatureRow(
                                            feature.name, 
                                            feature.label, 
                                            feature.description, 
                                            currentPackage, 
                                            true
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
                            <Button2 
                                text="Cancel" 
                                onClick={closeAllModals}
                                className="py-2 px-4"
                            />
                            <Button1 
                                text="Update Package" 
                                onClick={handleUpdatePackage}
                                className="py-2 px-4"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && currentPackage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                        <div className="p-6">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            
                            <h3 className="text-lg font-semibold text-center mb-2">Delete Package</h3>
                            <p className="text-sm text-gray-600 text-center mb-6">
                                Are you sure you want to delete the <strong>{currentPackage.name}</strong> package? 
                                This action cannot be undone and may affect users currently subscribed to this plan.
                            </p>
                            
                            <div className="flex justify-center space-x-3">
                                <Button2 
                                    text="Cancel" 
                                    onClick={closeAllModals}
                                    className="py-2 px-4"
                                />
                                <button 
                                    onClick={handleDeletePackage} 
                                    className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md shadow-sm"
                                >
                                    Delete Package
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </PageLayout>
    );
};

export default PackageManagement;