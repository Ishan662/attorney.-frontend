import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Home from './pages/Home';


export default function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Add your routes here */}
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}
