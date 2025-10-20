import { useState, useEffect, useRef } from "react";
import PageLayout from "../../components/layout/PageLayout";
import Button1 from "../../components/UI/Button1";
import Input1 from "../../components/UI/Input1";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { FaBriefcase, FaClock, FaCog, FaPlus, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import CourtColorSettings from "./CourtColorSettings";
import { getCasesForCalendar, createHearing, updateHearing, deleteHearing, getAllHearingsForCalendar, createTask, getAllTasksForCalendar, updateTask, deleteTask, validateHearing, validateTask, getCourtColors, updateCourtColors } from '../../services/caseService';
import EditHearingModal from './EditHearingModal';
import Swal from 'sweetalert2';

// Import Custom Calendar Styles
import "../../styles/calendar.css";
import "../../styles/calendar-additions.css";

const Lawyercalender = () => {
  const navigate = useNavigate();
  const calendarRef = useRef(null);

  const user = {
    name: "Thusitha",
    email: "jeewanthadeherath@gmail.com",
    role: "lawyer",
  };

  // State for cases from backend
  const [cases, setCases] = useState([]);
  const [loadingCases, setLoadingCases] = useState(true);
  const [casesError, setCasesError] = useState(null);

  // Hearings state for calendar display
  const [hearings, setHearings] = useState([]);
  const [loadingHearings, setLoadingHearings] = useState(true);
  const [hearingsError, setHearingsError] = useState(null);

  // Tasks state for calendar display
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [tasksError, setTasksError] = useState(null);

  // Validation state
  const [validationResult, setValidationResult] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [showValidationResult, setShowValidationResult] = useState(false);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentDate, setCurrentDate] = useState(new Date()); // For tracking the current viewing month
  const [viewMode, setViewMode] = useState("month");
  const [showPopup, setShowPopup] = useState(false);
  const [showTaskPopup, setShowTaskPopup] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [createModalMode, setCreateModalMode] = useState("hearing"); // "hearing" or "task"
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Settings popup state
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Court colors state - loaded from backend API
  const [courtColors, setCourtColors] = useState({});
  const [loadingCourtColors, setLoadingCourtColors] = useState(true);

  // Enhanced form state for popup
  const [title, setTitle] = useState("");
  const [selectedCase, setSelectedCase] = useState("");
  const [location, setLocation] = useState("");
  const [hearingDate, setHearingDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [guests, setGuests] = useState("");
  const [specialNote, setSpecialNote] = useState("");
  const [googleMeetEnabled, setGoogleMeetEnabled] = useState(false);
  const [googleMeetLink, setGoogleMeetLink] = useState("");
  const [showCaseDropdown, setShowCaseDropdown] = useState(false);

  // Form state for task popup
  const [taskTitle, setTaskTitle] = useState("");
  const [taskLocation, setTaskLocation] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [taskStartTime, setTaskStartTime] = useState("");
  const [taskEndTime, setTaskEndTime] = useState("");
  const [taskNote, setTaskNote] = useState("");

  // Court colors are now managed through backend API

  // Handle view mode changes
  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const newView = viewMode === "month" ? "dayGridMonth" : "timeGridWeek";
      calendarApi.changeView(newView);
    }
  }, [viewMode]);

  // Clear form values when modal mode changes
  useEffect(() => {
    if (createModalMode === "hearing") {
      // Reset task form fields
      setTaskTitle("");
      setTaskLocation("");
      setTaskDate("");
      setTaskStartTime("");
      setTaskEndTime("");
      setTaskNote("");
      
      // Only reset hearing form fields if no case is selected
      // This preserves the location when a case is already selected
      if (!selectedCase) {
        setTitle("");
        setLocation("");
        setGuests("");
        setSpecialNote("");
        setGoogleMeetEnabled(false);
        setGoogleMeetLink("");
      }
      
      // Set hearing date/time if available
      if (selectedTimeSlot) {
        const slotDate = new Date(selectedTimeSlot);
        setHearingDate(slotDate.toISOString().split('T')[0]);
        
        // Format time for input (HH:MM)
        const hours = slotDate.getHours().toString().padStart(2, '0');
        const minutes = slotDate.getMinutes().toString().padStart(2, '0');
        setStartTime(`${hours}:${minutes}`);
        
        // Set end time 1 hour later by default
        const endSlot = new Date(slotDate);
        endSlot.setHours(endSlot.getHours() + 1);
        const endHours = endSlot.getHours().toString().padStart(2, '0');
        const endMinutes = endSlot.getMinutes().toString().padStart(2, '0');
        setEndTime(`${endHours}:${endMinutes}`);
      }
    } else if (createModalMode === "task") {
      // Reset hearing form fields
      setTitle("");
      setSelectedCase("");
      setLocation("");
      setHearingDate("");
      setStartTime("");
      setEndTime("");
      setGuests("");
      setSpecialNote("");
      setGoogleMeetEnabled(false);
      setGoogleMeetLink("");
      
      // Set task date/time if available
      if (selectedTimeSlot) {
        const slotDate = new Date(selectedTimeSlot);
        setTaskDate(slotDate.toISOString().split('T')[0]);
        
        // Format time for input (HH:MM)
        const hours = slotDate.getHours().toString().padStart(2, '0');
        const minutes = slotDate.getMinutes().toString().padStart(2, '0');
        setTaskStartTime(`${hours}:${minutes}`);
        
        // Set end time 1 hour later by default
        const endSlot = new Date(slotDate);
        endSlot.setHours(endSlot.getHours() + 1);
        const endHours = endSlot.getHours().toString().padStart(2, '0');
        const endMinutes = endSlot.getMinutes().toString().padStart(2, '0');
        setTaskEndTime(`${endHours}:${endMinutes}`);
      }
    }
  }, [createModalMode, selectedTimeSlot]);

  // Fetch cases when component mounts
  useEffect(() => {
    const fetchCases = async () => {
      try {
        setLoadingCases(true);
        setCasesError(null);
        const fetchedCases = await getCasesForCalendar();
        setCases(fetchedCases);
      } catch (error) {
        console.error('Failed to fetch cases:', error);
        setCasesError('Failed to load cases. Please try again.');
        // Fallback to empty array or show error message
        setCases([]);
      } finally {
        setLoadingCases(false);
      }
    };

    fetchCases();
  }, []);

  // Fetch hearings when component mounts
  useEffect(() => {
    const fetchHearings = async () => {
      try {
        setLoadingHearings(true);
        setHearingsError(null);
        const fetchedHearings = await getAllHearingsForCalendar();
        setHearings(fetchedHearings);
      } catch (error) {
        console.error('Failed to fetch hearings:', error);
        setHearingsError('Failed to load hearings. Please try again.');
        setHearings([]);
      } finally {
        setLoadingHearings(false);
      }
    };

    fetchHearings();
  }, []);

  // Fetch tasks when component mounts
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoadingTasks(true);
        setTasksError(null);
        const fetchedTasks = await getAllTasksForCalendar();
        setTasks(fetchedTasks);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
        setTasksError('Failed to load tasks. Please try again.');
        setTasks([]);
      } finally {
        setLoadingTasks(false);
      }
    };

    fetchTasks();
  }, []);

  // Fetch court colors when component mounts
  useEffect(() => {
    const fetchCourtColors = async () => {
      try {
        setLoadingCourtColors(true);
        const fetchedCourtColors = await getCourtColors();
        setCourtColors(fetchedCourtColors); // Use exactly what backend returns
      } catch (error) {
        console.error('Failed to fetch court colors:', error);
        setCourtColors({}); // Start with empty court colors on error
      } finally {
        setLoadingCourtColors(false);
      }
    };

    fetchCourtColors();
  }, []);

  // Format date display like "21st of June, Saturday"
  const formatDateDisplay = (date) => {
    const day = date.getDate();
    const daySuffix = (d) => {
      if (d > 3 && d < 21) return "th";
      switch (d % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };
    const month = date.toLocaleString("default", { month: "long" });
    const weekday = date.toLocaleString("default", { weekday: "long" });
    return `${day}${daySuffix(day)} of ${month}, ${weekday}`;
  };

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    // Day of week for first day (0=Sun, 6=Sat)
    const startDay = firstDay.getDay();

    // Empty slots before first day
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    // Days of month
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(new Date(year, month, d));
    }

    return days;
  };

  // Navigation functions
  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.today();
    }
  };

  const goToPreviousMonth = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.prev();
    }
  };

  const goToNextMonth = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.next();
    }
  };

  // Get current month/year display
  const getCurrentMonthYear = () => {
    return currentDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const getScheduledEventsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD format
    return events.filter(event => {
      const eventStart = new Date(event.start).toISOString().split('T')[0];
      return eventStart === dateStr;
    });
  };

  // Time slots for day summary panel
  const dayTimeSlots = [
    "8 AM - 9 AM",
    "9 AM - 10 AM",
    "10 AM - 11 AM",
    "11 AM - 12 PM",
    "12 PM - 1 PM",
    "1 PM - 2 PM",
    "2 PM - 3 PM",
    "3 PM - 4 PM",
    "4 PM - 5 PM",
  ];

  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

  // Handle case selection
  const handleCaseSelect = (caseId) => {
    const selectedCaseData = cases.find(c => c.id === caseId);
    if (selectedCaseData) {
      console.log('Case selected:', selectedCaseData); // Debug log
      console.log('Setting location to:', selectedCaseData.court); // Debug log
      setSelectedCase(caseId);
      setTitle(`${selectedCaseData.caseName} - Hearing`);
      // Auto-fill location with court information
      setLocation(selectedCaseData.court || '');
    }
    setShowCaseDropdown(false);
  };

  // Get selected case label
  const getSelectedCaseLabel = () => {
    const caseData = cases.find(c => c.id === selectedCase);
    return caseData ? `${caseData.caseName} (${caseData.caseNumber})` : "Select Case";
  };

  // Handle settings button click
  const handleSettingsClick = () => {
    setShowSettingsModal(true);
  };

  // Handle save court colors from settings modal
  const handleSaveCourtColors = async (newCourtColors) => {
    try {
      console.log('Attempting to save court colors:', newCourtColors);
      
      // Update court colors in the backend
      await updateCourtColors(newCourtColors);
      
      // Update local state - this will automatically trigger re-rendering of events with new colors
      setCourtColors(newCourtColors);
      
      // Show success message
      await Swal.fire({
        title: 'Success!',
        text: 'Court colors saved successfully! Calendar events will now reflect the new colors.',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#f97316'
      });
    } catch (error) {
      console.error('Failed to save court colors:', error);
      
      let errorMessage = 'Failed to save court colors. ';
      if (error.message.includes('403')) {
        errorMessage += 'Access denied. Please make sure you are logged in as a lawyer.';
      } else if (error.message.includes('401')) {
        errorMessage += 'Authentication failed. Please log in again.';
      } else {
        errorMessage += 'Please try again.';
      }
      
      await Swal.fire({
        title: 'Error!',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#f97316'
      });
    }
  };

  // Get background color based on court location
  const getCourtBackgroundColor = (location) => {
    return courtColors[location] || "#9CA3AF"; // Default gray if no color defined
  };

  // Get text color (white or black) based on background color for readability
  const getTextColor = (bgColor) => {
    // Convert hex to RGB
    const hex = bgColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // Calculate brightness (0-255)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    // Return white text for dark backgrounds, black for light
    return brightness > 128 ? 'text-gray-900' : 'text-white';
  };

  // Open popup on time slot click
  const handleTimeSlotClick = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
    setCreateModalMode("hearing");
    setShowCreateModal(true);
  };

  // Navigation to different forms
  const navigateToHearingForm = () => {
    navigate("/lawyer/add-hearing");
  };

  const navigateToTaskForm = () => {
    navigate("/lawyer/add-task");
  };
  
  // Open task creation modal
  const handleOpenTaskModal = () => {
    setSelectedTimeSlot("");
    setCreateModalMode("task");
    setShowCreateModal(true);
  };

  // Enhanced handle popup form save
  // Function to refresh hearings after creating/updating/deleting
  const refreshHearings = async () => {
    try {
      setLoadingHearings(true);
      const fetchedHearings = await getAllHearingsForCalendar();
      setHearings(fetchedHearings);
    } catch (error) {
      console.error('Failed to refresh hearings:', error);
      setHearingsError('Failed to refresh hearings.');
    } finally {
      setLoadingHearings(false);
    }
  };

  // Function to refresh tasks after creating/updating/deleting
  const refreshTasks = async () => {
    try {
      setLoadingTasks(true);
      const fetchedTasks = await getAllTasksForCalendar();
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Failed to refresh tasks:', error);
      setTasksError('Failed to refresh tasks.');
    } finally {
      setLoadingTasks(false);
    }
  };

  // Function to validate hearing before saving
  const validateAndShowResult = async (hearingFormData, isTask = false) => {
    try {
      setIsValidating(true);
      setShowValidationResult(false);
      
      let result;
      if (isTask) {
        result = await validateTask(hearingFormData);
      } else {
        result = await validateHearing(hearingFormData);
      }
      
      setValidationResult(result);
      setShowValidationResult(true);
      
      return result;
    } catch (error) {
      console.error('Validation error:', error);
      setValidationResult({
        valid: false,
        message: 'Failed to validate. Please try again.',
        travelSeconds: 0,
        travelText: ''
      });
      setShowValidationResult(true);
      return { valid: false };
    } finally {
      setIsValidating(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!selectedCase) {
      await Swal.fire({
        title: 'Validation Error',
        text: 'Please select a case',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#f97316'
      });
      return;
    }
    
    if (!title || !hearingDate || !startTime || !endTime) {
      await Swal.fire({
        title: 'Validation Error',
        text: 'Please fill in all required fields',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#f97316'
      });
      return;
    }

    // Date validation - cannot be in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day
    const selectedDate = new Date(hearingDate);
    selectedDate.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      await Swal.fire({
        title: 'Invalid Date',
        text: 'Please select a date that is today or in the future. Past dates are not allowed.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#f97316'
      });
      return;
    }

    // Time validation - must be between 9:30 AM and 3:30 PM
    const timeToMinutes = (timeStr) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const startTimeMinutes = timeToMinutes(startTime);
    const endTimeMinutes = timeToMinutes(endTime);
    const minTimeMinutes = 9 * 60 + 30; // 9:30 AM
    const maxTimeMinutes = 15 * 60 + 30; // 3:30 PM

    if (startTimeMinutes < minTimeMinutes || startTimeMinutes > maxTimeMinutes) {
      await Swal.fire({
        title: 'Invalid Start Time',
        text: 'Start time must be between 9:30 AM and 3:30 PM.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#f97316'
      });
      return;
    }

    if (endTimeMinutes < minTimeMinutes || endTimeMinutes > maxTimeMinutes) {
      await Swal.fire({
        title: 'Invalid End Time',
        text: 'End time must be between 9:30 AM and 3:30 PM.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#f97316'
      });
      return;
    }

    // Validate that end time is after start time
    if (endTimeMinutes <= startTimeMinutes) {
      await Swal.fire({
        title: 'Invalid Time Range',
        text: 'End time must be after start time.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#f97316'
      });
      return;
    }
    
    const selectedCaseData = cases.find(c => c.id === selectedCase);
    
    try {
      // Prepare hearing data for backend
      const hearingFormData = {
        label: title,
        date: hearingDate,
        startTime: startTime,
        endTime: endTime,
        location: location,
        guests: guests,
        specialNote: specialNote,
        court: location,
        participants: guests
      };
      
      // Validate hearing before creating
      const validationResult = await validateAndShowResult(hearingFormData, false);
      
      if (!validationResult.valid) {
        // Don't proceed if validation fails
        return;
      }
      
      // Call backend API with case ID
      const response = await createHearing(selectedCase, hearingFormData);
      
      // Create a new event for the calendar display
      const backgroundColor = courtColors[location] || "#1a73e8"; // Use location from form, not case court
      const newEvent = {
        id: response.id || `hearing-${Date.now()}`,
        title: title || `${selectedCaseData?.caseNumber || ''} Hearing`,
        start: `${hearingDate}T${startTime}:00`,
        end: `${hearingDate}T${endTime}:00`,
        backgroundColor: backgroundColor,
        borderColor: backgroundColor,
        textColor: "#ffffff",
        extendedProps: {
          type: "hearing",
          location: location,
          caseId: selectedCase, // Include case ID
          caseNumber: selectedCaseData?.caseNumber || "",
          guests: guests,
          notes: specialNote,
          googleMeet: googleMeetEnabled ? googleMeetLink : ""
        }
      };
      
      await Swal.fire({
        title: 'Success!',
        html: `
          <div class="text-left">
            <p><strong>Hearing created successfully!</strong></p>
            <p><strong>Case:</strong> ${selectedCaseData?.caseName || 'N/A'}</p>
            <p><strong>Case Number:</strong> ${selectedCaseData?.caseNumber || 'N/A'}</p>
            <p><strong>Date:</strong> ${hearingDate}</p>
            <p><strong>Time:</strong> ${startTime} - ${endTime}</p>
            <p><strong>Title:</strong> ${title}</p>
            <p><strong>Location:</strong> ${location}</p>
          </div>
        `,
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#f97316'
      });
      
      // Refresh hearings to show the new hearing on calendar
      await refreshHearings();
      
    } catch (error) {
      console.error('Error creating hearing:', error);
      await Swal.fire({
        title: 'Error!',
        text: 'Failed to create hearing. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#f97316'
      });
      return;
    }
    
    // Reset form and close modal
    setTitle("");
    setSelectedCase("");
    setLocation("");
    setHearingDate("");
    setStartTime("");
    setEndTime("");
    setGuests("");
    setSpecialNote("");
    setGoogleMeetEnabled(false);
    setGoogleMeetLink("");
    setShowPopup(false);
    setShowCreateModal(false);
  };

  // Handle task form save
  const handleTaskSave = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!taskTitle || !taskDate || !taskStartTime || !taskEndTime) {
      await Swal.fire({
        title: 'Validation Error',
        text: 'Please fill in all required fields',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#f97316'
      });
      return;
    }

    // Date validation - cannot be in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day
    const selectedTaskDate = new Date(taskDate);
    selectedTaskDate.setHours(0, 0, 0, 0);
    
    if (selectedTaskDate < today) {
      await Swal.fire({
        title: 'Invalid Date',
        text: 'Please select a date that is today or in the future. Past dates are not allowed.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#f97316'
      });
      return;
    }

    // Time validation - must be between 9:30 AM and 3:30 PM
    const timeToMinutes = (timeStr) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const taskStartTimeMinutes = timeToMinutes(taskStartTime);
    const taskEndTimeMinutes = timeToMinutes(taskEndTime);
    const minTimeMinutes = 9 * 60 + 30; // 9:30 AM
    const maxTimeMinutes = 15 * 60 + 30; // 3:30 PM

    if (taskStartTimeMinutes < minTimeMinutes || taskStartTimeMinutes > maxTimeMinutes) {
      await Swal.fire({
        title: 'Invalid Start Time',
        text: 'Start time must be between 9:30 AM and 3:30 PM.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#f97316'
      });
      return;
    }

    if (taskEndTimeMinutes < minTimeMinutes || taskEndTimeMinutes > maxTimeMinutes) {
      await Swal.fire({
        title: 'Invalid End Time',
        text: 'End time must be between 9:30 AM and 3:30 PM.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#f97316'
      });
      return;
    }

    // Validate that end time is after start time
    if (taskEndTimeMinutes <= taskStartTimeMinutes) {
      await Swal.fire({
        title: 'Invalid Time Range',
        text: 'End time must be after start time.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#f97316'
      });
      return;
    }
    
    try {
      // Prepare task data for backend
      const taskFormData = {
        title: taskTitle,
        date: taskDate,
        startTime: taskStartTime,
        endTime: taskEndTime,
        location: taskLocation,
        note: taskNote,
        priority: 'MEDIUM' // Default priority
      };
      
      // Validate task before creating
      const validationResult = await validateAndShowResult(taskFormData, true);
      
      if (!validationResult.valid) {
        // Don't proceed if validation fails
        return;
      }
      
      // Call backend API to create task
      const response = await createTask(taskFormData);
      
      await Swal.fire({
        title: 'Success!',
        html: `
          <div class="text-left">
            <p><strong>Task created successfully!</strong></p>
            <p><strong>Title:</strong> ${taskTitle}</p>
            <p><strong>Date:</strong> ${taskDate}</p>
            <p><strong>Time:</strong> ${taskStartTime} - ${taskEndTime}</p>
            <p><strong>Location:</strong> ${taskLocation}</p>
            <p><strong>Note:</strong> ${taskNote}</p>
          </div>
        `,
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#f97316'
      });
      
      // Refresh tasks to show the new task in calendar
      await refreshTasks();
      
    } catch (error) {
      console.error('Error creating task:', error);
      await Swal.fire({
        title: 'Error!',
        text: 'Failed to create task. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#f97316'
      });
      return;
    }
    
    // Reset form and close modal
    setTaskTitle("");
    setTaskLocation("");
    setTaskDate("");
    setTaskStartTime("");
    setTaskEndTime("");
    setTaskNote("");
    setShowTaskPopup(false);
    setShowCreateModal(false);
  };

  // Enhanced Popup component with case selection
  const Popup = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full relative max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          onClick={() => setShowPopup(false)}
          aria-label="Close popup"
        >
          &#x2715;
        </button>
        <h2 className="text-2xl font-semibold mb-6">Schedule Hearing</h2>
        <form onSubmit={handleSave}>
          {/* Case Selection Dropdown */}
          <div className="mb-4">
            <label className="block mb-1 font-medium" htmlFor="caseSelect">
              Select Case <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 cursor-pointer flex justify-between items-center"
                onClick={() => setShowCaseDropdown(!showCaseDropdown)}
              >
                <span className={selectedCase ? "text-gray-900" : "text-gray-500"}>
                  {getSelectedCaseLabel()}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${showCaseDropdown ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              {showCaseDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md border border-gray-200 overflow-auto">
                  <div className="py-1">
                    {loadingCases ? (
                      <div className="px-4 py-3 text-gray-500 text-center">
                        Loading cases...
                      </div>
                    ) : casesError ? (
                      <div className="px-4 py-3 text-red-500 text-center">
                        {casesError}
                      </div>
                    ) : cases.length === 0 ? (
                      <div className="px-4 py-3 text-gray-500 text-center">
                        No cases available
                      </div>
                    ) : (
                      cases.map((caseItem) => (
                        <div
                          key={caseItem.id}
                          className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          onClick={() => handleCaseSelect(caseItem.id)}
                        >
                          <div className="font-medium text-gray-900">{caseItem.caseName}</div>
                          <div className="text-sm text-gray-500">{caseItem.caseNumber}</div>
                          <div className="text-xs text-gray-500">{caseItem.court}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Title Field */}
          <div className="mb-4">
            <label className="block mb-1 font-medium" htmlFor="title">
              Hearing Title <span className="text-red-500">*</span>
            </label>
            <Input1
              id="title"
              type="text"
              placeholder="Enter hearing title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Date Field */}
          <div className="mb-4">
            <label className="block mb-1 font-medium" htmlFor="hearingDate">
              Hearing Date <span className="text-red-500">*</span>
            </label>
            <Input1
              id="hearingDate"
              type="date"
              value={hearingDate}
              onChange={(e) => setHearingDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          {/* Time Slots */}
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium" htmlFor="startTime">
                Start Time <span className="text-red-500">*</span>
              </label>
              <Input1
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                min="09:30"
                max="15:30"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium" htmlFor="endTime">
                End Time <span className="text-red-500">*</span>
              </label>
              <Input1
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                min="09:30"
                max="15:30"
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
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter court or location address"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium" htmlFor="guests">
              Add Guests
            </label>
            <Input1
              id="guests"
              type="text"
              placeholder="type guest emails here"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
            />
          </div>

          <div className="mb-4 flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              id="googleMeet"
              checked={googleMeetEnabled}
              onChange={(e) => {
                setGoogleMeetEnabled(e.target.checked);
                if (e.target.checked) {
                  // Generate a dummy Google Meet link (in real app, integrate with API)
                  const link = `https://meet.google.com/${Math.random()
                    .toString(36)
                    .substring(2, 11)}`;
                  setGoogleMeetLink(link);
                } else {
                  setGoogleMeetLink("");
                }
              }}
              className="cursor-pointer"
            />
          </div>

          {/* Special Note */}
          <div className="mb-4">
            <label className="block mb-1 font-medium" htmlFor="specialNote">
              Special Note
            </label>
            <textarea
              id="specialNote"
              rows={4}
              className="w-full border border-gray-300 rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add any special notes here"
              value={specialNote}
              onChange={(e) => setSpecialNote(e.target.value)}
            />
          </div>

          <Button1 type="submit" text="Schedule Hearing" className="w-full" />
        </form>
      </div>
    </div>
  );

  // Transform hearings data into FullCalendar events format
  const transformHearingsToEvents = (hearingsData) => {
    console.log('Transforming hearings data:', hearingsData);
    
    if (!hearingsData || !Array.isArray(hearingsData)) {
      console.log('No hearings data or not an array');
      return [];
    }

    const transformedEvents = hearingsData.map((hearing) => {
      console.log('Processing hearing:', hearing);
      
      // Determine court color from settings or use default
      const courtName = hearing.location || hearing.court || 'Unknown Court';
      const backgroundColor = courtColors[courtName] || '#1a73e8'; // Default blue

      return {
        id: hearing.id?.toString() || Math.random().toString(),
        title: hearing.title || hearing.hearingTitle || 'Hearing',
        start: hearing.hearingDate || hearing.startTime,
        end: hearing.endTime,
        backgroundColor: backgroundColor,
        borderColor: backgroundColor,
        textColor: '#ffffff',
        extendedProps: {
          type: 'hearing',
          location: hearing.location || hearing.court,
          caseNumber: hearing.caseNumber,
          notes: hearing.note || hearing.notes,
          participants: hearing.participants || hearing.guests,
          googleMeet: hearing.googleMeetLink,
          priority: 'high'
        }
      };
    });

    console.log('Transformed events:', transformedEvents);
    return transformedEvents;
  };

  // Transform tasks data into FullCalendar events format
  const transformTasksToEvents = (tasksData) => {
    if (!tasksData || !Array.isArray(tasksData)) {
      return [];
    }

    return tasksData.map((task) => {
      // Use court color based on task location, or green as default for tasks
      const locationName = task.location || 'General';
      const backgroundColor = courtColors[locationName] || '#34a853'; // Green for tasks without court color
      
      return {
        id: `task-${task.id?.toString()}` || Math.random().toString(),
        title: task.title || 'Task',
        start: task.startTime,
        end: task.endTime,
        backgroundColor: backgroundColor,
        borderColor: backgroundColor,
        textColor: '#ffffff',
        extendedProps: {
          type: 'task',
          location: task.location,
          notes: task.description || task.note,
          status: task.status,
          priority: task.priority || 'medium'
        }
      };
    });
  };

  // Get events from real hearings and tasks data (fallback to empty array if loading)
  const hearingEvents = (loadingHearings || loadingCourtColors) ? [] : transformHearingsToEvents(hearings);
  const taskEvents = (loadingTasks || loadingCourtColors) ? [] : transformTasksToEvents(tasks);
  const events = [...hearingEvents, ...taskEvents];

  // Handle date click
  const handleDateClick = (info) => {
    setSelectedDate(info.date);
    // Don't automatically open task popup, just update the selected date
  };

  // Handle mini calendar date click
  const handleMiniCalendarDateClick = (date) => {
    setSelectedDate(date);
    // If clicking on a date from a different month, navigate to that month
    if (date.getMonth() !== currentDate.getMonth() || date.getFullYear() !== currentDate.getFullYear()) {
      setCurrentDate(new Date(date.getFullYear(), date.getMonth(), 1));
    }
  };

  return (
    <PageLayout user={user}>
      <div className="google-calendar-layout">
        {/* Main Header */}
        <div className="calendar-header">
          <div className="header-left">
            <div className="hamburger-menu">
              <div className="hamburger-line"></div>
              <div className="hamburger-line"></div>
              <div className="hamburger-line"></div>
            </div>
            <div className="calendar-logo">
              <div className="logo-icon">
                <div className="logo-calendar">
                  <div className="logo-header"></div>
                  <div className="logo-body">
                    <div className="logo-date">9</div>
                  </div>
                </div>
              </div>
              <span className="logo-text">Calendar</span>
            </div>
          </div>

          <div className="header-center">
            <button className="today-btn" onClick={goToToday}>Today</button>
            <div className="nav-controls">
              <button className="nav-btn" onClick={goToPreviousMonth}>
                <FaChevronLeft />
              </button>
              <button className="nav-btn" onClick={goToNextMonth}>
                <FaChevronRight />
              </button>
            </div>
            <h1 className="current-month">{getCurrentMonthYear()}</h1>
          </div>

          <div className="header-right">
            <div className="view-selector">
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value)}
                className="view-dropdown"
              >
                <option value="month">Month</option>
                <option value="week">Week</option>
                <option value="day">Day</option>
              </select>
            </div>
            <button
              className="settings-btn"
              onClick={handleSettingsClick}
              aria-label="Settings"
            >
              <FaCog />
            </button>
          </div>
        </div>

        <div className="calendar-container-wrapper">
          {/* Left Sidebar */}
          <div className="calendar-sidebar">
            <div className="flex flex-col gap-2">
              <button className="create-btn" onClick={() => { setSelectedTimeSlot(""); setCreateModalMode("hearing"); setShowCreateModal(true); }}>
                <FaPlus className="create-icon" />
                Create
              </button>
            </div>

            {/* Mini Calendar */}
            <div className="mini-calendar">
              <div className="mini-header">
                <span className="mini-month">
                  {currentDate.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>

              <div className="mini-weekdays">
                {weekDays.map((day, idx) => (
                  <div key={idx} className="mini-weekday">{day}</div>
                ))}
              </div>

              <div className="mini-days">
                {generateCalendarDays().map((date, idx) =>
                  date ? (
                    <button
                      key={idx}
                      onClick={() => setSelectedDate(date)}
                      className={`mini-day ${date.toDateString() === selectedDate.toDateString()
                        ? "mini-day-selected"
                        : ""
                        } ${date.toDateString() === new Date().toDateString()
                          ? "mini-day-today"
                          : ""
                        }`}
                    >
                      {date.getDate()}
                    </button>
                  ) : (
                    <div key={idx} className="mini-day-empty"></div>
                  )
                )}
              </div>
            </div>

            {/* Scheduled Events */}
            <div className="scheduled-events">
              <h3 className="sidebar-title">
                Scheduled Events - {selectedDate.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric"
                })}
              </h3>
              <div className="events-list">
                {getScheduledEventsForDate(selectedDate).length > 0 ? (
                  getScheduledEventsForDate(selectedDate).map((event) => (
                    <div key={event.id} className="event-item">
                      <div
                        className="event-color-indicator"
                        style={{ backgroundColor: event.backgroundColor }}
                      ></div>
                      <div className="event-details">
                        <div className="event-title">{event.title}</div>
                        <div className="event-time">
                          {event.allDay
                            ? "All day"
                            : new Date(event.start).toLocaleTimeString("en-US", {
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true
                            }) + " - " + new Date(event.end).toLocaleTimeString("en-US", {
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true
                            })
                          }
                        </div>
                        {event.extendedProps?.location && (
                          <div className="event-location">{event.extendedProps.location}</div>
                        )}
                      </div>
                      <div className="event-type-badge">
                        {event.extendedProps?.type || 'Event'}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-events">
                    <div className="no-events-icon">📅</div>
                    <div className="no-events-text">No events scheduled</div>
                  </div>
                )}
              </div>
            </div>

            {/* Other Calendars */}
            <div className="other-calendars">
              <h3 className="sidebar-title">Calendar Settings</h3>
              <div className="calendar-list">
                <div className="calendar-item">
                  <input type="checkbox" id="holidays" defaultChecked />
                  <div className="color-dot holidays"></div>
                  <label htmlFor="holidays">Holidays in Sri Lanka</label>
                </div>
                <div className="calendar-item">
                  <input type="checkbox" id="personal" defaultChecked />
                  <div className="color-dot personal"></div>
                  <label htmlFor="personal">Personal Events</label>
                </div>
                <div className="calendar-item">
                  <input type="checkbox" id="work" defaultChecked />
                  <div className="color-dot work"></div>
                  <label htmlFor="work">Work Events</label>
                </div>
              </div>
            </div>
          </div>

          {/* Main Calendar */}
          <div className="main-calendar">
            {(loadingHearings || loadingTasks || loadingCourtColors) && (
              <div className="text-center py-4">
                <div className="text-gray-600">Loading calendar data...</div>
              </div>
            )}
            {(hearingsError || tasksError) && (
              <div className="text-center py-4">
                <div className="text-red-600">{hearingsError || tasksError}</div>
                <button 
                  onClick={() => window.location.reload()} 
                  className="text-blue-600 hover:text-blue-800 underline ml-2"
                >
                  Retry
                </button>
              </div>
            )}
            {viewMode === "month" || viewMode === "week" ? (
              <div className="calendar-view">
                <FullCalendar
                  ref={calendarRef}
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  initialView={viewMode === "month" ? "dayGridMonth" : "timeGridWeek"}
                  headerToolbar={false}
                  events={events}
                  dateClick={handleDateClick}
                  editable={true}
                  selectable={true}
                  selectMirror={true}
                  dayMaxEvents={false}
                  weekends={true}
                  height="auto"
                  eventDisplay="block"
                  dayHeaderFormat={{ weekday: 'short' }}
                  eventTimeFormat={{
                    hour: '2-digit',
                    minute: '2-digit',
                    meridiem: false
                  }}
                  slotLabelFormat={{
                    hour: '2-digit',
                    minute: '2-digit',
                    meridiem: false
                  }}
                  nowIndicator={true}
                  eventClassNames={(info) => {
                    // Add different classes based on event type
                    const classes = ['google-event'];
                    
                    if (info.event.extendedProps.type === 'task') {
                      classes.push('event-task');
                    } else if (info.event.extendedProps.type === 'hearing') {
                      classes.push('event-hearing');
                    } else if (info.event.extendedProps.type === 'meeting') {
                      classes.push('event-meeting');
                    }
                    
                    // Add priority classes
                    if (info.event.extendedProps.priority) {
                      classes.push(`priority-${info.event.extendedProps.priority}`);
                    }
                    
                    return classes;
                  }}
                  eventContent={(eventInfo) => {
                    return (
                      <div className="event-content">
                        <div className="event-title">{eventInfo.event.title}</div>
                        {eventInfo.timeText && (
                          <div className="event-time">{eventInfo.timeText}</div>
                        )}
                        {eventInfo.event.extendedProps.location && (
                          <div className="event-location">
                            <span className="text-xs">📍 {eventInfo.event.extendedProps.location}</span>
                          </div>
                        )}
                        {!eventInfo.event.allDay && eventInfo.event.extendedProps.type && (
                          <div className="event-type">
                            {eventInfo.event.extendedProps.type === 'hearing' && '⚖️ Court Hearing'}
                            {eventInfo.event.extendedProps.type === 'task' && '✓ Task'}
                            {eventInfo.event.extendedProps.type === 'meeting' && '👥 Meeting'}
                          </div>
                        )}
                      </div>
                    );
                  }}
                  eventClick={(clickInfo) => {
                    // Show event details when clicked
                    const event = clickInfo.event;
                    const start = event.start ? new Date(event.start) : null;
                    const end = event.end ? new Date(event.end) : null;
                    
                    let detailsMessage = `${event.title}\n`;
                    detailsMessage += `Date: ${start ? start.toLocaleDateString() : 'N/A'}\n`;
                    detailsMessage += `Time: ${start ? start.toLocaleTimeString() : 'N/A'} - ${end ? end.toLocaleTimeString() : 'N/A'}\n`;
                    
                    if (event.extendedProps.type) {
                      detailsMessage += `Type: ${event.extendedProps.type.charAt(0).toUpperCase() + event.extendedProps.type.slice(1)}\n`;
                    }
                    
                    if (event.extendedProps.location) {
                      detailsMessage += `Location: ${event.extendedProps.location}\n`;
                    }
                    
                    if (event.extendedProps.caseNumber) {
                      detailsMessage += `Case Number: ${event.extendedProps.caseNumber}\n`;
                    }
                    
                    if (event.extendedProps.notes) {
                      detailsMessage += `Notes: ${event.extendedProps.notes}\n`;
                    }
                    
                    if (event.extendedProps.googleMeet) {
                      detailsMessage += `Google Meet: ${event.extendedProps.googleMeet}\n`;
                    }
                    
                    // Convert message to HTML format for better display
                    const htmlMessage = detailsMessage.replace(/\n/g, '<br>');
                    
                    Swal.fire({
                      title: 'Event Details',
                      html: `<div class="text-left">${htmlMessage}</div>`,
                      icon: 'info',
                      confirmButtonText: 'OK',
                      confirmButtonColor: '#f97316',
                      width: '500px'
                    });
                  }}
                  dayHeaderClassNames="google-day-header"
                  dayCellClassNames="google-day-cell"
                  initialDate={currentDate}
                  datesSet={(dateInfo) => {
                    // Update currentDate when FullCalendar view changes
                    setCurrentDate(dateInfo.start);
                  }}
                />
              </div>
            ) : (
              <div className="day-view">
                <h2 className="day-title">
                  {formatDateDisplay(selectedDate)}
                </h2>
                <div className="time-slots">
                  {dayTimeSlots.map((slot, idx) => (
                    <button
                      key={idx}
                      className="time-slot"
                      onClick={() => handleTimeSlotClick(slot)}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Combined Create Modal with Tabs */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full relative max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={() => setShowCreateModal(false)}
              aria-label="Close modal"
            >
              &#x2715;
            </button>
            
            {/* Tabbed Interface */}
            <div className="flex border-b border-gray-200 mb-6">
              <button 
                className={`py-3 px-6 font-medium text-sm ${createModalMode === 'hearing' 
                  ? 'border-b-2 border-blue-500 text-blue-600' 
                  : 'text-gray-600'}`}
                onClick={() => setCreateModalMode("hearing")}
              >
                <FaBriefcase className="inline-block mr-2" /> Court Hearing
              </button>
              <button 
                className={`py-3 px-6 font-medium text-sm ${createModalMode === 'task' 
                  ? 'border-b-2 border-green-500 text-green-600' 
                  : 'text-gray-600'}`}
                onClick={() => setCreateModalMode("task")}
              >
                <FaClock className="inline-block mr-2" /> Task
              </button>
            </div>
            
            <h2 className="text-2xl font-semibold mb-4">
              {createModalMode === 'hearing' ? 'Schedule a Court Hearing' : 'Schedule a Task'}
            </h2>
            
            {/* Hearing Form */}
            {createModalMode === 'hearing' && (
              <form onSubmit={handleSave}>
                {/* Case Selection */}
                <div className="mb-4 relative">
                  <label className="block mb-1 font-medium">
                    Select Case <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      className="w-full text-left border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white flex justify-between items-center"
                      onClick={() => setShowCaseDropdown(!showCaseDropdown)}
                      disabled={loadingCases}
                    >
                      {loadingCases ? (
                        "Loading cases..."
                      ) : selectedCase ? (
                        cases.find((c) => c.id === selectedCase)?.caseName || "Select a case"
                      ) : (
                        "Select a case"
                      )}
                      <span className="ml-2">▼</span>
                    </button>
                  </div>
                  {showCaseDropdown && (
                    <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-y-auto">
                      <div className="py-1">
                        {loadingCases ? (
                          <div className="px-4 py-3 text-gray-500 text-center">
                            Loading cases...
                          </div>
                        ) : casesError ? (
                          <div className="px-4 py-3 text-red-500 text-center">
                            {casesError}
                          </div>
                        ) : cases.length === 0 ? (
                          <div className="px-4 py-3 text-gray-500 text-center">
                            No cases available
                          </div>
                        ) : (
                          cases.map((caseItem) => (
                            <div
                              key={caseItem.id}
                              className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                              onClick={() => handleCaseSelect(caseItem.id)}
                            >
                              <div className="font-medium text-gray-900">{caseItem.caseName}</div>
                              <div className="text-sm text-gray-500">{caseItem.caseNumber}</div>
                              <div className="text-xs text-gray-500">{caseItem.court}</div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Title Field */}
                <div className="mb-4">
                  <label className="block mb-1 font-medium" htmlFor="title">
                    Hearing Title <span className="text-red-500">*</span>
                  </label>
                  <Input1
                    id="title"
                    type="text"
                    placeholder="Enter hearing title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                {/* Date Field */}
                <div className="mb-4">
                  <label className="block mb-1 font-medium" htmlFor="hearingDate">
                    Hearing Date <span className="text-red-500">*</span>
                  </label>
                  <Input1
                    id="hearingDate"
                    type="date"
                    value={hearingDate}
                    onChange={(e) => setHearingDate(e.target.value)}
                    required
                  />
                </div>

                {/* Time Slots */}
                <div className="mb-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 font-medium" htmlFor="startTime">
                      Start Time <span className="text-red-500">*</span>
                    </label>
                    <Input1
                      id="startTime"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium" htmlFor="endTime">
                      End Time <span className="text-red-500">*</span>
                    </label>
                    <Input1
                      id="endTime"
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
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
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter court or location address"
                    required
                  />
                </div>

                {/* Guests/Participants */}
                <div className="mb-4">
                  <label className="block mb-1 font-medium" htmlFor="guests">
                    Guests/Participants
                  </label>
                  <Input1
                    id="guests"
                    type="text"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    placeholder="Enter email addresses separated by commas"
                  />
                </div>

                {/* Google Meet Integration */}
                <div className="mb-4">
                  <div className="flex items-center">
                  </div>
                </div>

                {/* Google Meet Link (conditionally shown) */}
                {googleMeetEnabled && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-md">
                    <label className="block mb-1 font-medium text-sm" htmlFor="googleMeetLink">
                      Google Meet Link
                    </label>
                    <Input1
                      id="googleMeetLink"
                      type="url"
                      value={googleMeetLink}
                      onChange={(e) => setGoogleMeetLink(e.target.value)}
                      placeholder="Enter or paste Google Meet link"
                    />
                  </div>
                )}

                {/* Special Note */}
                <div className="mb-4">
                  <label className="block mb-1 font-medium" htmlFor="specialNote">
                    Special Note
                  </label>
                  <textarea
                    id="specialNote"
                    rows={4}
                    className="w-full border border-gray-300 rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add any special notes here"
                    value={specialNote}
                    onChange={(e) => setSpecialNote(e.target.value)}
                  />
                </div>

                <Button1 type="submit" text="Schedule Hearing" className="w-full" />
              </form>
            )}
            
            {/* Task Form */}
            {createModalMode === 'task' && (
              <form onSubmit={handleTaskSave}>
                {/* Task Title */}
                <div className="mb-4">
                  <label className="block mb-1 font-medium" htmlFor="taskTitle">
                    Task Title <span className="text-red-500">*</span>
                  </label>
                  <Input1
                    id="taskTitle"
                    type="text"
                    placeholder="Enter task title"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    required
                  />
                </div>

                {/* Task Date */}
                <div className="mb-4">
                  <label className="block mb-1 font-medium" htmlFor="taskDate">
                    Task Date <span className="text-red-500">*</span>
                  </label>
                  <Input1
                    id="taskDate"
                    type="date"
                    value={taskDate}
                    onChange={(e) => setTaskDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                {/* Time Slots */}
                <div className="mb-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 font-medium" htmlFor="taskStartTime">
                      Start Time <span className="text-red-500">*</span>
                    </label>
                    <Input1
                      id="taskStartTime"
                      type="time"
                      value={taskStartTime}
                      onChange={(e) => setTaskStartTime(e.target.value)}
                      min="09:30"
                      max="15:30"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium" htmlFor="taskEndTime">
                      End Time <span className="text-red-500">*</span>
                    </label>
                    <Input1
                      id="taskEndTime"
                      type="time"
                      value={taskEndTime}
                      onChange={(e) => setTaskEndTime(e.target.value)}
                      min="09:30"
                      max="15:30"
                      required
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="mb-4">
                  <label className="block mb-1 font-medium" htmlFor="taskLocation">
                    Location
                  </label>
                  <Input1
                    id="taskLocation"
                    type="text"
                    value={taskLocation}
                    onChange={(e) => setTaskLocation(e.target.value)}
                    placeholder="Enter task location (office, client location, etc.)"
                  />
                </div>

                {/* Special Note */}
                <div className="mb-4">
                  <label className="block mb-1 font-medium" htmlFor="taskNote">
                    Special Note
                  </label>
                  <textarea
                    id="taskNote"
                    rows={4}
                    className="w-full border border-gray-300 rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add any special notes or details about this task"
                    value={taskNote}
                    onChange={(e) => setTaskNote(e.target.value)}
                  />
                </div>

                <Button1 type="submit" text="Schedule Task" className="w-full bg-green-600 hover:bg-green-700" />
              </form>
            )}
          </div>
        </div>
      )}
      
      {/* Popups - Legacy */}
      {showPopup && <Popup />}

      {/* Court Color Settings Modal */}
      {/* Validation Result Modal */}
      {showValidationResult && validationResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={() => setShowValidationResult(false)}
              aria-label="Close validation result"
            >
              &#x2715;
            </button>
            
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-3">
                {validationResult.valid ? "✅ Validation Successful" : "⚠️ Validation Warning"}
              </h3>
              
              <div className={`p-3 rounded-md ${validationResult.valid ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                <p className={`text-sm ${validationResult.valid ? 'text-green-800' : 'text-yellow-800'}`}>
                  {validationResult.message}
                </p>
                
                {validationResult.travelText && (
                  <div className="mt-2">
                    <p className={`text-xs font-medium ${validationResult.valid ? 'text-green-700' : 'text-yellow-700'}`}>
                      Travel Information:
                    </p>
                    <p className={`text-xs ${validationResult.valid ? 'text-green-600' : 'text-yellow-600'}`}>
                      {validationResult.travelText}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => setShowValidationResult(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
                {!validationResult.valid && (
                  <button
                    onClick={async () => {
                      setShowValidationResult(false);
                      // Proceed with creation despite warning
                      if (createModalMode === "hearing") {
                        // Continue with hearing creation
                        const hearingFormData = {
                          label: title,
                          date: hearingDate,
                          startTime: startTime,
                          endTime: endTime,
                          location: location,
                          guests: guests,
                          specialNote: specialNote,
                          court: location,
                          participants: guests
                        };
                        try {
                          const response = await createHearing(selectedCase, hearingFormData);
                          await refreshHearings();
                          await Swal.fire({
                            title: 'Success with Warnings!',
                            html: `
                              <div class="text-left">
                                <p><strong>Hearing created successfully with warnings!</strong></p>
                                <p><strong>Title:</strong> ${title}</p>
                                <p><strong>Date:</strong> ${hearingDate}</p>
                                <p><strong>Time:</strong> ${startTime} - ${endTime}</p>
                              </div>
                            `,
                            icon: 'warning',
                            confirmButtonText: 'OK',
                            confirmButtonColor: '#f97316'
                          });
                          // Reset form and close modal
                          setTitle(""); setSelectedCase(""); setLocation(""); setHearingDate(""); setStartTime(""); setEndTime(""); setGuests(""); setSpecialNote(""); setGoogleMeetEnabled(false); setGoogleMeetLink(""); setShowPopup(false); setShowCreateModal(false);
                        } catch (error) {
                          console.error('Error creating hearing:', error);
                          await Swal.fire({
                            title: 'Error!',
                            text: 'Failed to create hearing. Please try again.',
                            icon: 'error',
                            confirmButtonText: 'OK',
                            confirmButtonColor: '#f97316'
                          });
                        }
                      } else {
                        // Continue with task creation
                        const taskFormData = {
                          title: taskTitle,
                          date: taskDate,
                          startTime: taskStartTime,
                          endTime: taskEndTime,
                          location: taskLocation,
                          note: taskNote,
                          priority: 'MEDIUM'
                        };
                        try {
                          const response = await createTask(taskFormData);
                          await refreshTasks();
                          await Swal.fire({
                            title: 'Success with Warnings!',
                            html: `
                              <div class="text-left">
                                <p><strong>Task created successfully with warnings!</strong></p>
                                <p><strong>Title:</strong> ${taskTitle}</p>
                                <p><strong>Date:</strong> ${taskDate}</p>
                                <p><strong>Time:</strong> ${taskStartTime} - ${taskEndTime}</p>
                              </div>
                            `,
                            icon: 'warning',
                            confirmButtonText: 'OK',
                            confirmButtonColor: '#f97316'
                          });
                          // Reset form and close modal
                          setTaskTitle(""); setTaskDate(""); setTaskStartTime(""); setTaskEndTime(""); setTaskLocation(""); setTaskNote(""); setShowTaskPopup(false); setShowCreateModal(false);
                        } catch (error) {
                          console.error('Error creating task:', error);
                          await Swal.fire({
                            title: 'Error!',
                            text: 'Failed to create task. Please try again.',
                            icon: 'error',
                            confirmButtonText: 'OK',
                            confirmButtonColor: '#f97316'
                          });
                        }
                      }
                    }}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
                  >
                    Proceed Anyway
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading overlay for validation */}
      {isValidating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-700">Validating...</p>
          </div>
        </div>
      )}

      <CourtColorSettings
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        courtColors={courtColors}
        onSaveCourtColors={handleSaveCourtColors}
      />
    </PageLayout>
  );
};

export default Lawyercalender;