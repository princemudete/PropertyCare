import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { AlertMessage } from '../components/AlertMessage'
import { LoadingSpinner } from '../components/LoadingSpinner'

export const LoginPage = () => {
  const { signIn, isAuthenticated, allowedPath, loading, error, user } = useAuth()
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [formError, setFormError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
  if (isAuthenticated) {
    if (user?.role === 'manager') {
      navigate('/manager/dashboard')
    } else if (user?.role === 'staff') {
      navigate('/staff/tasks')
    } else {
      navigate('/resident/requests')
    }
  }
}, [isAuthenticated, user, navigate])
  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError('')

    const username = credentials.username.trim()
    const password = credentials.password

    if (!username || !password) {
      setFormError('Username and password are required.')
      return
    }

    try {
      await signIn(username, password)
    } catch {
      // signIn already sets error state
    }
  }

  return (
    <main className="page page-center">
      <section className="card auth-card">
        <h1>Login</h1>
        <p className="muted">Sign in to access your dashboard and maintenance tasks.</p>

        {(formError || error) && <AlertMessage>{formError || error}</AlertMessage>}

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Username
            <input
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              required
            />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>
        {loading && <LoadingSpinner message="Authenticating…" />}
      </section>
    </main>
  )
}
