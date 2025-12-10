// src/services/authApi.tsx
import axios from 'axios'

// Lấy link từ biến môi trường (nếu có), nếu không thì dùng localhost
const ROOT_API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000/api';

// Nối thêm đuôi /auth vào
const BASE_URL = `${ROOT_API}/auth`;

const authApi = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Request interceptor
authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor
authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear invalid token
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
    }
    return Promise.reject(error)
  }
)

export interface LoginRequest {
  email: string
  password: string
}

export interface SignUpRequest {
  username: string
  email: string
  password: string
  birthday?: string
}

export interface User {
  id: number
  username: string
  email: string
  created_at?: string
  birthday?: string
}

export interface AuthResponse {
  success: boolean
  message: string
  user?: User
  token?: string
}

// Auth API functions
export const login = (data: LoginRequest): Promise<{ data: AuthResponse }> =>
  authApi.post('/login', data)

export const signup = (data: SignUpRequest): Promise<{ data: AuthResponse }> =>
  authApi.post('/signup', data)

export const logout = (): Promise<{ data: { success: boolean; message: string } }> =>
  authApi.post('/logout')

export const verifyToken = (token: string): Promise<{ data: { success: boolean; message: string } }> =>
  authApi.get(`/verify?token=${token}`)

// Auth helper functions
export const saveAuthData = (token: string, user: User) => {
  localStorage.setItem('auth_token', token)
  localStorage.setItem('user_data', JSON.stringify(user))
}

export const clearAuthData = () => {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('user_data')
}

export const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token')
}

export const getCurrentUser = (): User | null => {
  const userData = localStorage.getItem('user_data')
  return userData ? JSON.parse(userData) : null
}

export const isAuthenticated = (): boolean => {
  return !!getAuthToken()
}

export default {
  login,
  signup,
  logout,
  verifyToken,
  saveAuthData,
  clearAuthData,
  getAuthToken,
  getCurrentUser,
  isAuthenticated,
}