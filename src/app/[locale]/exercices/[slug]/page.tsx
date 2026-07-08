import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { ArrowRight, ArrowLeft, Dumbbell, Target, AlertTriangle, Zap } from 'lucide-react'
import { getExercice, exerciceSlugs, localesForExercice } from '@/lib/exercices/registry'

const SITE = 'https://xenotif.com'

// FR à la racine (locale par défaut), autres préfixées.
function exUrl(slug: string, locale: string): string {
  return locale === 'fr' ? `${SITE}/exercices/${slug}` : `${SITE}/${locale}/exercices/${slug}`
}

export function generateStaticParams() {
  return exerciceSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }): Promise<Metadata> {
  const { slug, locale } = await params
  const ex = getExercice(slug, locale)
  if (!ex) return {}
  const t = await getTranslations({ locale, namespace: 'exercices' })
  const languages: Record<string, string> = { 'x-default': exUrl(slug, 'fr') }
  for (const l of localesForExercice(slug)) languages[l] = exUrl(slug, l)
  const description = `${ex.name} — ${ex.muscles}. ${ex.technique}`.slice(0, 155)
  return {
    title: `${ex.name} — ${t('metaSuffix')}`,
    description,
    alternates: { canonical: exUrl(slug, locale), languages },
    openGraph: { title: `${ex.name} | Xenotif®`, description, url: exUrl(slug, locale), type: 'article' },
  }
}

export default async function ExercicePage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params
  const ex = getExercice(slug, locale)
  if (!ex) notFound()
  const t = await getTranslations({ locale, namespace: 'exercices' })

  const url = exUrl(slug, locale)
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Xenotif®', item: SITE },
      { '@type': 'ListItem', position: 2, name: t('hubTitle'), item: locale === 'fr' ? `${SITE}/exercices` : `${SITE}/${locale}/exercices` },
      { '@type': 'ListItem', position: 3, name: ex.name, item: url },
    ],
  }

  return (
    <div className="min-h-screen bg-sport-dark text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section className="relative overflow-hidden border-b border-sport-border bg-gradient-to-br from-sport-orange/15 via-sport-dark to-sport-dark">
        <div className="max-w-3xl mx-auto px-6 py-14 md:py-16">
          <Link href="/exercices" className="inline-flex items-center gap-1.5 text-xs font-bold text-sport-gray hover:text-white transition-colors mb-6">
            <ArrowLeft size={13} aria-hidden="true" /> {t('backToHub')}
          </Link>
          <p className="text-[11px] font-bold tracking-[2px] uppercase text-sport-orange mb-3">{t('eyebrow')}</p>
          <h1 className="text-4xl md:text-5xl font-black leading-tight mb-5">{ex.name}</h1>
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-sport-card border border-sport-border">
              <Zap size={12} aria-hidden="true" className="text-sport-orange" /> {t('levelLabel')} : {ex.level}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-sport-card border border-sport-border">
              <Target size={12} aria-hidden="true" className="text-sport-orange" /> {ex.muscles}
            </span>
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-12 space-y-8">
        <div className="bg-sport-card border border-sport-border rounded-2xl p-6">
          <h2 className="flex items-center gap-2 text-lg font-black text-white mb-3">
            <Dumbbell size={18} aria-hidden="true" className="text-sport-orange" /> {t('techniqueLabel')}
          </h2>
          <p className="text-sm text-sport-gray leading-relaxed">{ex.technique}</p>
        </div>

        <div className="bg-sport-card border border-sport-orange/25 rounded-2xl p-6">
          <h2 className="flex items-center gap-2 text-lg font-black text-white mb-3">
            <AlertTriangle size={18} aria-hidden="true" className="text-sport-orange" /> {t('mistakesLabel')}
          </h2>
          <p className="text-sm text-sport-gray leading-relaxed">{ex.mistakes}</p>
        </div>

        <div className="rounded-2xl border border-sport-orange/30 bg-gradient-to-br from-sport-orange/15 via-sport-card to-sport-card p-8 text-center">
          <h2 className="text-xl font-black mb-2">{t('ctaTitle')}</h2>
          <p className="text-sport-gray text-sm max-w-md mx-auto mb-6">{t('ctaDesc')}</p>
          <Link
            href="/auth/signup?plan=pro"
            className="inline-flex items-center gap-2 bg-sport-orange text-white px-7 py-3.5 rounded-full font-bold text-sm hover:bg-orange-600 active:scale-95 transition-all"
          >
            {t('ctaButton')} <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  )
}
