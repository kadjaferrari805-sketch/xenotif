import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = { title: 'Mentions légales — Xenotif®' }

export default function MentionsLegales() {
  return (
    <main className="min-h-screen bg-sport-dark text-white py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sport-gray text-sm mb-8 hover:text-white transition-colors">
          <ArrowLeft size={14} /> Retour
        </Link>
        <h1 className="text-4xl font-black mb-10">Mentions légales</h1>

        <div className="space-y-8 text-sm text-sport-gray leading-relaxed">
          <section>
            <h2 className="text-white font-bold text-lg mb-3">Éditeur du site</h2>
            <p>Xenotif® — Plateforme sportive en ligne<br />
            Email : contact@xenotif.com<br />
            Site : xenotif.com</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">Hébergement</h2>
            <p>Vercel Inc.<br />
            440 N Barranca Ave #4133, Covina, CA 91723, USA<br />
            vercel.com</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">Propriété intellectuelle</h2>
            <p>L'ensemble du contenu de ce site (textes, images, logos, icônes) est la propriété exclusive de Xenotif®. Toute reproduction, même partielle, est interdite sans autorisation écrite préalable.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">Limitation de responsabilité</h2>
            <p>Xenotif® s'efforce de fournir des informations exactes et à jour. Toutefois, nous ne pouvons garantir l'exactitude, la complétude ou l'actualité des informations diffusées sur ce site.</p>
          </section>
        </div>
      </div>
    </main>
  )
}
