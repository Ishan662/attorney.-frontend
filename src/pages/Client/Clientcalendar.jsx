import { useState, useEffect } from "react";
import Sidebar from "../../components/layout/Sidebar";
import PageLayout from "../../components/layout/PageLayout";
import Button1 from "../../components/UI/Button1";
import Input1 from "../../components/UI/Input1";
import { FaBriefcase, FaClock, FaCog } from "react-icons/fa";
import { getClientCalendarEvents } from "../../services/calendarIntegrationService";
import MeetingRequestModal from "../../components/modals/MeetingRequestModal";
import MeetingDetailsModal from "../../components/modals/MeetingDetailsModal";

const Clientcalender = () => {
  const user = {
    name: "Nethsilu Marasinghe",
    email: "kasuntharamarasinghe@gmail.com",
  };

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [viewMode, setViewMode] = useState("month");

  // Calendar data state
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Meeting request modal state
  const [showMeetingRequestModal, setShowMeetingRequestModal] = useState(false);
  const [showMeetingDetailsModal, setShowMeetingDetailsModal] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  // Popup state
  const [showPopup, setShowPopup] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");

  // Small popup state for meeting details
  const [showMeetingDetails, setShowMeetingDetails] = useState(false);
  const [meetingDetailsPosition, setMeetingDetailsPosition] = useState({ x: 0, y: 0 });
  const [selectedMeetingDetails, setSelectedMeetingDetails] = useState(null);

  // Form state for popup
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [guests, setGuests] = useState("");
  const [specialNote, setSpecialNote] = useState("");
  const [googleMeetEnabled, setGoogleMeetEnabled] = useState(false);
  const [googleMeetLink, setGoogleMeetLink] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [selectedMeetingDate, setSelectedMeetingDate] = useState("");

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

  // Load calendar events
  useEffect(() => {
    const loadCalendarEvents = async () => {
      try {
        setIsLoading(true);
        const events = await getClientCalendarEvents();
        setCalendarEvents(events || []);
        setError(null);
      } catch (err) {
        console.error('Error loading calendar events:', err);
        setError('Failed to load calendar events');
        setCalendarEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadCalendarEvents();
  }, []);

  // Separate meetings and hearings from calendar events
  const meetings = calendarEvents.filter(event => event.type === 'meeting' || event.extendedProps?.type === 'meeting');
  const hearings = calendarEvents.filter(event => event.type === 'hearing' || event.extendedProps?.type === 'hearing');

  // Helper function to get events for a specific date
  const getEventsForDate = (date) => {
    return calendarEvents.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  // Helper function to check if date has events
  const hasEventsOnDate = (date) => {
    return getEventsForDate(date).length > 0;
  };

  // Filter meetings and hearings for selected date
  const getFilteredMeetings = () => {
    return meetings.filter(meeting => {
      const meetingDate = new Date(meeting.start);
      return meetingDate.toDateString() === selectedDate.toDateString();
    });
  };

  const getFilteredHearings = () => {
    return hearings.filter(hearing => {
      const hearingDate = new Date(hearing.start);
      return hearingDate.toDateString() === selectedDate.toDateString();
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

  // Meeting details data
  const meetingDetails = {
    3: {
      topic: "Land case court meeting",
      time: "11:00 AM - 12:00 PM",
      location: "District Court, Colombo",
      description: "Important hearing for the land dispute case"
    },
    7: {
      topic: "Mr Nadun's Meeting",
      time: "1:00 PM - 2:00 PM", 
      location: "Law Office Conference Room",
      description: "Client consultation meeting"
    },
    24: {
      topic: "Mr Nadun's Second Meeting",
      time: "3:00 PM - 4:00 PM",
      location: "Client's Office",
      description: "Follow-up meeting for case updates"
    }
  };

  // Open popup on time slot click
  const handleTimeSlotClick = (timeSlot, event) => {
    // Check if this time slot has a scheduled meeting
    const dateKey = selectedDate.getDate();
    const meetingData = meetingDetails[dateKey];
    
    if (meetingData && (
      (timeSlot === "11 AM - 12 PM" && selectedDate.getDate() === 3 && selectedDate.getMonth() === 6) ||
      (timeSlot === "1 PM - 2 PM" && selectedDate.getDate() === 7 && selectedDate.getMonth() === 6) ||
      (timeSlot === "3 PM - 4 PM" && selectedDate.getDate() === 24 && selectedDate.getMonth() === 6)
    )) {
      // Show meeting details popup for scheduled meetings
      const rect = event.currentTarget.getBoundingClientRect();
      setMeetingDetailsPosition({
        x: rect.left + rect.width / 2,
        y: rect.top
      });
      setSelectedMeetingDetails({
        ...meetingData,
        date: selectedDate
      });
      setShowMeetingDetails(true);
    } else {
      // Show regular add meeting popup for empty time slots
      setSelectedTimeSlot(timeSlot);
      //setShowPopup(true);
    }
  };

  // Handle meeting detail click
  const handleMeetingDetailClick = (event, date) => {
    event.stopPropagation(); // Prevent calendar date selection
    const meetingData = meetingDetails[date.getDate()];
    if (meetingData) {
      const rect = event.currentTarget.getBoundingClientRect();
      setMeetingDetailsPosition({
        x: rect.left + rect.width / 2,
        y: rect.top
      });
      setSelectedMeetingDetails({
        ...meetingData,
        date: date
      });
      setShowMeetingDetails(true);
    }
  };

  // Handle edit meeting
  const handleEditMeeting = () => {
    setShowMeetingDetails(false);
    if (selectedMeetingDetails) {
      setSelectedDate(selectedMeetingDetails.date);
      setSelectedMeetingDate(selectedMeetingDetails.date.toISOString().split('T')[0]);
      setTitle(selectedMeetingDetails.topic);
      setLocation(selectedMeetingDetails.location);
      setSpecialNote(selectedMeetingDetails.description);
      setSelectedTimeSlot(selectedMeetingDetails.time);
      setShowPopup(true);
    }
  };

  // Handle popup form save
  const handleSave = (e) => {
    e.preventDefault();
    // Implement save logic here
    const displayDate = selectedMeetingDate ? 
      formatDateDisplay(new Date(selectedMeetingDate)) : 
      formatDateDisplay(selectedDate);
    
    alert(
      `Meeting saved!\nDate: ${displayDate}\nTime: ${startTime} - ${endTime}\nTitle: ${title}\nLocation: ${location}\nGuests: ${guests}\nNote: ${specialNote}\nGoogle Meet: ${
        googleMeetEnabled ? googleMeetLink : "Not added"
      }`
    );
    // Reset form and close popup
    setTitle("");
    setLocation("");
    setGuests("");
    setSpecialNote("");
    setGoogleMeetEnabled(false);
    setGoogleMeetLink("");
    setStartTime("09:00");
    setEndTime("10:00");
    setSelectedMeetingDate("");
    setShowPopup(false);
  };

  // Popup component
  const Popup = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full relative">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          onClick={() => setShowPopup(false)}
          aria-label="Close popup"
        >
          &#x2715;
        </button>
        <h2 className="text-2xl font-semibold mb-6">Request Meetings</h2>
        <form onSubmit={handleSave}>
          <div className="mb-4">
            <label className="block mb-1 font-medium" htmlFor="title">
              Title
            </label>
            <Input1
              id="title"
              type="text"
              placeholder="type title here"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium" htmlFor="location1">
              Location
            </label>
            <Input1
              id="location1"
              type="text"
              placeholder="Enter location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium" htmlFor="meetingDate">
              Date
            </label>
            <input
              id="meetingDate"
              type="date"
              value={selectedMeetingDate || selectedDate.toISOString().split('T')[0]}
              onChange={(e) => setSelectedMeetingDate(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <div className="mt-1 text-xs text-gray-500">
              {selectedMeetingDate ? 
                `Selected: ${formatDateDisplay(new Date(selectedMeetingDate))}` : 
                `Current: ${formatDateDisplay(selectedDate)}`
              }
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">
              Time
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1" htmlFor="startTime">
                  Start Time
                </label>
                <select
                  id="startTime"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {Array.from({ length: 24 }, (_, i) => {
                    const hour = i.toString().padStart(2, '0');
                    return [
                      <option key={`${hour}:00`} value={`${hour}:00`}>{hour}:00</option>,
                      <option key={`${hour}:30`} value={`${hour}:30`}>{hour}:30</option>
                    ];
                  }).flat()}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1" htmlFor="endTime">
                  End Time
                </label>
                <select
                  id="endTime"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {Array.from({ length: 24 }, (_, i) => {
                    const hour = i.toString().padStart(2, '0');
                    return [
                      <option key={`${hour}:00`} value={`${hour}:00`}>{hour}:00</option>,
                      <option key={`${hour}:30`} value={`${hour}:30`}>{hour}:30</option>
                    ];
                  }).flat()}
                </select>
              </div>
            </div>
            <div className="mt-1 text-xs text-gray-500">
              Duration: {(() => {
                const start = new Date(`2000-01-01 ${startTime}`);
                const end = new Date(`2000-01-01 ${endTime}`);
                const diffMs = end - start;
                const diffHours = diffMs / (1000 * 60 * 60);
                return diffHours > 0 ? `${diffHours} hour${diffHours !== 1 ? 's' : ''}` : 'Invalid time range';
              })()}
            </div>
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
            <label
              htmlFor="googleMeet"
              className="text-blue-600 underline text-sm cursor-pointer"
            >
              Add Google Meet video conferencing
            </label>
          </div>
          {googleMeetEnabled && (
            <div className="mb-4">
              <label className="block mb-1 font-medium" htmlFor="googleMeetLink">
                Google Meet Link
              </label>
              <a
                href={googleMeetLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline break-all"
                id="googleMeetLink"
              >
                {googleMeetLink}
              </a>
            </div>
          )}

          <div className="mb-4">
            <label className="block mb-1 font-medium" htmlFor="specialNote">
              Special note
            </label>
            <textarea
              id="specialNote"
              rows={2}
              className="w-full border border-gray-300 rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add any special notes here"
              value={specialNote}
              onChange={(e) => setSpecialNote(e.target.value)}
            />
          </div>

          <Button1 type="submit" text="Request" className="w-full" />
        </form>
      </div>
    </div>
  );

  // Meeting Details Popup component
  const MeetingDetailsPopup = () => (
    <div
      className="fixed bg-white rounded-lg shadow-lg border border-gray-300 p-4 z-50 min-w-[280px]"
      style={{
        left: `${meetingDetailsPosition.x - 140}px`,
        top: `${meetingDetailsPosition.y - 10}px`,
        transform: 'translateY(-100%)'
      }}
    >
      <div className="relative">
        <button
          className="absolute -top-[15px] -right-2 text-gray-500 hover:text-gray-700 text-sm"
          onClick={() => setShowMeetingDetails(false)}
          aria-label="Close details"
        >
          &#x2715;
        </button>
        
        <div className="mb-3">
          <h3 className="font-semibold text-lg text-gray-800 mb-2">
            {selectedMeetingDetails?.topic}
          </h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <FaClock className="text-gray-500" size={12} />
              <span className="text-gray-700">{selectedMeetingDetails?.time}</span>
            </div>
            
            <div className="flex items-start gap-2">
              <FaBriefcase className="text-gray-500 mt-0.5" size={12} />
              <span className="text-gray-700">{selectedMeetingDetails?.location}</span>
            </div>
            
            {selectedMeetingDetails?.description && (
              <div className="mt-2 p-2 bg-gray-50 rounded text-gray-600 text-xs">
                {selectedMeetingDetails.description}
              </div>
            )}
          </div>
          
          {/* <div className="mt-3 pt-2 border-t border-gray-200">
            <button
              onClick={handleEditMeeting}
              className="w-full bg-black-500 hover:bg-black-600 text-white py-2 px-3 rounded text-sm font-medium transition-colors"
            >
              Edit Meeting
            </button>
          </div> */}
        </div>
        
        {/* Arrow pointing down */}
        <div 
          className="absolute left-1/2 transform -translate-x-1/2 top-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"
          style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
        ></div>
      </div>
    </div>
  );

  return (
    <PageLayout>
    <div className="flex min-h-screen bg-gray-50">
{/* 
      <Sidebar
        user={user}
        onToggle={(expanded) => setSidebarExpanded(expanded)}
      /> */}
      <div
        className="flex-grow p-6 overflow-y-auto transition-all duration-300"
        style={{
          marginLeft: sidebarExpanded ? "-1.5rem" : "5rem", // 16rem = 256px (w-64), 5rem = 80px (w-20)
        }}
      >
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
              {/* <button
                aria-label="Settings"
                className="text-gray-6000 hover:text-gray-900 cursor-pointer p-1 rounded"
                onClick={() => {
                  // Placeholder for settings click handler
                  alert("Settings clicked");
                }}
              >
                <FaCog size={20} />
              </button> */}
            </div>
            <Button1 
              text="Request Meeting"
              onClick={() => { 
                setShowMeetingRequestModal(true);
              }}
              className="mb-6"
            />

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
  className={`flex flex-col items-start justify-start text-xs pt-1 rounded relative ${
    date.toDateString() === selectedDate.toDateString()
      ? "bg-gray-400 text-white"
      : "hover:bg-gray-100"
  }`}
  style={{ height: "3.5rem" }}
>
  <div className="pl-1 font-medium">
    {date.getDate()}
  </div>
  
  {/* Show event indicators */}
  {getEventsForDate(date).slice(0, 1).map((event, eventIdx) => (
    <div 
      key={eventIdx}
      className={`absolute bottom-0.5 left-0.5 right-0.5 text-xs rounded px-1.5 py-1 truncate font-medium ${
        (event.type === 'meeting' || event.extendedProps?.type === 'meeting')
          ? 'bg-blue-500 text-white'
          : 'bg-green-500 text-white'
      }`}
    >
      {event.title.substring(0, 10)}...
    </div>
  ))}
</button>
                ) : (
                  <div key={idx}></div>
                )
              )}
            </div>

          {/* Meetings */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Meetings</h3>
            {getFilteredMeetings().length > 0 ? (
              getFilteredMeetings().map((meeting, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 mb-2 text-gray-700 cursor-pointer hover:bg-gray-50 p-2 rounded"
                  onClick={() => {
                    setSelectedMeeting(meeting);
                    setShowMeetingDetailsModal(true);
                  }}
                >
                  <div className="p-2 bg-blue-200 rounded">
                    <FaClock />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{meeting.title}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(meeting.start).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })}
                      {meeting.extendedProps?.caseNumber && ` - Case: ${meeting.extendedProps.caseNumber}`}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500 italic">There are no meetings</div>
            )}
          </div>

            {/* Hearings */}
            <div className="overflow-y-auto flex-grow">
              <h3 className="font-semibold mb-2">Hearings</h3>
              {getFilteredHearings().length > 0 ? (
                getFilteredHearings().map((hearing, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 mb-2 text-gray-700"
                  >
                    <div className="p-2 bg-green-200 rounded">
                      <FaClock />
                    </div>
                    <div>
                      <div className="text-sm font-medium">{hearing.title}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(hearing.start).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true
                        })}
                        {hearing.extendedProps?.location && ` - ${hearing.extendedProps.location}`}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500 italic">There are no hearings</div>
              )}
            </div>
          </div>

          {/* Right Panel - Day Summary with dropdown */}
          <div className="flex-grow bg-white rounded-lg shadow-md p-6 min-h-[600px]">
            {/* Dropdown to select view mode */}
            <div className="flex mb-4  justify-between">
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
                aria-label="Select view mode"
              >
                <option value="date">Date</option>
                <option value="month">Month</option>
              </select>

              <button
                aria-label="Settings"
                className="text-gray-600 hover:text-gray-900 cursor-pointer p-1 rounded-full -mt-1"
                onClick={() => {
                  // Placeholder for settings click handler
                  alert("Settings clicked");
                }}
              >
                <FaCog size={26} />
              </button>
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
                        (() => {
                          const eventAtTime = getEventsForDate(selectedDate).find(event => {
                            const eventTime = new Date(event.start);
                            const timeString = eventTime.toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true
                            });
                            return slot.includes(timeString.split(':')[0]);
                          });
                          
                          if (eventAtTime) {
                            return (eventAtTime.type === 'meeting' || eventAtTime.extendedProps?.type === 'meeting')
                              ? "bg-blue-100 text-blue-800 border border-blue-300 hover:bg-blue-200 cursor-pointer"
                              : "bg-green-100 text-green-800 border border-green-300 hover:bg-green-200 cursor-pointer";
                          }
                          
                          return idx % 2 === 0 ? "bg-gray-50" : "bg-white";
                        })()
                      } hover:bg-blue-100 rounded transition-colors`}
                      onClick={(e) => {
                        const eventAtTime = getEventsForDate(selectedDate).find(event => {
                          const eventTime = new Date(event.start);
                          const timeString = eventTime.toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          });
                          return slot.includes(timeString.split(':')[0]);
                        });
                        
                        if (eventAtTime) {
                          // Show meeting details modal for events
                          setSelectedMeeting(eventAtTime);
                          setShowMeetingDetailsModal(true);
                        } else {
                          handleTimeSlotClick(slot, e);
                        }
                      }}
                    >
                      {(() => {
                        const eventAtTime = getEventsForDate(selectedDate).find(event => {
                          const eventTime = new Date(event.start);
                          const timeString = eventTime.toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          });
                          return slot.includes(timeString.split(':')[0]);
                        });
                        
                        return eventAtTime ? `${slot} - ${eventAtTime.title}` : slot;
                      })()}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                {/* Month view with weekday headers and calendar days */}
            <div className="flex justify-between items-center text-lg font-semibold mb-4">
              <button
                onClick={() => {
                  const prevMonth = new Date(selectedDate);
                  prevMonth.setMonth(prevMonth.getMonth() - 1);
                  setSelectedDate(prevMonth);
                }}
                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium"
              >
                ← Previous
              </button>
              
              <div>
                {selectedDate.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </div>

              <button
                onClick={() => {
                  const nextMonth = new Date(selectedDate);
                  nextMonth.setMonth(nextMonth.getMonth() + 1);
                  setSelectedDate(nextMonth);
                }}
                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium"
              >
                Next →
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
                        onClick={() => {
                          setSelectedDate(date);
                          setSelectedTimeSlot("");
                        }}
                        className={`text-center py-2 rounded relative min-h-[60px] flex flex-col justify-start ${
                          date.toDateString() === selectedDate.toDateString()
                            ? "bg-gray-400 text-white"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <span className="text-sm font-medium mb-1">{date.getDate()}</span>
                        {getEventsForDate(date).slice(0, 2).map((event, eventIdx) => (
                          <div 
                            key={eventIdx}
                            className={`absolute ${eventIdx === 0 ? 'bottom-1' : 'bottom-8'} left-0.5 right-0.5 text-xs rounded px-2 py-2 truncate cursor-pointer font-semibold shadow-md ${
                              (event.type === 'meeting' || event.extendedProps?.type === 'meeting')
                                ? 'bg-blue-600 text-white hover:bg-blue-700 border border-blue-700'
                                : 'bg-green-600 text-white hover:bg-green-700 border border-green-700'
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedMeeting(event);
                              setShowMeetingDetailsModal(true);
                            }}
                          >
                            {event.title}
                          </div>
                        ))}
                        {date.getDate() === 24 && date.getMonth() === 6 && (
                          <div 
                            className="absolute bottom-1 left-1 right-1 bg-blue-200 text-blue-800 text-xs rounded px-1 truncate cursor-pointer hover:bg-blue-300"
                            onClick={(e) => handleMeetingDetailClick(e, date)}
                          >
                            Mr Nadun's Second meeting
                          </div>
                        )}
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
      {showMeetingDetails && <MeetingDetailsPopup />}
      {showMeetingDetails && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowMeetingDetails(false)}
        />
      )}

      {/* Meeting Request Modal */}
      <MeetingRequestModal
        isOpen={showMeetingRequestModal}
        onClose={() => {
          setShowMeetingRequestModal(false);
          // Refresh calendar events after closing modal
          const loadCalendarEvents = async () => {
            try {
              const events = await getClientCalendarEvents();
              setCalendarEvents(events || []);
            } catch (err) {
              console.error('Error refreshing calendar events:', err);
            }
          };
          loadCalendarEvents();
        }}
        onMeetingCreated={() => {
          // Refresh calendar events after meeting creation
          const loadCalendarEvents = async () => {
            try {
              const events = await getClientCalendarEvents();
              setCalendarEvents(events || []);
            } catch (err) {
              console.error('Error refreshing calendar events:', err);
            }
          };
          loadCalendarEvents();
        }}
      />

      {/* Meeting Details Modal */}
      <MeetingDetailsModal
        isOpen={showMeetingDetailsModal && selectedMeeting !== null}
        meeting={selectedMeeting}
        onClose={() => {
          setShowMeetingDetailsModal(false);
          setSelectedMeeting(null);
          // Refresh calendar events after closing modal
          const loadCalendarEvents = async () => {
            try {
              const events = await getClientCalendarEvents();
              setCalendarEvents(events || []);
            } catch (err) {
              console.error('Error refreshing calendar events:', err);
            }
          };
          loadCalendarEvents();
        }}
        userRole="client"
      />

    </div>
    </PageLayout>
  );
};

export default Clientcalender;