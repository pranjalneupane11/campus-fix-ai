export default function ErrorBanner({ message, onRetry }) {
  if (!message) return null
  return (
    <div
      style={{
        background: '#F6E1DA',
        color: 'var(--color-red)',
        border: '1px solid #E9C2B2',
        borderRadius: 'var(--radius-sm)',
        padding: '12px 16px',
        marginBottom: 20,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
        fontSize: '0.9rem',
      }}
    >
      <span>{message}</span>
      {onRetry && (
        <button className="btn btn-secondary" onClick={onRetry} style={{ flexShrink: 0 }}>
          Retry
        </button>
      )}
    </div>
  )
}
