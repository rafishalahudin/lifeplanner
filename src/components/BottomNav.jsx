import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { MoreHorizontal, X } from 'lucide-react'
import { NAV_BAWAH, NAV_LAINNYA } from './navigasi'

export default function BottomNav() {
  const { pathname } = useLocation()
  const [buka, setBuka] = useState(false)
  const diLainnya = NAV_LAINNYA.some((i) => pathname.startsWith(i.to))

  // tutup lembar setiap kali pindah halaman
  useEffect(() => { setBuka(false) }, [pathname])

  useEffect(() => {
    if (!buka) return undefined
    const esc = (e) => { if (e.key === 'Escape') setBuka(false) }
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [buka])

  return (
    <>
      <nav className="bottom-nav" aria-label="Navigasi utama">
        {NAV_BAWAH.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
            <Icon size={21} strokeWidth={1.9} />
            <span>{label}</span>
          </NavLink>
        ))}
        <button
          type="button"
          className={`bottom-nav-item ${diLainnya || buka ? 'active' : ''}`}
          onClick={() => setBuka((b) => !b)}
          aria-expanded={buka}
        >
          <MoreHorizontal size={21} strokeWidth={1.9} />
          <span>Lainnya</span>
        </button>
      </nav>

      {buka && (
        <div className="lembar-latar" onClick={() => setBuka(false)}>
          <div className="lembar" role="dialog" aria-label="Menu lainnya" onClick={(e) => e.stopPropagation()}>
            <div className="lembar-kepala">
              <span>Menu lainnya</span>
              <button type="button" className="lembar-tutup" onClick={() => setBuka(false)} aria-label="Tutup">
                <X size={18} />
              </button>
            </div>
            <div className="lembar-grid">
              {NAV_LAINNYA.map(({ to, label, icon: Icon }) => (
                <NavLink key={to} to={to}
                  className={({ isActive }) => `lembar-item ${isActive ? 'active' : ''}`}>
                  <span className="lembar-ikon"><Icon size={20} strokeWidth={1.9} /></span>
                  {label}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
