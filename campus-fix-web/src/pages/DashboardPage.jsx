import { useState } from 'react'
import StatCard from '../components/StatCard.jsx'
import TicketFilters from '../components/TicketFilters.jsx'
import TicketTable from '../components/TicketTable.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import EmptyState from '../components/EmptyState.jsx'
import ErrorBanner from '../components/ErrorBanner.jsx'
import { useTickets, useDashboardStats } from '../hooks/useTickets.js'

export default function DashboardPage() {
  const [filters, setFilters] = useState({})
  const { tickets, loading, error, refresh } = useTickets(filters)
  const { stats, loading: statsLoading } = useDashboardStats()

  return (
    <>
      <div className="page-header">
        <h1>IT dashboard</h1>
        <p>Live view of every reported ticket across campus buildings.</p>
      </div>

      {!statsLoading && stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 28 }}>
          <StatCard label="Open tickets" value={stats.openCount} />
          <StatCard label="In progress" value={stats.inProgressCount} accent="amber" />
          <StatCard label="Resolved" value={stats.resolvedCount} accent="green" />
          <StatCard label="High priority" value={stats.highPriorityCount} accent="red" />
        </div>
      )}
      {!statsLoading && stats && stats.mostCommonCategory !== 'N/A' && (
        <p style={{ color: 'var(--color-slate-light)', fontSize: '0.85rem', marginTop: -18, marginBottom: 24 }}>
          Most common issue category: <strong style={{ color: 'var(--color-ink)' }}>{stats.mostCommonCategory}</strong>
        </p>
      )}

      <TicketFilters filters={filters} onChange={setFilters} />

      <ErrorBanner message={error} onRetry={refresh} />

      {loading ? (
        <LoadingSpinner label="Loading tickets…" />
      ) : tickets.length === 0 ? (
        <EmptyState
          title="No tickets match these filters"
          description="Try clearing a filter, or check back once new issues are reported."
        />
      ) : (
        <TicketTable tickets={tickets} />
      )}
    </>
  )
}
