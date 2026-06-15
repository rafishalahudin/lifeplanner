import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Heart, Target, BookOpen, Settings, Wallet } from 'lucide-react'
import { useIsMobile } from '../hooks/useIsMobile'

const NAV = [
  { to: '/dashboard', label: 'Home',     icon: LayoutDashboard },
  { to: '/wedding',   label: 'Wedding',  icon: Heart           },
  { to: '/life',      label: 'Life',     icon: Target          },
  { to: '/journal',   label: 'Journal',  icon: BookOpen        },
  { to: '/finance',   label: 'Finance',  icon: Wallet          },
  { to: '/settings',  label: 'Settings', icon: Settings        },
]

export default function BottomNav() {
  const isMobile = useIsMobile()
  if (!isMobile) return null

  return (
    <nav className="bottom-nav">
      {NAV.map(({ to, label, icon: Icon }) => (
        <NavLink key={to} to={to}
          className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
          <Icon size={20} strokeWidth={1.9} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
