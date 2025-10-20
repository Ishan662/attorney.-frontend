import { useState, useEffect } from "react";
import PageLayout from "../../components/layout/PageLayout";
import PageHeader from "../../components/layout/PageHeader";
import { lawyerDashboardService } from "../../services/lawyerDashboardService";

const DaySummary = () => {
    const [notificationCount] = useState(3);
    const [currentDate, setCurrentDate] = useState('');
    
    // Day summary state for closed and open cases
    const [closedCases, setClosedCases] = useState([]);
    const [openCases, setOpenCases] = useState([]);
    const [dayIncome, setDayIncome] = useState({ amount: 0, currency: 'USD' });
    
    // Loading states
    const [isLoadingClosedCases, setIsLoadingClosedCases] = useState(true);
    const [isLoadingOpenCases, setIsLoadingOpenCases] = useState(true);
    const [isLoadingIncome, setIsLoadingIncome] = useState(true);
    
    // Error states
    const [closedCasesError, setClosedCasesError] = useState(null);
    const [openCasesError, setOpenCasesError] = useState(null);
    const [incomeError, setIncomeError] = useState(null);

    const [user] = useState({
        name: 'Nishagi Jewantha',
        email: 'jeewanthadeherath@gmail.com',
        role: 'LAWYER',
    });
    
    useEffect(() => {
        // Format date like YYYY/MM/DD
        const today = new Date();
        const formattedDate = `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`;
        setCurrentDate(formattedDate);
    }, []);

    // Load day summary data from backend using your new endpoints
    useEffect(() => {
        const loadDaySummaryData = async () => {
            // Load closed cases
            try {
                setIsLoadingClosedCases(true);
                setClosedCasesError(null);
                
                const closedCasesData = await lawyerDashboardService.getDaySummaryClosedCases();
                const formattedClosedCases = closedCasesData.map(caseData => 
                    lawyerDashboardService.formatCaseForDisplay(caseData)
                );
                setClosedCases(formattedClosedCases);
            } catch (error) {
                console.error('Error loading closed cases:', error);
                setClosedCasesError('Failed to load closed cases. Please try again later.');
            } finally {
                setIsLoadingClosedCases(false);
            }

            // Load open cases
            try {
                setIsLoadingOpenCases(true);
                setOpenCasesError(null);
                
                const openCasesData = await lawyerDashboardService.getDaySummaryOpenCases();
                const formattedOpenCases = openCasesData.map(caseData => 
                    lawyerDashboardService.formatCaseForDisplay(caseData)
                );
                setOpenCases(formattedOpenCases);
            } catch (error) {
                console.error('Error loading open cases:', error);
                setOpenCasesError('Failed to load open cases. Please try again later.');
            } finally {
                setIsLoadingOpenCases(false);
            }

            // Load today's income
            try {
                setIsLoadingIncome(true);
                setIncomeError(null);
                
                const incomeData = await lawyerDashboardService.getTodaysIncome();
                setDayIncome(incomeData || { amount: 0, currency: 'USD' });
            } catch (error) {
                console.error('Error loading today\'s income:', error);
                setIncomeError('Failed to load income data. Please try again later.');
            } finally {
                setIsLoadingIncome(false);
            }
        };

        loadDaySummaryData();
    }, []);
    
    // Handle notification click
    const handleNotificationClick = () => {
        console.log('Notifications clicked from Day Summary page');
    };

    // Render case card component
    const renderCaseCard = (caseData, index) => (
        <div key={caseData.id || index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200">
            <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold text-gray-900 text-lg">{caseData.displayName}</h4>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    caseData.status === 'CLOSED' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                }`}>
                    {caseData.statusDisplay}
                </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="space-y-2">
                    <div><strong className="text-gray-700">Case #:</strong> <span className="text-gray-600">{caseData.caseNumber}</span></div>
                    <div><strong className="text-gray-700">Client:</strong> <span className="text-gray-600">{caseData.clientName}</span></div>
                    <div><strong className="text-gray-700">Type:</strong> <span className="text-gray-600">{caseData.caseType}</span></div>
                    {caseData.clientPhone && caseData.clientPhone !== 'N/A' && (
                        <div><strong className="text-gray-700">Phone:</strong> <span className="text-gray-600">{caseData.clientPhone}</span></div>
                    )}
                </div>
                
                <div className="space-y-2">
                    <div><strong className="text-gray-700">Court:</strong> <span className="text-gray-600">{caseData.courtName}</span></div>
                    {caseData.opposingPartyName && caseData.opposingPartyName !== 'N/A' && (
                        <div><strong className="text-gray-700">Opposing:</strong> <span className="text-gray-600">{caseData.opposingPartyName}</span></div>
                    )}
                    <div><strong className="text-gray-700">Fee:</strong> <span className="text-gray-600">${caseData.agreedFee?.toLocaleString() || '0'}</span></div>
                    <div><strong className="text-gray-700">Payment:</strong> <span className="text-gray-600">{caseData.paymentStatusDisplay}</span></div>
                </div>
            </div>
            
            {caseData.description && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                    <div><strong className="text-gray-700">Description:</strong></div>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">{caseData.description}</p>
                </div>
            )}
            
            <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                <div className="flex justify-between">
                    <span>Created: {caseData.createdAt}</span>
                    <span>Updated: {caseData.updatedAt}</span>
                </div>
            </div>
        </div>
    );

    return (
        <PageLayout user={user}>
            <div className="mb-8">
                <PageHeader
                    user={user}
                    notificationCount={notificationCount}
                    onNotificationClick={handleNotificationClick}
                />
            </div>
            
            {/* Day Summary specific header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Day Summary</h1>
                    <p className="text-gray-600 mt-1">Today is - {currentDate}</p>
                </div>
            </div>

            {/* Summary Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Today's Income Card */}
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-300 hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Today's Income</h3>
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-600 text-2xl">💰</span>
                        </div>
                    </div>
                    {isLoadingIncome ? (
                        <div className="animate-pulse">
                            <div className="h-8 bg-gray-200 rounded mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded"></div>
                        </div>
                    ) : incomeError ? (
                        <div className="text-red-500 text-sm">{incomeError}</div>
                    ) : (
                        <>
                            <div className="text-4xl font-bold text-green-600 mb-2">
                                {dayIncome.currency === 'USD' ? '$' : ''}
                                {dayIncome.amount?.toLocaleString() || '0'}
                            </div>
                            <p className="text-gray-500 text-sm">Total earnings today</p>
                        </>
                    )}
                </div>

                {/* Closed Cases Card */}
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-300 hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Closed Cases</h3>
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 text-2xl">✅</span>
                        </div>
                    </div>
                    {isLoadingClosedCases ? (
                        <div className="animate-pulse">
                            <div className="h-8 bg-gray-200 rounded mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded"></div>
                        </div>
                    ) : closedCasesError ? (
                        <div className="text-red-500 text-sm">{closedCasesError}</div>
                    ) : (
                        <>
                            <div className="text-4xl font-bold text-blue-600 mb-2">
                                {closedCases?.length || 0}
                            </div>
                            <p className="text-gray-500 text-sm">Cases completed today</p>
                        </>
                    )}
                </div>

                {/* Open Cases Card */}
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-300 hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Open Cases</h3>
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-600 text-2xl">�</span>
                        </div>
                    </div>
                    {isLoadingOpenCases ? (
                        <div className="animate-pulse">
                            <div className="h-8 bg-gray-200 rounded mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded"></div>
                        </div>
                    ) : openCasesError ? (
                        <div className="text-red-500 text-sm">{openCasesError}</div>
                    ) : (
                        <>
                            <div className="text-4xl font-bold text-green-600 mb-2">
                                {openCases?.length || 0}
                            </div>
                            <p className="text-gray-500 text-sm">Cases currently open</p>
                        </>
                    )}
                </div>
            </div>

            {/* Detailed Cases List */}
            <div className="space-y-8">
                {/* Closed Cases Detail */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                        <span className="text-blue-600 mr-3">✅</span>
                        Closed Cases Details
                    </h3>
                    {isLoadingClosedCases ? (
                        <div className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="animate-pulse border border-gray-200 rounded-lg p-4">
                                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded mb-1"></div>
                                    <div className="h-3 bg-gray-200 rounded"></div>
                                </div>
                            ))}
                        </div>
                    ) : closedCasesError ? (
                        <div className="text-center py-8">
                            <div className="text-red-500 mb-4 text-4xl">⚠️</div>
                            <p className="text-red-600 mb-4">{closedCasesError}</p>
                            <button 
                                onClick={() => window.location.reload()}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
                            >
                                Retry
                            </button>
                        </div>
                    ) : closedCases?.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-400 text-6xl mb-4">📝</div>
                            <p className="text-gray-500 text-lg">No cases closed today</p>
                            <p className="text-gray-400 text-sm mt-2">Closed cases will appear here</p>
                        </div>
                    ) : (
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                            {closedCases.map((caseData, index) => renderCaseCard(caseData, index))}
                        </div>
                    )}
                </div>

                {/* Open Cases Detail */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                        <span className="text-green-600 mr-3">�</span>
                        Open Cases Details
                    </h3>
                    {isLoadingOpenCases ? (
                        <div className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="animate-pulse border border-gray-200 rounded-lg p-4">
                                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded mb-1"></div>
                                    <div className="h-3 bg-gray-200 rounded"></div>
                                </div>
                            ))}
                        </div>
                    ) : openCasesError ? (
                        <div className="text-center py-8">
                            <div className="text-red-500 mb-4 text-4xl">⚠️</div>
                            <p className="text-red-600 mb-4">{openCasesError}</p>
                            <button 
                                onClick={() => window.location.reload()}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
                            >
                                Retry
                            </button>
                        </div>
                    ) : openCases?.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-400 text-6xl mb-4">📂</div>
                            <p className="text-gray-500 text-lg">No open cases today</p>
                            <p className="text-gray-400 text-sm mt-2">Open cases will appear here</p>
                        </div>
                    ) : (
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                            {openCases.map((caseData, index) => renderCaseCard(caseData, index))}
                        </div>
                    )}
                </div>
            </div>
        </PageLayout>
    );
};

export default DaySummary;