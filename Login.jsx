import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAuth } from 'firebase/auth'
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from '../utils/firebaseConfig'
import { useAuth } from '../utils/auth'

initializeApp(firebaseConfig)
const auth = getAuth()

export default function Login(){
  const nav = useNavigate()
  const { loginWithGoogle } = useAuth()
  const [msg,setMsg] = useState('')

  async function google(){
    try{
      await loginWithGoogle()
      nav('/book')
    }catch(e){ setMsg('Google sign-in failed: '+(e.message||e)) }
  }

  return (<div className="page auth max-w-md">
    <h2>Sign in to Book</h2>
    <p>Continue with Google to create your account and book a handyman.</p>
    <div className="row">
      <button className="btn google" onClick={google}><img src="/src/assets/google.svg" alt="G" style={{height:18,marginRight:8}}/>Continue with Google</button>
    </div>
    <p className="msg">{msg}</p>
  </div>)
}
