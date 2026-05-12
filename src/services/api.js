import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || '/api'

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

let csrfToken = null

export const setCsrfToken = (token) => {
  csrfToken = token
  api.defaults.headers['X-CSRFToken'] = token
}

const handleAxiosError = (error) => {
  if (error.response?.data) {
    return error.response.data
  }
  return { error: error.message || 'API request failed' }
}

export const fetchCsrfToken = async () => {
  try {
    const response = await api.get('/csrf/')
    if (response?.data?.token) {
      setCsrfToken(response.data.token)
      return response.data.token
    }
  } catch (error) {
    // Backend may not expose a CSRF endpoint in all environments.
    console.warn('CSRF token fetch failed:', error?.response?.status || error?.message)
  }
  return null
}

export const login = async (username, password) => {
  if (!csrfToken) {
    await fetchCsrfToken().catch(() => null)
  }
  try {
    const response = await api.post('/login/', { username, password })
    return response.data
  } catch (error) {
    throw handleAxiosError(error)
  }
}

export const logout = async () => {
  try {
    const response = await api.post('/logout/')
    return response.data
  } catch (error) {
    throw handleAxiosError(error)
  }
}

export const fetchCurrentUser = async () => {
  try {
    const response = await api.get('/me/')
    return response.data
  } catch (error) {
    throw handleAxiosError(error)
  }
}

export const fetchRequests = async () => {
  try {
    const response = await api.get('/requests/')
    return response.data
  } catch (error) {
    throw handleAxiosError(error)
  }
}

export const fetchRequestDetail = async (id) => {
  try {
    const response = await api.get(`/requests/${id}/`)
    return response.data
  } catch (error) {
    throw handleAxiosError(error)
  }
}

export const fetchUsers = async () => {
  try {
    const response = await api.get('/users/')
    return response.data
  } catch (error) {
    throw handleAxiosError(error)
  }
}

export const createRequest = async (payload) => {
  try {
    const response = await api.post('/requests/', payload)
    return response.data
  } catch (error) {
    throw handleAxiosError(error)
  }
}

export const updateRequestStatus = async (id, status) => {
  try {
    const response = await api.post(`/requests/${id}/update_status/`, { status })
    return response.data
  } catch (error) {
    throw handleAxiosError(error)
  }
}

export const assignStaff = async (id, staffId) => {
  try {
    const response = await api.post(`/requests/${id}/assign/`, { staff_id: staffId })
    return response.data
  } catch (error) {
    throw handleAxiosError(error)
  }
}
