import { Link } from 'react-router-dom'
import { awalMinggu, labelFormat, labelStatus, tglPendek } from './util.js'
import { linkKonten } from './ui.jsx'

const tglHari = (d) => d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })

function Baris({ k }) {
  return (
    <li>
      <Link className="jadwal-item" to={linkKonten(k.id)}>
        <span className="jadwal-waktu">{tglPendek(k.jadwal) || 'Belum dijadwalkan'}</span>
        <span className="jadwal-judul">{k.judul || 'Tanpa judul'}</span>
        <span className={`tag format-${k.format}`}>{labelFormat(k.format)}</span>
        <span className={`tag status-${k.status}`}>{labelStatus(k.status)}</span>
      </Link>
    </li>
  )
}

export default function Jadwal({ db }) {
  const target = Number(db.profil.targetMingguan) || 3
  const kini = new Date()
  const mulai = awalMinggu(kini)

  const terjadwal = db.konten
    .filter((k) => k.jadwal && !Number.isNaN(new Date(k.jadwal).getTime()))
    .sort((a, b) => new Date(a.jadwal) - new Date(b.jadwal))

  const terlewat = terjadwal.filter((k) => new Date(k.jadwal) < kini && k.status !== 'tayang')
  const belum = db.konten.filter((k) => !k.jadwal && ['naskah', 'produksi', 'siap'].includes(k.status))

  const minggu = Array.from({ length: 4 }, (_, i) => {
    const awal = new Date(mulai)
    awal.setDate(awal.getDate() + i * 7)
    const akhir = new Date(awal)
    akhir.setDate(akhir.getDate() + 7)
    const isi = terjadwal.filter((k) => {
      const t = new Date(k.jadwal)
      return t >= awal && t < akhir
    })
    const sampai = new Date(akhir)
    sampai.setDate(sampai.getDate() - 1)
    return { awal, sampai, isi, label: i === 0 ? 'Minggu ini' : i === 1 ? 'Minggu depan' : `${i} minggu lagi` }
  })

  return (
    <>
      {terlewat.length > 0 && (
        <div className="card peringatan">
          <div className="card-head">
            <div>
              <h2>Lewat jadwal, belum tayang</h2>
              <p>Tayangkan, atau geser jadwalnya supaya ritme tetap rapi.</p>
            </div>
          </div>
          <ul className="jadwal-list">{terlewat.map((k) => <Baris key={k.id} k={k} />)}</ul>
        </div>
      )}

      {minggu.map((m) => {
        const cukup = m.isi.length >= target
        return (
          <div className="card" key={m.awal.toISOString()}>
            <div className="card-head">
              <div>
                <h2>{m.label}</h2>
                <p>{tglHari(m.awal)} sampai {tglHari(m.sampai)}</p>
              </div>
              <span className="spacer" />
              <span className={`tag ${cukup ? 'tag-baik' : 'tag-kurang'}`}>
                {m.isi.length} / {target} unggahan
              </span>
            </div>
            {m.isi.length > 0
              ? <ul className="jadwal-list">{m.isi.map((k) => <Baris key={k.id} k={k} />)}</ul>
              : <p className="kosong">Belum ada yang dijadwalkan.</p>}
          </div>
        )
      })}

      <div className="card">
        <div className="card-head">
          <div>
            <h2>Sedang dikerjakan, belum dijadwalkan</h2>
            <p>Konten berstatus Naskah, Rekam & edit, atau Siap tayang tanpa tanggal.</p>
          </div>
        </div>
        {belum.length > 0
          ? <ul className="jadwal-list">{belum.map((k) => <Baris key={k.id} k={k} />)}</ul>
          : <p className="kosong">Semua sudah punya jadwal.</p>}
      </div>
    </>
  )
}
