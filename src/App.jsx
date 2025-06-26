import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Home from './pages/Common/Home';
import Dashboard from './pages/Lawyer/Dashboard';
import Timeline from './pages/Lawyer/Timeline';
import Incomes from './pages/Lawyer/Incomes';
import DaySummary from './pages/Lawyer/DaySummary';
import AddClient from './pages/Lawyer/AddNewClient';
import Meetings from './pages/Lawyer/MeetingRequest';
import Clients from './pages/Lawyer/Clients';
import ScheduleMeeting from './pages/Client/ScheduleMeeting';
import Lawyercalander from './pages/Lawyer/Lawyercalender';
import UserSignUp from './pages/Common/UserSignUp';
import UserLogin from './pages/Common/UserLogin';
import Messages from './pages/Lawyer/AllMessages';

export default function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="admin/dashboard" element={<Dashboard />} />
          <Route path="admin/timeline" element={<Timeline />}/>
          <Route path='lawyer/calendar' element={< Lawyercalander />} />
          <Route path="lawyer/dashboard" element={<Dashboard />} />
          <Route path="lawyer/timeline" element={<Timeline />} />
          <Route path="lawyer/incomes" element={<Incomes />} />
          <Route path="lawyer/day-summary" element={<DaySummary />} />
          <Route path="lawyer/addnewclient" element={<AddClient />} />
          <Route path="lawyer/meetingrequest" element={<Meetings />} />
          <Route path="lawyer/clients" element={<Clients />} />
          <Route path="client/schedulemeeting" element={<ScheduleMeeting />} />
          <Route path='/lawyer/messages' element={<Messages />} />
          <Route path="user/signup" element={<UserSignUp />} />
          <Route path="user/login" element={<UserLogin />} />
        </Routes>
      </div>
    </Router>
  );
}
