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
// a un panier vide. Il ne tourne QU'EN UN SEUL CAS, ajoute en K8.6.1 : lorsque
// la valeur relue du stockage n'est pas un UUID v4 valide (cf. ci-dessous).
// Il n'est jamais journalise, et n'apparait dans aucune URL.
const TOKEN_KEY = 'xenotif_cart_token'

/**
 * UUID v4, dans l'ecriture EXACTE de la garde serveur de
 * /api/boutique/save-cart (route.ts:18). Les deux expressions doivent rester
 * identiques au caractere pres : si le client acceptait un jeton que le serveur
 * refuse, le panier ne serait jamais enregistre — et silencieusement.
 */
const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

let cartToken = ''

/** UUID v4 cryptographiquement imprevisible (122 bits d'entropie). */
function newToken(): string {
  return crypto.randomUUID()
}

/**
 * Jeton du panier courant. Le cree au premier appel cote navigateur et le
 * reutilise ensuite — un rendu supplementaire n'en genere jamais un nouveau.
 * Renvoie '' cote serveur : le jeton n'existe que dans le navigateur.
 *
 * VALIDATION DE LA VALEUR STOCKEE (K8.6.1, finding C1). `localStorage` est
 * ecrivable par l'utilisateur, par une extension, ou corruptible par une
 * collision de cle. Avant ce correctif, la valeur relue etait renvoyee TELLE
 * QUELLE : un jeton altere partait vers /api/boutique/save-cart, qui le
 * rejetait en 400. Et comme le jeton ne tournait jamais, le panier de ce
 * visiteur n'etait PLUS JAMAIS enregistre — sans le moindre signal, ni pour
 * lui, ni pour l'exploitation.
 *
 * Trois cas, un seul comportement conserve :
 *   - valeur valide   -> conservee EXACTEMENT, le panier reste rattache ;
 *   - cle absente     -> nouveau jeton, persiste ;
 *   - valeur invalide -> nouveau jeton, persiste (la valeur cassee est remplacee).
 */
export function getCartToken(): string {
  if (typeof window === 'undefined') return ''
  if (cartToken) return cartToken
  try {
    const stocke = localStorage.getItem(TOKEN_KEY)
    if (stocke && UUID_V4.test(stocke)) {
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
