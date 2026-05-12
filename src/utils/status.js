export const STATUS_LABELS = {
  pending: 'Pending',
  'in progress': 'In Progress',
  completed: 'Completed',
}

export const STATUS_CLASSES = {
  pending: 'badge pending',
  'in progress': 'badge in-progress',
  completed: 'badge completed',
}

export const ROLE_PATHS = {
  manager: '/manager',
  staff: '/staff',
  resident: '/resident',
}

export const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'in progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
]
