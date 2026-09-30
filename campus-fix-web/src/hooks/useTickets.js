import { useCallback, useEffect, useState } from 'react'
import { ticketService } from '../services/ticketService.js'

export function useTickets(filters) {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await ticketService.getTickets(filters)
      setTickets(data)
    } catch (err) {
      setError(err.message || 'Failed to load tickets.')
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)])

  useEffect(() => {
    load()
  }, [load])

  return { tickets, loading, error, refresh: load }
}

export function useDashboardStats() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await ticketService.getStats()
      setStats(data)
    } catch (err) {
      setError(err.message || 'Failed to load stats.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return { stats, loading, error, refresh: load }
}
