'use client'
import { useState, useEffect, useCallback } from 'react'

const KEY = 'xenotif_wishlist'

function load(): string[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(KEY) ?? '[]') as string[] }
  catch { return [] }
}

export function useWishlist() {
  const [ids, setIds] = useState<string[]>([])
  useEffect(() => { setIds(load()) }, [])

  const toggle = useCallback((id: string) => {
    setIds(prev => {
      const next = prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      localStorage.setItem(KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const isWishlisted = (id: string) => ids.includes(id)
  return { ids, toggle, isWishlisted, count: ids.length }
}
