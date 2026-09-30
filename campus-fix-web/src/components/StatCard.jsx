import './stat-card.css'

export default function StatCard({ label, value, accent }) {
  return (
    <div className={`stat-card${accent ? ` accent-${accent}` : ''}`}>
      <div className="stat-card-value">{value}</div>
      <div className="stat-card-label">{label}</div>
    </div>
  )
}
