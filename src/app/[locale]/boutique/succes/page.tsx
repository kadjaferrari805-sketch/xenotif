import type { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import Stripe from 'stripe'
import { CheckCircle, Download, Package, ArrowRight } from 'lucide-react'
import { getProductByIdLocalized } from '@/lib/boutique/products.en'
import { MetaTrack } from '@/components/analytics/MetaTrack'
import { GtagPurchase } from '@/components/analytics/GtagPurchase'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'boutique.succes' })
  // `absolute` : évite le template « %s | Xenotif® » (le titre contient déjà la marque).
  return { title: { absolute: t('metaTitle') } }
}

type OrderInfo = {
  items: { id: string; name: string }[]
  value: number      // montant payé en euros (pour le Pixel)
  currency: string
}

async function getOrderInfo(locale: string, sessionId?: string): Promise<OrderInfo> {
  const empty: OrderInfo = { items: [], value: 0, currency: 'EUR' }
  if (!sessionId || !process.env.STRIPE_SECRET_KEY) return empty
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    if (session.payment_status !== 'paid') return empty
    const ids = (session.metadata?.digital_ids ?? '').split(',').map(s => s.trim()).filter(Boolean)
    const items = ids
      .map(id => getProductByIdLocalized(id, locale))
      .filter((p): p is NonNullable<typeof p> => !!p)
      .map(p => ({ id: p.id, name: p.name }))
    return {
      items,
      value: (session.amount_total ?? 0) / 100,
      currency: (session.currency ?? 'eur').toUpperCase(),
    }
  } catch {
    return empty
  }
}

export default async function BoutiqueSuccesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ session_id?: string }>
}) {
  const { locale } = await params
  const { session_id } = await searchParams
  const t = await getTranslations('boutique.succes')
  const { items: digitalItems, value, currency } = await getOrderInfo(locale, session_id)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-sport-dark px-4 pt-20 pb-16 text-center">
      {/* Conversion achat boutique confirmé. Meta : eventId partagé avec l'API Conversions.
          GA4 : événement « purchase » importable comme conversion Google Ads. */}
      {value > 0 && (
        <>
          <MetaTrack event="Purchase" value={value} currency={currency} contentIds={digitalItems.map(i => i.id)} eventId={session_id} />
          <GtagPurchase value={value} currency={currency} transactionId={session_id} items={digitalItems.map(i => ({ item_id: i.id, item_name: i.name }))} />
        </>
      )}
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/30">
            <CheckCircle size={40} className="text-emerald-400" />
          </div>
        </div>
        <h1 className="mb-2 text-3xl font-black text-white">{t('title')}</h1>
        <p className="mb-8 text-sport-gray">{t('subtitle')}</p>

        {/* Téléchargement immédiat des guides digitaux */}
        {digitalItems.length > 0 && (
          <div className="rounded-2xl border border-sport-orange/40 bg-sport-card p-6 mb-6 text-left shadow-[0_0_30px_rgba(255,69,0,0.1)]">
            <h2 className="mb-1 font-black text-white flex items-center gap-2">
              <Download size={18} className="text-sport-orange" /> {t('downloadReady')}
            </h2>
            <p className="text-xs text-sport-gray mb-4">{t('downloadDesc')}</p>
            <div className="space-y-3">
              {digitalItems.map(item => (
                <div
                  key={item.id}
                  className="rounded-xl border border-sport-border bg-sport-dark px-4 py-3"
                >
                  <p className="text-sm font-bold text-white line-clamp-2 mb-2.5">📘 {item.name}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] text-sport-gray">{t('downloadLang')}</span>
                    {([
                      { code: 'fr', label: '🇫🇷 FR' },
                      { code: 'en', label: '🇬🇧 EN' },
                      { code: 'de', label: '🇩🇪 DE' },
                    ] as const).map(l => (
                      <a
                        key={l.code}
                        href={`/api/boutique/download?session=${encodeURIComponent(session_id ?? '')}&p=${encodeURIComponent(item.id)}&lang=${l.code}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                          l.code === locale
                            ? 'bg-sport-orange text-white hover:bg-orange-600'
                            : 'border border-sport-border text-white hover:border-sport-orange/50'
                        }`}
                      >
                        <Download size={12} /> {l.label}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-sport-border bg-sport-card p-6 mb-6 text-left">
          <h2 className="mb-4 font-black text-white">{t('whatNow')}</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-sm">
              <Download size={16} className="mt-0.5 flex-shrink-0 text-sport-lime" />
              <span className="text-white">
                {t.rich(digitalItems.length > 0 ? 'digitalAbove' : 'digitalEmail', { o: (c) => <span className="font-bold text-sport-lime">{c}</span> })}
              </span>
            </li>
            <li className="flex items-start gap-3 text-sm">
              <Package size={16} className="mt-0.5 flex-shrink-0 text-sport-blue" />
              <span className="text-white">
                {t.rich('physicalShipped', { o: (c) => <span className="font-bold text-sport-blue">{c}</span> })}
              </span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <Link href="/boutique" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sport-orange px-6 py-3.5 font-bold text-white hover:bg-orange-600 transition-all">
            {t('continueShopping')} <ArrowRight size={16} />
          </Link>
          <Link href="/dashboard" className="text-sm font-semibold text-sport-gray hover:text-white transition-colors">
            {t('goDashboard')}
          </Link>
        </div>
      </div>
    </div>
  )
}
