import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllPosts, getPostBySlug, getRelatedPosts } from '@/lib/blog/posts'
import type { ContentBlock } from '@/lib/blog/posts'
import { getProductBySlug, formatPrice } from '@/lib/boutique/products'
import { ProductCard } from '@/components/boutique/ProductCard'

// ─── Static Params ────────────────────────────────────────────────────────────
export async function generateStaticParams() {
  return getAllPosts().map(post => ({ slug: post.slug }))
}

// ─── Metadata ────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    keywords: post.keywords,
    alternates: { canonical: `https://xenotif.vercel.app/blog/${post.slug}` },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      type: 'article',
      url: `https://xenotif.vercel.app/blog/${post.slug}`,
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

// ─── Category Badge Colors ────────────────────────────────────────────────────
const CATEGORY_COLORS: Record<string, string> = {
  Musculation: 'bg-sport-orange/10 text-sport-orange border-sport-orange/20',
  Nutrition: 'bg-green-500/10 text-green-400 border-green-500/20',
  Running: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  HIIT: 'bg-red-500/10 text-red-400 border-red-500/20',
  Récupération: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Matériel: 'bg-lime-500/10 text-sport-lime border-lime-500/20',
}

function formatDateFR(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

// ─── ProductCta Mini Card ─────────────────────────────────────────────────────
function ProductCtaCard({
  productSlug,
  reason,
}: {
  productSlug: string
  reason: string
}) {
  const product = getProductBySlug(productSlug)
  if (!product) return null

  const href =
    product.isAffiliate && product.amazon
      ? product.amazon.affiliateUrl
      : `/boutique/${product.slug}`
  const isExternal = product.isAffiliate && !!product.amazon

  return (
    <div className="my-8 rounded-2xl border border-sport-orange/20 bg-sport-card overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        <div className="relative sm:w-44 h-44 sm:h-auto flex-shrink-0 bg-sport-border/20">
          {product.images[0] && (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
              sizes="176px"
            />
          )}
        </div>
        <div className="p-5 flex flex-col justify-between gap-3">
          <div>
            <span className="text-sport-orange text-xs font-bold uppercase tracking-wide">
              Produit recommandé
            </span>
            <h3 className="text-white font-black text-base mt-1 leading-snug">{product.name}</h3>
            <p className="text-sport-gray text-sm mt-2 leading-relaxed">{reason}</p>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sport-lime font-black text-xl">
              {formatPrice(product.price_cents)}
            </span>
            <a
              href={href}
              {...(isExternal
                ? { target: '_blank', rel: 'noopener noreferrer nofollow' }
                : {})}
              className="inline-flex items-center gap-2 px-4 py-2 bg-sport-orange text-white rounded-full text-sm font-bold hover:bg-orange-600 transition-all"
            >
              Voir le produit
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
function renderBlock(block: ContentBlock, index: number) {
  switch (block.type) {
    case 'paragraph':
      return (
        <p key={index} className="text-sport-gray leading-relaxed text-base mb-5">
          {block.text}
        </p>
      )
    case 'heading':
      return (
        <h2 key={index} className="text-2xl font-black text-white mt-10 mb-4 leading-snug">
          {block.text}
        </h2>
      )
    case 'subheading':
      return (
        <h3 key={index} className="text-lg font-bold text-white mt-7 mb-3 leading-snug">
          {block.text}
        </h3>
      )
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
        <blockquote
          key={index}
          className="my-8 border-l-4 border-sport-orange pl-6 py-3 bg-sport-orange/5 rounded-r-xl"
        >
          <p className="text-white font-semibold italic text-lg leading-relaxed">{block.text}</p>
        </blockquote>
      )
    case 'productCta':
      return (
        <ProductCtaCard key={index} productSlug={block.productSlug} reason={block.reason} />
      )
    default:
      return null
  }
}

// ─── Page Component ───────────────────────────────────────────────────────────
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const relatedPosts = getRelatedPosts(post.slug, 3)
  const recommendedProducts = post.productSlugs
    .map(s => getProductBySlug(s))
    .filter((p): p is NonNullable<typeof p> => p !== undefined)

  const colorClass =
    CATEGORY_COLORS[post.category] ?? 'bg-sport-orange/10 text-sport-orange border-sport-orange/20'

  // ── JSON-LD Schemas ──
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.metaTitle,
    description: post.metaDescription,
    image: [post.coverImage],
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Xenotif®',
      logo: {
        '@type': 'ImageObject',
        url: 'https://xenotif.vercel.app/og-image.jpg',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://xenotif.vercel.app/blog/${post.slug}`,
    },
    keywords: post.keywords.join(', '),
    articleSection: post.category,
    inLanguage: 'fr-FR',
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Accueil',
        item: 'https://xenotif.vercel.app',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: 'https://xenotif.vercel.app/blog',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `https://xenotif.vercel.app/blog/${post.slug}`,
      },
    ],
  }

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="min-h-screen bg-sport-dark">
        {/* Breadcrumb */}
        <nav aria-label="Fil d'Ariane" className="border-b border-sport-border">
          <div className="max-w-4xl mx-auto px-6 py-3 flex items-center gap-2 text-sm text-sport-gray">
            <Link href="/" className="hover:text-white transition-colors">
              Accueil
            </Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-white transition-colors">
              Blog
            </Link>
            <span>/</span>
            <span className="text-white truncate max-w-xs">{post.category}</span>
          </div>
        </nav>

        {/* Article Header */}
        <header className="max-w-4xl mx-auto px-6 pt-10 pb-6">
          <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full border mb-4 ${colorClass}`}>
            {post.category}
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-6">
            {post.title}
          </h1>
          <p className="text-sport-gray text-lg leading-relaxed mb-6">{post.excerpt}</p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-sport-gray border-y border-sport-border py-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-sport-orange/20 flex items-center justify-center text-sport-orange font-black text-sm">
                {post.author.charAt(0)}
              </div>
              <span className="text-white font-semibold">{post.author}</span>
            </div>
            <span className="text-sport-border">|</span>
            <time dateTime={post.publishedAt}>{formatDateFR(post.publishedAt)}</time>
            <span className="text-sport-border">|</span>
            <span>{post.readingMinutes} min de lecture</span>
          </div>
        </header>

        {/* Cover Image */}
        <div className="max-w-4xl mx-auto px-6 mb-10">
          <div className="relative rounded-2xl overflow-hidden h-72 md:h-96">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 896px) 100vw, 896px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-sport-dark/40 via-transparent to-transparent" />
          </div>
        </div>

        {/* Article Content */}
        <article className="max-w-3xl mx-auto px-6 pb-14">
          {post.content.map((block, index) => renderBlock(block, index))}
        </article>

        {/* Recommended Products */}
        {recommendedProducts.length > 0 && (
          <section className="border-t border-sport-border py-14 px-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-black text-white mb-2">
                Produits <span className="text-sport-orange">Recommandés</span>
              </h2>
              <p className="text-sport-gray text-sm mb-8">
                Sélectionnés par nos experts en lien avec cet article.
              </p>
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
              <h2 className="text-2xl font-black text-white mb-8">
                Articles <span className="text-sport-orange">Similaires</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map(related => {
                  const relColor =
                    CATEGORY_COLORS[related.category] ??
                    'bg-sport-orange/10 text-sport-orange border-sport-orange/20'
                  return (
                    <Link
                      key={related.slug}
                      href={`/blog/${related.slug}`}
                      className="group block overflow-hidden rounded-2xl border border-sport-border bg-sport-card hover:border-sport-orange/30 transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="relative h-44 overflow-hidden">
                        <Image
                          src={related.coverImage}
                          alt={related.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <span
                          className={`absolute top-3 left-3 text-xs font-bold px-2 py-0.5 rounded-full border ${relColor}`}
                        >
                          {related.category}
                        </span>
                      </div>
                      <div className="p-4">
                        <h3 className="font-black text-white text-sm leading-snug mb-1 group-hover:text-sport-orange transition-colors line-clamp-2">
                          {related.title}
                        </h3>
                        <p className="text-sport-gray text-xs">
                          {related.readingMinutes} min · {formatDateFR(related.publishedAt)}
                        </p>
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
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sport-gray hover:text-white transition-colors text-sm"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Retour au Blog
          </Link>
        </div>
      </div>
    </>
  )
}
