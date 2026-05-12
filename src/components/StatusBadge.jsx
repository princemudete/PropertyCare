import { STATUS_CLASSES, STATUS_LABELS } from '../utils/status'

export const StatusBadge = ({ status }) => {
  return <span className={STATUS_CLASSES[status] || 'badge'}>{STATUS_LABELS[status] || status}</span>
}
