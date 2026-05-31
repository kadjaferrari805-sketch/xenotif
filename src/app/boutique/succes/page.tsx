import Link from 'next/link'
import Stripe from 'stripe'
import { CheckCircle, Download, Package, ArrowRight } from 'lucide-react'
import { getProductById } from '@/lib/boutique/products'

export const metadata = { title: 'Commande confirmée — Xenotif®' }
export const dynamic = 'force-dynamic'

async function getDigitalItems(sessionId?: string) {
  if (!sessionId || !process.env.STRIPE_SECRET_KEY) return []
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    if (session.payment_status !== 'paid') return []
    const ids = (session.metadata?.digital_ids ?? '').split(',').map(s => s.trim()).filter(Boolean)
    return ids
      .map(id => getProductById(id))
      .filter((p): p is NonNullable<typeof p> => !!p)
      .map(p => ({ id: p.id, name: p.name }))
  } catch {
    return []
  }
}

export default async function BoutiqueSuccesPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id } = await searchParams
  const digitalItems = await getDigitalItems(session_id)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-sport-dark px-4 pt-20 pb-16 text-center">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/30">
            <CheckCircle size={40} className="text-emerald-400" />
          </div>
        </div>
        <h1 className="mb-2 text-3xl font-black text-white">Commande confirmée !</h1>
        <p className="mb-8 text-sport-gray">Merci pour ton achat. Un email de confirmation arrive dans quelques minutes.</p>

        {/* Téléchargement immédiat des guides digitaux */}
        {digitalItems.length > 0 && (
          <div className="rounded-2xl border border-sport-orange/40 bg-sport-card p-6 mb-6 text-left shadow-[0_0_30px_rgba(255,69,0,0.1)]">
            <h2 className="mb-1 font-black text-white flex items-center gap-2">
              <Download size={18} className="text-sport-orange" /> Ton téléchargement est prêt
            </h2>
            <p className="text-xs text-sport-gray mb-4">Disponible immédiatement. Tu as aussi reçu ces liens par email.</p>
            <div className="space-y-3">
              {digitalItems.map(item => (
                <a
                  key={item.id}
                  href={`/api/boutique/download?session=${encodeURIComponent(session_id ?? '')}&p=${encodeURIComponent(item.id)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3 rounded-xl border border-sport-border bg-sport-dark px-4 py-3 hover:border-sport-orange/50 transition-colors group"
                >
                  <span className="text-sm font-bold text-white line-clamp-2">📘 {item.name}</span>
                  <span className="flex shrink-0 items-center gap-1.5 rounded-lg bg-sport-orange px-3 py-1.5 text-xs font-bold text-white group-hover:bg-orange-600 transition-colors">
                    <Download size={12} /> PDF
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-sport-border bg-sport-card p-6 mb-6 text-left">
          <h2 className="mb-4 font-black text-white">Et maintenant ?</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-sm">
              <Download size={16} className="mt-0.5 flex-shrink-0 text-sport-lime" />
              <span className="text-white">Tes <span className="font-bold text-sport-lime">programmes digitaux</span> sont disponibles immédiatement{digitalItems.length > 0 ? ' ci-dessus' : ' dans ton email'}.</span>
            </li>
            <li className="flex items-start gap-3 text-sm">
              <Package size={16} className="mt-0.5 flex-shrink-0 text-sport-blue" />
              <span className="text-white">Tes <span className="font-bold text-sport-blue">produits physiques</span> seront expédiés sous 2-5 jours ouvrés.</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <Link href="/boutique" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sport-orange px-6 py-3.5 font-bold text-white hover:bg-orange-600 transition-all">
            Continuer mes achats <ArrowRight size={16} />
          </Link>
          <Link href="/dashboard" className="text-sm font-semibold text-sport-gray hover:text-white transition-colors">
            Aller au dashboard →
          </Link>
        </div>
      </div>
    </div>
  )
}
