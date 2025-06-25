import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Home from './pages/Common/Home';
import Dashboard from './pages/Lawyer/Dashboard';
import AddNewClient from './pages/Lawyer/AddNewClient';
import Meetings from './pages/Lawyer/MeetingRequest';
import ScheduleMeeting from './pages/Client/ScheduleMeeting';
import Clients from './pages/Lawyer/Clients';



export default function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="admin/dashboard" element={<Dashboard />} />
          <Route path="admin/addnewclient" element={<AddNewClient />} />
          <Route path="admin/meetingrequest" element={<Meetings />} />
          <Route path="client/schedulemeeting" element={<ScheduleMeeting />} />
          <Route path="admin/clients" element={<Clients/>} />
        </Routes>
      </div>
    </Router>
  );
}
