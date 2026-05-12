import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const Navbar = () => {
  const { user, isAuthenticated, signOut } = useAuth()

  return (
    <header className="app-header">
      <div className="brand">
        <Link to="/">PropertyCare</Link>
      </div>
      <nav className="top-nav">
        {isAuthenticated ? (
          <>
            <span className="nav-user">
              {user.username} • {user.role}
            </span>
            <button type="button" onClick={signOut} className="nav-logout">
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="nav-link">
            Login
          </Link>
        )}
      </nav>
    </header>
  )
}
