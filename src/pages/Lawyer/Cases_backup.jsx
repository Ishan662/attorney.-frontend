import React, { useState, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';
import Button1 from '../../components/UI/Button1';
import Button2 from '../../components/UI/Button2';
import Input1 from '../../components/UI/Input1';
import PageHeader from '../../components/layout/PageHeader';
import PageLayout from '../../components/layout/PageLayout';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAuth } from "firebase/auth";

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

/**
 * Helper to get auth token from Firebase
 */
async function getAuthHeader() {
    const user = getAuth().currentUser;
    if (!user) {
        throw new Error('No authenticated user found. Please log in.');
    }
    const token = await user.getIdToken();
    return { Authorization: `Bearer ${token}` };
}

const DropdownFilter = ({ label, options, value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
                <span className="text-sm">{value || label}</span>
                <ChevronDown className="w-4 h-4" />
            </button>
            {isOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                    {options.map((option, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => {
                                onChange(option);
                                setIsOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                        >
                            {option}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

// const user = {
//     name: 'Nishagi Jewantha',
//     email: 'jewanthadheerath@gmail.com',
//     role: 'lawyer',
// };


const Cases = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    
    // State management
    const [cases, setCases] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [availableOptions, setAvailableOptions] = useState({
        caseTypes: [],
        courts: []
    });

    const [activeTab, setActiveTab] = useState('Table');
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        caseType: '',
        upcomingHearings: '',
        closedCases: '',
        court: '',
        startDate: '',
        endDate: ''
    });

    // API Functions
    const fetchAllCases = async () => {
        try {
            const headers = await getAuthHeader();
            const response = await fetch(`${API_BASE}/api/cases`, {
                method: 'GET',
                headers: {
                    ...headers,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch cases: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching cases:', error);
            throw error;
        }
    };

    const fetchCasesWithFilters = async (filterParams) => {
        try {
            const headers = await getAuthHeader();
            
            // Build query parameters
            const queryParams = new URLSearchParams();
            
            if (filterParams.searchTerm) queryParams.append('searchTerm', filterParams.searchTerm);
            if (filterParams.caseType && filterParams.caseType !== 'All Types') queryParams.append('caseType', filterParams.caseType);
            if (filterParams.court && filterParams.court !== 'All Courts') queryParams.append('courtName', filterParams.court);
            if (filterParams.status) queryParams.append('status', filterParams.status);
            if (filterParams.startDate) queryParams.append('startDate', filterParams.startDate);
            if (filterParams.endDate) queryParams.append('endDate', filterParams.endDate);

            const queryString = queryParams.toString();
            const endpoint = queryString ? `/api/cases/filter?${queryString}` : '/api/cases';

            const response = await fetch(`${API_BASE}${endpoint}`, {
                method: 'GET',
                headers: {
                    ...headers,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch filtered cases: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching filtered cases:', error);
            throw error;
        }
    };

    // Load initial data and populate filter options
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setIsLoading(true);
                setError('');
                
                const casesData = await fetchAllCases();
                setCases(casesData);

                // Extract unique values for filter dropdowns
                const uniqueCaseTypes = [...new Set(casesData.map(c => c.caseType).filter(Boolean))];
                const uniqueCourts = [...new Set(casesData.map(c => c.courtName || c.courtType).filter(Boolean))];
                
                setAvailableOptions({
                    caseTypes: uniqueCaseTypes.sort(),
                    courts: uniqueCourts.sort()
                });

            } catch (err) {
                setError(`Failed to load cases: ${err.message}`);
                console.error('Error loading initial data:', err);
            } finally {
                setIsLoading(false);
            }
        };

        if (currentUser) {
            loadInitialData();
        }
    }, [currentUser]);

    // Apply filters when search term or filters change
    useEffect(() => {
        const applyFilters = async () => {
            // Don't filter if no search term or filters are applied
            if (!searchTerm && 
                !filters.caseType && 
                !filters.court && 
                !filters.startDate && 
                !filters.endDate &&
                !filters.closedCases) {
                return;
            }

            try {
                setIsLoading(true);
                
                // Prepare filter parameters
                const filterParams = {
                    searchTerm: searchTerm || '',
                    caseType: filters.caseType || '',
                    court: filters.court || '',
                    startDate: filters.startDate || '',
                    endDate: filters.endDate || ''
                };

                // Handle status filtering based on closedCases filter
                if (filters.closedCases === 'Open Only') {
                    filterParams.status = 'ACTIVE'; // or whatever your open status is
                } else if (filters.closedCases === 'Closed Only') {
                    filterParams.status = 'CLOSED';
                }

                const filteredCases = await fetchCasesWithFilters(filterParams);
                setCases(filteredCases);
                
            } catch (err) {
                setError(`Failed to filter cases: ${err.message}`);
                console.error('Error applying filters:', err);
            } finally {
                setIsLoading(false);
            }
        };

        // Debounce the filter application
        const timeoutId = setTimeout(() => {
            if (currentUser) {
                applyFilters();
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchTerm, filters, currentUser]);

    // Clear all filters and reload all cases
    const clearAllFilters = async () => {
        setSearchTerm('');
        setFilters({
            caseType: '',
            upcomingHearings: '',
            closedCases: '',
            court: '',
            startDate: '',
            endDate: ''
        });
        
        try {
            setIsLoading(true);
            const allCases = await fetchAllCases();
            setCases(allCases);
        } catch (err) {
            setError(`Failed to reload cases: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const baseClasses = "inline-block px-3 py-1 rounded-full text-xs font-medium";
        if (status === 'OPEN' || status === 'Open') {
            return `${baseClasses} bg-green-100 text-green-700`;
        } else if (status === 'CLOSED' || status === 'Closed') {
            return `${baseClasses} bg-gray-100 text-gray-700`;
        }
        return `${baseClasses} bg-blue-100 text-blue-700`;
    };

    const getPaymentStatusBadge = (status) => {
        const baseClasses = "inline-block px-3 py-1 rounded-full text-xs font-medium";
        if (status === 'PAID_IN_FULL' || status === 'Paid') {
            return `${baseClasses} bg-green-100 text-green-700`;
        } else if (status === 'PENDING' || status === 'Pending') {
            return `${baseClasses} bg-yellow-100 text-yellow-700`;
        }
        return `${baseClasses} bg-red-100 text-red-700`;
    };

    // Event handlers for user input
    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Loading state
    if (isLoading) {
        return (
            <PageLayout currentPage="cases">
                <div className="min-h-screen bg-white">
                    <PageHeader title="My Cases" />
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="text-lg text-gray-600">Loading cases...</div>
                    </div>
                </div>
            </PageLayout>
        );
    }

    // Error state
    if (error) {
        return (
            <PageLayout currentPage="cases">
                <div className="min-h-screen bg-white">
                    <PageHeader title="My Cases" />
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="text-lg text-red-600">Error: {error}</div>
                    </div>
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout>
            <div className="flex-grow overflow-y-auto transition-all duration-300">
                <div className="p-0">
                    <main className="flex-1 p-0">
                        <div className='justify-between flex items-center mb-6'>
                            <h1 className="text-2xl font-semibold mb-6">View All Case Details</h1>
                            <Button1 text="+ Add Case" onClick={() => navigate('/lawyer/newcaseprofile')} />
                        </div>

                        {/* Search Bar */}
                        <div className="mb-6 flex items-center justify-between">
                            <div className="relative w-1/3">
                                <Input1
                                    type="text"
                                    placeholder="Search cases"
                                    value={searchTerm}
                                    variant="outlined"
                                    onChange={handleSearchChange}
                                />
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="mb-6">
                            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
                                {['Table', 'Cards'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab
                                            ? 'bg-white text-gray-900 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="bg-white rounded-lg p-4 shadow-md mb-6">
                            <div className="flex flex-wrap gap-4">
                                <span className="py-2 text-black text-sm">
                                    Filters:
                                </span>

                                <DropdownFilter
                                    label="Case Type"
                                    options={['All Types', ...availableOptions.caseTypes]}
                                    value={filters.caseType}
                                    onChange={(value) => handleFilterChange('caseType', value)}
                                />

                                <DropdownFilter
                                    label="Upcoming Hearings"
                                    options={['All Hearings', 'This Week', 'This Month', 'Next Month']}
                                    value={filters.upcomingHearings}
                                    onChange={(value) => handleFilterChange('upcomingHearings', value)}
                                />

                                <DropdownFilter
                                    label="Closed Cases"
                                    options={['All Cases', 'Open Only', 'Closed Only']}
                                    value={filters.closedCases}
                                    onChange={(value) => handleFilterChange('closedCases', value)}
                                />

                                <DropdownFilter
                                    label="Court"
                                    options={['All Courts', ...availableOptions.courts]}
                                    value={filters.court}
                                    onChange={(value) => handleFilterChange('court', value)}
                                />
                            </div>
                        </div>

                        {/* Date Range Filter - Separate Section */}
                        <div className="bg-white rounded-lg p-4 shadow-md mb-6">
                            <div className="flex items-center space-x-4">
                                <span className="py-2 text-black text-sm font-medium">
                                    Date Range Filter:
                                </span>
                                <div className="flex items-center space-x-2">
                                    <Input1
                                        type="date"
                                        placeholder="Start Date"
                                        value={filters.startDate}
                                        variant="outlined"
                                        onChange={(e) => handleFilterChange('startDate', e.target.value)}
                                        className="w-32 text-sm"
                                    />
                                    <span className="text-gray-400 text-sm">to</span>
                                    <Input1
                                        type="date"
                                        placeholder="End Date"
                                        value={filters.endDate}
                                        variant="outlined"
                                        onChange={(e) => handleFilterChange('endDate', e.target.value)}
                                        className="w-32 text-sm"
                                    />
                                </div>
                                <button 
                                    onClick={clearAllFilters}
                                    className="bg-red-50 text-red-700 px-4 py-2 rounded-lg border border-red-200 hover:bg-red-100 transition-colors text-sm"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        </div>

                        {/* Table or Cards */}
                        {activeTab === 'Table' ? (
                            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">CASE NAME</th>
                                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">CASE TYPE</th>
                                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">CASE NUMBER</th>
                                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">COURT</th>
                                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">NEXT HEARING DATE</th>
                                                <th className="px-6 py-4 text-center text-sm font-medium text-gray-600">STATUS</th>
                                                <th className="px-6 py-4 text-center text-sm font-medium text-gray-600">PAYMENT STATUS</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cases.length === 0 ? (
                                                <tr>
                                                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                                        No cases found
                                                    </td>
                                                </tr>
                                            ) : (
                                                cases.map((caseItem) => (
                                                <tr key={caseItem.id} className="border-b last:border-b-0 hover:bg-gray-50 cursor-pointer">
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm font-medium text-gray-900">{caseItem.caseTitle}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-gray-600">{caseItem.caseType}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-gray-600">{caseItem.caseNumber}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-gray-600">{caseItem.courtName}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-gray-600">{caseItem.nextHearing || 'Not scheduled'}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex justify-center">
                                                            <span className={getStatusBadge(caseItem.status)}>
                                                                {caseItem.status}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex justify-center">
                                                            <span className={getPaymentStatusBadge(caseItem.paymentStatus)}>
                                                                {caseItem.paymentStatus}
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {cases.length === 0 ? (
                                    <div className="col-span-full text-center text-gray-500 py-12">
                                        No cases found
                                    </div>
                                ) : (
                                    cases.map((caseItem) => (
                                    <div key={caseItem.id} className="bg-white rounded-lg shadow p-6">
                                        <h2 className="text-lg font-semibold mb-2">{caseItem.caseTitle}</h2>
                                        <div className="text-sm text-gray-600 mb-1">Type: {caseItem.caseType}</div>
                                        <div className="text-sm text-gray-600 mb-1">Case #: {caseItem.caseNumber}</div>
                                        <div className="text-sm text-gray-600 mb-1">Court: {caseItem.courtName}</div>
                                        <div className="text-sm text-gray-600 mb-1">Next Hearing: {caseItem.nextHearing || 'Not scheduled'}</div>
                                        <div className="mb-1">
                                            <span className={getStatusBadge(caseItem.status)}>{caseItem.status}</span>
                                        </div>
                                        <div>
                                            <span className={getPaymentStatusBadge(caseItem.paymentStatus)}>{caseItem.paymentStatus}</span>
                                        </div>
                                    </div>
                                    ))
                                )}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </PageLayout>
    );
};

export default Cases;