import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  fetchCurrentUser,
  fetchCsrfToken,
  login as loginRequest,
  logout as logoutRequest,
} from '../services/api'
import { ROLE_PATHS } from '../utils/status'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadCurrentUser = async () => {
    setError(null)
    try {
      const currentUser = await fetchCurrentUser()
      setUser(currentUser)
    } catch {
      setUser(null)
    }
  }

  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true)
      try {
        await fetchCsrfToken().catch(() => null)
        await loadCurrentUser()
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    initializeAuth()
  }, [])

  const signIn = async (username, password) => {
    setLoading(true)
    setError(null)
    try {
      await loginRequest(username, password)
      await loadCurrentUser()
      return true
    } catch (err) {
      setError(err.error || 'Login failed. Check credentials.')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setError(null)
    try {
      await logoutRequest()
    } catch {
      // ignore logout errors and clear local auth state
    } finally {
      setUser(null)
    }
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      loading,
      error,
      signIn,
      signOut,
      allowedPath: user ? ROLE_PATHS[user.role] || '/' : '/login',
    }),
    [user, loading, error]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
