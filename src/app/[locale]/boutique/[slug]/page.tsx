import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PRODUCTS, formatPrice } from '@/lib/boutique/products'
import { getProductBySlugLocalized } from '@/lib/boutique/products.en'
import { ProductDetail } from './ProductDetail'

const SITE = 'https://xenotif.com'

// Pré-génère les fiches en HTML statique → crawlables + rapides.
export function generateStaticParams() {
  return PRODUCTS.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }): Promise<Metadata> {
  const { slug, locale } = await params
  const product = getProductBySlugLocalized(slug, locale)
  if (!product) return {}

  // Titre court : le template du layout ajoute « | Xenotif® ». Le prix dans le
  // titre améliore le taux de clic depuis Google.
  const title = `${product.name} — ${formatPrice(product.price_cents)}`
  const description = product.description
  const path = `/boutique/${product.slug}`
  const languages: Record<string, string> = {
    fr: `${SITE}${path}`,
    en: `${SITE}/en${path}`,
    de: `${SITE}/de${path}`,
    'x-default': `${SITE}${path}`,
  }

  return {
    title,
    description,
    alternates: { canonical: languages[locale] ?? languages.fr, languages },
    openGraph: {
      title: `${product.name} | Xenotif®`,
      description,
      type: 'website',
      url: languages[locale] ?? languages.fr,
      images: product.images[0] ? [{ url: product.images[0], alt: product.name }] : [],
    },
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params
  const product = getProductBySlugLocalized(slug, locale)
  if (!product) notFound()

  // Données structurées Produit → rich snippets Google (prix, étoiles, stock).
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images,
    description: product.description,
    sku: product.id,
    brand: { '@type': 'Brand', name: product.brand },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviews,
    },
    offers: {
      '@type': 'Offer',
      url: `${SITE}/boutique/${product.slug}`,
      priceCurrency: 'EUR',
      price: (product.price_cents / 100).toFixed(2),
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProductDetail product={product} />
    </>
  )
}
