import { FORMAT, PILAR, STATUS } from './data.js'

export const labelStatus = (id) => STATUS.find((s) => s.id === id)?.label ?? id
export const labelFormat = (id) => FORMAT.find((s) => s.id === id)?.label ?? id
export const labelPilar  = (id) => PILAR.find((s) => s.id === id)?.label ?? id

export const angka = (v) => {
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

export const nf = (n) => angka(n).toLocaleString('id-ID')

export function tglPendek(str) {
  if (!str) return ''
  const d = new Date(str)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' }) +
    (str.includes('T') ? `, ${d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}` : '')
}

export function awalMinggu(d) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7)) // Senin
  return x
}

/* Sekitar 140 kata per menit untuk bicara pelan dan reflektif. */
export function perkiraanDetik(adegan) {
  const kata = adegan
    .map((a) => a.ucapan.trim())
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length
  return Math.round(kata / 2.33)
}

export const slug = (s) =>
  (s || 'konten').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'konten'

export function unduhBerkas(nama, isi, tipe) {
  const url = URL.createObjectURL(new Blob([isi], { type: tipe }))
  const a = document.createElement('a')
  a.href = url
  a.download = nama
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/* Salinan array dengan elemen i dan i + d ditukar. */
export function tukar(arr, i, d) {
  const baru = [...arr]
  const x = baru[i]
  baru[i] = baru[i + d]
  baru[i + d] = x
  return baru
}
