import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Login from './Login';
import Home from './HomePage';
import Navbar from './Navbar';
import Footer from './Footer';
import EmotionRecognition from './EmotionRecognition';
import AdminDashboard from './AdminDashboard';





function Layout() {
  const location = useLocation();
  const showNavbarAndFooter = !location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen justify-between">
      {showNavbarAndFooter && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/emotion" element={<EmotionRecognition/>} />
        <Route path="/admin/*" element={<AdminDashboard/>} />
        <Route path="/" element={<Home />} />
      </Routes>
      {showNavbarAndFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
