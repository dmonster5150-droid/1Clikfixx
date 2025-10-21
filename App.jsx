import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Booking from "./pages/Booking";
import Calendar from "./pages/Calendar";
import ProviderPortal from "./pages/ProviderPortal";
import Login from "./pages/Login";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book" element={<Booking />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/provider" element={<ProviderPortal />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App; React from 'react'
import { Outlet, Link } from 'react-router-dom'
import { useAuth } from './utils/auth'

export default function App(){
  const { user, logout } = useAuth()
  return (
    <div className="site">
      <header className="topbar">
        <div className="brand">1ClikFix</div>
        <nav className="nav">
          <Link to='/'>Services</Link>
          <Link to='/book'>Book</Link>
          <Link to='/calendar'>Calendar</Link>
          <Link to='/profile'>Profile</Link>
          {!user && <Link to='/login'>Login</Link>}
          {user && <button className='btn-ghost' onClick={logout}>Logout</button>}
        </nav>
      </header>
      <main className="container"><Outlet/></main>
      <footer className="footer">© 2025 1ClikFix</footer>
    </div>
  )import { Routes, Route } from "react-router-dom";
import Home from "./Home.jsx";
import Booking from "./Booking.jsx";
import Subscribe from "./Subscribe.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/book" element={<Booking />} />
      <Route path="/subscribe" element={<Subscribe />} />
    </Routes>
  );
}

export default App;
}<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/subscribe" element={<Subscribe />} />
  <Route path="/calendar" element={<Calendar />} />
  <Route path="/questionnaire" element={<Questionnaire />} />
  <Route path="/provider" element={<ProviderForm />} />
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="*" element={<NotFound />} />
</Routes>
