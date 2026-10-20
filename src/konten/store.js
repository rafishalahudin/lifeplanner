import { useCallback, useEffect, useState } from 'react'
import { PROFIL_AWAL, dataAwal, kontenBaru } from './data.js'
import { dengarCloud, simpanKeCloud } from '../sync'

const KUNCI = 'rbf-cms-v1'

export function dataSah(d) {
  return d && typeof d === 'object' && Array.isArray(d.konten)
}

/* Isi yang hilang dilengkapi dari bentuk baku, supaya data lama atau hasil
   impor yang kurang kolom tidak membuat komponen membaca undefined. */
export function rapikan(d) {
  return {
    versi: 1,
    profil: { ...PROFIL_AWAL, ...(d.profil || {}) },
    konten: d.konten.map((k) => {
      const baku = kontenBaru()
      return { ...baku, ...k, id: k.id || baku.id, metrik: { ...baku.metrik, ...(k.metrik || {}) } }
    }),
  }
}

function muat() {
  try {
    const t = localStorage.getItem(KUNCI)
    if (t) {
      const d = JSON.parse(t)
      if (dataSah(d)) return rapikan(d)
    }
  } catch { /* localStorage tidak tersedia atau isinya rusak: mulai dari contoh */ }
  return dataAwal()
}

export function useStore() {
  const [db, setDb] = useState(muat)
  const [gagalSimpan, setGagalSimpan] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(KUNCI, JSON.stringify(db))
      setGagalSimpan(false)
    } catch {
      setGagalSimpan(true)
    }
    simpanKeCloud(KUNCI, db)
  }, [db])

  // perubahan dari perangkat lain (lewat Firestore)
  useEffect(() => dengarCloud(KUNCI, (d) => { if (dataSah(d)) setDb(rapikan(d)) }), [])

  const tambah = useCallback((awal) => {
    const k = kontenBaru(awal)
    setDb((d) => ({ ...d, konten: [k, ...d.konten] }))
    return k.id
  }, [])

  /* patch boleh objek atau fungsi (konten lama) => objek. */
  const ubah = useCallback((id, patch) => {
    setDb((d) => ({
      ...d,
      konten: d.konten.map((k) =>
        k.id === id
          ? { ...k, ...(typeof patch === 'function' ? patch(k) : patch), diubah: new Date().toISOString() }
          : k,
      ),
    }))
  }, [])

  const hapus = useCallback((id) => {
    setDb((d) => ({ ...d, konten: d.konten.filter((k) => k.id !== id) }))
  }, [])

  const ubahProfil = useCallback((patch) => {
    setDb((d) => ({ ...d, profil: { ...d.profil, ...patch } }))
  }, [])

  const ganti = useCallback((dbBaru) => setDb(rapikan(dbBaru)), [])

  return { db, gagalSimpan, tambah, ubah, hapus, ubahProfil, ganti }
}
