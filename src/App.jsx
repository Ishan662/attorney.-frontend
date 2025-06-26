import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Home from './pages/Common/Home';
import Dashboard from './pages/Lawyer/Dashboard';
import Timeline from './pages/Lawyer/Timeline';
import Lawyercalander from './pages/Lawyer/Lawyercalender';



export default function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="admin/dashboard" element={<Dashboard />} />
          <Route path="admin/timeline" element={<Timeline />}/>
          <Route path='laywer/lawyearcalander' element={< Lawyercalander />} />
        </Routes>
      </div>
    </Router>
  );
}
