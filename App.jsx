import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import { useAuth } from './utils/auth'

export default function App(){
  const { user, logout } = useAuth()
  return (
    <div className="app">
      <header className="header">
        <div className="brand">1ClikFixx</div>
        <nav className="nav">
          <Link to='/book'>Book</Link>
          <Link to='/calendar'>Calendar</Link>
          <Link to='/profile'>Profile</Link>
          {!user && <Link to='/login'>Login</Link>}
          {user && <button className="btn-ghost" onClick={logout}>Logout</button>}
        </nav>
      </header>
      <main className="container"><Outlet/></main>
      <footer className="footer">© 2025 1ClikFixx</footer>
    </div>
  )
}
