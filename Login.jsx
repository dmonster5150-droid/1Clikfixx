import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from '../utils/firebaseConfig'
import { useAuth } from '../utils/auth'

initializeApp(firebaseConfig)
const auth = getAuth()

export default function Login(){
  const nav = useNavigate()
  const { loginWithGoogle } = useAuth()
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [msg,setMsg] = useState('')

  async function signup(){
    try{
      const uc = await createUserWithEmailAndPassword(auth,email,password)
      await sendEmailVerification(uc.user)
      setMsg('Account created — verification email sent.')
    }catch(e){ setMsg(e.message) }
  }

  async function login(){
    try{
      await signInWithEmailAndPassword(auth,email,password)
      nav('/book')
    }catch(e){ setMsg(e.message) }
  }

  async function google(){
    try{
      await loginWithGoogle()
      nav('/book')
    }catch(e){ setMsg('Google sign-in failed') }
  }

  return (<div className="page auth max-w-md">
    <h2>Login / Sign up</h2>
    <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
    <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
    <div className="row"><button className="btn primary" onClick={login}>Login</button><button className="btn outline" onClick={signup}>Sign up</button></div>
    <hr />
    <button className="btn google" onClick={google}>Continue with Google</button>
    <p className="msg">{msg}</p>
  </div>)
}
