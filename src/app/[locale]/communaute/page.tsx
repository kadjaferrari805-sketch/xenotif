import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Globe, PlayCircle, MessageCircle, ArrowRight, ShoppingBag, Users } from 'lucide-react'
import { ProofBar } from '@/components/home/ProofBar'
import { Reviews } from '@/components/home/Reviews'
import { SectionHeader } from '@/components/ui/SectionHeader'

const SITE = 'https://xenotif.com'

// Page marketing (preuve sociale) : réutilise les vrais avis (Reviews) et les
// vrais chiffres (ProofBar) déjà affichés sur l'accueil - pas de faux fil
// d'actualité/forum, aucune fonctionnalité communautaire n'existe aujourd'hui.
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'communaute' })
  const languages: Record<string, string> = {
    fr: `${SITE}/communaute`,
    en: `${SITE}/en/communaute`,
    de: `${SITE}/de/communaute`,
    'x-default': `${SITE}/communaute`,
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

// Mêmes comptes que le footer (src/components/layout/Footer.tsx) - une seule
// source de vérité serait préférable mais Footer.tsx définit sa propre liste
// en dur ; dupliqué ici pour éviter un import cross-layout non nécessaire.
const SOCIAL = [
  { Icon: Globe,         label: 'Instagram Xenotif', href: 'https://instagram.com/xenotif' },
  { Icon: PlayCircle,    label: 'YouTube Xenotif',   href: 'https://youtube.com/@xenotif' },
  { Icon: MessageCircle, label: 'Twitter / X Xenotif', href: 'https://twitter.com/xenotif' },
]

export default async function CommunautePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'communaute' })

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Xenotif®', item: SITE },
      { '@type': 'ListItem', position: 2, name: t('eyebrow'), item: `${SITE}/communaute` },
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
        <div aria-hidden="true" className="glow-orange-soft top-10 right-10 h-72 w-72" />
        <div className="relative max-w-3xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 text-sport-orange font-bold text-sm uppercase tracking-widest mb-4">
            <Users size={16} aria-hidden="true" /> {t('eyebrow')}
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
            <Link href="/boutique" className="btn-secondary">
              <ShoppingBag size={15} aria-hidden="true" /> {t('ctaShop')}
            </Link>
          </div>
        </div>
      </section>

      {/* Chiffres */}
      <div className="section-white pt-2">
        <div className="max-w-6xl mx-auto px-6 mb-2">
          <SectionHeader label={t('eyebrow')} title={t('statsTitle')} subtitle={t('statsSubtitle')} />
        </div>
        <ProofBar />
      </div>

      {/* Avis vérifiés (réutilise le composant homepage) */}
      <Reviews />

      {/* Réseaux sociaux */}
      <section className="section-white px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="section-title text-3d mb-3">{t('socialTitle')}</h2>
          <p className="text-sport-gray text-base mb-8">{t('socialSubtitle')}</p>
          <div className="flex items-center justify-center gap-4">
            {SOCIAL.map(({ Icon, label, href }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-sport-border text-sport-gray hover:text-sport-orange hover:border-sport-orange/50 transition-all hover:-translate-y-0.5"
              >
                <Icon size={19} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </section>

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
