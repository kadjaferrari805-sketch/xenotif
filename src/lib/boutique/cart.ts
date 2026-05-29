'use client'
import { useState, useEffect, useCallback } from 'react'
import type { Product } from './products'

export interface CartItem { product: Product; quantity: number }

const KEY = 'xenotif_cart'

function load(): CartItem[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(KEY) ?? '[]') as CartItem[] }
  catch { return [] }
}

function save(items: CartItem[]) {
  if (typeof window !== 'undefined') localStorage.setItem(KEY, JSON.stringify(items))
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => { setItems(load()) }, [])

  const addItem = useCallback((product: Product) => {
    setItems(prev => {
      const next = prev.find(i => i.product.id === product.id)
        ? prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
        : [...prev, { product, quantity: 1 }]
      save(next)
      return next
    })
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems(prev => { const next = prev.filter(i => i.product.id !== id); save(next); return next })
  }, [])

  const updateQty = useCallback((id: string, qty: number) => {
    if (qty <= 0) { removeItem(id); return }
    setItems(prev => { const next = prev.map(i => i.product.id === id ? { ...i, quantity: qty } : i); save(next); return next })
  }, [removeItem])

  const clear = useCallback(() => { setItems([]); save([]) }, [])

  const total = items.reduce((s, i) => s + i.product.price_cents * i.quantity, 0)
  const count = items.reduce((s, i) => s + i.quantity, 0)

  return { items, count, total, addItem, removeItem, updateQty, clear }
}
