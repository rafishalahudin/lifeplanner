import { NavLink } from 'react-router-dom'
import { TrendingUp } from 'lucide-react'
import PomodoroTimer from './PomodoroTimer'
import Akun from './Akun'

// Bar atas khusus HP; di desktop navigasi ada di Sidebar.
export default function TopNav() {
  return (
    <header className="topnav-mobile">
      <NavLink to="/dashboard" className="topnav-brand">
        <span className="side-logo"><TrendingUp size={14} color="white" strokeWidth={2.5} /></span>
        <span>Rafi's Life Planner</span>
      </NavLink>
      <PomodoroTimer />
      <Akun />
    </header>
  )
}
