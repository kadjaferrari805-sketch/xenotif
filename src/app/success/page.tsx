import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, ArrowRight, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Paiement confirmé — Xenotif®',
  robots: { index: false, follow: false },
}

const NEXT_STEPS = [
  { num: '1', text: 'Vérifie ta boîte mail — un email de confirmation t\'a été envoyé.' },
  { num: '2', text: 'Crée ton profil sportif pour que l\'IA personnalise ton programme.' },
  { num: '3', text: 'Choisis ta première discipline et lance ta première séance.' },
]

export default function SuccessPage() {
  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center px-6 py-20 bg-sport-dark">
      {/* Glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-sport-orange/8 rounded-full blur-3xl pointer-events-none"
      />

      <div className="relative z-10 max-w-lg w-full text-center">
        {/* Success icon */}
        <div className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-8">
          <CheckCircle size={40} className="text-emerald-400" aria-hidden="true" />
        </div>

        <p className="text-[11px] font-bold tracking-[3px] uppercase text-emerald-400 mb-3">
          Paiement confirmé
        </p>

        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
          Bienvenue dans
          <br />
          <span className="text-sport-orange">l&apos;élite Xenotif® !</span>
        </h1>

        <p className="text-sport-gray text-sm leading-relaxed mb-12 max-w-sm mx-auto">
          Ton essai gratuit de <strong className="text-white">30 jours</strong> démarre maintenant.
          Aucun débit avant la fin de la période d&apos;essai.
        </p>

        {/* Next steps */}
        <div className="bg-sport-card border border-sport-border rounded-2xl p-6 mb-8 text-left">
          <p className="text-xs font-bold text-white uppercase tracking-wider mb-5 flex items-center gap-2">
            <Zap size={13} aria-hidden="true" className="text-sport-orange" />
            Prochaines étapes
          </p>
          <ol className="space-y-4">
            {NEXT_STEPS.map((step) => (
              <li key={step.num} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-sport-orange flex items-center justify-center text-white font-black text-xs shrink-0 mt-0.5">
                  {step.num}
                </span>
                <p className="text-xs text-sport-gray leading-relaxed">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/#disciplines" className="btn-primary shadow-lg shadow-sport-orange/20">
            Découvrir les disciplines <ArrowRight size={15} aria-hidden="true" />
          </Link>
          <Link href="/" className="btn-secondary">
            Retour à l&apos;accueil
          </Link>
        </div>

        <p className="text-[11px] text-sport-gray mt-8">
          Un problème ?{' '}
          <a href="mailto:contact@xenotif.com" className="text-sport-orange hover:underline">
            contact@xenotif.com
          </a>
        </p>
      </div>
    </main>
  )
}
