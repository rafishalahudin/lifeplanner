import { useSyncExternalStore } from 'react'
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signInWithRedirect, signOut } from 'firebase/auth'
import { collection, doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth, db } from './firebase'

/*
  Sinkronisasi localStorage <-> Firestore.

  localStorage tetap sumber baca utama (cepat, jalan offline). Setiap kunci
  di bawah disalin ke users/{uid}/simpanan/{kunci} sebagai string JSON.
  Kunci di luar daftar ini tidak pernah dikirim: origin github.io dipakai
  bersama repo lain, dan ucapan tamu di Undangan bukan milik akun ini.

  Aturan saat login: kunci yang sudah ada di cloud -> versi cloud dipakai;
  kunci yang belum ada di cloud -> versi lokal diunggah. Setelah itu
  perubahan terakhir yang menang.
*/
export const KUNCI_SINKRON = [
  'dashboard-tasks',
  'wedding',
  'life-plan',
  'habits-v1',
  'journal-v2',
  'finance-v1',
  'toefl-v1',
  'rbf-cms-v1',
]

const JEDA_KIRIM = 800 // ms; mengetik di form tidak perlu satu tulisan per huruf

let pengguna = null
let status = 'memuat' // memuat | keluar | menyinkron | sinkron | menyimpan | galat
let siap = false      // snapshot cloud pertama sudah diterima
let berhentiDengar = null
let ditolak = null    // email akun yang baru saja ditolak Firestore Rules

const diCloud = new Map()   // kunci -> string JSON terakhir yang diketahui ada di cloud
const antrean = new Map()   // kunci -> { timer, teks }
const pendengar = new Map() // kunci -> Set(fn)
const pemantauStatus = new Set()

function setStatus(s) {
  status = s
  pemantauStatus.forEach((fn) => fn())
}

const refKunci = (kunci) => doc(db, 'users', pengguna.uid, 'simpanan', kunci)

function terapkanDariCloud(kunci, teks) {
  diCloud.set(kunci, teks)
  try { localStorage.setItem(kunci, teks) } catch {}
  let nilai
  try { nilai = JSON.parse(teks) } catch { return }
  pendengar.get(kunci)?.forEach((fn) => fn(nilai))
}

async function kirim(kunci, teks) {
  if (!pengguna) return
  setStatus('menyimpan')
  // dicatat sebelum await, supaya gema snapshot dari tulisan ini diabaikan
  const sebelumnya = diCloud.get(kunci)
  diCloud.set(kunci, teks)
  try {
    await setDoc(refKunci(kunci), { nilai: teks, diubah: serverTimestamp() })
    if (antrean.size === 0) setStatus('sinkron')
  } catch (err) {
    console.error('[sync] gagal menyimpan', kunci, err)
    if (diCloud.get(kunci) === teks) diCloud.set(kunci, sebelumnya)
    setStatus('galat')
  }
}

/* Dipanggil setiap kali data lokal berubah. */
export function simpanKeCloud(kunci, nilai) {
  if (!pengguna || !siap || !KUNCI_SINKRON.includes(kunci)) return
  const teks = JSON.stringify(nilai)
  if (diCloud.get(kunci) === teks) {
    // perubahan dibatalkan sebelum terkirim, atau ini gema dari cloud
    const lama = antrean.get(kunci)
    if (lama) { clearTimeout(lama.timer); antrean.delete(kunci) }
    return
  }

  const lama = antrean.get(kunci)
  if (lama) clearTimeout(lama.timer)
  const timer = setTimeout(() => {
    antrean.delete(kunci)
    kirim(kunci, teks)
  }, JEDA_KIRIM)
  antrean.set(kunci, { timer, teks })
  setStatus('menyimpan')
}

/* Daftar pendengar perubahan dari perangkat lain; mengembalikan fungsi berhenti. */
export function dengarCloud(kunci, fn) {
  if (!pendengar.has(kunci)) pendengar.set(kunci, new Set())
  pendengar.get(kunci).add(fn)
  return () => pendengar.get(kunci)?.delete(fn)
}

function mulaiDengar() {
  setStatus('menyinkron')
  siap = false
  diCloud.clear()

  berhentiDengar = onSnapshot(
    collection(db, 'users', pengguna.uid, 'simpanan'),
    (snap) => {
      snap.docChanges().forEach((ch) => {
        if (ch.type === 'removed' || ch.doc.metadata.hasPendingWrites) return
        const kunci = ch.doc.id
        if (!KUNCI_SINKRON.includes(kunci)) return
        const teks = ch.doc.data().nilai
        if (typeof teks !== 'string') return
        // tulisan kita sendiri yang baru dikonfirmasi server: lokal sudah sama
        const tertunda = antrean.get(kunci)
        if (tertunda) return
        if (diCloud.get(kunci) === teks) return
        terapkanDariCloud(kunci, teks)
      })

      if (!siap) {
        siap = true
        // kunci yang belum ada di cloud: unggah versi lokal
        const adaDiCloud = new Set(snap.docs.map((d) => d.id))
        KUNCI_SINKRON.forEach((kunci) => {
          if (adaDiCloud.has(kunci)) return
          let teks = null
          try { teks = localStorage.getItem(kunci) } catch {}
          if (teks) kirim(kunci, teks)
        })
        setStatus('sinkron')
      }
    },
    (err) => {
      // Rules hanya mengizinkan akun pemilik; akun lain langsung dikeluarkan.
      if (err?.code === 'permission-denied') {
        ditolak = pengguna?.email || 'Akun ini'
        signOut(auth)
        return
      }
      console.error('[sync] gagal mendengar', err)
      setStatus('galat')
    },
  )
}

/* Firebase butuh sesaat untuk memulihkan sesi saat halaman dimuat. Petunjuk
   ini mencatat bahwa perangkat ini terakhir dalam keadaan masuk, supaya
   aplikasi bisa langsung tampil tanpa sempat memperlihatkan halaman login.
   Hanya memengaruhi tampilan; akses data tetap dijaga Firestore Rules. */
const PETUNJUK = 'auth-petunjuk'

export function pernahMasuk() {
  try { return localStorage.getItem(PETUNJUK) === '1' } catch { return false }
}

onAuthStateChanged(auth, (u) => {
  try {
    if (u) localStorage.setItem(PETUNJUK, '1')
    else localStorage.removeItem(PETUNJUK)
  } catch {}
  berhentiDengar?.()
  berhentiDengar = null
  antrean.forEach(({ timer }) => clearTimeout(timer))
  antrean.clear()
  pengguna = u
  siap = false
  if (u) mulaiDengar()
  else setStatus('keluar')
})

export async function masuk() {
  ditolak = null
  setStatus(status)
  const provider = new GoogleAuthProvider()
  try {
    await signInWithPopup(auth, provider)
  } catch (err) {
    if (err?.code === 'auth/popup-blocked') return signInWithRedirect(auth, provider)
    if (err?.code !== 'auth/popup-closed-by-user' && err?.code !== 'auth/cancelled-popup-request') throw err
  }
}

export async function keluar() {
  // kirim yang masih tertunda sebelum memutus akun
  const tertunda = [...antrean.entries()]
  tertunda.forEach(([, { timer }]) => clearTimeout(timer))
  antrean.clear()
  await Promise.all(tertunda.map(([kunci, { teks }]) => kirim(kunci, teks)))
  await signOut(auth)
}

function langganan(fn) {
  pemantauStatus.add(fn)
  return () => pemantauStatus.delete(fn)
}

let potret = { pengguna, status, ditolak }
function ambil() {
  if (potret.pengguna !== pengguna || potret.status !== status || potret.ditolak !== ditolak) {
    potret = { pengguna, status, ditolak }
  }
  return potret
}

export function useSinkron() {
  return useSyncExternalStore(langganan, ambil)
}
