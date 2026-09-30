import { useState } from 'react'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import EmptyState from '../components/EmptyState.jsx'
import ErrorBanner from '../components/ErrorBanner.jsx'
import { useEquipment } from '../hooks/useEquipment.js'
import { equipmentService } from '../services/equipmentService.js'
import { EQUIPMENT_TYPES, EQUIPMENT_STATUSES, formatEnumLabel, formatEquipmentType } from '../constants.js'

const emptyForm = { assetId: '', name: '', type: '', building: '', room: '' }

export default function EquipmentPage() {
  const { equipment, loading, error, refresh } = useEquipment()
  const [form, setForm] = useState(emptyForm)
  const [formError, setFormError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const handleCreate = async (e) => {
    e.preventDefault()
    setFormError(null)
    if (!form.assetId || !form.name || !form.type || !form.building) {
      setFormError('Asset ID, name, type, and building are required.')
      return
    }
    setSubmitting(true)
    try {
      await equipmentService.createEquipment({ ...form, room: form.room || null })
      setForm(emptyForm)
      refresh()
    } catch (err) {
      setFormError(err.message || 'Failed to add equipment.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleStatusChange = async (id, status) => {
    try {
      await equipmentService.updateStatus(id, status)
      refresh()
    } catch (err) {
      setFormError(err.message || 'Failed to update status.')
    }
  }

  return (
    <>
      <div className="page-header">
        <h1>Equipment tracking</h1>
        <p>Assets across campus buildings and their current operational status.</p>
      </div>

      <form className="card" style={{ padding: 20, marginBottom: 24, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }} onSubmit={handleCreate}>
        <div className="field" style={{ marginBottom: 0, minWidth: 140 }}>
          <label>Asset ID</label>
          <input value={form.assetId} onChange={(e) => update('assetId', e.target.value)} placeholder="PROJ-204A" />
        </div>
        <div className="field" style={{ marginBottom: 0, minWidth: 160 }}>
          <label>Name</label>
          <input value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Epson EX3280" />
        </div>
        <div className="field" style={{ marginBottom: 0, minWidth: 160 }}>
          <label>Type</label>
          <select value={form.type} onChange={(e) => update('type', e.target.value)}>
            <option value="">Select…</option>
            {EQUIPMENT_TYPES.map((eq) => (
              <option key={eq.value} value={eq.value}>{eq.label}</option>
            ))}
          </select>
        </div>
        <div className="field" style={{ marginBottom: 0, minWidth: 160 }}>
          <label>Building</label>
          <input value={form.building} onChange={(e) => update('building', e.target.value)} placeholder="Franklin Hall" />
        </div>
        <div className="field" style={{ marginBottom: 0, minWidth: 100 }}>
          <label>Room</label>
          <input value={form.room} onChange={(e) => update('room', e.target.value)} placeholder="204A" />
        </div>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Adding…' : 'Add asset'}
        </button>
      </form>

      <ErrorBanner message={formError} />
      <ErrorBanner message={error} onRetry={refresh} />

      {loading ? (
        <LoadingSpinner label="Loading equipment…" />
      ) : equipment.length === 0 ? (
        <EmptyState title="No equipment tracked yet" description="Add an asset above to start tracking it." />
      ) : (
        <div className="card table-wrap">
          <table className="ticket-table">
            <thead>
              <tr>
                <th>Asset ID</th>
                <th>Name</th>
                <th>Type</th>
                <th>Location</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {equipment.map((item) => (
                <tr key={item.id}>
                  <td>{item.assetId}</td>
                  <td>{item.name}</td>
                  <td>{formatEquipmentType(item.type)}</td>
                  <td>{item.building}{item.room ? ` · Rm ${item.room}` : ''}</td>
                  <td>
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusChange(item.id, e.target.value)}
                      style={{ padding: '6px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
                    >
                      {EQUIPMENT_STATUSES.map((s) => (
                        <option key={s} value={s}>{formatEnumLabel(s)}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
