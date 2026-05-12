import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  assignStaff,
  createRequest,
  fetchRequestDetail,
  fetchRequests,
  fetchUsers,
  updateRequestStatus,
} from '../services/api'
import { useAuth } from './AuthContext'

const RequestContext = createContext(null)

export const RequestProvider = ({ children }) => {
  const { user } = useAuth()
  const [requests, setRequests] = useState([])
  const [staffMembers, setStaffMembers] = useState([])
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({ search: '', status: '', staff: '' })

  const loadRequests = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchRequests()
      setRequests(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.error || 'Could not load requests')
      setRequests([])
    } finally {
      setLoading(false)
    }
  }

  const loadStaffMembers = async () => {
    try {
      const users = await fetchUsers()
      setStaffMembers(Array.isArray(users) ? users : [])
    } catch {
      setStaffMembers([])
    }
  }

  useEffect(() => {
    if (user) {
      loadRequests()
      if (user.role === 'manager') {
        loadStaffMembers()
      }
    } else {
      setRequests([])
      setStaffMembers([])
    }
  }, [user])

  const refreshRequests = async () => {
    await loadRequests()
  }

  const createNewRequest = async (payload) => {
    setLoading(true)
    setError(null)
    try {
      await createRequest(payload)
      await loadRequests()
    } catch (err) {
      setError(err.error || 'Could not create request')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const changeRequestStatus = async (requestId, status) => {
    setLoading(true)
    setError(null)
    try {
      await updateRequestStatus(requestId, status)
      await loadRequests()
    } catch (err) {
      setError(err.error || 'Could not update request status')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const assignRequestStaff = async (requestId, staffId) => {
    setLoading(true)
    setError(null)
    try {
      await assignStaff(requestId, staffId)
      await loadRequests()
    } catch (err) {
      setError(err.error || 'Could not assign staff')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const loadRequest = async (id) => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchRequestDetail(id)
      setSelectedRequest(data)
      return data
    } catch (err) {
      setError(err.error || 'Could not load request details')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const filteredRequests = useMemo(() => {
    return requests.filter((item) => {
      const matchesSearch =
        filters.search.trim() === '' ||
        item.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.description.toLowerCase().includes(filters.search.toLowerCase())
      const matchesStatus = !filters.status || item.status === filters.status
      const matchesStaff =
        !filters.staff || item.assigned_staff?.id === Number(filters.staff)
      return matchesSearch && matchesStatus && matchesStaff
    })
  }, [requests, filters])

  const value = {
    requests,
    selectedRequest,
    staffMembers,
    filteredRequests,
    filters,
    setFilters,
    loading,
    error,
    refreshRequests,
    createNewRequest,
    changeRequestStatus,
    assignRequestStaff,
    loadRequest,
    setSelectedRequest,
  }

  return <RequestContext.Provider value={value}>{children}</RequestContext.Provider>
}

export const useRequests = () => {
  const context = useContext(RequestContext)
  if (!context) {
    throw new Error('useRequests must be used within RequestProvider')
  }
  return context
}
