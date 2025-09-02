import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthProvider } from './state/AuthContext'
import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'
import { StoresPage } from './pages/StoresPage'
import { AdminPage } from './pages/AdminPage'
import { OwnerPage } from './pages/OwnerPage'
import { AnalyticsPage } from './pages/AnalyticsPage'

const router = createBrowserRouter([
  { path: '/', element: <StoresPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignupPage /> },
  { path: '/admin', element: <AdminPage /> },
  { path: '/owner', element: <OwnerPage /> },
  { path: '/analytics', element: <AnalyticsPage /> },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
)
