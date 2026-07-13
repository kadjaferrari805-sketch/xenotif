import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { ArrowRight } from 'lucide-react'
import { DISCIPLINE_SLUGS } from '@/lib/disciplines-nav'

const SITE = 'https://xenotif.com'
const LOCS = ['fr', 'en', 'de'] as const

function hubUrl(locale: string): string {
  return locale === 'fr' ? `${SITE}/disciplines` : `${SITE}/${locale}/disciplines`
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'disciplinesHub' })
  const languages: Record<string, string> = { 'x-default': hubUrl('fr') }
  for (const l of LOCS) languages[l] = hubUrl(l)
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: { canonical: hubUrl(locale), languages },
  }
}

// Index des disciplines : page catégorie SEO + maillage vers chaque discipline.
export default async function DisciplinesHubPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'disciplinesHub' })
  const tn = await getTranslations({ locale, namespace: 'common.nav' })

  const listSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: DISCIPLINE_SLUGS.map((d, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: tn(`disc.${d.slug}`),
      url: locale === 'fr' ? `${SITE}/disciplines/${d.slug}` : `${SITE}/${locale}/disciplines/${d.slug}`,
    })),
  }

  return (
    <div className="min-h-screen bg-sport-dark text-sport-fg">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema) }} />
      <section className="max-w-5xl mx-auto px-6 py-16 md:py-20">
        <p className="text-[11px] font-bold tracking-[2px] uppercase text-sport-orange mb-3">{t('eyebrow')}</p>
        <h1 className="text-4xl md:text-5xl font-black mb-4">{t('title')}</h1>
        <p className="text-lg text-sport-gray max-w-2xl mb-12">{t('subtitle')}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DISCIPLINE_SLUGS.map((d) => (
            <Link
              key={d.slug}
              href={`/disciplines/${d.slug}`}
              className="group bg-sport-card border border-sport-border rounded-2xl p-6 hover:border-sport-orange/50 transition-all hover:-translate-y-0.5 flex items-center gap-4"
            >
              <span className="text-3xl shrink-0" aria-hidden="true">{d.emoji}</span>
              <span className="flex-1 text-lg font-black group-hover:text-sport-orange transition-colors">{tn(`disc.${d.slug}`)}</span>
              <ArrowRight size={16} aria-hidden="true" className="text-sport-gray group-hover:text-sport-orange transition-colors" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
