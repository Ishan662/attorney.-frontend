import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Home from './pages/Common/Home';
import Dashboard from './pages/Lawyer/Dashboard';
import SignUp from './pages/Common/SignUp';



export default function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="admin/dashboard" element={<Dashboard />} />
          <Route path="signup" element={<SignUp />} />
        </Routes>
      </div>
    </Router>
  );
}
