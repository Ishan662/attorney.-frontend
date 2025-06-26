import React, { useState, useMemo } from 'react';
import Dropdown from '../../components/UI/Dropdown';
import Button1 from '../../components/UI/Button1';
import Input1 from '../../components/UI/Input1';

const CaseDetails = () => {
    // Initial case data with all required fields
    const initialCaseData = [
        {
            id: 1,
            caseNumber: 'PR-00123',
            caseName: 'The Estate of Eleanor Vance',
            caseType: 'Probate',
            casePriority: 'Medium',
            courtType: 'Superior Court',
            courtLocation: 'Colombo',
            nextHearingDate: '2024-03-15',
            status: 'Open',
            paymentStatus: 'Paid'
        },
        {
            id: 2,
            caseNumber: 'GU-00456',
            caseName: 'The Matter of the Guardianship of Finnigan O\'Malley',
            caseType: 'Guardianship',
            casePriority: 'High',
            courtType: 'Family Court',
            courtLocation: 'Galle',
            nextHearingDate: '2024-04-22',
            status: 'Open',
            paymentStatus: 'Pending'
        },
        {
            id: 3,
            caseNumber: 'EL-00789',
            caseName: 'The Case of the Disputed Will of Arthur Pendragon',
            caseType: 'Estate Litigation',
            casePriority: 'Medium',
            courtType: 'Probate Court',
            courtLocation: 'Badulla',
            nextHearingDate: '2024-05-10',
            status: 'Open',
            paymentStatus: 'Paid'
        },
        {
            id: 4,
            caseNumber: 'GU-01011',
            caseName: 'The Guardianship of Isabella Rossi',
            caseType: 'Guardianship',
            casePriority: 'Low',
            courtType: 'Family Court',
            courtLocation: 'Colombo',
            nextHearingDate: '2024-06-01',
            status: 'Closed',
            paymentStatus: 'Paid'
        },
        {
            id: 5,
            caseNumber: 'PR-01314',
            caseName: 'The Estate of Samuel Bennett',
            caseType: 'Probate',
            casePriority: 'High',
            courtType: 'Superior Court',
            courtLocation: 'Galle',
            nextHearingDate: '2024-07-18',
            status: 'Open',
            paymentStatus: 'Pending'
        }
    ];

    // Filter states
    const [filters, setFilters] = useState({
        caseNumber: '',
        caseName: '',
        caseType: '',
        casePriority: '',
        courtType: '',
        courtLocation: ''
    });

    // Dropdown options derived from data
    const caseNameOptions = useMemo(() => 
        [...new Set(initialCaseData.map(caseItem => caseItem.caseName))]
            .map(name => ({ value: name, label: name }))
    , []);

    const caseTypeOptions = [
        { value: 'Probate', label: 'Probate' },
        { value: 'Guardianship', label: 'Guardianship' },
        { value: 'Estate Litigation', label: 'Estate Litigation' },
        { value: 'Civil', label: 'Civil' },
        { value: 'Criminal', label: 'Criminal' }
    ];

    const casePriorityOptions = [
        { value: 'High', label: 'High' },
        { value: 'Medium', label: 'Medium' },
        { value: 'Low', label: 'Low' }
    ];

    const courtTypeOptions = [
        { value: 'Superior Court', label: 'Superior Court' },
        { value: 'Family Court', label: 'Family Court' },
        { value: 'Probate Court', label: 'Probate Court' },
        { value: 'District Court', label: 'District Court' },
        { value: 'Supreme Court', label: 'Supreme Court' }
    ];

    const courtLocationOptions = [
        { value: 'Colombo', label: 'Colombo' },
        { value: 'Galle', label: 'Galle' },
        { value: 'Badulla', label: 'Badulla' },
        { value: 'Kandy', label: 'Kandy' },
        { value: 'Matara', label: 'Matara' },
        { value: 'Kurunegala', label: 'Kurunegala' }
    ];

    // Filter logic
    const filteredCases = useMemo(() => {
        return initialCaseData.filter(caseItem => {
            return (
                (filters.caseNumber === '' || caseItem.caseNumber.toLowerCase().includes(filters.caseNumber.toLowerCase())) &&
                (filters.caseName === '' || caseItem.caseName === filters.caseName) &&
                (filters.caseType === '' || caseItem.caseType === filters.caseType) &&
                (filters.casePriority === '' || caseItem.casePriority === filters.casePriority) &&
                (filters.courtType === '' || caseItem.courtType === filters.courtType) &&
                (filters.courtLocation === '' || caseItem.courtLocation === filters.courtLocation)
            );
        });
    }, [filters]);

    // Handle filter changes
    const handleFilterChange = (field, value) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Reset all filters
    const handleResetFilters = () => {
        setFilters({
            caseNumber: '',
            caseName: '',
            caseType: '',
            casePriority: '',
            courtType: '',
            courtLocation: ''
        });
    };

    // Get status badge styling
    const getStatusBadge = (status) => {
        const baseClasses = 'px-3 py-1 rounded-full text-sm font-medium';
        if (status === 'Open') {
            return `${baseClasses} bg-green-100 text-green-800`;
        } else if (status === 'Closed') {
            return `${baseClasses} bg-red-100 text-red-800`;
        }
        return `${baseClasses} bg-gray-100 text-gray-800`;
    };

    // Get payment status badge styling
    const getPaymentStatusBadge = (paymentStatus) => {
        const baseClasses = 'px-3 py-1 rounded-full text-sm font-medium';
        if (paymentStatus === 'Paid') {
            return `${baseClasses} bg-green-100 text-green-800`;
        } else if (paymentStatus === 'Pending') {
            return `${baseClasses} bg-yellow-100 text-yellow-800`;
        }
        return `${baseClasses} bg-gray-100 text-gray-800`;
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Filter Panel - Left Side */}
            <div className="w-1/3 bg-white p-6 shadow-lg rounded-lg m-4 h-fit">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Filter Cases</h2>
                    <p className="text-gray-600">Refine your case list using the filters below.</p>
                </div>

                {/* Filter Fields */}
                <div className="space-y-4">
                    {/* Case Number Filter */}
                    <div>
                        <Input1
                            label="Case Number"
                            placeholder="Enter case number"
                            value={filters.caseNumber}
                            onChange={(e) => handleFilterChange('caseNumber', e.target.value)}
                            variant="outlined"
                        />
                    </div>

                    {/* Case Name Filter */}
                    <div>
                        <Dropdown
                            label="Case Name"
                            placeholder="Select case name"
                            options={caseNameOptions}
                            value={filters.caseName}
                            onChange={(option) => handleFilterChange('caseName', option.value)}
                            variant="outlined"
                        />
                    </div>

                    {/* Case Type Filter */}
                    <div>
                        <Dropdown
                            label="Case Type"
                            placeholder="Select case type"
                            options={caseTypeOptions}
                            value={filters.caseType}
                            onChange={(option) => handleFilterChange('caseType', option.value)}
                            variant="outlined"
                        />
                    </div>

                    {/* Case Priority Filter */}
                    <div>
                        <Dropdown
                            label="Case Priority"
                            placeholder="Select case priority"
                            options={casePriorityOptions}
                            value={filters.casePriority}
                            onChange={(option) => handleFilterChange('casePriority', option.value)}
                            variant="outlined"
                        />
                    </div>

                    {/* Court Type Filter */}
                    <div>
                        <Dropdown
                            label="Court Type"
                            placeholder="Select court type"
                            options={courtTypeOptions}
                            value={filters.courtType}
                            onChange={(option) => handleFilterChange('courtType', option.value)}
                            variant="outlined"
                        />
                    </div>

                    {/* Court Location Filter */}
                    <div>
                        <Dropdown
                            label="Court Location"
                            placeholder="Select court location"
                            options={courtLocationOptions}
                            value={filters.courtLocation}
                            onChange={(option) => handleFilterChange('courtLocation', option.value)}
                            variant="outlined"
                        />
                    </div>

                    {/* Reset Button */}
                    <div className="pt-4">
                        <Button1
                            text="Restart"
                            onClick={handleResetFilters}
                            inverted={false}
                            className="w-full"
                        />
                    </div>
                </div>
            </div>

            {/* Case Table - Right Side */}
            <div className="flex-1 bg-white p-6 shadow-lg rounded-lg m-4 ml-0">
                <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Cases ({filteredCases.length} results)
                    </h3>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Case Number
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Case Name
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Case Type
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Priority
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Court Type
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Court Location
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Next Hearing
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Payment Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredCases.length > 0 ? (
                                filteredCases.map((caseItem) => (
                                    <tr key={caseItem.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {caseItem.caseNumber}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs truncate">
                                            {caseItem.caseName}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {caseItem.caseType}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                caseItem.casePriority === 'High' ? 'bg-red-100 text-red-800' :
                                                caseItem.casePriority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-green-100 text-green-800'
                                            }`}>
                                                {caseItem.casePriority}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {caseItem.courtType}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {caseItem.courtLocation}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {caseItem.nextHearingDate}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <span className={getStatusBadge(caseItem.status)}>
                                                {caseItem.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <span className={getPaymentStatusBadge(caseItem.paymentStatus)}>
                                                {caseItem.paymentStatus}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
                                        No cases found matching the selected filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CaseDetails;