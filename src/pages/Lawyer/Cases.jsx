import React, { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';
import Button1 from '../../components/UI/Button1';
import Button2 from '../../components/UI/Button2';
import Input1 from '../../components/UI/Input1';
import PageHeader from '../../components/layout/PageHeader';
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

const user = {
    name: 'Nishagi Jewantha',
    email: 'jewanthadheerath@gmail.com',
    role: 'lawyer',
};


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

    const [sidebarExpanded, setSidebarExpanded] = useState(true);
    const [notificationCount, setNotificationCount] = useState(1);

    const [activeTab, setActiveTab] = useState('Table');
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        caseType: '',
        upcomingHearings: '',
        closedCases: '',
        paymentDue: ''
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

        // Payment Due filter
        const matchesPaymentDue =
            !filters.paymentDue ||
            filters.paymentDue === 'All Payments' ||
            caseItem.paymentStatus === filters.paymentDue;

        return (
            matchesSearch &&
            matchesCaseType &&
            matchesUpcomingHearings &&
            matchesClosedCases &&
            matchesPaymentDue
        );
    });

    return (
        <div className="flex min-h-screen bg-white-50">
            <Sidebar
                user={user}
                onToggle={setSidebarExpanded}
            />
            <div
                className="flex-grow overflow-y-auto transition-all duration-300"
                style={{
                    marginLeft: sidebarExpanded ? '16rem' : '5rem'
                }}
            >

                <div className="p-6">
                    <div className='mb-8'>
                        <PageHeader
                            user={user}
                            notificationCount={notificationCount}
                            onNotificationClick={handleNotificationClick}
                        />
                    </div>
                    <main className="flex-1 p-8">

                        {/* Search Bar */}
                        <div className="mb-6 flex items-center justify-between">
                            <div className="relative w-64">
                                <Input1
                                    type="text"
                                    placeholder="Search cases"
                                    value={searchTerm}
                                    variant="outlined"
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Button1 text="+ Add Case" onClick={() => navigate('/lawyer/newcaseprofile')} />

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
                        <div className="flex flex-wrap gap-4 mb-6">
                            <span className="inline-block px-3 py-1 bg-black text-white text-sm rounded-full">
                                Cases
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
                                label="Payment Due"
                                options={['All Payments', 'Paid', 'Pending', 'Overdue']}
                                value={filters.paymentDue}
                                onChange={(value) => setFilters({ ...filters, paymentDue: value })}
                            />
                        </div>

                        {/* Table or Cards */}
                        {activeTab === 'Table' ? (
                            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Case Name</th>
                                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Case Type</th>
                                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Case Number</th>
                                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Court</th>
                                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Next Hearing Date</th>
                                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Status</th>
                                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Payment Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {filteredCases.map((caseItem) => (
                                                <tr key={caseItem.id} className="hover:bg-gray-50 cursor-pointer">
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
                                                        <span className={getStatusBadge(caseItem.status)}>
                                                            {caseItem.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={getPaymentStatusBadge(caseItem.paymentStatus)}>
                                                            {caseItem.paymentStatus}
                                                        </span>
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
        </div>
    );
};
export default Cases;