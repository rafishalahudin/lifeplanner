import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Heart, Target, BookOpen, Settings, Search, Bell, User, Wallet } from 'lucide-react'
import PomodoroTimer from './PomodoroTimer'
import { useIsMobile } from '../hooks/useIsMobile'

const NAV = [
  { to: '/dashboard', label: 'Home',     icon: LayoutDashboard },
  { to: '/wedding',   label: 'Wedding',  icon: Heart           },
  { to: '/life',      label: 'Activity', icon: Target          },
  { to: '/journal',   label: 'Journal',  icon: BookOpen        },
  { to: '/finance',   label: 'Finance',  icon: Wallet          },
  { to: '/settings',  label: 'Settings', icon: Settings        },
]

export default function TopNav() {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <header className="topnav-mobile">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-mobile-link${isActive ? ' active' : ''}`}
          >
            <div className="nav-icon-wrap">
              <Icon size={20} strokeWidth={1.9}/>
            </div>
            <span>{label}</span>
          </NavLink>
        ))}
      </header>
    )
  }

  return (
    <header className="topnav">
      <NavLink to="/dashboard" className="nav-logo">
        <img src="/logo-rafi.png" alt="Rafi" style={{ height:'36px', width:'auto', display:'block' }} />
      </NavLink>

      <nav className="nav-links">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Icon size={16} strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="nav-search">
        <Search size={15} color="var(--text-muted)" />
        <input placeholder="Search here..." />
      </div>

      <div className="nav-actions">
        <PomodoroTimer />
        <button className="nav-icon-btn">
          <Bell size={17} strokeWidth={1.8} />
          <div className="nav-badge" />
        </button>
        <div className="nav-avatar"><User size={16} color="white" strokeWidth={2}/></div>
      </div>
    </header>
  )
}
