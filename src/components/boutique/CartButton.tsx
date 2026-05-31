'use client'
import { usePathname } from 'next/navigation'
import { ShoppingCart } from 'lucide-react'
import { useCart, useCartOpen } from '@/lib/boutique/cart'
import { CartSidebar } from './CartSidebar'

/**
 * Bouton panier flottant + panneau latéral, partagé sur TOUTE la boutique
 * (liste, fiches produit, programmes…). L'état d'ouverture est global
 * (store cart.ts), donc « Ajouter au panier » depuis n'importe quelle page
 * ouvre ce même panier.
 */
export function CartButton() {
  const { count } = useCart()
  const { open, openCart, closeCart } = useCartOpen()
  const pathname = usePathname()

  // Pas de bouton flottant sur la page panier elle-même (redondant)
  const hideFab = pathname === '/boutique/panier'

  return (
    <>
      <CartSidebar open={open} onClose={closeCart} />

      {!hideFab && (
        <button
          onClick={openCart}
          aria-label={count > 0 ? `Ouvrir le panier (${count} article${count !== 1 ? 's' : ''})` : 'Ouvrir le panier'}
          className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-sport-orange text-white shadow-[0_0_30px_rgba(255,69,0,0.5)] hover:bg-orange-600 hover:scale-105 transition-all"
        >
          <ShoppingCart size={22} />
          {count > 0 && (
            <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-black text-sport-orange border-2 border-sport-dark">
              {count}
            </span>
          )}
        </button>
      )}
    </>
  )
}
