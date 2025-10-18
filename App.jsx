import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import './styles/main.css'

export default function App(){
  return (
    <div className="app-root">
      <header className="topbar">
        <div className="brand">1ClikFixx</div>
        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/subscribe">Subscribe</Link>
          <Link to="/calendar">Calendar</Link>
          <Link to="/questionnaire">Questionnaire</Link>
          <Link to="/provider-form">Provider</Link>
          <Link to="/dashboard">Dashboard</Link>
        </nav>
      </header>
      <main className="content"><Outlet/></main>
      <footer className="footer">© 2025 1ClikFixx — <a href="/legal">Legal</a></footer>
    </div>
  )
}
