import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { ArrowRight, CheckCircle, ChevronDown, Lock, Zap } from 'lucide-react'
import { getLocalizedProgram, programSlugs, localesForProgram } from '@/lib/programs/registry'
import { GuideBlocks } from '@/components/programs/GuideBlocks'

const SITE = 'https://xenotif.com'

// FR à la racine (locale par défaut), autres préfixées.
function progUrl(slug: string, locale: string): string {
  return locale === 'fr' ? `${SITE}/programmes/${slug}` : `${SITE}/${locale}/programmes/${slug}`
}

export function generateStaticParams() {
  return programSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }): Promise<Metadata> {
  const { slug, locale } = await params
  const program = getLocalizedProgram(slug, locale)
  if (!program) return {}
  const languages: Record<string, string> = { 'x-default': progUrl(slug, 'fr') }
  for (const l of localesForProgram(slug)) languages[l] = progUrl(slug, l)
  return {
    title: program.title,
    description: program.subtitle,
    alternates: { canonical: progUrl(slug, locale), languages },
    openGraph: { title: `${program.title} | Xenotif®`, description: program.subtitle, url: progUrl(slug, locale), type: 'article' },
  }
}

export default async function ProgramPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params
  const program = getLocalizedProgram(slug, locale)
  if (!program) notFound()
  const t = await getTranslations('programs')

  // Aperçu SEO généreux : jusqu'au début du 4e chapitre (h1). Le reste (calendrier
  // jour par jour, séances détaillées, suivi) est réservé aux membres → conversion.
  let h1 = 0
  let cut = program.blocks.length
  for (let i = 0; i < program.blocks.length; i++) {
    if (program.blocks[i].type === 'h1') { h1++; if (h1 === 4) { cut = i; break } }
  }
  const preview = program.blocks.slice(0, cut)
  const gated = cut < program.blocks.length

  const url = progUrl(slug, locale)
  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: program.title,
    description: program.subtitle,
    inLanguage: locale,
    url,
    provider: { '@type': 'Organization', name: 'Xenotif®', url: SITE },
  }
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Xenotif®', item: SITE },
      { '@type': 'ListItem', position: 2, name: program.title, item: url },
    ],
  }

  // FAQ localisée (5 questions communes, titre du programme interpolé). Rendue à
  // l'écran ET en FAQPage schema — le markup doit refléter du contenu visible.
  const faq = [1, 2, 3, 4, 5].map((n) => ({
    q: t(`faqQ${n}` as 'faqQ1', { title: program.title }),
    a: t(`faqA${n}` as 'faqA1', { title: program.title }),
  }))
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }

  return (
    <div className="min-h-screen bg-sport-dark text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="relative overflow-hidden border-b border-sport-border bg-gradient-to-br from-sport-orange/15 via-sport-dark to-sport-dark">
        <div className="max-w-3xl mx-auto px-6 py-16 md:py-20">
          <p className="text-[11px] font-bold tracking-[2px] uppercase text-sport-orange mb-3">{t('eyebrow')}</p>
          <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4">{program.title}</h1>
          <p className="text-lg text-sport-gray leading-relaxed mb-6">{program.subtitle}</p>
          <div className="flex flex-wrap gap-3">
            {program.level && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-sport-card border border-sport-border">
                <Zap size={12} aria-hidden="true" className="text-sport-orange" /> {program.level}
              </span>
            )}
            {program.duration && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-sport-card border border-sport-border">
                <CheckCircle size={12} aria-hidden="true" className="text-sport-orange" /> {program.duration}
              </span>
            )}
          </div>
          <Link
            href="/auth/signup?plan=pro"
            className="mt-8 inline-flex items-center gap-2 bg-sport-orange text-white px-7 py-3.5 rounded-full font-bold text-sm hover:bg-orange-600 active:scale-95 transition-all shadow-lg shadow-sport-orange/25"
          >
            {t('startFree')} <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-14">
        <GuideBlocks blocks={preview} />

        {gated && (
          <div className="mt-10 rounded-2xl border border-sport-orange/30 bg-gradient-to-br from-sport-orange/15 via-sport-card to-sport-card p-8 text-center">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-sport-orange/15 border border-sport-orange/30 flex items-center justify-center mb-4">
              <Lock size={22} aria-hidden="true" className="text-sport-orange" />
            </div>
            <h2 className="text-xl font-black mb-2">{t('gateTitle')}</h2>
            <p className="text-sport-gray text-sm max-w-md mx-auto mb-6">{t('gateDesc')}</p>
            <Link
              href="/auth/signup?plan=pro"
              className="inline-flex items-center gap-2 bg-sport-orange text-white px-7 py-3.5 rounded-full font-bold text-sm hover:bg-orange-600 active:scale-95 transition-all"
            >
              {t('startTrial')} <ArrowRight size={15} aria-hidden="true" />
            </Link>
            <p className="text-[11px] text-sport-gray mt-3">{t('trialNote')}</p>
          </div>
        )}
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-16">
        <h2 className="text-2xl md:text-3xl font-black mb-6">{t('faqTitle')}</h2>
        <div className="space-y-3">
          {faq.map(({ q, a }, i) => (
            <details key={i} className="group bg-sport-card border border-sport-border rounded-2xl px-5 py-4">
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-bold text-white">
                {q}
                <ChevronDown size={18} aria-hidden="true" className="shrink-0 text-sport-orange transition-transform group-open:rotate-180" />
              </summary>
              <p className="text-sm text-sport-gray leading-relaxed mt-3">{a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  )
}
