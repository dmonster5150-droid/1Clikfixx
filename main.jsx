import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import Book from './pages/Book'
import Services from './pages/Services'
import Calendar from './pages/Calendar'
import Profile from './pages/Profile'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import { FirebaseProvider } from './utils/auth'
import './styles/main.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <FirebaseProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<App/>}>
            <Route index element={<Services/>} />
            <Route path='book' element={<Book/>} />
            <Route path='services' element={<Services/>} />
            <Route path='calendar' element={<Calendar/>} />
            <Route path='profile' element={<Profile/>} />
            <Route path='login' element={<Login/>} />
            <Route path='*' element={<NotFound/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </FirebaseProvider>
  </React.StrictMode>
)
