import React from 'react'
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
  )
}
