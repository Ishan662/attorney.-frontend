import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Input1 from '../../components/UI/Input1';
import Button1 from '../../components/UI/Button1';
import PageLayout from '../../components/layout/PageLayout';
import { getMyCases } from '../../services/caseService';
import PaymentModal from '../../components/payments/PaymentModal';
import { initiateStripePayment, getTotalPaidForCase } from '../../services/paymentService';

const user = {
  name: 'Nishagi Jewantha',
  email: 'jewanthadheerath@gmail.com',
  role: 'client',
};

const Clientpayments = () => {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);

  useEffect(() => {
    const fetchCasesAndPaymentDetails = async () => {
      try {
        setIsLoading(true);
        // 1. Fetch the initial list of cases
        const initialCases = await getMyCases();

        // 2. For each case, create a promise to fetch its total paid amount
        const paymentDetailPromises = initialCases.map(c =>
          getTotalPaidForCase(c.id)
        );

        // 3. Wait for all payment detail fetches to complete
        const paymentDetails = await Promise.all(paymentDetailPromises);

        // 4. Merge the payment details back into the case objects
        const casesWithPaymentDetails = initialCases.map((caseData, index) => ({
          ...caseData,
          // The API returns the amount in cents in the `totalPaidAmount` field
          totalPaidAmountInCents: paymentDetails[index].totalPaidAmount,
        }));
        
        setCases(casesWithPaymentDetails);
      } catch (err) {
        setError('Failed to load your cases or payment details. Please try refreshing.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCasesAndPaymentDetails();
  }, []); // The empty array ensures this runs only once on component mount

  const filteredCases = cases.filter(c =>
    (c.caseTitle?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (c.caseNumber?.toLowerCase() || '').includes(search.toLowerCase())
  );

  const getPaymentStatusStyle = (status) => {
    switch (status) {
      case 'PAID IN FULL': return 'text-green-600 font-bold';
      case 'PARTIALLY PAID': return 'text-yellow-600 font-bold';
      case 'PENDING': return 'text-red-600 font-bold';
      default: return 'text-gray-600 font-bold';
    }
  };

  const needsPayment = (paymentStatus) => paymentStatus !== 'PAID IN FULL';

  const handlePaymentClick = (caseData, remainingAmount) => {
    setSelectedCase({ ...caseData, remainingAmount });
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (amountToPay) => {
    if (!selectedCase) return;

    const paymentData = {
      amount: Math.round(amountToPay * 100),
      currency: 'usd',
      description: `Payment for case: ${selectedCase.caseTitle}`,
      customerEmail: selectedCase.clientEmail,
      caseId: selectedCase.id,
    };

    try {
      const { checkoutUrl } = await initiateStripePayment(paymentData);
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        throw new Error('Checkout URL not received from server.');
      }
    } catch (apiError) {
      alert(apiError.message || 'An unexpected error occurred.');
      setIsModalOpen(false);
    }
  };
  
  return (
    <PageLayout user={user}>
      {selectedCase && (
        <PaymentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          caseDetails={selectedCase}
          onSubmit={handleModalSubmit}
        />
      )}
      
      <div className="flex min-h-screen bg-white-50">
        <div className="flex-grow overflow-y-auto transition-all duration-300">
          <div className="p-6">
            <main className="flex-1 p-0">
              <h1 className="text-2xl font-semibold mb-6">Payments</h1>
              <div className="mb-6 max-w-md">
                <Input1
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by case name or case number..."
                  className="bg-orange-50"
                  variant="outlined"
                />
              </div>
              <div className="space-y-4">
                {isLoading ? (
                  <p>Loading payment details...</p>
                ) : error ? (
                  <p className="text-red-500">{error}</p>
                ) : (
                  filteredCases.map(c => {
                    const agreedFee = c.agreedFee || 0;
                    const paidAmount = (c.totalPaidAmountInCents || 0) / 100;
                    const remainingAmount = agreedFee - paidAmount;
                    
                    return (
                      <div
                        key={c.id}
                        className="bg-white rounded-lg p-5 shadow-md border border-gray-200"
                      >
                        <div className="bg-gray-100 font-semibold text-base mb-4 px-4 py-2 rounded-md">
                          {c.caseTitle}
                        </div>

                        <div className="text-sm text-gray-700 space-y-2 mb-4">
                          <div>
                            <span className="font-bold">Case Number:</span> {c.caseNumber}
                          </div>
                          <div>
                            <span className="font-bold">Senior Lawyer:</span> {c.ownerLawyerName || 'N/A'}
                          </div>
                          <div>
                            <span className="font-bold">Case Type:</span> {c.caseType || 'N/A'}
                          </div>
                          <div>
                            <span className="font-bold">Junior Associate:</span> {c.junior || 'Not Assigned'}
                          </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                          <h3 className="font-bold text-blue-800 mb-3 text-base">Payment Information</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center">
                              <div className="text-xs text-gray-600 uppercase tracking-wide mb-1">Total Fee</div>
                              <div className="text-2xl font-bold text-gray-800">
                                ${agreedFee.toFixed(2)}
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-gray-600 uppercase tracking-wide mb-1">Paid</div>
                              <div className="text-2xl font-bold text-green-600">
                                ${paidAmount.toFixed(2)}
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-gray-600 uppercase tracking-wide mb-1">Remaining</div>
                              <div className={`text-2xl font-bold ${remainingAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                ${remainingAmount.toFixed(2)}
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-center mt-4 pt-3 border-t border-blue-200">
                            <div className="text-xs text-gray-600 uppercase tracking-wide mb-1">Status</div>
                            <div className={`text-lg ${getPaymentStatusStyle(c.paymentStatus)}`}>
                              {c.paymentStatus?.replace('_', ' ') || 'PENDING'}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Button1
                            text={<span>View Details →</span>}
                            className="flex items-center"
                            onClick={() => navigate(`/client/case/${c.id}`)}
                          />
                          {needsPayment(c.paymentStatus) ? (
                            <Button1
                              text={<span>Make Payment</span>}
                              className="flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold"
                              onClick={() => handlePaymentClick(c, remainingAmount)}
                            />
                          ) : (
                            <Button1
                              text={<span>✓ Fully Paid</span>}
                              className="flex items-center bg-gray-400 cursor-not-allowed"
                              disabled
                            />
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
                {!isLoading && !error && filteredCases.length === 0 && (
                  <p>No cases found.</p>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Clientpayments;