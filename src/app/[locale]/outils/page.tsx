import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { ArrowRight } from 'lucide-react'
import { OUTILS } from '@/lib/outils/registry'

const SITE = 'https://xenotif.com'
const LOCS = ['fr', 'en', 'de'] as const

function hubUrl(locale: string): string {
  return locale === 'fr' ? `${SITE}/outils` : `${SITE}/${locale}/outils`
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'outils' })
  const languages: Record<string, string> = { 'x-default': hubUrl('fr') }
  for (const l of LOCS) languages[l] = hubUrl(l)
  return {
    title: t('hubMetaTitle'),
    description: t('hubMetaDesc'),
    alternates: { canonical: hubUrl(locale), languages },
  }
}

// Hub des calculateurs : page catégorie SEO + maillage vers chaque outil.
export default async function OutilsHubPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'outils' })

  const listSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: OUTILS.map((o, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t(`${o.key}.title`),
      url: locale === 'fr' ? `${SITE}/outils/${o.slug}` : `${SITE}/${locale}/outils/${o.slug}`,
    })),
  }

  return (
    <div className="min-h-screen bg-sport-dark text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema) }} />
      <section className="max-w-5xl mx-auto px-6 py-16 md:py-20">
        <p className="text-[11px] font-bold tracking-[2px] uppercase text-sport-orange mb-3">{t('hubEyebrow')}</p>
        <h1 className="text-4xl md:text-5xl font-black mb-4">{t('hubTitle')}</h1>
        <p className="text-lg text-sport-gray max-w-2xl mb-12">{t('hubSubtitle')}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {OUTILS.map((o) => (
            <Link
              key={o.slug}
              href={`/outils/${o.slug}`}
              className="group bg-sport-card border border-sport-border rounded-2xl p-6 hover:border-sport-orange/50 transition-all hover:-translate-y-0.5 flex items-start gap-4"
            >
              <span className="text-3xl shrink-0" aria-hidden="true">{o.emoji}</span>
              <div>
                <h2 className="text-lg font-black mb-1.5 group-hover:text-sport-orange transition-colors">{t(`${o.key}.title`)}</h2>
                <p className="text-sm text-sport-gray leading-relaxed mb-3">{t(`${o.key}.subtitle`)}</p>
                <span className="inline-flex items-center gap-1.5 text-sport-orange text-sm font-bold">
                  {t('seeCalc')} <ArrowRight size={14} aria-hidden="true" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
