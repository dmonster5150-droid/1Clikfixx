import React, { useEffect, useState } from 'react'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, query, where, orderBy, onSnapshot } from 'firebase/firestore'
import { firebaseConfig } from '../utils/firebaseConfig'
import Protected from '../components/Protected'
import { useAuth } from '../utils/auth'

initializeApp(firebaseConfig)
const db = getFirestore()

export default function Calendar(){
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  useEffect(()=>{
    if(!user) return
    const q = query(collection(db,'bookings'), where('userId','==',user.uid), orderBy('createdAt','desc'))
    const unsub = onSnapshot(q, snap=>{
      setBookings(snap.docs.map(d=>({ id:d.id, ...d.data() })))
    })
    return ()=>unsub()
  },[user])

  return (<Protected><div className="page">
    <h2>Your Bookings</h2>
    {bookings.length===0 && <p>No bookings yet — <a href="/services">Choose a service</a>.</p>}
    <ul>{bookings.map(b=>(<li key={b.id} className="booking"><strong>{b.service}</strong> — {b.date} {b.time} — <em>{b.status}</em></li>))}</ul>
  </div></Protected>)
}
