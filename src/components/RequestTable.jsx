import { useMemo } from 'react'
import { StatusBadge } from './StatusBadge'

export const RequestTable = ({
  requests,
  onStatusChange,
  onSelect,
  onAssign,
  staffMembers = [],
  showAssign = false,
  currentRole,
}) => {
  const sortedRequests = useMemo(
    () => [...requests].sort((a, b) => a.status.localeCompare(b.status)),
    [requests]
  )

  return (
    <div className="table-scroll">
      <table className="request-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Resident</th>
            <th>Staff</th>
            <th>Status</th>
            <th>Priority</th>
            <th className="action-col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedRequests.map((request) => (
            <tr key={request.id} className="table-row" onClick={() => onSelect?.(request)}>
              <td>{request.title}</td>
              <td>{request.resident?.username || 'N/A'}</td>
              <td>{request.assigned_staff?.username || 'Unassigned'}</td>
              <td>
                <StatusBadge status={request.status} />
              </td>
              <td>{request.priority || 'Normal'}</td>
              <td className="action-col">
                {currentRole !== 'resident' && (
                  <div className="table-actions">
                    <button type="button" onClick={(e) => { e.stopPropagation(); onStatusChange?.(request, 'in progress') }} disabled={request.status === 'in progress'}>
                      Start
                    </button>
                    <button type="button" onClick={(e) => { e.stopPropagation(); onStatusChange?.(request, 'completed') }} disabled={request.status === 'completed'}>
                      Complete
                    </button>
                  </div>
                )}
                {showAssign && (
                  <select
                    aria-label="Assign staff"
                    value={request.assigned_staff?.id || ''}
                    onChange={(e) => { e.stopPropagation(); onAssign?.(request.id, Number(e.target.value)) }}
                  >
                    <option value="">Assign staff</option>
                    {staffMembers.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.username}
                      </option>
                    ))}
                  </select>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
