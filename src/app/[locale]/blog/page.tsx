import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getAllPostsLocalized, getPostsByCategoryLocalized } from '@/lib/blog/posts.en'
import type { BlogPost } from '@/lib/blog/posts'
import { BlogSearchableGrid } from '@/components/blog/BlogSearchableGrid'

const SITE = 'https://xenotif.com'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'blog' })
  const languages: Record<string, string> = {
    fr: `${SITE}/blog`,
    en: `${SITE}/en/blog`,
    de: `${SITE}/de/blog`,
    'x-default': `${SITE}/blog`,
  }
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    keywords: t.raw('keywords') as string[],
    alternates: { canonical: languages[locale] ?? languages.fr, languages },
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      url: languages[locale] ?? languages.fr,
      type: 'website',
    },
  }
}

const CATEGORY_VALUES: Array<BlogPost['category'] | 'Tous'> = [
  'Tous', 'Musculation', 'Nutrition', 'Running', 'HIIT', 'Récupération', 'Matériel',
]

const VALID_CATEGORIES: BlogPost['category'][] = ['Musculation', 'Nutrition', 'Running', 'Récupération', 'Matériel', 'HIIT']

function isValidCategory(value: string): value is BlogPost['category'] {
  return (VALID_CATEGORIES as string[]).includes(value)
}

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ categorie?: string }>
}) {
  const { locale } = await params
  const sp = await searchParams
  const t = await getTranslations('blog')

  const raw = sp?.categorie
  const activeCategory: BlogPost['category'] | undefined = raw && isValidCategory(raw) ? raw : undefined
  const posts = activeCategory ? getPostsByCategoryLocalized(activeCategory, locale) : getAllPostsLocalized(locale)
  const totalCount = getAllPostsLocalized(locale).length

  return (
    <div className="min-h-screen bg-sport-dark">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-sport-border py-20 px-6">
        <div
          className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #FF4500 0%, transparent 50%), radial-gradient(circle at 70% 50%, #A3FF00 0%, transparent 50%)' }}
        />
        <div className="relative max-w-4xl mx-auto text-center">
          <span className="inline-block text-sport-orange font-bold text-sm uppercase tracking-widest mb-4">
            {t('eyebrow')}
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            {t.rich('title', { o: (c) => <span className="text-sport-orange">{c}</span> })}
          </h1>
          <p className="text-sport-gray text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-sport-gray">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sport-lime" />
              {t('statsArticles', { count: totalCount })}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sport-orange" />
              {t('statsExperts')}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              {t('statsUpdated')}
            </span>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="sticky top-16 z-40 bg-sport-dark/90 backdrop-blur-lg border-b border-sport-border">
        <div className="max-w-6xl mx-auto px-6 py-4">
          {/* Carrousel snap mobile : accroche par pastille, défilement net */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide snap-x snap-proximity scroll-pl-6 scroll-smooth">
            {CATEGORY_VALUES.map(value => {
              const isActive = value === 'Tous' ? !activeCategory : activeCategory === value
              const href = value === 'Tous' ? '/blog' : `/blog?categorie=${encodeURIComponent(value)}`
              const label = value === 'Tous' ? t('allCategory') : t(`categories.${value}`)
              return (
                <Link
                  key={value}
                  href={href}
                  className={`snap-start flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-sport-orange text-white shadow-lg shadow-sport-orange/20'
                      : 'bg-sport-card border border-sport-border text-sport-gray hover:text-white hover:border-sport-orange/30'
                  }`}
                >
                  {label}
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="max-w-6xl mx-auto px-6 py-14">
        {activeCategory && (
          <div className="mb-8">
            <h2 className="text-xl font-black text-white">
              {t('categoryHeading', { count: posts.length, category: t(`categories.${activeCategory}`) })}
            </h2>
          </div>
        )}

        {posts.length === 0 ? (
          <div className="text-center py-20 text-sport-gray">
            <p className="text-xl font-semibold">{t('emptyCategory')}</p>
            <Link href="/blog" className="mt-4 inline-block text-sport-orange hover:underline">
              {t('seeAll')}
            </Link>
          </div>
        ) : (
          <BlogSearchableGrid posts={posts} />
        )}
      </section>

      {/* CTA Section */}
      <section className="border-t border-sport-border py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-black text-white mb-4">
            {t.rich('ctaTitle', { o: (c) => <span className="text-sport-orange">{c}</span> })}
          </h2>
          <p className="text-sport-gray mb-8">{t('ctaSubtitle')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/boutique" className="px-8 py-3 bg-sport-orange text-white rounded-full font-bold hover:bg-orange-600 transition-all shadow-lg shadow-sport-orange/20">
              {t('ctaShop')}
            </Link>
            <Link href="/auth/signup" className="px-8 py-3 border border-sport-border text-white rounded-full font-bold hover:border-sport-orange/40 transition-all">
              {t('ctaJoin')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
