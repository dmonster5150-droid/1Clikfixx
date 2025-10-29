import React from 'react'
import { useNavigate } from 'react-router-dom'
export default function NotFound(){ const nav = useNavigate(); setTimeout(()=>nav('/'),1200); return (<div className='page'><h2>Page not found</h2><p>Redirecting home…</p></div>) }
