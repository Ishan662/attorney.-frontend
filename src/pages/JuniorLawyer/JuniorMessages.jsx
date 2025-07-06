import React, { useState } from "react";
import PageHeader from "../../components/layout/PageHeader";
import Input1 from '../../components/UI/Input1';
import PageLayout from "../../components/layout/PageLayout";

const user = {
  name: 'Sujan Darshana',
  email: 'sujan@gmail.com',
  role: 'junior_lawyer'
};

const allMessages = [
  {
    id: 1,
    client: "Kumara Jayasuriya",
    description: "Please update me on the next steps for my case.",
    status: "unread",
    date: "2025-07-05",
    time: "09:45 AM",
    avatar: "KJ"
  },
  {
    id: 2,
    client: "Nimal Fernando",
    description: "Can you send the documents for review?",
    status: "read",
    date: "2025-07-04",
    time: "11:20 AM",
    avatar: "NF"
  },
  {
    id: 3,
    client: "Sunil Perera",
    description: "Thank you for your help in court yesterday.",
    status: "unread",
    date: "2025-07-03",
    time: "03:15 PM",
    avatar: "SP"
  }
];

const JuniorMessages = () => {
  const [notificationCount, setNotificationCount] = useState(1);
  const [filterStatus, setFilterStatus] = useState('all');
  const [search, setSearch] = useState('');

  const handleNotificationClick = () => { };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
  };

  const filteredMessages = allMessages.filter(message => {
    const matchesStatus = filterStatus === 'all' || message.status === filterStatus;
    const matchesSearch =
      message.client.toLowerCase().includes(search.toLowerCase()) ||
      message.description.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <PageLayout user={user}>
      <div className='mb-8'>
        <PageHeader
          user={user}
          notificationCount={notificationCount}
          onNotificationClick={handleNotificationClick}
        />
      </div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Messages</h1>
          <p className="text-gray-600">View and manage your client messages</p>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              className={`text-sm py-1 px-4 rounded ${filterStatus === 'all' ? 'bg-black-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => handleFilterChange('all')}
            >
              All
            </button>
            <button
              className={`text-sm py-1 px-4 rounded ${filterStatus === 'unread' ? 'bg-black-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => handleFilterChange('unread')}
            >
              Unread
            </button>
            <button
              className={`text-sm py-1 px-4 rounded ${filterStatus === 'read' ? 'bg-black-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => handleFilterChange('read')}
            >
              Read
            </button>
          </div>
          <div className="relative w-full md:w-auto">
            <Input1
              type="text"
              placeholder="Search messages..."
              className="mt-2"
              variant="outlined"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>
        </div>
      </div>
      <div className="space-y-4">
        {filteredMessages.length > 0 ? (
          filteredMessages.map((message) => (
            <div
              key={message.id}
              className={`bg-white rounded-lg shadow-sm p-4 flex items-center gap-4 ${message.status === 'unread' ? 'border-l-4 border-blue-500' : ''}`}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-400 text-white font-bold text-lg">
                {message.avatar}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold">{message.client}</h4>
                    <div className="text-xs text-gray-500">{formatDate(message.date)} • {message.time}</div>
                  </div>
                  {message.status === 'unread' && (
                    <span className="inline-block w-3 h-3 bg-blue-500 rounded-full"></span>
                  )}
                </div>
                <p className="text-gray-800 mt-2">{message.description}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
            No messages found.
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default JuniorMessages;