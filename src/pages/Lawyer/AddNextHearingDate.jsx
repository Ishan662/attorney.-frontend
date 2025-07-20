import React, { useState } from 'react';
import Button1 from '../../components/UI/Button1';
import Button2 from '../../components/UI/Button2';
import Input1 from '../../components/UI/Input1';

const AddNextHearingModal = ({ isOpen, onClose, caseNumber, onSave }) => {
  const [formData, setFormData] = useState({
    label: '',
    date: '',
    time: '',
    location: '',
    note: '',
    status: 'Planned'
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);

  // Available hours (8 AM to 4 PM)
  const availableHours = [
    { value: '08:00', label: '8 AM' },
    { value: '09:00', label: '9 AM' },
    { value: '10:00', label: '10 AM' },
    { value: '11:00', label: '11 AM' },
    { value: '12:00', label: '12 PM' },
    { value: '13:00', label: '1 PM' },
    { value: '14:00', label: '2 PM' },
    { value: '15:00', label: '3 PM' },
    { value: '16:00', label: '4 PM' }
  ];

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is modified
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleTimeSelect = (timeValue) => {
    setFormData({
      ...formData,
      time: timeValue
    });
    setShowTimeDropdown(false);
    
    // Clear time error when selecting a time
    if (errors.time) {
      setErrors({
        ...errors,
        time: ''
      });
    }
  };

  const getSelectedTimeLabel = () => {
    const selectedTime = availableHours.find(hour => hour.value === formData.time);
    return selectedTime ? selectedTime.label : 'Select time';
  };

  const validate = () => {
    const tempErrors = {};
    
    if (!formData.label.trim()) tempErrors.label = 'Hearing label is required';
    if (!formData.date) {
      tempErrors.date = 'Date is required';
    } else {
      // Check if the selected date is in the past
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison
      
      if (selectedDate < today) {
        tempErrors.date = 'Hearing date cannot be in the past';
      }
    }
    
    // Validate time if provided
    if (formData.time) {
      const time = formData.time;
      if (time < '08:00' || time > '16:00') {
        tempErrors.time = 'Time must be between 8:00 AM and 4:00 PM';
      }
    }
    
    if (!formData.location.trim()) tempErrors.location = 'Location is required';
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      
      if (validate()) {
          setIsSubmitting(true);
          
          try {
              // 'onSave' is now an async function that makes an API call.
              // We await its completion.
              await onSave(formData);
              
              // The parent component (CaseDetails) will now handle closing the modal.
              // We don't call onClose() here anymore on success.
          } catch (error) {
              // The parent will show an alert, but we should stop the loading spinner.
              console.error("onSave failed:", error);
          } finally {
              setIsSubmitting(false);
          }
      }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Add Next Hearing</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-4">
          <p className="text-sm text-gray-600 mb-4">
            Adding next hearing for Case: <span className="font-medium">{caseNumber}</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input1
              type="text"
              name="label"
              label="Hearing Label"
              placeholder="e.g. Final Hearing, Follow-up, etc."
              required
              value={formData.label}
              onChange={handleChange}
              error={errors.label}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Input1
                type="date"
                name="date"
                label="Date"
                required
                value={formData.date}
                onChange={handleChange}
                error={errors.date}
                min={new Date().toISOString().split('T')[0]} // Set minimum date to today
              />
              
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time (8 AM - 4 PM)
                </label>
                <div 
                  onClick={() => setShowTimeDropdown(!showTimeDropdown)}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm cursor-pointer focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.time ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <span className={formData.time ? 'text-gray-900' : 'text-gray-500'}>
                    {getSelectedTimeLabel()}
                  </span>
                  <svg className="absolute right-3 top-9 h-5 w-5 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {showTimeDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 overflow-auto border border-gray-300">
                    {availableHours.map(hour => (
                      <div
                        key={hour.value}
                        onClick={() => handleTimeSelect(hour.value)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-900"
                      >
                        {hour.label}
                      </div>
                    ))}
                  </div>
                )}
                {errors.time && (
                  <p className="mt-1 text-sm text-red-600">{errors.time}</p>
                )}
              </div>
            </div>
            
            <Input1
              type="text"
              name="location"
              label="Location"
              placeholder="Court name or address"
              required
              value={formData.location}
              onChange={handleChange}
              error={errors.location}
            />
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Planned">Planned</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (optional)
              </label>
              <textarea
                name="note"
                rows={3}
                value={formData.note}
                onChange={handleChange}
                placeholder="Any important details about this hearing"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button2
                text="Cancel"
                onClick={onClose}
                disabled={isSubmitting}
              />
              <Button1
                type="submit"
                text={isSubmitting ? "Saving..." : "Save Hearing"}
                disabled={isSubmitting}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddNextHearingModal;