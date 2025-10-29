import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../utils/auth'

export default function Protected({ children }){
  const { user, loading } = useAuth()
  if(loading) return <div>Loading...</div>
  if(!user) return <Navigate to='/login' replace />
  return children
}
