import Link from 'next/link'
import { CheckCircle, Download, Package, ArrowRight } from 'lucide-react'

export const metadata = { title: 'Commande confirmée — Xenotif®' }

export default function BoutiqueSuccesPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-sport-dark px-4 pt-20 text-center">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/30">
            <CheckCircle size={40} className="text-emerald-400" />
          </div>
        </div>
        <h1 className="mb-2 text-3xl font-black text-white">Commande confirmée !</h1>
        <p className="mb-8 text-sport-gray">Merci pour ton achat. Tu vas recevoir un email de confirmation sous quelques minutes.</p>

        <div className="rounded-2xl border border-sport-border bg-sport-card p-6 mb-6 text-left">
          <h2 className="mb-4 font-black text-white">Et maintenant ?</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-sm">
              <Download size={16} className="mt-0.5 flex-shrink-0 text-sport-lime" />
              <span className="text-white">Tes <span className="font-bold text-sport-lime">programmes digitaux</span> sont disponibles immédiatement dans ton email.</span>
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
