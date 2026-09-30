import { useState } from 'react'
import { EQUIPMENT_TYPES } from '../constants.js'

const emptyForm = {
  requesterName: '',
  requesterEmail: '',
  building: '',
  room: '',
  equipmentType: '',
  description: '',
}

export default function IssueForm({ onSubmit, submitting }) {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})

  const update = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const validate = () => {
    const next = {}
    if (!form.requesterName.trim()) next.requesterName = 'Name is required.'
    if (!form.requesterEmail.trim()) next.requesterEmail = 'Email is required.'
    else if (!/^\S+@\S+\.\S+$/.test(form.requesterEmail)) next.requesterEmail = 'Enter a valid email.'
    if (!form.building.trim()) next.building = 'Building is required.'
    if (!form.equipmentType) next.equipmentType = 'Select an equipment type.'
    if (form.description.trim().length < 10) next.description = 'Describe the problem in at least 10 characters.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit(form)
  }

  return (
    <form className="card" style={{ padding: 28, maxWidth: 640 }} onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="requesterName">Full name</label>
        <input
          id="requesterName"
          value={form.requesterName}
          onChange={(e) => update('requesterName', e.target.value)}
          placeholder="Jordan Ramirez"
        />
        {errors.requesterName && <span className="error-text">{errors.requesterName}</span>}
      </div>

      <div className="field">
        <label htmlFor="requesterEmail">Email</label>
        <input
          id="requesterEmail"
          type="email"
          value={form.requesterEmail}
          onChange={(e) => update('requesterEmail', e.target.value)}
          placeholder="jramirez@campus.edu"
        />
        {errors.requesterEmail && <span className="error-text">{errors.requesterEmail}</span>}
      </div>

      <div style={{ display: 'flex', gap: 16 }}>
        <div className="field" style={{ flex: 2 }}>
          <label htmlFor="building">Building</label>
          <input
            id="building"
            value={form.building}
            onChange={(e) => update('building', e.target.value)}
            placeholder="Franklin Hall"
          />
          {errors.building && <span className="error-text">{errors.building}</span>}
        </div>
        <div className="field" style={{ flex: 1 }}>
          <label htmlFor="room">Room</label>
          <input
            id="room"
            value={form.room}
            onChange={(e) => update('room', e.target.value)}
            placeholder="204A"
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="equipmentType">Equipment type</label>
        <select
          id="equipmentType"
          value={form.equipmentType}
          onChange={(e) => update('equipmentType', e.target.value)}
        >
          <option value="">Select equipment…</option>
          {EQUIPMENT_TYPES.map((eq) => (
            <option key={eq.value} value={eq.value}>{eq.label}</option>
          ))}
        </select>
        {errors.equipmentType && <span className="error-text">{errors.equipmentType}</span>}
      </div>

      <div className="field">
        <label htmlFor="description">Describe the problem</label>
        <textarea
          id="description"
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
          placeholder="The projector turns on but my laptop isn't displaying anything even though HDMI is connected."
        />
        {errors.description && <span className="error-text">{errors.description}</span>}
      </div>

      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? 'Submitting…' : 'Submit ticket'}
      </button>
    </form>
  )
}
