import { useNavigate } from 'react-router-dom'
import StatusBadge from './StatusBadge.jsx'
import PriorityBadge from './PriorityBadge.jsx'
import { formatDate } from '../constants.js'
import './ticket-table.css'

export default function TicketTable({ tickets }) {
  const navigate = useNavigate()

  return (
    <div className="card table-wrap">
      <table className="ticket-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Summary</th>
            <th>Location</th>
            <th>Category</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((t) => (
            <tr key={t.id} onClick={() => navigate(`/tickets/${t.id}`)}>
              <td>#{t.id}</td>
              <td className="ticket-summary-cell">
                {t.aiSummary || t.description.slice(0, 80)}
              </td>
              <td>{t.building}{t.room ? ` · Rm ${t.room}` : ''}</td>
              <td>{t.aiCategory || '—'}</td>
              <td><PriorityBadge priority={t.aiPriority} /></td>
              <td><StatusBadge status={t.status} /></td>
              <td>{formatDate(t.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
