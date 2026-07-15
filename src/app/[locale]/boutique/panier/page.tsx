'use client'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, ExternalLink, Lock } from 'lucide-react'
import { useCart } from '@/lib/boutique/cart'
import { formatPrice } from '@/lib/boutique/products'
import { useState } from 'react'
import { trackMeta } from '@/lib/meta-pixel'

export default function PanierPage() {
  const t = useTranslations('boutique.panier')
  const locale = useLocale()
  const { items, count, removeItem, updateQty } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')

  // Séparer produits Xenotif (Stripe) et affiliés Amazon
  const ownItems = items.filter(i => !i.product.isAffiliate)
  const affiliateItems = items.filter(i => i.product.isAffiliate)
  const ownTotal = ownItems.reduce((s, i) => s + i.product.price_cents * i.quantity, 0)

  // Sauvegarde le panier pour la relance si email valide saisi
  async function saveCartForRecovery() {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !ownItems.length) return
    try {
      await fetch('/api/boutique/save-cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          items: ownItems.map(i => ({ product_id: i.product.id, quantity: i.quantity })),
          locale,
        }),
      })
    } catch { /* silencieux - ne bloque jamais l'achat */ }
  }

  async function checkout() {
    if (!ownItems.length) return
    setLoading(true)
    setError('')
    void saveCartForRecovery() // capture pour relance, non bloquant
    // Conversion Meta Pixel : début du paiement boutique
    trackMeta('InitiateCheckout', { value: ownTotal / 100, currency: 'EUR' })
    try {
      const res = await fetch('/api/boutique/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: ownItems.map(i => ({ product_id: i.product.id, quantity: i.quantity })),
          locale,
        }),
      })
      const data = await res.json() as { url?: string; error?: string }
      if (data.url) {
        window.location.assign(data.url)
      } else {
        setError(data.error ?? t('payError'))
      }
    } catch {
      setError(t('connError'))
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-sport-dark px-4 pt-20 text-center">
        <ShoppingBag size={64} className="text-sport-border" />
        <div>
          <h1 className="text-2xl font-black text-sport-fg">{t('emptyTitle')}</h1>
          <p className="mt-2 text-sport-gray">{t('emptyDesc')}</p>
        </div>
        <Link href="/boutique" className="inline-flex items-center gap-2 rounded-2xl bg-sport-orange px-6 py-3 font-bold text-white hover:bg-orange-600 transition-all">
          {t('seeShop')} <ArrowRight size={16} />
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-sport-dark pt-24 pb-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <h1 className="mb-8 text-3xl font-black text-sport-fg">
          {t('title')} <span className="text-sport-gray text-xl font-normal">{t('itemsCount', { count })}</span>
        </h1>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">

            {/* Produits XENOTIF - paiement Stripe */}
            {ownItems.length > 0 && (
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-sport-gray flex items-center gap-2">
                  <Lock size={11} /> {t('ownSection')}
                </p>
                <div className="space-y-3">
                  {ownItems.map(({ product, quantity }) => (
                    <div key={product.id} className="flex gap-4 rounded-2xl border border-sport-border bg-sport-card p-4">
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-sport-border/30">
                        <Image src={product.images[0] ?? ''} alt={product.name} fill sizes="80px" className="object-cover" />
                      </div>
                      <div className="flex flex-1 flex-col justify-between min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-black text-sport-fg text-sm line-clamp-2">{product.name}</p>
                            <p className="text-xs text-sport-gray mt-0.5">{product.type === 'digital' ? t('digitalImmediate') : t('physicalDelivery')}</p>
                          </div>
                          <button onClick={() => removeItem(product.id)} className="flex-shrink-0 text-sport-gray hover:text-red-400 transition-colors">
                            <Trash2 size={15} />
                          </button>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          {product.type === 'physical' ? (
                            <div className="flex items-center gap-2">
                              <button onClick={() => updateQty(product.id, quantity - 1)} className="flex h-7 w-7 items-center justify-center rounded-lg border border-sport-border hover:border-sport-orange/50 text-sport-gray hover:text-sport-fg transition-colors">
                                <Minus size={12} />
                              </button>
                              <span className="text-sm font-bold text-sport-fg w-5 text-center">{quantity}</span>
                              <button onClick={() => updateQty(product.id, quantity + 1)} className="flex h-7 w-7 items-center justify-center rounded-lg border border-sport-border hover:border-sport-orange/50 text-sport-gray hover:text-sport-fg transition-colors">
                                <Plus size={12} />
                              </button>
                            </div>
                          ) : <span className="text-xs text-sport-lime font-semibold">{t('digitalTag')}</span>}
                          <span className="font-black text-sport-fg">{formatPrice(product.price_cents * quantity)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Produits Amazon affiliés */}
            {affiliateItems.length > 0 && (
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-sport-gray flex items-center gap-2">
                  {t('affiliateSection')}
                </p>
                <div className="space-y-3">
                  {affiliateItems.map(({ product }) => (
                    <div key={product.id} className="flex gap-4 rounded-2xl border border-sport-border/40 bg-sport-card/60 p-4">
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-sport-border/30">
                        <Image src={product.images[0] ?? ''} alt={product.name} fill sizes="64px" className="object-cover" />
                      </div>
                      <div className="flex flex-1 items-center justify-between gap-3 min-w-0">
                        <div className="min-w-0">
                          <p className="font-bold text-sport-fg text-sm line-clamp-1">{product.name}</p>
                          <p className="text-xs text-sport-gray mt-0.5">{formatPrice(product.price_cents)} · Amazon.de</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {product.amazon && (
                            <a href={product.amazon.affiliateUrl} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1.5 rounded-xl bg-sport-orange px-3 py-2 text-xs font-bold text-white hover:bg-orange-600 transition-colors">
                              <ExternalLink size={11} /> Amazon
                            </a>
                          )}
                          <button onClick={() => removeItem(product.id)} className="text-sport-gray hover:text-red-400 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-xs italic text-sport-gray">{t('affiliateNote')}</p>
              </div>
            )}
          </div>

          {/* Récapitulatif */}
          <div className="space-y-4">
            {ownItems.length > 0 && (
              <div className="rounded-2xl border border-sport-orange/30 bg-sport-card p-6 shadow-[0_0_30px_rgba(255,69,0,0.08)]">
                <h2 className="mb-4 font-black text-sport-fg">{t('summary')}</h2>
                <div className="space-y-2 text-sm mb-4">
                  {ownItems.map(({ product, quantity }) => (
                    <div key={product.id} className="flex justify-between text-sport-gray">
                      <span className="truncate flex-1 mr-2 text-xs">{product.name.split('-')[0]?.trim()} ×{quantity}</span>
                      <span className="font-semibold text-sport-fg flex-shrink-0">{formatPrice(product.price_cents * quantity)}</span>
                    </div>
                  ))}
                  <div className="border-t border-sport-border pt-3 flex justify-between">
                    <span className="font-black text-sport-fg">{t('total')}</span>
                    <span className="text-xl font-black text-sport-orange">{formatPrice(ownTotal)}</span>
                  </div>
                </div>

                {/* Email - relance panier + reçu */}
                <div className="mb-3">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onBlur={() => void saveCartForRecovery()}
                    placeholder={t('emailPlaceholder')}
                    className="w-full rounded-xl border border-sport-border bg-sport-dark px-3 py-2.5 text-sm text-sport-fg placeholder:text-sport-gray focus:outline-none focus:border-sport-orange transition-colors"
                  />
                </div>

                {error && (
                  <div className="mb-3 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
                    ⚠️ {error}
                  </div>
                )}

                <button onClick={checkout} disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-sport-orange py-4 font-bold text-white hover:bg-orange-600 transition-all disabled:opacity-60 hover:shadow-[0_0_20px_rgba(255,69,0,0.4)]">
                  {loading
                    ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> {t('redirecting')}</>
                    : <><Lock size={14} /> {t('payNow')}</>
                  }
                </button>
                <div className="mt-3 flex flex-wrap justify-center gap-3 text-[10px] text-sport-gray">
                  {(t.raw('payTrust') as string[]).map((s) => <span key={s}>{s}</span>)}
                </div>
              </div>
            )}

            {affiliateItems.length > 0 && ownItems.length === 0 && (
              <div className="rounded-2xl border border-sport-border bg-sport-card p-6 text-center">
                <p className="text-sm text-sport-gray mb-2">{t('affiliateOnlyTitle')}</p>
                <p className="text-xs text-sport-gray">{t('affiliateOnlyDesc')}</p>
              </div>
            )}

            <Link href="/boutique" className="block w-full text-center rounded-2xl border border-sport-border py-3 text-sm font-semibold text-sport-gray hover:text-sport-fg hover:border-sport-fg/20 transition-colors">
              {t('continueShopping')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
