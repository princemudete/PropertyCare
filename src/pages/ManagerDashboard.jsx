import { useMemo, useState } from 'react'
import { useRequests } from '../context/RequestContext'
import { useAuth } from '../context/AuthContext'
import { RequestTable } from '../components/RequestTable'
import { StatusBadge } from '../components/StatusBadge'
import { AlertMessage } from '../components/AlertMessage'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { STATUS_OPTIONS } from '../utils/status'

export const ManagerDashboard = () => {
  const { user } = useAuth()
  const {
    filteredRequests,
    staffMembers,
    filters,
    setFilters,
    loading,
    error,
    refreshRequests,
    changeRequestStatus,
    assignRequestStaff,
    selectedRequest,
    setSelectedRequest,
  } = useRequests()
  const [success, setSuccess] = useState('')

  const counts = useMemo(() => {
    return filteredRequests.reduce(
      (summary, request) => {
        summary[request.status] = (summary[request.status] || 0) + 1
        return summary
      },
      { pending: 0, 'in progress': 0, completed: 0 }
    )
  }, [filteredRequests])

  const handleAssign = async (requestId, staffId) => {
    if (!staffId) return
    try {
      await assignRequestStaff(requestId, staffId)
      setSuccess('Staff assignment updated successfully.')
      window.setTimeout(() => setSuccess(''), 4000)
    } catch {
      // handled by context
    }
  }

  const handleStatus = async (request, status) => {
    if (request.status === status) return
    try {
      await changeRequestStatus(request.id, status)
      setSuccess('Request status updated.')
      window.setTimeout(() => setSuccess(''), 3000)
    } catch {
      // handled by context
    }
  }

  return (
    <main className="page page-grid">
      <section className="dashboard-grid">
        <div className="card summary-card">
          <p className="summary-label">Welcome back, {user.username}</p>
          <h2>Manager overview</h2>
          <p className="muted">Manage all requests, assign staff, and track system-wide activity.</p>
        </div>
        <div className="card stat-card">
          <span>Pending</span>
          <strong>{counts.pending}</strong>
        </div>
        <div className="card stat-card">
          <span>In Progress</span>
          <strong>{counts['in progress']}</strong>
        </div>
        <div className="card stat-card">
          <span>Completed</span>
          <strong>{counts.completed}</strong>
        </div>
      </section>

      <section className="card filter-card">
        <div className="filter-row">
          <label>
            Search
            <input
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Search request titles or descriptions"
            />
          </label>
          <label>
            Status
            <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Assigned Staff
            <select value={filters.staff} onChange={(e) => setFilters({ ...filters, staff: e.target.value })}>
              <option value="">All staff</option>
              {staffMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.username}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      {error && <AlertMessage>{error}</AlertMessage>}
      {success && <div className="success-message">{success}</div>}

      {loading ? (
        <LoadingSpinner message="Loading requests…" />
      ) : (
        <section className="card table-card">
          <div className="table-header">
            <div>
              <h2>All maintenance requests</h2>
              <p className="muted">Filter, assign staff, and update statuses from one place.</p>
            </div>
            <button type="button" onClick={refreshRequests} className="secondary-button">
              Refresh
            </button>
          </div>
          <RequestTable
            requests={filteredRequests}
            onStatusChange={handleStatus}
            onSelect={setSelectedRequest}
            onAssign={handleAssign}
            staffMembers={staffMembers}
            showAssign={true}
            currentRole="manager"
          />
          {selectedRequest && (
            <article className="detail-card">
              <h3>Selected request</h3>
              <p className="detail-title">{selectedRequest.title}</p>
              <p>{selectedRequest.description}</p>
              <div className="detail-meta">
                <span>Resident: {selectedRequest.resident?.username}</span>
                <span>Status: <StatusBadge status={selectedRequest.status} /></span>
              </div>
            </article>
          )}
        </section>
      )}
    </main>
  )
}
