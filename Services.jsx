import React, { useEffect, useState } from 'react'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs } from 'firebase/firestore'
import { firebaseConfig } from '../utils/firebaseConfig'
import { defaultServices } from '../data/defaultServices'
import { useNavigate } from 'react-router-dom'

initializeApp(firebaseConfig)
const db = getFirestore()

export default function Services(){
  const nav = useNavigate()
  const [services, setServices] = useState([])
  useEffect(()=>{
    (async ()=>{
      try{
        const snap = await getDocs(collection(db,'services'))
        if(snap.empty){
          setServices(defaultServices)
        } else {
          setServices(snap.docs.map(d=>d.data().name))
        }
      }catch(e){ setServices(defaultServices) }
    })()
  },[])

  return (<div className="page">
    <h2>Select a Service</h2>
    <div className="grid">
      {services.map(s=>(<div key={s} className="card" onClick={()=>nav('/book', {state:{service:s}})}>{s}</div>))}
    </div>
  </div>)
}
