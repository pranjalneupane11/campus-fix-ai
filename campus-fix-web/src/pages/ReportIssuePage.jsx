import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import IssueForm from '../components/IssueForm.jsx'
import ErrorBanner from '../components/ErrorBanner.jsx'
import { ticketService } from '../services/ticketService.js'

export default function ReportIssuePage() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (form) => {
    setSubmitting(true)
    setError(null)
    try {
      const ticket = await ticketService.createTicket({
        ...form,
        room: form.room || null,
      })
      navigate(`/tickets/${ticket.id}`, { state: { justCreated: true } })
    } catch (err) {
      setError(err.message || 'Something went wrong submitting your ticket.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <div className="page-header">
        <h1>Report an issue</h1>
        <p>Tell us what's wrong and our AI triage assistant will route and prioritize it automatically.</p>
      </div>
      <ErrorBanner message={error} />
      <IssueForm onSubmit={handleSubmit} submitting={submitting} />
    </>
  )
}
