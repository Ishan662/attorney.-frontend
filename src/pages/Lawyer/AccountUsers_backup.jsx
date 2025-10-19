import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("all");
    const [selectedLawyer, setSelectedLawyer] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [salaryAmount, setSalaryAmount] = useState("");
    const [juniorLawyers, setJuniorLawyers] = useState([]);
    const [clients, setClients] = useState([]);
    const [isDataLoading, setIsDataLoading] = useState(true);

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
            const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                user.email.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesFilter = filter === "all" || user.status === filter;
            
            return matchesSearch && matchesFilter;
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
                alert("Please enter the junior lawyer's name");
                return false;
            }
            if (!newLawyer.email.trim()) {
                alert("Please enter the junior lawyer's email");
                return false;
            }
            if (!newLawyer.phone.trim()) {
                alert("Please enter the junior lawyer's phone number");
                return false;
            }
        } else {
            // Client validation
            if (!formData.fullName.trim()) {
                alert("Please enter the client's full name");
                return false;
            }
            if (!formData.email.trim()) {
                alert("Please enter the client's email");
                return false;
            }
            if (!formData.phoneNumber.trim()) {
                alert("Please enter the client's phone number");
                return false;
            }
            // Only validate location for clients
            if (activeTab === "clients" && !formData.location.trim()) {
                alert("Please select a location");
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
                alert(`Junior lawyer invitation sent successfully! An invitation email has been sent to ${newLawyer.email}`);
                
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

                alert(`Client invitation sent successfully! An invitation email has been sent to ${formData.email}`);
                
                // Reload the clients list
                await loadData();
            }
            
            setShowAddModal(false);
            
        } catch (error) {
            console.error("Error sending invitation:", error);
            alert("Failed to send invitation. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Handle salary payment
    const handleSalaryPayment = async (e) => {
        e.preventDefault();
        
        if (!salaryAmount || isNaN(salaryAmount) || parseFloat(salaryAmount) <= 0) {
            alert("Please enter a valid salary amount");
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
            
            alert(`Salary payment of $${salaryAmount} recorded successfully for ${selectedLawyer.name}!`);
            setShowSalaryModal(false);
            setSalaryAmount("");
            setSelectedLawyer(null);
            
        } catch (error) {
            console.error("Error processing salary payment:", error);
            alert("Failed to process salary payment. Please try again.");
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
            
            alert(`${selectedUser.name} has been deactivated successfully!`);
            setShowDeleteModal(false);
            setSelectedUser(null);
            
        } catch (error) {
            console.error("Error deactivating user:", error);
            alert("Failed to deactivate user. Please try again.");
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
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                        <Button1 onClick={() => setShowAddModal(true)}>
                            Add {activeTab === 'junior-lawyers' ? 'Junior Lawyer' : 'Client'}
                        </Button1>
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
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Cases Assigned
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
                                    {getFilteredData().map((userItem) => (
                                        <tr key={userItem.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <img
                                                            className="h-10 w-10 rounded-full"
                                                            src={userItem.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userItem.name)}&background=f97316&color=ffffff`}
                                                            alt=""
                                                        />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {userItem.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            Added: {userItem.dateAdded}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{userItem.email}</div>
                                                <div className="text-sm text-gray-500">{userItem.phone}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    userItem.status === 'active' 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {userItem.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {userItem.casesAssigned}
                                            </td>
                                            {activeTab === 'junior-lawyers' && (
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        ${userItem.salary?.amount || 0}/month
                                                    </div>
                                                    {userItem.salary?.lastPaid && (
                                                        <div className="text-sm text-gray-500">
                                                            Last paid: {userItem.salary.lastPaid}
                                                        </div>
                                                    )}
                                                </td>
                                            )}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => {
                                                            // TODO: Implement view user details modal
                                                            console.log('View user details:', userItem);
                                                        }}
                                                        className="text-orange-600 hover:text-orange-900"
                                                    >
                                                        View
                                                    </button>
                                                    {activeTab === 'junior-lawyers' && (
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
                                                    )}
                                                    <button
                                                        onClick={() => {
                                                            setSelectedUser(userItem);
                                                            setShowDeleteModal(true);
                                                        }}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        {userItem.status === 'active' ? 'Deactivate' : 'Activate'}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
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
                                Pay Salary - {selectedLawyer.name}
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

                {/* Delete Confirmation Modal */}
                {showDeleteModal && selectedUser && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg max-w-md w-full p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                {selectedUser.status === 'active' ? 'Deactivate' : 'Activate'} User
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to {selectedUser.status === 'active' ? 'deactivate' : 'activate'} {selectedUser.name}?
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
                                    {isLoading ? 'Processing...' : `${selectedUser.status === 'active' ? 'Deactivate' : 'Activate'}`}
                                </Button1>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </PageLayout>
    );
};

export default AccountUsers;
