import type { ReactNode } from 'react'
import { Link } from '@/i18n/navigation'
import { ArrowLeft } from 'lucide-react'

export interface LegalSection {
  id: string
  title: string
  body: ReactNode
}

export interface LegalDocumentProps {
  eyebrow: string
  title: string
  intro?: string
  sections: LegalSection[]
  updatedLabel: string
  backLabel: string
  related: { href: string; label: string }
}

// Gabarit partagé des pages légales (confidentialité, mentions, CGV).
// Composant purement présentationnel : tout le texte arrive en props
// (résolu côté page selon la locale), donc compatible Server Component.
export function LegalDocument({
  eyebrow, title, intro, sections, updatedLabel, backLabel, related,
}: LegalDocumentProps) {
  return (
    <main className="min-h-screen bg-sport-dark text-sport-fg py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sport-gray text-sm mb-10 hover:text-sport-fg transition-colors"
        >
          <ArrowLeft size={14} aria-hidden="true" /> {backLabel}
        </Link>

        <p className="text-[11px] font-bold tracking-[2px] uppercase text-sport-orange mb-3">{eyebrow}</p>
        <h1 className={`text-4xl font-black leading-tight ${intro ? 'mb-3' : 'mb-12'}`}>{title}</h1>
        {intro && <p className="text-sport-gray text-sm mb-12">{intro}</p>}

        <div className="space-y-8 text-sm text-sport-gray leading-relaxed">
          {sections.map((section) => (
            <section key={section.id} aria-labelledby={section.id}>
              <h2
                id={section.id}
                className="text-sport-fg font-bold text-lg mb-4 flex items-center gap-2"
              >
                <span aria-hidden="true" className="w-1.5 h-5 bg-sport-orange rounded-full inline-block shrink-0" />
                {section.title}
              </h2>
              <div className="bg-sport-card border border-sport-border rounded-xl p-5">
                <div>{section.body}</div>
              </div>
            </section>
          ))}
        </div>

        <div className="mt-14 pt-8 border-t border-sport-border flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <p className="text-[11px] text-sport-gray">{updatedLabel}</p>
          <Link href={related.href} className="text-xs text-sport-orange hover:underline">
            {related.label} →
          </Link>
        </div>
      </div>
    </main>
  )
}
