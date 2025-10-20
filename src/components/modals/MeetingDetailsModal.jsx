import React, { useState } from 'react';
import { FaTimes, FaCalendarAlt, FaClock, FaUser, FaFileAlt, FaCheck, FaBan, FaEdit } from 'react-icons/fa';
import Button1 from '../UI/Button1';
import Button2 from '../UI/Button2';
import Input1 from '../UI/Input1';
import { acceptMeetingRequest, rejectMeetingRequest, rescheduleMeetingRequest } from '../../services/meetingRequestService';
import Swal from 'sweetalert2';

const MeetingDetailsModal = ({ isOpen, onClose, meeting, onMeetingUpdated, userRole = 'LAWYER' }) => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [showRescheduleForm, setShowRescheduleForm] = useState(false);
    const [rescheduleData, setRescheduleData] = useState({
        date: '',
        startTime: '',
        endTime: '',
        note: ''
    });

    if (!isOpen || !meeting) return null;

    const handleAccept = async () => {
        const result = await Swal.fire({
            icon: 'question',
            title: 'Accept Meeting Request',
            text: 'Are you sure you want to accept this meeting request?',
            showCancelButton: true,
            confirmButtonText: 'Accept',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#10B981'
        });

        if (result.isConfirmed) {
            setIsUpdating(true);
            try {
                // Get the actual meeting ID from the meeting object
                const meetingId = meeting.id || meeting.extendedProps?.id;
                const updatedMeeting = await acceptMeetingRequest(meetingId);
                
                Swal.fire({
                    icon: 'success',
                    title: 'Meeting Accepted',
                    text: 'The meeting has been accepted and added to your calendar',
                    timer: 2000,
                    showConfirmButton: false
                });

                if (onMeetingUpdated) {
                    onMeetingUpdated(updatedMeeting);
                }
                
                onClose();
            } catch (error) {
                console.error('Error accepting meeting:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Failed to Accept',
                    text: 'Unable to accept the meeting request. Please try again.',
                    confirmButtonColor: '#EF4444'
                });
            } finally {
                setIsUpdating(false);
            }
        }
    };

    const handleReject = async () => {
        const result = await Swal.fire({
            icon: 'warning',
            title: 'Reject Meeting Request',
            text: 'Are you sure you want to reject this meeting request?',
            input: 'textarea',
            inputLabel: 'Reason for rejection (optional)',
            inputPlaceholder: 'Please provide a reason for rejecting this meeting...',
            showCancelButton: true,
            confirmButtonText: 'Reject',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#EF4444'
        });

        if (result.isConfirmed) {
            setIsUpdating(true);
            try {
                // Get the actual meeting ID from the meeting object
                const meetingId = meeting.id || meeting.extendedProps?.id;
                const updatedMeeting = await rejectMeetingRequest(meetingId, result.value || '');
                
                Swal.fire({
                    icon: 'success',
                    title: 'Meeting Rejected',
                    text: 'The meeting request has been rejected',
                    timer: 2000,
                    showConfirmButton: false
                });

                if (onMeetingUpdated) {
                    onMeetingUpdated(updatedMeeting);
                }
                
                onClose();
            } catch (error) {
                console.error('Error rejecting meeting:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Failed to Reject',
                    text: 'Unable to reject the meeting request. Please try again.',
                    confirmButtonColor: '#EF4444'
                });
            } finally {
                setIsUpdating(false);
            }
        }
    };

    const handleRescheduleSubmit = async (e) => {
        e.preventDefault();
        
        if (!rescheduleData.date || !rescheduleData.startTime || !rescheduleData.endTime) {
            Swal.fire({
                icon: 'error',
                title: 'Missing Information',
                text: 'Please fill in all reschedule fields',
                confirmButtonColor: '#EF4444'
            });
            return;
        }

        // Validate time range
        const startTime = new Date(`2000-01-01T${rescheduleData.startTime}:00`);
        const endTime = new Date(`2000-01-01T${rescheduleData.endTime}:00`);
        
        if (endTime <= startTime) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Time Range',
                text: 'End time must be after start time',
                confirmButtonColor: '#EF4444'
            });
            return;
        }

        setIsUpdating(true);
        try {
            // Get the actual meeting ID from the meeting object
            const meetingId = meeting.id || meeting.extendedProps?.id;
            const updatedMeeting = await rescheduleMeetingRequest(meetingId, rescheduleData);
            
            Swal.fire({
                icon: 'success',
                title: 'Meeting Rescheduled',
                text: 'The meeting has been rescheduled. The client will be notified.',
                timer: 2000,
                showConfirmButton: false
            });

            if (onMeetingUpdated) {
                onMeetingUpdated(updatedMeeting);
            }
            
            onClose();
        } catch (error) {
            console.error('Error rescheduling meeting:', error);
            Swal.fire({
                icon: 'error',
                title: 'Failed to Reschedule',
                text: 'Unable to reschedule the meeting. Please try again.',
                confirmButtonColor: '#EF4444'
            });
        } finally {
            setIsUpdating(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        
        // Handle different date formats
        let date;
        if (dateString instanceof Date) {
            date = dateString;
        } else if (typeof dateString === 'string') {
            // Handle ISO date strings (2025-11-20) or DateTime objects
            if (dateString.includes('T') || dateString.includes('-')) {
                date = new Date(dateString);
            } else {
                date = new Date(dateString);
            }
        } else {
            date = new Date(dateString);
        }
        
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (timeString) => {
        if (!timeString) return 'N/A';
        
        // If it's a Date object, extract the time
        if (timeString instanceof Date) {
            return timeString.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
        }
        
        // If it's already a formatted time string (like "2:00 PM"), return as is
        if (typeof timeString === 'string' && (timeString.includes('AM') || timeString.includes('PM'))) {
            return timeString;
        }
        
        // If it's a time string in HH:mm:ss or HH:mm format
        if (typeof timeString === 'string' && timeString.includes(':')) {
            const timeParts = timeString.split(':');
            if (timeParts.length >= 2) {
                const hours = parseInt(timeParts[0]);
                const minutes = timeParts[1];
                const ampm = hours >= 12 ? 'PM' : 'AM';
                const displayHour = hours % 12 || 12;
                return `${displayHour}:${minutes} ${ampm}`;
            }
        }
        
        // Fallback: return the original value as string
        return String(timeString);
    };

    const getStatusBadgeClass = (status) => {
        switch (status?.toUpperCase()) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'ACCEPTED':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'RESCHEDULED':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'REJECTED':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const canManageMeeting = () => {
        const status = meeting.extendedProps?.status || meeting.status;
        return userRole === 'LAWYER' && ['PENDING', 'RESCHEDULED'].includes(status?.toUpperCase());
    };

    const getCurrentMeetingTime = () => {
        if (meeting.extendedProps) {
            // If meeting comes from calendar (has extendedProps)
            if (meeting.extendedProps.rescheduledDate) {
                return {
                    date: meeting.extendedProps.rescheduledDate,
                    startTime: meeting.extendedProps.rescheduledStartTime,
                    endTime: meeting.extendedProps.rescheduledEndTime
                };
            }
            
            // For calendar events, use the start/end Date objects
            return {
                date: meeting.extendedProps.originalDate || meeting.start,
                startTime: meeting.extendedProps.originalStartTime || meeting.start,
                endTime: meeting.extendedProps.originalEndTime || meeting.end
            };
        } else {
            // If meeting comes directly from API
            if (meeting.rescheduledDate) {
                return {
                    date: meeting.rescheduledDate,
                    startTime: meeting.rescheduledStartTime,
                    endTime: meeting.rescheduledEndTime
                };
            }
            
            // For direct API data
            return {
                date: meeting.meetingDate || meeting.start,
                startTime: meeting.startTime || meeting.start,
                endTime: meeting.endTime || meeting.end
            };
        }
    };

    const currentTime = getCurrentMeetingTime();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 p-4 rounded-t-lg">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-medium text-gray-900">Meeting Details</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        >
                            <FaTimes size={18} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
                    <div className="p-6 space-y-6">
                        {/* Status */}
                        <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadgeClass(meeting.extendedProps?.status || meeting.status)}`}>
                                {(meeting.extendedProps?.status || meeting.status)?.toUpperCase() || 'PENDING'}
                            </span>
                            {(meeting.extendedProps?.rescheduledDate || meeting.rescheduledDate) && (
                                <span className="text-sm text-blue-600 font-medium">
                                    (Rescheduled from original time)
                                </span>
                            )}
                        </div>

                        {/* Meeting Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                {/* Date */}
                                <div className="flex items-start gap-3">
                                    <FaCalendarAlt className="text-gray-400 mt-1" />
                                    <div>
                                        <div className="font-medium text-gray-700">Date</div>
                                        <div className="text-gray-900">{formatDate(currentTime.date)}</div>
                                    </div>
                                </div>

                                {/* Time */}
                                <div className="flex items-start gap-3">
                                    <FaClock className="text-gray-400 mt-1" />
                                    <div>
                                        <div className="font-medium text-gray-700">Time</div>
                                        <div className="text-gray-900">
                                            {formatTime(currentTime.startTime)} - {formatTime(currentTime.endTime)}
                                        </div>
                                    </div>
                                </div>

                                {/* Case Information */}
                                <div className="flex items-start gap-3">
                                    <FaFileAlt className="text-gray-400 mt-1" />
                                    <div>
                                        <div className="font-medium text-gray-700">Case</div>
                                        <div className="text-gray-900">
                                            {meeting.extendedProps?.caseNumber && meeting.extendedProps?.caseTitle 
                                                ? `${meeting.extendedProps.caseNumber} - ${meeting.extendedProps.caseTitle}`
                                                : meeting.extendedProps?.caseTitle || meeting.extendedProps?.caseNumber || meeting.caseId || 'N/A'
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {/* Requested By */}
                                <div className="flex items-start gap-3">
                                    <FaUser className="text-gray-400 mt-1" />
                                    <div>
                                        <div className="font-medium text-gray-700">Requested By</div>
                                        <div className="text-gray-900">
                                            {meeting.extendedProps?.clientName || meeting.clientName || 'Client'}
                                        </div>
                                    </div>
                                </div>

                                {/* Original Time (if rescheduled) */}
                                {(meeting.extendedProps?.rescheduledDate || meeting.rescheduledDate) && (
                                    <div className="bg-blue-50 p-3 rounded-lg">
                                        <div className="font-medium text-blue-800 text-sm">Original Request</div>
                                        <div className="text-blue-700 text-sm">
                                            {formatDate(meeting.extendedProps?.originalDate || meeting.meetingDate)} at {formatTime(meeting.extendedProps?.originalStartTime || meeting.startTime)} - {formatTime(meeting.extendedProps?.originalEndTime || meeting.endTime)}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Note */}
                        {(meeting.extendedProps?.note || meeting.note) && (
                            <div>
                                <h3 className="text-lg font-semibold mb-3">Notes</h3>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-gray-700 leading-relaxed">{meeting.extendedProps?.note || meeting.note}</p>
                                </div>
                            </div>
                        )}

                        {/* Reschedule Form */}
                        {showRescheduleForm && (
                            <div className="border-t pt-6">
                                <h3 className="text-lg font-semibold mb-4">Reschedule Meeting</h3>
                                <form onSubmit={handleRescheduleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            New Date <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            value={rescheduleData.date}
                                            onChange={(e) => setRescheduleData(prev => ({ ...prev, date: e.target.value }))}
                                            min={new Date().toISOString().split('T')[0]}
                                            className="w-full text-md py-3 px-4 rounded-lg bg-white border-2 border-gray-300 text-gray-800 focus:border-blue-500 focus:outline-none transition-all"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Start Time <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="time"
                                                value={rescheduleData.startTime}
                                                onChange={(e) => setRescheduleData(prev => ({ ...prev, startTime: e.target.value }))}
                                                className="w-full text-md py-3 px-4 rounded-lg bg-white border-2 border-gray-300 text-gray-800 focus:border-blue-500 focus:outline-none transition-all"
                                                required
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                End Time <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="time"
                                                value={rescheduleData.endTime}
                                                onChange={(e) => setRescheduleData(prev => ({ ...prev, endTime: e.target.value }))}
                                                className="w-full text-md py-3 px-4 rounded-lg bg-white border-2 border-gray-300 text-gray-800 focus:border-blue-500 focus:outline-none transition-all"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Reason for Rescheduling
                                        </label>
                                        <textarea
                                            value={rescheduleData.note}
                                            onChange={(e) => setRescheduleData(prev => ({ ...prev, note: e.target.value }))}
                                            placeholder="Let the client know why you need to reschedule..."
                                            rows={3}
                                            className="w-full text-md py-3 px-4 rounded-lg bg-white border-2 border-gray-300 text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-all resize-none"
                                        />
                                    </div>

                                    <div className="flex justify-end space-x-3">
                                        <Button2
                                            text="Cancel"
                                            onClick={() => setShowRescheduleForm(false)}
                                            disabled={isUpdating}
                                        />
                                        <Button1
                                            type="submit"
                                            text={isUpdating ? "Rescheduling..." : "Reschedule"}
                                            disabled={isUpdating}
                                        />
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t px-6 py-4 bg-gray-50">
                    <div className="flex justify-between items-center">
                        <div className="flex space-x-3">
                            {canManageMeeting() && (
                                <>
                                    <Button1
                                        text={<><FaCheck className="mr-1" /> Accept</>}
                                        onClick={handleAccept}
                                        disabled={isUpdating || showRescheduleForm}
                                        className="flex items-center px-4 py-2"
                                    />
                                    <Button2
                                        text={<><FaEdit className="mr-1" /> Reschedule</>}
                                        onClick={() => setShowRescheduleForm(!showRescheduleForm)}
                                        disabled={isUpdating}
                                        className="flex items-center px-4 py-2"
                                    />
                                    <Button2
                                        text={<><FaBan className="mr-1" /> Reject</>}
                                        onClick={handleReject}
                                        disabled={isUpdating || showRescheduleForm}
                                        className="flex items-center px-4 py-2 text-red-600 border-red-300 hover:bg-red-50"
                                    />
                                </>
                            )}
                        </div>
                        
                        <Button2
                            text="Close"
                            onClick={onClose}
                            disabled={isUpdating}
                            className="px-6 py-2"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MeetingDetailsModal;
