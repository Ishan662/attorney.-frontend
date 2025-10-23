import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PageLayout from "../../components/layout/PageLayout";
import Button1 from "../../components/UI/Button1";
import Button2 from "../../components/UI/Button2";
import Input1 from "../../components/UI/Input1";

// Import service functions directly
import adminUserService from "../../services/adminUserService";

const UserManagement = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState("lawyers");
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Users state - will be populated from backend only
    const [users, setUsers] = useState({
        lawyers: [],
        juniors: [],
        clients: [],
        researchers: [],
        admins: []
    });

    // Load users from backend on component mount
    useEffect(() => {
        let mounted = true;
        
        const loadUsers = async () => {
            setIsLoading(true);
            setError(null);
            
            try {
                const data = await adminUserService.fetchUsers();
                
                if (!mounted) return;
                
                // Transform backend data to UI format
                const grouped = { lawyers: [], juniors: [], clients: [], researchers: [], admins: [] };
                
                data.forEach(user => {
                    const transformedUser = {
                        id: user.id,
                        name: user.fullName,
                        email: user.email,
                        phone: user.phoneNumber,
                        location: user.firmName || 'N/A',
                        role: user.role.toLowerCase(),
                        status: user.status.toLowerCase(),
                        dateJoined: user.dateJoined,
                        // Additional fields based on role
                        clients: user.clientCount || 0,
                        juniorLawyers: user.juniorLawyerCount || 0,
                        seniorLawyer: user.seniorLawyerName || '',
                        associatedLawyer: user.associatedLawyerName || '',
                        cases: user.caseCount || 0
                    };

                    // Group by role - map API roles to UI categories
                    if (transformedUser.role === 'lawyer') {
                        grouped.lawyers.push(transformedUser);
                    } else if (transformedUser.role === 'junior') {
                        grouped.juniors.push(transformedUser);
                    } else if (transformedUser.role === 'client') {
                        grouped.clients.push(transformedUser);
                    } else if (transformedUser.role === 'researcher') {
                        grouped.researchers.push(transformedUser);
                    } else if (transformedUser.role === 'admin') {
                        grouped.admins.push(transformedUser);
                    }
                });

                setUsers(grouped);
            } catch (err) {
                console.error('Failed to load users:', err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        // Only load if we have a current user (authenticated)
        if (currentUser) {
            loadUsers();
        } else {
            setError('Please log in to access user management');
            setIsLoading(false);
        }
            
        return () => { mounted = false; };
    }, [currentUser]);

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
    const toggleUserStatus = async (userId) => {
        const user = users[activeTab].find(u => u.id === userId);
        if (!user) return;

        // Optimistic update: flip status locally first
        setUsers(prevUsers => ({
            ...prevUsers,
            [activeTab]: prevUsers[activeTab].map(u => 
                u.id === userId 
                    ? { ...u, status: u.status === "active" ? "inactive" : "active" } 
                    : u
            )
        }));

        try {
            // Call backend API
            const newStatus = user.status === 'active' ? 'INACTIVE' : 'ACTIVE';
            await adminUserService.updateUserStatus(userId, newStatus);
        } catch (err) {
            console.error('Failed to update user status:', err);
            // Revert optimistic update on error
            setUsers(prevUsers => ({
                ...prevUsers,
                [activeTab]: prevUsers[activeTab].map(u => 
                    u.id === userId ? user : u
                )
            }));
            alert(`Failed to update user status: ${err.message}`);
        }
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
            case 'junior': return 'Junior Lawyer';
            case 'client': return 'Client';
            case 'researcher': return 'Researcher';
            case 'admin': return 'Administrator';
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
        <PageLayout>
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
                    Senior Lawyers ({users.lawyers.length})
                </button>
                <button
                    className={`py-2 px-4 font-medium ${activeTab === 'juniors' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('juniors')}
                >
                    Junior Lawyers ({users.juniors.length})
                </button>
                <button
                    className={`py-2 px-4 font-medium ${activeTab === 'clients' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('clients')}
                >
                    Clients ({users.clients.length})
                </button>
                <button
                    className={`py-2 px-4 font-medium ${activeTab === 'researchers' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('researchers')}
                >
                    Researchers ({users.researchers.length})
                </button>
                <button
                    className={`py-2 px-4 font-medium ${activeTab === 'admins' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('admins')}
                >
                    Admins ({users.admins.length})
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
                        {getFilteredUsers().length} {activeTab === 'juniors' ? 'junior lawyers' : activeTab.replace('_', ' ')} found
                    </div>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center">
                        <svg className="h-5 w-5 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <div>
                            <h3 className="text-sm font-medium text-red-800">Unable to load users</h3>
                            <p className="text-sm text-red-700 mt-1">{error}</p>
                        </div>
                    </div>
                    <div className="mt-3">
                        <button
                            onClick={() => window.location.reload()}
                            className="text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded-md"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            )}

            {/* Loading indicator */}
            {isLoading && (
                <div className="bg-white rounded-lg shadow-md p-8 mb-6">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mb-4"></div>
                        <div className="text-gray-500">Loading users...</div>
                    </div>
                </div>
            )}

            {/* Users List */}
            {!isLoading && !error && (
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
                                    {activeTab === 'juniors' && (
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
                                    {activeTab === 'researchers' && (
                                        <>
                                            <th className="px-6 py-4 text-sm font-medium text-gray-600">Specialization</th>
                                            <th className="px-6 py-4 text-sm font-medium text-gray-600">Projects</th>
                                        </>
                                    )}
                                    {activeTab === 'admins' && (
                                        <>
                                            <th className="px-6 py-4 text-sm font-medium text-gray-600">Role</th>
                                            <th className="px-6 py-4 text-sm font-medium text-gray-600">Access Level</th>
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
                                        
                                        {activeTab === 'juniors' && (
                                            <>
                                                <td className="px-6 py-4 text-sm">{user.seniorLawyer || 'N/A'}</td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="inline-flex items-center justify-center bg-blue-100 text-blue-800 rounded-full h-6 w-6 text-xs font-medium">
                                                        {user.cases}
                                                    </span>
                                                </td>
                                            </>
                                        )}
                                        
                                        {activeTab === 'clients' && (
                                            <>
                                                <td className="px-6 py-4 text-sm">{user.associatedLawyer || 'N/A'}</td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="inline-flex items-center justify-center bg-blue-100 text-blue-800 rounded-full h-6 w-6 text-xs font-medium">
                                                        {user.cases}
                                                    </span>
                                                </td>
                                            </>
                                        )}

                                        {activeTab === 'researchers' && (
                                            <>
                                                <td className="px-6 py-4 text-sm">
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                        Legal Research
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="inline-flex items-center justify-center bg-green-100 text-green-800 rounded-full h-6 w-6 text-xs font-medium">
                                                        {user.cases}
                                                    </span>
                                                </td>
                                            </>
                                        )}
                                        
                                        {activeTab === 'admins' && (
                                            <>
                                                <td className="px-6 py-4 text-sm">
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                        Administrator
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                                        Full Access
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
                                                    className="text-xs font-medium text-gray-600 hover:text-gray-800"
                                                    onClick={() => toggleUserStatus(user.id)}
                                                >
                                                    {user.status === 'active' ? 'Deactivate' : 'Activate'}
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
                            `No ${activeTab === 'juniors' ? 'junior lawyers' : activeTab} match your search criteria.` : 
                            `No ${activeTab === 'juniors' ? 'junior lawyers' : activeTab} in the system yet.`}
                    </div>
                )}
            </div>
            )}

            {/* Summary Statistics */}
            {!error && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="text-sm text-gray-500 mb-1">Senior Lawyers</div>
                    <div className="text-xl font-bold">{users.lawyers.length}</div>
                    <div className="text-sm text-green-600 mt-1">
                        {users.lawyers.filter(user => user.status === 'active').length} Active
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="text-sm text-gray-500 mb-1">Junior Lawyers</div>
                    <div className="text-xl font-bold">{users.juniors.length}</div>
                    <div className="text-sm text-green-600 mt-1">
                        {users.juniors.filter(user => user.status === 'active').length} Active
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="text-sm text-gray-500 mb-1">Clients</div>
                    <div className="text-xl font-bold">{users.clients.length}</div>
                    <div className="text-sm text-green-600 mt-1">
                        {users.clients.filter(user => user.status === 'active').length} Active
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="text-sm text-gray-500 mb-1">Researchers</div>
                    <div className="text-xl font-bold">{users.researchers.length}</div>
                    <div className="text-sm text-green-600 mt-1">
                        {users.researchers.filter(user => user.status === 'active').length} Active
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="text-sm text-gray-500 mb-1">Administrators</div>
                    <div className="text-xl font-bold">{users.admins.length}</div>
                    <div className="text-sm text-green-600 mt-1">
                        {users.admins.filter(user => user.status === 'active').length} Active
                    </div>
                </div>
            </div>
            )}
        </PageLayout>
    );
};

export default UserManagement;