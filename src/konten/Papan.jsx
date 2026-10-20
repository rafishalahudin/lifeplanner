import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { FORMAT, PILAR, STATUS } from './data.js'
import { labelFormat, labelPilar, tglPendek } from './util.js'
import { linkKonten } from './ui.jsx'

function KeseimbanganPilar({ konten }) {
  const total = konten.length || 1

  return (
    <div className="card">
      <div className="card-head">
        <div>
          <h2>Keseimbangan pilar</h2>
          <p>Porsi semua konten di papan dibandingkan target rencana awal.</p>
        </div>
      </div>
      <div className="pilar-list">
        {PILAR.map((p) => {
          const n = konten.filter((k) => k.pilar === p.id).length
          const persen = Math.round((n / total) * 100)
          return (
            <div className="pilar-row" key={p.id}>
              <div className="pilar-nama">
                <span className={`dot pilar-${p.id}`} />
                {p.label}
              </div>
              <div className="pilar-bar" role="img" aria-label={`${persen}% dari target ${p.target}%`}>
                <span className={`isi pilar-${p.id}`} style={{ width: `${persen}%` }} />
                <span className="target" style={{ left: `${p.target}%` }} />
              </div>
              <div className="pilar-angka">
                <strong>{persen}%</strong> <span>/ {p.target}%</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Kartu({ k, ubah }) {
  const i = STATUS.findIndex((s) => s.id === k.status)
  const geser = (d) => ubah(k.id, { status: STATUS[i + d].id })

  return (
    <article className="kartu">
      <Link className="kartu-link" to={linkKonten(k.id)}>
        <div className="kartu-meta">
          <span className={`tag format-${k.format}`}>{labelFormat(k.format)}</span>
          <span className={`dot pilar-${k.pilar}`} title={labelPilar(k.pilar)} />
        </div>
        <h3>{k.judul || 'Tanpa judul'}</h3>
        {k.hook && <p className="kartu-hook">{k.hook}</p>}
        {k.jadwal && <p className="kartu-jadwal">{tglPendek(k.jadwal)}</p>}
      </Link>
      <div className="kartu-aksi">
        <button type="button" className="ikon-btn" disabled={i <= 0} onClick={() => geser(-1)}
                aria-label={`Mundurkan "${k.judul}" ke ${STATUS[i - 1]?.label ?? ''}`}>
          <ChevronLeft size={16} />
        </button>
        <button type="button" className="ikon-btn" disabled={i >= STATUS.length - 1} onClick={() => geser(1)}
                aria-label={`Majukan "${k.judul}" ke ${STATUS[i + 1]?.label ?? ''}`}>
          <ChevronRight size={16} />
        </button>
      </div>
    </article>
  )
}

function TambahIde({ tambah }) {
  const [judul, setJudul] = useState('')

  const kirim = (e) => {
    e.preventDefault()
    const j = judul.trim()
    if (!j) return
    tambah({ judul: j, status: 'ide' })
    setJudul('')
  }

  return (
    <form className="tambah-ide" onSubmit={kirim}>
      <input
        value={judul}
        onChange={(e) => setJudul(e.target.value)}
        placeholder="Ide cepat, tekan Enter"
        aria-label="Judul ide baru"
      />
    </form>
  )
}

export default function Papan({ db, tambah, ubah }) {
  const [pilar, setPilar] = useState('')
  const [format, setFormat] = useState('')

  const tersaring = useMemo(
    () => db.konten.filter((k) => (!pilar || k.pilar === pilar) && (!format || k.format === format)),
    [db.konten, pilar, format],
  )

  return (
    <>
      <KeseimbanganPilar konten={db.konten} />

      <div className="saring">
        <label>
          Pilar
          <select value={pilar} onChange={(e) => setPilar(e.target.value)}>
            <option value="">Semua</option>
            {PILAR.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
        </label>
        <label>
          Format
          <select value={format} onChange={(e) => setFormat(e.target.value)}>
            <option value="">Semua</option>
            {FORMAT.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
          </select>
        </label>
      </div>

      <div className="papan">
        {STATUS.map((s) => {
          const isi = tersaring.filter((k) => k.status === s.id)
          return (
            <section className="kolom-status" key={s.id} aria-label={s.label}>
              <header>
                <h2>{s.label}</h2>
                <span className="hitung">{isi.length}</span>
              </header>
              {s.id === 'ide' && <TambahIde tambah={tambah} />}
              <div className="kartu-list">
                {isi.map((k) => <Kartu key={k.id} k={k} ubah={ubah} />)}
                {isi.length === 0 && <p className="kosong">Belum ada.</p>}
              </div>
            </section>
          )
        })}
      </div>
    </>
  )
}
