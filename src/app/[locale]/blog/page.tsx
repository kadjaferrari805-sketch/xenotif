import type { Metadata } from 'next'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getAllPostsLocalized, getPostsByCategoryLocalized } from '@/lib/blog/posts.en'
import type { BlogPost } from '@/lib/blog/posts'

const SITE = 'https://xenotif.com'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'blog' })
  const languages: Record<string, string> = {
    fr: `${SITE}/blog`,
    en: `${SITE}/en/blog`,
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

const CATEGORY_COLORS: Record<string, string> = {
  Musculation: 'bg-sport-orange/10 text-sport-orange border-sport-orange/20',
  Nutrition: 'bg-green-500/10 text-green-400 border-green-500/20',
  Running: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  HIIT: 'bg-red-500/10 text-red-400 border-red-500/20',
  Récupération: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Matériel: 'bg-sport-lime/10 text-sport-lime border-sport-lime/20',
}

function formatDate(isoDate: string, locale: string): string {
  return new Date(isoDate).toLocaleDateString(locale === 'en' ? 'en-US' : 'fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

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
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {CATEGORY_VALUES.map(value => {
              const isActive = value === 'Tous' ? !activeCategory : activeCategory === value
              const href = value === 'Tous' ? '/blog' : `/blog?categorie=${encodeURIComponent(value)}`
              const label = value === 'Tous' ? t('allCategory') : t(`categories.${value}`)
              return (
                <Link
                  key={value}
                  href={href}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => {
              const colorClass = CATEGORY_COLORS[post.category] ?? 'bg-sport-orange/10 text-sport-orange border-sport-orange/20'
              return (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block overflow-hidden rounded-2xl border border-sport-border bg-sport-card hover:border-sport-orange/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-sport-orange/5"
                >
                  <div className="relative h-52 overflow-hidden">
                    <Image src={post.coverImage} alt={post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" style={{ objectPosition: post.coverPosition }} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-sport-dark/80 via-transparent to-transparent" />
                    <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full border ${colorClass}`}>
                      {t(`categories.${post.category}`)}
                    </span>
                  </div>
                  <div className="p-5">
                    <h2 className="font-black text-white text-lg leading-snug mb-2 group-hover:text-sport-orange transition-colors line-clamp-2">{post.title}</h2>
                    <p className="text-sport-gray text-sm leading-relaxed line-clamp-3 mb-4">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-sport-gray border-t border-sport-border pt-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-sport-orange/20 flex items-center justify-center text-sport-orange font-black text-xs">{post.author.charAt(0)}</div>
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span>{formatDate(post.publishedAt, locale)}</span>
                        <span className="text-sport-orange">•</span>
                        <span>{t('readingTime', { minutes: post.readingMinutes })}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
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
