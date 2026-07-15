import type { Metadata } from 'next'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { getAllPosts } from '@/lib/blog/posts'
import type { ContentBlock } from '@/lib/blog/posts'
import { getPostBySlugLocalized, getRelatedPostsLocalized } from '@/lib/blog/posts.en'
import { formatPrice } from '@/lib/boutique/products'
import { getProductBySlugLocalized } from '@/lib/boutique/products.en'
import { getDisciplineMeta } from '@/lib/disciplines'
import { ProductCard } from '@/components/boutique/ProductCard'

// Maillage interne : chaque catégorie d'article pointe vers la discipline la plus proche.
const CATEGORY_DISCIPLINE: Record<string, string> = {
  Musculation: 'musculation',
  Running: 'running-cardio',
  HIIT: 'hiit',
  Nutrition: 'nutrition',
  Récupération: 'stretching',
  Matériel: 'musculation',
}

const SITE = 'https://xenotif.com'

// ─── Static Params ────────────────────────────────────────────────────────────
export async function generateStaticParams() {
  return getAllPosts().map(post => ({ slug: post.slug }))
}

// ─── Metadata ────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }): Promise<Metadata> {
  const { slug, locale } = await params
  const post = getPostBySlugLocalized(slug, locale)
  if (!post) return {}

  const path = `/blog/${post.slug}`
  const languages: Record<string, string> = {
    fr: `${SITE}${path}`,
    en: `${SITE}/en${path}`,
    de: `${SITE}/de${path}`,
    'x-default': `${SITE}${path}`,
  }

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    keywords: post.keywords,
    alternates: { canonical: languages[locale] ?? languages.fr, languages },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      type: 'article',
      url: languages[locale] ?? languages.fr,
      images: [{ url: post.coverImage, width: 1200, height: 630, alt: post.title }],
      publishedTime: post.publishedAt,
      authors: [post.author],
      siteName: 'Xenotif®',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metaTitle,
      description: post.metaDescription,
      images: [post.coverImage],
    },
  }
}

const CATEGORY_COLORS: Record<string, string> = {
  Musculation: 'bg-sport-orange/10 text-sport-orange border-sport-orange/20',
  Nutrition: 'bg-green-500/10 text-[#1E7F5A] border-green-500/20',
  Running: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  HIIT: 'bg-red-500/10 text-red-400 border-red-500/20',
  Récupération: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Matériel: 'bg-lime-500/10 text-sport-lime border-lime-500/20',
}

function formatDate(isoDate: string, locale: string): string {
  return new Date(isoDate).toLocaleDateString(locale === 'en' ? 'en-US' : 'fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

type BlockCtx = { locale: string; recommendedLabel: string; viewLabel: string }

// ─── ProductCta Mini Card ─────────────────────────────────────────────────────
function ProductCtaCard({ productSlug, reason, ctx }: { productSlug: string; reason: string; ctx: BlockCtx }) {
  const product = getProductBySlugLocalized(productSlug, ctx.locale)
  if (!product) return null

  const href = product.isAffiliate && product.amazon ? product.amazon.affiliateUrl : `/boutique/${product.slug}`
  const isExternal = product.isAffiliate && !!product.amazon

  return (
    <div className="my-8 rounded-2xl border border-sport-orange/20 bg-sport-card overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        <div className="relative sm:w-44 h-44 sm:h-auto flex-shrink-0 bg-sport-border/20">
          {product.images[0] && (
            <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="176px" />
          )}
        </div>
        <div className="p-5 flex flex-col justify-between gap-3">
          <div>
            <span className="text-sport-orange text-xs font-bold uppercase tracking-wide">{ctx.recommendedLabel}</span>
            <h3 className="text-sport-fg font-black text-base mt-1 leading-snug">{product.name}</h3>
            <p className="text-sport-gray text-sm mt-2 leading-relaxed">{reason}</p>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sport-lime font-black text-xl">{formatPrice(product.price_cents)}</span>
            <a
              href={href}
              {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer nofollow' } : {})}
              className="inline-flex items-center gap-2 px-4 py-2 bg-sport-orange text-white rounded-full text-sm font-bold hover:bg-orange-600 transition-all"
            >
              {ctx.viewLabel}
              {isExternal && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              )}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Content Block Renderer ───────────────────────────────────────────────────
function renderBlock(block: ContentBlock, index: number, ctx: BlockCtx) {
  switch (block.type) {
    case 'paragraph':
      return <p key={index} className="text-sport-gray leading-relaxed text-base mb-5">{block.text}</p>
    case 'heading':
      return <h2 key={index} className="text-2xl font-black text-sport-fg mt-10 mb-4 leading-snug">{block.text}</h2>
    case 'subheading':
      return <h3 key={index} className="text-lg font-bold text-sport-fg mt-7 mb-3 leading-snug">{block.text}</h3>
    case 'list':
      return (
        <ul key={index} className="mb-5 space-y-2">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-sport-gray text-base leading-relaxed">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-sport-orange flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      )
    case 'quote':
      return (
        <blockquote key={index} className="my-8 border-l-4 border-sport-orange pl-6 py-3 bg-sport-orange/5 rounded-r-xl">
          <p className="text-sport-fg font-semibold italic text-lg leading-relaxed">{block.text}</p>
        </blockquote>
      )
    case 'productCta':
      return <ProductCtaCard key={index} productSlug={block.productSlug} reason={block.reason} ctx={ctx} />
    default:
      return null
  }
}

// ─── Page Component ───────────────────────────────────────────────────────────
export default async function BlogPostPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params
  const post = getPostBySlugLocalized(slug, locale)
  if (!post) notFound()

  const t = await getTranslations('blog')
  const ctx: BlockCtx = { locale, recommendedLabel: t('recommendedProduct'), viewLabel: t('viewProduct') }

  const relatedPosts = getRelatedPostsLocalized(post.slug, locale, 3)
  const recommendedProducts = post.productSlugs
    .map(s => getProductBySlugLocalized(s, locale))
    .filter((p): p is NonNullable<typeof p> => p !== undefined)

  const colorClass = CATEGORY_COLORS[post.category] ?? 'bg-sport-orange/10 text-sport-orange border-sport-orange/20'

  // Lien interne contextuel vers la discipline liée à la catégorie de l'article.
  const disciplineSlug = CATEGORY_DISCIPLINE[post.category]
  const disciplineMeta = disciplineSlug ? getDisciplineMeta(disciplineSlug, locale) : undefined

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.metaTitle,
    description: post.metaDescription,
    image: [post.coverImage],
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: { '@type': 'Person', name: post.author },
    publisher: { '@type': 'Organization', name: 'Xenotif®', logo: { '@type': 'ImageObject', url: 'https://xenotif.com/og-image.jpg' } },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE}/blog/${post.slug}` },
    keywords: post.keywords.join(', '),
    articleSection: post.category,
    inLanguage: locale === 'en' ? 'en-US' : 'fr-FR',
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: t('breadcrumbHome'), item: SITE },
      { '@type': 'ListItem', position: 2, name: t('breadcrumbBlog'), item: `${SITE}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: `${SITE}/blog/${post.slug}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="min-h-screen bg-sport-dark">
        {/* Breadcrumb */}
        <nav aria-label={t('breadcrumbAria')} className="border-b border-sport-border">
          <div className="max-w-4xl mx-auto px-6 py-3 flex items-center gap-2 text-sm text-sport-gray">
            <Link href="/" className="hover:text-sport-fg transition-colors">{t('breadcrumbHome')}</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-sport-fg transition-colors">{t('breadcrumbBlog')}</Link>
            <span>/</span>
            <span className="text-sport-fg truncate max-w-xs">{t(`categories.${post.category}`)}</span>
          </div>
        </nav>

        {/* Article Header */}
        <header className="max-w-4xl mx-auto px-6 pt-10 pb-6">
          <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full border mb-4 ${colorClass}`}>
            {t(`categories.${post.category}`)}
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-sport-fg leading-tight mb-6">{post.title}</h1>
          <p className="text-sport-gray text-lg leading-relaxed mb-6">{post.excerpt}</p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-sport-gray border-y border-sport-border py-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-sport-orange/20 flex items-center justify-center text-sport-orange font-black text-sm">{post.author.charAt(0)}</div>
              <span className="text-sport-fg font-semibold">{post.author}</span>
            </div>
            <span className="text-sport-border">|</span>
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, locale)}</time>
            <span className="text-sport-border">|</span>
            <span>{t('readingTimeLong', { minutes: post.readingMinutes })}</span>
          </div>
        </header>

        {/* Cover Image */}
        <div className="max-w-4xl mx-auto px-6 mb-10">
          <div className="relative rounded-2xl overflow-hidden h-72 md:h-96">
            <Image src={post.coverImage} alt={post.title} fill priority className="object-cover" style={{ objectPosition: post.coverPosition }} sizes="(max-width: 896px) 100vw, 896px" />
            <div className="absolute inset-0 bg-gradient-to-t from-sport-dark/40 via-transparent to-transparent" />
          </div>
        </div>

        {/* Article Content */}
        <article className="max-w-3xl mx-auto px-6 pb-10">
          {post.content.map((block, index) => renderBlock(block, index, ctx))}
        </article>

        {/* CTA conversion - essai gratuit (toutes les fiches) + lien interne discipline */}
        <section className="px-6 pb-14">
          <div className="max-w-3xl mx-auto rounded-3xl border border-sport-orange/30 bg-gradient-to-br from-sport-orange/15 via-sport-card to-sport-card p-8 md:p-10 text-center">
            <h2 className="text-2xl md:text-3xl font-black text-sport-fg mb-3">{t('cta.title')}</h2>
            <p className="text-sport-gray text-sm md:text-base leading-relaxed max-w-xl mx-auto mb-6">{t('cta.text')}</p>
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center gap-2 bg-sport-orange text-white px-7 py-3.5 rounded-full font-bold text-sm hover:bg-orange-600 active:scale-95 transition-all shadow-lg shadow-sport-orange/25"
            >
              {t('cta.button')}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <p className="text-[11px] text-sport-gray mt-3">{t('cta.note')}</p>
            {disciplineMeta && disciplineSlug && (
              <p className="mt-6 pt-6 border-t border-sport-border/60 text-sm">
                <Link href={`/disciplines/${disciplineSlug}`} className="inline-flex items-center gap-1.5 text-sport-orange font-bold hover:underline">
                  {t('cta.discipline', { name: disciplineMeta.title })}
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </p>
            )}
          </div>
        </section>

        {/* Recommended Products */}
        {recommendedProducts.length > 0 && (
          <section className="border-t border-sport-border py-14 px-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-black text-sport-fg mb-2">
                {t.rich('recommendedTitle', { o: (c) => <span className="text-sport-orange">{c}</span> })}
              </h2>
              <p className="text-sport-gray text-sm mb-8">{t('recommendedSubtitle')}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedProducts.map((product, i) => (
                  <ProductCard key={product.slug} product={product} index={i} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="border-t border-sport-border py-14 px-6 bg-sport-card/30">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-black text-sport-fg mb-8">
                {t.rich('relatedTitle', { o: (c) => <span className="text-sport-orange">{c}</span> })}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map(related => {
                  const relColor = CATEGORY_COLORS[related.category] ?? 'bg-sport-orange/10 text-sport-orange border-sport-orange/20'
                  return (
                    <Link key={related.slug} href={`/blog/${related.slug}`} className="group block overflow-hidden rounded-2xl border border-sport-border bg-sport-card hover:border-sport-orange/30 transition-all duration-300 hover:-translate-y-1">
                      <div className="relative h-44 overflow-hidden">
                        <Image src={related.coverImage} alt={related.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" style={{ objectPosition: related.coverPosition }} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                        <span className={`absolute top-3 left-3 text-xs font-bold px-2 py-0.5 rounded-full border ${relColor}`}>{t(`categories.${related.category}`)}</span>
                      </div>
                      <div className="p-4">
                        <h3 className="font-black text-sport-fg text-sm leading-snug mb-1 group-hover:text-sport-orange transition-colors line-clamp-2">{related.title}</h3>
                        <p className="text-sport-gray text-xs">{t('readingTime', { minutes: related.readingMinutes })} · {formatDate(related.publishedAt, locale)}</p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* Back to Blog */}
        <div className="border-t border-sport-border py-8 px-6 text-center">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sport-gray hover:text-sport-fg transition-colors text-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            {t('backToBlog')}
          </Link>
        </div>
      </div>
    </>
  )
}
