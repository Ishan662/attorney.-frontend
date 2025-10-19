import React, { useState } from 'react';
import Button1 from '../UI/Button1';
import Input1 from '../UI/Input1';

const PaymentModal = ({ isOpen, onClose, caseDetails, onSubmit }) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const { caseTitle, remainingAmount } = caseDetails;

  const handleAmountChange = (e) => {
    const value = e.target.value;
    // Allow only numbers and a single decimal point
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setAmount(value);
      validateAmount(value);
    }
  };
  
  const validateAmount = (value) => {
    const numericValue = parseFloat(value);
    if (isNaN(numericValue) || numericValue <= 0) {
      setError('Please enter a valid amount.');
      return false;
    }
    if (numericValue > remainingAmount) {
      setError(Amount cannot exceed the remaining balance of $${remainingAmount.toFixed(2)}.);
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async () => {
    if (!validateAmount(amount)) return;
    setIsLoading(true);
    await onSubmit(parseFloat(amount));
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-8 shadow-2xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-2">Make a Payment</h2>
        <p className="text-sm text-gray-600 mb-4">For case: <span className="font-semibold">{caseTitle}</span></p>
        
        <div className="bg-blue-50 p-4 rounded-md mb-6 text-center">
          <p className="text-gray-700">Amount Remaining:</p>
          <p className="text-3xl font-bold text-red-600">${remainingAmount.toFixed(2)}</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Amount to Pay ($)</label>
          <Input1
            type="text"
            value={amount}
            onChange={handleAmountChange}
            placeholder="e.g., 500.00"
            variant="outlined"
            autoFocus
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
        
        <div className="flex justify-end gap-4 mt-6">
          <Button1 text="Cancel" onClick={onClose} className="bg-gray-300 hover:bg-gray-400" />
          <Button1
            text={isLoading ? 'Processing...' : 'Proceed to Pay'}
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white"
            disabled={isLoading || !!error || !amount}
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;