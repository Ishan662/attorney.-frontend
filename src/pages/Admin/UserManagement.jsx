import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/layout/PageLayout";
import Button1 from "../../components/UI/Button1";
import Button2 from "../../components/UI/Button2";
import Input1 from "../../components/UI/Input1";

const UserManagement = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("lawyers");
    const [searchTerm, setSearchTerm] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
    // Admin user data
    const user = {
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin'
    };

    // Sample user data
    const [users, setUsers] = useState({
        lawyers: [
            { 
                id: 1, 
                name: "Nishagi Jewantha", 
                email: "nishagi@example.com", 
                phone: "+94 77 123 4567",
                location: "Colombo",
                role: "lawyer",
                status: "active",
                dateJoined: "2025-01-15",
                clients: 12,
                juniorLawyers: 3
            },
            { 
                id: 2, 
                name: "Ramesh Kumar", 
                email: "ramesh@example.com", 
                phone: "+94 77 456 7890",
                location: "Kandy",
                role: "lawyer",
                status: "active",
                dateJoined: "2025-02-10",
                clients: 8,
                juniorLawyers: 2
            }
        ],
        junior_lawyers: [
            { 
                id: 3, 
                name: "Jane Smith", 
                email: "jane@example.com", 
                phone: "+94 77 234 5678",
                location: "Colombo",
                role: "junior_lawyer",
                status: "active",
                dateJoined: "2025-03-05",
                seniorLawyer: "Nishagi Jewantha",
                cases: 5
            },
            { 
                id: 4, 
                name: "Michael Johnson", 
                email: "michael@example.com", 
                phone: "+94 77 345 6789",
                location: "Galle",
                role: "junior_lawyer",
                status: "active",
                dateJoined: "2025-03-15",
                seniorLawyer: "Ramesh Kumar",
                cases: 3
            },
            { 
                id: 5, 
                name: "Sarah Williams", 
                email: "sarah@example.com", 
                phone: "+94 77 456 7890",
                location: "Kandy",
                role: "junior_lawyer",
                status: "inactive",
                dateJoined: "2025-02-20",
                seniorLawyer: "Nishagi Jewantha",
                cases: 0
            }
        ],
        clients: [
            { 
                id: 6, 
                name: "Robert Chen", 
                email: "robert@example.com", 
                phone: "+94 77 567 8901",
                location: "Matara",
                role: "client",
                status: "active",
                dateJoined: "2025-04-01",
                lawyer: "Nishagi Jewantha",
                cases: 2
            },
            { 
                id: 7, 
                name: "Priya Patel", 
                email: "priya@example.com", 
                phone: "+94 77 678 9012",
                location: "Negombo",
                role: "client",
                status: "active",
                dateJoined: "2025-04-10",
                lawyer: "Ramesh Kumar",
                cases: 1
            },
            { 
                id: 8, 
                name: "David Lee", 
                email: "david@example.com", 
                phone: "+94 77 789 0123",
                location: "Jaffna",
                role: "client",
                status: "inactive",
                dateJoined: "2025-03-25",
                lawyer: "Nishagi Jewantha",
                cases: 0
            }
        ]
    });

    // Get filtered users based on active tab and search term
    const getFilteredUsers = () => {
        return users[activeTab].filter(user => {
            if (searchTerm === "") return true;
            
            return (
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.phone.includes(searchTerm)
            );
        });
    };

    // Toggle user status (active/inactive)
    const toggleUserStatus = (userId) => {
        setUsers(prevUsers => ({
            ...prevUsers,
            [activeTab]: prevUsers[activeTab].map(user => 
                user.id === userId 
                    ? { ...user, status: user.status === "active" ? "inactive" : "active" } 
                    : user
            )
        }));
    };

    // Delete user confirmation
    const handleDeleteClick = (user) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
    };

    // Confirm delete user
    const confirmDelete = () => {
        if (!selectedUser) return;
        
        setIsLoading(true);
        
        // Simulate API call with timeout
        setTimeout(() => {
            setUsers(prevUsers => ({
                ...prevUsers,
                [activeTab]: prevUsers[activeTab].filter(user => user.id !== selectedUser.id)
            }));
            
            setIsLoading(false);
            setShowDeleteModal(false);
            setSelectedUser(null);
            
            // Show success message
            alert(`User ${selectedUser.name} has been deleted.`);
        }, 800);
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

    // Get user role display name
    const getRoleDisplayName = (role) => {
        switch (role) {
            case 'lawyer': return 'Senior Lawyer';
            case 'junior_lawyer': return 'Junior Lawyer';
            case 'client': return 'Client';
            default: return role;
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

    return (
        <PageLayout user={user}>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">User Management</h1>
                    <p className="text-gray-600">Manage all users in the system</p>
                </div>

            </div>

            {/* Tab Navigation */}
            <div className="flex border-b mb-6">
                <button
                    className={`py-2 px-4 font-medium ${activeTab === 'lawyers' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('lawyers')}
                >
                    Senior Lawyers
                </button>
                <button
                    className={`py-2 px-4 font-medium ${activeTab === 'junior_lawyers' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('junior_lawyers')}
                >
                    Junior Lawyers
                </button>
                <button
                    className={`py-2 px-4 font-medium ${activeTab === 'clients' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('clients')}
                >
                    Clients
                </button>
            </div>

            {/* Search */}
            <div className="bg-white rounded-lg p-4 shadow-md mb-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="w-full md:w-1/3">
                        <Input1
                            type="text"
                            placeholder="Search by name, email, location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            variant="outlined"
                            className="w-full"
                        />
                    </div>
                    <div className="text-gray-600">
                        {getFilteredUsers().length} {activeTab.replace('_', ' ')} found
                    </div>
                </div>
            </div>

            {/* Users List */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                {getFilteredUsers().length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 text-left">
                                    <th className="px-6 py-4 text-sm font-medium text-gray-600">Name</th>
                                    <th className="px-6 py-4 text-sm font-medium text-gray-600">Contact Information</th>
                                    <th className="px-6 py-4 text-sm font-medium text-gray-600">Location</th>
                                    {activeTab === 'lawyers' && (
                                        <>
                                            <th className="px-6 py-4 text-sm font-medium text-gray-600">Clients</th>
                                            <th className="px-6 py-4 text-sm font-medium text-gray-600">Junior Lawyers</th>
                                        </>
                                    )}
                                    {activeTab === 'junior_lawyers' && (
                                        <>
                                            <th className="px-6 py-4 text-sm font-medium text-gray-600">Senior Lawyer</th>
                                            <th className="px-6 py-4 text-sm font-medium text-gray-600">Cases</th>
                                        </>
                                    )}
                                    {activeTab === 'clients' && (
                                        <>
                                            <th className="px-6 py-4 text-sm font-medium text-gray-600">Lawyer</th>
                                            <th className="px-6 py-4 text-sm font-medium text-gray-600">Cases</th>
                                        </>
                                    )}
                                    <th className="px-6 py-4 text-sm font-medium text-gray-600">Status</th>
                                    <th className="px-6 py-4 text-sm font-medium text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getFilteredUsers().map((user) => (
                                    <tr key={user.id} className="border-t hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className={`w-10 h-10 rounded-full bg-${user.status === 'active' ? 'blue' : 'gray'}-100 text-${user.status === 'active' ? 'blue' : 'gray'}-800 flex items-center justify-center font-medium mr-3`}>
                                                    {getInitials(user.name)}
                                                </div>
                                                <div>
                                                    <div className="font-medium">{user.name}</div>
                                                    <div className="text-xs text-gray-500">{getRoleDisplayName(user.role)}</div>
                                                    <div className="text-xs text-gray-500">Since: {formatDate(user.dateJoined)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm">{user.email}</div>
                                            <div className="text-sm text-gray-500">{user.phone}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                </svg>
                                                {user.location}
                                            </span>
                                        </td>
                                        
                                        {activeTab === 'lawyers' && (
                                            <>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="inline-flex items-center justify-center bg-blue-100 text-blue-800 rounded-full h-6 w-6 text-xs font-medium">
                                                        {user.clients}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="inline-flex items-center justify-center bg-purple-100 text-purple-800 rounded-full h-6 w-6 text-xs font-medium">
                                                        {user.juniorLawyers}
                                                    </span>
                                                </td>
                                            </>
                                        )}
                                        
                                        {activeTab === 'junior_lawyers' && (
                                            <>
                                                <td className="px-6 py-4 text-sm">{user.seniorLawyer}</td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="inline-flex items-center justify-center bg-blue-100 text-blue-800 rounded-full h-6 w-6 text-xs font-medium">
                                                        {user.cases}
                                                    </span>
                                                </td>
                                            </>
                                        )}
                                        
                                        {activeTab === 'clients' && (
                                            <>
                                                <td className="px-6 py-4 text-sm">{user.lawyer}</td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="inline-flex items-center justify-center bg-blue-100 text-blue-800 rounded-full h-6 w-6 text-xs font-medium">
                                                        {user.cases}
                                                    </span>
                                                </td>
                                            </>
                                        )}
                                        
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
                                                    onClick={() => navigate(`/admin/users/${user.id}`)}
                                                >
                                                    View
                                                </button>
                                                <button 
                                                    className="text-xs font-medium text-gray-600 hover:text-gray-800"
                                                    onClick={() => toggleUserStatus(user.id)}
                                                >
                                                    {user.status === 'active' ? 'Deactivate' : 'Activate'}
                                                </button>
                                                <button 
                                                    className="text-xs font-medium text-red-600 hover:text-red-800"
                                                    onClick={() => handleDeleteClick(user)}
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
                        {searchTerm ? 
                            `No ${activeTab.replace('_', ' ')} match your search criteria.` : 
                            `No ${activeTab.replace('_', ' ')} in the system yet.`}
                    </div>
                )}
            </div>

            {/* Summary Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="text-sm text-gray-500 mb-1">Senior Lawyers</div>
                    <div className="text-xl font-bold">{users.lawyers.length}</div>
                    <div className="text-sm text-green-600 mt-1">
                        {users.lawyers.filter(user => user.status === 'active').length} Active
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="text-sm text-gray-500 mb-1">Junior Lawyers</div>
                    <div className="text-xl font-bold">{users.junior_lawyers.length}</div>
                    <div className="text-sm text-green-600 mt-1">
                        {users.junior_lawyers.filter(user => user.status === 'active').length} Active
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="text-sm text-gray-500 mb-1">Clients</div>
                    <div className="text-xl font-bold">{users.clients.length}</div>
                    <div className="text-sm text-green-600 mt-1">
                        {users.clients.filter(user => user.status === 'active').length} Active
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
                        <h2 className="text-xl font-bold mb-2">Confirm Delete</h2>
                        
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete the user <strong>{selectedUser.name}</strong>? This action cannot be undone.
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
                                {isLoading ? "Deleting..." : "Delete User"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </PageLayout>
    );
};

export default UserManagement;