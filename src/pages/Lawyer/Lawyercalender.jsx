import { useState } from "react";
import PageLayout from "../../components/layout/PageLayout";
import PageHeader from "../../components/layout/PageHeader";
import Button1 from "../../components/UI/Button1";
import { FaBriefcase, FaClock } from "react-icons/fa";

const Lawyercalender = () => {
  const user = {
    name: "Thusitha",
    email: "jeewanthadeherath@gmail.com",
  };

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [notificationCount, setNotificationCount] = useState(1);

  const handleNotificationClick = () => {
    console.log('Notifications clicked from Calendar page');
  };

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

  return (
    <PageLayout user={user}>
      {/* PageHeader component */}
      <div className="mb-8">
        <PageHeader 
          user={user} 
          notificationCount={notificationCount}
          onNotificationClick={handleNotificationClick}
        />
      </div>

      {/* Calendar specific header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <Button1 text="Add Hearing" className="py-2 px-4" />
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Panel */}
        <div className="w-full md:w-80 bg-white rounded-lg shadow-md p-6 flex flex-col">
          {/* Month and navigation */}
          <div className="flex items-center justify-center mb-4">
            <button
              onClick={prevMonth}
              className="p-1 rounded hover:bg-gray-200"
              aria-label="Previous Month"
            >
              &#8249;
            </button>
            <div className="flex-grow text-center font-semibold">
              {selectedDate.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </div>
            <button
              onClick={nextMonth}
              className="p-1 rounded hover:bg-gray-200"
              aria-label="Next Month"
            >
              &#8250;
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 text-center text-xs font-medium text-gray-500 mb-2">
            {weekDays.map((day, idx) => (
              <div key={idx}>{day}</div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1 mb-6">
            {generateCalendarDays().map((date, idx) =>
              date ? (
                <button
                  key={idx}
                  onClick={() => setSelectedDate(date)}
                  className={`text-center py-1 rounded ${
                    date.toDateString() === selectedDate.toDateString()
                      ? "bg-blue-600 text-white"
                      : "hover:bg-blue-100"
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
          <div>
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

        {/* Right Panel - Day Summary */}
        <div className="flex-grow bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">
            {formatDateDisplay(selectedDate)}
          </h2>
          <div className="divide-y divide-gray-200">
            {dayTimeSlots.map((slot, idx) => (
              <div
                key={idx}
                className={`py-3 px-4 ${
                  idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}
              >
                {slot}
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Lawyercalender;