import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const linksByRole = {
  manager: [
    { to: '/manager/dashboard', label: 'Manager Dashboard' },
    { to: '/manager/requests', label: 'All Requests' },
  ],
  staff: [
    { to: '/staff/tasks', label: 'My Tasks' },
  ],
  resident: [
    { to: '/resident/create', label: 'Create Request' },
    { to: '/resident/requests', label: 'My Requests' },
  ],
}

export const Sidebar = () => {
  const { user } = useAuth()
  const role = user?.role
  const links = linksByRole[role] || []

  return (
    <aside className="app-sidebar">
      <div className="sidebar-card">
        <p className="sidebar-title">Quick Actions</p>
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}>
            {link.label}
          </NavLink>
        ))}
      </div>
    </aside>
  )
}
