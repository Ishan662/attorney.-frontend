import React, { useState, useEffect } from 'react';
import { FaTimes, FaCalendarAlt, FaClock } from 'react-icons/fa';
import Button1 from '../UI/Button1';
import Button2 from '../UI/Button2';
import Input1 from '../UI/Input1';
import { createClientMeetingRequest, checkClientTimeSlotAvailability, getClientMeetingRequests } from '../../services/clientMeetingService';
import { getMyCases } from '../../services/caseService';
import Swal from 'sweetalert2';

const MeetingRequestModal = ({ isOpen, onClose, onMeetingCreated, caseId = null }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [cases, setCases] = useState([]);
    const [existingMeetings, setExistingMeetings] = useState([]);
    const [formData, setFormData] = useState({
        caseId: caseId || '',
        title: '',
        meetingDate: '',
        startTime: '',
        endTime: '',
        note: ''
    });

    // Load cases and existing meetings when modal opens
    useEffect(() => {
        if (isOpen) {
            loadInitialData();
        }
    }, [isOpen]);

    // Set case if provided as prop
    useEffect(() => {
        if (caseId) {
            setFormData(prev => ({ ...prev, caseId }));
        }
    }, [caseId]);

    const loadInitialData = async () => {
        try {
            const [casesData, meetingsData] = await Promise.all([
                getMyCases(),
                getClientMeetingRequests()
            ]);
            setCases(casesData || []);
            setExistingMeetings(meetingsData || []);
        } catch (error) {
            console.error('Error loading initial data:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate form
        if (!formData.caseId || !formData.title || !formData.meetingDate || !formData.startTime || !formData.endTime) {
            Swal.fire({
                icon: 'error',
                title: 'Missing Information',
                text: 'Please fill in all required fields',
                confirmButtonColor: '#EF4444'
            });
            return;
        }

        // Validate time range
        const startTime = new Date(`2000-01-01T${formData.startTime}:00`);
        const endTime = new Date(`2000-01-01T${formData.endTime}:00`);
        
        if (endTime <= startTime) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Time Range',
                text: 'End time must be after start time',
                confirmButtonColor: '#EF4444'
            });
            return;
        }

        // Check for conflicts
        const isTimeSlotAvailable = checkClientTimeSlotAvailability(
            formData.meetingDate,
            `${formData.startTime}:00`,
            `${formData.endTime}:00`,
            existingMeetings
        );

        if (!isTimeSlotAvailable) {
            const result = await Swal.fire({
                icon: 'warning',
                title: 'Time Slot Conflict',
                text: 'The requested time slot may conflict with existing meetings. Do you want to proceed anyway?',
                showCancelButton: true,
                confirmButtonText: 'Proceed',
                cancelButtonText: 'Cancel',
                confirmButtonColor: '#F59E0B'
            });

            if (!result.isConfirmed) {
                return;
            }
        }

        setIsLoading(true);
        
        try {
            const meetingData = {
                caseId: formData.caseId,
                title: formData.title,
                meetingDate: formData.meetingDate,
                startTime: `${formData.startTime}:00`,
                endTime: `${formData.endTime}:00`,
                note: formData.note
            };

            const newMeeting = await createClientMeetingRequest(meetingData);
            
            // Show success message
            Swal.fire({
                icon: 'success',
                title: 'Meeting Request Sent',
                text: 'Your meeting request has been sent to your lawyer for approval',
                confirmButtonColor: '#10B981'
            });

            // Reset form
            setFormData({
                caseId: caseId || '',
                title: '',
                meetingDate: '',
                startTime: '',
                endTime: '',
                note: ''
            });

            // Notify parent component
            if (onMeetingCreated) {
                onMeetingCreated(newMeeting);
            }

            onClose();
        } catch (error) {
            console.error('Error creating meeting request:', error);
            
            let errorMessage = 'Failed to create meeting request. Please try again.';
            
            if (error.message.includes('409') || error.message.includes('conflict')) {
                errorMessage = 'The requested time slot is unavailable. Please choose a different time.';
            } else if (error.message.includes('403')) {
                errorMessage = 'You do not have permission to request meetings for this case.';
            }

            Swal.fire({
                icon: 'error',
                title: 'Request Failed',
                text: errorMessage,
                confirmButtonColor: '#EF4444'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const getMinDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 p-4 rounded-t-lg">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-medium text-gray-900">Request Meeting</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                            disabled={isLoading}
                        >
                            <FaTimes size={18} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Case Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Case <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="caseId"
                            value={formData.caseId}
                            onChange={handleInputChange}
                            className="w-full text-md py-3 px-4 rounded-lg bg-white border-2 border-gray-300 text-gray-800 focus:border-blue-500 focus:outline-none transition-all"
                            required
                            disabled={!!caseId || isLoading}
                        >
                            <option value="">Choose a case</option>
                            {cases.map(caseItem => (
                                <option key={caseItem.id} value={caseItem.id}>
                                    {caseItem.caseNumber} - {caseItem.caseTitle}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Meeting Title */}
                    <div>
                        <Input1
                            label="Meeting Title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="e.g., Case strategy discussion"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    {/* Meeting Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Meeting Date <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaCalendarAlt className="text-gray-400" />
                            </div>
                            <input
                                type="date"
                                name="meetingDate"
                                value={formData.meetingDate}
                                onChange={handleInputChange}
                                min={getMinDate()}
                                className="w-full text-md py-3 pl-10 pr-4 rounded-lg bg-white border-2 border-gray-300 text-gray-800 focus:border-blue-500 focus:outline-none transition-all"
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    {/* Time Selection */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Start Time <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaClock className="text-gray-400" />
                                </div>
                                <select
                                    name="startTime"
                                    value={formData.startTime}
                                    onChange={handleInputChange}
                                    className="w-full text-md py-3 pl-10 pr-4 rounded-lg bg-white border-2 border-gray-300 text-gray-800 focus:border-blue-500 focus:outline-none transition-all"
                                    required
                                    disabled={isLoading}
                                >
                                    <option value="">Select start time</option>
                                    <option value="09:00">9:00 AM</option>
                                    <option value="10:00">10:00 AM</option>
                                    <option value="11:00">11:00 AM</option>
                                    <option value="12:00">12:00 PM</option>
                                    <option value="13:00">1:00 PM</option>
                                    <option value="14:00">2:00 PM</option>
                                    <option value="15:00">3:00 PM</option>
                                    <option value="16:00">4:00 PM</option>
                                    <option value="17:00">5:00 PM</option>
                                    <option value="18:00">6:00 PM</option>
                                    <option value="19:00">7:00 PM</option>
                                    <option value="20:00">8:00 PM</option>
                                    <option value="21:00">9:00 PM</option>
                                    <option value="22:00">10:00 PM</option>
                                </select>
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                End Time <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaClock className="text-gray-400" />
                                </div>
                                <select
                                    name="endTime"
                                    value={formData.endTime}
                                    onChange={handleInputChange}
                                    className="w-full text-md py-3 pl-10 pr-4 rounded-lg bg-white border-2 border-gray-300 text-gray-800 focus:border-blue-500 focus:outline-none transition-all"
                                    required
                                    disabled={isLoading}
                                >
                                    <option value="">Select end time</option>
                                    <option value="09:00">9:00 AM</option>
                                    <option value="10:00">10:00 AM</option>
                                    <option value="11:00">11:00 AM</option>
                                    <option value="12:00">12:00 PM</option>
                                    <option value="13:00">1:00 PM</option>
                                    <option value="14:00">2:00 PM</option>
                                    <option value="15:00">3:00 PM</option>
                                    <option value="16:00">4:00 PM</option>
                                    <option value="17:00">5:00 PM</option>
                                    <option value="18:00">6:00 PM</option>
                                    <option value="19:00">7:00 PM</option>
                                    <option value="20:00">8:00 PM</option>
                                    <option value="21:00">9:00 PM</option>
                                    <option value="22:00">10:00 PM</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Note */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Additional Notes
                        </label>
                        <textarea
                            name="note"
                            value={formData.note}
                            onChange={handleInputChange}
                            placeholder="Provide any additional context or topics you'd like to discuss..."
                            rows={3}
                            className="w-full text-md py-3 px-4 rounded-lg bg-white border-2 border-gray-300 text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-all resize-none"
                            disabled={isLoading}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 pt-4">
                        <Button2
                            text="Cancel"
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-6 py-2"
                        />
                        <Button1
                            type="submit"
                            text={isLoading ? "Sending..." : "Send Request"}
                            disabled={isLoading}
                            className="px-6 py-2"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MeetingRequestModal;
