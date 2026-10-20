import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react'
import { SFX, adeganBaru } from './data.js'
import { perkiraanDetik, tukar } from './util.js'

const KOLOM = [
  { id: 'waktu',  label: 'Waktu (dtk)',   tipe: 'input', ph: '0-4' },
  { id: 'ucapan', label: 'Ucapan',        tipe: 'area',  ph: 'Apa yang kamu katakan' },
  { id: 'teks',   label: 'Teks di layar', tipe: 'area',  ph: 'Teks yang muncul' },
  { id: 'visual', label: 'Visual',        tipe: 'area',  ph: 'Wajah, lukisan, b-roll…' },
  { id: 'audio',  label: 'Audio / SFX',   tipe: 'input', ph: 'Kata kunci SFX', daftar: 'daftar-sfx' },
]

export default function Storyboard({ adegan, setAdegan }) {
  const ubah = (i, kolom) => (e) =>
    setAdegan(adegan.map((a, j) => (j === i ? { ...a, [kolom]: e.target.value } : a)))

  const sisip = (i) => {
    const baru = [...adegan]
    baru.splice(i + 1, 0, adeganBaru())
    setAdegan(baru)
  }

  const detik = perkiraanDetik(adegan)

  return (
    <div className="storyboard">
      <datalist id="daftar-sfx">
        {SFX.map((s) => <option key={s} value={s} />)}
      </datalist>

      <p className="footnote">
        {adegan.length} adegan &middot; perkiraan durasi bicara <strong>±{detik} detik</strong>
        {detik > 75 && ' — di atas 75 detik, pertimbangkan memotong satu bagian.'}
      </p>

      <ol className="adegan-list">
        {adegan.map((a, i) => (
          <li className="adegan" key={a.id}>
            <div className="adegan-kepala">
              <span className="adegan-no">#{i + 1}</span>
              <span className="spacer" />
              <button type="button" className="ikon-btn" disabled={i === 0} onClick={() => setAdegan(tukar(adegan, i, -1))}
                      aria-label={`Naikkan adegan ${i + 1}`}><ChevronUp size={16} /></button>
              <button type="button" className="ikon-btn" disabled={i === adegan.length - 1} onClick={() => setAdegan(tukar(adegan, i, 1))}
                      aria-label={`Turunkan adegan ${i + 1}`}><ChevronDown size={16} /></button>
              <button type="button" className="ikon-btn" onClick={() => sisip(i)}
                      aria-label={`Sisipkan adegan setelah ${i + 1}`}><Plus size={16} /></button>
              <button type="button" className="ikon-btn bahaya" onClick={() => setAdegan(adegan.filter((_, j) => j !== i))}
                      aria-label={`Hapus adegan ${i + 1}`}><Trash2 size={16} /></button>
            </div>
            <div className="adegan-isi">
              {KOLOM.map((k) => {
                const id = `adegan-${a.id}-${k.id}`
                return (
                  <div className={`field f-${k.id}`} key={k.id}>
                    <label htmlFor={id}>{k.label}</label>
                    {k.tipe === 'area'
                      ? <textarea id={id} rows="2" value={a[k.id]} onChange={ubah(i, k.id)} placeholder={k.ph} />
                      : <input id={id} value={a[k.id]} onChange={ubah(i, k.id)} placeholder={k.ph} list={k.daftar} />}
                  </div>
                )
              })}
            </div>
          </li>
        ))}
      </ol>

      <button type="button" className="pill" onClick={() => setAdegan([...adegan, adeganBaru()])}>
        <Plus size={16} /> Tambah adegan
      </button>
    </div>
  )
}
