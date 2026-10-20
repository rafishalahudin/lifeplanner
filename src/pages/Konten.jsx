import { NavLink, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import { BarChart3, CalendarDays, Database, Kanban, Plus } from 'lucide-react'
import { useStore } from '../konten/store.js'
import { linkKonten } from '../konten/ui.jsx'
import Papan from '../konten/Papan.jsx'
import Jadwal from '../konten/Jadwal.jsx'
import Kinerja from '../konten/Kinerja.jsx'
import Data from '../konten/Data.jsx'
import Editor from '../konten/Editor.jsx'
import '../konten/konten.css'

const TABS = [
  { to: '/konten',         label: 'Papan',   icon: Kanban,       end: true },  // juga aktif di /konten/item/:id
  { to: '/konten/jadwal',  label: 'Jadwal',  icon: CalendarDays },
  { to: '/konten/kinerja', label: 'Kinerja', icon: BarChart3 },
  { to: '/konten/data',    label: 'Profil & data', icon: Database },
]

function EditorRoute({ store }) {
  const { id } = useParams()
  const k = store.db.konten.find((x) => x.id === id)

  if (!k) {
    return (
      <div className="card">
        <p>Konten ini mungkin sudah dihapus. <NavLink to="/konten">Kembali ke papan</NavLink>.</p>
      </div>
    )
  }

  return <Editor key={k.id} k={k} ubah={store.ubah} hapus={store.hapus} handle={store.db.profil.handle} />
}

export default function Konten() {
  const store = useStore()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { db } = store
  const diEditor = pathname.startsWith('/konten/item/')

  return (
    <div className="page rbf rbf-root">
      <div className="page-header rbf-header">
        <div>
          <h1 className="page-title">Konten @{db.profil.handle}</h1>
          <p className="page-subtitle">Ide, naskah, storyboard, carousel, jadwal, dan kinerja.</p>
        </div>
        <button type="button" className="pill utama" onClick={() => navigate(linkKonten(store.tambah()))}>
          <Plus size={16} /> Konten baru
        </button>
      </div>

      <nav className="rbf-tabs" aria-label="Bagian konten">
        {TABS.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => `rbf-tab${isActive || (diEditor && to === '/konten') ? ' active' : ''}`}>
            <Icon size={15} strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>

      {store.gagalSimpan && (
        <p className="banner" role="alert">
          Browser menolak menyimpan data. Perubahan bisa hilang saat halaman ditutup;
          ekspor JSON dari tab Profil & data.
        </p>
      )}

      <Routes>
        <Route index element={<Papan db={db} tambah={store.tambah} ubah={store.ubah} />} />
        <Route path="jadwal" element={<Jadwal db={db} />} />
        <Route path="kinerja" element={<Kinerja db={db} />} />
        <Route path="data" element={<Data db={db} ubahProfil={store.ubahProfil} ganti={store.ganti} />} />
        <Route path="item/:id" element={<EditorRoute store={store} />} />
      </Routes>
    </div>
  )
}
