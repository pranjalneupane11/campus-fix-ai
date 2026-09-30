import { formatEnumLabel } from '../constants.js'

export default function StatusBadge({ status }) {
  const cls = status ? status.toLowerCase() : 'neutral'
  return <span className={`badge badge-${cls}`}>{formatEnumLabel(status)}</span>
}
