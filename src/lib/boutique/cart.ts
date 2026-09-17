'use client'
import { useSyncExternalStore, useCallback } from 'react'
import type { Product } from './products'

export interface CartItem { product: Product; quantity: number }

const KEY = 'xenotif_cart'

// ─── Jeton de panier (K8.4) ────────────────────────────────────────
//
// POURQUOI. La ligne `abandoned_carts` n'avait pour seule preuve de propriete
// que la connaissance de l'adresse e-mail : quiconque la connaissait pouvait
// remplacer le panier de son titulaire et rearmer un rappel deja envoye. Ce
// jeton est une CAPABILITE : il autorise la modification de SON panier, et de
// lui seul.
//
// CE QU'IL N'EST PAS. Il ne prouve en rien la possession de l'adresse e-mail.
// Il ferme l'ecrasement du panier d'autrui, pas l'envoi d'un e-mail vers une
// adresse arbitraire — cela demanderait une verification de possession.
//
// STABILITE. Cle de stockage SEPAREE de celle du panier : le jeton survit donc
// a un panier vide, et ne tourne pas. Il n'est jamais journalise.
const TOKEN_KEY = 'xenotif_cart_token'

let cartToken = ''

/** UUID v4 cryptographiquement imprevisible (122 bits d'entropie). */
function newToken(): string {
  return crypto.randomUUID()
}

/**
 * Jeton du panier courant. Le cree au premier appel cote navigateur et le
 * reutilise ensuite — un rendu supplementaire n'en genere jamais un nouveau.
 * Renvoie '' cote serveur : le jeton n'existe que dans le navigateur.
 */
export function getCartToken(): string {
  if (typeof window === 'undefined') return ''
  if (cartToken) return cartToken
  try {
    const stocke = localStorage.getItem(TOKEN_KEY)
    if (stocke) {
      cartToken = stocke
    } else {
      cartToken = newToken()
      localStorage.setItem(TOKEN_KEY, cartToken)
    }
  } catch {
    // Stockage indisponible (navigation privee stricte, quota) : on garde un
    // jeton en memoire pour la session courante plutot que d'echouer.
    if (!cartToken) cartToken = newToken()
  }
  return cartToken
}

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

// ─── État d'ouverture du panier (global, partagé) ──────────────────
let cartOpen = false
const openListeners = new Set<() => void>()

function emitOpen() { for (const l of openListeners) l() }

export function openCart() { cartOpen = true; emitOpen() }
export function closeCart() { cartOpen = false; emitOpen() }

function subscribeOpen(cb: () => void) {
  openListeners.add(cb)
  return () => openListeners.delete(cb)
}
function getOpenSnapshot() { return cartOpen }
function getOpenServerSnapshot() { return false }

export function useCartOpen() {
  const open = useSyncExternalStore(subscribeOpen, getOpenSnapshot, getOpenServerSnapshot)
  return { open, openCart, closeCart }
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

  // Jeton exposé pour les appels serveur. Il n'est jamais rendu dans le DOM :
  // côté serveur il vaut '', ce qui n'introduit aucun écart d'hydratation.
  return { items: cartItems, count, total, token: getCartToken(), addItem, removeItem, updateQty, clear }
}
