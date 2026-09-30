import { api } from './api.js'

export const ticketService = {
  createTicket: (payload) => api.post('/tickets', payload),

  getTickets: (filters = {}) => {
    const params = new URLSearchParams()
    if (filters.status) params.set('status', filters.status)
    if (filters.priority) params.set('priority', filters.priority)
    if (filters.category) params.set('category', filters.category)
    const query = params.toString()
    return api.get(`/tickets${query ? `?${query}` : ''}`)
  },

  getTicket: (id) => api.get(`/tickets/${id}`),

  getStats: () => api.get('/tickets/stats'),

  updateStatus: (id, status) => api.patch(`/tickets/${id}/status`, { status }),

  assignTechnician: (id, technicianName) =>
    api.patch(`/tickets/${id}/assign`, { technicianName }),

  resolveTicket: (id, resolutionNotes) =>
    api.patch(`/tickets/${id}/resolve`, { resolutionNotes }),
}
