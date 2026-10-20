import { Link } from 'react-router-dom'
import { METRIK } from './data.js'
import { angka, labelFormat, nf, tglPendek } from './util.js'
import { linkKonten } from './ui.jsx'

/* Rasio simpan per tayangan: sinyal terkuat bahwa konten filsafat
   benar-benar dianggap berguna, bukan sekadar lewat di FYP. */
const rasioSimpan = (m) => (angka(m.tayangan) ? (angka(m.simpan) / angka(m.tayangan)) * 100 : 0)

export default function Kinerja({ db }) {
  const tayang = db.konten
    .filter((k) => k.status === 'tayang')
    .sort((a, b) => angka(b.metrik.tayangan) - angka(a.metrik.tayangan))

  const total = Object.fromEntries(
    METRIK.map((m) => [m.id, tayang.reduce((s, k) => s + angka(k.metrik[m.id]), 0)]),
  )

  if (tayang.length === 0) {
    return (
      <div className="card">
        <div className="card-head">
          <div>
            <h2>Belum ada konten yang tayang</h2>
            <p>
              Pindahkan konten ke kolom Tayang di papan, lalu isi angka tayangan, suka, komentar,
              simpan, dan bagikan di halaman kontennya. Tabel kinerja muncul di sini.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="kpi-row">
        {METRIK.map((m) => (
          <div className="kpi" key={m.id}>
            <span className="kpi-label">{m.label}</span>
            <span className="kpi-nilai">{nf(total[m.id])}</span>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-head">
          <div>
            <h2>Per konten</h2>
            <p>Diurutkan dari tayangan terbanyak. Rasio simpan = simpan dibagi tayangan.</p>
          </div>
        </div>
        <div className="tabel-wrap">
          <table className="tabel">
            <thead>
              <tr>
                <th scope="col">Konten</th>
                <th scope="col">Tayang</th>
                {METRIK.map((m) => <th scope="col" className="num" key={m.id}>{m.label}</th>)}
                <th scope="col" className="num">Rasio simpan</th>
              </tr>
            </thead>
            <tbody>
              {tayang.map((k) => (
                <tr key={k.id}>
                  <td>
                    <Link to={linkKonten(k.id)}>{k.judul || 'Tanpa judul'}</Link>
                    <span className="sel-sub">{labelFormat(k.format)}</span>
                  </td>
                  <td className="nowrap">{tglPendek(k.jadwal) || '–'}</td>
                  {METRIK.map((m) => <td className="num" key={m.id}>{nf(k.metrik[m.id])}</td>)}
                  <td className="num">{rasioSimpan(k.metrik).toLocaleString('id-ID', { maximumFractionDigits: 2 })}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
