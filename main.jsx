import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import Home from './pages/Home'
import Subscribe from './pages/Subscribe'
import Calendar from './pages/Calendar'
import Questionnaire from './pages/Questionnaire'
import ProviderForm from './pages/ProviderForm'
import Dashboard from './pages/Dashboard'
import NotFound from './pages/NotFound'
import './styles/main.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App/>}>
          <Route index element={<Home/>} />
          <Route path='subscribe' element={<Subscribe/>} />
          <Route path='calendar' element={<Calendar/>} />
          <Route path='questionnaire' element={<Questionnaire/>} />
          <Route path='provider-form' element={<ProviderForm/>} />
          <Route path='dashboard' element={<Dashboard/>} />
          <Route path='*' element={<NotFound/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
