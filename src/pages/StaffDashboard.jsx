import { useState } from 'react'
import { useRequests } from '../context/RequestContext'
import { useAuth } from '../context/AuthContext'
import { RequestTable } from '../components/RequestTable'
import { AlertMessage } from '../components/AlertMessage'
import { LoadingSpinner } from '../components/LoadingSpinner'

export const StaffDashboard = () => {
  const { user } = useAuth()
  const { filteredRequests, loading, error, changeRequestStatus, refreshRequests, setSelectedRequest } = useRequests()
  const [success, setSuccess] = useState('')

  const handleStatus = async (request, status) => {
    if (request.status === status) return
    try {
      await changeRequestStatus(request.id, status)
      setSuccess('Task status updated.')
      window.setTimeout(() => setSuccess(''), 3000)
    } catch {
      // handled by context
    }
  }

  return (
    <main className="page page-grid">
      <section className="card summary-card">
        <p className="summary-label">Assigned tasks for {user.username}</p>
        <h2>Maintenance staff dashboard</h2>
        <p className="muted">Track assigned requests and update statuses without reassigning work.</p>
      </section>

      {error && <AlertMessage>{error}</AlertMessage>}
      {success && <div className="success-message">{success}</div>}

      {loading ? (
        <LoadingSpinner message="Loading assigned tasks…" />
      ) : (
        <section className="card table-card">
          <div className="table-header">
            <div>
              <h2>My tasks</h2>
              <p className="muted">Tasks are filtered automatically based on your logged-in role.</p>
            </div>
            <button type="button" onClick={refreshRequests} className="secondary-button">
              Refresh
            </button>
          </div>
          <RequestTable
            requests={filteredRequests}
            onStatusChange={handleStatus}
            onSelect={setSelectedRequest}
            currentRole="staff"
          />
        </section>
      )}
    </main>
  )
}
