import { useCallback, useEffect, useState } from 'react'
import { equipmentService } from '../services/equipmentService.js'

export function useEquipment() {
  const [equipment, setEquipment] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await equipmentService.getEquipment()
      setEquipment(data)
    } catch (err) {
      setError(err.message || 'Failed to load equipment.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return { equipment, loading, error, refresh: load }
}
