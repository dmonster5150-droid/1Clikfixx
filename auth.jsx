import React, { createContext, useContext, useEffect, useState } from 'react'
import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged, signOut, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore'
import { firebaseConfig } from './firebaseConfig'

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const googleProvider = new GoogleAuthProvider()

const AuthContext = createContext({ user: null, loading: true })

export function FirebaseProvider({ children }){
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    const unsub = onAuthStateChanged(auth, async (u)=>{
      setUser(u)
      if(u){
        // create users doc if missing
        const uRef = doc(db,'users',u.uid)
        const snap = await getDoc(uRef)
        if(!snap.exists()){
          await setDoc(uRef, { uid:u.uid, name:u.displayName||'', email:u.email, role:'client', createdAt:new Date().toISOString() })
        }
      }
      setLoading(false)
    })
    return ()=>unsub()
  },[])

  const loginWithGoogle = ()=> signInWithPopup(auth, googleProvider)
  const logout = ()=> signOut(auth)

  return <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout }}>{children}</AuthContext.Provider>
}

export function useAuth(){ return useContext(AuthContext) }
