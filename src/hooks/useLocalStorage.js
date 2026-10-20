import { useState, useEffect } from 'react'
import { dengarCloud, simpanKeCloud } from '../sync'

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {}
    simpanKeCloud(key, value)
  }, [key, value])

  // perubahan dari perangkat lain (lewat Firestore)
  useEffect(() => dengarCloud(key, setValue), [key])

  return [value, setValue]
}
