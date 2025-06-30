import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import Button1 from "../../components/UI/Button1";
import { FaBriefcase, FaClock } from "react-icons/fa";

const Lawyercalender = () => {
  const navigate = useNavigate();

  const user = {
    name: "Thusitha",
    email: "jeewanthadeherath@gmail.com",
  };

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [viewMode, setViewMode] = useState("month");

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

  // Navigate to scheduling form on time slot click
  const handleTimeSlotClick = (timeSlot) => {
    // Pass selected date and time slot as state or params if needed
    navigate("/lawyer/schedule-meeting", {
      state: { date: selectedDate, timeSlot },
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        user={user}
        onToggle={(expanded) => setSidebarExpanded(expanded)}
      />
      <div
        className="flex-grow p-6 overflow-y-auto transition-all duration-300"
        style={{
          marginLeft: sidebarExpanded ? "16rem" : "5rem", // 16rem = 256px (w-64), 5rem = 80px (w-20)
        }}
      >
        <div className="flex gap-6">
          {/* Left Panel */}
          <div className="w-80 bg-white rounded-lg shadow-md p-6 flex flex-col h-screen overflow-y-auto">
            {/* Month view with weekday headers and calendar days */}
            <div className="text-center font-semibold mb-4">
              {selectedDate.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </div>
            <Button1 text="Add Hearing" className="mb-6" />

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
                    className={`text-center py-1 rounded ${
                      date.toDateString() === selectedDate.toDateString()
                        ? "bg-black-600 text-white"
                        : "hover:bg-black-100"
                    }`}
                  >
                    {date.getDate()}
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
                <div className="p-2 bg-gray-200 rounded">
                  <FaBriefcase />
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
                  <div className="p-2 bg-gray-200 rounded">
                    <FaClock />
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
                <h2 className="text-lg font-semibold mb-4">
                  {selectedDate.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </h2>
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
                        className={`text-center py-1 rounded ${
                          date.toDateString() === selectedDate.toDateString()
                            ? "bg-black-600 text-white"
                            : "hover:bg-black-100"
                        }`}
                      >
                        {date.getDate()}
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
    </div>
  );
};

export default Lawyercalender;