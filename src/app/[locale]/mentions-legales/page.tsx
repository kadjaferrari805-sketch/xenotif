import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mentions légales — Xenotif®',
  description: 'Mentions légales de la plateforme sportive Xenotif®.',
}

const SECTIONS = [
  {
    id: 'editeur',
    title: 'Éditeur du site',
    content: (
      <>
        <strong className="text-white">Xenotif®</strong> — Plateforme sportive en ligne<br />
        Email :{' '}
        <a href="mailto:contact@xenotif.com" className="text-sport-orange hover:underline">
          contact@xenotif.com
        </a>
        <br />
        Site :{' '}
        <a href="https://xenotif.com" className="text-sport-orange hover:underline" target="_blank" rel="noopener noreferrer">
          xenotif.com
        </a>
      </>
    ),
  },
  {
    id: 'hebergement',
    title: 'Hébergement',
    content: (
      <>
        <strong className="text-white">Vercel Inc.</strong><br />
        440 N Barranca Ave #4133, Covina, CA 91723, USA<br />
        <a href="https://vercel.com" className="text-sport-orange hover:underline" target="_blank" rel="noopener noreferrer">
          vercel.com
        </a>
      </>
    ),
  },
  {
    id: 'propriete',
    title: 'Propriété intellectuelle',
    content: (
      <>
        L&apos;ensemble du contenu de ce site (textes, images, logos, icônes, programmes)
        est la propriété exclusive de Xenotif®. Toute reproduction, même partielle,
        est interdite sans autorisation écrite préalable.
      </>
    ),
  },
  {
    id: 'responsabilite',
    title: 'Limitation de responsabilité',
    content: (
      <>
        Xenotif® s&apos;efforce de fournir des informations exactes et à jour.
        Toutefois, nous ne pouvons garantir l&apos;exactitude, la complétude ou l&apos;actualité
        des informations diffusées. Les programmes sportifs proposés sont informatifs
        et ne remplacent pas l&apos;avis d&apos;un professionnel de santé.
      </>
    ),
  },
  {
    id: 'droit',
    title: 'Droit applicable',
    content: (
      <>
        Le présent site est soumis au droit français. Tout litige sera soumis
        à la compétence des tribunaux français.
      </>
    ),
  },
]

export default function MentionsLegales() {
  return (
    <main className="min-h-screen bg-sport-dark text-white py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sport-gray text-sm mb-10 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} aria-hidden="true" /> Retour à l&apos;accueil
        </Link>

        <p className="text-[11px] font-bold tracking-[2px] uppercase text-sport-orange mb-3">Légal</p>
        <h1 className="text-4xl font-black mb-12 leading-tight">Mentions légales</h1>

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
          <Link href="/confidentialite" className="text-xs text-sport-orange hover:underline">
            Politique de confidentialité →
          </Link>
        </div>
      </div>
    </main>
  )
}
