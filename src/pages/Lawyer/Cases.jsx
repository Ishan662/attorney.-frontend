import React, { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';
import Button1 from '../../components/UI/Button1';
import Button2 from '../../components/UI/Button2';
import Input1 from '../../components/UI/Input1';
import PageHeader from '../../components/layout/PageHeader';
import PageLayout from '../../components/layout/PageLayout';
import { useNavigate } from 'react-router-dom';

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


const handleNotificationClick = () => {

};

const casesData = [
    {
        id: 1,
        name: 'The Estate of Eleanor Vance',
        type: 'Probate',
        caseNumber: '2023-PR-00123',
        court: 'Superior Court',
        nextHearingDate: '2024-03-16',
        status: 'Open',
        paymentStatus: 'Paid'
    },
    {
        id: 2,
        name: "The Matter of the Guardianship of Finnigan O'Malley",
        type: 'Guardianship',
        caseNumber: '2023-GU-04156',
        court: 'Family Court',
        nextHearingDate: '2024-04-22',
        status: 'Open',
        paymentStatus: 'Pending'
    },
    {
        id: 3,
        name: 'The Case of the Divorced Will of Arthur Pendragn',
        type: 'Estate Litigation',
        caseNumber: '2023-EL-00789',
        court: 'Probate Court',
        nextHearingDate: '2024-05-10',
        status: 'Open',
        paymentStatus: 'Paid'
    },
    {
        id: 4,
        name: 'The Guardianship of Isabella Rose',
        type: 'Guardianship',
        caseNumber: '2023-GU-01011',
        court: 'Family Court',
        nextHearingDate: '2024-06-01',
        status: 'Closed',
        paymentStatus: 'Paid'
    },
    {
        id: 5,
        name: 'The Estate of Samuel Bennett',
        type: 'Probate',
        caseNumber: '2023-PR-01514',
        court: 'Superior Court',
        nextHearingDate: '2024-07-18',
        status: 'Open',
        paymentStatus: 'Pending'
    }
];

const Cases = () => {
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

    const navigate = useNavigate();

    const getStatusBadge = (status) => {
        const baseClasses = "inline-block px-3 py-1 rounded-full text-xs font-medium";
        if (status === 'Open') {
            return `${baseClasses} bg-green-100 text-green-700`;
        } else if (status === 'Closed') {
            return `${baseClasses} bg-gray-100 text-gray-700`;
        }
        return `${baseClasses} bg-blue-100 text-blue-700`;
    };

    const getPaymentStatusBadge = (status) => {
        const baseClasses = "inline-block px-3 py-1 rounded-full text-xs font-medium";
        if (status === 'Paid') {
            return `${baseClasses} bg-green-100 text-green-700`;
        } else if (status === 'Pending') {
            return `${baseClasses} bg-yellow-100 text-yellow-700`;
        }
        return `${baseClasses} bg-red-100 text-red-700`;
    };

    // Filtering logic with all filters
    const filteredCases = casesData.filter(caseItem => {
        // Search filter
        const matchesSearch =
            caseItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            caseItem.caseNumber.toLowerCase().includes(searchTerm.toLowerCase());

        // Case Type filter
        const matchesCaseType =
            !filters.caseType ||
            filters.caseType === 'All Types' ||
            caseItem.type === filters.caseType;

        // Upcoming Hearings filter (only "All Hearings" supported for now)
        const matchesUpcomingHearings =
            !filters.upcomingHearings ||
            filters.upcomingHearings === 'All Hearings';
        // You can add more logic for "This Week", "This Month", etc.

        // Closed Cases filter
        const matchesClosedCases =
            !filters.closedCases ||
            filters.closedCases === 'All Cases' ||
            (filters.closedCases === 'Open Only' && caseItem.status === 'Open') ||
            (filters.closedCases === 'Closed Only' && caseItem.status === 'Closed');

        // Court filter
        const matchesCourt =
            !filters.court ||
            filters.court === 'All Courts' ||
            caseItem.court === filters.court;

        // Date Range filter
        const matchesDateRange = (() => {
            if (!filters.startDate && !filters.endDate) return true;
            
            const hearingDate = new Date(caseItem.nextHearingDate);
            
            // If only start date is provided
            if (filters.startDate && !filters.endDate) {
                const startDate = new Date(filters.startDate);
                return hearingDate >= startDate;
            }
            
            // If only end date is provided
            if (!filters.startDate && filters.endDate) {
                const endDate = new Date(filters.endDate);
                return hearingDate <= endDate;
            }
            
            // If both dates are provided
            if (filters.startDate && filters.endDate) {
                const startDate = new Date(filters.startDate);
                const endDate = new Date(filters.endDate);
                return hearingDate >= startDate && hearingDate <= endDate;
            }
            
            return true;
        })();

        return (
            matchesSearch &&
            matchesCaseType &&
            matchesUpcomingHearings &&
            matchesClosedCases &&
            matchesCourt &&
            matchesDateRange
        );
    });

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
                                    onChange={(e) => setSearchTerm(e.target.value)}
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
                                    options={['All Types', 'Probate', 'Guardianship', 'Estate Litigation']}
                                    value={filters.caseType}
                                    onChange={(value) => setFilters({ ...filters, caseType: value })}
                                />

                                <DropdownFilter
                                    label="Upcoming Hearings"
                                    options={['All Hearings', 'This Week', 'This Month', 'Next Month']}
                                    value={filters.upcomingHearings}
                                    onChange={(value) => setFilters({ ...filters, upcomingHearings: value })}
                                />

                                <DropdownFilter
                                    label="Closed Cases"
                                    options={['All Cases', 'Open Only', 'Closed Only']}
                                    value={filters.closedCases}
                                    onChange={(value) => setFilters({ ...filters, closedCases: value })}
                                />

                                <DropdownFilter
                                    label="Court"
                                    options={['All Courts', 'Superior Court', 'Family Court', 'Probate Court']}
                                    value={filters.court}
                                    onChange={(value) => setFilters({ ...filters, court: value })}
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
                                        onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                                        className="w-32 text-sm"
                                    />
                                    <span className="text-gray-400 text-sm">to</span>
                                    <Input1
                                        type="date"
                                        placeholder="End Date"
                                        value={filters.endDate}
                                        variant="outlined"
                                        onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                                        className="w-32 text-sm"
                                    />
                                    {(filters.startDate || filters.endDate) && (
                                        <button
                                            onClick={() => setFilters({ ...filters, startDate: '', endDate: '' })}
                                            className="text-gray-400 hover:text-gray-600 ml-2"
                                            title="Clear date range"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
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
                                            {filteredCases.map((caseItem) => (
                                                <tr key={caseItem.id} className="border-b last:border-b-0 hover:bg-gray-50 cursor-pointer">
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm font-medium text-gray-900">{caseItem.name}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-gray-600">{caseItem.type}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-gray-600">{caseItem.caseNumber}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-gray-600">{caseItem.court}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-gray-600">{caseItem.nextHearingDate}</div>
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
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredCases.map((caseItem) => (
                                    <div key={caseItem.id} className="bg-white rounded-lg shadow p-6">
                                        <h2 className="text-lg font-semibold mb-2">{caseItem.name}</h2>
                                        <div className="text-sm text-gray-600 mb-1">Type: {caseItem.type}</div>
                                        <div className="text-sm text-gray-600 mb-1">Case #: {caseItem.caseNumber}</div>
                                        <div className="text-sm text-gray-600 mb-1">Court: {caseItem.court}</div>
                                        <div className="text-sm text-gray-600 mb-1">Next Hearing: {caseItem.nextHearingDate}</div>
                                        <div className="mb-1">
                                            <span className={getStatusBadge(caseItem.status)}>{caseItem.status}</span>
                                        </div>
                                        <div>
                                            <span className={getPaymentStatusBadge(caseItem.paymentStatus)}>{caseItem.paymentStatus}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </PageLayout>
    );
};
export default Cases;