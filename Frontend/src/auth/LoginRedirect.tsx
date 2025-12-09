import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import TheGangsLoader from '../Componets/Loading/loading'

interface LoginRedirectProps {
  children: React.ReactNode
}

const LoginRedirect: React.FC<LoginRedirectProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <TheGangsLoader />
        </div>
      </div>
    )
  }

  // If user is already authenticated, redirect to main page
  if (isAuthenticated) {
    return <Navigate to="/main" replace />
  }

  // If not authenticated, show the login page
  return <>{children}</>
}

export default LoginRedirect