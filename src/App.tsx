import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import QRCode from './pages/QRCode';
import Login from './pages/Login';
import Profile from './pages/Profile';

const App: React.FC = () => (
  <Router>
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/register" element={<Register />} />
        <Route path="/qr-code/:userId" element={<QRCode />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  </Router>
);

export default App;