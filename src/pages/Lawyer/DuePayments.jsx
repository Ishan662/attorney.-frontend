import { useState, useEffect } from "react";
import PageLayout from "../../components/layout/PageLayout";
import Button1 from "../../components/UI/Button1";
import Button2 from "../../components/UI/Button2";
import Input1 from "../../components/UI/Input1";
import SendRemindersModal from "./SendRemindersModal";
import EditPaymentActions from "./EditPaymentActions";
import { getReceivedPayments, getOverduePayments, sendOverdueReminders } from "../../services/paymentService";

const DuePayments = () => {
    const [activeTab, setActiveTab] = useState("all");
    const [showRemindersModal, setShowRemindersModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    
    const [payments, setPayments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // --- ▼▼▼ ADD STATE FOR SENDING REMINDERS ▼▼▼ ---
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError('');
                let data;
                let formattedData;

                if (activeTab === 'all') {
                    data = await getReceivedPayments();
                    formattedData = data.map(p => ({
                        id: p.id,
                        client: { name: p.clientName || 'N/A', initials: p.clientName ? p.clientName.split(' ').map(n=>n[0]).join('') : '??' },
                        caseNumber: p.caseNumber,
                        court: p.court,
                        dueDate: p.paymentDate,
                        amount: p.amount / 100,
                        status: p.status === 'SUCCESS' ? 'Paid' : 'Pending'
                    }));
                } else if (activeTab === 'overdue') {
                    data = await getOverduePayments();
                    formattedData = data.map(c => ({
                        id: c.caseId,
                        client: { name: c.clientName, initials: c.clientName ? c.clientName.split(' ').map(n=>n[0]).join('') : '??' },
                        caseNumber: c.caseNumber,
                        court: c.courtName,
                        dueDate: c.caseCreationDate,
                        amount: (c.agreedFee * 100 - c.totalPaidAmount) / 100,
                        status: 'Overdue'
                    }));
                }
                setPayments(formattedData);
            } catch (err) {
                setError("Failed to load data. Please try again.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [activeTab]);

    // --- ▼▼▼ ADD HANDLER FOR SENDING REMINDERS ▼▼▼ ---
    const handleSendReminders = async () => {
        setIsSending(true);
        try {
            const response = await sendOverdueReminders();
            alert(response.message || "Reminders sent successfully!");
        } catch (err) {
            alert(err.message || "An error occurred while sending reminders.");
        } finally {
            setIsSending(false);
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    const handlePaymentAction = (id, action) => {
        console.log(`Action: ${action} for payment ID ${id}`);
    };

    const handlePaymentUpdate = (updatedPayment) => {
        setShowEditModal(false);
    };

    const handleSort = (column) => {
        console.log(`Sorting by ${column}`);
    };

    const getFilteredPayments = () => {
        if (!searchTerm) return payments;
        return payments.filter(payment => 
            payment.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (payment.caseNumber && payment.caseNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (payment.court && payment.court.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    };

    const getOverdueAmount = () => {
        return getFilteredPayments().reduce((sum, payment) => sum + payment.amount, 0);
    };

    if (isLoading) {
        return <PageLayout><div className="p-6 text-gray-600 font-medium">Loading payments...</div></PageLayout>;
    }
    
    if (error) {
        return <PageLayout><div className="p-6 text-red-600 font-semibold">{error}</div></PageLayout>;
    }

    return (
        <PageLayout>
            <div className="p-0">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold">Client Payments</h1>
                </div>

                <div className="flex border-b mb-6">
                    <button
                        className={`py-2 px-4 font-medium ${activeTab === 'all' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => handleTabChange('all')}
                    >
                        All Payments
                    </button>
                    <button
                        className={`py-2 px-4 font-medium ${activeTab === 'overdue' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => handleTabChange('overdue')}
                    >
                        Overdue
                    </button>
                </div>

                <div className="mb-6 flex items-center justify-between">
                    <div className="relative w-1/3">
                        <Input1 type="text" placeholder="Search by client, case, or court..." value={searchTerm} variant="outlined" onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                </div>

                {activeTab === 'overdue' && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-medium text-red-800">Total Overdue Amount</h3>
                                <p className="text-sm text-red-600">Cases created more than 2 months ago and not fully paid.</p>
                            </div>
                            <div className="text-right">
                                <div className="flex items-center gap-4">
                                    <div className="text-2xl font-bold text-red-700">{formatCurrency(getOverdueAmount())}</div>
                                    {/* --- ▼▼▼ UPDATED BUTTON LOGIC ▼▼▼ --- */}
                                    <Button2 
                                        text={isSending ? "Sending..." : "Send Reminders"}
                                        className="bg-red-600 hover:bg-red-700 text-white text-sm py-2 px-4"
                                        onClick={handleSendReminders}
                                        disabled={isSending || getFilteredPayments().length === 0}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b bg-gray-50">
                                    
                                </tr>
                            </thead>
                            <tbody>
                                {getFilteredPayments().map((payment) => (
                                    <tr key={payment.id} className="border-b last:border-b-0 hover:bg-gray-50">
                                        <td className="px-6 py-4"><div className="flex items-center"><div className={`w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center mr-3 text-xs font-medium`}>{payment.client.initials}</div><span>{payment.client.name}</span></div></td>
                                        <td className="px-6 py-4 text-sm font-medium">{payment.caseNumber}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{payment.court}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{formatDate(payment.dueDate)}</td>
                                        <td className="px-6 py-4 text-right font-medium text-gray-800">{formatCurrency(payment.amount)}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                payment.status === 'Paid' ? 'bg-green-100 text-green-800' :
                                                payment.status === 'Overdue' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>{payment.status}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2">
                                                {payment.status !== 'Paid' && activeTab === 'all' && (
                                                    <Button1 text="Mark Paid" className="text-white text-xs py-1 px-2" onClick={() => handlePaymentAction(payment.id, 'mark-paid')} />
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {getFilteredPayments().length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="text-center py-10 text-gray-500">
                                            {activeTab === 'overdue' ? 'No overdue cases found.' : 'No payments found.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <SendRemindersModal isOpen={showRemindersModal} onClose={() => setShowRemindersModal(false)} allPayments={payments.filter(p => p.status !== 'Paid')} />
                <EditPaymentActions isOpen={showEditModal} onClose={handlePaymentUpdate} payment={selectedPayment} />
            </div>
        </PageLayout>
    );
};

export default DuePayments;