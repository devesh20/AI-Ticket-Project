import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import Tickets from './pages/Tickets'
import Admin from './pages/Admin'
import Login from './pages/Login'
import Signup from './pages/Signup'
import CheckAuth from './components/CheckAuth/CheckAuth'
import TicketDetailsPage from './pages/TicketDetail'
import NavBar from './components/NavBar/NavBar'
import Layout from './components/Layout/Layout'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Public routes - should come first */}
        <Route
          path='/login'
          element={
            <CheckAuth protectedRoute={false}>
              <Login/>
            </CheckAuth>
          }
        />
        <Route
          path='/signup'
          element={
            <CheckAuth protectedRoute={false}>
              <Signup/>
            </CheckAuth>
          }
        />
        
        {/* Protected routes */}
        <Route
          path='/'
          element={
            <CheckAuth protectedRoute={true}>
              <Layout>
                <Tickets/>
              </Layout>
            </CheckAuth>
          }
        />
        <Route
          path='/tickets/:id'
          element={
            <CheckAuth protectedRoute={true}>
              <TicketDetailsPage/>
            </CheckAuth>
          }
        />
        <Route
          path='/admin'
          element={
            <CheckAuth protectedRoute={true}>
              <Layout>
                <Admin/>
              </Layout>
            </CheckAuth>
          }
        />
        
        {/* Catch-all route - redirect to login if not authenticated, otherwise to home */}
        <Route
          path='*'
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
