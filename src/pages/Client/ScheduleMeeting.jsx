import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import PageHeader from '../../components/layout/PageHeader';
import Input1 from '../../components/UI/Input1';
import Button1 from '../../components/UI/Button1';

const user = {
  name: 'Nishagi Jewantha',
  email: 'jewanthadheerath@gmail.com',
};

const ScheduleMeeting = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [notificationCount, setNotificationCount] = useState(1);
  const [form, setForm] = useState({
    meetingTitle: '',
    location: '',
    date: '',
    time: '',
    duration: '',
    agenda: '',
    clientEmail: '',
    googleMeetLink: '',
  });
  const [meetings, setMeetings] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createMeetingRequest(form);
      alert('✅ Meeting request sent successfully!');
      setForm({
        meetingTitle: '',
        location: '',
        date: '',
        time: '',
        duration: '',
        agenda: '',
        clientEmail: '',
        googleMeetLink: '',
      });
      fetchMeetings();
    } catch (err) {
      console.error('Error creating meeting:', err);
      alert('❌ Failed to send meeting request. Check console.');
    }
  };

  const fetchMeetings = async () => {
    try {
      const data = await getAllMeetings();
      setMeetings(data);
    } catch (err) {
      console.error('Error fetching meetings:', err);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar user={user} onToggle={setSidebarExpanded} />
      <div
        className="flex-grow overflow-y-auto transition-all duration-300"
        style={{ marginLeft: sidebarExpanded ? '16rem' : '5rem' }}
      >
        <div className="p-6">
          <div className="mb-8">
            <PageHeader
              user={user}
              notificationCount={notificationCount}
              onNotificationClick={() => {}}
            />
          </div>

          <div className="flex flex-col items-center w-full">
            <h1 className="text-2xl font-bold text-gray-800">
              Schedule Client Meeting
            </h1>
          </div>

          <main className="flex-1 flex flex-col items-center overflow-y-auto">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl mt-4 mb-6">
              <h2 className="text-xl font-semibold text-center mb-8">Request a Meeting</h2>

              <form onSubmit={handleSubmit}>
                <Input1 name="meetingTitle" label="Meeting Title" value={form.meetingTitle} onChange={handleInputChange} />
                <Input1 name="location" label="Location" value={form.location} onChange={handleInputChange} />
                <Input1 name="clientEmail" label="Client Email" value={form.clientEmail} onChange={handleInputChange} />
                <div className="flex gap-4 mb-4">
                  <Input1 name="date" type="date" label="Date" value={form.date} onChange={handleInputChange} />
                  <Input1 name="time" type="time" label="Start Time" value={form.time} onChange={handleInputChange} />
                </div>
                <Input1 name="duration" label="Duration (hours)" value={form.duration} onChange={handleInputChange} />
                <Input1 name="agenda" label="Special Notes" multiline rows={3} value={form.agenda} onChange={handleInputChange} />
                <Input1 name="googleMeetLink" label="Google Meet Link (optional)" value={form.googleMeetLink} onChange={handleInputChange} />

                <div className="flex justify-center mt-6">
                  <Button1 text="Send Meeting Request" type="submit" className="w-60" />
                </div>
              </form>
            </div>

            {/* Meeting list */}
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl mb-8">
              <h2 className="text-xl font-semibold text-center mb-4">Scheduled Meetings</h2>
              {meetings.length === 0 ? (
                <p className="text-center text-gray-500">No meetings scheduled yet.</p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {meetings.map((m) => (
                    <li key={m.id} className="py-3">
                      <p className="font-semibold">{m.title}</p>
                      <p className="text-gray-600">{m.location}</p>
                      <p className="text-gray-500 text-sm">
                        {m.meetingDate} — {m.startTime}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ScheduleMeeting;
