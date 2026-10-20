import { useState } from 'react'
import { Download } from 'lucide-react'
import { dataAwal } from './data.js'
import { dataSah } from './store.js'
import { unduhBerkas } from './util.js'
import { TombolYakin } from './ui.jsx'

export default function Data({ db, ubahProfil, ganti }) {
  const [pesan, setPesan] = useState('')
  const p = db.profil
  const ubah = (k) => (e) => ubahProfil({ [k]: e.target.value })

  const ekspor = () => {
    const tgl = new Date().toISOString().slice(0, 10)
    unduhBerkas(`rafiberfilsafat-konten-${tgl}.json`, JSON.stringify(db, null, 2), 'application/json')
    setPesan('Cadangan JSON terunduh.')
  }

  const impor = (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const r = new FileReader()
    r.onload = () => {
      try {
        const d = JSON.parse(r.result)
        if (!dataSah(d)) throw new Error('berkas tidak berisi daftar konten')
        ganti(d)
        setPesan(`${d.konten.length} konten berhasil diimpor.`)
      } catch (err) {
        setPesan(`Gagal mengimpor: ${err.message}`)
      }
    }
    r.readAsText(file)
  }

  return (
    <>
      <div className="card">
        <div className="card-head">
          <div>
            <h2>Profil</h2>
            <p>Username dipakai di kepala slide carousel. Nama dan bio hanya sebagai pengingat.</p>
          </div>
        </div>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="p-handle">Username</label>
            <input id="p-handle" value={p.handle} onChange={ubah('handle')} />
          </div>
          <div className="field">
            <label htmlFor="p-nama">Nama tampilan</label>
            <input id="p-nama" value={p.nama} onChange={ubah('nama')} />
          </div>
          <div className="field lebar">
            <label htmlFor="p-bio">Bio <span>{p.bio.length}/80</span></label>
            <input id="p-bio" value={p.bio} onChange={ubah('bio')} />
          </div>
          <div className="field">
            <label htmlFor="p-target">Target unggahan per minggu</label>
            <input id="p-target" type="number" min="1" max="21" value={p.targetMingguan}
                   onChange={ubah('targetMingguan')} />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <div>
            <h2>Cadangan data</h2>
            <p>
              Semua data tersimpan di browser ini saja. Ekspor ke JSON secara berkala, dan pakai
              impor untuk memindahkannya ke perangkat lain. Impor menggantikan semua data yang ada.
            </p>
          </div>
        </div>
        <div className="aksi-baris">
          <button type="button" className="pill utama" onClick={ekspor}><Download size={16} /> Ekspor JSON</button>
          <label className="pill">
            Impor JSON
            <input type="file" accept="application/json,.json" onChange={impor} hidden />
          </label>
          <TombolYakin
            yakin="Yakin? Semua data diganti contoh"
            onYakin={() => { ganti(dataAwal()); setPesan('Data dikembalikan ke contoh awal.') }}
          >
            Kembalikan ke contoh awal
          </TombolYakin>
        </div>
        {pesan && <p className="footnote" role="status">{pesan}</p>}
      </div>
    </>
  )
}
