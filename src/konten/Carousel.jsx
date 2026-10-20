import { useEffect, useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import { ChevronDown, ChevronUp, Download, Plus, Trash2 } from 'lucide-react'
import { JENIS_SLIDE, slideBaru } from './data.js'
import { slug, tukar } from './util.js'

const W = 1080
const H = 1350 // 4:5, rasio portrait Instagram

const KAKI = { sampul: 'Geser →', penutup: 'Follow untuk renungan berikutnya 🪨' }

/* Satu kanvas 1080x1350. Font sengaja font sistem (Georgia dan kawan-kawan):
   html-to-image merender ulang node ini, dan font yang harus diunduh dulu
   berisiko belum siap saat ekspor. */
export function Kanvas({ s, i, n, tema, handle, innerRef }) {
  return (
    <div className={`kanvas ${tema} jenis-${s.jenis}`} ref={innerRef}>
      <div className="kv-atas">
        <span>@{handle}</span>
        <span>{i + 1}/{n}</span>
      </div>
      <div className="kv-isi">
        {s.jenis === 'kutipan' ? (
          <>
            <div className="kv-kutip">“{s.judul || 'Kutipan'}”</div>
            {s.isi && <div className="kv-sumber">— {s.isi}</div>}
          </>
        ) : (
          <>
            <div className="kv-judul">{s.judul || 'Judul slide'}</div>
            {s.isi && <div className="kv-teks">{s.isi}</div>}
          </>
        )}
      </div>
      <div className="kv-bawah">{KAKI[s.jenis] ?? '🪨'}</div>
    </div>
  )
}

/* Pratinjau: kanvas ukuran asli yang diperkecil mengikuti lebar wadahnya. */
function Skala({ children }) {
  const ref = useRef(null)
  const [s, setS] = useState(0.3)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const ro = new ResizeObserver(([e]) => setS(e.contentRect.width / W))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div className="skala" ref={ref}>
      <div className="skala-isi" style={{ transform: `scale(${s})` }}>{children}</div>
    </div>
  )
}

export default function Carousel({ k, ubah, handle }) {
  const [status, setStatus] = useState('')
  const stage = useRef([])
  const slide = k.slide
  const n = slide.length

  const setSlide = (baru) => ubah(k.id, { slide: baru })
  const ubahSlide = (i, kolom) => (e) =>
    setSlide(slide.map((s, j) => (j === i ? { ...s, [kolom]: e.target.value } : s)))

  const unduhSatu = async (i) => {
    const node = stage.current[i]
    if (!node) return
    const url = await toPng(node, { width: W, height: H, pixelRatio: 1, cacheBust: true })
    const a = document.createElement('a')
    a.href = url
    a.download = `${slug(k.judul)}-${String(i + 1).padStart(2, '0')}.png`
    a.click()
  }

  const unduhSemua = async () => {
    try {
      for (let i = 0; i < n; i += 1) {
        setStatus(`Mengekspor slide ${i + 1} dari ${n}…`)
        await unduhSatu(i)
        await new Promise((r) => setTimeout(r, 250))
      }
      setStatus(`${n} slide terunduh.`)
    } catch (err) {
      setStatus(`Gagal mengekspor: ${err.message}`)
    }
    setTimeout(() => setStatus(''), 4000)
  }

  return (
    <div className="carousel">
      <div className="aksi-baris">
        <label className="inline-field">
          Tema
          <select value={k.tema} onChange={(e) => ubah(k.id, { tema: e.target.value })}>
            <option value="gelap">Gelap</option>
            <option value="terang">Terang</option>
          </select>
        </label>
        <span className="spacer" />
        <button type="button" className="pill utama" disabled={n === 0} onClick={unduhSemua}>
          <Download size={16} /> Unduh {n} slide PNG
        </button>
      </div>
      {status && <p className="footnote" role="status">{status}</p>}

      <ol className="slide-list">
        {slide.map((s, i) => (
          <li className="slide-baris" key={s.id}>
            <div className="slide-form">
              <div className="adegan-kepala">
                <span className="adegan-no">Slide {i + 1}</span>
                <select value={s.jenis} onChange={ubahSlide(i, 'jenis')} aria-label={`Jenis slide ${i + 1}`}>
                  {JENIS_SLIDE.map((j) => <option key={j.id} value={j.id}>{j.label}</option>)}
                </select>
                <span className="spacer" />
                <button type="button" className="ikon-btn" disabled={i === 0} onClick={() => setSlide(tukar(slide, i, -1))}
                        aria-label={`Naikkan slide ${i + 1}`}><ChevronUp size={16} /></button>
                <button type="button" className="ikon-btn" disabled={i === n - 1} onClick={() => setSlide(tukar(slide, i, 1))}
                        aria-label={`Turunkan slide ${i + 1}`}><ChevronDown size={16} /></button>
                <button type="button" className="ikon-btn bahaya" onClick={() => setSlide(slide.filter((_, j) => j !== i))}
                        aria-label={`Hapus slide ${i + 1}`}><Trash2 size={16} /></button>
              </div>
              <div className="field">
                <label htmlFor={`s-${s.id}-judul`}>{s.jenis === 'kutipan' ? 'Kutipan' : 'Judul'}</label>
                <textarea id={`s-${s.id}-judul`} rows="2" value={s.judul} onChange={ubahSlide(i, 'judul')} />
              </div>
              <div className="field">
                <label htmlFor={`s-${s.id}-isi`}>{s.jenis === 'kutipan' ? 'Sumber' : 'Isi'}</label>
                <textarea id={`s-${s.id}-isi`} rows="3" value={s.isi} onChange={ubahSlide(i, 'isi')} />
              </div>
              <button type="button" className="tautan" onClick={() => unduhSatu(i)}>Unduh PNG slide ini</button>
            </div>
            <div className="slide-pratinjau">
              <Skala><Kanvas s={s} i={i} n={n} tema={k.tema} handle={handle} /></Skala>
            </div>
          </li>
        ))}
      </ol>

      <button type="button" className="pill" onClick={() => setSlide([...slide, slideBaru()])}>
        <Plus size={16} /> Tambah slide
      </button>

      <p className="footnote">
        Ekspor dirender pada 1080&times;1350 (rasio 4:5). Kalau teks terpotong di pratinjau,
        kalimatnya terlalu panjang untuk satu slide: pecah jadi dua slide.
      </p>

      {/* panggung ekspor: ukuran asli, di luar layar */}
      <div className="export-stage" aria-hidden="true">
        {slide.map((s, i) => (
          <Kanvas key={s.id} s={s} i={i} n={n} tema={k.tema} handle={handle}
                  innerRef={(el) => { stage.current[i] = el }} />
        ))}
      </div>
    </div>
  )
}
