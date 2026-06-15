import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Heart, Target, BookOpen, Flower2
} from 'lucide-react'

const nav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/wedding', label: 'Wedding', icon: Heart },
  { to: '/life', label: 'Life Planner', icon: Target },
  { to: '/journal', label: 'Journal', icon: BookOpen },
]

export default function Sidebar() {
  const today = new Date()
  const dateStr = today.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric'
  })

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Flower2 size={22} color="var(--accent)" strokeWidth={1.5} />
          <h1 style={{ fontSize: '24px', fontFamily: "'Inter', sans-serif", color: 'var(--accent)', fontWeight: 700, letterSpacing: '-0.5px' }}>
            Rafi
          </h1>
        </div>
        <p className="sidebar-logo-sub" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)', letterSpacing: '2px', textTransform: 'uppercase', marginTop: '4px', fontFamily: "'Inter', sans-serif" }}>
          Your Personal Planner
        </p>
      </div>

      <nav className="sidebar-nav">
        {nav.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Icon size={17} strokeWidth={1.75} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-date">Today</div>
        <div className="sidebar-today">{dateStr}</div>
      </div>
    </aside>
  )
}
