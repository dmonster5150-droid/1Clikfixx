import React from 'react'
import { useNavigate } from 'react-router-dom'
export default function NotFound(){ const nav = useNavigate(); setTimeout(()=>nav('/'),1500); return (<div className="page"><h1>Page not found</h1><p>Redirecting to home...</p></div>) }
