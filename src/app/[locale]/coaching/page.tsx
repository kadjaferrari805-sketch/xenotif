import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Sparkles, Clock, TrendingUp, RefreshCw, ArrowRight, Bot, Eye } from 'lucide-react'
import { Tilt3D } from '@/components/premium/Tilt3D'
import { ProofBar } from '@/components/home/ProofBar'
import { SectionHeader } from '@/components/ui/SectionHeader'

const SITE = 'https://xenotif.com'

// Page marketing (pas de fonctionnalité) : présente le coach IA existant
// (dashboard/coach, réservé aux membres) et renvoie vers l'inscription ou
// l'aperçu public /dashboard-preview - aucune messagerie humaine n'existe
// aujourd'hui, la page ne doit pas le laisser croire.
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'coaching' })
  const languages: Record<string, string> = {
    fr: `${SITE}/coaching`,
    en: `${SITE}/en/coaching`,
    de: `${SITE}/de/coaching`,
    'x-default': `${SITE}/coaching`,
  }
  return {
    // `absolute` : metaTitle contient déjà "- Xenotif®" - le template racine
    // (`%s | Xenotif®`) dupliquerait la marque sans ce garde.
    title: { absolute: t('metaTitle') },
    description: t('metaDescription'),
    alternates: { canonical: languages[locale] ?? languages.fr, languages },
    openGraph: {
      title: t('metaTitle'),
      description: t('metaDescription'),
      url: languages[locale] ?? languages.fr,
      type: 'website',
    },
  }
}

const FEATURE_ICONS = [Sparkles, Clock, TrendingUp, RefreshCw]
const FEATURE_ACCENT = ['text-sport-orange', 'text-sport-blue', 'text-sport-lime', 'text-sport-orange']

export default async function CoachingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'coaching' })
  const features = t.raw('features') as { title: string; text: string }[]

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Xenotif®', item: SITE },
      { '@type': 'ListItem', position: 2, name: t('eyebrow'), item: `${SITE}/coaching` },
    ],
  }

  return (
    <div className="min-h-screen bg-sport-dark">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-sport-border py-24 px-6">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #FF6B00 0%, transparent 50%)' }}
        />
        <div aria-hidden="true" className="glow-orange-soft top-10 left-1/2 -translate-x-1/2 h-80 w-80" />
        <div className="relative max-w-3xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 text-sport-orange font-bold text-sm uppercase tracking-widest mb-4">
            <Bot size={16} aria-hidden="true" /> {t('eyebrow')}
          </span>
          <h1 className="text-3d text-4xl md:text-6xl font-black text-sport-fg mb-6 leading-tight">
            {t.rich('title', { o: (c) => <span className="text-sport-orange">{c}</span> })}
          </h1>
          <p className="text-sport-gray text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-8">
            {t('subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup" className="btn-primary">
              {t('ctaJoin')} <ArrowRight size={15} aria-hidden="true" />
            </Link>
            <Link href="/dashboard-preview" className="btn-secondary">
              <Eye size={15} aria-hidden="true" /> {t('ctaPreview')}
            </Link>
          </div>
        </div>
      </section>

      {/* Fonctionnalités */}
      <section className="section-white px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-title text-3d mb-14 text-center">{t('featuresTitle')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => {
              const Icon = FEATURE_ICONS[i] ?? Sparkles
              return (
                <Tilt3D key={f.title} max={12} className="relative h-full rounded-2xl">
                  <div className="card-base h-full p-6 flex flex-col gap-4">
                    <div className={`w-12 h-12 rounded-xl border border-sport-border bg-sport-dark flex items-center justify-center ${FEATURE_ACCENT[i]}`}>
                      <Icon size={22} aria-hidden="true" />
                    </div>
                    <h3 className="text-base font-black text-sport-fg">{f.title}</h3>
                    <p className="text-sm text-sport-gray leading-relaxed">{f.text}</p>
                  </div>
                </Tilt3D>
              )
            })}
          </div>
        </div>
      </section>

      {/* Aperçu sans compte */}
      <section className="section-tint px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="section-title text-3d mb-4">{t('previewTitle')}</h2>
          <p className="text-sport-gray text-base md:text-lg leading-relaxed mb-8">{t('previewText')}</p>
          <Link href="/dashboard-preview" className="btn-primary">
            <Eye size={15} aria-hidden="true" /> {t('previewCta')}
          </Link>
        </div>
      </section>

      {/* Chiffres */}
      <div className="section-white pt-2">
        <div className="max-w-6xl mx-auto px-6 mb-2">
          <SectionHeader label={t('eyebrow')} title={t('statsTitle')} subtitle={t('statsSubtitle')} />
        </div>
        <ProofBar />
      </div>

      {/* CTA */}
      <section className="section-tint px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="section-title text-3d mb-4">
            {t.rich('ctaTitle', { o: (c) => <span className="text-sport-orange">{c}</span> })}
          </h2>
          <p className="text-sport-gray mb-8">{t('ctaSubtitle')}</p>
          <Link href="/auth/signup" className="btn-primary">
            {t('ctaJoin')} <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  )
}
