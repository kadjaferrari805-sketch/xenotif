import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { ArrowRight } from 'lucide-react'
import { ChallengeCards } from '@/components/challenges/ChallengeCards'
import { CHALLENGES } from '@/lib/challenges'

const SITE = 'https://xenotif.com'
const LOCS = ['fr', 'en', 'de'] as const

// FR à la racine (locale par défaut), autres préfixées.
function defisUrl(locale: string): string {
  return locale === 'fr' ? `${SITE}/defis` : `${SITE}/${locale}/defis`
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home.challenges' })
  const languages: Record<string, string> = { 'x-default': defisUrl('fr') }
  for (const l of LOCS) languages[l] = defisUrl(l)
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: { canonical: defisUrl(locale), languages },
  }
}

// Page « Défis » : landing SEO + engagement. Objectifs guidés (durée, niveau,
// but) reliés aux programmes ; CTA essai gratuit.
export default async function DefisPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home.challenges' })
  const items = t.raw('items') as { title: string; desc: string }[]

  const listSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: CHALLENGES.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: items[i]?.title,
      description: items[i]?.desc,
    })),
  }

  return (
    <div className="min-h-screen bg-sport-dark text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema) }} />
      <section className="max-w-5xl mx-auto px-6 py-16 md:py-20">
        <p className="text-[11px] font-black tracking-[3px] uppercase text-sport-orange mb-3">{t('eyebrow')}</p>
        <h1 className="text-4xl md:text-5xl font-black mb-4">{t('pageTitle')}</h1>
        <p className="text-lg text-sport-gray max-w-2xl mb-12">{t('pageSubtitle')}</p>

        <ChallengeCards />

        <div className="mt-14 rounded-2xl border border-sport-orange/30 bg-gradient-to-br from-sport-orange/15 via-sport-card to-sport-card p-8 text-center">
          <h2 className="text-xl md:text-2xl font-black mb-2">{t('title')}</h2>
          <p className="text-sport-gray text-sm max-w-md mx-auto mb-6">{t('subtitle')}</p>
          <Link
            href="/auth/signup?plan=pro"
            className="inline-flex items-center gap-2 bg-sport-orange text-white px-7 py-3.5 rounded-full font-bold text-sm hover:bg-orange-600 active:scale-95 transition-all"
          >
            {t('startChallenge')} <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  )
}
