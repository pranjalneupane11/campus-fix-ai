import { formatEnumLabel } from '../constants.js'

export default function PriorityBadge({ priority }) {
  if (!priority) return <span className="badge badge-neutral">Pending</span>
  const cls = priority.toLowerCase()
  return <span className={`badge badge-${cls}`}>{formatEnumLabel(priority)}</span>
}
