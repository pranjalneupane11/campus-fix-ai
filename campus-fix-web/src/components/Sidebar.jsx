import { NavLink } from 'react-router-dom'
import './sidebar.css'

const links = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/report', label: 'Report an issue' },
  { to: '/equipment', label: 'Equipment' },
]

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-brand-mark">CF</span>
        <div>
          <div className="sidebar-brand-name">Campus Fix AI</div>
          <div className="sidebar-brand-sub">IT support desk</div>
        </div>
      </div>
      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <p>Campus IT Helpdesk</p>
        <p>Mon–Fri, 8am–6pm</p>
      </div>
    </aside>
  )
}
