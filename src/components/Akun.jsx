import { useEffect, useRef, useState } from 'react'
import { LogIn, LogOut, User } from 'lucide-react'
import { keluar, masuk, useSinkron } from '../sync'

const LABEL_STATUS = {
  memuat:     'Memuat…',
  menyinkron: 'Menyinkronkan…',
  sinkron:    'Tersinkron',
  menyimpan:  'Menyimpan…',
  galat:      'Gagal sinkron, cek koneksi',
}

export default function Akun() {
  const { pengguna, status } = useSinkron()
  const [buka, setBuka] = useState(false)
  const [galat, setGalat] = useState('')
  const ref = useRef(null)

  useEffect(() => {
    if (!buka) return undefined
    const tutup = (e) => { if (!ref.current?.contains(e.target)) setBuka(false) }
    document.addEventListener('pointerdown', tutup)
    return () => document.removeEventListener('pointerdown', tutup)
  }, [buka])

  const klikMasuk = async () => {
    setGalat('')
    try {
      await masuk()
    } catch (err) {
      console.error('[akun] gagal masuk', err)
      setGalat('Gagal masuk. Coba lagi.')
    }
  }

  if (!pengguna) {
    return (
      <div className="akun" ref={ref}>
        <button className="akun-masuk" onClick={klikMasuk} disabled={status === 'memuat'}
                title={galat || 'Masuk dengan Google untuk sinkron antarperangkat'}>
          <LogIn size={15} strokeWidth={2} />
          {status === 'memuat' ? '…' : 'Masuk'}
        </button>
      </div>
    )
  }

  const nama = pengguna.displayName || pengguna.email || 'Akun'

  return (
    <div className="akun" ref={ref}>
      <button className="nav-avatar akun-avatar" onClick={() => setBuka((b) => !b)}
              aria-label={`Akun ${nama}, ${LABEL_STATUS[status] ?? ''}`} aria-expanded={buka}>
        {pengguna.photoURL
          ? <img src={pengguna.photoURL} alt="" referrerPolicy="no-referrer" />
          : <User size={16} color="white" strokeWidth={2} />}
        <span className={`akun-titik ${status}`} />
      </button>

      {buka && (
        <div className="akun-menu" role="menu">
          <div className="akun-nama">{nama}</div>
          {pengguna.email && <div className="akun-email">{pengguna.email}</div>}
          <div className={`akun-status ${status}`}>
            <span className={`akun-titik ${status}`} />
            {LABEL_STATUS[status] ?? status}
          </div>
          <button className="akun-keluar" role="menuitem" onClick={() => { setBuka(false); keluar() }}>
            <LogOut size={15} strokeWidth={2} />
            Keluar
          </button>
        </div>
      )}
    </div>
  )
}
