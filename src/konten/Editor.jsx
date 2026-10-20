import { useCallback, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, Clapperboard, Copy, Trash2 } from 'lucide-react'
import { FORMAT, METRIK, PILAR, STATUS } from './data.js'
import { labelStatus } from './util.js'
import Carousel from './Carousel.jsx'
import ModeRekam from './ModeRekam.jsx'
import Storyboard from './Storyboard.jsx'
import { TombolYakin } from './ui.jsx'

export default function Editor({ k, ubah, hapus, handle }) {
  const navigate = useNavigate()
  const [rekam, setRekam] = useState(false)
  const [pesan, setPesan] = useState('')
  const tutupRekam = useCallback(() => setRekam(false), [])

  const set = (kolom) => (e) => ubah(k.id, { [kolom]: e.target.value })
  const setMetrik = (kolom) => (e) =>
    ubah(k.id, (lama) => ({ metrik: { ...lama.metrik, [kolom]: e.target.value } }))

  const salinCaption = async () => {
    const teks = [k.caption.trim(), k.hashtag.trim()].filter(Boolean).join('\n\n')
    try {
      await navigator.clipboard.writeText(teks)
      setPesan('Caption dan hashtag tersalin.')
    } catch {
      setPesan('Browser menolak akses clipboard. Salin manual dari kolomnya.')
    }
    setTimeout(() => setPesan(''), 3000)
  }

  const jumlahHashtag = (k.hashtag.match(/#[^\s#]+/g) || []).length
  const diubah = new Date(k.diubah).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })

  return (
    <>
      <div className="aksi-baris">
        <Link className="pill" to="/konten"><ChevronLeft size={16} /> Papan</Link>
        <span className="editor-info">{labelStatus(k.status)} · diubah {diubah}</span>
        <span className="spacer" />
        {k.format === 'video' && (
          <button type="button" className="pill utama" disabled={k.adegan.length === 0} onClick={() => setRekam(true)}>
            <Clapperboard size={16} /> Mode rekam
          </button>
        )}
        <TombolYakin yakin="Yakin hapus?" onYakin={() => { hapus(k.id); navigate('/konten') }}>
          <Trash2 size={16} /> Hapus
        </TombolYakin>
      </div>

      <div className="card">
        <div className="form-grid">
          <div className="field lebar">
            <label htmlFor="e-judul">Judul</label>
            <input id="e-judul" className="input-judul" value={k.judul} onChange={set('judul')}
                   placeholder="Judul kerja konten ini" />
          </div>
          <div className="field">
            <label htmlFor="e-status">Status</label>
            <select id="e-status" value={k.status} onChange={set('status')}>
              {STATUS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="e-jadwal">Jadwal tayang</label>
            <input id="e-jadwal" type="datetime-local" value={k.jadwal} onChange={set('jadwal')} />
          </div>
          <div className="field">
            <label htmlFor="e-format">Format</label>
            <select id="e-format" value={k.format} onChange={set('format')}>
              {FORMAT.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="e-pilar">Pilar</label>
            <select id="e-pilar" value={k.pilar} onChange={set('pilar')}>
              {PILAR.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>
          </div>
          <div className="field lebar">
            <label htmlFor="e-hook">Hook <span>kalimat 3 detik pertama</span></label>
            <textarea id="e-hook" rows="2" value={k.hook} onChange={set('hook')} />
          </div>
        </div>
      </div>

      {k.format === 'video' ? (
        <div className="card">
          <div className="card-head">
            <div>
              <h2>Storyboard</h2>
              <p>Satu baris per potongan rekaman. Kolom audio menyarankan kata kunci SFX.</p>
            </div>
          </div>
          <div className="field">
            <label htmlFor="e-musik">Musik latar</label>
            <input id="e-musik" value={k.musik} onChange={set('musik')}
                   placeholder="Mis. ambient piano melancholic, volume 10-15%" />
          </div>
          <Storyboard adegan={k.adegan} setAdegan={(adegan) => ubah(k.id, { adegan })} />
        </div>
      ) : (
        <div className="card">
          <div className="card-head">
            <div>
              <h2>Slide carousel</h2>
              <p>Isi teksnya, pratinjau ikut berubah, lalu unduh sebagai PNG siap unggah.</p>
            </div>
          </div>
          <Carousel k={k} ubah={ubah} handle={handle} />
        </div>
      )}

      <div className="card">
        <div className="card-head">
          <div>
            <h2>Caption & hashtag</h2>
          </div>
          <span className="spacer" />
          <button type="button" className="pill" onClick={salinCaption}><Copy size={16} /> Salin</button>
        </div>
        {pesan && <p className="footnote" role="status">{pesan}</p>}
        <div className="field">
          <label htmlFor="e-caption">Caption <span>{k.caption.length} karakter</span></label>
          <textarea id="e-caption" rows="4" value={k.caption} onChange={set('caption')} />
        </div>
        <div className="field">
          <label htmlFor="e-hashtag">Hashtag <span>{jumlahHashtag} hashtag</span></label>
          <textarea id="e-hashtag" rows="2" value={k.hashtag} onChange={set('hashtag')} />
        </div>
        <div className="field">
          <label htmlFor="e-catatan">Catatan</label>
          <textarea id="e-catatan" rows="3" value={k.catatan} onChange={set('catatan')} />
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <div>
            <h2>Kinerja</h2>
            <p>Isi setelah tayang, misalnya 48 jam dan 7 hari kemudian. Muncul di tab Kinerja.</p>
          </div>
        </div>
        <div className="metrik-grid">
          {METRIK.map((m) => (
            <div className="field" key={m.id}>
              <label htmlFor={`e-m-${m.id}`}>{m.label}</label>
              <input id={`e-m-${m.id}`} type="number" min="0" inputMode="numeric"
                     value={k.metrik[m.id]} onChange={setMetrik(m.id)} />
            </div>
          ))}
        </div>
      </div>

      {rekam && <ModeRekam judul={k.judul} adegan={k.adegan} tutup={tutupRekam} />}
    </>
  )
}
