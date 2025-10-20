import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { firebaseConfig } from '../utils/firebaseConfig'
import Protected from '../components/Protected'
import { useAuth } from '../utils/auth'

initializeApp(firebaseConfig)
const db = getFirestore()

export default function Book(){
  const loc = useLocation()
  const nav = useNavigate()
  const { user } = useAuth()
  const preselected = (loc.state && loc.state.service) || ''
  const [service,setService] = useState(preselected)
  const [description,setDescription] = useState('')
  const [date,setDate] = useState('')
  const [time,setTime] = useState('09:00')
  const [loading,setLoading] = useState(false)

  async function submit(){
    if(!user){ nav('/login'); return }
    if(!service||!date){ alert('Please pick a service and date'); return }
    setLoading(true)
    try{
      await addDoc(collection(db,'bookings'),{
        userId: user.uid,
        userName: user.displayName || '',
        userEmail: user.email || '',
        service,
        description,
        date,
        time,
        status: 'pending',
        createdAt: serverTimestamp()
      })
      nav('/calendar', { state:{ booked: true } })
    }catch(e){ alert('Error: '+e.message) }
    setLoading(false)
  }

  return (<Protected><div className="page max-w-md">
    <h2>Book: {service||'Choose a Service'}</h2>
    <label>Service</label>
    <input placeholder="Service name" value={service} onChange={e=>setService(e.target.value)} />
    <label>Describe your project</label>
    <textarea value={description} onChange={e=>setDescription(e.target.value)} />
    <label>Preferred date</label>
    <input type="date" value={date} onChange={e=>setDate(e.target.value)} />
    <label>Preferred time</label>
    <input type="time" value={time} onChange={e=>setTime(e.target.value)} />
    <div className="row"><button className="btn primary" onClick={submit} disabled={loading}>{loading? 'Saving...':'Confirm Booking'}</button></div>
  </div></Protected>)
}
