'use client'
import { useSyncExternalStore, useCallback } from 'react'
import type { Product } from './products'

export interface CartItem { product: Product; quantity: number }

const KEY = 'xenotif_cart'

// ─── Store partagé global (singleton) ──────────────────────────────
let items: CartItem[] = []
let initialized = false
const listeners = new Set<() => void>()

function load(): CartItem[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(KEY) ?? '[]') as CartItem[] }
  catch { return [] }
}

function persist() {
  if (typeof window !== 'undefined') localStorage.setItem(KEY, JSON.stringify(items))
}

function emit() {
  for (const l of listeners) l()
}

function setItems(next: CartItem[]) {
  items = next
  persist()
  emit()
}

function ensureInit() {
  if (!initialized && typeof window !== 'undefined') {
    items = load()
    initialized = true
    // Sync entre onglets
    window.addEventListener('storage', e => {
      if (e.key === KEY) { items = load(); emit() }
    })
  }
}

function subscribe(cb: () => void) {
  ensureInit()
  listeners.add(cb)
  return () => listeners.delete(cb)
}

function getSnapshot(): CartItem[] {
  return items
}

function getServerSnapshot(): CartItem[] {
  return []
}

// ─── Actions ───────────────────────────────────────────────────────
export function addToCart(product: Product) {
  ensureInit()
  const existing = items.find(i => i.product.id === product.id)
  setItems(existing
    ? items.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
    : [...items, { product, quantity: 1 }])
}

export function removeFromCart(id: string) {
  setItems(items.filter(i => i.product.id !== id))
}

export function setQuantity(id: string, qty: number) {
  if (qty <= 0) { removeFromCart(id); return }
  setItems(items.map(i => i.product.id === id ? { ...i, quantity: qty } : i))
}

export function clearCart() {
  setItems([])
}

// ─── Hook ──────────────────────────────────────────────────────────
export function useCart() {
  const cartItems = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const addItem = useCallback((product: Product) => addToCart(product), [])
  const removeItem = useCallback((id: string) => removeFromCart(id), [])
  const updateQty = useCallback((id: string, qty: number) => setQuantity(id, qty), [])
  const clear = useCallback(() => clearCart(), [])

  const total = cartItems.reduce((s, i) => s + i.product.price_cents * i.quantity, 0)
  const count = cartItems.reduce((s, i) => s + i.quantity, 0)

  return { items: cartItems, count, total, addItem, removeItem, updateQty, clear }
}
