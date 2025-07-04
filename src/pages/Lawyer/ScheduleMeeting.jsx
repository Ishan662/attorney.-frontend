import { useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Button1 from "../../components/UI/Button1";
import Input1 from "../../components/UI/Input1";

const ScheduleMeeting = () => {
  const user = {
    name: "Thusitha",
    email: "jeewanthadeherath@gmail.com",
  };

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [guests, setGuests] = useState("");
  const [specialNote, setSpecialNote] = useState("");

  const handleSave = (e) => {
    e.preventDefault();
    // Implement save logic here
    alert("Meeting saved!");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={user} />
      <div className="flex-grow p-6 overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-6">Hearings / Meetings</h2>
        <form
          onSubmit={handleSave}
          className="bg-white rounded-lg shadow-md p-6 max-w-md"
        >
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
            <img
              src="/assets/images/google_meet_icon.png"
              alt="Google Meet"
              className="w-6 h-6"
            />
            <span className="text-blue-600 underline text-sm">
              Add Google Meet video conferencing
            </span>
          </div>

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
};

export default ScheduleMeeting;
