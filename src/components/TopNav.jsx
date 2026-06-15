import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Heart, Target, BookOpen, Settings, Search, Bell, User, Wallet, TrendingUp } from 'lucide-react'
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
        {/* App title */}
        <NavLink to="/dashboard" style={{ display:'flex', alignItems:'center', gap:'8px', textDecoration:'none', flexShrink:0 }}>
          <div style={{ width:'28px', height:'28px', borderRadius:'8px', background:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <TrendingUp size={14} color="white" strokeWidth={2.5}/>
          </div>
          <span style={{ fontSize:'15px', fontWeight:800, color:'var(--text)', letterSpacing:'-0.3px', whiteSpace:'nowrap' }}>
            Rafi's Life Planner
          </span>
        </NavLink>

        {/* Life button only */}
        <NavLink to="/life"
          style={({ isActive }) => ({
            display:'flex', alignItems:'center', gap:'6px',
            padding:'7px 14px', borderRadius:'10px',
            color: isActive ? 'var(--accent)' : '#86868B',
            background: isActive ? 'rgba(0,113,227,0.1)' : 'rgba(0,0,0,0.05)',
            textDecoration: 'none', flexShrink: 0,
            fontSize:'13px', fontWeight:600,
            transition: 'all 0.15s',
          })}>
          <Target size={16} strokeWidth={2}/>
          Life
        </NavLink>
      </header>
    )
  }

  return (
    <header className="topnav">
      <NavLink to="/dashboard" className="nav-logo" style={{ display:'flex', alignItems:'center', gap:'8px', textDecoration:'none' }}>
        <div style={{ width:'30px', height:'30px', borderRadius:'9px', background:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <TrendingUp size={15} color="white" strokeWidth={2.5}/>
        </div>
        <span style={{ fontSize:'15px', fontWeight:800, color:'var(--text)', letterSpacing:'-0.3px', whiteSpace:'nowrap' }}>
          Rafi's Life Planner
        </span>
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
