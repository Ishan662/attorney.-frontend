import React, { useState } from 'react';
import Button1 from '../../components/UI/Button1';
import Button2 from '../../components/UI/Button2';
import Input1 from '../../components/UI/Input1';

const AddNextHearingModal = ({ isOpen, onClose, caseNumber, courtName, onSave }) => {
  const [formData, setFormData] = useState({
    label: '',
    date: '',
    time: '',
    endTime: '',
    location: courtName || '', // Set court name as default location
    note: '',
    status: 'Planned',
    guests: '',
    googleMeetEnabled: false,
    googleMeetLink: ''
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
            {/* Title Field */}
            <div className="mb-4">
              <label className="block mb-1 font-medium" htmlFor="label">
                Hearing Title <span className="text-red-500">*</span>
              </label>
              <Input1
                id="label"
                type="text"
                placeholder="Enter hearing title"
                value={formData.label}
                onChange={handleChange}
                name="label"
                required
              />
              {errors.label && (
                <p className="mt-1 text-sm text-red-600">{errors.label}</p>
              )}
            </div>

            {/* Date Field */}
            <div className="mb-4">
              <label className="block mb-1 font-medium" htmlFor="date">
                Hearing Date <span className="text-red-500">*</span>
              </label>
              <Input1
                id="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                name="date"
                required
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">{errors.date}</p>
              )}
            </div>

            {/* Time Slots */}
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div className="relative">
                <label className="block mb-1 font-medium">
                  Start Time <span className="text-red-500">*</span>
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
              <div>
                <label className="block mb-1 font-medium" htmlFor="endTime">
                  End Time <span className="text-red-500">*</span>
                </label>
                <Input1
                  id="endTime"
                  type="time"
                  value={formData.endTime || ''}
                  onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                  required
                />
              </div>
            </div>
            
            {/* Location Field */}
            <div className="mb-4">
              <label className="block mb-1 font-medium" htmlFor="location">
                Court/Location <span className="text-red-500">*</span>
              </label>
              <Input1
                id="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                name="location"
                placeholder="Enter court or location address"
                required
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location}</p>
              )}
            </div>

            {/* Guests/Participants */}
            <div className="mb-4">
              <label className="block mb-1 font-medium" htmlFor="guests">
                Guests/Participants
              </label>
              <Input1
                id="guests"
                type="text"
                value={formData.guests || ''}
                onChange={(e) => setFormData({...formData, guests: e.target.value})}
                placeholder="Enter email addresses separated by commas"
              />
            </div>

            {/* Google Meet Integration */}
            <div className="mb-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="googleMeet"
                  checked={formData.googleMeetEnabled || false}
                  onChange={(e) => setFormData({...formData, googleMeetEnabled: e.target.checked})}
                  className="mr-2"
                />
                <label htmlFor="googleMeet" className="font-medium">
                  Add Google Meet
                </label>
              </div>
            </div>

            {/* Google Meet Link (conditionally shown) */}
            {formData.googleMeetEnabled && (
              <div className="mb-4 p-3 bg-gray-50 rounded-md">
                <label className="block mb-1 font-medium text-sm" htmlFor="googleMeetLink">
                  Google Meet Link
                </label>
                <Input1
                  id="googleMeetLink"
                  type="url"
                  value={formData.googleMeetLink || ''}
                  onChange={(e) => setFormData({...formData, googleMeetLink: e.target.value})}
                  placeholder="Enter or paste Google Meet link"
                />
              </div>
            )}
            
            {/* Special Note */}
            <div className="mb-4">
              <label className="block mb-1 font-medium" htmlFor="note">
                Special Note
              </label>
              <textarea
                id="note"
                name="note"
                rows={4}
                className="w-full border border-gray-300 rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add any special notes here"
                value={formData.note}
                onChange={handleChange}
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