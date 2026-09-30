export default function EmptyState({ title, description }) {
  return (
    <div className="card" style={{ padding: '40px 24px', textAlign: 'center' }}>
      <p style={{ fontWeight: 600, marginBottom: 6 }}>{title}</p>
      {description && (
        <p style={{ color: 'var(--color-slate-light)', fontSize: '0.9rem', margin: 0 }}>
          {description}
        </p>
      )}
    </div>
  )
}
