import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { firebaseConfig } from '../utils/firebaseConfig'
import { jobTypes } from '../data/jobTypes'
import Protected from '../components/Protected'
import { useAuth } from '../utils/auth'

initializeApp(firebaseConfig)
const db = getFirestore()

export default function Book(){
  const nav = useNavigate()
  const { user } = useAuth()
  const [jobType,setJobType] = useState(jobTypes[0])
  const [description,setDescription] = useState('')
  const [date,setDate] = useState('')
  const [time,setTime] = useState('09:00')

  async function submit(){
    if(!user){ alert('Please login'); nav('/login'); return }
    if(!jobType||!date){ alert('Select job type and date'); return }
    try{
      await addDoc(collection(db,'bookings'),{
        userId: user.uid,
        jobType,
        description,
        date,
        time,
        status: 'pending',
        createdAt: serverTimestamp()
      })
      nav('/calendar')
    }catch(e){ alert(e.message) }
  }

  return (<Protected><div className="page max-w-md">
    <h2>Book a Handyman</h2>
    <label>Job type</label>
    <select value={jobType} onChange={e=>setJobType(e.target.value)}>{jobTypes.map(j=><option key={j} value={j}>{j}</option>)}</select>
    <label>Short description</label>
    <textarea value={description} onChange={e=>setDescription(e.target.value)} />
    <label>Preferred date</label>
    <input type="date" value={date} onChange={e=>setDate(e.target.value)} />
    <label>Preferred time</label>
    <input type="time" value={time} onChange={e=>setTime(e.target.value)} />
    <div className="row"><button className="btn primary" onClick={submit}>Confirm Booking</button></div>
  </div></Protected>)
}
