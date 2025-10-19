import React, { useEffect, useState } from 'react'
import { initializeApp } from 'firebase/app'
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore'
import { firebaseConfig } from '../utils/firebaseConfig'
import Protected from '../components/Protected'
import { useAuth } from '../utils/auth'

initializeApp(firebaseConfig)
const db = getFirestore()

export default function Profile(){
  const { user } = useAuth()
  const [profile, setProfile] = useState({ name:'', phone:'', address:'' })
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    if(!user) return
    const ref = doc(db,'users',user.uid)
    getDoc(ref).then(snap=>{
      if(snap.exists()) setProfile({...profile, ...snap.data()})
      setLoading(false)
    })
  },[user])

  async function save(){
    if(!user) return
    const ref = doc(db,'users',user.uid)
    await setDoc(ref, { uid:user.uid, email:user.email, ...profile }, { merge:true })
    alert('Profile saved')
  }

  if(loading) return <div className="page">Loading...</div>
  return (<Protected><div className="page max-w-md">
    <h2>Your Profile</h2>
    <label>Full name</label>
    <input value={profile.name} onChange={e=>setProfile({...profile, name:e.target.value})} />
    <label>Phone</label>
    <input value={profile.phone} onChange={e=>setProfile({...profile, phone:e.target.value})} />
    <label>Address</label>
    <input value={profile.address} onChange={e=>setProfile({...profile, address:e.target.value})} />
    <div className="row"><button className="btn primary" onClick={save}>Save Profile</button></div>
  </div></Protected>)
}
