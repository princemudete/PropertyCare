import { Link } from 'react-router-dom'

export const UnauthorizedPage = () => {
  return (
    <main className="page page-center">
      <section className="card auth-card">
        <h1>Access denied</h1>
        <p className="muted">You do not have permission to view this page.</p>
        <Link to="/" className="secondary-button">
          Return home
        </Link>
      </section>
    </main>
  )
}
