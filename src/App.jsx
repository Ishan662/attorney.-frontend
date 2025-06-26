import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Home from './pages/Common/Home';
import Dashboard from './pages/Lawyer/Dashboard';
import Timeline from './pages/Lawyer/Timeline';
import Incomes from './pages/Lawyer/Incomes';
import DaySummary from './pages/Lawyer/DaySummary';
import DuePayments from './pages/Lawyer/DuePayments';
import UserSignUp from './pages/Common/UserSignUp';
import UserLogin from './pages/Common/UserLogin';


export default function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="lawyer/dashboard" element={<Dashboard />} />
          <Route path="lawyer/timeline" element={<Timeline />} />
          <Route path="lawyer/incomes" element={<Incomes />} />
          <Route path="lawyer/day-summary" element={<DaySummary />} />
          <Route path="lawyer/due-payments" element={<DuePayments />} />
          <Route path="user/signup" element={<UserSignUp />} />
          <Route path="user/login" element={<UserLogin />} />
        </Routes>
      </div>
    </Router>
  );
}
