import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/layout/PageLayout";
import Button1 from "../../components/UI/Button1";
import Button2 from "../../components/UI/Button2";
import Input1 from "../../components/UI/Input1";

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

    // User data for the current lawyer
    const user = {
        name: 'Nishagi Jewantha',
        email: 'jeewanthadeherath@gmail.com',
        role: 'lawyer'
    };

    // Sample junior lawyers data
    const [juniorLawyers, setJuniorLawyers] = useState([
        {
            id: 1,
            name: "Jane Smith",
            email: "jane.smith@example.com",
            phone: "+65 9123 4567",
            status: "active",
            dateAdded: "2025-05-12",
            casesAssigned: 8,
            court: "District Court",
            location: "Colombo",
            avatar: null,
            salary: {
                amount: 3500,
                lastPaid: "2025-06-01",
                nextPayment: "2025-07-01"
            }
        },
        {
            id: 2,
            name: "Michael Johnson",
            email: "michael.johnson@example.com",
            phone: "+65 8765 4321",
            status: "active",
            dateAdded: "2025-06-03",
            casesAssigned: 5,
            court: "High Court",
            location: "Galle",
            avatar: null,
            salary: {
                amount: 3200,
                lastPaid: "2025-06-01",
                nextPayment: "2025-07-01"
            }
        },
        {
            id: 3,
            name: "Sarah Williams",
            email: "sarah.williams@example.com",
            phone: "+65 9876 5432",
            status: "inactive",
            dateAdded: "2025-04-22",
            casesAssigned: 0,
            court: "Supreme Court",
            location: "Kandy",
            avatar: null,
            salary: {
                amount: 3000,
                lastPaid: "2025-06-01",
                nextPayment: "2025-07-01"
            }
        }
    ]);

    // Sample clients data
    const [clients, setClients] = useState([
        {
            id: 1,
            name: "Robert Chen",
            email: "robert.chen@example.com",
            phone: "+65 9123 7890",
            status: "active",
            dateAdded: "2025-04-10",
            casesAssigned: 2,
            court: "District Court",
            location: "Matara",
            avatar: null
        },
        {
            id: 2,
            name: "Priya Patel",
            email: "priya.patel@example.com",
            phone: "+65 8765 1234",
            status: "active",
            dateAdded: "2025-05-22",
            casesAssigned: 1,
            court: "High Court",
            location: "Negombo",
            avatar: null
        },
        {
            id: 3,
            name: "David Lee",
            email: "david.lee@example.com",
            phone: "+65 9876 4321",
            status: "inactive",
            dateAdded: "2025-03-15",
            casesAssigned: 0,
            court: "Family Court",
            location: "Jaffna",
            avatar: null
        }
    ]);

    // Sri Lankan locations
    const locationOptions = [
        "Colombo", "Kandy", "Galle", "Jaffna", "Negombo", "Matara", 
        "Anuradhapura", "Batticaloa", "Nuwara Eliya", "Trincomalee", 
        "Kurunegala", "Ratnapura", "Badulla", "Hambantota", "Kalmunai"
    ];

    // New junior lawyer form state
    const [newLawyer, setNewLawyer] = useState({
        name: "",
        email: "",
        phone: "",
        court: "",
        location: "",
        salary: ""
    });

    // New client form state
    const [newClient, setNewClient] = useState({
        name: "",
        email: "",
        phone: "",
        court: "",
        location: ""
    });

    const [formErrors, setFormErrors] = useState({});

    // Filter and search users based on active tab
    const getFilteredUsers = () => {
        const usersToFilter = activeTab === "junior-lawyers" ? juniorLawyers : clients;
        
        return usersToFilter.filter(user => {
            // Apply status filter
            if (filter !== "all" && user.status !== filter) return false;
            
            // Apply search
            if (searchTerm && !user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                !user.email.toLowerCase().includes(searchTerm.toLowerCase()) &&
                !user.location.toLowerCase().includes(searchTerm.toLowerCase())) {
                return false;
            }
            
            return true;
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
            setNewClient(prev => ({
                ...prev,
                [name]: value
            }));
        }
        
        // Clear error when typing
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    // Validate form
    const validateForm = () => {
        const errors = {};
        const formData = activeTab === "junior-lawyers" ? newLawyer : newClient;
        
        if (!formData.name.trim()) {
            errors.name = "Name is required";
        }
        
        if (!formData.email.trim()) {
            errors.email = "Email is required";
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
            errors.email = "Invalid email address";
        }
        
        if (!formData.phone.trim()) {
            errors.phone = "Phone number is required";
        }

        if (!formData.location.trim()) {
            errors.location = "Location is required";
        }

        if (!formData.court.trim()) {
            errors.court = "Court is required";
        }

        if (activeTab === "junior-lawyers" && !formData.salary.trim()) {
            errors.salary = "Salary amount is required";
        } else if (activeTab === "junior-lawyers" && (isNaN(Number(formData.salary)) || Number(formData.salary) <= 0)) {
            errors.salary = "Salary must be a positive number";
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Add new user (junior lawyer or client)
    const handleAddUser = (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setIsLoading(true);
        
        // Simulate API call with timeout
        setTimeout(() => {
            if (activeTab === "junior-lawyers") {
                const newJuniorLawyer = {
                    id: juniorLawyers.length + 1,
                    name: newLawyer.name,
                    email: newLawyer.email,
                    phone: newLawyer.phone,
                    court: newLawyer.court,
                    location: newLawyer.location,
                    status: "active",
                    dateAdded: new Date().toISOString().split('T')[0],
                    casesAssigned: 0,
                    avatar: null,
                    salary: {
                        amount: Number(newLawyer.salary),
                        lastPaid: null,
                        nextPayment: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]
                    }
                };
                
                setJuniorLawyers(prev => [...prev, newJuniorLawyer]);
                setNewLawyer({
                    name: "",
                    email: "",
                    phone: "",
                    court: "",
                    location: "",
                    salary: ""
                });
                
                // Show success message - in a real app, this would also send an email invitation
                alert(`Junior lawyer added successfully! An invitation email has been sent to ${newLawyer.email}`);
            } else {
                const newClientData = {
                    id: clients.length + 1,
                    name: newClient.name,
                    email: newClient.email,
                    phone: newClient.phone,
                    court: newClient.court,
                    location: newClient.location,
                    status: "active",
                    dateAdded: new Date().toISOString().split('T')[0],
                    casesAssigned: 0,
                    avatar: null
                };
                
                setClients(prev => [...prev, newClientData]);
                setNewClient({
                    name: "",
                    email: "",
                    phone: "",
                    court: "",
                    location: ""
                });
                
                alert(`Client added successfully!`);
            }
            
            setIsLoading(false);
            setShowAddModal(false);
        }, 800);
    };

    // Handle salary payment
    const handleSalaryPayment = (e) => {
        e.preventDefault();
        
        if (!salaryAmount || isNaN(Number(salaryAmount)) || Number(salaryAmount) <= 0) {
            alert("Please enter a valid salary amount");
            return;
        }
        
        setIsLoading(true);
        
        // Simulate API call with timeout
        setTimeout(() => {
            setJuniorLawyers(prev => 
                prev.map(lawyer => 
                    lawyer.id === selectedLawyer.id 
                        ? { 
                            ...lawyer, 
                            salary: {
                                ...lawyer.salary,
                                amount: Number(salaryAmount),
                                lastPaid: new Date().toISOString().split('T')[0],
                                nextPayment: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]
                            }
                        } 
                        : lawyer
                )
            );
            
            setIsLoading(false);
            setShowSalaryModal(false);
            setSalaryAmount("");
            setSelectedLawyer(null);
            
            // Show success message
            alert(`Salary payment processed successfully!`);
        }, 800);
    };

    // Delete user confirmation
    const confirmDelete = () => {
        if (!selectedUser) return;
        
        setIsLoading(true);
        
        // Simulate API call with timeout
        setTimeout(() => {
            if (activeTab === "junior-lawyers") {
                setJuniorLawyers(prev => prev.filter(lawyer => lawyer.id !== selectedUser.id));
            } else {
                setClients(prev => prev.filter(client => client.id !== selectedUser.id));
            }
            
            setIsLoading(false);
            setShowDeleteModal(false);
            setSelectedUser(null);
            
            // Show success message
            alert(`${activeTab === "junior-lawyers" ? "Junior lawyer" : "Client"} deleted successfully!`);
        }, 800);
    };

    // Change user status
    const toggleUserStatus = (id) => {
        if (activeTab === "junior-lawyers") {
            setJuniorLawyers(prev => 
                prev.map(lawyer => 
                    lawyer.id === id 
                        ? { ...lawyer, status: lawyer.status === "active" ? "inactive" : "active" } 
                        : lawyer
                )
            );
        } else {
            setClients(prev => 
                prev.map(client => 
                    client.id === id 
                        ? { ...client, status: client.status === "active" ? "inactive" : "active" } 
                        : client
                )
            );
        }
    };

    // Generate initials from name
    const getInitials = (name) => {
        return name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    // Generate random color based on name (consistent for same name)
    const getAvatarColor = (name) => {
        const colors = [
            "bg-blue-100 text-blue-800",
            "bg-green-100 text-green-800",
            "bg-purple-100 text-purple-800",
            "bg-yellow-100 text-yellow-800",
            "bg-red-100 text-red-800",
            "bg-indigo-100 text-indigo-800"
        ];
        
        const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
        return colors[index];
    };

    // Format date for display
    const formatDate = (dateStr) => {
        if (!dateStr) return "N/A";
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Handle tab change
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSearchTerm("");
        setFilter("all");
    };

    return (
        <PageLayout user={user}>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Account Users</h1>
                <Button1 
                    text={activeTab === "junior-lawyers" ? "Add Junior Lawyer" : "Add Client"} 
                    onClick={() => setShowAddModal(true)}
                    className="px-4"
                />
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b mb-6">
                <button
                    className={`py-2 px-4 font-medium ${activeTab === 'junior-lawyers' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => handleTabChange('junior-lawyers')}
                >
                    Junior Lawyers
                </button>
                <button
                    className={`py-2 px-4 font-medium ${activeTab === 'clients' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => handleTabChange('clients')}
                >
                    Clients
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg p-4 shadow-md mb-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="w-full md:w-1/3">
                        <Input1
                            type="text"
                            placeholder="Search by name, email or location"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            variant="outlined"
                            className="w-full"
                        />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Filter:</span>
                        <div className="flex space-x-2">
                            <button 
                                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${filter === "all" ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                                onClick={() => setFilter("all")}
                            >
                                All
                            </button>
                            <button 
                                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${filter === "active" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                                onClick={() => setFilter("active")}
                            >
                                Active
                            </button>
                            <button 
                                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${filter === "inactive" ? "bg-gray-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                                onClick={() => setFilter("inactive")}
                            >
                                Inactive
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Users List */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {getFilteredUsers().length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 text-left">
                                    <th className="px-6 py-4 text-sm font-medium text-gray-600">Name</th>
                                    <th className="px-6 py-4 text-sm font-medium text-gray-600">Contact Information</th>
                                    <th className="px-6 py-4 text-sm font-medium text-gray-600">Location</th>
                                    <th className="px-6 py-4 text-sm font-medium text-gray-600">Court</th>
                                    <th className="px-6 py-4 text-sm font-medium text-gray-600">Added On</th>
                                    <th className="px-6 py-4 text-sm font-medium text-gray-600">Status</th>
                                    <th className="px-6 py-4 text-sm font-medium text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getFilteredUsers().map((user) => (
                                    <tr key={user.id} className="border-t hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className={`w-8 h-8 rounded-full ${getAvatarColor(user.name)} flex items-center justify-center text-xs font-medium mr-3`}>
                                                    {getInitials(user.name)}
                                                </div>
                                                <div>
                                                    <div className="font-medium">{user.name}</div>
                                                    <div className="text-xs text-gray-500">
                                                        {activeTab === 'junior-lawyers' ? 'Junior Lawyer' : 'Client'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm">{user.email}</div>
                                            <div className="text-sm text-gray-500">{user.phone}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className="inline-flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                </svg>
                                                {user.location}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">{user.court}</td>
                                        <td className="px-6 py-4 text-sm">{formatDate(user.dateAdded)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium 
                                                ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                                            `}>
                                                {user.status === 'active' ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex space-x-2">
                                                <button 
                                                    className="text-xs font-medium text-blue-600 hover:text-blue-800"
                                                    onClick={() => {
                                                        if (activeTab === "junior-lawyers") {
                                                            navigate(`/lawyer/account-users/${user.id}`);
                                                        } else {
                                                            navigate(`/lawyer/clients/${user.id}`);
                                                        }
                                                    }}
                                                >
                                                    View
                                                </button>
                                                
                                                {activeTab === "junior-lawyers" && (
                                                    <button 
                                                        className="text-xs font-medium text-orange-600 hover:text-orange-800"
                                                        onClick={() => {
                                                            setSelectedLawyer(user);
                                                            setSalaryAmount(user.salary?.amount?.toString() || "");
                                                            setShowSalaryModal(true);
                                                        }}
                                                    >
                                                        Salary
                                                    </button>
                                                )}
                                                
                                                <button 
                                                    className="text-xs font-medium text-gray-600 hover:text-gray-800"
                                                    onClick={() => toggleUserStatus(user.id)}
                                                >
                                                    {user.status === 'active' ? 'Deactivate' : 'Activate'}
                                                </button>
                                                
                                                <button 
                                                    className="text-xs font-medium text-red-600 hover:text-red-800"
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setShowDeleteModal(true);
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        {searchTerm || filter !== "all" ? 
                            `No ${activeTab === "junior-lawyers" ? "junior lawyers" : "clients"} match your search criteria.` : 
                            `No ${activeTab === "junior-lawyers" ? "junior lawyers" : "clients"} added yet.`}
                    </div>
                )}
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {activeTab === "junior-lawyers" ? (
                    <>
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            <div className="text-sm text-gray-500 mb-1">Total Junior Lawyers</div>
                            <div className="text-xl font-bold">{juniorLawyers.length}</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            <div className="text-sm text-gray-500 mb-1">Active</div>
                            <div className="text-xl font-bold text-green-600">
                                {juniorLawyers.filter(lawyer => lawyer.status === "active").length}
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            <div className="text-sm text-gray-500 mb-1">Total Monthly Salaries</div>
                            <div className="text-xl font-bold text-orange-600">
                                ${juniorLawyers
                                    .filter(lawyer => lawyer.status === "active")
                                    .reduce((sum, lawyer) => sum + (lawyer.salary?.amount || 0), 0)
                                    .toLocaleString()}
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            <div className="text-sm text-gray-500 mb-1">Total Clients</div>
                            <div className="text-xl font-bold">{clients.length}</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            <div className="text-sm text-gray-500 mb-1">Active Clients</div>
                            <div className="text-xl font-bold text-green-600">
                                {clients.filter(client => client.status === "active").length}
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            <div className="text-sm text-gray-500 mb-1">Total Cases Assigned</div>
                            <div className="text-xl font-bold text-blue-600">
                                {clients.reduce((sum, client) => sum + client.casesAssigned, 0)}
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Add User Modal (Junior Lawyer or Client) */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg mx-4">
                        <h2 className="text-xl font-bold mb-4">
                            Add New {activeTab === "junior-lawyers" ? "Junior Lawyer" : "Client"}
                        </h2>
                        
                        <form onSubmit={handleAddUser}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name
                                </label>
                                <Input1
                                    type="text"
                                    name="name"
                                    value={activeTab === "junior-lawyers" ? newLawyer.name : newClient.name}
                                    onChange={handleInputChange}
                                    placeholder="Full name"
                                    variant="outlined"
                                    className="w-full"
                                />
                                {formErrors.name && (
                                    <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                                )}
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <Input1
                                    type="email"
                                    name="email"
                                    value={activeTab === "junior-lawyers" ? newLawyer.email : newClient.email}
                                    onChange={handleInputChange}
                                    placeholder="email@example.com"
                                    variant="outlined"
                                    className="w-full"
                                />
                                {formErrors.email && (
                                    <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                                )}
                                {activeTab === "junior-lawyers" && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        They will receive an invitation email to join the system
                                    </p>
                                )}
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone Number
                                </label>
                                <Input1
                                    type="text"
                                    name="phone"
                                    value={activeTab === "junior-lawyers" ? newLawyer.phone : newClient.phone}
                                    onChange={handleInputChange}
                                    placeholder="+94 77 123 4567"
                                    variant="outlined"
                                    className="w-full"
                                />
                                {formErrors.phone && (
                                    <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Location
                                </label>
                                <select
                                    name="location"
                                    value={activeTab === "junior-lawyers" ? newLawyer.location : newClient.location}
                                    onChange={handleInputChange}
                                    className="w-full text-md py-3 px-4 rounded-full bg-white border-2 border-gray-300 text-gray-800 focus:border-black transition-all duration-200 focus:outline-none"
                                >
                                    <option value="">Select Location</option>
                                    {locationOptions.map((location, index) => (
                                        <option key={index} value={location}>{location}</option>
                                    ))}
                                </select>
                                {formErrors.location && (
                                    <p className="text-red-500 text-xs mt-1">{formErrors.location}</p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Court
                                </label>
                                <select
                                    name="court"
                                    value={activeTab === "junior-lawyers" ? newLawyer.court : newClient.court}
                                    onChange={handleInputChange}
                                    className="w-full text-md py-3 px-4 rounded-full bg-white border-2 border-gray-300 text-gray-800 focus:border-black transition-all duration-200 focus:outline-none"
                                >
                                    <option value="">Select Court</option>
                                    <option value="District Court">District Court</option>
                                    <option value="High Court">High Court</option>
                                    <option value="Supreme Court">Supreme Court</option>
                                    <option value="Family Court">Family Court</option>
                                    <option value="Magistrate Court">Magistrate Court</option>
                                </select>
                                {formErrors.court && (
                                    <p className="text-red-500 text-xs mt-1">{formErrors.court}</p>
                                )}
                            </div>

                            {activeTab === "junior-lawyers" && (
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Monthly Salary ($)
                                    </label>
                                    <Input1
                                        type="number"
                                        name="salary"
                                        value={newLawyer.salary}
                                        onChange={handleInputChange}
                                        placeholder="3000"
                                        variant="outlined"
                                        className="w-full"
                                    />
                                    {formErrors.salary && (
                                        <p className="text-red-500 text-xs mt-1">{formErrors.salary}</p>
                                    )}
                                </div>
                            )}
                            
                            <div className="flex justify-end space-x-3">
                                <Button2
                                    text="Cancel"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2"
                                />
                                <Button1
                                    type="submit"
                                    text={isLoading ? "Adding..." : activeTab === "junior-lawyers" ? "Add & Send Invitation" : "Add Client"}
                                    disabled={isLoading}
                                    className="px-4 py-2"
                                />
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Salary Management Modal */}
            {showSalaryModal && selectedLawyer && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
                        <h2 className="text-xl font-bold mb-4">Manage Salary</h2>
                        
                        <div className="mb-6">
                            <div className="flex items-center mb-4">
                                <div className={`w-10 h-10 rounded-full ${getAvatarColor(selectedLawyer.name)} flex items-center justify-center text-sm font-medium mr-3`}>
                                    {getInitials(selectedLawyer.name)}
                                </div>
                                <div>
                                    <div className="font-medium">{selectedLawyer.name}</div>
                                    <div className="text-sm text-gray-500">{selectedLawyer.email}</div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-lg mb-4">
                                <div>
                                    <div className="text-xs text-gray-500">Current Salary</div>
                                    <div className="font-medium">${selectedLawyer.salary?.amount?.toLocaleString() || "Not set"}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500">Location</div>
                                    <div className="font-medium">{selectedLawyer.location}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500">Last Payment</div>
                                    <div className="font-medium">{selectedLawyer.salary?.lastPaid ? formatDate(selectedLawyer.salary.lastPaid) : "Never"}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500">Next Payment</div>
                                    <div className="font-medium">{selectedLawyer.salary?.nextPayment ? formatDate(selectedLawyer.salary.nextPayment) : "Not scheduled"}</div>
                                </div>
                            </div>
                        </div>
                        
                        <form onSubmit={handleSalaryPayment}>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Monthly Salary Amount ($)
                                </label>
                                <Input1
                                    type="number"
                                    value={salaryAmount}
                                    onChange={(e) => setSalaryAmount(e.target.value)}
                                    placeholder="Enter salary amount"
                                    variant="outlined"
                                    className="w-full"
                                    required
                                />
                            </div>
                            
                            <div className="flex justify-end space-x-3">
                                <Button2
                                    text="Cancel"
                                    onClick={() => {
                                        setShowSalaryModal(false);
                                        setSelectedLawyer(null);
                                        setSalaryAmount("");
                                    }}
                                    className="px-4 py-2"
                                />
                                <Button1
                                    type="submit"
                                    text={isLoading ? "Processing..." : "Process Payment"}
                                    disabled={isLoading}
                                    className="px-4 py-2"
                                />
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
                        <h2 className="text-xl font-bold mb-2">Confirm Delete</h2>
                        
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete {selectedUser.name}? This action cannot be undone.
                        </p>
                        
                        <div className="flex justify-end space-x-3">
                            <Button2
                                text="Cancel"
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setSelectedUser(null);
                                }}
                                className="px-4 py-2"
                            />
                            <button
                                onClick={confirmDelete}
                                disabled={isLoading}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors"
                            >
                                {isLoading ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </PageLayout>
    );
};

export default AccountUsers;