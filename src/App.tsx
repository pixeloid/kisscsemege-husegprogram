import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import QRCode from './pages/QRCode';
import Login from './pages/Login';
import Profile from './pages/Profile';
import AddPurchase from './pages/AddPurchase';
import BarcodeReader from './pages/BarcodeReader';
import UserList from './pages/UserList';
import NavBar from './components/NavBar';

const App: React.FC = () => {

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile/:userId?" element={<Profile />} />
          <Route path="/register" element={<Register />} />
          <Route path="/qr-code/:userId" element={<QRCode />} />
          <Route path="/login" element={<Login />} />
          <Route path="/scan" element={<BarcodeReader />} />
          <Route path="/add-purchase/:userId?" element={<AddPurchase />} />
          <Route path="/users" element={<UserList />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;