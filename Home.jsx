import React from "react";
import { Link } from "react-router-dom";

const Home = () => (
  <div className="page center">
    <h1>Welcome to 1ClikFix</h1>
    <p>Your one-stop solution for all home repairs and handyman services.</p>
    <div className="buttons">
      <Link to="/book" className="btn">
        Book a Service
      </Link>
      <Link to="/login" className="btn secondary">
        Provider Login
      </Link>
    </div>
  </div>
);

export default Home; React from 'react'
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
