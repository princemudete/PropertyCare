import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchRequestDetail } from '../services/api'
import { StatusBadge } from '../components/StatusBadge'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { AlertMessage } from '../components/AlertMessage'

export const RequestDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [request, setRequest] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadRequest = async () => {
      try {
        const data = await fetchRequestDetail(id)
        setRequest(data)
      } catch (err) {
        setError(err.error || 'Unable to load request detail.')
      } finally {
        setLoading(false)
      }
    }
    loadRequest()
  }, [id])

  return (
    <main className="page page-center">
      {loading ? (
        <LoadingSpinner message="Loading request details…" />
      ) : error ? (
        <AlertMessage>{error}</AlertMessage>
      ) : (
        <section className="card detail-page-card">
          <button type="button" className="back-button" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <h1>{request.title}</h1>
          <div className="detail-meta-group">
            <span>Resident: {request.resident?.username || 'Unknown'}</span>
            <span>Assigned: {request.assigned_staff?.username || 'Unassigned'}</span>
            <span>
              Status: <StatusBadge status={request.status} />
            </span>
          </div>
          <div className="description-block">
            <h2>Description</h2>
            <p>{request.description}</p>
          </div>
        </section>
      )}
    </main>
  )
}
