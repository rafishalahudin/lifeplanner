import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'

/* Tampilan baca saat merekam per adegan: ucapan besar di tengah,
   catatan teks layar dan audio kecil di bawah. Panah kiri/kanan untuk
   pindah, Esc untuk keluar. Dirender lewat portal ke body, supaya transform
   dari animasi halaman tidak membuat position: fixed ikut tergeser. */
export default function ModeRekam({ judul, adegan, tutup }) {
  const [i, setI] = useState(0)
  const n = adegan.length
  const a = adegan[i]

  useEffect(() => {
    const tombol = (e) => {
      if (e.key === 'Escape') tutup()
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        setI((x) => Math.min(x + 1, n - 1))
      }
      if (e.key === 'ArrowLeft') setI((x) => Math.max(x - 1, 0))
    }
    window.addEventListener('keydown', tombol)
    const lama = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', tombol)
      document.body.style.overflow = lama
    }
  }, [n, tutup])

  if (!a) return null

  return createPortal(
    <div className="rbf rekam" role="dialog" aria-modal="true" aria-label={`Mode rekam: ${judul}`}>
      <div className="rekam-atas">
        <span>{judul}</span>
        <span>Adegan {i + 1} / {n}{a.waktu && ` · ${a.waktu} dtk`}</span>
        <button type="button" className="pill" onClick={tutup}>Tutup</button>
      </div>

      <div className="rekam-tengah">
        <p className="rekam-ucapan">{a.ucapan || '(tanpa ucapan)'}</p>
      </div>

      <div className="rekam-catatan">
        {a.teks && <div><span>Teks layar</span>{a.teks}</div>}
        {a.visual && <div><span>Visual</span>{a.visual}</div>}
        {a.audio && <div><span>Audio</span>{a.audio}</div>}
      </div>

      <div className="rekam-bawah">
        <button type="button" className="pill" disabled={i === 0} onClick={() => setI(i - 1)}>
          <ChevronLeft size={16} /> Sebelumnya
        </button>
        <div className="rekam-titik" aria-hidden="true">
          {adegan.map((x, j) => <span key={x.id} className={j === i ? 'aktif' : ''} />)}
        </div>
        <button type="button" className="pill utama" disabled={i === n - 1} onClick={() => setI(i + 1)}>
          Berikutnya <ChevronRight size={16} />
        </button>
      </div>
    </div>,
    document.body,
  )
}
