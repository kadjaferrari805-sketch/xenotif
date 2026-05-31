import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Politique de confidentialité — Xenotif®',
  description: 'Politique de confidentialité et protection des données (RGPD) de Xenotif®.',
}

const SECTIONS = [
  {
    id: 'donnees',
    title: 'Données collectées',
    content: (
      <>
        Nous collectons uniquement votre adresse email lorsque vous vous inscrivez à notre newsletter.
        Ces données sont utilisées exclusivement pour vous envoyer nos communications sportives.
        Aucune autre donnée personnelle n&apos;est collectée sans votre consentement explicite.
      </>
    ),
  },
  {
    id: 'utilisation',
    title: 'Utilisation des données',
    content: (
      <>
        Votre email est utilisé pour :<br />
        — Vous envoyer nos programmes et conseils hebdomadaires<br />
        — Vous informer des nouveautés Xenotif®<br />
        — Vous transmettre les WODs et défis de la communauté<br /><br />
        Nous ne vendons ni ne partageons vos données avec des tiers.
      </>
    ),
  },
  {
    id: 'cookies',
    title: 'Cookies',
    content: (
      <>
        Ce site utilise uniquement des cookies techniques essentiels au bon fonctionnement.
        Aucun cookie publicitaire, de tracking ou de profilage n&apos;est utilisé.
        Vous pouvez bloquer les cookies dans les paramètres de votre navigateur
        sans que cela affecte votre navigation.
      </>
    ),
  },
  {
    id: 'droits',
    title: 'Vos droits (RGPD)',
    content: (
      <>
        Conformément au Règlement Général sur la Protection des Données (RGPD),
        vous disposez d&apos;un droit d&apos;accès, de rectification, de suppression
        et de portabilité de vos données. Pour exercer ces droits, contactez-nous à :{' '}
        <a href="mailto:contact@xenotif.com" className="text-sport-orange hover:underline">
          contact@xenotif.com
        </a>
        <br /><br />
        Vous avez également le droit d&apos;introduire une réclamation auprès de la{' '}
        <a href="https://www.cnil.fr" className="text-sport-orange hover:underline" target="_blank" rel="noopener noreferrer">
          CNIL
        </a>
        .
      </>
    ),
  },
  {
    id: 'desabonnement',
    title: 'Désabonnement',
    content: (
      <>
        Vous pouvez vous désabonner à tout moment en cliquant sur le lien de
        désabonnement présent dans chacun de nos emails, ou en nous contactant
        directement à{' '}
        <a href="mailto:contact@xenotif.com" className="text-sport-orange hover:underline">
          contact@xenotif.com
        </a>
        . Votre demande sera traitée sous 48 heures.
      </>
    ),
  },
  {
    id: 'conservation',
    title: 'Conservation des données',
    content: (
      <>
        Vos données sont conservées tant que vous êtes abonné(e) à notre newsletter
        et pendant 3 ans après votre désabonnement, conformément aux obligations légales.
        À l&apos;issue de cette période, elles sont définitivement supprimées.
      </>
    ),
  },
]

export default function Confidentialite() {
  return (
    <main className="min-h-screen bg-sport-dark text-white py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sport-gray text-sm mb-10 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} aria-hidden="true" /> Retour à l&apos;accueil
        </Link>

        <p className="text-[11px] font-bold tracking-[2px] uppercase text-sport-orange mb-3">RGPD</p>
        <h1 className="text-4xl font-black mb-3 leading-tight">Politique de confidentialité</h1>
        <p className="text-sport-gray text-sm mb-12">
          Xenotif® s&apos;engage à protéger vos données personnelles et à respecter votre vie privée.
        </p>

        <div className="space-y-8 text-sm text-sport-gray leading-relaxed">
          {SECTIONS.map((section) => (
            <section key={section.id} aria-labelledby={section.id}>
              <h2
                id={section.id}
                className="text-white font-bold text-lg mb-4 flex items-center gap-2"
              >
                <span aria-hidden="true" className="w-1.5 h-5 bg-sport-orange rounded-full inline-block shrink-0" />
                {section.title}
              </h2>
              <div className="bg-sport-card border border-sport-border rounded-xl p-5">
                <p>{section.content}</p>
              </div>
            </section>
          ))}
        </div>

        <div className="mt-14 pt-8 border-t border-sport-border flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <p className="text-[11px] text-sport-gray">Dernière mise à jour : mai 2025</p>
          <Link href="/mentions-legales" className="text-xs text-sport-orange hover:underline">
            Mentions légales →
          </Link>
        </div>
      </div>
    </main>
  )
}
