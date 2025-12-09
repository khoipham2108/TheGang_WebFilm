// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Home from './pages/Homepage'
import LoginPage from './pages/Loginpage'
import MainPage from './pages/Mainpage'
import ProfilePage from './pages/ProfilePage'
import MovieDetailsPage from './pages/MovieDetailsPage'
import SeriesPage from './pages/SeriesPage'
import About from './pages/About'
import Contact from './pages/Contact'

import Login from './pages/Homepage/Login'
import Movies from './pages/Homepage/Movies'
import Genres from './pages/Homepage/Genres'

import { AuthProvider } from './auth/AuthContext'
import ProtectedRoute from './auth/ProtectedRoute'
import LoginRedirect from './auth/LoginRedirect'

import './index.css'
import UserPreferencesPage from './pages/UserPreferencesPage/UserPreferencesPage'

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/login', element: <LoginRedirect><LoginPage /></LoginRedirect> },
  { path: '/movies', element: <Movies /> },
  { path: '/series', element: <SeriesPage /> },
  { path: '/genres', element: <Genres /> },
  { path: '/about', element: <About /> },
  { path: '/contact', element: <Contact /> },
  { path: '/my-list', element: <ProtectedRoute><Login /></ProtectedRoute> },
  { path: '/preferences', element: <UserPreferencesPage />},

  { path: '/main', element: <ProtectedRoute><MainPage /></ProtectedRoute> },
  { path: '/profile', element: <ProtectedRoute><ProfilePage /></ProtectedRoute> },

  { path: '/movie/:id', element: <MovieDetailsPage /> },
  { path: '/tv/:id', element: <MovieDetailsPage /> },

  { path: '*', element: <div style={{ padding: 24 }}>404 Not Found</div> },
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  // </React.StrictMode>
)