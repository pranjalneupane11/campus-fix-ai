import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import StatusBadge from '../components/StatusBadge.jsx'
import PriorityBadge from '../components/PriorityBadge.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import ErrorBanner from '../components/ErrorBanner.jsx'
import { ticketService } from '../services/ticketService.js'
import { TICKET_STATUSES, formatEnumLabel, formatEquipmentType, formatDate } from '../constants.js'

export default function TicketDetailPage() {
  const { id } = useParams()
  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionError, setActionError] = useState(null)

  const [technicianInput, setTechnicianInput] = useState('')
  const [resolutionInput, setResolutionInput] = useState('')
  const [savingAction, setSavingAction] = useState(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await ticketService.getTicket(id)
      setTicket(data)
      setTechnicianInput(data.assignedTechnician || '')
      setResolutionInput(data.resolutionNotes || '')
    } catch (err) {
      setError(err.message || 'Failed to load ticket.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const runAction = async (key, fn) => {
    setSavingAction(key)
    setActionError(null)
    try {
      const updated = await fn()
      setTicket(updated)
    } catch (err) {
      setActionError(err.message || 'Action failed. Please try again.')
    } finally {
      setSavingAction(null)
    }
  }

  if (loading) return <LoadingSpinner label="Loading ticket…" />
  if (error) return <ErrorBanner message={error} onRetry={load} />
  if (!ticket) return null

  return (
    <>
      <div className="page-header">
        <Link to="/" style={{ fontSize: '0.85rem', color: 'var(--color-brand)', textDecoration: 'none' }}>
          ← Back to dashboard
        </Link>
        <h1 style={{ marginTop: 10 }}>Ticket #{ticket.id}</h1>
        <p>{ticket.building}{ticket.room ? ` · Room ${ticket.room}` : ''} · {formatEquipmentType(ticket.equipmentType)}</p>
      </div>

      <ErrorBanner message={actionError} />

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <section className="card" style={{ padding: 24 }}>
            <h2 style={{ fontSize: '1.05rem', margin: '0 0 4px' }}>Reported problem</h2>
            <p style={{ color: 'var(--color-slate-light)', fontSize: '0.85rem', margin: '0 0 14px' }}>
              Submitted by {ticket.requesterName} ({ticket.requesterEmail}) on {formatDate(ticket.createdAt)}
            </p>
            <p style={{ margin: 0, lineHeight: 1.6 }}>{ticket.description}</p>
          </section>

          <section className="card" style={{ padding: 24 }}>
            <h2 style={{ fontSize: '1.05rem', margin: '0 0 14px' }}>AI analysis</h2>
            {ticket.aiAnalysisFailed ? (
              <p style={{ color: 'var(--color-slate-light)', fontSize: '0.9rem' }}>
                AI analysis is unavailable for this ticket. A technician should classify and prioritize it manually.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.92rem' }}>
                <div><strong>Category:</strong> {ticket.aiCategory} {ticket.aiSubcategory ? `— ${ticket.aiSubcategory}` : ''}</div>
                <div><strong>Priority:</strong> <PriorityBadge priority={ticket.aiPriority} /></div>
                <div><strong>Summary:</strong> {ticket.aiSummary}</div>
                <div><strong>Suggested response:</strong> {ticket.aiSuggestedResponse}</div>
              </div>
            )}
          </section>

          <section className="card" style={{ padding: 24 }}>
            <h2 style={{ fontSize: '1.05rem', margin: '0 0 14px' }}>Resolution notes</h2>
            <textarea
              value={resolutionInput}
              onChange={(e) => setResolutionInput(e.target.value)}
              placeholder="Describe how this issue was resolved…"
              style={{ width: '100%', minHeight: 100, padding: 10, borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
            />
            <div style={{ marginTop: 10 }}>
              <button
                className="btn btn-primary"
                disabled={savingAction === 'resolve' || !resolutionInput.trim()}
                onClick={() => runAction('resolve', () => ticketService.resolveTicket(ticket.id, resolutionInput))}
              >
                {savingAction === 'resolve' ? 'Saving…' : 'Mark resolved'}
              </button>
            </div>
          </section>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <section className="card" style={{ padding: 24 }}>
            <h2 style={{ fontSize: '1.05rem', margin: '0 0 14px' }}>Status</h2>
            <StatusBadge status={ticket.status} />
            <div className="field" style={{ marginTop: 16 }}>
              <label htmlFor="status">Change status</label>
              <select
                id="status"
                value={ticket.status}
                disabled={savingAction === 'status'}
                onChange={(e) => runAction('status', () => ticketService.updateStatus(ticket.id, e.target.value))}
              >
                {TICKET_STATUSES.map((s) => (
                  <option key={s} value={s}>{formatEnumLabel(s)}</option>
                ))}
              </select>
            </div>
          </section>

          <section className="card" style={{ padding: 24 }}>
            <h2 style={{ fontSize: '1.05rem', margin: '0 0 14px' }}>Assignment</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-slate-light)', margin: '0 0 12px' }}>
              {ticket.assignedTechnician ? `Assigned to ${ticket.assignedTechnician}` : 'Not yet assigned'}
            </p>
            <div className="field">
              <label htmlFor="technician">Technician name</label>
              <input
                id="technician"
                value={technicianInput}
                onChange={(e) => setTechnicianInput(e.target.value)}
                placeholder="e.g. Sam Nguyen"
              />
            </div>
            <button
              className="btn btn-secondary"
              disabled={savingAction === 'assign' || !technicianInput.trim()}
              onClick={() => runAction('assign', () => ticketService.assignTechnician(ticket.id, technicianInput))}
            >
              {savingAction === 'assign' ? 'Saving…' : 'Assign technician'}
            </button>
          </section>
        </div>
      </div>
    </>
  )
}
