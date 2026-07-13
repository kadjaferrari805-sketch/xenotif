'use client'
import { X, ShoppingBag, Minus, Plus, Trash2, ArrowRight, Truck } from 'lucide-react'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/lib/boutique/cart'
import { formatPrice } from '@/lib/boutique/products'

interface CartSidebarProps {
  open: boolean
  onClose: () => void
}

const FREE_SHIPPING_THRESHOLD = 5000 // 50€

export function CartSidebar({ open, onClose }: CartSidebarProps) {
  const t = useTranslations('boutique.cart')
  const { items, count, total, removeItem, updateQty } = useCart()
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - total)
  const progress = Math.min(100, (total / FREE_SHIPPING_THRESHOLD) * 100)

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-sport-card border-l border-sport-border shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-sport-border px-6 py-5">
              <div className="flex items-center gap-2">
                <ShoppingBag size={18} className="text-sport-orange" />
                <h2 className="font-black text-sport-fg">{t('title')}</h2>
                {count > 0 && <span className="rounded-full bg-sport-orange px-2 py-0.5 text-xs font-black text-white">{count}</span>}
              </div>
              <button onClick={onClose} className="rounded-lg p-2 text-sport-gray hover:text-sport-fg hover:bg-sport-border/50 transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Free shipping progress */}
            {count > 0 && (
              <div className="border-b border-sport-border px-6 py-4">
                {remaining > 0 ? (
                  <p className="text-xs font-semibold text-sport-gray mb-2">
                    {t.rich('remaining', { amount: formatPrice(remaining), o: (c) => <span className="font-black text-sport-lime">{c}</span> })}
                  </p>
                ) : (
                  <p className="text-xs font-semibold text-sport-lime mb-2 flex items-center gap-1">
                    <Truck size={12} /> {t('unlocked')}
                  </p>
                )}
                <div className="h-1.5 rounded-full bg-sport-border overflow-hidden">
                  <motion.div className="h-full rounded-full bg-sport-lime" animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
                </div>
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <div className="h-16 w-16 rounded-full bg-sport-border/30 flex items-center justify-center">
                    <ShoppingBag size={28} className="text-sport-gray" />
                  </div>
                  <div>
                    <p className="font-black text-sport-fg">{t('emptyTitle')}</p>
                    <p className="text-sm text-sport-gray mt-1">{t('emptyDesc')}</p>
                  </div>
                  <button onClick={onClose} className="rounded-xl bg-sport-orange px-6 py-2.5 text-sm font-bold text-white hover:bg-orange-600 transition-colors">
                    {t('discover')}
                  </button>
                </div>
              ) : (
                <AnimatePresence>
                  {items.map(({ product, quantity }) => (
                    <motion.div key={product.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      className="flex gap-4 py-4 border-b border-sport-border last:border-0">
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-sport-border/30">
                        <Image src={product.images[0] ?? ''} alt={product.name} fill sizes="64px" className="object-cover" />
                      </div>
                      <div className="flex flex-1 flex-col justify-between min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-bold text-sport-fg line-clamp-2 flex-1">{product.name}</p>
                          <button onClick={() => removeItem(product.id)} className="flex-shrink-0 text-sport-gray hover:text-red-400 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          {product.type === 'physical' ? (
                            <div className="flex items-center gap-2">
                              <button onClick={() => updateQty(product.id, quantity - 1)} className="flex h-6 w-6 items-center justify-center rounded-lg border border-sport-border hover:border-sport-orange text-sport-gray hover:text-sport-fg transition-colors">
                                <Minus size={10} />
                              </button>
                              <span className="text-sm font-bold text-sport-fg w-4 text-center">{quantity}</span>
                              <button onClick={() => updateQty(product.id, quantity + 1)} className="flex h-6 w-6 items-center justify-center rounded-lg border border-sport-border hover:border-sport-orange text-sport-gray hover:text-sport-fg transition-colors">
                                <Plus size={10} />
                              </button>
                            </div>
                          ) : <span className="text-xs text-sport-lime font-semibold">{t('digital')}</span>}
                          <span className="text-sm font-black text-sport-fg">{formatPrice(product.price_cents * quantity)}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-sport-border px-6 py-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sport-gray">{t('subtotal')}</span>
                  <span className="text-xl font-black text-sport-fg">{formatPrice(total)}</span>
                </div>
                <p className="text-xs text-sport-gray">{t('shippingNote')}</p>
                <Link href="/boutique/panier" onClick={onClose}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-sport-orange py-4 font-bold text-white hover:bg-orange-600 transition-all hover:shadow-[0_0_30px_rgba(255,69,0,0.4)]">
                  {t('checkout')} <ArrowRight size={16} />
                </Link>
                <button onClick={onClose} className="w-full text-center text-sm font-semibold text-sport-gray hover:text-sport-fg transition-colors">
                  {t('continueShopping')}
                </button>
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}
