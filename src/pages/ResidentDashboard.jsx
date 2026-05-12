import { useMemo, useState } from 'react'
import { useRequests } from '../context/RequestContext'
import { useAuth } from '../context/AuthContext'
import { RequestTable } from '../components/RequestTable'
import { AlertMessage } from '../components/AlertMessage'
import { LoadingSpinner } from '../components/LoadingSpinner'

const initialForm = { title: '', description: '', priority: 'Normal' }

export const ResidentDashboard = () => {
  const { user } = useAuth()
  const { filteredRequests, createNewRequest, loading, error, refreshRequests, setSelectedRequest } = useRequests()
  const [form, setForm] = useState(initialForm)
  const [success, setSuccess] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await createNewRequest(form)
      setForm(initialForm)
      setSuccess('Your request was created successfully.')
      window.setTimeout(() => setSuccess(''), 4000)
    } catch {
      // handled by context
    }
  }

  const requestCount = useMemo(() => filteredRequests.length, [filteredRequests])

  return (
    <main className="page page-grid">
      <section className="card summary-card">
        <p className="summary-label">Resident portal</p>
        <h2>Welcome, {user.username}</h2>
        <p className="muted">Submit requests and track status updates for your own unit.</p>
      </section>

      {error && <AlertMessage>{error}</AlertMessage>}
      {success && <div className="success-message">{success}</div>}

      <section className="card form-card">
        <h3>Create a maintenance request</h3>
        <form onSubmit={handleSubmit} className="request-form">
          <label>
            Title
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </label>
          <label>
            Description
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
          </label>
          <label>
            Priority
            <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
              <option>Normal</option>
              <option>High</option>
              <option>Urgent</option>
            </select>
          </label>
          <button type="submit" disabled={loading}>
            {loading ? 'Submitting…' : 'Submit Request'}
          </button>
        </form>
      </section>

      <section className="card table-card">
        <div className="table-header">
          <div>
            <h2>My requests</h2>
            <p className="muted">You have {requestCount} request{requestCount === 1 ? '' : 's'} in your queue.</p>
          </div>
          <button type="button" onClick={refreshRequests} className="secondary-button">
            Refresh
          </button>
        </div>
        {loading ? (
          <LoadingSpinner message="Loading your requests…" />
        ) : (
          <RequestTable
            requests={filteredRequests}
            onSelect={setSelectedRequest}
            currentRole="resident"
          />
        )}
      </section>
    </main>
  )
}
