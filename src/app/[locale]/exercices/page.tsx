import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { ArrowRight, Zap } from 'lucide-react'
import { exercicesForLocale } from '@/lib/exercices/registry'

const SITE = 'https://xenotif.com'
const LOCS = ['fr', 'en', 'de'] as const

function hubUrl(locale: string): string {
  return locale === 'fr' ? `${SITE}/exercices` : `${SITE}/${locale}/exercices`
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'exercices' })
  const languages: Record<string, string> = { 'x-default': hubUrl('fr') }
  for (const l of LOCS) languages[l] = hubUrl(l)
  return {
    title: t('hubMetaTitle'),
    description: t('hubMetaDesc'),
    alternates: { canonical: hubUrl(locale), languages },
  }
}

// Hub des exercices : page catégorie SEO + maillage vers chaque fiche exercice.
export default async function ExercicesHubPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'exercices' })
  const exercices = exercicesForLocale(locale)

  const listSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: exercices.map(({ slug, ex }, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: ex.name,
      url: locale === 'fr' ? `${SITE}/exercices/${slug}` : `${SITE}/${locale}/exercices/${slug}`,
    })),
  }

  return (
    <div className="min-h-screen bg-sport-dark text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema) }} />
      <section className="max-w-5xl mx-auto px-6 py-16 md:py-20">
        <p className="text-[11px] font-bold tracking-[2px] uppercase text-sport-orange mb-3">{t('hubEyebrow')}</p>
        <h1 className="text-4xl md:text-5xl font-black mb-4">{t('hubTitle')}</h1>
        <p className="text-lg text-sport-gray max-w-2xl mb-12">{t('hubSubtitle')}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {exercices.map(({ slug, ex }) => (
            <Link
              key={slug}
              href={`/exercices/${slug}`}
              className="group bg-sport-card border border-sport-border rounded-2xl p-5 hover:border-sport-orange/50 transition-all hover:-translate-y-0.5"
            >
              <h2 className="text-base font-black mb-1.5 group-hover:text-sport-orange transition-colors">{ex.name}</h2>
              <p className="text-xs text-sport-gray leading-relaxed mb-3 line-clamp-2">{ex.muscles}</p>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-sport-orange/10 text-sport-orange">
                  <Zap size={10} aria-hidden="true" /> {ex.level}
                </span>
                <span className="inline-flex items-center gap-1 text-sport-orange text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  {t('seeExercise')} <ArrowRight size={12} aria-hidden="true" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
