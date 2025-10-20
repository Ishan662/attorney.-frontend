import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import PageLayout from "../../components/layout/PageLayout";
import Button1 from "../../components/UI/Button1";
import Button2 from "../../components/UI/Button2";
import Input1 from "../../components/UI/Input1";
import { sendInvitation } from "../../services/invitationService";
import { sendJuniorLawyerInvitation, sendJuniorLawyerInvitationAlt } from "../../services/accountUserService";
import {
    getJuniorsOverview,
    getClientsOverview,
    updateJuniorSalary,
    recordSalaryPayment,
    updateUserStatus,
    getUserDetails,
    transformJuniorData,
    transformClientData,
    formatPaymentDate,
    generatePaymentNotes
} from "../../services/teamManagementService";

const AccountUsers = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("junior-lawyers");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showSalaryModal, setShowSalaryModal] = useState(false);
    const [showSalaryUpdateModal, setShowSalaryUpdateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedLawyer, setSelectedLawyer] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [salaryAmount, setSalaryAmount] = useState("");
    const [juniorLawyers, setJuniorLawyers] = useState([]);
    const [clients, setClients] = useState([]);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedUserDetails, setSelectedUserDetails] = useState(null);

    // User data for the current lawyer
    const user = {
        name: 'Nishagi Jewantha',
        email: 'jeewanthadeherath@gmail.com',
        role: 'lawyer'
    };

    // Load data from backend on component mount and tab change
    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setIsDataLoading(true);
        try {
            if (activeTab === "junior-lawyers") {
                const juniorsData = await getJuniorsOverview();
                const transformedJuniors = juniorsData.map(transformJuniorData);
                setJuniorLawyers(transformedJuniors);
            } else if (activeTab === "clients") {
                const clientsData = await getClientsOverview();
                const transformedClients = clientsData.map(transformClientData);
                setClients(transformedClients);
            }
        } catch (error) {
            console.error('Error loading data:', error);
            // Keep existing data or show empty state
        } finally {
            setIsDataLoading(false);
        }
    };

    // Form data for adding new users  
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phoneNumber: "",
        location: ""
    });

    // Form data for adding new junior lawyers (simplified)
    const [newLawyer, setNewLawyer] = useState({
        name: "",
        email: "",
        phone: ""
    });

    // Available locations in Sri Lanka
    const locations = [
        "Colombo", "Gampaha", "Kalutara", "Kandy", "Matale", "Galle", "Matara", 
        "Hambantota", "Jaffna", "Kilinochchi", "Mannar", "Vavuniya", "Mullaitivu", 
        "Batticaloa", "Ampara", "Trincomalee", "Kurunegala", "Puttalam", 
        "Anuradhapura", "Polonnaruwa", "Badulla", "Moneragala", "Ratnapura", 
        "Kegalle", "Nuwara Eliya"
    ];

    // Available courts in Sri Lanka
    const courts = [
        "Supreme Court", "Court of Appeal", "High Court", "District Court", 
        "Magistrate Court", "Commercial High Court", "Family Court", 
        "Primary Court", "Industrial Court", "Tax Appeals Court"
    ];

    // Filter and search functionality
    const getFilteredData = () => {
        const usersToFilter = activeTab === "junior-lawyers" ? juniorLawyers : clients;
        
        return usersToFilter.filter(user => {
            // Safely handle potentially undefined values - prioritize firstName + lastName
            const constructedName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
            const userName = constructedName || user.name || user.fullName || '';
            const userEmail = user.email || '';
            
            const matchesSearch = userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                userEmail.toLowerCase().includes(searchTerm.toLowerCase());
            
            return matchesSearch;
        });
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (activeTab === "junior-lawyers") {
            setNewLawyer(prev => ({
                ...prev,
                [name]: value
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    // Form validation
    const validateForm = () => {
        if (activeTab === "junior-lawyers") {
            if (!newLawyer.name.trim()) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Name Required',
                    text: 'Please enter the junior lawyer\'s name',
                    confirmButtonColor: '#000000',
                    background: '#ffffff',
                    width: '500px',
                    customClass: {
                        popup: 'rounded-lg'
                    }
                });
                return false;
            }
            if (!newLawyer.email.trim()) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Email Required',
                    text: 'Please enter the junior lawyer\'s email',
                    confirmButtonColor: '#000000',
                    background: '#ffffff',
                    width: '500px',
                    customClass: {
                        popup: 'rounded-lg'
                    }
                });
                return false;
            }
            if (!newLawyer.phone.trim()) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Phone Required',
                    text: 'Please enter the junior lawyer\'s phone number',
                    confirmButtonColor: '#000000',
                    background: '#ffffff',
                    width: '500px',
                    customClass: {
                        popup: 'rounded-lg'
                    }
                });
                return false;
            }
        } else {
            // Client validation
            if (!formData.fullName.trim()) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Full Name Required',
                    text: 'Please enter the client\'s full name',
                    confirmButtonColor: '#000000',
                    background: '#ffffff',
                    width: '500px',
                    customClass: {
                        popup: 'rounded-lg'
                    }
                });
                return false;
            }
            if (!formData.email.trim()) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Email Required',
                    text: 'Please enter the client\'s email',
                    confirmButtonColor: '#000000',
                    background: '#ffffff',
                    width: '500px',
                    customClass: {
                        popup: 'rounded-lg'
                    }
                });
                return false;
            }
            if (!formData.phoneNumber.trim()) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Phone Required',
                    text: 'Please enter the client\'s phone number',
                    confirmButtonColor: '#000000',
                    background: '#ffffff',
                    width: '500px',
                    customClass: {
                        popup: 'rounded-lg'
                    }
                });
                return false;
            }
            // Only validate location for clients
            if (activeTab === "clients" && !formData.location.trim()) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Location Required',
                    text: 'Please select a location',
                    confirmButtonColor: '#000000',
                    background: '#ffffff',
                    width: '500px',
                    customClass: {
                        popup: 'rounded-lg'
                    }
                });
                return false;
            }
        }
        return true;
    };

    // Handle adding new user (junior lawyer or client)
    const handleAddUser = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setIsLoading(true);
        
        try {
            if (activeTab === "junior-lawyers") {
                // Try the main format first, then fallback to alternative
                try {
                    await sendJuniorLawyerInvitation({
                        name: newLawyer.name,
                        email: newLawyer.email,
                        phone: newLawyer.phone
                    });
                } catch (firstError) {
                    console.log('🔄 First format failed, trying alternative format...');
                    // Try alternative format if first fails
                    await sendJuniorLawyerInvitationAlt({
                        name: newLawyer.name,
                        email: newLawyer.email,
                        phone: newLawyer.phone
                    });
                }
                
                // Reset form
                setNewLawyer({
                    name: "",
                    email: "",
                    phone: ""
                });
                
                // Show success message
                Swal.fire({
                    icon: 'success',
                    title: 'Invitation Sent!',
                    text: `Junior lawyer invitation sent successfully! An invitation email has been sent to ${newLawyer.email}`,
                    confirmButtonColor: '#000000',
                    background: '#ffffff',
                    width: '500px',
                    customClass: {
                        popup: 'rounded-lg'
                    }
                });
                
                // Reload the junior lawyers list
                await loadData();
                
            } else {
                // Handle client addition (existing logic for now)
                const invitationData = {
                    fullName: formData.fullName,
                    email: formData.email,
                    role: 'CLIENT'
                };

                await sendInvitation(invitationData);

                // Reset form  
                setFormData({
                    fullName: "",
                    email: "",
                    phoneNumber: "",
                    location: ""
                });

                Swal.fire({
                    icon: 'success',
                    title: 'Invitation Sent!',
                    text: `Client invitation sent successfully! An invitation email has been sent to ${formData.email}`,
                    confirmButtonColor: '#000000',
                    background: '#ffffff',
                    width: '500px',
                    customClass: {
                        popup: 'rounded-lg'
                    }
                });
                
                // Reload the clients list
                await loadData();
            }
            
            setShowAddModal(false);
            
        } catch (error) {
            console.error("Error sending invitation:", error);
            Swal.fire({
                icon: 'error',
                title: 'Invitation Failed',
                text: 'Failed to send invitation. Please try again.',
                confirmButtonColor: '#000000',
                background: '#ffffff',
                width: '500px',
                customClass: {
                    popup: 'rounded-lg'
                }
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Handle salary update (change the salary amount)
    const handleSalaryUpdate = async (e) => {
        e.preventDefault();
        
        if (!salaryAmount || isNaN(salaryAmount) || parseFloat(salaryAmount) <= 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Invalid Amount',
                text: 'Please enter a valid salary amount',
                confirmButtonColor: '#000000',
                background: '#ffffff',
                width: '500px',
                customClass: {
                    popup: 'rounded-lg'
                }
            });
            return;
        }
        
        setIsLoading(true);
        
        try {
            // Update the junior lawyer's salary amount
            await updateJuniorSalary(selectedLawyer.id, parseFloat(salaryAmount));
            
            // Update the local state
            setJuniorLawyers(prev => 
                prev.map(lawyer => 
                    lawyer.id === selectedLawyer.id 
                        ? { 
                            ...lawyer, 
                            salary: {
                                ...lawyer.salary,
                                amount: parseFloat(salaryAmount)
                            }
                        }
                        : lawyer
                )
            );
            
            Swal.fire({
                icon: 'success',
                title: 'Salary Updated!',
                text: `Salary updated to $${salaryAmount} successfully for ${selectedLawyer.name || `${selectedLawyer.firstName || ''} ${selectedLawyer.lastName || ''}`.trim()}!`,
                confirmButtonColor: '#000000',
                background: '#ffffff',
                width: '500px',
                customClass: {
                    popup: 'rounded-lg'
                }
            });
            setShowSalaryUpdateModal(false);
            setSalaryAmount("");
            setSelectedLawyer(null);
            
        } catch (error) {
            console.error("Error updating salary:", error);
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: 'Failed to update salary. Please try again.',
                confirmButtonColor: '#000000',
                background: '#ffffff',
                width: '500px',
                customClass: {
                    popup: 'rounded-lg'
                }
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Handle salary payment
    const handleSalaryPayment = async (e) => {
        e.preventDefault();
        
        if (!salaryAmount || isNaN(salaryAmount) || parseFloat(salaryAmount) <= 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Invalid Amount',
                text: 'Please enter a valid salary amount',
                confirmButtonColor: '#000000',
                background: '#ffffff',
                width: '500px',
                customClass: {
                    popup: 'rounded-lg'
                }
            });
            return;
        }
        
        setIsLoading(true);
        
        try {
            // First update the junior lawyer's salary
            await updateJuniorSalary(selectedLawyer.id, parseFloat(salaryAmount));
            
            // Then record the payment
            const paymentData = {
                amountPaid: parseFloat(salaryAmount),
                paymentDate: formatPaymentDate(),
                notes: generatePaymentNotes()
            };
            
            await recordSalaryPayment(selectedLawyer.id, paymentData);
            
            // Update the local state
            setJuniorLawyers(prev => 
                prev.map(lawyer => 
                    lawyer.id === selectedLawyer.id 
                        ? { 
                            ...lawyer, 
                            salary: {
                                ...lawyer.salary,
                                amount: parseFloat(salaryAmount),
                                lastPaid: formatPaymentDate()
                            }
                        }
                        : lawyer
                )
            );
            
            Swal.fire({
                icon: 'success',
                title: 'Payment Recorded!',
                text: `Salary payment of $${salaryAmount} recorded successfully for ${selectedLawyer.name || `${selectedLawyer.firstName || ''} ${selectedLawyer.lastName || ''}`.trim()}!`,
                confirmButtonColor: '#000000',
                background: '#ffffff',
                width: '500px',
                customClass: {
                    popup: 'rounded-lg'
                }
            });
            setShowSalaryModal(false);
            setSalaryAmount("");
            setSelectedLawyer(null);
            
        } catch (error) {
            console.error("Error processing salary payment:", error);
            Swal.fire({
                icon: 'error',
                title: 'Payment Failed',
                text: 'Failed to process salary payment. Please try again.',
                confirmButtonColor: '#000000',
                background: '#ffffff',
                width: '500px',
                customClass: {
                    popup: 'rounded-lg'
                }
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Handle user deletion
    const handleDeleteUser = async () => {
        if (!selectedUser) return;
        
        setIsLoading(true);
        
        try {
            // Update user status to INACTIVE instead of deleting
            await updateUserStatus(selectedUser.id, "INACTIVE");
            
            // Update local state
            if (activeTab === "junior-lawyers") {
                setJuniorLawyers(prev => 
                    prev.map(lawyer => 
                        lawyer.id === selectedUser.id 
                            ? { ...lawyer, status: "inactive" }
                            : lawyer
                    )
                );
            } else {
                setClients(prev => 
                    prev.map(client => 
                        client.id === selectedUser.id 
                            ? { ...client, status: "inactive" }
                            : client
                    )
                );
            }
            
            Swal.fire({
                icon: 'success',
                title: 'User Deactivated',
                text: `${selectedUser.name} has been deactivated successfully!`,
                confirmButtonColor: '#000000',
                background: '#ffffff',
                width: '500px',
                customClass: {
                    popup: 'rounded-lg'
                }
            });
            setShowDeleteModal(false);
            setSelectedUser(null);
            
        } catch (error) {
            console.error("Error deactivating user:", error);
            Swal.fire({
                icon: 'error',
                title: 'Deactivation Failed',
                text: 'Failed to deactivate user. Please try again.',
                confirmButtonColor: '#000000',
                background: '#ffffff',
                width: '500px',
                customClass: {
                    popup: 'rounded-lg'
                }
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Handle viewing user details
    const handleViewUserDetails = async (user) => {
        setIsLoading(true);
        try {
            const userDetails = await getUserDetails(user.id);
            setSelectedUserDetails(userDetails);
            setShowViewModal(true);
        } catch (error) {
            console.error("Error fetching user details:", error);
            Swal.fire({
                icon: 'error',
                title: 'Loading Failed',
                text: 'Failed to load user details. Please try again.',
                confirmButtonColor: '#000000',
                background: '#ffffff',
                width: '500px',
                customClass: {
                    popup: 'rounded-lg'
                }
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Handle tab change
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSearchTerm("");
        setFilter("all");
    };

    return (
        <PageLayout>
            <div className="p-6 max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Users</h1>
                    <p className="text-gray-600">Manage your junior lawyers and clients</p>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => handleTabChange('junior-lawyers')}
                            className={`py-2 px-4 font-medium ${activeTab === 'junior-lawyers' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Junior Lawyers ({juniorLawyers.length})
                        </button>
                        <button
                            onClick={() => handleTabChange('clients')}
                            className={`py-2 px-4 font-medium ${activeTab === 'clients' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Clients ({clients.length})
                        </button>
                    </nav>
                </div>

                {/* Search and Filter Bar */}
                <div className="mb-6 flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <Input1
                            type="text"
                            placeholder={`Search ${activeTab === 'junior-lawyers' ? 'junior lawyers' : 'clients'}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        {activeTab === 'junior-lawyers' && (
                            <Button1 
                                onClick={() => setShowAddModal(true)}
                                className="px-3 py-2"
                            >
                                Add Junior Lawyer
                            </Button1>
                        )}
                    </div>
                </div>

                {/* Loading State */}
                {isDataLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                        <span className="ml-3 text-gray-600">Loading {activeTab === 'junior-lawyers' ? 'junior lawyers' : 'clients'}...</span>
                    </div>
                ) : (
                    /* Users Table */
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {activeTab === 'junior-lawyers' ? 'Junior Lawyer' : 'Client'}
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Contact
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        {activeTab === 'junior-lawyers' && (
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Salary
                                            </th>
                                        )}
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {getFilteredData().map((userItem) => {
                                        // Safely handle potentially undefined values with proper name construction
                                        // Prioritize firstName + lastName since that's what API returns
                                        const constructedName = `${userItem.firstName || ''} ${userItem.lastName || ''}`.trim();
                                        const displayName = constructedName || 
                                                          userItem.name || 
                                                          userItem.fullName || 
                                                          'N/A';
                                        const displayEmail = userItem.email || 'N/A';
                                        const displayPhone = userItem.phone || userItem.phoneNumber || 'N/A';
                                        const displayStatus = userItem.status || 'ACTIVE';
                                        
                                        return (
                                        <tr key={userItem.id || Math.random()} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <img
                                                            className="h-10 w-10 rounded-full"
                                                            src={userItem.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=f97316&color=ffffff`}
                                                            alt=""
                                                        />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {displayName}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {activeTab === 'junior-lawyers' ? 'Junior Lawyer' : 'Client'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{displayEmail}</div>
                                                <div className="text-sm text-gray-500">{displayPhone}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    displayStatus.toUpperCase() === 'ACTIVE' 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {displayStatus.toUpperCase()}
                                                </span>
                                            </td>
                                            {activeTab === 'junior-lawyers' && (
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        ${userItem.salary?.amount || userItem.monthlySalary || 0}/month
                                                    </div>
                                                    {(userItem.salary?.lastPaid || userItem.lastPaymentDate) && (
                                                        <div className="text-sm text-gray-500">
                                                            Last paid: {userItem.salary?.lastPaid || userItem.lastPaymentDate}
                                                        </div>
                                                    )}
                                                </td>
                                            )}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleViewUserDetails(userItem)}
                                                        className="text-orange-600 hover:text-orange-900"
                                                        disabled={isLoading}
                                                    >
                                                        View
                                                    </button>
                                                    {activeTab === 'junior-lawyers' && (
                                                        <>
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedLawyer(userItem);
                                                                    setSalaryAmount(userItem.salary?.amount || "");
                                                                    setShowSalaryModal(true);
                                                                }}
                                                                className="text-blue-600 hover:text-blue-900"
                                                            >
                                                                Pay Salary
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedLawyer(userItem);
                                                                    setSalaryAmount(userItem.salary?.amount || "");
                                                                    setShowSalaryUpdateModal(true);
                                                                }}
                                                                className="text-green-600 hover:text-green-900"
                                                            >
                                                                Update Salary
                                                            </button>
                                                        </>
                                                    )}
                                                    <button
                                                        onClick={() => {
                                                            setSelectedUser(userItem);
                                                            setShowDeleteModal(true);
                                                        }}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        {displayStatus.toUpperCase() === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        </div>
                        
                        {getFilteredData().length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500">
                                    No {activeTab === 'junior-lawyers' ? 'junior lawyers' : 'clients'} found matching your search criteria.
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Add User Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg max-w-md w-full p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Add New {activeTab === 'junior-lawyers' ? 'Junior Lawyer' : 'Client'}
                            </h3>
                            
                            <form onSubmit={handleAddUser}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Full Name
                                        </label>
                                        <Input1
                                            type="text"
                                            name={activeTab === 'junior-lawyers' ? 'name' : 'fullName'}
                                            value={activeTab === 'junior-lawyers' ? newLawyer.name : formData.fullName}
                                            onChange={handleInputChange}
                                            placeholder="Enter full name"
                                            required
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email
                                        </label>
                                        <Input1
                                            type="email"
                                            name="email"
                                            value={activeTab === 'junior-lawyers' ? newLawyer.email : formData.email}
                                            onChange={handleInputChange}
                                            placeholder="Enter email address"
                                            required
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Phone Number
                                        </label>
                                        <Input1
                                            type="tel"
                                            name={activeTab === 'junior-lawyers' ? 'phone' : 'phoneNumber'}
                                            value={activeTab === 'junior-lawyers' ? newLawyer.phone : formData.phoneNumber}
                                            onChange={handleInputChange}
                                            placeholder="Enter phone number"
                                            required
                                        />
                                    </div>
                                    
                                    {activeTab === 'clients' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Location
                                            </label>
                                            <select
                                                name="location"
                                                value={formData.location}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                                required
                                            >
                                                <option value="">Select location</option>
                                                {locations.map(location => (
                                                    <option key={location} value={location}>
                                                        {location}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="flex justify-end space-x-3 mt-6">
                                    <Button2 
                                        type="button" 
                                        onClick={() => setShowAddModal(false)}
                                    >
                                        Cancel
                                    </Button2>
                                    <Button1 
                                        type="submit" 
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Sending...' : `Send Invitation`}
                                    </Button1>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Salary Payment Modal */}
                {showSalaryModal && selectedLawyer && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg max-w-md w-full p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Pay Salary - {selectedLawyer.name || `${selectedLawyer.firstName || ''} ${selectedLawyer.lastName || ''}`.trim()}
                            </h3>
                            
                            <form onSubmit={handleSalaryPayment}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Salary Amount ($)
                                    </label>
                                    <Input1
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={salaryAmount}
                                        onChange={(e) => setSalaryAmount(e.target.value)}
                                        placeholder="Enter salary amount"
                                        required
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        Current monthly salary: ${selectedLawyer.salary?.amount || 0}
                                    </p>
                                </div>
                                
                                <div className="flex justify-end space-x-3">
                                    <Button2 
                                        type="button" 
                                        onClick={() => {
                                            setShowSalaryModal(false);
                                            setSalaryAmount("");
                                            setSelectedLawyer(null);
                                        }}
                                    >
                                        Cancel
                                    </Button2>
                                    <Button1 
                                        type="submit" 
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Processing...' : 'Pay Salary'}
                                    </Button1>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Salary Update Modal */}
                {showSalaryUpdateModal && selectedLawyer && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg max-w-md w-full p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Update Salary - {selectedLawyer.name || `${selectedLawyer.firstName || ''} ${selectedLawyer.lastName || ''}`.trim()}
                            </h3>
                            
                            <form onSubmit={handleSalaryUpdate}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        New Monthly Salary Amount ($)
                                    </label>
                                    <Input1
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={salaryAmount}
                                        onChange={(e) => setSalaryAmount(e.target.value)}
                                        placeholder="Enter new salary amount"
                                        required
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        Current monthly salary: ${selectedLawyer.salary?.amount || 0}
                                    </p>
                                </div>
                                
                                <div className="flex justify-end space-x-3">
                                    <Button2 
                                        type="button" 
                                        onClick={() => {
                                            setShowSalaryUpdateModal(false);
                                            setSalaryAmount("");
                                            setSelectedLawyer(null);
                                        }}
                                    >
                                        Cancel
                                    </Button2>
                                    <Button1 
                                        type="submit" 
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Updating...' : 'Update Salary'}
                                    </Button1>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteModal && selectedUser && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg max-w-md w-full p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                {selectedUser.status?.toUpperCase() === 'ACTIVE' ? 'Deactivate' : 'Activate'} User
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to {selectedUser.status?.toUpperCase() === 'ACTIVE' ? 'deactivate' : 'activate'} {selectedUser.name || `${selectedUser.firstName || ''} ${selectedUser.lastName || ''}`.trim()}?
                            </p>
                            
                            <div className="flex justify-end space-x-3">
                                <Button2 
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setSelectedUser(null);
                                    }}
                                >
                                    Cancel
                                </Button2>
                                <Button1 
                                    onClick={handleDeleteUser}
                                    disabled={isLoading}
                                    className="bg-red-600 hover:bg-red-700"
                                >
                                    {isLoading ? 'Processing...' : `${selectedUser.status?.toUpperCase() === 'ACTIVE' ? 'Deactivate' : 'Activate'}`}
                                </Button1>
                            </div>
                        </div>
                    </div>
                )}

                {/* View User Details Modal */}
                {showViewModal && selectedUserDetails && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-medium text-gray-900">
                                    {activeTab === 'junior-lawyers' ? 'Junior Lawyer' : 'Client'} Details
                                </h3>
                                <button
                                    onClick={() => {
                                        setShowViewModal(false);
                                        setSelectedUserDetails(null);
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            
                            {/* User Basic Info */}
                            <div className="mb-6">
                                <div className="flex items-center mb-4">
                                    <img
                                        className="h-16 w-16 rounded-full"
                                        src={selectedUserDetails.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUserDetails.fullName || selectedUserDetails.name)}&background=f97316&color=ffffff`}
                                        alt=""
                                    />
                                    <div className="ml-4">
                                        <h4 className="text-lg font-medium text-gray-900">
                                            {selectedUserDetails.fullName || selectedUserDetails.name}
                                        </h4>
                                        <p className="text-gray-600">{selectedUserDetails.email}</p>
                                        <p className="text-gray-600">{selectedUserDetails.phoneNumber || selectedUserDetails.phone}</p>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="font-medium text-gray-700">Status:</span>
                                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
                                            selectedUserDetails.status === 'ACTIVE' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {selectedUserDetails.status}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700">Date Added:</span>
                                        <span className="ml-2 text-gray-600">
                                            {selectedUserDetails.dateAdded || selectedUserDetails.createdAt}
                                        </span>
                                    </div>
                                    {selectedUserDetails.location && (
                                        <div>
                                            <span className="font-medium text-gray-700">Location:</span>
                                            <span className="ml-2 text-gray-600">{selectedUserDetails.location}</span>
                                        </div>
                                    )}
                                    {activeTab === 'junior-lawyers' && selectedUserDetails.monthlySalary && (
                                        <div>
                                            <span className="font-medium text-gray-700">Monthly Salary:</span>
                                            <span className="ml-2 text-gray-600">${selectedUserDetails.monthlySalary}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {/* Assigned Cases */}
                            <div>
                                <h5 className="text-lg font-medium text-gray-900 mb-3">
                                    Assigned Cases ({selectedUserDetails.assignedCases?.length || 0})
                                </h5>
                                
                                {selectedUserDetails.assignedCases && selectedUserDetails.assignedCases.length > 0 ? (
                                    <div className="space-y-3">
                                        {selectedUserDetails.assignedCases.map((caseItem, index) => (
                                            <div key={index} className="border border-gray-200 rounded-lg p-3">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h6 className="font-medium text-gray-900">
                                                            {caseItem.title || caseItem.caseName || `Case #${caseItem.caseNumber || index + 1}`}
                                                        </h6>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            {caseItem.description || 'No description available'}
                                                        </p>
                                                        <div className="flex space-x-4 mt-2 text-xs text-gray-500">
                                                            {caseItem.caseType && (
                                                                <span>Type: {caseItem.caseType}</span>
                                                            )}
                                                            {caseItem.court && (
                                                                <span>Court: {caseItem.court}</span>
                                                            )}
                                                            {caseItem.assignedDate && (
                                                                <span>Assigned: {caseItem.assignedDate}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {caseItem.status && (
                                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                            caseItem.status === 'ACTIVE' || caseItem.status === 'OPEN'
                                                                ? 'bg-blue-100 text-blue-800'
                                                                : caseItem.status === 'COMPLETED' || caseItem.status === 'CLOSED'
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                            {caseItem.status}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <p>No cases assigned yet.</p>
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex justify-end mt-6">
                                <Button2 
                                    onClick={() => {
                                        setShowViewModal(false);
                                        setSelectedUserDetails(null);
                                    }}
                                >
                                    Close
                                </Button2>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </PageLayout>
    );
};

export default AccountUsers;
