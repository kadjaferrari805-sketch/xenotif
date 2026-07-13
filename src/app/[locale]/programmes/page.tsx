import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { ArrowRight } from 'lucide-react'
import { programsForLocale } from '@/lib/programs/registry'

const SITE = 'https://xenotif.com'
const LOCS = ['fr', 'en', 'de'] as const

function hubUrl(locale: string): string {
  return locale === 'fr' ? `${SITE}/programmes` : `${SITE}/${locale}/programmes`
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'programs' })
  const languages: Record<string, string> = { 'x-default': hubUrl('fr') }
  for (const l of LOCS) languages[l] = hubUrl(l)
  return {
    title: t('hubMetaTitle'),
    description: t('hubMetaDesc'),
    alternates: { canonical: hubUrl(locale), languages },
  }
}

// Hub des programmes : page catégorie SEO + maillage interne vers chaque programme.
export default async function ProgramsHubPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const programs = programsForLocale(locale)
  if (programs.length === 0) notFound()
  const t = await getTranslations('programs')

  const listSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: programs.map(({ slug, guide }, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: guide.title,
      url: locale === 'fr' ? `${SITE}/programmes/${slug}` : `${SITE}/${locale}/programmes/${slug}`,
    })),
  }

  return (
    <div className="min-h-screen bg-sport-dark text-sport-fg">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema) }} />
      <section className="max-w-5xl mx-auto px-6 py-16 md:py-20">
        <p className="text-[11px] font-bold tracking-[2px] uppercase text-sport-orange mb-3">{t('hubEyebrow')}</p>
        <h1 className="text-4xl md:text-5xl font-black mb-4">{t('hubTitle')}</h1>
        <p className="text-lg text-sport-fg max-w-2xl mb-12">{t('hubSubtitle')}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {programs.map(({ slug, guide }) => (
            <Link
              key={slug}
              href={`/programmes/${slug}`}
              className="group bg-sport-card border border-sport-border rounded-2xl p-6 hover:border-sport-orange/50 transition-all hover:-translate-y-0.5"
            >
              <h2 className="text-xl font-black mb-2 group-hover:text-sport-orange transition-colors">{guide.title}</h2>
              <p className="text-sm text-sport-gray leading-relaxed mb-4">{guide.subtitle}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {guide.level && <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-sport-orange/10 text-sport-orange">{guide.level}</span>}
                {guide.duration && <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-sport-dark border border-sport-border text-sport-gray">{guide.duration}</span>}
              </div>
              <span className="inline-flex items-center gap-1.5 text-sport-orange text-sm font-bold">
                {t('seeProgram')} <ArrowRight size={14} aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
