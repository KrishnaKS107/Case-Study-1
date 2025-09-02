import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { AuthUser, LoginResponse } from '../api'
import { apiFetch } from '../api'

interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, address: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const t = localStorage.getItem('accessToken')
    const u = localStorage.getItem('user')
    if (t && u) {
      setToken(t)
      setUser(JSON.parse(u))
    }
  }, [])

  const login = async (email: string, password: string) => {
    const res = await apiFetch<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    localStorage.setItem('accessToken', res.accessToken)
    localStorage.setItem('user', JSON.stringify(res.user))
    setToken(res.accessToken)
    setUser(res.user)
  }

  const signup = async (name: string, email: string, address: string, password: string) => {
    await apiFetch('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, address, password }),
    })
  }

  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  const value = useMemo(() => ({ user, token, login, signup, logout }), [user, token])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
