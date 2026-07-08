import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { getExercice, exerciceSlugs, localesForExercice } from '@/lib/exercices/registry'
import { getExerciceDetail } from '@/lib/exercices/details'
import { ExerciceDetail } from '@/components/exercices/ExerciceDetail'

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
  const detail = getExerciceDetail(slug, locale)
  if (!detail) notFound()
  const t = await getTranslations({ locale, namespace: 'exercices' })

  const url = exUrl(slug, locale)
  const hubUrl = locale === 'fr' ? `${SITE}/exercices` : `${SITE}/${locale}/exercices`
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Xenotif®', item: SITE },
      { '@type': 'ListItem', position: 2, name: t('hubTitle'), item: hubUrl },
      { '@type': 'ListItem', position: 3, name: detail.name, item: url },
    ],
  }
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: detail.name,
    description: detail.technique,
    step: detail.instructions.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: `${i + 1}`, text: s })),
  }

  return (
    <div className="min-h-screen bg-sport-dark text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />

      <section className="relative overflow-hidden border-b border-sport-border bg-gradient-to-br from-sport-orange/15 via-sport-dark to-sport-dark">
        <div className="max-w-5xl mx-auto px-6 py-14 md:py-16">
          <Link href="/exercices" className="inline-flex items-center gap-1.5 text-xs font-bold text-sport-gray hover:text-white transition-colors mb-6">
            <ArrowLeft size={13} aria-hidden="true" /> {t('backToHub')}
          </Link>
          <p className="text-[11px] font-bold tracking-[2px] uppercase text-sport-orange mb-3">{t('eyebrow')}</p>
          <h1 className="text-4xl md:text-5xl font-black leading-tight">{detail.name}</h1>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-12">
        <ExerciceDetail detail={detail} locale={locale} />

        <div className="mt-10 rounded-2xl border border-sport-orange/30 bg-gradient-to-br from-sport-orange/15 via-sport-card to-sport-card p-8 text-center">
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
