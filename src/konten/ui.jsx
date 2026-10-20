import { useEffect, useState } from 'react'

/* Tombol berbahaya dua langkah: klik pertama hanya meminta konfirmasi. */
export function TombolYakin({ children, yakin, onYakin, className = 'pill bahaya' }) {
  const [tanya, setTanya] = useState(false)

  useEffect(() => {
    if (!tanya) return undefined
    const t = setTimeout(() => setTanya(false), 4000)
    return () => clearTimeout(t)
  }, [tanya])

  const klik = () => {
    if (!tanya) return setTanya(true)
    setTanya(false)
    onYakin()
  }

  return (
    <button type="button" className={className} onClick={klik}>
      {tanya ? yakin : children}
    </button>
  )
}

export const linkKonten = (id) => `/konten/item/${encodeURIComponent(id)}`
