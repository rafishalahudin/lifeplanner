import { NavLink } from 'react-router-dom'
import { PanelLeftClose, PanelLeftOpen, TrendingUp } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { GRUP_NAV, NAV_SETTINGS } from './navigasi'
import PomodoroTimer from './PomodoroTimer'
import Akun from './Akun'

function Item({ to, label, icon: Icon, ciut }) {
  return (
    <NavLink
      to={to}
      title={ciut ? label : undefined}
      className={({ isActive }) => `side-link${isActive ? ' active' : ''}`}
    >
      <Icon size={18} strokeWidth={1.9} />
      <span className="side-label">{label}</span>
    </NavLink>
  )
}

export default function Sidebar() {
  const [ciut, setCiut] = useLocalStorage('nav-ciut', false)

  return (
    <aside className={`sidebar${ciut ? ' sidebar--ciut' : ''}`} aria-label="Navigasi utama">
      <div className="side-atas">
        <NavLink to="/dashboard" className="side-brand" title="Rafi's Life Planner">
          <span className="side-logo"><TrendingUp size={15} color="white" strokeWidth={2.5} /></span>
          <span className="side-label side-judul">Rafi's Life Planner</span>
        </NavLink>
        <button
          type="button"
          className="side-ciut"
          onClick={() => setCiut((c) => !c)}
          aria-label={ciut ? 'Lebarkan sidebar' : 'Ciutkan sidebar'}
          title={ciut ? 'Lebarkan' : 'Ciutkan'}
        >
          {ciut ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
        </button>
      </div>

      <nav className="side-nav">
        {GRUP_NAV.map((g) => (
          <div className="side-grup" key={g.label}>
            <div className="side-grup-label">{g.label}</div>
            {g.items.map((it) => <Item key={it.to} {...it} ciut={ciut} />)}
          </div>
        ))}
      </nav>

      <div className="side-bawah">
        <Item {...NAV_SETTINGS} ciut={ciut} />
        <div className="side-alat">
          <Akun arah="atas" lengkap={!ciut} />
          <PomodoroTimer />
        </div>
      </div>
    </aside>
  )
}
