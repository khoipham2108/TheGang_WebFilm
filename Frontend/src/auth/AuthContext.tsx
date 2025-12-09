import React, { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import authApi, { User } from '../services/authApi'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (username: string, email: string, password: string, birthday?: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const token = authApi.getAuthToken()
    const userData = authApi.getCurrentUser()
    
    if (token && userData) {
      setUser(userData)
    }
    
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authApi.login({ email, password })
      
      if (response.data.success && response.data.token && response.data.user) {
        authApi.saveAuthData(response.data.token, response.data.user)
        setUser(response.data.user)
        return true
      }
      
      return false
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  }

  const signup = async (username: string, email: string, password: string, birthday?: string): Promise<boolean> => {
    try {
      const response = await authApi.signup({ username, email, password, birthday })
      
      if (response.data.success && response.data.token && response.data.user) {
        authApi.saveAuthData(response.data.token, response.data.user)
        setUser(response.data.user)
        return true
      }
      
      return false
    } catch (error) {
      console.error('Signup failed:', error)
      return false
    }
  }

  const logout = () => {
    authApi.clearAuthData()
    setUser(null)
  }

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    loading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext
