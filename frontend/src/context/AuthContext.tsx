import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { authApi } from '@/api/auth'
import type { AuthResponse } from '@/types/auth'

interface AuthContextType {
  user: { email: string; role: string } | null
  isAuthenticated: boolean
  isAdmin: boolean
  isManager: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: { email: string; password: string; firstName: string; lastName: string }) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

function parseToken(token: string): { email: string; role: string } | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return { email: payload.sub || payload.email, role: payload.role || payload.roles?.[0] || '' }
  } catch {
    return null
  }
}

function getStoredUser(): { email: string; role: string } | null {
  const token = localStorage.getItem('accessToken')
  if (!token) return null
  const user = parseToken(token)
  if (!user) {
    localStorage.clear()
    return null
  }
  if (!user.role) {
    const storedRole = localStorage.getItem('userRole')
    if (storedRole) {
      user.role = storedRole
    }
  }
  return user
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ email: string; role: string } | null>(getStoredUser)
  const [loading, setLoading] = useState(false)

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true)
    try {
      const res = await authApi.login({ email, password })
      const data = res.data
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      localStorage.setItem('userRole', data.role)
      setUser({ email: data.email, role: data.role })
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (data: { email: string; password: string; firstName: string; lastName: string }) => {
    setLoading(true)
    try {
      const res = await authApi.register(data)
      const authData = res.data
      localStorage.setItem('accessToken', authData.accessToken)
      localStorage.setItem('refreshToken', authData.refreshToken)
      localStorage.setItem('userRole', authData.role)
      setUser({ email: authData.email, role: authData.role })
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.clear()
    setUser(null)
  }, [])

  const isAuthenticated = !!user
  const isAdmin = user?.role === 'ROLE_ADMIN'
  const isManager = user?.role === 'ROLE_MANAGER' || user?.role === 'ROLE_ADMIN'

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isAdmin, isManager, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
