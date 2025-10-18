import React from 'react'
import { useNavigate } from 'react-router-dom'
export default function Home(){
  const nav = useNavigate()
  return (
    <div className="page">
      <h1>Welcome to 1ClikFixx</h1>
      <p>Fast, trusted local help — one click away.</p>
      <div className="actions">
        <button className="btn primary" onClick={()=>nav('/questionnaire')}>Book Now</button>
        <button className="btn outline" onClick={()=>nav('/subscribe')}>Subscribe (Providers)</button>
      </div>
    </div>
  )
}
