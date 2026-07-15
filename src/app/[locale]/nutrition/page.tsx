import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import { ArrowRight, Salad } from 'lucide-react'
import { OUTILS } from '@/lib/outils/registry'
import { getPostsByCategoryLocalized } from '@/lib/blog/posts.en'

const SITE = 'https://xenotif.com'

// Page hub Nutrition : agrège l'existant (calculateurs déjà en prod + vrais
// articles blog catégorie Nutrition) plutôt que d'inventer une base de
// recettes/plans alimentaires qui n'existe pas côté produit.
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'nutritionPage' })
  const languages: Record<string, string> = {
    fr: `${SITE}/nutrition`,
    en: `${SITE}/en/nutrition`,
    de: `${SITE}/de/nutrition`,
    'x-default': `${SITE}/nutrition`,
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

export default async function NutritionPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'nutritionPage' })
  const to = await getTranslations({ locale, namespace: 'outils' })
  const articles = getPostsByCategoryLocalized('Nutrition', locale).slice(0, 3)

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Xenotif®', item: SITE },
      { '@type': 'ListItem', position: 2, name: t('eyebrow'), item: `${SITE}/nutrition` },
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
        <div aria-hidden="true" className="glow-orange-soft top-10 left-10 h-72 w-72" />
        <div className="relative max-w-3xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 text-sport-orange font-bold text-sm uppercase tracking-widest mb-4">
            <Salad size={16} aria-hidden="true" /> {t('eyebrow')}
          </span>
          <h1 className="text-3d text-4xl md:text-6xl font-black text-sport-fg mb-6 leading-tight">
            {t.rich('title', { o: (c) => <span className="text-sport-orange">{c}</span> })}
          </h1>
          <p className="text-sport-gray text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* Calculateurs */}
      <section className="section-white px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title text-3d mb-3">{t('calcTitle')}</h2>
            <p className="text-sport-gray text-base">{t('calcSubtitle')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {OUTILS.map((o) => (
              <Link
                key={o.slug}
                href={`/outils/${o.slug}`}
                className="group card-base p-6 hover:border-sport-orange/50 flex items-start gap-4"
              >
                <span className="text-3xl shrink-0" aria-hidden="true">{o.emoji}</span>
                <div>
                  <h3 className="text-base font-black text-sport-fg mb-1 group-hover:text-sport-orange transition-colors">{to(`${o.key}.short`)}</h3>
                  <p className="text-sm text-sport-gray leading-relaxed">{to(`${o.key}.subtitle`)}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/outils" className="inline-flex items-center gap-1.5 text-sport-orange text-sm font-bold hover:underline">
              {t('calcCta')} <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Articles nutrition (vrais articles blog, catégorie Nutrition) */}
      {articles.length > 0 && (
        <section className="section-tint px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="section-title text-3d mb-3">{t('articlesTitle')}</h2>
              <p className="text-sport-gray text-base">{t('articlesSubtitle')}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {articles.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block h-full overflow-hidden card-base hover:border-sport-orange/30 transition-all duration-300"
                >
                  <div className="relative h-40 overflow-hidden">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      style={{ objectPosition: post.coverPosition }}
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-black text-sport-fg text-base leading-snug mb-2 group-hover:text-sport-orange transition-colors line-clamp-2">{post.title}</h3>
                    <p className="text-sport-gray text-xs leading-relaxed line-clamp-2">{post.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/blog?categorie=Nutrition" className="inline-flex items-center gap-1.5 text-sport-orange text-sm font-bold hover:underline">
                {t('articlesCta')} <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className={articles.length > 0 ? 'section-white px-6' : 'section-tint px-6'}>
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
