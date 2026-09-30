import { CATEGORIES, PRIORITIES, TICKET_STATUSES, formatEnumLabel } from '../constants.js'

export default function TicketFilters({ filters, onChange }) {
  const update = (key, value) => onChange({ ...filters, [key]: value || undefined })

  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
      <select value={filters.status || ''} onChange={(e) => update('status', e.target.value)}>
        <option value="">All statuses</option>
        {TICKET_STATUSES.map((s) => (
          <option key={s} value={s}>{formatEnumLabel(s)}</option>
        ))}
      </select>

      <select value={filters.priority || ''} onChange={(e) => update('priority', e.target.value)}>
        <option value="">All priorities</option>
        {PRIORITIES.map((p) => (
          <option key={p} value={p}>{formatEnumLabel(p)}</option>
        ))}
      </select>

      <select value={filters.category || ''} onChange={(e) => update('category', e.target.value)}>
        <option value="">All categories</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
    </div>
  )
}
