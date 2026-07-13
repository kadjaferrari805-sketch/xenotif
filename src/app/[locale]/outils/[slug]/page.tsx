import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { outilSlugs, outilBySlug } from '@/lib/outils/registry'
import { CaloriesCalc } from '@/components/outils/CaloriesCalc'
import { ImcCalc } from '@/components/outils/ImcCalc'
import { MacrosCalc } from '@/components/outils/MacrosCalc'
import { OneRmCalc } from '@/components/outils/OneRmCalc'

const SITE = 'https://xenotif.com'
const LOCS = ['fr', 'en', 'de'] as const

const CALC = {
  calories: CaloriesCalc,
  imc: ImcCalc,
  macros: MacrosCalc,
  '1rm': OneRmCalc,
} as const

function outilUrl(slug: string, locale: string): string {
  return locale === 'fr' ? `${SITE}/outils/${slug}` : `${SITE}/${locale}/outils/${slug}`
}

export function generateStaticParams() {
  return outilSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }): Promise<Metadata> {
  const { slug, locale } = await params
  const o = outilBySlug(slug)
  if (!o) return {}
  const t = await getTranslations({ locale, namespace: 'outils' })
  const languages: Record<string, string> = { 'x-default': outilUrl(slug, 'fr') }
  for (const l of LOCS) languages[l] = outilUrl(slug, l)
  return {
    title: t(`${o.key}.metaTitle`),
    description: t(`${o.key}.metaDesc`),
    alternates: { canonical: outilUrl(slug, locale), languages },
  }
}

export default async function OutilPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params
  const o = outilBySlug(slug)
  const Calc = CALC[slug as keyof typeof CALC]
  if (!o || !Calc) notFound()
  const t = await getTranslations({ locale, namespace: 'outils' })

  const url = outilUrl(slug, locale)
  const hubUrl = locale === 'fr' ? `${SITE}/outils` : `${SITE}/${locale}/outils`
  const appSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: t(`${o.key}.title`),
    description: t(`${o.key}.metaDesc`),
    applicationCategory: 'HealthApplication',
    operatingSystem: 'Web',
    url,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
    provider: { '@type': 'Organization', name: 'Xenotif®', url: SITE },
  }
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Xenotif®', item: SITE },
      { '@type': 'ListItem', position: 2, name: t('hubTitle'), item: hubUrl },
      { '@type': 'ListItem', position: 3, name: t(`${o.key}.title`), item: url },
    ],
  }

  return (
    <div className="min-h-screen bg-sport-dark text-sport-fg">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section className="max-w-3xl mx-auto px-6 py-14 md:py-16">
        <Link href="/outils" className="inline-flex items-center gap-1.5 text-xs font-bold text-sport-gray hover:text-sport-fg transition-colors mb-6">
          <ArrowLeft size={13} aria-hidden="true" /> {t('backToHub')}
        </Link>
        <p className="text-[11px] font-bold tracking-[2px] uppercase text-sport-orange mb-3">{t('hubEyebrow')}</p>
        <h1 className="text-3xl md:text-4xl font-black mb-3">{t(`${o.key}.title`)}</h1>
        <p className="text-base text-sport-gray mb-8">{t(`${o.key}.subtitle`)}</p>

        <div className="bg-sport-card/40 border border-sport-border rounded-3xl p-6 md:p-8 mb-8">
          <Calc />
        </div>

        <p className="text-sm text-sport-gray leading-relaxed mb-10">{t(`${o.key}.intro`)}</p>

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
