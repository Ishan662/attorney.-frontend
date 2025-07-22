import { useState, useEffect } from "react";
import PageLayout from "../../components/layout/PageLayout";
import Button1 from "../../components/UI/Button1";
import Input1 from "../../components/UI/Input1";
import { FaBriefcase, FaClock, FaCog } from "react-icons/fa";
import CourtColorSettings from "./CourtColorSettings";

// Mock cases data - in real app, this would come from the case service
const mockCases = [
  {
    id: 1,
    caseName: "John Doe vs ABC Company",
    caseNumber: "DC/2024/001",
    courtType: "District Court",
    court: "District Court of Colombo"
  },
  {
    id: 2,
    caseName: "Jane Smith Land Dispute",
    caseNumber: "HC/2024/045",
    courtType: "High Court",
    court: "High Court of Kandy"
  },
  {
    id: 3,
    caseName: "Mike Johnson Money Recovery",
    caseNumber: "MC/2024/123",
    courtType: "Magistrates Court",
    court: "Magistrate's Court of Galle"
  },
  {
    id: 4,
    caseName: "Sarah Wilson Divorce Case",
    caseNumber: "DC/2024/067",
    courtType: "District Court",
    court: "District Court of Gampaha"
  },
];

const Lawyercalender = () => {
  // Updated user object with role property
  const user = {
    name: "Thusitha",
    email: "jeewanthadeherath@gmail.com",
    role: "lawyer" // Added role for consistent sidebar display
  };

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("month");

  // Popup state
  const [showPopup, setShowPopup] = useState(false);
  const [showTaskPopup, setShowTaskPopup] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");

  // Settings popup state
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  // Court colors state - can be loaded from localStorage or API
  const [courtColors, setCourtColors] = useState(() => {
    const savedColors = localStorage.getItem('courtColors');
    return savedColors ? JSON.parse(savedColors) : {
      "Galle High Court": "#EF4444", // Red
      "Badulla District Court": "#3B82F6", // Blue
      "Colombo Magistrate Court": "#10B981", // Green
      "Kandy High Court": "#8B5CF6" // Purple
    };
  });

  // Form state for popup
  const [title, setTitle] = useState("");
  const [selectedCase, setSelectedCase] = useState("");
  const [location, setLocation] = useState("");
  const [hearingDate, setHearingDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [specialNote, setSpecialNote] = useState("");
  const [showCaseDropdown, setShowCaseDropdown] = useState(false);

  // Form state for task popup
  const [taskTitle, setTaskTitle] = useState("");
  const [taskLocation, setTaskLocation] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [taskStartTime, setTaskStartTime] = useState("");
  const [taskEndTime, setTaskEndTime] = useState("");
  const [taskNote, setTaskNote] = useState("");

  // Save court colors to localStorage when they change
  useEffect(() => {
    localStorage.setItem('courtColors', JSON.stringify(courtColors));
  }, [courtColors]);

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
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
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

  // Month navigation handlers
  const prevMonth = () => {
    setSelectedDate(
      new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setSelectedDate(
      new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1)
    );
  };

  // Mock hearings and free time slots for selected date
  const hearings = [
    {
      time: "9:00 AM - 10:00 AM",
      location: "Galle High Court",
    },
  ];

  const freeTimeSlots = [
    {
      time: "11:00 AM - 12:00 PM",
      location: "Badulla District Court",
    },
    {
      time: "2:00 PM - 3:00 PM",
      available: true,
    },
    {
      time: "4:00 PM - 5:00 PM",
      available: true,
    },
  ];

  // Sample calendar events with court locations
  const calendarEvents = [
    { 
      date: 4, 
      month: 6, 
      title: "client meeting", 
      location: "Galle High Court" 
    },
    { 
      date: 8, 
      month: 6, 
      title: "galle high court", 
      location: "Galle High Court" 
    },
    { 
      date: 17, 
      month: 6, 
      title: "badulla court meeting", 
      location: "Badulla District Court" 
    }
  ];

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

  // Handle case selection and auto-fill location
  const handleCaseSelect = (caseId) => {
    const selectedCaseData = mockCases.find(c => c.id === parseInt(caseId));
    if (selectedCaseData) {
      setSelectedCase(caseId);
      setLocation(selectedCaseData.court);
      setTitle(`${selectedCaseData.caseName} - Hearing`);
    }
    setShowCaseDropdown(false);
  };

  // Get selected case label
  const getSelectedCaseLabel = () => {
    const caseData = mockCases.find(c => c.id === parseInt(selectedCase));
    return caseData ? `${caseData.caseName} (${caseData.caseNumber})` : "Select Case";
  };

  // Open popup on time slot click
  const handleTimeSlotClick = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
    setShowPopup(true);
  };

  // Handle settings button click
  const handleSettingsClick = () => {
    setShowSettingsModal(true);
  };

  // Handle save court colors from settings modal
  const handleSaveCourtColors = (newCourtColors) => {
    setCourtColors(newCourtColors);
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

  // Handle popup form save
  const handleSave = (e) => {
    e.preventDefault();
    const selectedCaseData = mockCases.find(c => c.id === parseInt(selectedCase));
    // Implement save logic here
    alert(
      `Hearing saved!\nCase: ${selectedCaseData?.caseName || 'N/A'}\nCase Number: ${selectedCaseData?.caseNumber || 'N/A'}\nDate: ${hearingDate}\nTime: ${startTime} - ${endTime}\nTitle: ${title}\nLocation: ${location}\nNote: ${specialNote}`
    );
    // Reset form and close popup
    setTitle("");
    setSelectedCase("");
    setLocation("");
    setHearingDate("");
    setStartTime("");
    setEndTime("");
    setSpecialNote("");
    setShowPopup(false);
  };

  // Handle task popup form save
  const handleTaskSave = (e) => {
    e.preventDefault();
    // Implement save logic here
    alert(
      `Task saved!\nTitle: ${taskTitle}\nDate: ${taskDate}\nTime: ${taskStartTime} - ${taskEndTime}\nLocation: ${taskLocation}\nNote: ${taskNote}`
    );
    // Reset form and close popup
    setTaskTitle("");
    setTaskLocation("");
    setTaskDate("");
    setTaskStartTime("");
    setTaskEndTime("");
    setTaskNote("");
    setShowTaskPopup(false);
  };

  // Popup component
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
                    {mockCases.map((caseItem) => (
                      <div
                        key={caseItem.id}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        onClick={() => handleCaseSelect(caseItem.id)}
                      >
                        <div className="font-medium text-gray-900">{caseItem.caseName}</div>
                        <div className="text-sm text-gray-500">{caseItem.caseNumber}</div>
                        <div className="text-xs text-gray-500">{caseItem.court}</div>
                      </div>
                    ))}
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

          {/* Auto-filled Location */}
          <div className="mb-4">
            <label className="block mb-1 font-medium" htmlFor="location">
              Court/Location
            </label>
            <Input1
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Court location will be auto-filled"
              readOnly={selectedCase !== ""}
              className={selectedCase !== "" ? "bg-gray-100" : ""}
            />
            {selectedCase && (
              <p className="text-xs text-gray-500 mt-1">
                Location auto-filled from selected case
              </p>
            )}
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

  // Task Popup component
  const TaskPopup = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full relative max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          onClick={() => setShowTaskPopup(false)}
          aria-label="Close popup"
        >
          &#x2715;
        </button>
        <h2 className="text-2xl font-semibold mb-6">Schedule a Task</h2>
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

          <Button1 type="submit" text="Schedule Task" className="w-full" />
        </form>
      </div>
    </div>
  );

  return (
    <PageLayout user={user}>
      <div className="p-6">
        <div className="flex gap-6">
          {/* Left Panel */}
          <div className="w-80 bg-white rounded-lg shadow-md p-6 flex flex-col h-screen overflow-y-auto">
            {/* Month view with weekday headers and calendar days */}
            <div className="flex justify-between items-center font-semibold mb-4 px-2">
              <div>
                {selectedDate.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </div>
            </div>
            <Button1 text="Add Hearing" className="mb-3" onClick={() => { setSelectedTimeSlot(""); setShowPopup(true); }} />
            <Button1 text="Schedule a Task" className="mb-6" onClick={() => { setShowTaskPopup(true); }} />

            <div className="grid grid-cols-7 text-center text-xs font-medium text-gray-500 mb-2">
              {weekDays.map((day, idx) => (
                <div key={idx}>{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 mb-6 h-[300px] overflow-y-auto">
              {generateCalendarDays().map((date, idx) =>
                date ? (
                  <button
                    key={idx}
                    onClick={() => setSelectedDate(date)}
                    className={`flex flex-col items-center justify-start text-xs pt-1 rounded ${
                      date.toDateString() === selectedDate.toDateString()
                        ? "bg-black-600 text-white"
                        : "hover:bg-black-100"
                    }`}
                    style={{ height: "3rem" }}
                  >
                    <div className="self-start pl-1">
                      {date.getDate()}
                    </div>
                  </button>
                ) : (
                  <div key={idx}></div>
                )
              )}
            </div>

            {/* Hearings */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Hearings</h3>
              {hearings.map((hearing, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 mb-2 text-gray-700"
                >
                  <div 
                    className="p-2 rounded"
                    style={{
                      backgroundColor: getCourtBackgroundColor(hearing.location)
                    }}
                  >
                    <FaBriefcase className={getTextColor(getCourtBackgroundColor(hearing.location))} />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{hearing.time}</div>
                    <div className="text-xs text-gray-500">{hearing.location}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Free Time Slots */}
            <div className="overflow-y-auto flex-grow">
              <h3 className="font-semibold mb-2">Free Time Slots</h3>
              {freeTimeSlots.map((slot, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 mb-2 text-gray-700"
                >
                  <div 
                    className="p-2 rounded"
                    style={{
                      backgroundColor: slot.available 
                        ? "#D1D5DB" // Gray for available slots
                        : getCourtBackgroundColor(slot.location)
                    }}
                  >
                    <FaClock className={slot.available ? "text-gray-700" : getTextColor(getCourtBackgroundColor(slot.location))} />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{slot.time}</div>
                    <div className="text-xs text-gray-500">
                      {slot.available ? "Available" : slot.location}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel - Day Summary with dropdown */}
          <div className="flex-grow bg-white rounded-lg shadow-md p-6 min-h-[600px]">
            {/* Dropdown to select view mode */}
            <div className="mb-4">
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
                aria-label="Select view mode"
              >
                <option value="date">Date</option>
                <option value="month">Month</option>
              </select>
            </div>

            {viewMode === "date" ? (
              <>
                <h2 className="text-lg font-semibold mb-4">
                  {formatDateDisplay(selectedDate)}
                </h2>
                <div className="divide-y divide-gray-200">
                  {dayTimeSlots.map((slot, idx) => (
                    <button
                      key={idx}
                      className={`w-full text-left py-3 px-4 ${
                        idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-blue-100 rounded`}
                      onClick={() => handleTimeSlotClick(slot)}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                {/* Month view with weekday headers and calendar days */}
                <div className="flex justify-between items-center text-lg font-semibold mb-4">
                  <div>
                    {selectedDate.toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                  <button
                    aria-label="Settings"
                    className="text-gray-600 hover:text-gray-900 cursor-pointer p-1 rounded-full -mt-1"
                    onClick={handleSettingsClick}
                  >
                    <FaCog size={26} />
                  </button>
                </div>
                <div className="grid grid-cols-7 text-center text-xs font-medium text-gray-500 mb-2">
                  {weekDays.map((day, idx) => (
                    <div key={idx}>{day}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1 mb-6 h-[500px] overflow-y-auto">
                  {generateCalendarDays().map((date, idx) =>
                    date ? (
                      <button
                        key={idx}
                        onClick={() => setSelectedDate(date)}
                        className={`text-center py-1 rounded relative ${
                          date.toDateString() === selectedDate.toDateString()
                            ? "bg-black-600 text-white"
                            : "hover:bg-black-100"
                        }`}
                      >
                        {date.getDate()}
                        {/* Events with custom colors based on court */}
                        {calendarEvents.map((event, eventIdx) => {
                          if (date.getDate() === event.date && date.getMonth() === event.month) {
                            const bgColor = getCourtBackgroundColor(event.location);
                            const textColorClass = getTextColor(bgColor);
                            return (
                              <div 
                                key={eventIdx}
                                className={`absolute bottom-1 left-1 right-1 text-xs rounded px-1 truncate ${textColorClass}`}
                                style={{ backgroundColor: bgColor }}
                              >
                                {event.title}
                              </div>
                            );
                          }
                          return null;
                        })}
                      </button>
                    ) : (
                      <div key={idx}></div>
                    )
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {showPopup && <Popup />}
      {showTaskPopup && <TaskPopup />}
      
      {/* Court Color Settings Modal */}
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