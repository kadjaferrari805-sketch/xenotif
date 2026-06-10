'use client'
import { useCallback, useSyncExternalStore } from 'react'

const KEY = 'xenotif_wishlist'
const EMPTY: string[] = []
const EVENT = 'xeno-wishlist'

// Cache du snapshot : useSyncExternalStore exige une référence stable tant que
// la valeur n'a pas changé (sinon boucle de rendu). On ne reparse qu'en cas de
// changement de la chaîne brute du localStorage.
let cache: string[] = EMPTY
let cacheRaw = ''

function read(): string[] {
  if (typeof window === 'undefined') return EMPTY
  let raw = '[]'
  try { raw = localStorage.getItem(KEY) ?? '[]' } catch { /* ignore */ }
  if (raw !== cacheRaw) {
    cacheRaw = raw
    try { cache = JSON.parse(raw) as string[] } catch { cache = EMPTY }
  }
  return cache
}

function subscribe(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {}
  window.addEventListener('storage', callback)   // autres onglets
  window.addEventListener(EVENT, callback)        // onglet courant
  return () => {
    window.removeEventListener('storage', callback)
    window.removeEventListener(EVENT, callback)
  }
}

function getServerSnapshot(): string[] {
  return EMPTY
}

export function useWishlist() {
  const ids = useSyncExternalStore(subscribe, read, getServerSnapshot)

  const toggle = useCallback((id: string) => {
    const current = read()
    const next = current.includes(id) ? current.filter(i => i !== id) : [...current, id]
    const raw = JSON.stringify(next)
    try { localStorage.setItem(KEY, raw) } catch { /* ignore */ }
    // Met à jour le cache immédiatement puis notifie les abonnés (onglet courant).
    cacheRaw = raw
    cache = next
    window.dispatchEvent(new Event(EVENT))
  }, [])

  const isWishlisted = (id: string) => ids.includes(id)
  return { ids, toggle, isWishlisted, count: ids.length }
}
