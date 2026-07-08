import Link from 'next/link'
import { ArrowLeft, Zap } from 'lucide-react'

export const metadata = { title: 'Page introuvable — Xenotif®' }

export default function NotFound() {
  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center bg-sport-dark">
      {/* Glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-sport-orange/8 rounded-full blur-3xl pointer-events-none"
      />

      <div className="relative z-10 max-w-md">
        {/* Icon */}
        <div className="w-20 h-20 rounded-2xl bg-sport-orange/10 border border-sport-orange/25 flex items-center justify-center mx-auto mb-8">
          <Zap size={36} className="text-sport-orange" aria-hidden="true" />
        </div>

        {/* Error code */}
        <p className="text-[11px] font-bold tracking-[3px] uppercase text-sport-orange mb-4">
          Erreur 404
        </p>

        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
          Page introuvable
        </h1>

        <p className="text-sport-gray text-sm leading-relaxed mb-10">
          Cette page n&apos;existe pas ou a été déplacée.
          Retourne à l&apos;accueil pour continuer ta progression.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="btn-primary shadow-lg shadow-sport-orange/20"
          >
            <ArrowLeft size={15} aria-hidden="true" />
            Retour à l&apos;accueil
          </Link>
          <Link
            href="/disciplines"
            className="btn-secondary"
          >
            Voir les disciplines
          </Link>
        </div>
      </div>
    </main>
  )
}
