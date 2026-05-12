import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { RequestProvider } from './context/RequestContext'
import { Navbar } from './components/Navbar'
import { Sidebar } from './components/Sidebar'
import { LoginPage } from './pages/LoginPage'
import { ManagerDashboard } from './pages/ManagerDashboard'
import { StaffDashboard } from './pages/StaffDashboard'
import { ResidentDashboard } from './pages/ResidentDashboard'
import { RequestDetail } from './pages/RequestDetail'
import { UnauthorizedPage } from './pages/UnauthorizedPage'
import { ProtectedRoute } from './routes/ProtectedRoute'

const AppContent = () => {
  const { isAuthenticated } = useAuth()

  return (
    <div className="app-shell">
      <Navbar />
      <div className="app-body">
        {isAuthenticated && <Sidebar />}
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/manager"
              element={
                <ProtectedRoute allowedRoles={['manager']}>
                  <ManagerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff"
              element={
                <ProtectedRoute allowedRoles={['staff']}>
                  <StaffDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/resident"
              element={
                <ProtectedRoute allowedRoles={['resident']}>
                  <ResidentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/requests/:id"
              element={
                <ProtectedRoute>
                  <RequestDetail />
                </ProtectedRoute>
              }
            />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <RequestProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </RequestProvider>
    </AuthProvider>
  )
}

export default App
