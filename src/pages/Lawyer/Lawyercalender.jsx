import { useState } from "react";
import PageLayout from "../../components/layout/PageLayout";
import Button1 from "../../components/UI/Button1";
import Input1 from "../../components/UI/Input1";
import { FaBriefcase, FaClock, FaCog } from "react-icons/fa";

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
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");

  // Form state for popup
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [guests, setGuests] = useState("");
  const [specialNote, setSpecialNote] = useState("");
  const [googleMeetEnabled, setGoogleMeetEnabled] = useState(false);
  const [googleMeetLink, setGoogleMeetLink] = useState("");

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

  // Open popup on time slot click
  const handleTimeSlotClick = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
    setShowPopup(true);
  };

  // Handle popup form save
  const handleSave = (e) => {
    e.preventDefault();
    // Implement save logic here
    alert(
      `Meeting saved!\nDate: ${formatDateDisplay(
        selectedDate
      )}\nTime: ${selectedTimeSlot}\nTitle: ${title}\nLocation: ${location}\nGuests: ${guests}\nNote: ${specialNote}\nGoogle Meet: ${
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
        <h2 className="text-2xl font-semibold mb-6">Hearings / Meetings</h2>
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
              rows={4}
              className="w-full border border-gray-300 rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add any special notes here"
              value={specialNote}
              onChange={(e) => setSpecialNote(e.target.value)}
            />
          </div>

          <Button1 type="submit" text="Save" className="w-full" />
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
            <Button1 text="Add Hearing" className="mb-6" onClick={() => { setSelectedTimeSlot(""); setShowPopup(true); }} />

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
                    onClick={() => {
                      // Placeholder for settings click handler
                      alert("Settings clicked");
                    }}
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
                        {date.getDate() === 4 && date.getMonth() === 6 && (
                          <div className="absolute bottom-1 left-1 right-1 bg-red-200 text-red-800 text-xs rounded px-1 truncate">
                            client meeting
                          </div>
                        )}
                        {date.getDate() === 8 && date.getMonth() === 6 && (
                          <div className="absolute bottom-1 left-1 right-1 bg-green-200 text-green-800 text-xs rounded px-1 truncate">
                            galle high court
                          </div>
                        )}
                        {date.getDate() === 17 && date.getMonth() === 6 && (
                          <div className="absolute bottom-1 left-1 right-1 bg-blue-200 text-blue-800 text-xs rounded px-1 truncate">
                            badulla court meeting
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
    </PageLayout>
  );
};

export default Lawyercalender;