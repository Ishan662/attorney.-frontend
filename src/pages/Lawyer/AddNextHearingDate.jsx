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

  const validate = () => {
    const tempErrors = {};
    
    if (!formData.label.trim()) tempErrors.label = 'Hearing label is required';
    if (!formData.date) tempErrors.date = 'Date is required';
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
              />
              
              <Input1
                type="time"
                name="time"
                label="Time (optional)"
                value={formData.time}
                onChange={handleChange}
              />
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