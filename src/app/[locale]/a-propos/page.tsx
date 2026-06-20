import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Target, Sparkles, Repeat, Users, ArrowRight, ShoppingBag } from 'lucide-react'
import { Tilt3D } from '@/components/premium/Tilt3D'
import { ProofBar } from '@/components/home/ProofBar'
import { SectionHeader } from '@/components/ui/SectionHeader'

const SITE = 'https://xenotif.com'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'about' })
  const languages: Record<string, string> = {
    fr: `${SITE}/a-propos`,
    en: `${SITE}/en/a-propos`,
    de: `${SITE}/de/a-propos`,
    'x-default': `${SITE}/a-propos`,
  }
  return {
    title: t('metaTitle'),
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

const VALUE_ICONS = [Target, Sparkles, Repeat, Users]
const VALUE_ACCENT = ['text-sport-orange', 'text-sport-blue', 'text-sport-lime', 'text-sport-orange']

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'about' })
  const values = t.raw('values') as { title: string; text: string }[]

  return (
    <div className="min-h-screen bg-sport-dark">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-sport-border py-24 px-6">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle at 25% 40%, #FF4500 0%, transparent 50%), radial-gradient(circle at 75% 60%, #A3FF00 0%, transparent 50%)' }}
        />
        <div className="relative max-w-3xl mx-auto text-center">
          <span className="inline-block text-sport-orange font-bold text-sm uppercase tracking-widest mb-4">
            {t('eyebrow')}
          </span>
          <h1 className="text-3d text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            {t.rich('title', { o: (c) => <span className="text-sport-orange">{c}</span> })}
          </h1>
          <p className="text-sport-gray text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-8">
            {t('subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup" className="btn-primary">
              {t('ctaJoin')} <ArrowRight size={15} aria-hidden="true" />
            </Link>
            <Link href="/boutique" className="btn-secondary">
              <ShoppingBag size={15} aria-hidden="true" /> {t('ctaShop')}
            </Link>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="section-title text-3d mb-5">{t('missionTitle')}</h2>
          <p className="text-sport-gray text-base md:text-lg leading-relaxed">{t('missionText')}</p>
        </div>
      </section>

      {/* Valeurs */}
      <section className="py-20 px-6 bg-sport-card border-y border-sport-border">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-title text-3d mb-14 text-center">{t('valuesTitle')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v, i) => {
              const Icon = VALUE_ICONS[i] ?? Target
              return (
                <Tilt3D key={v.title} max={12} className="relative h-full rounded-2xl">
                  <div className="card-base h-full p-6 flex flex-col gap-4">
                    <div className={`w-12 h-12 rounded-xl border border-sport-border bg-sport-dark flex items-center justify-center ${VALUE_ACCENT[i]}`}>
                      <Icon size={22} aria-hidden="true" />
                    </div>
                    <h3 className="text-base font-black text-white">{v.title}</h3>
                    <p className="text-sm text-sport-gray leading-relaxed">{v.text}</p>
                  </div>
                </Tilt3D>
              )
            })}
          </div>
        </div>
      </section>

      {/* Histoire */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="section-title text-3d mb-5">{t('storyTitle')}</h2>
          <p className="text-sport-gray text-base md:text-lg leading-relaxed">{t('storyText')}</p>
        </div>
      </section>

      {/* Chiffres (réutilise ProofBar) */}
      <div className="pt-2">
        <div className="max-w-6xl mx-auto px-6 mb-2">
          <SectionHeader label={t('eyebrow')} title={t('statsTitle')} subtitle={t('statsSubtitle')} />
        </div>
        <ProofBar />
      </div>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="section-title text-3d mb-4">
            {t.rich('ctaTitle', { o: (c) => <span className="text-sport-orange">{c}</span> })}
          </h2>
          <p className="text-sport-gray mb-8">{t('ctaSubtitle')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup" className="btn-primary">
              {t('ctaJoin')} <ArrowRight size={15} aria-hidden="true" />
            </Link>
            <Link href="/boutique" className="btn-secondary">
              <ShoppingBag size={15} aria-hidden="true" /> {t('ctaShop')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
