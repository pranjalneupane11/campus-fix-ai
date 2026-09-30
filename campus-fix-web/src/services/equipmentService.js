import { api } from './api.js'

export const equipmentService = {
  getEquipment: () => api.get('/equipment'),
  createEquipment: (payload) => api.post('/equipment', payload),
  updateStatus: (id, status) => api.patch(`/equipment/${id}/status`, { status }),
}
