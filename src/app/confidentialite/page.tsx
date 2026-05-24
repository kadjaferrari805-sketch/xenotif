import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = { title: 'Politique de confidentialité — Xenotif®' }

export default function Confidentialite() {
  return (
    <main className="min-h-screen bg-sport-dark text-white py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sport-gray text-sm mb-8 hover:text-white transition-colors">
          <ArrowLeft size={14} /> Retour
        </Link>
        <h1 className="text-4xl font-black mb-10">Politique de confidentialité</h1>

        <div className="space-y-8 text-sm text-sport-gray leading-relaxed">
          <section>
            <h2 className="text-white font-bold text-lg mb-3">Données collectées</h2>
            <p>Nous collectons uniquement votre adresse email lorsque vous vous inscrivez à notre newsletter. Ces données sont utilisées exclusivement pour vous envoyer nos communications sportives.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">Utilisation des données</h2>
            <p>Votre email est utilisé pour :<br />
            — Vous envoyer nos programmes et conseils hebdomadaires<br />
            — Vous informer des nouveautés Xenotif®<br />
            Nous ne vendons ni ne partageons vos données avec des tiers.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">Cookies</h2>
            <p>Ce site utilise des cookies techniques essentiels au fonctionnement. Aucun cookie publicitaire ou de tracking n'est utilisé.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">Vos droits (RGPD)</h2>
            <p>Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Pour exercer ces droits, contactez-nous à : contact@xenotif.com</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">Désabonnement</h2>
            <p>Vous pouvez vous désabonner à tout moment en répondant "STOP" à nos emails ou en nous contactant directement.</p>
          </section>
        </div>
      </div>
    </main>
  )
}
