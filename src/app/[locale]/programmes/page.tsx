import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import { ArrowRight } from 'lucide-react'
import { PROGRAMS } from '@/lib/programs/library'

const SITE = 'https://xenotif.com'

export const metadata: Metadata = {
  title: "Programmes d'entraînement",
  description:
    'Programmes fitness complets et structurés : prise de masse, perte de poids, musculation débutant à avancé, fitness maison. Séances, nutrition et suivi jour par jour.',
  alternates: { canonical: `${SITE}/programmes` },
}

// Hub des programmes : page catégorie SEO + maillage interne vers chaque programme.
export default async function ProgramsHubPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (locale !== 'fr') notFound() // v1 : programmes publiés en FR

  const programs = Object.entries(PROGRAMS)
  const listSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: programs.map(([slug, p], i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.title,
      url: `${SITE}/programmes/${slug}`,
    })),
  }

  return (
    <div className="min-h-screen bg-sport-dark text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema) }} />
      <section className="max-w-5xl mx-auto px-6 py-16 md:py-20">
        <p className="text-[11px] font-bold tracking-[2px] uppercase text-sport-orange mb-3">Programmes Xenotif®</p>
        <h1 className="text-4xl md:text-5xl font-black mb-4">Nos programmes d&apos;entraînement</h1>
        <p className="text-lg text-sport-gray max-w-2xl mb-12">
          Des programmes complets, structurés semaine par semaine — objectifs, séances détaillées, plan nutrition et suivi. Commence gratuitement.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {programs.map(([slug, p]) => (
            <Link
              key={slug}
              href={`/programmes/${slug}`}
              className="group bg-sport-card border border-sport-border rounded-2xl p-6 hover:border-sport-orange/50 transition-all hover:-translate-y-0.5"
            >
              <h2 className="text-xl font-black mb-2 group-hover:text-sport-orange transition-colors">{p.title}</h2>
              <p className="text-sm text-sport-gray leading-relaxed mb-4">{p.subtitle}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {p.level && <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-sport-orange/10 text-sport-orange">{p.level}</span>}
                {p.duration && <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-sport-dark border border-sport-border text-sport-gray">{p.duration}</span>}
              </div>
              <span className="inline-flex items-center gap-1.5 text-sport-orange text-sm font-bold">
                Voir le programme <ArrowRight size={14} aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
